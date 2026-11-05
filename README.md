# Euro Space Medical — site vitrine

Site d'Euro Space Medical : conception, rénovation, équipement et financement de structures médicales au Maroc.
Astro 7 · Tailwind CSS 4 · TypeScript strict · déploiement statique sur Vercel.

> Conventions, design et règles du projet : **[CLAUDE.md](CLAUDE.md)** · Journal : [docs/CHANGELOG.md](docs/CHANGELOG.md) ·
> Direction artistique : [docs/DESIGN.md](docs/DESIGN.md) · Démo des animations : `/styleguide/`

## Installation

```bash
npm install          # Node 22.12 ou plus
cp .env.example .env # puis renseigner les valeurs
npm run dev          # http://localhost:4321
```

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | développement (brouillons du blog visibles) |
| `npm run build` | build statique dans `dist/` |
| `npm run check` | vérification TypeScript / Astro |
| `npm run audit:seo` | audit SEO du build (bloquant) |
| `npm run audit:strict` | idem + échec s'il reste des marqueurs `[À COMPLÉTER]` |
| `npm run verify` | check + build + audit — à lancer avant chaque push |
| `npm run og` | régénère les images Open Graph et les icônes |

## Déploiement sur Vercel

1. Importer le dépôt GitHub dans Vercel (le framework **Astro** est détecté ; `vercel.json` fixe la commande et `dist/`).
2. Renseigner les variables d'environnement (Settings → Environment Variables), voir `.env.example` :
   - `SITE_URL` (ex. `https://www.eurospacemedical.ma`) — sinon l'URL de production Vercel est utilisée ;
   - coordonnées `PUBLIC_PHONE`, `PUBLIC_EMAIL`, `PUBLIC_WHATSAPP` (format `2126…`), `PUBLIC_ADDRESS`, réseaux sociaux ;
   - formulaire : `RESEND_API_KEY`, `QUOTE_TO_EMAIL`, `QUOTE_FROM_EMAIL` (domaine vérifié dans Resend) ;
   - mesure : `PUBLIC_PLAUSIBLE_DOMAIN`, `PUBLIC_META_PIXEL_ID` (chargés après consentement) ;
   - `BANK_CLAIMS_APPROVED` : noms des banques affichés par défaut (partenariats signés) ; `false` pour les masquer.
3. Redéployer après chaque changement de variable (les valeurs sont intégrées au build).

La fonction `api/devis.js` reçoit le formulaire. Sans clés Resend, elle répond 503 et le formulaire propose WhatsApp.

## Ajouter du contenu

- **Spécialité / service / région** : ajouter une entrée dans `src/data/specialites.json`, `services.json` ou
  `regions.json` (`id` = slug), vérifier les longueurs avec `node scripts/check-lengths.mjs src/data/<fichier>.json`,
  puis `npm run verify`.
- **Réalisation** : copier `src/content/realisations/_modele.md` (sans le `_`), placer les photos dans
  `src/assets/realisations/<slug>/`. Elle apparaît sur l'accueil, la spécialité et `/realisations/` (le noindex est retiré).
  Témoignage uniquement avec accord écrit du client.
- **Article** : compléter un fichier de `src/content/blog/` et passer `draft: false`.
- **Changement d'URL** : ajouter une redirection 301 dans `vercel.json`.

## À compléter par l'entreprise

Les marqueurs jaunes `[À COMPLÉTER : …]` visibles sur le site disparaissent dès que l'information est fournie :

- [ ] Téléphone, e-mail, WhatsApp, adresse du siège (variables d'environnement)
- [ ] Forme juridique, capital, RC, IF, ICE, directeur de la publication (`src/pages/mentions-legales/`)
- [ ] Durée de conservation des données, démarches CNDP (`src/pages/confidentialite/`)
- [ ] Équipe nommée, assurances, partenaires techniques (`src/pages/a-propos/`)
- [ ] 5 réalisations avec photos avant/après
- [x] Partenariats signés avec Al Barid Bank et Bank Al Yousr (noms affichés)
- [ ] Logos officiels des deux banques et textes validés (aucun taux ni délai affiché sans écrit)
- [ ] Nom de domaine, comptes Resend, Plausible, Meta
- [x] Rédaction et publication des 12 articles du blog

Liste détaillée et priorisée : [docs/BESOINS.md](docs/BESOINS.md) · Architecture : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
