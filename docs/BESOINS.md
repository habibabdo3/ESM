# Ce dont le site a besoin — liste complète

> Cocher au fur et à mesure. Priorité : **P1** = bloquant pour la mise en ligne publique, **P2** = forte influence
> sur la confiance et la conversion, **P3** = amélioration. « Où » indique où l’information sera intégrée.

## A. Identité et coordonnées (P1)

- [ ] Téléphone principal et numéro **WhatsApp Business** (format 2126…) — Vercel : `PUBLIC_PHONE`, `PUBLIC_WHATSAPP`
- [ ] E-mail professionnel (ex. contact@domaine) — `PUBLIC_EMAIL`
- [ ] Adresse exacte du siège à Casablanca, identique à la fiche Google — `PUBLIC_ADDRESS`
- [ ] Horaires d’ouverture et délai de réponse visé (ex. WhatsApp en moins d’une heure en journée)
- [ ] Nom de domaine choisi (eurospacemedical.ma / .com) — `SITE_URL`
- [ ] Liens Instagram et Facebook — `PUBLIC_INSTAGRAM_URL`, `PUBLIC_FACEBOOK_URL`
- [ ] Logo en vectoriel (SVG ou AI/PDF) et charte graphique, si elle existe (sinon le logo actuel est conservé)

## B. Informations légales (P1)

- [ ] Raison sociale, forme juridique, capital
- [ ] RC, IF, ICE, numéro de patente
- [ ] Nom du directeur de la publication
- [ ] Durée de conservation des demandes de devis ; déclaration CNDP (numéro de récépissé si effectuée)
- [ ] Assurances : responsabilité civile professionnelle, garantie des ouvrages / décennale (assureur, n° de police)

### B bis. Conformité (pages légales)

- [ ] Numéro de déclaration ou d'autorisation CNDP, et autorisation des transferts hors Maroc (Vercel, Resend, Meta)
- [ ] Délai de traitement des demandes de suppression (ex. 30 jours)
- [ ] Ville du tribunal compétent (conditions d'utilisation)
- [ ] Confirmer : la demande de devis / l'étude de faisabilité est-elle gratuite ? (le site n'affiche plus « gratuit »)
- [ ] Confirmer l'organisation : bureau d'études intégré ou partenaire ? entreprises sous-traitantes ? antennes régionales ?

## C. Banques partenaires — partenariats signés (P1)

- [ ] Logos officiels d’**Al Barid Bank** et de **Bank Al Yousr** (fichiers SVG/PNG) + règles d’usage de la marque
- [ ] Texte exact validé par chaque banque pour décrire le partenariat (le site utilise aujourd’hui :
      « dossier Intelaka traité en priorité » et « conditions préférentielles »)
- [ ] Ce qui peut être affiché : délai moyen de réponse ? montant maximum ? durée ? apport ? (rien n’est affiché sans écrit)
- [ ] Liste officielle des pièces du dossier par banque (le site affiche une liste « généralement demandées »)
- [ ] Interlocuteur dédié par banque et par région, et mode de transmission des dossiers
- [ ] Possibilité de déblocage des fonds par tranches directement à Euro Space Medical
- [ ] Autorisation de co-organiser un webinaire ou un live « Financer son installation »
- [ ] Barèmes validés pour un **simulateur de mensualités** (sinon pas de simulateur chiffré)

## D. Preuves et crédibilité (P2 — le plus important pour la confiance)

- [ ] **5 réalisations** : pour chacune, spécialité, ville, surface (m²), durée, lots réalisés, difficulté, solution,
      photos **avant** et **après** (haute définition, horizontales), 4 à 8 photos de galerie, date de livraison
- [ ] Accord écrit de chaque client pour publier les photos ; témoignage écrit ou vidéo (facultatif, avec accord)
- [ ] **Équipe** : noms, fonctions, diplômes (architecte, ingénieur, conducteur de travaux), photo portrait
- [ ] Nombre de projets livrés, années d’expérience, villes déjà couvertes (**uniquement des chiffres vérifiables**)
- [ ] Partenaires techniques : physicien (radioprotection), bureau de contrôle, prestataire de déchets agréé
- [ ] Marques d’équipement distribuées ou installées, et statut (distributeur officiel, revendeur, installateur)
- [ ] Certifications, adhésions (fédérations, chambres de commerce), prix ou distinctions
- [ ] Avis Google (fiche Google Business Profile vérifiée) — pour afficher une note réelle sur le site

## E. Offre et méthode (P2)

- [ ] Engagements de service que vous pouvez tenir : devis sous X h, visite technique sous X jours, SAV sous X h
- [ ] Contenu réel des formules d’équipement **Essentiel, Confort, Premium, Sur mesure** (prix « à partir de » ?)
- [ ] Fourchettes budgétaires par type de projet (si vous acceptez de les publier) — pour l’estimateur en ligne
- [ ] Ce que comprend l’étude de faisabilité : gratuite ? payante et déduite du devis ?
- [ ] Contrat de maintenance après livraison : contenu, durée, tarif
- [ ] Délais types par type de projet, basés sur vos chantiers réels
- [ ] Villes où vous disposez d’une équipe ou d’un partenaire local (pour enrichir les pages régionales)

## F. Visuels et médias (P2) — brief détaillé : [MEDIAS.md](MEDIAS.md)

- [ ] Photos de chantier en cours (avec accord des clients) et de l’équipe au travail
- [ ] Rendus 3D et plans de projets réels (anonymisés si besoin) : ils remplaceront les plans schématiques
- [ ] Vidéo de présentation (60–90 s) et Reels « un cabinet en 12 semaines »
- [ ] Visite virtuelle 360° d’un projet livré (Matterport ou équivalent)
- [ ] Photo du siège / showroom, si vous recevez les clients

