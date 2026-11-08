/**
 * Génère l'identité Euro Space Medical (logo choisi le 2026-11-08 : monogramme ESM dégradé navy → teal,
 * toiture or au-dessus, arc or en dessous) en fichiers autonomes, texte vectorisé, aucune police requise :
 *   src/data/logo.json    géométrie du symbole, partagée avec le composant Logo.astro
 *   public/brand/         logo horizontal, vertical, symbole — couleur, navy, blanc, monochrome
 *   public/favicon.svg, public/icons/*.png
 *   public/og/*.png       images de partage 1200×630 (photo + voile navy + logo + titre)
 * Usage : npm run brand
 */
import opentype from 'opentype.js';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const C = { navy: '#142C43', teal: '#168C91', gold: '#C6A66B', goldInk: '#9C7B42', white: '#FFFFFF', black: '#000000' };
const font = (w) => opentype.parse(readFileSync(`node_modules/@fontsource/manrope/files/manrope-latin-${w}-normal.woff`).buffer);
const F800 = font(800);
const F700 = font(700);
const F600 = font(600);

/** Texte → chemin SVG avec interlettrage (en em). Renvoie { d, width }. */
function text(f, str, x, y, size, tracking = 0) {
  let cx = x;
  const parts = [];
  const glyphs = f.stringToGlyphs(str);
  glyphs.forEach((g, i) => {
    parts.push(g.getPath(cx, y, size).toPathData(2));
    cx += (g.advanceWidth / f.unitsPerEm) * size;
    if (i < glyphs.length - 1) cx += (f.getKerningValue(g, glyphs[i + 1]) / f.unitsPerEm) * size + tracking * size;
  });
  return { d: parts.join(''), width: cx - x };
}
/** Interlettrage nécessaire pour que `str` occupe exactement `width`. */
function fit(f, str, size, width) {
  const natural = text(f, str, 0, 0, size, 0).width;
  return (width - natural) / ((str.length - 1) * size);
}

// ---------- Géométrie du symbole (viewBox 0 0 132 92) ----------
const geometry = {
  viewBox: '0 0 132 92',
  width: 132,
  height: 92,
  letters: text(F800, 'ESM', 0, 0, 52, -0.01).d,
  lettersTransform: 'translate(4 70) scale(1.08 1)',
  roof: 'M50 28L82 7l32 21M58 28l24-15.5L106 28',
  chimney: 'M96 10.5V3h5v11',
  swoosh: 'M2 74C30 94 86 94 126 60 88 86 32 88 2 74Z',
};


const tones = {
  color: { a: C.navy, b: C.teal, roof: C.gold, word: C.navy, tag: C.goldInk },
  navy: { a: C.navy, b: C.navy, roof: C.navy, word: C.navy, tag: C.navy },
  white: { a: C.white, b: C.white, roof: C.gold, word: C.white, tag: C.gold },
  mono: { a: C.black, b: C.black, roof: C.black, word: C.black, tag: C.black },
};

/** Symbole positionné ; `id` unique pour le dégradé. */
function symbol(tone, tx = 0, ty = 0, scale = 1, id = 'esm') {
  const t = tones[tone];
  return `<g transform="translate(${tx} ${ty}) scale(${scale})">
<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${t.a}"/><stop offset="0.5" stop-color="${t.b}"/><stop offset="1" stop-color="${t.a}"/></linearGradient></defs>
<g transform="${geometry.lettersTransform}"><path d="${geometry.letters}" fill="url(#${id})"/></g>
<path d="${geometry.roof}" fill="none" stroke="${t.roof}" stroke-width="3.2"/>
<path d="${geometry.chimney}" fill="none" stroke="${t.roof}" stroke-width="3.2"/>
<path d="${geometry.swoosh}" fill="${t.roof}"/>
</g>`;
}

/** Bloc texte « EURO SPACE / MEDICAL / DESIGNING MEDICAL SPACES. » aligné sur une même largeur. */
function wordmark(tone, x, y, size, align = 'left', boxWidth = 0) {
  const t = tones[tone];
  const l1 = 'EURO SPACE';
  const w = text(F800, l1, 0, 0, size, 0.04).width;
  const ox = align === 'center' ? x + (boxWidth - w) / 2 : x;
  const line1 = text(F800, l1, ox, y, size, 0.04);
  const line2 = text(F800, 'MEDICAL', ox, y + size * 1.05, size, fit(F800, 'MEDICAL', size, w));
  const tagSize = size * 0.4;
  const tag = text(F600, 'DESIGNING MEDICAL SPACES.', ox, y + size * 1.05 + tagSize * 2.1, tagSize, fit(F600, 'DESIGNING MEDICAL SPACES.', tagSize, w));
  return { svg: `<path d="${line1.d}${line2.d}" fill="${t.word}"/><path d="${tag.d}" fill="${t.tag}"/>`, width: w };
}

