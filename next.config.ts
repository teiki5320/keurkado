import type { NextConfig } from "next";

/**
 * Site 100 % statique (dossier out/).
 * Publié sur GitHub Pages (sous-dossier /keurkado) par .github/workflows/deploy.yml,
 * puis sur Cloudflare Pages quand keurkado.com sera acheté (NEXT_PUBLIC_BASE_PATH vide).
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
