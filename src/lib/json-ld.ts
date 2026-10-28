import { avecBarre, siteConfig } from "./config";

/** Données structurées sérialisées pour une balise <script type="application/ld+json"> (« < » échappé). */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Adresse complète d'une page du site, avec la barre finale comme l'adresse canonique
 * (« /top » → « https://keurkado.com/top/ ») : Google ne doit jamais suivre une redirection.
 * Une adresse complète d'un autre site est rendue telle quelle.
 */
export function urlPage(adresse: string): string {
  if (/^https?:/.test(adresse) && !adresse.startsWith(siteConfig.url)) return adresse;
  const chemin = adresse.startsWith(siteConfig.url) ? adresse.slice(siteConfig.url.length) : adresse;
  return `${siteConfig.url}${avecBarre(chemin || "/")}`;
}

/** Compte Pinterest de Keur Kado (lien « sameAs » de l'organisation). */
export const PINTEREST = "https://www.pinterest.fr/keurkado/";

/**
 * Keur Kado, éditeur et auteur de toutes les pages : la même fiche partout (même @id),
 * sur l'accueil comme dans les Top 10 et les Conseils.
 */
export function organisationLd() {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organisation`,
    name: siteConfig.name,
    url: `${siteConfig.url}/`,
    logo: { "@type": "ImageObject", url: `${siteConfig.url}/brand/keurkado-logo.png`, width: 512, height: 512 },
    sameAs: [PINTEREST],
    parentOrganization: { "@type": "Organization", name: "TOA KEUR", url: "https://toakeur.com" },
  };
}

/** Fil d'Ariane pour Google (BreadcrumbList) à partir de couples nom / adresse (complète ou chemin). */
export function breadcrumbLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: urlPage(it.url) })),
  };
}

/** Liste de pages (ItemList) pour les pages d'entrée : Top 10, conseils, rubriques. */
export function itemListLd(name: string, items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: urlPage(it.url) })),
  };
}