// Géométrie partagée avec Logo.astro (symbole + nom vectorisé, origine 0,0, corps 20)
{
  const size = 20;
  const l1 = text(F800, 'EURO SPACE', 0, size * 0.74, size, 0.04);
  const w = l1.width;
  const l2 = text(F800, 'MEDICAL', 0, size * 0.74 + size * 1.05, size, fit(F800, 'MEDICAL', size, w));
  const tagSize = size * 0.4;
  const tagY = size * 0.74 + size * 1.05 + tagSize * 2.1;
  const tag = text(F600, 'DESIGNING MEDICAL SPACES.', 0, tagY, tagSize, fit(F600, 'DESIGNING MEDICAL SPACES.', tagSize, w));
  geometry.wordmark = { name: l1.d + l2.d, nameOnly: { width: Math.ceil(w), height: Math.ceil(size * 0.74 + size * 1.05 + 1) }, tag: tag.d, width: Math.ceil(w), height: Math.ceil(tagY + 2) };
  mkdirSync('src/data', { recursive: true });
  writeFileSync('src/data/logo.json', JSON.stringify(geometry, null, 2) + '\n');
}

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

mkdirSync('public/brand', { recursive: true });
mkdirSync('public/icons', { recursive: true });
mkdirSync('public/og', { recursive: true });

function horizontal(tone) {
  const s = 0.62; // symbole : 82 × 57
  const wm = wordmark(tone, 98, 22, 20);
  return svg(Math.ceil(98 + wm.width + 4), 62, symbol(tone, 2, 2, s, `h-${tone}`) + wm.svg, 'Euro Space Medical');
}
function vertical(tone) {
  const box = 200;
  const wm = wordmark(tone, 0, 122, 22, 'center', box);
  return svg(box, 170, symbol(tone, (box - 132) / 2, 4, 1, `v-${tone}`) + wm.svg, 'Euro Space Medical');
}

const files = {
  'esm-logo-horizontal.svg': horizontal('color'),
  'esm-logo-horizontal-navy.svg': horizontal('navy'),
  'esm-logo-horizontal-white.svg': horizontal('white'),
  'esm-logo-horizontal-mono.svg': horizontal('mono'),
  'esm-logo-vertical.svg': vertical('color'),
  'esm-logo-vertical-white.svg': vertical('white'),
  'esm-logo-vertical-mono.svg': vertical('mono'),
  'esm-symbol.svg': svg(136, 96, symbol('color', 2, 2, 1, 's-color'), 'ESM'),
  'esm-symbol-navy.svg': svg(136, 96, symbol('navy', 2, 2, 1, 's-navy'), 'ESM'),
  'esm-symbol-white.svg': svg(136, 96, symbol('white', 2, 2, 1, 's-white'), 'ESM'),
  'esm-symbol-mono.svg': svg(136, 96, symbol('mono', 2, 2, 1, 's-mono'), 'ESM'),
};
for (const [n, s] of Object.entries(files)) writeFileSync(`public/brand/${n}`, s);

// Favicon et icônes : symbole blanc et or sur carré navy
const appIcon = (size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="${C.navy}"/>${symbol('white', 5, 11, 0.41, 'icon')}</svg>`;
writeFileSync('public/favicon.svg', appIcon(64));
await sharp(Buffer.from(appIcon(512))).png().toFile('public/icons/logo-512.png');
await sharp(Buffer.from(appIcon(180))).png().toFile('public/icons/apple-touch-icon.png');

// Images de partage 1200×630 : photo + voile navy + logo blanc + titre
const ogPages = {
  default: { photo: 'hall-clinique', lines: ['Des espaces conçus', 'pour mieux soigner.'], sub: 'Votre projet médical, de A à Z.' },
  amenagement: { photo: 'cabinet-dentaire', lines: ['Aménagement de', 'cabinet médical'], sub: 'Étude · Conception · Travaux · Équipement' },
  renovation: { photo: 'chantier-amenagement', lines: ['Rénover sans', 'interrompre vos soins'], sub: 'Rénovation en site occupé' },
};
for (const [name, p] of Object.entries(ogPages)) {
  const bg = await sharp(`src/assets/photos/${p.photo}.jpg`).resize(1200, 630, { fit: 'cover' }).toBuffer();
  const wm = wordmark('white', 190, 92, 24);
  const title = p.lines.map((l, i) => text(F700, l, 72, 340 + i * 76, 64, -0.02).d).join('');
  const sub = text(F600, p.sub, 72, 340 + p.lines.length * 76 + 18, 24, 0);
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${C.navy}" stop-opacity="0.95"/><stop offset="0.62" stop-color="${C.navy}" stop-opacity="0.8"/><stop offset="1" stop-color="${C.navy}" stop-opacity="0.15"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>${symbol('white', 66, 62, 0.9, 'og')}${wm.svg}
<rect x="72" y="236" width="56" height="3" fill="${C.gold}"/>
<path d="${title}" fill="${C.white}"/><path d="${sub.d}" fill="${C.white}" fill-opacity="0.85"/></svg>`;
  await sharp(bg).composite([{ input: Buffer.from(overlay) }]).png({ compressionLevel: 9 }).toFile(`public/og/${name}.png`);
}
console.log('Identité générée : src/data/logo.json, public/brand, favicon, icônes, images de partage.');
