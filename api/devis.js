/**
 * Fonction serverless Vercel : POST /api/devis
 * Envoie la demande de devis par e-mail via Resend (https://resend.com).
 * Variables : RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL (jamais dans le dépôt).
 * Anti-spam : champ piège `site_web` + limitation de débit par IP (mémoire de l'instance).
 */
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const REQUIRED = ['nom', 'telephone', 'email', 'ville', 'structure', 'nature', 'consentement'];

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return res.status(429).json({ ok: false, error: 'rate_limited' });
  hits.set(ip, [...recent, now]);

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Champ piège rempli : on répond OK sans rien envoyer.
  if (body.site_web) return res.status(200).json({ ok: true });

  const missing = REQUIRED.filter((k) => !String(body[k] ?? '').trim());
  if (missing.length) return res.status(400).json({ ok: false, error: 'missing', fields: missing });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email))) return res.status(400).json({ ok: false, error: 'email' });

  const { RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !QUOTE_TO_EMAIL || !QUOTE_FROM_EMAIL) {
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }

  const fields = ['nom', 'telephone', 'email', 'ville', 'structure', 'nature', 'surface', 'calendrier', 'financement', 'message', 'page'];
  const rows = fields
    .map((k) => `<tr><th align="left" style="padding:4px 12px 4px 0">${k}</th><td>${esc(body[k]).slice(0, 4000)}</td></tr>`)
    .join('');

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: QUOTE_FROM_EMAIL,
      to: QUOTE_TO_EMAIL.split(',').map((s) => s.trim()),
      reply_to: String(body.email),
      subject: `Demande de devis — ${String(body.structure).slice(0, 80)} — ${String(body.ville).slice(0, 80)}`,
      html: `<h2>Nouvelle demande de devis</h2><table>${rows}</table>`,
    }),
  });
  if (!r.ok) return res.status(502).json({ ok: false, error: 'mail_failed' });
  return res.status(200).json({ ok: true });
}
