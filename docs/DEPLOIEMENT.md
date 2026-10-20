# Déploiement

## Cloudflare, Worker de fichiers statiques (keurkado.com), comme Keur Foot

- Worker « keurkado » sans code serveur : il sert le dossier `out/` (configuration dans `wrangler.jsonc` : `assets.directory`, page 404, pas d'adresse workers.dev, domaines keurkado.com et www.keurkado.com en `custom_domain`).
- `.github/workflows/deploy.yml` vérifie (lint, types, tests), construit (`out/`) et publie par `npx wrangler deploy` à chaque push sur `main`, chaque lundi et à la demande.
- Secrets GitHub (Settings › Secrets and variables › Actions › Secrets) : `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID`. Sans eux, la publication est sautée avec un avertissement.
- Jeton Cloudflare : modèle « Modifier Cloudflare Workers », plus Zone › DNS › Modifier, limité à la zone keurkado.com.
- Publication à la main depuis un Mac connecté à Cloudflare : `NEXT_PUBLIC_SITE_URL=https://keurkado.com npm run build`, puis `npx wrangler deploy`.
- **Ne pas utiliser `wrangler pages …`** : la commande convertit le projet en application OpenNext et modifie les fichiers.
- En-têtes de sécurité et cache : `public/_headers` ; redirections : `public/_redirects` ; AdSense : `public/ads.txt`.
- Variable facultative : `PINTEREST_VERIFY` (revendication du domaine sur Pinterest).

## Après la mise en service de keurkado.com

1. Ancienne adresse teiki5320.github.io/keurkado : `.github/workflows/pages.yml` n'y publie plus qu'une page qui redirige vers la même page sur keurkado.com (fait le 20 octobre 2026).
2. AdSense : ajouter le site keurkado.com, créer les blocs « Keur Kado - top / rubrique / article » et renseigner leurs identifiants (`ADSENSE_SLOTS`, `src/lib/config.ts`).
3. Amazon Partenaires : déclarer keurkado.com dans la liste des sites du compte.
4. Mettre à jour le lien de la carte Keur Kado sur toakeur.com.
