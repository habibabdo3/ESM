# Journal des changements

> Ajouter chaque modification **en haut**, datée, avec : ce qui a changé, pourquoi, fichiers clés, et l'état des vérifications.

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
