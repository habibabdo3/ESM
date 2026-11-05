/**
 * Génère les images Open Graph 1200×630 et les icônes PNG à partir de SVG (sharp, fourni avec Astro).
 * Usage : npm run og   (les fichiers produits sont versionnés dans public/)
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

mkdirSync('public/og', { recursive: true });
mkdirSync('public/icons', { recursive: true });

const grid = Array.from({ length: 61 }, (_, i) => `<path d="M${i * 20} 0V630M0 ${i * 20}H1200" stroke="rgba(247,243,236,0.05)" stroke-width="1"/>`).join('');
const rooms = (seed) => {
  const r = [[640, 90, 220, 170], [860, 90, 250, 230], [640, 260, 220, 280], [860, 320, 130, 220], [990, 320, 120, 220]];
  return r.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="rgba(247,243,236,0.35)" stroke-width="2"/>`).join('') +
    `<rect x="640" y="90" width="470" height="450" fill="none" stroke="rgba(247,243,236,0.7)" stroke-width="6"/>` +
    `<path d="M750 200 L985 220 L750 420 L925 450 L1050 450" fill="none" stroke="#c9a96b" stroke-width="3" stroke-dasharray="8 10"/>` +
    [[750, 200], [985, 220], [750, 420], [925, 450], [1050, 450]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#c9a96b"/>`).join('') + (seed ? '' : '');
};
const og = (title, sub) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#0a1a2f"/>${grid}<g transform="translate(250 60) scale(0.8)">${rooms()}</g>
<rect x="0" y="0" width="760" height="630" fill="url(#g)"/>
<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0.6" stop-color="#0a1a2f"/><stop offset="1" stop-color="#0a1a2f" stop-opacity="0"/></linearGradient></defs>
<rect x="80" y="90" width="64" height="64" fill="none" stroke="#c9a96b" stroke-width="2"/>
<path d="M98 146V122a14 14 0 0128 0v24" fill="none" stroke="#f7f3ec" stroke-width="2.4"/><path d="M112 124v12M106 130h12" stroke="#c9a96b" stroke-width="2.4"/>
<text x="164" y="116" font-family="Helvetica, Arial, sans-serif" font-size="18" letter-spacing="6" fill="#f7f3ec">EURO SPACE</text>
<text x="164" y="148" font-family="Georgia, serif" font-style="italic" font-size="32" fill="#f7f3ec">Medical</text>
<line x1="80" y1="250" x2="150" y2="250" stroke="#c9a96b" stroke-width="2"/>
${title.map((l, i) => `<text x="80" y="${330 + i * 70}" font-family="Georgia, serif" font-size="56" fill="#f7f3ec">${l}</text>`).join('')}
<text x="80" y="${330 + title.length * 70 + 20}" font-family="Helvetica, Arial, sans-serif" font-size="20" letter-spacing="4" fill="#c9a96b">${sub}</text>
</svg>`;

const pages = {
  default: [['Cabinets, cliniques', 'et centres médicaux'], 'CONÇUS · AMÉNAGÉS · ÉQUIPÉS · FINANCÉS'],
  amenagement: [['Aménagement de', 'cabinet médical'], 'PARTOUT AU MAROC'],
  renovation: [['Rénover sans', 'interrompre vos soins'], 'RÉNOVATION EN SITE OCCUPÉ'],
};
for (const [name, [title, sub]] of Object.entries(pages)) {
  await sharp(Buffer.from(og(title, sub))).png({ compressionLevel: 9 }).toFile(`public/og/${name}.png`);
}
const icon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40 40"><rect width="40" height="40" fill="#0a1a2f"/><rect x="5" y="5" width="30" height="30" fill="none" stroke="#c9a96b" stroke-width="1.2"/><path d="M13 30V19a7 7 0 0114 0v11" fill="none" stroke="#f7f3ec" stroke-width="1.4"/><path d="M20 20v7M16.5 23.5h7" stroke="#c9a96b" stroke-width="1.4"/></svg>`;
await sharp(Buffer.from(icon(512))).png().toFile('public/icons/logo-512.png');
await sharp(Buffer.from(icon(180))).png().toFile('public/icons/apple-touch-icon.png');
console.log('OG et icônes générés.');
