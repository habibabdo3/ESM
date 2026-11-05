# Direction artistique — Euro Space Medical

Démo vivante : `/styleguide/` (noindex). Tokens : `src/styles/global.css` (`@theme`).

## Principe
Le luxe vient de la retenue : beaucoup d'espace, peu de couleurs, des mouvements lents et rares. Chaque animation
met le contenu en valeur, jamais elle-même. Univers médical, sobre, rassurant.

## Couleurs
| Token | Hex | Usage |
|---|---|---|
| `night` | #0a1a2f | Sections premium (héros, CTA, footer, rénovation, zones) |
| `night-2` | #10263f | Cartes sur fond nuit |
| `night-3` | #1b3654 | Filets / séparateurs sur nuit |
| `teal` | #1d5a60 | Liens et survols de texte sur clair |
| `ivory` | #f7f3ec | Fond principal |
| `sand` | #eee8dc | Fond alterné (services, FAQ) |
| `line` | #ddd5c6 | Filets sur clair |
| `stone` | #8a857b | Décor uniquement (contraste insuffisant pour du texte) |
| `stone-ink` | #5b564d | Texte secondaire (6,6:1 sur ivory) |
| `ink` | #121d2b | Texte principal |
| `gold` | #c9a96b | Or champagne : filets, chiffres, CTA, survols — texte **seulement sur nuit** (7,8:1) |
| `gold-soft` | #e4d2a6 | Survol du CTA, italiques du héros |
| `gold-deep` | #755a24 | Or lisible sur clair (5,8:1 ivory, 5,3:1 sand) : eyebrows, chiffres |

Règle : l'or ne couvre jamais de grande surface (boutons et filets uniquement).

## Typographie
- Titres : **Cormorant Garamond** 500 (et 400 italique pour un mot accentué). `h1` clamp 2,5 → 5 rem (héros jusqu'à 6,4 rem).
- Texte : **Manrope** variable, 17 px, interligne 1,7.
- `.eyebrow` : 0,72 rem, 600, capitales espacées 0,22 em, précédé d'un filet.
- `.caption` : légendes en petites capitales (ville · spécialité).
- `.num` : chiffres serif (numérotation 01, 02…, compteurs).

## Composition
- Conteneur `.container-lux` : 82 rem max, gouttières 16 / 32 / 48 px.
- Sections : `py-20 lg:py-28` (ou 24/32-36 sur l'accueil). Alternance ivory → sand → night.
- Grilles de cartes séparées par des filets d'1 px (`gap-px` sur fond `line`/`night-3`).
- Coins : droits (boutons 2 px), images 4 px.

## Mouvement (tokens)
- Courbe : `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-lux`).
- Durées : survol 300 ms · apparition 800 ms · révélation d'image 1 200 ms · zoom héros 22 s · décalage 100 ms.
- Uniquement `transform`, `opacity`, `clip-path`. Aucun décalage de mise en page (CLS 0).
- `prefers-reduced-motion` : animations ramenées à ~0, transitions 150 ms, parallaxe et masques désactivés.
- JavaScript d'animation : `src/scripts/motion.ts` (< 2 ko), sans bibliothèque.

## Visuels
- Pas de photos de banque d'images avec visages.
- `PlanArt` : plan schématique déterministe par spécialité (pièces nommées, portes, cotes, rose des vents,
  circuit patient en pointillé or). Signalé « illustration ».
- Photos réelles (réalisations) : `astro:assets` → AVIF/WebP, srcset, dimensions déclarées, lazy sauf héros.
