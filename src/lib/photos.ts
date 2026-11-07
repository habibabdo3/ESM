/**
 * Photographies d'illustration — licence Unsplash (usage commercial autorisé, sans attribution obligatoire).
 * Elles NE représentent PAS des réalisations d'Euro Space Medical : ne jamais les présenter comme telles
 * (les vraies réalisations vont dans src/content/realisations/). Crédits : /mentions-legales/.
 * Remplacer par les photos des projets ESM dès qu'elles existent (voir docs/MEDIAS.md).
 */
import type { ImageMetadata } from 'astro';
import hallClinique from '@/assets/photos/hall-clinique.jpg';
import plansConception from '@/assets/photos/plans-conception.jpg';
import plansDessin from '@/assets/photos/plans-dessin.jpg';
import chantierReseaux from '@/assets/photos/chantier-reseaux.jpg';
import chantierEquipe from '@/assets/photos/chantier-equipe.jpg';
import blocOperatoire from '@/assets/photos/bloc-operatoire.jpg';
import salleIntervention from '@/assets/photos/salle-intervention.jpg';
import accueilClinique from '@/assets/photos/accueil-clinique.jpg';
import cabinetDentaire from '@/assets/photos/cabinet-dentaire.jpg';
import cabinetDentaire2 from '@/assets/photos/cabinet-dentaire-2.jpg';
import cabinetDentaire3 from '@/assets/photos/cabinet-dentaire-3.jpg';
import cabinetDentaire4 from '@/assets/photos/cabinet-dentaire-4.jpg';
import laboratoire from '@/assets/photos/laboratoire.jpg';
import imagerie from '@/assets/photos/imagerie.jpg';
import chambrePatient from '@/assets/photos/chambre-patient.jpg';
import couloirArchitecture from '@/assets/photos/couloir-architecture.jpg';
import architectureFacade from '@/assets/photos/architecture-facade.jpg';

export interface Photo {
  src: ImageMetadata;
  alt: string;
  unsplash: string;
}

const u = (id: string) => `https://unsplash.com/photos/${id}`;

