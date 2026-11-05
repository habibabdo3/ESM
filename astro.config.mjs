// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, existsSync } from 'node:fs';

const site =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://euro-space-medical.vercel.app');

const bankApproved = (process.env.BANK_CLAIMS_APPROVED ?? 'true') !== 'false';
const realisationsDir = new URL('./src/content/realisations/', import.meta.url);
const hasRealisations =
  existsSync(realisationsDir) &&
  readdirSync(realisationsDir).some((f) => /\.mdx?$/.test(f) && !f.startsWith('_'));

/** Pages exclues du sitemap (noindex). Garder en phase avec src/lib/seo.ts */
const noindex = [
  '/styleguide/',
  '/404/',
  ...(hasRealisations ? [] : ['/realisations/']),
  ...(bankApproved ? [] : ['/financement/al-barid-bank/', '/financement/bank-al-yousr/']),
];

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !noindex.some((p) => new URL(page).pathname === p),
      i18n: undefined,
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
