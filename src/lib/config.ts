/**
 * Configuration générale du site.
 * Les valeurs propres à l'entreprise se règlent via les variables d'environnement (voir .env.example).
 */
/** Hébergeur du site : GitHub Pages tant que keurkado.com n'est pas acheté, puis Cloudflare Pages (comme Keurbook). */
const defaultHost = { name: "GitHub", full: "GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis — github.com" };

/**
 * Sous-dossier du site : « /keurkado » sur GitHub Pages (teiki5320.github.io/keurkado), vide sur keurkado.com.
 * next/link l'ajoute tout seul ; pour les images et le HTML des articles, passer par withBase().
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

/** Chemin interne (« /epingles/x.jpg ») préfixé du sous-dossier du site. */
export const withBase = (path: string) => (path.startsWith("/") && !path.startsWith("//") ? `${BASE_PATH}${path}` : path);

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Keur Kado",
  tagline: "Les idées cadeaux africains",
  description:
    "Idées cadeaux africains pour toutes les occasions : Tabaski, Korité, Noël, mariage, baptême. Wax, bijoux, beauté afro, déco et cadeaux à envoyer au pays.",
  /** Adresse publique complète, sous-dossier compris (sert aux adresses canoniques, au sitemap et aux épingles). */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://keurkado.com").replace(/\/$/, ""),
  locale: "fr_FR",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "keurkado@toakeur.com",
};

/**
 * Google AdSense : identifiant d'éditeur (le même que Keurbook, public par conception).
 * Vide = aucune publicité ni script Google sur le site. Coupé tant que le site est sur GitHub Pages :
 * AdSense n'accepte que les sites sur leur propre domaine. À activer avec keurkado.com
 * (variable NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-2680784147246798 dans le workflow de publication).
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

/**
 * Identifiants des blocs d'annonces AdSense (à créer dans AdSense : blocs « Keur Kado - … »).
 * Un emplacement sans identifiant n'affiche rien. Pages sans annonce : accueil, quiz, pages légales, 404.
 * - top : 2 annonces dans un Top 10 (après le 5e cadeau, puis en fin de page) ;
 * - rubrique : 1 annonce en bas des pages occasion, destinataire, budget et univers ;
 * - article : 2 annonces dans un conseil (au milieu du texte, puis en fin de page).
 */
export const ADSENSE_SLOTS = {
  top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "",
  rubrique: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RUBRIQUE ?? "",
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE ?? "",
};
export type AdPlacement = keyof typeof ADSENSE_SLOTS;

/** Informations légales de l'éditeur, affichées dans les mentions légales et les conditions d'utilisation. */
export const legalConfig = {
  companyName: process.env.NEXT_PUBLIC_LEGAL_COMPANY_NAME || "ALOHASH",
  tradeName: process.env.NEXT_PUBLIC_LEGAL_TRADE_NAME || "TOA CORP",
  legalForm: process.env.NEXT_PUBLIC_LEGAL_FORM || "SAS (société par actions simplifiée) au capital de 200 €",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "587 La Petite Sigonnière, 85190 Maché, France",
  siret: process.env.NEXT_PUBLIC_LEGAL_SIRET || "938 522 596 00015",
  rcs: process.env.NEXT_PUBLIC_LEGAL_RCS || "RCS La Roche-sur-Yon 938 522 596",
  vat: process.env.NEXT_PUBLIC_LEGAL_VAT || "FR16 938 522 596",
  director: process.env.NEXT_PUBLIC_LEGAL_DIRECTOR || "le président de la société ALOHASH",
  phone: process.env.NEXT_PUBLIC_LEGAL_PHONE || "",
  host: process.env.NEXT_PUBLIC_LEGAL_HOST || defaultHost.full,
  hostName: process.env.NEXT_PUBLIC_LEGAL_HOST_NAME || defaultHost.name,
};
