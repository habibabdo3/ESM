# CLAUDE.md — Mémoire du projet Euro Space Medical

> **À lire à chaque session et avant chaque modification.**
> Après chaque changement : mettre à jour `docs/CHANGELOG.md` (entrée datée en haut) et, si le design
> ou une règle change, ce fichier et `docs/DESIGN.md`. Lancer `npm run verify` avant tout push.

## 1. Le projet en une minute

- **Quoi** : site vitrine multi-pages d'**Euro Space Medical**, société qui **conçoit, rénove, équipe et aide à financer**
  les cabinets, cliniques, centres d'imagerie et laboratoires **partout au Maroc** (siège : Casablanca).
- **Objectif** : générer des demandes de devis qualifiées (formulaire + WhatsApp). SEO local fort.
- **Promesse** : « Nous concevons, rénovons et équipons les cabinets, cliniques et centres médicaux, sans interrompre
  votre activité et dans le respect des exigences de votre spécialité. »
- **Trois piliers** : interlocuteur unique · spécialité d'abord (le plan part de l'acte médical) · zéro surprise.
- **Différenciation** (vs concurrent mono-dentaire) : toutes les spécialités, rénovation en site occupé, dossier
  réglementaire par discipline, portfolio avant/après, pages régionales, financement bancaire accompagné.
- **Cibles** : médecins/dentistes en 1re installation, praticiens qui rénovent, cliniques/imagerie/labos, investisseurs,
  universités privées.
- **Langue** : français (`lang="fr"`, vouvoiement, phrases courtes, apostrophes typographiques ’). Structure prête pour
  arabe (RTL) / anglais, non activés.
- Source éditoriale : `content/source/rapport.md` (synthèse du rapport du 5 novembre 2026).

## 2. Règles non négociables

1. **Aucune donnée inventée** : pas de chiffres commerciaux, clients, avis, certifications, photos de projets, délais
   ou taux. Info manquante → composant `<Todo label="…" />` (marqueur visible `[À COMPLÉTER : …]`).
   `npm run audit:strict` échoue s'il en reste (à exécuter avant la mise en production définitive).
