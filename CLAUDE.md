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
   ou taux. Info manquante → composant `<Todo label="…" />` (marqueur visible `[À COMPLÉTER : …]`) sur les pages
   contact, légales et à-propos ; le footer et l'en-tête n'affichent que les coordonnées renseignées.
   `npm run audit:strict` échoue s'il en reste (à exécuter avant la mise en production définitive).
2. Pas de `Review`/`AggregateRating` sans vrais avis. Pas de promesse médicale (on vend de l'aménagement).
3. Aucun texte repris de lynemedical.ma ou d'un autre site.
4. Loi 09-08 (CNDP) : consentement cookies (`CookieBanner`), mention dans le formulaire, page confidentialité.
   Analytique (Plausible) et pixel Meta **chargés uniquement après consentement**.
5. **Banques** : partenariats **signés** avec Al Barid Bank et Bank Al Yousr (confirmé le 2026-11-05) → noms affichés
   par défaut (`BANK_CLAIMS_APPROVED` ≠ `false`). Formulations neutres uniquement (« partenaire d'Euro Space Medical »,
   « dossier préparé et suivi de A à Z »). « Traité en priorité » et « conditions préférentielles » retirés le 2026-11-08 :
   à rétablir seulement avec l'accord écrit de chaque banque sur ces mots. Toujours afficher
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
10. **Conformité légale (checklist 20 points, revue le 2026-11-06)** : confidentialité (sous-traitants, transferts,
   procédure de suppression `#suppression`), CGU `/conditions-utilisation/` (pas de vente en ligne → pas de politique
   de remboursement ; conditions financières dans le devis signé), cookies granulaires décochés par défaut avec
   « Tout refuser » aussi visible que « Tout accepter », retrait = rechargement. Pas de dark pattern : aucune case ni
   option pré-cochée dans le formulaire. Pas de « gratuit » ni d'affirmation sur l'organisation (bureau d'études
   intégré, artisans formés, antennes) tant que l'entreprise ne l'a pas confirmé. Polices sous licence OFL,
   logo et plans originaux, photos d'illustration sous licence libre (créditées avec auteur et licence), photos clients
   avec accord écrit.

## 3. Stack et commandes

- **Astro 7.4** (statique, `trailingSlash: 'always'`), TypeScript strict, **Tailwind CSS 4** (`@tailwindcss/vite`,
  tokens dans `@theme`), content collections + **Zod 4** (`astro/zod`, loaders `file()`/`glob()` de `astro/loaders`).
- Polices auto-hébergées : `@fontsource-variable/manrope` (titres) + `@fontsource-variable/inter` (texte).
- Déploiement : **Vercel** (`vercel.json` : en-têtes de sécurité, CSP, redirections 301, fonction `api/devis.js`).

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur local (brouillons du blog visibles) |
| `npm run build` | build statique dans `dist/` |
| `npm run check` | `astro check` (doit rester à 0 erreur / 0 avertissement) |
| `npm run audit:seo` | audit du build : title ≤ 60, description 140–155, 1 H1, hiérarchie, canonical, alt, liens cassés, orphelines, JSON-LD, doublons |
| `npm run audit:strict` | idem + échoue s'il reste un `[À COMPLÉTER` |
| `npm run verify` | check + build + audit (**avant chaque push**) |
| `npm run brand` | régénère logos `public/brand/`, favicon, icônes et images OG (sharp + opentype.js) |

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
  components/             Seo, Header, Footer, PageHero, Photo, PlanArt (plans SVG), ServiceCard, SpecialtyCard,
                          ProcessSteps, Faq (<details>), CtaBand, QuoteForm, RelatedLinks, Breadcrumbs, MoroccoMap,
                          RealisationCard, BeforeAfter, Lightbox, StickyCta (WhatsApp mobile fixe), CookieBanner, Todo, Logo, Icon
  scripts/motion.ts       IntersectionObserver (révélations, compteurs)
  scripts/motion-home.ts  accueil : lecture auto de la maquette, bandes d'expertises, réalisations (IntersectionObserver, sans GSAP)
  scripts/clinic-scene.ts scène three.js de la maquette (plan → murs → coupe équipée), chargée à la demande
  styles/global.css       design tokens + composants + animations
  pages/                  voir §5
api/devis.js              fonction serverless Vercel (Resend), champ piège + limitation de débit
scripts/audit-seo.mjs     audit SEO ; scripts/generate-brand.mjs (logos, favicon, OG) ; scripts/check-lengths.mjs
src/lib/photos.ts         registre des photos (alt, source Unsplash), photo par spécialité/service, 4 expertises
src/assets/photos/        photos d'illustration (optimisées au build en AVIF/WebP)
```

## 5. Pages (72 générées) — détail dans `docs/ARCHITECTURE.md`

`/` · `/expertises/` (4 expertises) · `/services/` + 10 · `/specialites/` + 14 · `/amenagement-cabinet-medical/` (pilier) + 12 régions ·
`/renovation-cabinet-clinique/` (pilier) · `/premiere-installation/` · `/zones-intervention/` · `/financement/` +
`/al-barid-bank/` + `/bank-al-yousr/` · `/realisations/` (noindex tant que vide) + `[slug]` · `/blog/` + 12 guides publiés ·
`/glossaire/` (121 termes, DefinedTermSet) · `/faq/` · `/a-propos/` · `/contact/` · `/mentions-legales/` · `/conditions-utilisation/` · `/confidentialite/` · `/cookies/` ·
`/plan-du-site/` · `/styleguide/` (noindex) · `404` · `robots.txt` · `sitemap-index.xml` (exclut les noindex, liste dans `astro.config.mjs`).

Maillage : chaque spécialité → ≥ 3 services ; chaque service → spécialités liées + 4 services suivants ;
header/footer → tous les services et spécialités ; fil d'Ariane partout.

## 6. Identité et design (refonte du 2026-11-07 — détail dans `docs/DESIGN.md`, démo dans `/styleguide/`)

- **Marque** : EURO SPACE MEDICAL (ESM) · signature *Designing medical spaces.* · « Votre projet médical, de A à Z. »
  Direction : studio d'architecture premium + ingénierie médicale. **Moins de texte, plus d'impact visuel.**
- **Logo** (choisi par le client le 2026-11-08) : monogramme **ESM** en dégradé navy → teal, **toiture or** au-dessus
  (avec cheminée), **arc or** en dessous ; nom « EURO SPACE / MEDICAL » sur deux lignes de même largeur, signature or.
  Géométrie unique `src/data/logo.json` (générée par `npm run brand` / `scripts/generate-brand.mjs`, qui produit aussi
  `public/brand/*.svg`, favicon, icônes, OG). `Logo.astro` : layout horizontal / vertical / symbol × tone color /
  navy / white / mono ; la signature n'apparaît qu'à partir de 70 px de haut (sinon illisible) — dans le footer elle
  est écrite en texte sous le logo. Ne jamais utiliser l'image raster d'origine comme logo de production.
- **Couleurs** (65 % blanc/warm, 20 % navy, 10 % mist, 4 % teal, 1 % or) : `navy #142C43` · `teal #168C91`
  (`teal-ink #0F6E72` pour petits textes) · `gold #C6A66B` (filets, numéros sur navy, jamais en fond) ·
  `warm #F7F8F7` · `mist #E9EEF0` · `ink #263746` · `slate #697782` (≥ 24 px) / `muted #5E6C77` (petit texte, AA).
- **Typo** : Manrope (titres, boutons) + Inter (texte), `@fontsource-variable`. Héros 56–72 px, sections 36–44 px,
  cartes 21–24 px, texte 16–18 px. Paragraphes ≤ 3 lignes (`paragraphs()` dans `lib/content.ts`).
- **Composants** : `PageHero` (fond warm + `visual` photo ou dessin 4:3), `Photo` (AVIF/WebP), `Visual`, `SectionHeading`,
  `ProcessSteps` (Découvrir · Concevoir · Construire · Livrer ; pages internes), `SpecIndex` (/specialites/), `SpecPlan` (accueil), `ServiceIndex`, `CtaBand` (navy + photo optionnelle), cartes à filet supérieur, `.link-more` « Découvrir → »,
  `.btn-primary` (navy ; blanc automatiquement sur fond navy), `.btn-ghost-dark` / `.btn-ghost-light`.
- **Photos** (revue du 2026-11-08) : 11 photos sous licence libre (Unsplash, Wikimedia CC0 / CC BY / CC BY-SA),
  registre `src/lib/photos.ts` (alt, auteur, licence, source), crédits détaillés en mentions légales, légende
  « Image d'illustration ». Ce ne sont **pas** des réalisations ESM : jamais dans le portfolio.
  **Règle visuelle** : pages hub (index, financement, FAQ, légal, contact) sans visuel ; pages détail avec une photo
  pertinente (`serviceVisual`, `specialiteVisual`) ou, à défaut, un **dessin technique original** (`PlanArt` via
  `Visual.astro`) — jamais de photo hors sujet ; une photo au plus deux fois, toujours en contexte.
- **Gabarit page service** : héros → « L'essentiel » (3 cartes savoirFaire + termes) → approche (paragraphes courts +
  schéma) → livrables en étapes numérotées (+ carte CTA) → « Termes techniques expliqués » (accordéon, définitions
  du glossaire/lexique) → FAQ → liens associés (3 colonnes) → CTA. Composant `SectionHeading` pour tous les en-têtes.
- **Langue des titres** : tout en français ; l'anglais seulement pour la signature *Designing medical spaces.*
- **Footer** : 4 colonnes (Entreprise · Expertises · Spécialités médicales · Ressources et contact), liens ≥ 15 px,
  barre légale discrète ; sur mobile, Expertises et Ressources côte à côte, spécialités sur 2 colonnes.
- **Mouvement (v1.6.0 du 2026-11-08)** : **défilement normal, rien d'épinglé, rien de piloté par le défilement**
  (demande client : « c'est l'utilisateur qui contrôle la vitesse »). Accueil : maquette 3D three.js
  (`clinic-scene.ts`) : **introduction plein écran à la première visite** (mémorisée dans `localStorage`
  `esm-intro-v1`, « Passer », Échap, molette), puis la planche rejoint le héros où la maquette livrée tourne
  lentement ; « Revoir la construction », étapes cliquables, **bouton pause obligatoire** (`motion-home.ts`, sans
  GSAP), lecture suspendue hors écran. Héros = titre + **brief en une phrase**
  (formulaire GET → /contact/ pré-rempli). Spécialités : plan d'un centre médical (`SpecPlan`), clic = panneau
  « page virtuelle » qui affiche l'URL réelle de la spécialité (pages statiques conservées pour le SEO). Réalisations :
  image collante (CSS sticky) qui change via IntersectionObserver. Survols 200–400 ms ; `transform`/`opacity`/
  `clip-path`, seule exception `flex-grow` des bandes d'expertises. Contraste AA conservé pendant les animations.
  **Appareils** (script du `<head>`) : pas de 3D si « réduire les animations », économiseur de données ou < 2 Go ;
  classe `gl-lite` (sans ombres, densité ≤ 1,75×, 30 i/s) si < 4 Go, ≤ 4 cœurs ou 2G/3G ; densité ≤ 2× sinon ;
  scène chargée à l'approche de l'écran ; repli sur le plan statique si perte du contexte WebGL.
- **Mobile** : aucune page ne doit dépasser la largeur d'écran (sinon le téléphone dézoome tout : rendu flou).
  Colonnes de grille `grid-cols-1` / `min-w-0` autour des rangées qui défilent ; vérifier `scrollWidth` à 390 px.
- **Pas de grilles de cartes** sur l’accueil et les hubs : bandes d'images, plan des spécialités, comparatif, index
  typographiques (`SpecIndex`, `ServiceIndex`), listes éditoriales, cartes empilées. Références : taste-skill (Leonxlnx) et UI UX Pro Max (nextlevelbuilder),
  palette et polices de marque prioritaires sur leurs suggestions.
- **SDK** `paycii/ssagency-sdk-angular` : référence en lecture seule (principes d’`AbstractThreeScene`, versions gsap
  et three identiques). **Ne jamais le modifier.** La scène three.js est indépendante du framework (portable en Angular).
- **Navigation** : Accueil · Expertises (`/expertises/`) · Réalisations · À propos · Contact + « Parler de mon projet ».

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
- Accessibilité WCAG 2.2 AA (vérifiée axe-core sur 19 pages) ; Lighthouse mobile au 2026-11-07 : accueil 99/100/100/100,
  page service 100/100/100/100.

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

Voir `docs/CHANGELOG.md` (journal), **`docs/MEDIAS.md`** (brief photo/vidéo) et **`docs/BESOINS.md`** (liste complète des informations à fournir + benchmark
international + ajouts recommandés). En bref, il manque : coordonnées, identifiants légaux, équipe et assurances,
les 5 réalisations, logos et textes validés des banques, domaine, clés Resend/Plausible/Meta.
