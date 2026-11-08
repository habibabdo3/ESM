/**
 * Photographies d'illustration sous licence libre. Elles NE représentent PAS des réalisations d'Euro Space Medical :
 * ne jamais les présenter comme telles (les vraies réalisations vont dans src/content/realisations/).
 * Chaque photo porte sa source, son auteur et sa licence ; crédits affichés sur /mentions-legales/.
 * Règle de direction artistique : une photo n'apparaît qu'en contexte, deux fois au plus ; à défaut de photo
 * pertinente, on utilise un dessin technique original (PlanArt) plutôt qu'une image hors sujet.
 * Remplacer par les photos des projets ESM dès qu'elles existent (voir docs/MEDIAS.md).
 */
import type { ImageMetadata } from 'astro';
import hallClinique from '@/assets/photos/hall-clinique.jpg';
import cabinetDentaire from '@/assets/photos/cabinet-dentaire.jpg';
import cabinetDentaire2 from '@/assets/photos/cabinet-dentaire-2.jpg';
import cabinetDentaire3 from '@/assets/photos/cabinet-dentaire-3.jpg';
import laboratoire from '@/assets/photos/laboratoire.jpg';
import salleIntervention from '@/assets/photos/salle-intervention.jpg';
import blocOperatoire from '@/assets/photos/bloc-operatoire.jpg';
import equipementBloc from '@/assets/photos/equipement-bloc.jpg';
import endoscopie from '@/assets/photos/endoscopie.jpg';
import chantierAmenagement from '@/assets/photos/chantier-amenagement.jpg';
import couloirLumiere from '@/assets/photos/couloir-lumiere.jpg';

export interface Photo {
  src: ImageMetadata;
  alt: string;
  source: string;
  author: string;
  license: string;
  licenseUrl: string;
}

