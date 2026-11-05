import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { existsSync, readdirSync } from 'node:fs';

/** Vrai si le dossier contient au moins une entrée publiable (fichiers « _ » ignorés). */
const hasEntries = (dir: string) =>
  existsSync(dir) && readdirSync(dir).some((f) => /\.mdx?$/.test(f) && !f.startsWith('_'));
const emptyLoader = { name: 'empty-loader', load: async () => {} };

const faq = z.array(z.object({ q: z.string(), a: z.string() })).default([]);
const seoTitle = z.string().max(60);
const seoDescription = z.string().min(140).max(155);

const services = defineCollection({
  loader: file('src/data/services.json'),
  schema: z.object({
    order: z.number(),
    short: z.string(),
    title: seoTitle,
    description: seoDescription,
    h1: z.string(),
    intro: z.string(),
    livrables: z.array(z.string()).min(3),
    cta: z.string(),
    specialitesLiees: z.array(z.string()).default([]),
    termes: z.array(z.string()).default([]),
    savoirFaire: z.array(z.object({ t: z.string(), p: z.string() })).default([]),
    faq,
    note: z.string().optional(),
  }),
});

const specialites = defineCollection({
  loader: file('src/data/specialites.json'),
  schema: z.object({
    order: z.number(),
    short: z.string(),
    title: seoTitle,
    description: seoDescription,
    h1: z.string(),
    intro: z.string(),
    contraintes: z.array(z.string()).min(2),
    offre: z.array(z.string()).min(2),
    aValider: z.array(z.string()).min(1),
    motsCles: z.array(z.string()).min(1),
    servicesLies: z.array(z.string()).min(3),
    lexique: z.array(z.object({ terme: z.string(), definition: z.string() })).default([]),
    faq,
    cta: z.string(),
  }),
});

const regions = defineCollection({
  loader: file('src/data/regions.json'),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    title: seoTitle,
    description: seoDescription,
    h1: z.string(),
    villes: z.array(z.string()).min(1),
    phase: z.enum(['1', '2', '3']),
    intro: z.string(),
    contexte: z.string(),
    priorites: z.array(z.string()).min(2),
  }),
});

const realisations = defineCollection({
  loader: hasEntries('./src/content/realisations')
    ? glob({ pattern: ['**/*.{md,mdx}', '!**/_*'], base: './src/content/realisations' })
    : emptyLoader,
  schema: ({ image }) =>
    z.object({
      title: seoTitle,
      description: seoDescription,
      specialite: z.string(),
      ville: z.string(),
      surface: z.number().positive(),
      duree: z.string(),
      lots: z.array(z.string()).min(1),
      defi: z.string(),
      solution: z.string(),
      avant: image(),
      apres: image(),
      galerie: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      temoignage: z
        .object({ texte: z.string(), auteur: z.string(), accordEcrit: z.literal(true) })
        .optional(),
      date: z.coerce.date(),
      draft: z.boolean().default(false),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: seoTitle,
    description: seoDescription,
    h1: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(true),
    servicesLies: z.array(z.string()).default([]),
  }),
});

export const collections = { services, specialites, regions, realisations, blog };
