import type { Metadata } from "next";
import { siteConfig } from "./config";

/** Image de partage par défaut (1200 × 630, logo Keur Kado), pour les pages sans image propre. */
export const DEFAULT_SHARE_IMAGES: Array<{ url: string; width: number; height: number; alt: string }> = [
  { url: "/brand/keurkado-partage.jpg", width: 1200, height: 630, alt: "Keur Kado, les idées cadeaux africains" },
];

/** Longueur maximale d'un titre de page (balise title), suffixe « | Keur Kado » compris. */
export const TITRE_MAX = 60;

/** Coupe un texte trop long au dernier mot entier et ajoute « … » (au plus `max` caractères), comme Keur Déco. */
export function couperTexte(texte: string, max: number): string {
  if (texte.length <= max) return texte;
  const coupe = texte.slice(0, max - 1);
  const espace = coupe.lastIndexOf(" ");
  return `${(espace > max / 2 ? coupe.slice(0, espace) : coupe).replace(/[\s,;:.!?«»–—-]+$/, "")}…`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  /** Chemin de la page (« /quiz »), utilisé pour l'adresse canonique et le partage. */
  path: string;
  image?: string | null;
  imageAlt?: string;
  /** Largeur et hauteur de l'image propre (aperçus Facebook, WhatsApp, X). */
  imageSize?: [number, number];
  type?: "website" | "article" ;
  publishedTime?: string;
  noindex?: boolean;
  /** Titre utilisé tel quel, sans le suffixe « | Keur Kado » (accueil). */
  absoluteTitle?: boolean;
}

/**
 * Métadonnées d'une page : titre, description, adresse canonique et aperçu de partage.
 * Next.js remplace entièrement le bloc openGraph du layout dès qu'une page en définit un : on le reconstruit ici.
 */
export function pageMetadata({ title, description, path, image, imageAlt, imageSize, type = "website", publishedTime, noindex, absoluteTitle }: PageMetadataInput): Metadata {
  // Titre complet limité à 60 caractères (au-delà, Google le coupe) : sans le suffixe s'il est trop long,
  // et coupé proprement en fin de mot s'il dépasse encore.
  const suffixed = `${title} | ${siteConfig.name}`;
  const absolute = absoluteTitle || suffixed.length > TITRE_MAX;
  const fullTitle = absolute ? couperTexte(title, TITRE_MAX) : suffixed;
  const images = image
    ? [{ url: image, alt: imageAlt ?? title, ...(imageSize ? { width: imageSize[0], height: imageSize[1] } : {}) }]
    : DEFAULT_SHARE_IMAGES;
  return {
    title: absolute ? { absolute: fullTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: type,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url: path,
      title: fullTitle,
      description,
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: images.map((i) => i.url) },
    // Grande image autorisée dans Google Discover et les résultats (« max-image-preview:large »).
    robots: noindex ? { index: false, follow: true, "max-image-preview": "large" } : { "max-image-preview": "large" },
  };
}

/** Texte coupé proprement pour une description (≤ max caractères ; Google en montre environ 155). */
export function clip(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
