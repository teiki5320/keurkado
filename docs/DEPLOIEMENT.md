# Déploiement

## Aujourd'hui : GitHub Pages

- Adresse : https://teiki5320.github.io/keurkado
- `.github/workflows/deploy.yml` vérifie (lint, types, tests), construit (`out/`) et publie à chaque push sur `main`, chaque lundi et à la demande.
- Réglages (Settings › Secrets and variables › Actions › Variables), facultatifs : `SITE_URL` (par défaut https://teiki5320.github.io/keurkado), `BASE_PATH` (par défaut /keurkado).
- Settings › Pages › Source : **GitHub Actions**.

## Quand keurkado.com sera acheté : Cloudflare Pages (comme Keurbook)

1. Créer le projet Cloudflare Pages `keurkado` et y rattacher keurkado.com (et www).
2. Reprendre le workflow de Keurbook (`wrangler pages deploy out --project-name keurkado`), avec les secrets `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID`.
3. Variables : `SITE_URL=https://keurkado.com`, `BASE_PATH` vide, `ADSENSE_CLIENT=ca-pub-2680784147246798`.
4. Dans `src/lib/config.ts`, l'hébergeur par défaut devient Cloudflare (mentions légales).
5. AdSense : ajouter le site keurkado.com, créer les blocs « Keur Kado - top / rubrique / article » et renseigner leurs identifiants (`NEXT_PUBLIC_ADSENSE_SLOT_*`) ; ajouter `public/ads.txt`.
6. Amazon Partenaires : déclarer keurkado.com dans la liste des sites du compte.
