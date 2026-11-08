# Journal des changements

> Ajouter chaque modification **en haut**, datée, avec : ce qui a changé, pourquoi, fichiers clés, et l'état des vérifications.

## 2026-11-08 — v1.9.1 · Réalisations : plus d'écran d'introduction

- Écran « Réalisations / Les projets que nous menons / Nos études de cas arrivent… » retiré (demande client) : la
  section s'ouvre directement sur le premier projet. En haut des photos, une barre fine « Réalisations · Projets
  types » + un index cliquable des 4 projets (numéro + nom sur desktop, numéros sur mobile) qui suit le défilement
  (filet or sur le projet en cours). Voile sombre en haut de la photo pour la lisibilité.
- Vérifications : `npm run verify`, axe-core 0 violation, largeur mobile = écran, captures 1440 et 390 px.

## 2026-11-08 — v1.9.0 · Correctif CSS perdu, réalisations en photos plein écran, « Revoir » en plein écran

- **Correctif** : trois blocs CSS supprimés par erreur en v1.6.0 sont rétablis — bandeau défilant des spécialités
  (sur mobile, les noms s'affichaient en un bloc de texte brut), index des spécialités de `/specialites/` et liste
  éditoriale de `/services/`. Contrôle ajouté : chaque classe personnalisée utilisée dans les composants existe en CSS.
- **Réalisations** : photos plein écran collantes qui changent au fil du défilement (volet vertical, léger zoom) ;
  sur chaque photo, seulement l'essentiel : « Projet type 0X », spécialité en grand, trois contraintes clés en
  pastilles, « Démarrer un projet similaire » + « La spécialité ». Fiche détaillée retirée (trop de texte, doublons).
  Radiologie (dessin) remplacée par gastro-entérologie (photo d'endoscopie) pour n'avoir que des photos.
- **« Revoir la construction »** : la planche repasse en plein écran (même mise en scène que l'introduction, bouton
  « Retour au site », Échap / molette / glissement), puis reprend sa place dans le héros.
- Vérifications : `npm run verify` sans erreur bloquante, axe-core 0 violation, largeur mobile = écran, captures
  1440 et 390 px sans erreur console.

## 2026-11-08 — v1.8.1 · Expertises desktop comme avant

- Desktop : retour au comportement précédent (première bande ouverte, la bande survolée s'élargit, libellés
  verticaux sur les autres, pas de bouton « + »/« × »). Mobile : l'accordéon replié au toucher est conservé.

## 2026-11-08 — v1.8.0 · Expertises repliées au clic, fiche projet des réalisations

- **Expertises** : les quatre bandes sont repliées au départ (numéro en contour or, titre, bouton « + ») ; un clic
  ouvre la bande (desktop : elle s'élargit ×4,2, les autres passent en libellé vertical, « × » pour refermer ;
  mobile : accordéon, image + détail). Boutons `aria-expanded`, détail `inert` quand replié, Échap referme. Sans JS,
  tout reste déplié.
- **Réalisations** : chaque projet type devient une **fiche projet** façon cartouche d'architecte : grand numéro en
  contour, titre (H1 de la spécialité), description, puis tableau « Plan type » (dessin), « Contraintes »
  (pastilles), « Livrables » (numérotés), « À valider » (✓), « Services » (liens) ; les lignes se dessinent à
  l'arrivée du projet ; CTA or « Démarrer un projet similaire » + « La spécialité ». Données réelles du contenu.
- Vérifications : `npm run verify` sans erreur bloquante, axe-core 0 violation, captures 1440 et 390 px.

## 2026-11-08 — v1.7.0 · Introduction plein écran mémorisée, maquette en vitrine, comparatif glissant, correctif mobile

- **Correctif mobile important** : le tableau « Pourquoi ESM » élargissait la page à 1 059 px sur téléphone (le
  navigateur dézoomait tout l'accueil → rendu flou/pixelisé). Colonnes de grille en `minmax(0, 1fr)` + `min-w-0` :
  largeur de page = largeur d'écran sur toutes les pages testées.
- **Introduction plein écran à la première visite** (accueil, 3D disponible) : la maquette se construit en ~20 s avec
  le titre de l'étape en cours ; « Passer l'introduction », Échap, molette ou glissement l'interrompent ; à la fin, la
  planche rejoint sa place à côté du titre. **Mémorisée** (`localStorage` `esm-intro-v1`) : au rechargement, plus
  d'intro. Garde-fou : si la scène n'est pas prête en 7 s, la page s'affiche normalement.
- **Héros ensuite** : la maquette livrée tourne lentement (vitrine) ; bouton « Revoir la construction » + pause ; les
  étapes relancent la lecture à partir de l'étape choisie.
- Cartouche « Plan type · Cabinet dentaire · Illustration ESM » retiré (peu lisible).
- **Pourquoi ESM sur mobile** : une rangée de fiches qui glisse (une par sujet : sans / avec ESM), indication
  « Faites glisser pour comparer ».
- Higgsfield : connecteur actif mais en lecture seule dans cette session (catalogue, historique, crédits) — aucune
  génération possible ici ; compte gratuit à 0 crédit.

## 2026-11-08 — v1.6.0 · Défilement normal, brief de projet, spécialités en panneau, réalisations qui défilent

- **Défilement normal partout** : plus aucune section épinglée ni effet piloté par le défilement sur l'accueil ;
  GSAP n'est plus chargé (script d'accueil allégé, IntersectionObserver uniquement).
- **Maquette 3D en lecture automatique** dans la planche du héros (28 s par construction, pause de 3,5 s, boucle),
  étapes cliquables avec barres de progression, bouton pause (WCAG 2.2.2), lecture suspendue hors écran.
  Chargée seulement à l'approche de l'écran ; libérée quand on s'en éloigne sur appareil modeste.
- **Netteté sur téléphone** : densité de pixels jusqu'à 2× (1,75× en mode allégé), anticrénelage toujours actif.
- **Héros** : titre sur deux lignes + **brief de projet en une phrase** (« Je prépare une [création] en [spécialité] à
  [ville] ») qui ouvre /contact/ avec le formulaire pré-rempli (nature, spécialité, ville) ; lien WhatsApp si
  renseigné. Plus de boutons classiques.
- **Spécialités** : clic sur une pièce du plan = panneau latéral (« page virtuelle » : contraintes, offre, points à
  valider, services liés, CTA) ; l'adresse devient celle de la vraie page (partageable, indexée), « Retour » ferme.
- **Expertises** : bandes d'images au survol, sans épinglage.
- **Réalisations** : image collante qui change (volet vertical) quand chaque projet type passe au centre de l'écran ;
  filet or sur le projet en cours. Cartes empilées retirées.
- Vérifications : `astro check` 0/0/0, `npm run verify` sans erreur bloquante, axe-core 0 violation, captures 1440,
  1280 et 390 px (3×) sans erreur console, panneau + historique testés.

## 2026-11-08 — v1.5.0 · Héros en planche, bandes d'expertises, comparatif, plan des spécialités, projets types

- **Héros** : titre éditorial (lignes qui montent, « soigner » souligné or), chapô + actions sous un filet ; la
  maquette 3D est une planche encadrée avec cartouche à côté du titre (sous le titre sur mobile) et s'étire en plein
  écran au premier défilement ; le titre disparaît avant que la planche ne s'ouvre (plus aucun chevauchement).
- **Expertises** : quatre bandes d'images jointives ; la bande active s'élargit (défilement épinglé ou survol) et
  affiche numéro, texte et services liés ; mobile : panneaux empilés.
- **Pourquoi ESM** : tableau comparatif « Plusieurs prestataires / Avec ESM » (6 lignes, colonne ESM surlignée qui se
  remplit au défilement, mention banques + « Sous réserve d'acceptation du dossier par la banque. »).
- **Spécialités (accueil)** : plan d'un centre médical, une pièce par spécialité (murs navy, portes, trame), pièce
  active teintée, cartouche avec la contrainte principale (`SpecPlan.astro`). `/specialites/` garde `SpecIndex`.
- **Réalisations** : tant qu'aucune étude de cas n'est publiée, 4 projets types en cartes qui s'empilent (photo ou plan
  type, offre réelle de la spécialité), légende « Images d'illustration et plans types ».
- **Appareils modestes** : WebGL désactivé si économiseur de données ou moins de 2 Go ; mode `gl-lite` (sans ombres
  ni anticrénelage, densité 1×, 30 i/s) si moins de 4 Go, 4 cœurs ou moins, ou réseau 2G/3G ; contexte de détection
  libéré aussitôt ; repli automatique sur le plan statique si le navigateur perd le contexte WebGL.
- Retirés : manifeste mot à mot, images insérées, piliers dessinés, image révélée.
- Vérifications : `astro check` 0/0/0, `npm run verify` sans erreur bloquante, axe-core 0 violation, captures 1440 et
  390 px (modes complet et allégé) sans erreur console.

## 2026-11-08 — v1.4.0 · Maquette 3D dessinée, titre hors de la scène, sections plus riches

- **Maquette 3D** (`clinic-scene.ts`) : plan coté d'architecte (poché navy, cotes 16,00 × 10,00 m, débattements de
  portes, fenêtres, surfaces des pièces, emprises des équipements, marche en avant, flèche du nord) ; réseaux encastrés
  (fluides teal, électricité or) qui se dessinent depuis le local technique ; menuiseries et vitrages ; coupe à 1,15 m ;
  19 équipements détaillés (units avec scialytique et tabourets, accueil, attente, paillasse de stérilisation avec
  autoclave, compresseur, aspiration, TGBT, sanitaires, plantes) ; ombres douces ; pastilles de PV à la livraison.
  Dimensions d'un plan d'illustration, pas d'un projet réel.
- **Texte hors de la scène** : titre en colonne gauche (maquette décalée à droite), qui disparaît dès le premier
  défilement ; étapes en légende compacte en bas à gauche ; sommaire cliquable des 4 étapes à droite (desktop).
- **Section « méthode » retirée de l'accueil** : le parcours 3D (Concevoir · Construire · Équiper · Livrer) la remplace.
- **Expertises** : panneaux image + services liés (liens internes), image qui s'ouvre, contenu qui monte, mot géant en
  arrière-plan, étapes 01–04 actives.
- **Manifeste** : images insérées dans la phrase, qui s'ouvrent au défilement ; trois piliers dessinés au trait.
- Vérifications : `astro check` 0/0/0, `npm run verify` sans erreur bloquante, axe-core 0 violation, captures 1440 et
  390 px sans erreur console.

## 2026-11-08 — v1.3.0 · Accueil immersif 3D, fin des grilles de cartes

- **Parcours 3D** (`src/scripts/clinic-scene.ts`, three.js 0.170, chargé à la demande) : la maquette d’un cabinet
  dentaire passe du plan (circuit patient or) aux murs, puis en coupe à 1,15 m avec sols teintés et équipements ;
  quatre chapitres (Concevoir, Construire, Équiper, Livrer) pilotés par le défilement (GSAP ScrollTrigger 3.15).
  Principes repris d’`AbstractThreeScene` du SDK `paycii/ssagency-sdk-angular` (cadence plafonnée, pause hors écran,
  libération des ressources). Le SDK n’a pas été modifié.
- **Après le héros, plus de cartes** (direction taste-skill + UI UX Pro Max, palette et polices de marque conservées) :
  expertises en panneaux plein cadre à défilement horizontal épinglé avec profondeur d’image ; manifeste
  « Pourquoi ESM » qui s’allume mot à mot ; bandeau défilant des 14 spécialités ; index typographique des spécialités
  avec plan type collant (`SpecIndex.astro`) ; méthode en frise verticale qui se remplit avec compteur ; image
  révélée au défilement pour les réalisations.
- `/specialites/` : grille de cartes remplacée par `SpecIndex` ; `/services/` : liste éditoriale `ServiceIndex`
  (balayage navy au survol).
- Détection WebGL + « réduire les animations » dans le `<head>` (classe `webgl`) : sans elle, contenu empilé, rien
  d’épinglé, aucun script 3D chargé.
- Vérifications : `astro check` 0/0/0, `npm run verify` sans erreur bloquante, axe-core 0 violation (accueil mobile,
  /services/, /specialites/), captures 1440 et 390 px sans erreur console.

## 2026-11-08 — v1.2.0 · Nouveau logo choisi par le client

- Logo redessiné en vecteur d’après la planche fournie : monogramme ESM dégradé navy → teal, toiture or avec cheminée,
  arc or, nom sur deux lignes justifiées, signature or.
- Géométrie unique `src/data/logo.json` partagée entre `Logo.astro` et `public/brand/` (11 fichiers), favicon,
  icônes et images de partage regénérés.
- En-tête : symbole + nom ; footer : logo blanc + signature en texte lisible ; styleguide mis à jour.

## 2026-11-08 — v1.1.0 · Affinage de la direction artistique

**Fait**
- Photographie : 10 photos faibles ou hors sujet retirées ; 5 photos sous licence libre ajoutées (bloc opératoire,
  équipements intégrés, unité d'endoscopie, aménagement intérieur en cours, circulation à lumière naturelle),
  crédits détaillés (auteur, licence, source). Règle : hubs sans visuel, pages détail avec photo pertinente ou
  dessin technique original (`Visual`), une photo au plus deux fois.
- Accueil en français (« Des espaces conçus pour mieux soigner. »), signature anglaise seule conservée ; transition
  héros → expertises sans double marge (photo à cheval sur les deux fonds) ; processus Découvrir · Concevoir ·
  Construire · Livrer ; « Pourquoi ESM » et CTA final en français.
- Nouveau gabarit de page service (L'essentiel, approche + schéma, livrables numérotés, termes expliqués en
  accordéon, FAQ, liens associés en 3 colonnes). Pages spécialités : approche + carte technique quand le héros est
  un dessin.
- Composants `SectionHeading`, `Visual` ; `PageHero` accepte une photo ou un dessin.
- Footer en 4 colonnes, liens plus grands, version mobile compacte ; logo d'en-tête agrandi.
- Révélations au défilement déclenchées dès l'entrée dans l'écran (corrige des blocs vides sur mobile).
- Financement : « traité en priorité » et « conditions préférentielles » retirés (non validés par écrit) ;
  « financement sans intérêt » reformulé.
- Images de partage regénérées en français.

**Vérifications** : `npm run verify` OK · axe-core OK sur 19 pages · aucune erreur console · aucun débordement
(390 / 1 440 px) · Lighthouse mobile : accueil 99/100/100/100, service 100 ×4, spécialité 100 ×4, CLS 0.

## 2026-11-07 — v1.0.0 · Refonte complète de l'identité et du site

**Fait**
- Nouvelle identité : logo vectoriel (symbole plan + monogramme E·S·M + ligne de cote), 4 variantes de couleur,
  versions horizontale, verticale et symbole (`public/brand/`), favicon, icônes, images de partage avec photo.
- Palette officielle (navy, teal, or, warm white, soft grey) et typographies Manrope + Inter ; Cormorant supprimée.
- Animations ramenées à 200–400 ms ; zoom continu et parallaxe supprimés.
- En-tête blanc collant (Accueil, Expertises, Réalisations, À propos, Contact + « Parler de mon projet »),
  menu mobile blanc, footer navy (coordonnées affichées seulement si renseignées).
- Accueil reconstruit : héros éditorial + grande photo, 4 expertises, processus en 4 étapes, réalisations
  (état vide élégant), « Pourquoi ESM », appel final sur photo.
- Nouvelle page `/expertises/` regroupant les 10 services en 4 expertises + spécialités + méthode.
- Pages internes : en-tête clair avec photo par service et par spécialité, introductions longues déplacées dans le
  corps et découpées en paragraphes courts, cartes allégées, plans schématiques en version claire.
- 17 photos d'illustration sous licence Unsplash (`src/lib/photos.ts`), créditées, jamais présentées comme des
  réalisations ESM. Carte de réalisation : nom, spécialité, catégorie, ville, « View project ».
- Styleguide réécrit (logos, couleurs, typographie, composants, mouvement). DESIGN.md réécrit.

**Vérifications** : `npm run verify` OK (72 pages) · axe-core OK sur 19 pages · aucune erreur console ·
aucun débordement horizontal (390 px et 1 440 px) · menu mobile (ouverture, focus, Échap) · Lighthouse mobile :
accueil 99/100/100/100 (LCP 2,0 s, CLS 0), page service 100/100/100/100.

## 2026-11-06 — v0.4.1 · Brief médias

- Ajout de `docs/MEDIAS.md` : liste priorisée des photos et vidéos, emplacement sur le site, formats, règles de prise
  de vue, livraison des fichiers. Lien depuis CLAUDE.md et BESOINS.md.

## 2026-11-06 — v0.4.0 · Conformité légale (checklist 20 points)

**Fait**
- Politique de confidentialité complète : données collectées et non collectées, finalités, durée, sous-traitants
  (Vercel, Resend, Plausible, Meta/WhatsApp), transferts hors Maroc, droits, procédure de suppression (`#suppression`)
  avec lien e-mail prérempli, mineurs, absence de prospection sans accord, sécurité.
- Nouvelle page `/conditions-utilisation/` (devis sans engagement, pas de vente ni de paiement en ligne, informations
  indicatives, propriété intellectuelle, liens externes, droit marocain).
- Bandeau de cookies granulaire (mesure / publicité décochées), boutons de même poids, retrait = rechargement ; clé
  `esm-consent-v2`. Politique de cookies mise à jour.
- Formulaire : plus d'option de financement présélectionnée ; mention du droit de suppression.
- « Devis gratuit » retiré (non confirmé) ; affirmations non confirmées sur l'organisation adoucies.
- Mentions légales : crédits et licences (polices OFL, illustrations originales).

**Vérifications** : `npm run verify` OK (71 pages) · axe-core OK (bandeau ouvert + 4 pages légales) · navigation
clavier testée (lien d'évitement, méga-menus) · consentement testé (défaut décoché, refus enregistré).

## 2026-11-05 — v0.3.1 · Sécurité du formulaire de devis

**Fait**
- Audit : aucun secret dans le code ni dans l'historique Git ; `RESEND_API_KEY` absente du build.
- `api/devis.js` renforcée : Content-Type JSON obligatoire, corps ≤ 20 ko, vérification de l'origine, liste blanche
  de champs tronqués, validation (e-mail, téléphone, nature, calendrier, spécialité, surface), objet d'e-mail sur
  une ligne, `Cache-Control: no-store`, erreurs génériques.
- Règle n° 9 (sécurité) ajoutée à CLAUDE.md.

**Vérifications** : 14 scénarios testés (méthode, origine, type, champs, piège, débit) · `npm run verify` OK.

## 2026-11-05 — v0.3.0 · Vocabulaire orienté savoir-faire, services experts

**Fait**
- 79 définitions du « Vocabulaire de votre spécialité » et 42 termes du glossaire général réécrits à la voix active,
  ton « solution de construction » (réseaux, électricité, menuiserie sur-mesure, ventilation, ergonomie, normes).
  La section garde la même mise en page.
- Services : 10 introductions réécrites avec le vocabulaire technique marocain (BPDE, CPS, OS, situations de travaux,
  DOE, TGBT, CTA, gaz médicaux, équivalent plomb, AMSSNuR, autoclave classe B, DASRI, Intelaka, Mourabaha…).
- Nouveaux champs `termes` (étiquettes sur les cartes de `/services/`) et `savoirFaire` (section « Notre savoir-faire
  technique » sur chaque page service) ; paragraphe « Notre expertise » sur `/services/`.
- Introduction de `/glossaire/` adaptée.

**Vérifications** : `astro check` 0/0/0 · build OK · `audit:seo` OK · axe-core OK (services, service, spécialité, glossaire).

## 2026-11-05 — v0.2.0 · Blog, banques partenaires, vocabulaire métier

**Fait**
- 12 guides rédigés (≈ 5 200 mots) et publiés ; 3 derniers guides sur l’accueil ; guides liés sur chaque service.
- Partenariats signés avec Al Barid Bank et Bank Al Yousr : noms affichés par défaut (accueil, financement,
  première installation), pages partenaires indexées et enrichies (profils, produits, pièces du dossier, FAQ).
  Aucun taux ni délai chiffré.
- Vocabulaire professionnel : champ `lexique` sur les 14 spécialités (79 termes) + page `/glossaire/` (121 termes,
  JSON-LD DefinedTermSet).
- Nouvelle page `/premiere-installation/` (jeunes praticiens : 7 étapes, financement, check-list).
- Styles des listes numérotées dans les articles ; cartes produits élargies sur les pages bancaires.
- Documentation : `docs/ARCHITECTURE.md`, `docs/BESOINS.md` (besoins + benchmark international).

**Vérifications** : `astro check` 0/0/0 · build sans avertissement · `audit:seo` OK (70 pages, 67 indexables) ·
axe-core WCAG 2.2 AA OK sur les nouvelles pages.

## 2026-11-05 — v0.1.0 · Création du site

**Fait**
- Socle Astro 7.4 + Tailwind 4 + TypeScript strict, déploiement Vercel (`vercel.json` : CSP, HSTS, redirections 301).
- Contenu importé du rapport : 10 services, 14 spécialités, 12 régions (texte propre à chacune), 12 articles en brouillon.
- Pages : accueil, services, spécialités, 2 pages piliers (aménagement, rénovation), zones d'intervention, financement
  (+ 2 pages partenaires masquées), réalisations (états vides), blog, FAQ, à propos, contact, légal, plan du site,
  styleguide, 404 — 56 pages.
- Design : bleu nuit / blanc cassé / or champagne, Cormorant Garamond + Manrope, plans d'architecte SVG génératifs
  (`PlanArt`) à la place des photos, carte schématique du Maroc.
- Animations : zoom lent du héros, titres ligne par ligne, révélations clip-path, survols de cartes, parallaxe,
  comparateur avant/après accessible, visionneuse, compteurs, View Transitions natives, reduced-motion.
- SEO : composant `Seo` (canonical auto-référencé, OG/Twitter, JSON-LD @graph), sitemap filtré, robots.txt,
  images OG 1200×630, script `audit:seo`.
- Conversion : formulaire de devis (champ financement, consentement 09-08, champ piège), fonction `api/devis.js`
  (Resend, limitation de débit), barre WhatsApp + devis fixe sur mobile, bouton WhatsApp flottant sur desktop.
- Conformité : bandeau cookies, Plausible et pixel Meta chargés après consentement ; mentions bancaires derrière
  `BANK_CLAIMS_APPROVED`.

**Vérifications** : `astro check` 0 erreur/0 avertissement · build sans avertissement · `audit:seo` OK ·
axe-core WCAG 2.2 AA OK (6 pages) · Lighthouse mobile accueil 100/100/100/100 (LCP 1,7 s, CLS 0, TBT 0 ms).

**À faire ensuite** : renseigner les variables d'environnement, ajouter les 5 réalisations, valider les mentions
bancaires par écrit, rédiger les 12 articles, compléter mentions légales et équipe.
