# Médias à produire — brief photo et vidéo

> Objectif : remplacer les plans SVG (`PlanArt`) par de vraies images aux endroits où elles prouvent le savoir-faire,
> et nourrir Instagram / Facebook. Chaque visuel est relié à un emplacement précis du site et à son animation.

## 0. Ce qui manque le plus (constat du 2026-11-08)

Les banques d'images libres ne fournissent pas de photos haut de gamme pour : **salle scanner / cone beam, salle de
radiologie, salle d'endoscopie, chantier médical en cours, rendus 3D**. Ces pages utilisent aujourd'hui un dessin
technique. Les photos de vos projets (ou une banque payante : Adobe Stock, Getty) les remplaceront directement :
il suffit de les ajouter dans `src/assets/photos/` et de les déclarer dans `src/lib/photos.ts`.

## 1. Priorités

| Priorité | Média | Où sur le site | Animation qui le met en valeur |
|---|---|---|---|
| **P1** | 1 photo ou 1 vidéo de héros | Accueil, plein écran | Zoom lent 22 s (1,08 → 1) + voile bleu nuit |
| **P1** | 5 réalisations : paires avant/après + 6 à 10 photos chacune | `/realisations/`, accueil, pages spécialités | Comparateur avant/après, révélation au défilement, visionneuse plein écran, transition carte → page |
| **P1** | Logos officiels Al Barid Bank et Bank Al Yousr (SVG) | Financement, accueil, première installation | Aucune (logos statiques, règles de marque des banques) |
| **P2** | Portraits de l'équipe (3 à 6 personnes) | `/a-propos/` | Révélation au défilement |
| **P2** | Photos de chantier en cours (12 à 20) | Méthode (6 étapes), rénovation en site occupé, Instagram | Parallaxe légère sur les grandes images |
| **P2** | 1 photo par spécialité (14) et par service (10) | Héros des pages spécialités et services, cartes | Zoom au survol des cartes |
| **P2** | Vidéo de présentation 60–90 s | Accueil (section approche), réseaux sociaux | Lecture à la demande (pas d'autoplay sonore) |
| **P3** | Reels verticaux 15–45 s | Instagram, Facebook, TikTok | — |
| **P3** | Rendus 3D et plans réels anonymisés | Service conception, études de cas | Révélation au défilement |
| **P3** | Visite virtuelle 360° d'un projet livré | Page de la réalisation | Intégration après consentement |
| **P3** | Témoignages vidéo de praticiens (avec accord écrit) | Réalisations, accueil | — |

**Minimum pour lancer** : la photo ou vidéo de héros, au moins 2 réalisations complètes (avant/après), les logos des banques.

## 2. Détail par média

### Héros de l'accueil
- **Photo** : salle de soins ou accueil d'un projet livré, très soigné, lumières allumées. Format horizontal,
  **2 400 × 1 350 px minimum** (idéal 3 000 px de large). Garder **le tiers gauche calme et sombre** : le titre s'y affiche.
- **Vidéo (option)** : plan-séquence lent au stabilisateur (travelling avant ou latéral), **10–15 s en boucle**, sans son,
  1 920 × 1 080, MP4 H.264 + WebM, **moins de 4 Mo**, avec une image fixe extraite (poster) pour le chargement.
- Pas de mouvement rapide, pas de zoom numérique : l'animation du site ajoute déjà le mouvement.

### Réalisations (5 projets)
Pour chaque projet :
- **2 à 3 paires avant/après prises exactement du même point** (même position du pied, même hauteur ≈ 1,40 m, même
  focale, même cadrage). C'est indispensable pour le comparateur glissant.
- **6 à 10 photos de galerie** : accueil, salle d'attente, salle de soins vue d'ensemble, poste de travail en détail,
  stérilisation, local technique (propre et étiqueté), menuiserie sur-mesure, signalétique, un détail de finition
  (plinthe à gorge, joint de sol soudé, prise de fluide).
- **1 photo de chantier** par étape clé si possible (cloisons, réseaux, revêtements).
- Fiche texte : spécialité, ville, surface (m²), durée, lots réalisés, difficulté, solution, date de livraison.
- **Accord écrit du client** pour chaque photo publiée (et pour le témoignage, s'il y en a un).

### Équipe
- Portraits en buste, **format vertical 4:5**, même fond neutre ou sur chantier, même lumière pour tous.
- Une photo de groupe horizontale (pour l'à-propos et la page Facebook).
- Une photo « en action » par métier : relevé sur site, revue de plans, réunion de chantier.

### Chantier en cours (méthode et rénovation)
- Les 6 étapes : visite technique et relevé, plans/3D à l'écran, réunion avec le praticien, chantier (cloisons,
  réseaux), installation d'un équipement, réception avec procès-verbal.
- **Rénovation en site occupé** : cloisons provisoires étanches, sas, protections des sols, signalétique de chantier.
  Ce sont les images qui prouvent votre différence face aux concurrents.

### Une image par spécialité et par service
- Photos horizontales **4:3**, 1 600 px de large minimum. Elles proviennent idéalement de vos réalisations.
- À défaut d'avoir les 24, on garde les plans SVG actuels sur les pages restantes : le site reste cohérent.

### Vidéos pour les réseaux sociaux
- **Vidéo de présentation (60–90 s, 16:9)** : le dirigeant présente la promesse en 3 phrases, images de chantier et de
  projets livrés, fin sur le site et le WhatsApp. Sous-titres en français (beaucoup regardent sans le son).
- **Reels verticaux 9:16** (15–45 s) : « un cabinet en 12 semaines » en accéléré, avant/après en fondu, un détail
  technique expliqué (local technique, stérilisation, blindage), un conseil financement.
- Filmer en **4K, 25 ou 30 images/s**, au stabilisateur, avec un micro-cravate pour la voix.

## 3. Règles de prise de vue

- **Lumière** : toutes les lumières allumées, même température de couleur (≈ 4 000 K), stores réglés, pas de reflet
  dans les vitrages. Privilégier la lumière du jour en complément.
- **Lignes droites** : verticales parfaitement verticales (corriger la perspective), éviter l'ultra grand-angle
  déformant (pas en dessous de 16 mm plein format).
- **Propreté** : câbles cachés, plans de travail dégagés, pas de cartons ni d'outils dans le champ (sauf photos de chantier).
- **Étalonnage** : tons neutres légèrement chauds, cohérents avec le site (blanc cassé, bleu nuit). Même traitement pour
  toutes les photos d'un projet.
- **Interdit** : visages de patients, dossiers ou écrans montrant des données de patients, plaques d'immatriculation,
  images de banques d'images.
- Les logos de marques d'équipement visibles sont acceptables ; demander l'accord du fournisseur si on les met en avant.

## 4. Livraison des fichiers

- Photos : **JPG haute qualité, sRGB, pleine résolution** (le site génère automatiquement AVIF/WebP et les tailles).
  Garder les RAW en archive.
- Vidéos : MP4 H.264 (master) ; le site utilisera une version allégée + une image poster.
- Nommage : `ville-specialite-sujet-01.jpg` (ex. `casablanca-dentaire-salle-soins-01.jpg`), en minuscules, sans accents.
- Réalisations : un dossier par projet → `src/assets/realisations/<slug>/` (`avant-01.jpg`, `apres-01.jpg`, `01.jpg`…).
- Joindre pour chaque photo une **légende courte** (ce qu'on voit) : elle servira de texte alternatif (accessibilité, SEO).

## 5. Ce qui se fait ensuite côté site

1. Héros de l'accueil : photo ou vidéo à la place du plan SVG (l'image reste affichée immédiatement, sans fondu).
2. Réalisations publiées → le noindex est retiré, elles apparaissent sur l'accueil et les pages spécialités.
3. Images Open Graph (partage WhatsApp, Facebook) regénérées à partir des vraies photos.
4. Page à-propos avec l'équipe ; section partenaires avec les logos des banques.
5. Contrôle Lighthouse et poids des pages après intégration (objectif : score 95 et plus, CLS 0).
