/**
 * Fonction serverless Vercel : POST /api/devis
 * Envoie la demande de devis par e-mail via Resend (https://resend.com).
 * Variables (côté serveur uniquement, jamais préfixées PUBLIC_) : RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL.
 *
 * Protections :
 *  - méthode POST + Content-Type JSON uniquement, corps limité à 20 ko ;
 *  - origine vérifiée (même domaine que le site ou SITE_URL) ;
 *  - champ piège `site_web` ; limitation de débit par IP (5 / 10 min, mémoire de l'instance :
 *    protection de base, à compléter par le pare-feu Vercel si le spam augmente) ;
 *  - validation stricte : champs obligatoires, listes fermées, longueurs maximales, e-mail, téléphone ;
 *  - échappement HTML du contenu et suppression des retours à la ligne dans l'objet de l'e-mail ;
 *  - réponses génériques : aucun détail interne (clé, erreur du fournisseur) n'est renvoyé au navigateur.
 */
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_BODY_BYTES = 20_000;

const LIMITS = {
  nom: 120, telephone: 30, email: 160, ville: 80, structure: 80, nature: 20, surface: 7,
  calendrier: 40, financement: 80, message: 3000, page: 200, consentement: 10, site_web: 200,
};
const REQUIRED = ['nom', 'telephone', 'email', 'ville', 'structure', 'nature', 'consentement'];
const NATURES = ['Création', 'Rénovation', 'Extension'];
const CALENDRIERS = ['', 'Dans les 3 mois', 'Dans 3 à 6 mois', 'Dans 6 à 12 mois', 'Plus tard / à définir'];

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const oneLine = (s) => String(s ?? '').replace(/[\r\n\t]+/g, ' ').trim();

function allowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    const host = new URL(origin).host;
    const allowed = new Set([req.headers.host, process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL]);
    if (process.env.SITE_URL) allowed.add(new URL(process.env.SITE_URL).host);
    return allowed.has(host);
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  if (!String(req.headers['content-type'] || '').includes('application/json')) {
    return res.status(415).json({ ok: false });
  }
  if (Number(req.headers['content-length'] || 0) > MAX_BODY_BYTES) {
    return res.status(413).json({ ok: false });
  }
  if (!allowedOrigin(req)) return res.status(403).json({ ok: false });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return res.status(429).json({ ok: false, error: 'rate_limited' });
  hits.set(ip, [...recent, now]);
  if (hits.size > 5000) hits.clear();

  let body = req.body;
  if (typeof body === 'string') {
    if (body.length > MAX_BODY_BYTES) return res.status(413).json({ ok: false });
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ ok: false });

  // Champ piège rempli : on répond OK sans rien envoyer.
  if (body.site_web) return res.status(200).json({ ok: true });

  // Ne garder que les champs attendus, en texte, tronqués.
  const data = {};
  for (const [k, max] of Object.entries(LIMITS)) data[k] = String(body[k] ?? '').trim().slice(0, max);

  const missing = REQUIRED.filter((k) => !data[k]);
  if (missing.length) return res.status(400).json({ ok: false, error: 'missing', fields: missing });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) return res.status(400).json({ ok: false, error: 'email' });
  if (!/^[+\d][\d\s().-]{5,}$/.test(data.telephone)) return res.status(400).json({ ok: false, error: 'telephone' });
  if (!NATURES.includes(data.nature)) return res.status(400).json({ ok: false, error: 'nature' });
  if (!CALENDRIERS.includes(data.calendrier)) return res.status(400).json({ ok: false, error: 'calendrier' });
  if (!/^[a-z0-9-]{2,80}$/.test(data.structure)) return res.status(400).json({ ok: false, error: 'structure' });
  if (data.surface && !/^\d{1,6}$/.test(data.surface)) return res.status(400).json({ ok: false, error: 'surface' });

  const { RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !QUOTE_TO_EMAIL || !QUOTE_FROM_EMAIL) {
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }

  const fields = ['nom', 'telephone', 'email', 'ville', 'structure', 'nature', 'surface', 'calendrier', 'financement', 'message', 'page'];
  const rows = fields
    .map((k) => `<tr><th align="left" style="padding:4px 12px 4px 0">${k}</th><td>${esc(data[k])}</td></tr>`)
    .join('');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: QUOTE_FROM_EMAIL,
        to: QUOTE_TO_EMAIL.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: data.email,
        subject: oneLine(`Demande de devis — ${data.structure} — ${data.ville}`).slice(0, 200),
        html: `<h2>Nouvelle demande de devis</h2><table>${rows}</table>`,
      }),
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: 'mail_failed' });
  } catch {
    return res.status(502).json({ ok: false, error: 'mail_failed' });
  }
  return res.status(200).json({ ok: true });
}
