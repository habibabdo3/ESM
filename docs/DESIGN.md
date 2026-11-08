# Identité et direction artistique — Euro Space Medical

> Refonte du 2026-11-07 : identité premium « architecture + ingénierie médicale ».
> Démo vivante : `/styleguide/` (noindex). Tokens : `src/styles/global.css` (`@theme`). Logos : `public/brand/`.

## Marque

- **Nom** : EURO SPACE MEDICAL · **Abréviation** : ESM
- **Signature** : *Designing medical spaces.* · **Signature française** : Votre projet médical, de A à Z.
- **Positionnement** : architecture, ingénierie, construction et équipement de structures médicales.
- **Ton visuel** : studio d’architecture premium + ingénierie médicale + identité corporate internationale.
  Moins de texte, plus d’impact visuel, beaucoup d’espace, hiérarchie nette.

## Logo

- **Symbole** (48 × 48) : cadre de plan ouvert sur la droite (l’entrée du bâtiment), monogramme géométrique
  **E·S·M** tracé au trait, ligne de cote en teal (précision d’ingénierie). Aucune croix, dent ou stéthoscope.
- **Composant** : `src/components/Logo.astro` — `layout` = `horizontal | vertical | symbol`,
  `tone` = `color | navy | white | mono`, `tagline` (signature sous le nom).
- **Fichiers vectoriels** (texte vectorisé, aucune police requise) : `public/brand/esm-logo-horizontal(-navy|-white|-mono).svg`,
  `esm-logo-vertical(-white|-mono).svg`, `esm-symbol(-navy|-white|-mono).svg`. Régénérer : `npm run brand`.
- Favicon et icônes : symbole blanc et or sur carré navy.
- Taille minimale : 24 px (symbole). Zone de protection : la hauteur du E.

## Couleurs (répartition 65 / 20 / 10 / 4 / 1)

| Token | Hex | Usage |
|---|---|---|
| `warm` + blanc | #F7F8F7 / #FFFFFF | 65 % : fonds |
| `navy` | #142C43 | 20 % : titres, navigation, boutons principaux, footer, sections fortes |
| `mist` | #E9EEF0 | 10 % : fonds alternés |
| `teal` | #168C91 | 4 % : accents, états actifs, filets, soulignement de navigation |
| `teal-ink` | #0F6E72 | teal pour petits textes et liens (5,6:1 sur warm) |
| `gold` | #C6A66B | 1 % : filets courts, numéros et libellés sur navy. **Jamais en fond.** |
| `ink` | #263746 | texte principal |
| `slate` | #697782 | texte secondaire officiel : ≥ 24 px, icônes, bordures (4,3:1 sur warm) |
| `muted` | #5E6C77 | texte secondaire en petite taille (5,1:1 sur warm, AA) |
| `line` | #DBE2E5 | bordures subtiles |

Règles automatiques : dans un conteneur `bg-[var(--color-navy…)]`, les titres passent en blanc, `.num` en or et
`.btn-primary` devient blanc à texte navy.

## Typographie

- **Manrope** (titres, boutons, navigation) · **Inter** (texte), auto-hébergées (`@fontsource-variable`), préchargées.
- Héros 56–72 px (bold, interlettrage −0,035 em) · titres de section 36–44 px · cartes 21–24 px · texte 16–18 px ·
  libellés 12–14 px (capitales espacées uniquement pour les libellés et les boutons).
- Pas de paragraphe en gras, pas de texte justifié, paragraphes ≤ 3 lignes (`paragraphs()` découpe les textes longs).

## Composition

- Conteneur `.container-lux` (80 rem), gouttières 20 / 32 / 48 px. Sections `py-20 lg:py-28` (accueil : 24 / 32).
- Alternance blanc → warm → soft grey → navy. Grilles alignées, filets d’1 px, coins 2 px, ombres très rares.
- Une idée par section, un titre par section, deux phrases maximum par carte.
- En-tête des pages internes (`PageHero`) : fond warm, fil d’Ariane, libellé teal, H1 navy, une phrase, photo 4:3.

## Photographie (revue du 2026-11-08)

- Direction : photographie d'architecture, lumière naturelle, balance des blancs neutre, aucun filtre bleu, aucun
  visage de patient, aucun « médecin souriant ».
- Banque actuelle : 11 photos sous licence libre (Unsplash ; Wikimedia Commons en CC0, CC BY 2.0/4.0, CC BY-SA 3.0),
  registre `src/lib/photos.ts` avec auteur, licence et source ; crédits complets sur `/mentions-legales/`.
- Retirées le 2026-11-08 : chantier générique, bloc opératoire daté, accueil daté avec signalétique étrangère,
  couloir de bureau, façade non médicale, chambre, clichés sur négatoscope, plans dessinés à la main.
- **Règle** : pages hub sans visuel ; pages détail avec photo pertinente ou, à défaut, dessin technique original
  (`PlanArt`, cadre identique, étiquette « Plan type — … »). Une photo au plus deux fois, toujours en contexte.
- Ratios : héros d'accueil 21:9 (16:9 tablette, 4:3 mobile), en-têtes 4:3, cartes expertises 4:5 (4:3 mobile).
- Manques connus (photographie à produire ou à acheter, voir docs/MEDIAS.md) : salle scanner/CBCT, salle de
  radiologie, salle d'endoscopie haut de gamme, chantier médical réel, rendus 3D.
- **Elles ne représentent pas des réalisations ESM** : légende « Image d'illustration » ; jamais dans le portfolio.

## Mouvement

- 200–400 ms, courbe `cubic-bezier(0.25, 0.1, 0.25, 1)`. Uniquement `transform` et `opacity`.
- Révélation courte au défilement (`data-reveal`, 12 px + fondu), titres en fondu court, zoom 1,03 au survol des cartes,
  soulignement teal de la navigation, transitions de page natives (250 ms).
- Supprimés : zoom continu du héros, parallaxe, révélations longues. `prefers-reduced-motion` : tout désactivé.

## Navigation

- En-tête blanc translucide, collant, filet bas : Accueil · Expertises · Réalisations · À propos · Contact +
  bouton **Parler de mon projet**. Menu mobile plein écran blanc. Contact en deux clics maximum depuis toute page.
- Footer navy : logo blanc, description, expertises, spécialités, ressources, légal. Coordonnées affichées uniquement
  si renseignées (sinon lien vers le formulaire).
