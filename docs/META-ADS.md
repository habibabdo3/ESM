# Campagnes Meta (Facebook / Instagram) — mode d'emploi

> Mis en place le 2026-11-09 (v2.0.0). Code : `src/scripts/track.ts`, `src/data/campagnes.ts`, `src/pages/lp/`,
> `src/pages/merci/`, `src/components/QuoteForm.astro`, `api/devis.js`.

## 1. Avant de lancer (côté entreprise)

1. Meta Business Manager avec la page Facebook et le compte Instagram d'Euro Space Medical.
2. **Vérifier le domaine** dans Business Manager (Paramètres → Sécurité de la marque → Domaines).
3. Créer le **pixel** (Gestionnaire d'événements) et mettre son identifiant dans Vercel : `PUBLIC_META_PIXEL_ID`.
4. Renseigner `PUBLIC_WHATSAPP` et `PUBLIC_PHONE` (boutons de contact suivis), puis `RESEND_API_KEY`,
   `QUOTE_TO_EMAIL`, `QUOTE_FROM_EMAIL` (sans eux, le formulaire ne peut pas envoyer les demandes).
5. Redéployer, puis tester (section 5).

## 2. Pages d'annonce

| Campagne | Adresse | Pré-réglage du formulaire |
|---|---|---|
| Cabinet dentaire | `/lp/cabinet-dentaire/` | structure : dentaire et orthodontie |
| Première installation | `/lp/premiere-installation/` | nature : création |
| Rénovation en site occupé | `/lp/renovation/` | nature : rénovation |

Pages **noindex** et hors sitemap (réservées aux annonces) : en-tête réduit (logo + WhatsApp), promesse, trois
points, formulaire court (nom, téléphone, ville, structure, nature ; e-mail facultatif), méthode, FAQ.
Ajouter une campagne : une entrée dans `src/data/campagnes.ts` (titre ≤ 60, description 140–155, uniquement des
affirmations déjà présentes sur le site), puis `npm run verify`.

## 3. Lien à mettre dans chaque annonce

```
https://<domaine>/lp/cabinet-dentaire/?utm_source=meta&utm_medium=paid&utm_campaign=dentaire-casa-2026-11&utm_content=video-maquette
```

- `utm_campaign` : nom de la campagne ; `utm_content` : le visuel ou la variante de l'annonce.
- Meta ajoute lui-même `fbclid`. Tout est gardé le temps de la visite et **joint à la demande de devis** :
  l'e-mail reçu porte « [Annonce] » dans l'objet et un tableau « Origine de la demande ».

## 4. Événements envoyés (seulement si le visiteur accepte « Publicité » dans le bandeau cookies)

| Événement | Quand | Paramètres |
|---|---|---|
| `PageView` | chaque page | — |
| `Contact` | clic sur WhatsApp, téléphone ou e-mail | `method`, `page` |
| `Lead` | demande de devis envoyée (compté une seule fois, sur `/merci/`) | `content_name` (structure), `eventID` unique |

Dans le Gestionnaire d'événements : optimiser les campagnes sur **Lead** ; créer une conversion personnalisée
« URL contient /merci/ » en secours. Le même `eventID` est transmis au serveur avec la demande : il permettra de
brancher plus tard l'**API Conversions** (envoi serveur depuis `api/devis.js`, jeton Meta en variable Vercel
`META_CAPI_TOKEN`, jamais dans le dépôt) sans compter deux fois le même Lead.

## 5. Tester avant de dépenser

1. Ouvrir une page d'annonce avec un lien `utm_…`, accepter les cookies « Publicité ».
2. Extension **Meta Pixel Helper** : `PageView` visible.
3. Cliquer sur WhatsApp : `Contact`. Envoyer le formulaire : arrivée sur `/merci/` et `Lead`.
4. Vérifier l'e-mail reçu : objet « [Annonce] … », tableau « Origine de la demande ».
5. Gestionnaire d'événements → « Tester les événements » pour confirmer la réception.

## 6. Règles (CLAUDE.md §2)

Aucune promesse chiffrée (prix, délai, taux d'acceptation) dans les annonces comme sur les pages ; banques citées
avec « Sous réserve d'acceptation du dossier par la banque. » ; images d'illustration jamais présentées comme des
réalisations ESM ; pas de « gratuit ».
