# Architecture du site — Euro Space Medical

État au 2026-11-05 · 70 pages générées · 67 indexables.

## 1. Arborescence des pages (silos SEO)

```
/                                   Accueil : héros éditorial + photo, 4 expertises, processus en 4 étapes,
│                                   réalisations*, « Pourquoi ESM », appel final
│
├── /expertises/                    4 expertises (étude & conception, construction & rénovation, équipement,
│                                   accompagnement global) → services liés, spécialités, méthode
├── /services/                      Index des 10 services
│   ├── etude-faisabilite-programmation-medicale/
│   ├── conception-amenagement-cabinet-medical/
│   ├── reseaux-techniques-fluides-medicaux/
│   ├── travaux-amenagement-cabinet-clinique/
│   ├── renovation-cabinet-clinique-site-occupe/
│   ├── salles-imagerie-radioprotection/
│   ├── equipement-medical-mobilier-technique/
│   ├── design-interieur-experience-patient/
│   ├── hygiene-sterilisation-dechets-medicaux/
│   └── financement-lancement-suivi-projet-medical/
│
├── /specialites/                   Index des 14 spécialités
│   ├── cabinet-dentaire-orthodontie/         chaque page : contraintes, plan type, offre,
│   ├── radiologie-imagerie-medicale/         autorisations, vocabulaire de la spécialité,
│   ├── ophtalmologie/                        réalisations*, FAQ, services liés
│   ├── orl-audiologie/
│   ├── gynecologie-echographie-pma/
│   ├── pediatrie/
│   ├── dermatologie-medecine-esthetique/
│   ├── cardiologie-explorations-fonctionnelles/
│   ├── kinesitherapie-reeducation/
│   ├── gastro-enterologie-endoscopie/
│   ├── laboratoire-analyses-medicales/
│   ├── cliniques-blocs-operatoires/
│   ├── medecine-generale-cabinets-de-groupe/
│   └── psychiatrie-psychologie/
│
├── /amenagement-cabinet-medical/   PAGE PILIER n° 1 (mot-clé principal)
│   └── 12 régions : casablanca-settat, rabat-sale-kenitra, tanger-tetouan-al-hoceima, fes-meknes,
│       marrakech-safi, souss-massa, beni-mellal-khenifra, draa-tafilalet, oriental, guelmim-oued-noun,
│       laayoune-sakia-el-hamra, dakhla-oued-ed-dahab
│
├── /renovation-cabinet-clinique/   PAGE PILIER n° 2 (rénovation en site occupé)
├── /premiere-installation/         Jeunes médecins et dentistes : parcours en 7 étapes + financement
├── /zones-intervention/            Carte schématique + 12 régions
│
├── /financement/                   5 formules, offre « Projet financé »
│   ├── al-barid-bank/              Crédit professionnel, Intelaka (partenariat signé)
│   └── bank-al-yousr/              Mourabaha, Ijara (partenariat signé)
│
├── /realisations/                  Portfolio avant/après* (noindex tant que vide)
│   └── [slug]/                     Étude de cas : chiffres, défi, solution, comparateur, galerie, témoignage
│
├── /blog/                          12 guides publiés
│   └── [slug]/
├── /glossaire/                     121 termes (chantier, autorisations, matériaux, financement, 14 spécialités)
├── /faq/                           FAQ générale + services + spécialités
├── /a-propos/                      Piliers, équipe*, assurances*, partenaires*
├── /contact/                       Formulaire de devis + contact direct
├── /mentions-legales/ · /conditions-utilisation/ · /confidentialite/ · /cookies/ · /plan-du-site/
├── /merci/                        Remerciement après devis (noindex) : compte le Lead une fois
├── /lp/cabinet-dentaire/           Page d'annonce Meta (noindex, hors sitemap), formulaire court
├── /lp/premiere-installation/      Page d'annonce Meta (noindex, hors sitemap), nature « Création »
├── /lp/renovation/                 Page d'annonce Meta (noindex, hors sitemap), nature « Rénovation »
├── /styleguide/                    Interne (noindex) : tokens et animations
└── 404 · robots.txt · sitemap-index.xml
```
`*` = section qui s’affiche ou se complète dès que l’entreprise fournit le contenu (voir `docs/BESOINS.md`).

## 2. Maillage interne

| Depuis | Vers |
|---|---|
| En-tête | Accueil, Expertises, Réalisations, À propos, Contact + « Parler de mon projet » (menu mobile : + services, spécialités, financement, zones, guides) |
| Pied de page | 4 expertises, toutes les spécialités, réalisations, financement, première installation, aménagement, zones, guides, glossaire, FAQ, légal |
| Service | Spécialités concernées, 4 services suivants, guides liés |
| Spécialité | ≥ 3 services liés, 2 spécialités voisines, rénovation, glossaire, réalisations de la spécialité |
| Région | 4 services clés, autres régions, zones d’intervention |
| Guide | Services liés + liens dans le texte vers services et spécialités |
| Toutes | Fil d’Ariane, barre WhatsApp/devis (mobile), bouton WhatsApp (desktop), bandeau d’appel à l’action |

## 3. Parcours de conversion

1. **Entrée** : Google (service, spécialité, région, guide), Instagram/Facebook (réalisations, financement), WhatsApp.
2. **Réassurance** : méthode en 6 étapes, vocabulaire de la spécialité, autorisations, banques partenaires, FAQ, réalisations.
3. **Action** : `/contact/` (formulaire pré-rempli par la spécialité via `?specialite=`) ou WhatsApp avec message
   pré-rempli selon la page consultée.
4. **Traitement** : `api/devis.js` → e-mail (Resend) ; à brancher ensuite sur un CRM.

## 4. Architecture technique

- **Astro 7** statique, sortie `dist/` → Vercel (CDN). Une seule fonction serverless : `api/devis.js`.
- **Contenu** : JSON (`src/data/`) et Markdown (`src/content/`) validés par Zod au build ; un champ trop long
  (title > 60, description hors 140–155) fait échouer le build.
- **SEO** : composant `Seo` (title, description, canonical absolu, robots, Open Graph, Twitter, JSON-LD `@graph`),
  sitemap filtré, `audit:seo` bloquant.
- **JSON-LD** : Organization, WebSite, LocalBusiness (HomeAndConstructionBusiness), Service, BreadcrumbList,
  FAQPage, Article, DefinedTermSet (glossaire).
- **Performance** : aucune bibliothèque JS, polices auto-hébergées préchargées, SVG plutôt que photos, CSS unique.
- **Conformité** : consentement avant Plausible et pixel Meta, CSP stricte, en-têtes de sécurité.
