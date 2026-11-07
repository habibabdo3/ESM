import { getCollection, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>;
export type Specialite = CollectionEntry<'specialites'>;
export type Region = CollectionEntry<'regions'>;

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export async function getServices() {
  return (await getCollection('services')).sort(byOrder);
}
export async function getSpecialites() {
  return (await getCollection('specialites')).sort(byOrder);
}
export async function getRegions() {
  return (await getCollection('regions')).sort(byOrder);
}
/** Évite l'avertissement « collection vide » tant qu'aucune réalisation n'est publiée. */
const realisationFiles = Object.keys(import.meta.glob(['/src/content/realisations/**/*.{md,mdx}', '!**/_*']));
export const hasRealisationFiles = realisationFiles.length > 0;

export async function getRealisations() {
  if (!hasRealisationFiles) return [];
  return (await getCollection('realisations', (e) => !e.data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}
export async function getPosts() {
  return (await getCollection('blog', (e) => import.meta.env.DEV || !e.data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export const servicePath = (id: string) => `/services/${id}/`;
export const specialitePath = (id: string) => `/specialites/${id}/`;
export const regionPath = (id: string) => `/amenagement-cabinet-medical/${id}/`;
export const realisationPath = (id: string) => `/realisations/${id}/`;
export const postPath = (id: string) => `/blog/${id}/`;

export const pad = (n: number) => String(n).padStart(2, '0');

/** Découpe un texte en paragraphes courts (n phrases max) pour la lisibilité. */
export function paragraphs(text: string, n = 2): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g)?.map((s) => s.trim()) ?? [text];
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += n) out.push(sentences.slice(i, i + n).join(' '));
  return out;
}
