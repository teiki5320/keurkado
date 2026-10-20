# Déploiement

## Cloudflare Pages (keurkado.com), comme Keurbook

- Projet Cloudflare Pages : `keurkado` (adresse technique `keurkado.pages.dev`, non indexée grâce à `public/_headers`).
- `.github/workflows/deploy.yml` vérifie (lint, types, tests), construit (`out/`) et publie à chaque push sur `main`, chaque lundi et à la demande.
- Secrets GitHub nécessaires (Settings › Secrets and variables › Actions › Secrets) : `CLOUDFLARE_API_TOKEN` (droit « Cloudflare Pages : modifier ») et `CLOUDFLARE_ACCOUNT_ID`. Sans eux, la publication est sautée avec un avertissement.
- Domaine : dans Cloudflare › Workers & Pages › keurkado › Domaines personnalisés, ajouter `keurkado.com` (et `www.keurkado.com`).
- Variable facultative : `PINTEREST_VERIFY` (revendication du domaine sur Pinterest).
- En-têtes de sécurité et cache : `public/_headers` ; redirections : `public/_redirects` ; AdSense : `public/ads.txt`.

## Après la mise en service de keurkado.com

1. AdSense : ajouter le site keurkado.com, créer les blocs « Keur Kado - top / rubrique / article » et renseigner leurs identifiants (`NEXT_PUBLIC_ADSENSE_SLOT_*` dans `src/lib/config.ts` ou en variables).
2. Amazon Partenaires : déclarer keurkado.com dans la liste des sites du compte.
3. Désactiver GitHub Pages (Settings › Pages) : l'ancienne adresse teiki5320.github.io/keurkado ne doit plus servir de copie du site.
4. Mettre à jour le lien de la carte Keur Kado sur toakeur.com.
