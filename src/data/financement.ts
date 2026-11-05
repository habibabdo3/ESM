import { bankClaimsApproved } from '@/config/site';

/**
 * Formulations prudentes (rapport §14.2). Aucun délai ni taux chiffré sans accord écrit.
 * Tant que BANK_CLAIMS_APPROVED=false, les noms des banques sont masqués et les pages partenaires en noindex.
 */
export const partners = [
  {
    id: 'al-barid-bank',
    path: '/financement/al-barid-bank/',
    name: bankClaimsApproved ? 'Al Barid Bank' : 'Banque partenaire — crédit professionnel',
    short: bankClaimsApproved ? 'Al Barid Bank' : 'Crédit professionnel',
    title: bankClaimsApproved ? 'Financement Al Barid Bank pour cabinet médical' : 'Crédit professionnel pour cabinet médical',
    description:
      'Crédit professionnel et dossier Intelaka accompagnés de A à Z pour financer l’aménagement et l’équipement de votre cabinet. Sous réserve d’acceptation.',
    h1: bankClaimsApproved
      ? 'Financer votre cabinet avec Al Barid Bank'
      : 'Crédit professionnel et Intelaka pour votre cabinet',
    accroche: bankClaimsApproved
      ? 'Dossier Intelaka accompagné de A à Z et traité en priorité avec Al Barid Bank.'
      : 'Dossier Intelaka et crédit professionnel accompagnés de A à Z avec notre banque partenaire.',
    produits: [
      { t: 'Crédit professionnel', p: 'Financement de l’investissement, de l’aménagement et de l’équipement du cabinet.' },
      { t: 'Intelaka', p: 'Crédit à taux bonifié avec garantie publique, destiné notamment aux jeunes diplômés, TPE et porteurs de projet. Conditions à vérifier à la date du dossier.' },
    ],
    contexte: bankClaimsApproved
      ? 'Al Barid Bank finance les professionnels et les TPE et a signé des conventions avec le Conseil national de l’Ordre des médecins et l’Ordre national des médecins dentistes pour l’investissement, l’aménagement et l’équipement des cabinets.'
      : 'Notre banque partenaire propose des crédits professionnels destinés à l’investissement, à l’aménagement et à l’équipement des cabinets médicaux et dentaires.',
  },
  {
    id: 'bank-al-yousr',
    path: '/financement/bank-al-yousr/',
    name: bankClaimsApproved ? 'Bank Al Yousr' : 'Banque partenaire — financement participatif',
    short: bankClaimsApproved ? 'Bank Al Yousr' : 'Financement participatif',
    title: bankClaimsApproved ? 'Financement participatif Bank Al Yousr' : 'Financement participatif pour cabinet médical',
    description:
      'Mourabaha équipement et Ijara : un financement participatif pour aménager et équiper votre cabinet ou votre clinique. Sous réserve d’acceptation.',
    h1: bankClaimsApproved
      ? 'Financement participatif avec Bank Al Yousr'
      : 'Financement participatif : Mourabaha et Ijara',
    accroche: bankClaimsApproved
      ? 'Conditions préférentielles pour nos clients avec Bank Al Yousr, en financement participatif (Mourabaha, Ijara).'
      : 'Un financement conforme à la finance participative, avec des conditions négociées pour nos clients.',
    produits: [
      { t: 'Mourabaha équipement', p: 'Achat d’équipements et d’aménagement avec une marge fixe, connue dès la signature.' },
      { t: 'Ijara', p: 'Location avec option d’achat : l’équivalent participatif du leasing, adapté aux équipements médicaux.' },
    ],
    contexte: bankClaimsApproved
      ? 'Banque participative du groupe Banque Populaire, Bank Al Yousr propose une offre dédiée aux professionnels de santé : médecins, cliniques et laboratoires.'
      : 'Notre banque partenaire en finance participative propose une offre dédiée aux professionnels de santé : médecins, cliniques et laboratoires.',
  },
] as const;

export const etapesProjetFinance = [
  { t: 'Diagnostic du projet', p: 'Estimation budgétaire complète : travaux, équipements et fonds de roulement.' },
  { t: 'Choix de la formule', p: 'Financement participatif, crédit professionnel, Intelaka, leasing ou Ijara, selon votre situation.' },
  { t: 'Montage du dossier', p: 'Devis détaillé, plans, business plan et pièces administratives.' },
  { t: 'Transmission et suivi', p: 'Dépôt auprès de la banque et suivi jusqu’à la décision.' },
  { t: 'Travaux par tranches', p: 'Démarrage du chantier et décaissement selon l’avancement.' },
];
