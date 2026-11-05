# Journal des changements

> Ajouter chaque modification **en haut**, datée, avec : ce qui a changé, pourquoi, fichiers clés, et l'état des vérifications.

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
