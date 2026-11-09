/**
 * Mesure des conversions pour les campagnes (Meta) et les statistiques (Plausible).
 *
 * Consentement (loi 09-08) : rien n'est envoyé tant que le visiteur n'a pas accepté la catégorie concernée.
 * `fbq` n'existe que si « Publicité » est acceptée, `plausible` que si « Mesure d'audience » l'est (CookieBanner).
 *
 * Événements :
 *  - Lead    : demande de devis envoyée avec succès (déclenché une seule fois sur /merci/) ;
 *  - Contact : clic sur WhatsApp, téléphone ou e-mail (délégation sur tout le site).
 * Chaque Lead porte un `eventID` unique, transmis aussi au formulaire : il permettra de dédoublonner avec l'API
 * Conversions de Meta si elle est branchée plus tard côté serveur (api/devis.js).
 *
 * Attribution : les paramètres de campagne (utm_*, fbclid) de l'adresse d'arrivée sont gardés le temps de la
 * session (sessionStorage, aucun cookie) et joints à la demande de devis, pour savoir quelle annonce l'a générée.
 */
type Params = Record<string, string | number>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    plausible?: (event: string, options?: { props?: Params }) => void;
  }
}

export function track(event: 'Lead' | 'Contact', params: Params = {}, eventId?: string) {
  try {
    if (typeof window.fbq === 'function') window.fbq('track', event, params, eventId ? { eventID: eventId } : undefined);
  } catch {
    /* le suivi ne doit jamais bloquer la page */
  }
  try {
    if (typeof window.plausible === 'function') window.plausible(event, { props: params });
  } catch {
    /* idem */
  }
}

export const newEventId = () =>
  (crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`).slice(0, 64);

/* ---------- Attribution des campagnes ---------- */
const ATTR_KEY = 'esm-attr';
export const ATTR_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;

export function captureAttribution() {
  try {
    const q = new URLSearchParams(location.search);
    const found: Record<string, string> = {};
    for (const k of ATTR_FIELDS) {
      const v = q.get(k);
      if (v) found[k] = v.slice(0, k === 'fbclid' ? 300 : 100);
    }
    // Une nouvelle visite issue d'une annonce remplace la précédente (dernier clic payant de la session)
    if (Object.keys(found).length) sessionStorage.setItem(ATTR_KEY, JSON.stringify({ ...found, landing: location.pathname }));
  } catch {
    /* navigation privée : pas d'attribution, le formulaire fonctionne quand même */
  }
}

export function getAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) || '{}');
  } catch {
    return {};
  }
}

/* ---------- Clics de contact direct ---------- */
export function initContactTracking() {
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      const method = /^(https:\/\/)?(wa\.me|api\.whatsapp\.com)\//.test(href)
        ? 'whatsapp'
        : href.startsWith('tel:')
          ? 'telephone'
          : href.startsWith('mailto:')
            ? 'email'
            : '';
      if (method) track('Contact', { method, page: location.pathname });
    },
    { capture: true },
  );
}

/* ---------- Lead : marqué à l'envoi, compté une seule fois sur /merci/ ---------- */
const LEAD_KEY = 'esm-lead';
export function markLead(eventId: string, structure: string) {
  try {
    sessionStorage.setItem(LEAD_KEY, JSON.stringify({ eventId, structure }));
  } catch {
    /* sans stockage : la page de remerciement s'affiche, sans comptage */
  }
}
export function consumeLead(): { eventId: string; structure: string } | null {
  try {
    const raw = sessionStorage.getItem(LEAD_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(LEAD_KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
