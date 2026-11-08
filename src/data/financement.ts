import { bankClaimsApproved } from '@/config/site';

/**
 * Partenariats signés avec Al Barid Bank et Bank Al Yousr (confirmé par l'entreprise le 2026-11-05).
 * Règles : aucun taux, montant, durée ou délai chiffré sans accord écrit spécifique de la banque ;
 * toujours BANK_DISCLAIMER ; jamais de promesse d'acceptation. Logos : à intégrer après réception des fichiers officiels.
 * Si BANK_CLAIMS_APPROVED=false, les noms sont remplacés par des libellés génériques et les pages passent en noindex.
 */
const A = bankClaimsApproved;

export const partners = [
  {
    id: 'al-barid-bank',
    path: '/financement/al-barid-bank/',
    name: A ? 'Al Barid Bank' : 'Banque partenaire — crédit professionnel',
    short: A ? 'Al Barid Bank' : 'Crédit professionnel',
    title: A ? 'Financement Al Barid Bank pour cabinet médical' : 'Crédit professionnel pour cabinet médical',
    description:
      'Crédit professionnel et dossier Intelaka accompagnés de A à Z pour financer l’aménagement et l’équipement de votre cabinet. Sous réserve d’acceptation.',
    h1: A ? 'Financer votre cabinet avec Al Barid Bank' : 'Crédit professionnel et Intelaka pour votre cabinet',
    accroche: A
      ? 'Partenaire d’Euro Space Medical : votre dossier de crédit professionnel ou Intelaka, préparé et suivi de A à Z.'
      : 'Dossier Intelaka et crédit professionnel accompagnés de A à Z avec notre banque partenaire.',
    contexte: A
      ? 'Al Barid Bank finance les professionnels et les TPE. Elle a signé des conventions avec le Conseil national de l’Ordre des médecins et avec l’Ordre national des médecins dentistes, qui prévoient des crédits professionnels pour l’investissement, l’aménagement et l’équipement des cabinets. Euro Space Medical est son partenaire pour l’aménagement : nous préparons le dossier technique et financier, la banque l’instruit.'
      : 'Notre banque partenaire propose des crédits professionnels destinés à l’investissement, à l’aménagement et à l’équipement des cabinets médicaux et dentaires.',
    pourQui: [
      'Médecins et chirurgiens-dentistes en première installation',
      'Jeunes lauréats, internes et résidents en fin de cursus qui préparent leur cabinet',
      'Praticiens installés qui rénovent, agrandissent ou s’équipent (fauteuil, échographe, panoramique…)',
      'Cabinets de groupe et petites structures de soins (TPE)',
    ],
    produits: [
      { t: 'Crédit professionnel d’installation', p: 'Financement de l’aménagement du local, des travaux et de l’équipement médical du cabinet.' },
      { t: 'Intelaka', p: 'Crédit à taux bonifié avec garantie publique (Tamwilcom), destiné notamment aux jeunes diplômés, TPE et porteurs de projet. Conditions d’éligibilité vérifiées à la date du dossier.' },
      { t: 'Financement de l’équipement', p: 'Pour renouveler ou compléter le plateau technique d’un cabinet déjà en activité.' },
    ],
  },
  {
    id: 'bank-al-yousr',
    path: '/financement/bank-al-yousr/',
    name: A ? 'Bank Al Yousr' : 'Banque partenaire — financement participatif',
    short: A ? 'Bank Al Yousr' : 'Financement participatif',
    title: A ? 'Financement participatif Bank Al Yousr' : 'Financement participatif pour cabinet médical',
    description:
      'Mourabaha équipement et Ijara : un financement participatif pour aménager et équiper votre cabinet ou votre clinique. Sous réserve d’acceptation.',
    h1: A ? 'Financement participatif avec Bank Al Yousr' : 'Financement participatif : Mourabaha et Ijara',
    accroche: A
      ? 'Partenaire d’Euro Space Medical : un financement participatif (Mourabaha, Ijara) pour aménager et équiper votre structure.'
      : 'Un financement conforme à la finance participative, préparé avec vous de A à Z.',
    contexte: A
      ? 'Banque participative du groupe Banque Populaire, Bank Al Yousr propose une offre dédiée aux professionnels de santé : médecins, cliniques et laboratoires. Ses produits sont conformes aux avis du Comité Charia pour la finance participative. Euro Space Medical lui transmet un dossier complet : devis détaillé, factures pro forma des équipements et plans.'
      : 'Notre banque partenaire en finance participative propose une offre dédiée aux professionnels de santé : médecins, cliniques et laboratoires.',
    pourQui: [
      'Praticiens qui souhaitent un financement conforme à la finance participative',
      'Cliniques, centres d’imagerie et laboratoires qui s’équipent',
      'Médecins et dentistes en première installation',
      'Structures existantes qui rénovent ou renouvellent leur plateau technique',
    ],
    produits: [
      { t: 'Mourabaha équipement', p: 'La banque acquiert l’équipement ou l’aménagement et vous le revend avec une marge fixe, connue dès la signature, payable par échéances.' },
      { t: 'Ijara', p: 'Location avec option d’achat : l’équivalent participatif du leasing, adapté aux équipements médicaux lourds.' },
      { t: 'Accompagnement des projets de santé', p: 'Une offre pensée pour les professionnels de santé, du cabinet individuel à la clinique.' },
    ],
  },
] as const;

/** Pièces généralement demandées — la liste exacte est communiquée par la banque pour chaque dossier. */
export const piecesDossier = [
  'Carte nationale d’identité',
  'Diplôme et attestation d’inscription au tableau de l’Ordre',
  'Devis détaillé des travaux et factures pro forma des équipements',
  'Plans d’aménagement et planning prévisionnel',
  'Business plan et plan de trésorerie',
  'Contrat de bail, compromis ou titre de propriété du local',
  'Pour une structure existante : états financiers ou relevés d’activité',
];

export const etapesProjetFinance = [
  { t: 'Diagnostic du projet', p: 'Estimation budgétaire complète : travaux, équipements et fonds de roulement.' },
  { t: 'Choix de la formule', p: 'Mourabaha, Ijara, crédit professionnel, Intelaka ou leasing, selon votre situation.' },
  { t: 'Montage du dossier', p: 'Devis détaillé, pro forma, plans, business plan et pièces administratives.' },
  { t: 'Transmission et suivi', p: 'Dépôt auprès de la banque partenaire et suivi jusqu’à la décision.' },
  { t: 'Travaux par tranches', p: 'Démarrage du chantier et déblocage des fonds selon l’avancement.' },
];
