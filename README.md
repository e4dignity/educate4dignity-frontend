# Educate4Dignity Frontend

React + TypeScript + Vite application for the Educate4Dignity platform (admin + public experiences).

## 1. Prerequisites
- Node.js 18+ (recommandé LTS)
- npm (fourni avec Node) ou pnpm/yarn (si vous adaptez les commandes)

## 2. Installer les dépendances
```bash
npm install
```

## 3. Démarrer en développement
Démarre Vite (hot reload sur http://localhost:3000).
```bash
npm run dev
```

## 4. Scripts principaux
| Commande | Description |
|----------|------------|
| `npm run dev` | Serveur développement + HMR |
| `npm run build` | Type check + build production dans `dist/` |
| `npm run preview` | Servir le build localement (après build) |
| `npm run lint` | Lint TypeScript/React |
| `npm run extract:spec` | Script interne d'extraction de spec (DOCX -> context) |

## 5. Build production
```bash
npm run build
```
Le build optimisé est généré dans `dist/` (ignoré par git).

## 6. Lancer l'aperçu du build
```bash
npm run preview
```

## 7. Structure (résumé)
```
src/
  components/         Composants UI réutilisables
  components/admin    Layout + widgets admin (KPI, tableaux, filtres)
  hooks/              Hooks (données dashboard, projets, auth)
  services/           Services simulés (mock) -> prêts pour API réelle
  mock/               Données locales (db.ts)
  pages/              Pages publiques et admin
  i18n/               Initialisation et clés de traduction
  data/               Specs, constantes, manifestes
public/               Assets statiques
```

## 8. Internationalisation (i18n)
Basé sur i18next + react-i18next. Ajoutez vos clés dans `src/i18n/index.ts`. Pour un nouveau domaine: créer un objet ou un namespace puis consommer via `useTranslation()`.

## 9. Styles
- TailwindCSS (utilities)
- Variables design admin: `src/components/admin/admin-tokens.css`

## 10. Lancer les tests (TODO)
Aucun framework de test configuré encore. Suggestion: Vitest + Testing Library.

## 11. Contribution (workflow Git simple)
```bash
# créer branche de feature
git checkout -b feature/ma-feature
# coder + ajouter fichiers
git add .
# commit
git commit -m "feat: description"
# push
git push -u origin feature/ma-feature
# ouvrir une Pull Request sur GitHub
```

## 12. Déploiement (idée simple)
1. Construire: `npm run build`
2. Déployer le dossier `dist/` sur un hébergeur statique (Netlify, Vercel, GitHub Pages).

### 12.1 Déploiement sur Render (Static Site)
Pour éviter l'erreur `Not Found` quand on recharge une route (ex: `/about`), il faut un fallback vers `index.html`.

Le fichier `static.json` contient maintenant:
```json
{
  "redirects": [
    { "source": "/api/*", "destination": "/api/*" },
    { "source": "/*", "destination": "/index.html" }
  ]
}
```
Cela force toutes les routes non-fichier à renvoyer l'app SPA.

Étapes Render:
1. Créer un service Static Site.
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. (Optionnel) Ajouter variables d'env Stripe.
5. Redéployer après modifications de `static.json`.

Si vous avez un backend Express unique sur Render au lieu d'un static site, utilisez le middleware `connect-history-api-fallback` (voir section plus bas) avant de servir `dist`.

## 13. Problèmes courants
| Problème | Solution |
|----------|----------|
| Port déjà utilisé | Changer le port: `npm run dev -- --port=4000` |
| Erreur de type TS | Lancer `npm run build` pour voir le détail |
| Fichier trop long pour Git (Windows) | `git config core.longpaths true` |

## 14. Licence
MIT.

---
Rapide pour démarrer: 1) `npm install` 2) `npm run dev` 3) coder ✨

## 16. Variables d'environnement
Ce projet utilise Vite, donc seules les variables préfixées par `VITE_` sont exposées côté client.

1. Copiez `.env.example` vers `.env.local` puis remplissez vos valeurs.
2. Les fichiers `.env*` sont ignorés par git (voir `.gitignore`).

