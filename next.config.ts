import type { NextConfig } from "next";

/**
 * Site 100 % statique (dossier out/).
 * Publié sur keurkado.com (en ligne) par un Worker de fichiers statiques Cloudflare
 * (wrangler.jsonc, .github/workflows/deploy.yml), avec NEXT_PUBLIC_BASE_PATH vide.
 * L'ancienne adresse GitHub Pages (sous-dossier /keurkado) ne fait plus que rediriger.
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  // Adresses en « /top/ » (fichiers top/index.html) : « /top » et « /top/ » marchent toutes les deux, sur GitHub Pages comme sur Cloudflare.
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
