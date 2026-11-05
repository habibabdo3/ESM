# Source éditoriale — Euro Space Medical (rapport du 5 novembre 2026)

> Synthèse de référence. Le contenu publié (services, spécialités, régions) vit dans `src/data/*.json`,
> rédigé à partir des sections 4 et 5 du rapport. Ne pas reprendre les chiffres, noms de packs ni formulations de
> lynemedical.ma. Toute promesse chiffrée doit s'appuyer sur les réalisations d'Euro Space Medical.

## Repositionnement (§3)
- **Promesse** : « Nous concevons, rénovons et équipons les cabinets, cliniques et centres médicaux, sans interrompre
  votre activité et dans le respect des exigences de votre spécialité. »
- **Cibles** : médecins qui ouvrent, déménagent ou s'associent ; praticiens qui rénovent, agrandissent, remettent aux
  normes ; cliniques, centres d'imagerie, laboratoires, centres de rééducation ; investisseurs et promoteurs.
- **Piliers** : 1) interlocuteur unique du programme à la réception ; 2) « spécialité d'abord » ; 3) zéro surprise
  (budget par lot, planning, essais, procès-verbal).
- **Apport vs concurrent** : toutes les spécialités, rénovation en site occupé, dossier réglementaire par discipline,
  portfolio avant/après, pages locales.

## Services (§4) → `src/data/services.json`
1. Étude de faisabilité et programmation · 2. Conception 2D/3D · 3. Réseaux techniques et fluides · 4. Travaux clés en
main · 5. Rénovation, extension, mise aux normes en site occupé · 6. Imagerie et radioprotection · 7. Équipement
médical (formules Essentiel, Confort, Premium, Sur mesure — prix sur devis) · 8. Design d'intérieur et expérience
patient · 9. Hygiène, stérilisation, déchets · 10. Financement, lancement et suivi.

## Spécialités (§5) → `src/data/specialites.json`
Dentaire/orthodontie · Radiologie/imagerie · Ophtalmologie · ORL/audiologie · Gynécologie/échographie/PMA · Pédiatrie ·
Dermatologie/esthétique · Cardiologie · Kinésithérapie/rééducation · Gastro-entérologie/endoscopie · Laboratoire
d'analyses · Cliniques/blocs opératoires · Médecine générale/cabinets de groupe · Psychiatrie/psychologie.
Les surfaces et références techniques sont des repères à confirmer sur plan.

## SEO (§6)
- Silos : accueil, /services/, /specialites/, 2 piliers, pages régionales, réalisations, blog, FAQ, à propos, contact, légal.
- On-page : 1 H1, title ≤ 60, description 140–155 uniques, mot-clé dans title/H1/100 premiers mots/URL/alt.
- Longueurs indicatives : piliers 800+ mots, spécialités 400–700, services 300–500.
- JSON-LD : Organization, WebSite, LocalBusiness (HomeAndConstructionBusiness), Service, BreadcrumbList, FAQPage, Article.
- Performance : LCP < 2,5 s, INP < 200 ms, CLS < 0,1. WCAG 2.2 AA.
- Mots-clés transactionnels : aménagement cabinet médical, rénovation clinique, aménagement cabinet dentaire [ville],
  architecte cabinet médical Maroc, installation salle de radiologie, devis aménagement cabinet.
  Volumes non mesurés : valider avec Search Console et le Planificateur de mots clés.
- 12 articles de blog prévus (brouillons dans `src/content/blog/`).

## Points de vigilance (§8)
- AMSSNuR (loi 142-12) : autorisation d'utilisation du matériel de radiologie, dentaire compris.
- Déchets médicaux : loi 28-00 et décret 2-09-139 (tri à la source, prestataire agréé).
- Loi 10-03 (accessibilité), loi 09-08 (données), normes ISO/NF : à valider avec autorités, bureau d'études, contrôle.
- Aucun prix dans le rapport : chiffrer avec les coûts réels. Aucun chiffre commercial sans justification.
- Dispositifs publics de financement : à vérifier à la date de publication.

## Marché (§9)
Trois vagues : 1) 2026-2028 cliniques, imagerie, labos, cabinets existants (AMO, groupes privés, mise aux normes des
« cliniques-villas ») ; 2) 2026-2030 écosystèmes autour des nouvelles facultés (Béni Mellal, Errachidia, Guelmim,
Laâyoune, Kénitra) ; 3) dès 2030 vague d'installation des jeunes praticiens (offres « première installation » financées).

## Financement (§10, §14.2)
- Bank Al Yousr : Mourabaha équipement, Ijara. Al Barid Bank : crédit professionnel, conventions avec l'Ordre des
  médecins (02/2025) et l'Ordre des médecins dentistes (10/2025). Intelaka (garantie Tamwilcom) : conditions à confirmer
  par écrit.
- Offre « Projet financé » : diagnostic → choix de formule → montage du dossier → transmission et suivi → travaux et
  décaissement par tranches.
- **Règles** : validation écrite de chaque banque pour nom, logo, taux, durée ; toujours « Sous réserve d'acceptation
  du dossier par la banque » ; aucune promesse de taux d'acceptation ; aucun délai ni taux chiffré sans accord écrit.
- Formulations prudentes autorisées en attendant : « Dossier Intelaka accompagné de A à Z et traité en priorité avec
  Al Barid Bank. » · « Conditions préférentielles pour nos clients avec Bank Al Yousr, en financement participatif
  (Mourabaha, Ijara). »

## Organisation (§11)
Siège à Casablanca (direction de projets, bureau d'études, achats, relation bancaire, marketing). Pôles régionaux :
Nord, Rabat-Kénitra, Centre, Fès-Meknès/Oriental, Marrakech-Safi/Drâa-Tafilalet, Souss-Massa, Sud. Feuille de route :
phase 1 (2026-2027) axe Tanger–Agadir–Fès ; phase 2 (2027-2029) villes des facultés, Oujda, Dakhla ; phase 3 (2029+)
Afrique francophone. Engagements de service (devis 72 h, visite 7 j, SAV 48 h) : **non publiés tant que non confirmés**.

## Décisions de lancement (§14.1)
Site d'abord, puis Instagram et Facebook · budget publicitaire 500 $/mois · couverture : tout le Maroc ·
5 réalisations présentables · mobile : bouton WhatsApp fixe sur toutes les pages.