Clés courantes:
- `VITE_API_URL` — URL de base pour les appels API du frontend
- `VITE_STRIPE_PUBLISHABLE_KEY` — Clé publique Stripe (client)
- `VITE_STRIPE_CHECKOUT_TEST_URL` — URL de session Checkout (mode démo)
- `VITE_GA_MEASUREMENT_ID`, `VITE_SENTRY_DSN` — IDs d'analytics/monitoring optionnels

Côté serveur uniquement (non exposé):
- `PORT` — utilisé par `server.cjs` pour l'aperçu statique

## 16. UX Chargement & 404
### Page 404
Route catch-all `*` -> `NotFoundPage` (lien retour Accueil / Projets / Don).

### Skeleton de chargement
Les pages sont maintenant chargées en lazy (`React.lazy`) avec un fallback shimmer (`PageSkeleton`). Ajuster le composant dans `src/components/feedback/PageSkeleton.tsx` si vous voulez un style différent.

## 15. Intégration Stripe (Donations)

Le bouton "Donate" redirige vers Stripe Checkout. Pour activer cette intégration côté frontend :

1. Créez un fichier `.env.local` à la racine du projet avec :
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxx
```
2. Fournissez un endpoint backend `POST /api/create-checkout-session` qui retourne `{ id: string }` (l'identifiant de la Checkout Session).
   Exemple (Node/Express minimal) :
```js
// server.js (exemple)
import express from 'express';
import Stripe from 'stripe';
const app = express();
app.use(express.json());
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amountCents, currency, donationType, projectId, donor } = req.body;
    const session = await stripe.checkout.sessions.create({
      mode: donationType === 'recurring' ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        donationType === 'recurring'
          ? {
              price_data: {
                currency,
                recurring: { interval: 'month' },
                product_data: { name: `Monthly donation – ${projectId}` },
                unit_amount: amountCents,
              },
              quantity: 1,
            }
          : {
              price_data: {
                currency,
                product_data: { name: `One-time donation – ${projectId}` },
                unit_amount: amountCents,
              },
              quantity: 1,
            },
      ],
      customer_email: donor?.email || undefined,
      metadata: {
        projectId,
        anonymous: donor?.anonymous ? 'true' : 'false',
        donorName: `${donor?.firstName || ''} ${donor?.lastName || ''}`.trim(),
      },
      success_url: 'https://votre-domaine.example/donate?status=success',
      cancel_url: 'https://votre-domaine.example/donate?status=cancel',
    });
    res.json({ id: session.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(4242, () => console.log('Stripe backend listening on 4242'));
```
3. En développement, configurez éventuellement un proxy Vite vers `http://localhost:4242` ou servez le backend sur le même domaine.
4. Pour les montants récurrents (subscription), Stripe crée un abonnement associé à un Price dynamique (usage basique). Pour des plans prédéfinis réels, créez les Prices dans le Dashboard et passez directement leurs IDs à `line_items`.
5. Sécurité: Ne JAMAIS exposer votre clé secrète dans le frontend. Le frontend n'utilise que la clé publishable.

Voir `src/services/checkoutSession.ts` et `DonationPage.tsx` pour l'intégration actuelle.

### Mode Aperçu Sans Backend
Si vous n'avez pas encore développé le backend, définissez une URL de session Checkout de test :
```
VITE_STRIPE_CHECKOUT_TEST_URL=https://checkout.stripe.com/c/pay/cs_test_XXXXXXXXXXXX
```
Dans ce cas le bouton redirige directement vers cette page Stripe (aucune transaction réelle n'est créée côté backend dans votre projet). Vous pouvez obtenir une URL en créant manuellement une session via le Dashboard ou via la Stripe CLI.

### Middleware Express (alternative si serveur Node unique)
```js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import history from 'connect-history-api-fallback';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// API d'abord
app.use('/api', (req, res) => res.json({ ok: true }));

// History fallback pour SPA
app.use(history({
  disableDotRule: true,
  verbose: false
}));

// Servir les assets build
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(3000, () => console.log('Server listening on :3000'));
```
