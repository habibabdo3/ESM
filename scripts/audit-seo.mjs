/**
 * Audit SEO du site généré (dist/). Échoue (code 1) si :
 *  - title > 60 caractères ou description hors 140–155 (pages indexables)
 *  - nombre de H1 ≠ 1, saut de niveau de titre (h2 → h4…)
 *  - canonical absent ou non auto-référencé
 *  - image sans attribut alt
 *  - lien interne cassé, page indexable orpheline (aucun lien entrant)
 *  - JSON-LD invalide (JSON non parsable ou sans @context/@type)
 *  - title ou description dupliqués
 *  - avec --strict : marqueur « [À COMPLÉTER » présent (à utiliser avant la mise en production finale)
 * Usage : npm run build && npm run audit:seo   |   npm run audit:strict
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'node-html-parser';

const DIST = 'dist';
const strict = process.argv.includes('--strict');
if (!existsSync(DIST)) {
  console.error('dist/ introuvable : lancez « npm run build » avant l’audit.');
  process.exit(1);
}

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk(DIST).filter((f) => f.endsWith('.html'));
const routeOf = (f) => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/');
const routes = new Set(files.map(routeOf));
const assets = new Set(walk(DIST).map((f) => '/' + relative(DIST, f).replace(/\\/g, '/')));

const errors = [];
const warnings = [];
const inbound = new Map([...routes].map((r) => [r, 0]));
const titles = new Map();
const descs = new Map();
const indexable = new Set();
let todoCount = 0;

for (const file of files) {
  const route = routeOf(file);
  const html = readFileSync(file, 'utf8');
  const root = parse(html);
  const err = (m) => errors.push(`${route} — ${m}`);
  const robots = root.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
  const noindex = robots.includes('noindex');
  const is404 = route === '/404.html' || route === '/404/';
  if (!noindex) indexable.add(route);

  const title = root.querySelector('title')?.text.trim() ?? '';
  const desc = root.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  if (!title) err('title absent');
  if (!noindex) {
    if ([...title].length > 60) err(`title trop long (${[...title].length}) : « ${title} »`);
    const dl = [...desc].length;
    if (dl < 140 || dl > 155) err(`description hors limites (${dl})`);
    titles.set(title, [...(titles.get(title) ?? []), route]);
    descs.set(desc, [...(descs.get(desc) ?? []), route]);
  }

  const h1 = root.querySelectorAll('h1').length;
  if (h1 !== 1) err(`${h1} balise(s) H1`);
  let prev = 1;
  for (const h of root.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6')) {
    const lvl = Number(h.tagName[1]);
    if (lvl > prev + 1) err(`saut de titre h${prev} → h${lvl} (« ${h.text.trim().slice(0, 40)} »)`);
    prev = lvl;
  }

  if (!is404) {
    const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href');
    if (!canonical) err('canonical absent');
    else if (new URL(canonical).pathname !== route) err(`canonical non auto-référencé : ${canonical}`);
  }

  for (const img of root.querySelectorAll('img')) {
    if (!img.hasAttribute('alt')) err(`image sans alt : ${img.getAttribute('src')}`);
  }

  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const j = JSON.parse(s.text);
      if (!j['@context'] || !(j['@type'] || j['@graph'])) err('JSON-LD sans @context/@type');
      for (const node of j['@graph'] ?? [j]) if (!node['@type']) err('nœud JSON-LD sans @type');
    } catch {
      err('JSON-LD invalide');
    }
  }

  for (const a of root.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (!href || /^(https?:|mailto:|tel:|#|javascript:)/.test(href)) continue;
    const path = href.split('#')[0].split('?')[0];
    if (!path.startsWith('/')) continue;
    if (path.startsWith('/api/')) continue;
    if (routes.has(path)) {
      if (path !== route) inbound.set(path, (inbound.get(path) ?? 0) + 1);
    } else if (!assets.has(path)) {
      err(`lien interne cassé : ${href}`);
    }
  }

  const visible = root.querySelector('body')?.text ?? '';
  const n = (visible.match(/\[À COMPLÉTER/g) ?? []).length;
  if (n) {
    todoCount += n;
    (strict ? errors : warnings).push(`${route} — ${n} marqueur(s) [À COMPLÉTER]`);
  }
}

for (const [r, n] of inbound) {
  if (n === 0 && indexable.has(r) && r !== '/') errors.push(`${r} — page orpheline (aucun lien interne entrant)`);
}
for (const [t, rs] of titles) if (rs.length > 1) errors.push(`title dupliqué « ${t} » : ${rs.join(', ')}`);
for (const rs of descs.values()) if (rs.length > 1) errors.push(`description dupliquée : ${rs.join(', ')}`);

console.log(`Audit SEO : ${files.length} pages (${indexable.size} indexables), ${todoCount} marqueur(s) [À COMPLÉTER].`);
if (warnings.length) console.log(`\nAvertissements (${warnings.length}) :\n  ` + warnings.join('\n  '));
if (errors.length) {
  console.error(`\nErreurs (${errors.length}) :\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log('\n✓ Aucun problème bloquant.');
