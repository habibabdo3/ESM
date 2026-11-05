/**
 * Configuration centrale d'Euro Space Medical.
 * Toute coordonnée absente reste `null` : le site affiche alors le marqueur
 * visible « [À COMPLÉTER : …] » et `npm run audit:strict` échoue.
 * Les valeurs se renseignent via les variables d'environnement (voir .env.example).
 */
const env = import.meta.env;
const val = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

export const TODO = (label: string) => `[À COMPLÉTER : ${label}]`;

export const site = {
  name: 'Euro Space Medical',
  shortName: 'ESM',
  tagline: 'Aménagement, rénovation et équipement de structures médicales',
  promise:
    'Nous concevons, rénovons et équipons les cabinets, cliniques et centres médicaux, sans interrompre votre activité et dans le respect des exigences de votre spécialité.',
  locale: 'fr_MA',
  lang: 'fr',
  hq: 'Casablanca',
  country: 'MA',
  phone: val(env.PUBLIC_PHONE),
  email: val(env.PUBLIC_EMAIL),
  whatsapp: val(env.PUBLIC_WHATSAPP),
  address: val(env.PUBLIC_ADDRESS),
  instagram: val(env.PUBLIC_INSTAGRAM_URL),
  facebook: val(env.PUBLIC_FACEBOOK_URL),
  plausibleDomain: val(env.PUBLIC_PLAUSIBLE_DOMAIN),
  metaPixelId: val(env.PUBLIC_META_PIXEL_ID),
} as const;

/** Mentions bancaires (noms, logos, délais) masquées tant que la banque n'a pas validé par écrit. */
export const bankClaimsApproved =
  (env.BANK_CLAIMS_APPROVED ?? process.env.BANK_CLAIMS_APPROVED) === 'true';

export const BANK_DISCLAIMER = 'Sous réserve d’acceptation du dossier par la banque.';

export function whatsappLink(message: string): string | null {
  if (!site.whatsapp) return null;
  return `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