const unsplash = (id: string) => ({
  source: `https://unsplash.com/photos/${id}`,
  author: 'Unsplash',
  license: 'Licence Unsplash',
  licenseUrl: 'https://unsplash.com/license',
});
const commons = (file: string, author: string, license: 'CC0 1.0' | 'CC BY 2.0' | 'CC BY 4.0' | 'CC BY-SA 3.0') => ({
  source: `https://commons.wikimedia.org/wiki/File:${file}`,
  author,
  license,
  licenseUrl: {
    'CC0 1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
    'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/',
    'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
    'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  }[license],
});

export const photos = {
  hallClinique: { src: hallClinique, alt: 'Hall lumineux d’un centre médical contemporain, sol en marbre et cloisons vitrées', ...unsplash('1631248055158-edec7a3c072b') },
  cabinetDentaire: { src: cabinetDentaire, alt: 'Cabinet dentaire lumineux avec fauteuil et mobilier sur-mesure', ...unsplash('1629909613654-28e377c37b09') },
  cabinetDentaire2: { src: cabinetDentaire2, alt: 'Salle de soins dentaire avec unit et rangements intégrés', ...unsplash('1629909615184-74f495363b67') },
  cabinetDentaire3: { src: cabinetDentaire3, alt: 'Salle de soins dentaire aux stores filtrants et plans de travail blancs', ...unsplash('1629909613638-0e4a1fad8f81') },
  laboratoire: { src: laboratoire, alt: 'Laboratoire d’analyses avec paillasses et automates alignés', ...unsplash('1579154204601-01588f351e67') },
  salleIntervention: { src: salleIntervention, alt: 'Salle d’intervention blanche avec table et éclairage opératoire', ...unsplash('1551076805-e1869033e561') },
  blocOperatoire: { src: blocOperatoire, alt: 'Bloc opératoire contemporain : table, scialytique, bras plafonnier et colonnes d’équipement', ...commons('Laparoscopic_operating_theatre.jpg', 'Dr.jayesh amin', 'CC BY-SA 3.0') },
  equipementBloc: { src: equipementBloc, alt: 'Équipements médicaux intégrés dans une salle d’opération : bras plafonnier, écran et colonne', ...commons('Wings_Laparoscopic_operating_theatre.jpg', 'Dr.jayesh amin', 'CC BY-SA 3.0') },
  endoscopie: { src: endoscopie, alt: 'Unité d’endoscopie avec postes de préparation et de réveil autour du poste infirmier', ...commons('Endoscopy_Unit_Saudi_Hospital.jpg', 'Yazan.shawahneh', 'CC0 1.0') },
  chantierAmenagement: { src: chantierAmenagement, alt: 'Aménagement intérieur en cours : cloisons en plaques jointées, sols et plafonds protégés', ...commons('M17-027_3cm6325_(33974391356).jpg', 'Oregon Department of Transportation', 'CC BY 2.0') },
  couloirLumiere: { src: couloirLumiere, alt: 'Circulation d’un établissement de santé baignée de lumière naturelle, façade vitrée', ...commons('Hennick_Bridgepoint_Hospital_interior_2025.jpg', 'Canmenwalker', 'CC BY 4.0') },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Visuel d'une page : une photo pertinente, ou à défaut un dessin technique (variante PlanArt). */
export type Visual = { photo: PhotoKey } | { drawing: string; label: string };

export const specialiteVisual: Record<string, Visual> = {
  'cabinet-dentaire-orthodontie': { photo: 'cabinetDentaire2' },
  'radiologie-imagerie-medicale': { drawing: 'radiologie-imagerie-medicale', label: 'Plan type — centre d’imagerie' },
  ophtalmologie: { drawing: 'ophtalmologie', label: 'Plan type — cabinet d’ophtalmologie' },
  'orl-audiologie': { drawing: 'orl-audiologie', label: 'Plan type — cabinet ORL' },
  'gynecologie-echographie-pma': { drawing: 'gynecologie-echographie-pma', label: 'Plan type — gynécologie et PMA' },
  pediatrie: { drawing: 'pediatrie', label: 'Plan type — cabinet de pédiatrie' },
  'dermatologie-medecine-esthetique': { drawing: 'dermatologie-medecine-esthetique', label: 'Plan type — clinique esthétique' },
  'cardiologie-explorations-fonctionnelles': { drawing: 'cardiologie-explorations-fonctionnelles', label: 'Plan type — cabinet de cardiologie' },
  'kinesitherapie-reeducation': { drawing: 'kinesitherapie-reeducation', label: 'Plan type — centre de rééducation' },
  'gastro-enterologie-endoscopie': { photo: 'endoscopie' },
  'laboratoire-analyses-medicales': { photo: 'laboratoire' },
  'cliniques-blocs-operatoires': { photo: 'blocOperatoire' },
  'medecine-generale-cabinets-de-groupe': { drawing: 'medecine-generale-cabinets-de-groupe', label: 'Plan type — cabinet de groupe' },
  'psychiatrie-psychologie': { drawing: 'psychiatrie-psychologie', label: 'Plan type — cabinet de santé mentale' },
};

export const serviceVisual: Record<string, Visual> = {
  'etude-faisabilite-programmation-medicale': { drawing: 'medecine-generale-cabinets-de-groupe', label: 'Programme fonctionnel — étude de faisabilité' },
  'conception-amenagement-cabinet-medical': { drawing: 'cabinet-dentaire-orthodontie', label: 'Plan de conception — circuits patient et matériel' },
  'reseaux-techniques-fluides-medicaux': { drawing: 'cliniques-blocs-operatoires', label: 'Plan des réseaux — bloc et locaux techniques' },
  'travaux-amenagement-cabinet-clinique': { photo: 'chantierAmenagement' },
  'renovation-cabinet-clinique-site-occupe': { photo: 'salleIntervention' },
  'salles-imagerie-radioprotection': { drawing: 'radiologie-imagerie-medicale', label: 'Plan de radioprotection — salle d’imagerie' },
  'equipement-medical-mobilier-technique': { photo: 'equipementBloc' },
  'design-interieur-experience-patient': { photo: 'hallClinique' },
  'hygiene-sterilisation-dechets-medicaux': { drawing: 'gastro-enterologie-endoscopie', label: 'Circuit du sale vers le propre — désinfection' },
  'financement-lancement-suivi-projet-medical': { photo: 'couloirLumiere' },
};

/** Les 4 grandes expertises (accueil + /expertises/) */
export const expertises = [
  {
    id: 'etude-conception',
    num: '01',
    title: 'Étude & conception',
    text: 'Faisabilité, programmation médicale, plans 2D et rendus 3D.',
    visual: { drawing: 'cabinet-dentaire-orthodontie', label: 'Plan de conception — illustration ESM' } as Visual,
    services: ['etude-faisabilite-programmation-medicale', 'conception-amenagement-cabinet-medical', 'design-interieur-experience-patient'],
  },
  {
    id: 'construction-renovation',
    num: '02',
    title: 'Construction & rénovation',
    text: 'Travaux clés en main, réseaux techniques et rénovation sans interrompre votre activité.',
    visual: { photo: 'chantierAmenagement' } as Visual,
    services: [
      'travaux-amenagement-cabinet-clinique',
      'renovation-cabinet-clinique-site-occupe',
      'reseaux-techniques-fluides-medicaux',
      'salles-imagerie-radioprotection',
      'hygiene-sterilisation-dechets-medicaux',
    ],
  },
  {
    id: 'equipement-medical',
    num: '03',
    title: 'Équipement médical',
    text: 'Sélection, fourniture, installation et intégration de vos équipements.',
    visual: { photo: 'equipementBloc' } as Visual,
    services: ['equipement-medical-mobilier-technique'],
  },
  {
    id: 'accompagnement-global',
    num: '04',
    title: 'Accompagnement global',
    text: 'Coordination, conseil technique et financement avec nos banques partenaires.',
    visual: { photo: 'couloirLumiere' } as Visual,
    services: ['financement-lancement-suivi-projet-medical'],
  },
] as const;
