/**
 * Pages d'annonce (Meta Ads) : /lp/<slug>/ — noindex, hors sitemap, en-tête réduit, formulaire court.
 * Règle : uniquement des affirmations déjà présentes sur le site (offre des spécialités, méthode, FAQ) ;
 * aucun délai, prix, taux ou chiffre commercial. Les banques sont citées avec BANK_DISCLAIMER.
 * Lien d'annonce type : /lp/cabinet-dentaire/?utm_source=meta&utm_medium=paid&utm_campaign=<nom>&utm_content=<visuel>
 */
import type { PhotoKey } from '@/lib/photos';

export interface Campagne {
  slug: string;
  title: string; // ≤ 60 caractères
  description: string; // 140–155 caractères
  eyebrow: string;
  h1: string;
  lede: string;
  points: string[];
  bank: boolean; // affiche la ligne « dossier bancaire » + mention obligatoire
  structure?: string;
  nature?: 'Création' | 'Rénovation' | 'Extension';
  photo: PhotoKey;
  /** Source des questions fréquentes : spécialité, service ou FAQ générale (par question). */
  faq: { from: 'specialite' | 'service'; id: string } | { from: 'general'; questions: string[] };
}

export const campagnes: Campagne[] = [
  {
    slug: 'cabinet-dentaire',
    title: 'Aménagement de cabinet dentaire au Maroc',
    description:
      'Conception, travaux et équipement de votre cabinet dentaire partout au Maroc : plan par fauteuil, réseaux dédiés et stérilisation. Demandez votre devis.',
    eyebrow: 'Cabinet dentaire · Partout au Maroc',
    h1: 'Votre cabinet dentaire, conçu autour du fauteuil.',
    lede: 'Plan, réseaux, stérilisation et équipement : un seul interlocuteur, de la première esquisse à l’ouverture.',
    points: [
      'Plan par fauteuil avec arrivées de fluides positionnées',
      'Local technique insonorisé et accessible pour la maintenance',
      'Salle de stérilisation organisée du sale vers le propre',
    ],
    bank: true,
    structure: 'cabinet-dentaire-orthodontie',
    photo: 'cabinetDentaire2',
    faq: { from: 'specialite', id: 'cabinet-dentaire-orthodontie' },
  },
  {
    slug: 'premiere-installation',
    title: 'Première installation de cabinet médical',
    description:
      'Du choix du local à l’ouverture : plans, autorisations, travaux, équipement et dossier de financement de votre premier cabinet médical, partout au Maroc.',
    eyebrow: 'Première installation · Partout au Maroc',
    h1: 'Votre premier cabinet, clé en main.',
    lede: 'Du choix du local à l’ouverture : programme, plans, autorisations, travaux, équipement et dossier de financement.',
    points: [
      'Visite des locaux envisagés avant la signature du bail',
      'Plans 2D et rendus 3D validés salle par salle',
      'Budget par lot, validé avant le début des travaux',
    ],
    bank: true,
    nature: 'Création',
    photo: 'hallClinique',
    faq: { from: 'general', questions: ['Par quoi commencer ?', 'Aidez-vous à financer le projet ?', 'Travaillez-vous pour toutes les spécialités médicales ?'] },
  },
  {
    slug: 'renovation',
    title: 'Rénovation de cabinet sans interrompre l’activité',
    description:
      'Rénovation et mise aux normes de cabinets et cliniques en site occupé : travaux phasés, zones isolées, accès et fluides maintenus. Demandez votre devis.',
    eyebrow: 'Rénovation · Site occupé',
    h1: 'Rénovez votre cabinet sans interrompre votre activité.',
    lede: 'Vous continuez à recevoir vos patients pendant que nous rénovons, phase après phase.',
    points: [
      'Travaux découpés en phases, planifiés avec vous',
      'Zones de chantier isolées par des cloisons étanches',
      'Accès et fluides critiques maintenus pendant le chantier',
    ],
    bank: false,
    nature: 'Rénovation',
    photo: 'chantierAmenagement',
    faq: { from: 'service', id: 'renovation-cabinet-clinique-site-occupe' },
  },
];