export const photos = {
  hallClinique: { src: hallClinique, alt: 'Hall lumineux d’un centre médical contemporain, sol en marbre et cloisons vitrées', unsplash: u('1631248055158-edec7a3c072b') },
  plansConception: { src: plansConception, alt: 'Plans d’architecte annotés sur une table de travail', unsplash: u('1503387762-592deb58ef4e') },
  plansDessin: { src: plansDessin, alt: 'Dessin technique et plans en cours d’étude', unsplash: u('1581092160562-40aa08e78837') },
  chantierReseaux: { src: chantierReseaux, alt: 'Chantier en cours avec réseaux techniques et équipes de pose', unsplash: u('1504307651254-35680f356dfd') },
  chantierEquipe: { src: chantierEquipe, alt: 'Équipe de chantier sur une dalle en préparation', unsplash: u('1541888946425-d81bb19240f5') },
  blocOperatoire: { src: blocOperatoire, alt: 'Salle d’opération équipée de bras plafonniers et d’un scialytique', unsplash: u('1516549655169-df83a0774514') },
  salleIntervention: { src: salleIntervention, alt: 'Salle d’intervention blanche avec table et éclairage opératoire', unsplash: u('1551076805-e1869033e561') },
  accueilClinique: { src: accueilClinique, alt: 'Comptoir d’accueil d’une clinique aux finitions blanches', unsplash: u('1519494026892-80bbd2d6fd0d') },
  cabinetDentaire: { src: cabinetDentaire, alt: 'Cabinet dentaire lumineux avec fauteuil et mobilier sur-mesure', unsplash: u('1629909613654-28e377c37b09') },
  cabinetDentaire2: { src: cabinetDentaire2, alt: 'Salle de soins dentaire avec unit et rangements intégrés', unsplash: u('1629909615184-74f495363b67') },
  cabinetDentaire3: { src: cabinetDentaire3, alt: 'Salle de soins dentaire aux stores filtrants et plans de travail blancs', unsplash: u('1629909613638-0e4a1fad8f81') },
  cabinetDentaire4: { src: cabinetDentaire4, alt: 'Salle de soins avec fauteuil, meubles bas et éclairage d’examen', unsplash: u('1598256989800-fe5f95da9787') },
  laboratoire: { src: laboratoire, alt: 'Laboratoire d’analyses avec paillasses et automates alignés', unsplash: u('1579154204601-01588f351e67') },
  imagerie: { src: imagerie, alt: 'Clichés d’imagerie médicale en coupe sur négatoscope', unsplash: u('1631563019676-dade0dbdb8fc') },
  chambrePatient: { src: chambrePatient, alt: 'Chambre de patient équipée, lit médicalisé et banquette', unsplash: u('1512678080530-7760d81faba6') },
  couloirArchitecture: { src: couloirArchitecture, alt: 'Couloir aux cloisons vitrées et éclairage linéaire', unsplash: u('1497366216548-37526070297c') },
  architectureFacade: { src: architectureFacade, alt: 'Architecture contemporaine aux volumes géométriques', unsplash: u('1487958449943-2429e8be8625') },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Photo d'en-tête par spécialité */
export const specialitePhoto: Record<string, PhotoKey> = {
  'cabinet-dentaire-orthodontie': 'cabinetDentaire2',
  'radiologie-imagerie-medicale': 'imagerie',
  ophtalmologie: 'salleIntervention',
  'orl-audiologie': 'cabinetDentaire4',
  'gynecologie-echographie-pma': 'chambrePatient',
  pediatrie: 'accueilClinique',
  'dermatologie-medecine-esthetique': 'cabinetDentaire3',
  'cardiologie-explorations-fonctionnelles': 'salleIntervention',
  'kinesitherapie-reeducation': 'couloirArchitecture',
  'gastro-enterologie-endoscopie': 'blocOperatoire',
  'laboratoire-analyses-medicales': 'laboratoire',
  'cliniques-blocs-operatoires': 'blocOperatoire',
  'medecine-generale-cabinets-de-groupe': 'accueilClinique',
  'psychiatrie-psychologie': 'couloirArchitecture',
};

/** Photo d'en-tête par service */
export const servicePhoto: Record<string, PhotoKey> = {
  'etude-faisabilite-programmation-medicale': 'plansDessin',
  'conception-amenagement-cabinet-medical': 'plansConception',
  'reseaux-techniques-fluides-medicaux': 'chantierReseaux',
  'travaux-amenagement-cabinet-clinique': 'chantierEquipe',
  'renovation-cabinet-clinique-site-occupe': 'salleIntervention',
  'salles-imagerie-radioprotection': 'imagerie',
  'equipement-medical-mobilier-technique': 'blocOperatoire',
  'design-interieur-experience-patient': 'hallClinique',
  'hygiene-sterilisation-dechets-medicaux': 'cabinetDentaire4',
  'financement-lancement-suivi-projet-medical': 'accueilClinique',
};

/** Les 4 grandes expertises (accueil + /expertises/) */
export const expertises = [
  {
    id: 'etude-conception',
    num: '01',
    title: 'Étude & conception',
    text: 'Faisabilité, programmation médicale, plans 2D et rendus 3D.',
    photo: 'plansConception' as PhotoKey,
    services: ['etude-faisabilite-programmation-medicale', 'conception-amenagement-cabinet-medical', 'design-interieur-experience-patient'],
  },
  {
    id: 'construction-renovation',
    num: '02',
    title: 'Construction & rénovation',
    text: 'Travaux clés en main, réseaux techniques et rénovation sans fermer.',
    photo: 'chantierReseaux' as PhotoKey,
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
    photo: 'blocOperatoire' as PhotoKey,
    services: ['equipement-medical-mobilier-technique'],
  },
  {
    id: 'accompagnement-global',
    num: '04',
    title: 'Accompagnement global',
    text: 'Coordination, conseil technique et financement avec nos banques partenaires.',
    photo: 'accueilClinique' as PhotoKey,
    services: ['financement-lancement-suivi-projet-medical'],
  },
] as const;