2. Pas de `Review`/`AggregateRating` sans vrais avis. Pas de promesse médicale (on vend de l'aménagement).
3. Aucun texte repris de lynemedical.ma ou d'un autre site.
4. Loi 09-08 (CNDP) : consentement cookies (`CookieBanner`), mention dans le formulaire, page confidentialité.
   Analytique (Plausible) et pixel Meta **chargés uniquement après consentement**.
5. **Banques** : partenariats **signés** avec Al Barid Bank et Bank Al Yousr (confirmé le 2026-11-05) → noms affichés
   par défaut (`BANK_CLAIMS_APPROVED` ≠ `false`). Formulations autorisées : « dossier Intelaka traité en priorité avec
   Al Barid Bank », « conditions préférentielles avec Bank Al Yousr (Mourabaha, Ijara) ». Toujours afficher
   « Sous réserve d'acceptation du dossier par la banque. » (`BANK_DISCLAIMER`). **Aucun taux, montant, durée ou délai
   chiffré** sans accord écrit spécifique. Ne jamais promettre de taux d'acceptation. Logos : en attente des fichiers officiels.
6. Chiffres affichés = uniquement des faits vérifiables (ex. 14 spécialités, 10 services, 12 régions = périmètre de l'offre).
7. Références réglementaires validées : AMSSNuR (loi 142-12) pour la radiologie, y compris dentaire ; déchets médicaux :
   loi 28-00 + décret 2-09-139. Normes ISO/NF : « à confirmer avec le bureau d'études et l'organisme de contrôle ».
8. Pas de page par ville sans contenu unique (pages satellites) : 12 pages **régionales** uniquement.
9. **Sécurité** : site statique, aucune base de données, aucun compte, aucun admin, aucun paiement. Seul point d'entrée :
   `api/devis.js` (POST JSON, origine vérifiée, 20 ko max, liste blanche de champs, longueurs et listes fermées,
   champ piège, limitation de débit, échappement HTML, réponses génériques). Les clés (`RESEND_API_KEY`…) restent
   côté serveur, jamais préfixées `PUBLIC_`, jamais dans le dépôt. Si l'on ajoute un jour base de données, espace
   client, admin ou paiement : RLS activée, contrôle du propriétaire de chaque enregistrement, admin derrière
   authentification, limites à l'inscription, webhooks vérifiés par signature.

## 3. Stack et commandes

- **Astro 7.4** (statique, `trailingSlash: 'always'`), TypeScript strict, **Tailwind CSS 4** (`@tailwindcss/vite`,
  tokens dans `@theme`), content collections + **Zod 4** (`astro/zod`, loaders `file()`/`glob()` de `astro/loaders`).
- Polices auto-hébergées : `@fontsource/cormorant-garamond` (titres) + `@fontsource-variable/manrope` (texte).
- Déploiement : **Vercel** (`vercel.json` : en-têtes de sécurité, CSP, redirections 301, fonction `api/devis.js`).

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur local (brouillons du blog visibles) |
| `npm run build` | build statique dans `dist/` |
| `npm run check` | `astro check` (doit rester à 0 erreur / 0 avertissement) |
| `npm run audit:seo` | audit du build : title ≤ 60, description 140–155, 1 H1, hiérarchie, canonical, alt, liens cassés, orphelines, JSON-LD, doublons |
| `npm run audit:strict` | idem + échoue s'il reste un `[À COMPLÉTER` |
| `npm run verify` | check + build + audit (**avant chaque push**) |
| `npm run og` | régénère `public/og/*.png` et `public/icons/*.png` (sharp) |

## 4. Arborescence

```
src/
  config/site.ts          coordonnées (env), BANK_DISCLAIMER, bankClaimsApproved, whatsappLink()
  content.config.ts       schémas Zod : services, specialites, regions, realisations, blog
  data/services.json      10 services (title ≤60, description 140–155, h1, intro, livrables, termes, savoirFaire, faq…)
  data/specialites.json   14 spécialités (contraintes, offre, aValider, motsCles, servicesLies ≥3, lexique, faq)
  data/regions.json       12 régions du Maroc, texte propre à chacune
  data/financement.ts     banques partenaires (pourQui, produits, piecesDossier) + étapes « Projet financé »
  data/glossaire.ts       glossaire général (chantier, autorisations, matériaux, financement)
  data/faq-general.ts     FAQ générale (accueil + /faq/)
  content/blog/*.md       12 guides publiés (draft: false), liés aux services via servicesLies
  content/realisations/   études de cas (vide ; modèle `_modele.md` ignoré) → images dans src/assets/realisations/
  lib/content.ts          accès collections + chemins (servicePath, specialitePath, regionPath…)
  lib/schema.ts           JSON-LD : Organization, WebSite, LocalBusiness (HomeAndConstructionBusiness), Service, BreadcrumbList, FAQPage, Article
  layouts/BaseLayout.astro  <head> + Seo + Header + Footer + StickyCta + CookieBanner + motion.ts
  layouts/ProseLayout.astro pages texte (légal, plan du site)
  components/             Seo, Header (méga-menus), Footer, PageHero, PlanArt (plans SVG), ServiceCard, SpecialtyCard,
                          ProcessSteps, Faq (<details>), CtaBand, QuoteForm, RelatedLinks, Breadcrumbs, MoroccoMap,
                          RealisationCard, BeforeAfter, Lightbox, StickyCta (WhatsApp mobile fixe), CookieBanner, Todo, Logo, Icon
  scripts/motion.ts       IntersectionObserver (révélations, compteurs) + parallaxe desktop
  styles/global.css       design tokens + composants + animations
  pages/                  voir §5
api/devis.js              fonction serverless Vercel (Resend), champ piège + limitation de débit
scripts/audit-seo.mjs     audit SEO ; scripts/generate-og.mjs ; scripts/check-lengths.mjs (longueurs JSON)
```

## 5. Pages (70 générées) — détail dans `docs/ARCHITECTURE.md`

`/` · `/services/` + 10 · `/specialites/` + 14 · `/amenagement-cabinet-medical/` (pilier) + 12 régions ·
`/renovation-cabinet-clinique/` (pilier) · `/premiere-installation/` · `/zones-intervention/` · `/financement/` +
`/al-barid-bank/` + `/bank-al-yousr/` · `/realisations/` (noindex tant que vide) + `[slug]` · `/blog/` + 12 guides publiés ·
`/glossaire/` (121 termes, DefinedTermSet) · `/faq/` · `/a-propos/` · `/contact/` · `/mentions-legales/` · `/confidentialite/` · `/cookies/` ·
`/plan-du-site/` · `/styleguide/` (noindex) · `404` · `robots.txt` · `sitemap-index.xml` (exclut les noindex, liste dans `astro.config.mjs`).

Maillage : chaque spécialité → ≥ 3 services ; chaque service → spécialités liées + 4 services suivants ;
header/footer → tous les services et spécialités ; fil d'Ariane partout.

## 6. Design (résumé — détail dans `docs/DESIGN.md`, démo dans `/styleguide/`)

- **Direction** : moderne, professionnel, **luxe par la retenue**. Mouvements lents, jamais de rebond/rotation/gadget.
- **Palette** (tokens `--color-*` dans `global.css`) : `night #0a1a2f` (sections premium) · `night-2 #10263f` ·
  `night-3 #1b3654` (filets) · `teal #1d5a60` (liens) · `ivory #f7f3ec` (fond) · `sand #eee8dc` (fond alterné) ·
  `line #ddd5c6` · `stone-ink #5b564d` (texte secondaire) · `ink #121d2b` (texte) · **`gold #c9a96b`** (or champagne :
  filets, chiffres, survols, CTA — **jamais de grandes surfaces**, uniquement sur fond nuit pour le texte) ·
  `gold-deep #755a24` (or lisible sur fond clair, AA).
- `.num` (chiffres serif) = gold-deep sur clair, gold automatiquement dans un conteneur `bg-[var(--color-night…)]`.
- **Typo** : Cormorant Garamond 400/500/italique (titres, chiffres) + Manrope variable (texte). `.eyebrow` et `.caption`
  en petites capitales espacées. Coins photo 4 px.
- **Visuels** : pas de photos de banque d'images. En attendant les vraies photos : `PlanArt` (plans d'architecte SVG
  déterministes par spécialité, filet or en pointillé = circuit patient), `MoroccoMap` (points aux vraies coordonnées).
- **Boutons** : `.btn-gold` (CTA principal), `.btn-ghost-light` (sur nuit), `.btn-ghost-dark` (sur clair).
- **Mouvement** : courbe `--ease-lux: cubic-bezier(0.22,1,0.36,1)` ; survol 300 ms ; apparitions 800 ms ; révélations
  d'image 1 200 ms ; zoom héros 22 s (1,08 → 1, image visible immédiatement) ; décalage 100 ms (`--i`).
  N'animer que `transform`, `opacity`, `clip-path`. `prefers-reduced-motion` respecté. View Transitions natives (CSS).
- Attributs : `data-reveal` (fondu montant), `data-reveal-img` (masque bas→haut + échelle 1,15→1), `.parallax`,
  `data-count="N"` (compteur), `.card-lux` + `.card-media/.card-veil/.card-rule/.card-more` (survol des cartes).

## 7. Variables d'environnement (Vercel → Settings → Environment Variables)

`SITE_URL`, `PUBLIC_PHONE`, `PUBLIC_EMAIL`, `PUBLIC_WHATSAPP` (212…), `PUBLIC_ADDRESS`, `PUBLIC_INSTAGRAM_URL`,
`PUBLIC_FACEBOOK_URL`, `BANK_CLAIMS_APPROVED`, `PUBLIC_PLAUSIBLE_DOMAIN`, `PUBLIC_META_PIXEL_ID`,
`RESEND_API_KEY`, `QUOTE_TO_EMAIL`, `QUOTE_FROM_EMAIL`. Voir `.env.example`. Jamais de secret dans le dépôt.
Sans `SITE_URL`, le canonical utilise `VERCEL_PROJECT_PRODUCTION_URL`.

## 8. Conventions

- Ajouter une **spécialité / un service / une région** : nouvelle entrée JSON (id = slug sans accents), puis
  `node scripts/check-lengths.mjs src/data/<fichier>.json` et `npm run verify`.
- Ajouter une **réalisation** : copier `src/content/realisations/_modele.md` sans le `_`, images dans
  `src/assets/realisations/<slug>/` → l'accueil, la spécialité et `/realisations/` l'affichent, le noindex est retiré.
- Publier un **article** : compléter le `.md` et passer `draft: false`.
- URLs : minuscules, sans accents, slash final, un sujet = une URL. Toute URL modifiée → redirection 301 dans `vercel.json`.
- Un seul H1 par page, pas de saut de niveau (utiliser `<h2 class="sr-only">` si une grille de cartes h3 suit le héros).
- Accessibilité WCAG 2.2 AA (vérifiée axe-core) ; Lighthouse mobile accueil : 100/100/100/100 au 2026-11-05.

- **Crédibilité métier** : employer le vocabulaire réel des praticiens et fournisseurs au Maroc (unit, autoclave
  classe B, cone beam, équivalent plomb, CTA, SSPI, BPDE, PV de réception, Mourabaha…). Tout nouveau terme technique
  va dans `lexique` (spécialité) ou `src/data/glossaire.ts` (général).
- **Style des définitions (lexique + glossaire)** : jamais une définition de dictionnaire. Voix active, « Nous… », ton
  « solution de construction » : dire comment nous adaptons le cabinet à l'équipement (réseaux et fluides, électricité
  dédiée, menuiserie sur-mesure, ventilation, ergonomie, gestion de l'espace, normes). Exemple : « Armoire de stockage
  ventilée : Nous intégrons l'armoire dans une menuiserie sur-mesure, côté propre du local, avec les raccordements
  électriques et l'extraction d'air nécessaires… ». Pas de superlatif invérifiable (« stérilité parfaite »).
- **Services** : `intro` riche en termes techniques ; `termes` (4 étiquettes affichées sur les cartes de `/services/`)
  et `savoirFaire` (3 points, section « Notre savoir-faire technique » sur chaque page service).

## 9. État actuel et prochaines étapes

Voir `docs/CHANGELOG.md` (journal) et **`docs/BESOINS.md`** (liste complète des informations à fournir + benchmark
international + ajouts recommandés). En bref, il manque : coordonnées, identifiants légaux, équipe et assurances,
les 5 réalisations, logos et textes validés des banques, domaine, clés Resend/Plausible/Meta.
