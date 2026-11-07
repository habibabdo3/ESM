/**
 * Génère l'identité Euro Space Medical en fichiers autonomes (texte vectorisé, aucune police requise) :
 *   public/brand/  logo horizontal, vertical, symbole — versions couleur, navy, blanche, monochrome
 *   public/favicon.svg, public/icons/*.png
 *   public/og/*.png  images de partage 1200×630 (photo + voile navy + logo + titre)
 * Usage : npm run brand
 */
import opentype from 'opentype.js';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const C = { navy: '#142C43', teal: '#168C91', gold: '#C6A66B', warm: '#F7F8F7', muted: '#5E6C77', white: '#FFFFFF', black: '#000000' };
const font = (w) => opentype.parse(readFileSync(`node_modules/@fontsource/manrope/files/manrope-latin-${w}-normal.woff`).buffer);
const F700 = font(700);
const F600 = font(600);

/** Texte → chemin SVG avec interlettrage (tracking en em). Renvoie { d, width }. */
function text(f, str, x, y, size, tracking = 0) {
  let cx = x;
  const parts = [];
  const glyphs = f.stringToGlyphs(str);
  glyphs.forEach((g, i) => {
    parts.push(g.getPath(cx, y, size).toPathData(2));
    cx += (g.advanceWidth / f.unitsPerEm) * size;
    if (i < glyphs.length - 1) {
      const kern = f.getKerningValue(g, glyphs[i + 1]);
      cx += (kern / f.unitsPerEm) * size + tracking * size;
    }
  });
  return { d: parts.join(''), width: cx - x };
}

/** Symbole 48×48 : cadre-plan ouvert (entrée), monogramme E·S·M, ligne de cote. */
function symbol(ink, accent, tx = 0, ty = 0, scale = 1) {
  return `<g transform="translate(${tx} ${ty}) scale(${scale})" fill="none" stroke-linecap="square">
  <path d="M46.9 30V1.1H1.1v45.8h45.8v-9" stroke="${ink}" stroke-width="2.2"/>
  <path d="M16 12H8v20h8M8 22h6M28 12h-8v10h8v10h-8M32 32V12l4 6.5 4-6.5v20" stroke="${ink}" stroke-width="2.4"/>
  <path d="M8 39h32M8 36.5v5M40 36.5v5" stroke="${accent}" stroke-width="1.6"/>
</g>`;
}

const tones = {
  color: { ink: C.navy, accent: C.teal, sub: C.muted },
  navy: { ink: C.navy, accent: C.navy, sub: C.navy },
  white: { ink: C.white, accent: C.gold, sub: C.white },
  mono: { ink: C.black, accent: C.black, sub: C.black },
};

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

mkdirSync('public/brand', { recursive: true });
mkdirSync('public/icons', { recursive: true });
mkdirSync('public/og', { recursive: true });

function horizontal(tone) {
  const t = tones[tone];
  const name = text(F700, 'EURO SPACE MEDICAL', 64, 30, 19, 0.16);
  const tag = text(F600, 'DESIGNING MEDICAL SPACES.', 64, 50, 10.5, 0.2);
  const w = Math.ceil(Math.max(name.width, tag.width) + 72);
  return svg(w, 56, symbol(t.ink, t.accent, 4, 4, 1) + `<path d="${name.d}" fill="${t.ink}"/><path d="${tag.d}" fill="${t.sub}"/>`, 'Euro Space Medical');
}
function vertical(tone) {
  const t = tones[tone];
  const probe = text(F700, 'EURO SPACE MEDICAL', 0, 0, 19, 0.16);
  const probeTag = text(F600, 'DESIGNING MEDICAL SPACES.', 0, 0, 10.5, 0.2);
  const w = Math.ceil(Math.max(probe.width, probeTag.width) + 8);
  const name = text(F700, 'EURO SPACE MEDICAL', (w - probe.width) / 2, 112, 19, 0.16);
  const tag = text(F600, 'DESIGNING MEDICAL SPACES.', (w - probeTag.width) / 2, 134, 10.5, 0.2);
  return svg(w, 142, symbol(t.ink, t.accent, (w - 72) / 2, 4, 1.5) + `<path d="${name.d}" fill="${t.ink}"/><path d="${tag.d}" fill="${t.sub}"/>`, 'Euro Space Medical');
}