## G. Outils et comptes (P1–P2)

- [ ] Compte **Resend** (ou autre service d’e-mail) + domaine vérifié → formulaire de devis opérationnel
- [ ] Adresse(s) qui reçoivent les devis — `QUOTE_TO_EMAIL`
- [ ] Plausible ou Google Analytics 4 — `PUBLIC_PLAUSIBLE_DOMAIN`
- [ ] Pixel Meta — `PUBLIC_META_PIXEL_ID`
- [ ] Google Search Console (validation du domaine) et soumission du sitemap
- [ ] Google Business Profile du siège (et de chaque antenne réelle)
- [ ] Outil de prise de rendez-vous (Calendly, Google Agenda) pour réserver une visite technique
- [ ] CRM (HubSpot gratuit, Zoho, Pipedrive…) pour suivre chaque demande jusqu’à la signature

## H. Contenu complémentaire (P3)

- [ ] Guide PDF téléchargeable « Ouvrir son cabinet au Maroc : budget, plan, financement » (aimant à prospects)
- [ ] Version **arabe** (et anglaise pour la clientèle internationale ?) — la structure est prête
- [ ] Nouveaux articles : 2 par mois (sujets proposés ci-dessous)
- [ ] Pages ville (Casablanca, Rabat, Marrakech…) — **uniquement** quand une réalisation ou une équipe locale existe

---

# Benchmark international — ce que font les meilleurs

Sites étudiés (aménageurs médicaux et dentaires en Australie, au Royaume-Uni et en Europe francophone) :
Medifit, CDM, Perfect Practice, Dentifit, Silk Design & Build (Australie / Nouvelle-Zélande) ; KOVA, KTM Design,
The Clinic Builders, Ultimate (Royaume-Uni) ; House Invest (Luxembourg), Maverickframe, Praticima (France) ;
Pedra Silva Architects (Portugal).

## Ce qu’ils ont en commun

| Pratique | Chez Euro Space Medical |
|---|---|
| Interlocuteur unique « design & build » mis en avant | ✅ pilier n° 1 |
| Consultation initiale gratuite, sans engagement | ⏳ à décider (section E) puis à afficher |
| Processus détaillé en étapes avec livrables | ✅ méthode en 6 étapes + livrables par service |
| Études de cas publiées par projet (photos, client, surface, durée) | ⏳ modèle prêt, en attente des 5 réalisations |
| Pages dédiées à la conformité réglementaire du pays (ex. HTM 01-05 / CQC au Royaume-Uni) | ✅ autorisations par spécialité, AMSSNuR, loi 28-00, glossaire |
| Guides pratiques et articles experts | ✅ 12 guides publiés |
| Équipe nommée, années d’expérience | ⏳ section D |
| Partenaires et marques affichés | ✅ banques ; ⏳ marques d’équipement, partenaires techniques |
| Financement / leasing des équipements | ✅ Al Barid Bank, Bank Al Yousr, 5 formules |
| Témoignages clients (souvent en vidéo) | ⏳ section D |
| Showroom ou visite virtuelle 3D | ⏳ section F |
| Formulaire court + prise de rendez-vous en ligne | ✅ formulaire ; ⏳ prise de rendez-vous |

## Ajouts réalisés suite au benchmark

- **Vocabulaire de la spécialité** sur chaque page spécialité (79 termes) et **glossaire** complet (121 termes) :
  le client reconnaît son langage (unit, autoclave classe B, cone beam, équivalent plomb, CTA, SSPI, LDE, PSM…).
- **Page « Première installation »** pour les jeunes praticiens, avec check-list des oublis coûteux.
- **Banques partenaires** nommées sur l’accueil, la page financement, la première installation et deux pages dédiées
  (profils accompagnés, produits, pièces du dossier, FAQ).
- **Guides** reliés depuis l’accueil et depuis chaque service concerné.

## Ajouts recommandés (dès réception des informations)

1. **Estimateur de budget** en 4 questions (spécialité, surface, état du local, gamme) → fourchette + demande de devis.
   Nécessite vos fourchettes réelles (section E).
2. **Simulateur de mensualités** validé par les banques (section C).
3. **Prise de rendez-vous** pour une visite technique, directement depuis le site.
4. **Bandeau de preuves** sur l’accueil : projets livrés, années, villes, note Google (chiffres réels).
5. **Témoignages vidéo** de praticiens sur leurs réalisations.
6. **Guide PDF** téléchargeable contre e-mail (aimant à prospects pour les campagnes Meta).
7. **Page « Marques et équipements »** listant les marques distribuées, par spécialité.
8. **Page « Universités et facultés privées »** : salles de simulation, travaux pratiques, cliniques dentaires
   universitaires (cible identifiée dans le rapport).
9. **Espace client** (planning, photos, documents) — engagement de fiabilité du rapport, plus tard.
10. **Version arabe** pour élargir l’audience, notamment sur Instagram et Facebook.

## Prochains articles proposés

- Ouvrir un cabinet dentaire au Maroc : les étapes de A à Z
- Intelaka pour les médecins : qui est éligible et comment monter le dossier
- Mourabaha ou crédit classique : quel financement pour son équipement médical ?
- Aménager une clinique dans une villa : ce qu’il faut savoir
- Cabinet de radiologie : choisir entre panoramique et cone beam
- Climatisation d’un cabinet médical : split, gainable ou CTA ?
- Combien de fauteuils pour démarrer un cabinet dentaire ?
- Les erreurs à éviter dans le choix du local médical