const files = {
  'esm-logo-horizontal.svg': horizontal('color'),
  'esm-logo-horizontal-navy.svg': horizontal('navy'),
  'esm-logo-horizontal-white.svg': horizontal('white'),
  'esm-logo-horizontal-mono.svg': horizontal('mono'),
  'esm-logo-vertical.svg': vertical('color'),
  'esm-logo-vertical-white.svg': vertical('white'),
  'esm-logo-vertical-mono.svg': vertical('mono'),
  'esm-symbol.svg': svg(56, 56, symbol(C.navy, C.teal, 4, 4), 'ESM'),
  'esm-symbol-navy.svg': svg(56, 56, symbol(C.navy, C.navy, 4, 4), 'ESM'),
  'esm-symbol-white.svg': svg(56, 56, symbol(C.white, C.gold, 4, 4), 'ESM'),
  'esm-symbol-mono.svg': svg(56, 56, symbol(C.black, C.black, 4, 4), 'ESM'),
};
for (const [n, s] of Object.entries(files)) writeFileSync(`public/brand/${n}`, s);

// Favicon et icônes : symbole blanc sur carré navy
const appIcon = (size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64"><rect width="64" height="64" fill="${C.navy}"/>${symbol(C.white, C.gold, 8, 8, 1)}</svg>`;
writeFileSync('public/favicon.svg', appIcon(64));
await sharp(Buffer.from(appIcon(512))).png().toFile('public/icons/logo-512.png');
await sharp(Buffer.from(appIcon(180))).png().toFile('public/icons/apple-touch-icon.png');

// Images de partage 1200×630 : photo + voile navy + logo blanc + titre
const ogPages = {
  default: { photo: 'hall-clinique', lines: ['Designing spaces', 'for better healthcare.'], sub: 'Votre projet médical, de A à Z.' },
  amenagement: { photo: 'cabinet-dentaire', lines: ['Aménagement de', 'cabinet médical'], sub: 'Étude · Conception · Travaux · Équipement' },
  renovation: { photo: 'bloc-operatoire', lines: ['Rénover sans', 'interrompre vos soins'], sub: 'Rénovation en site occupé' },
};
for (const [name, p] of Object.entries(ogPages)) {
  const bg = await sharp(`src/assets/photos/${p.photo}.jpg`).resize(1200, 630, { fit: 'cover' }).toBuffer();
  const brand = text(F700, 'EURO SPACE MEDICAL', 132, 104, 22, 0.16);
  const tag = text(F600, 'DESIGNING MEDICAL SPACES.', 132, 128, 12, 0.2);
  const title = p.lines.map((l, i) => text(F700, l, 72, 330 + i * 76, 64, -0.02).d).join('');
  const sub = text(F600, p.sub, 72, 330 + p.lines.length * 76 + 18, 24, 0);
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${C.navy}" stop-opacity="0.94"/><stop offset="0.62" stop-color="${C.navy}" stop-opacity="0.78"/><stop offset="1" stop-color="${C.navy}" stop-opacity="0.15"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>${symbol(C.white, C.gold, 72, 72, 1.1)}
<path d="${brand.d}" fill="${C.white}"/><path d="${tag.d}" fill="${C.white}" fill-opacity="0.75"/>
<rect x="72" y="214" width="56" height="3" fill="${C.gold}"/>
<path d="${title}" fill="${C.white}"/><path d="${sub.d}" fill="${C.white}" fill-opacity="0.85"/></svg>`;
  await sharp(bg).composite([{ input: Buffer.from(overlay) }]).png({ compressionLevel: 9 }).toFile(`public/og/${name}.png`);
}
console.log('Identité générée : public/brand, favicon, icônes, images de partage.');
