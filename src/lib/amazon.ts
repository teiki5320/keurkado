import type { Produit } from "./types";

/** Programme Partenaires Amazon : identifiant actuel du site, ajouté à tous les liens vers Amazon.fr. */
export const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "keurkadofr-21";

/**
 * Codes de suivi Amazon par emplacement : la table unique du site. Pour savoir quelles pages rapportent,
 * Jean pourra créer un code par emplacement dans Amazon Partenaires, puis le remplacer ici (une ligne).
 * Pour l'instant, tous les emplacements gardent le code actuel du site : rien ne change en ligne.
 * - top : les Top 10 (/top/…) ;
 * - rubrique : les pages occasion, destinataire, budget, univers et « Cadeaux à envoyer au pays » ;
 * - conseil : les articles conseils (/conseils/…) ;
 * - quiz : l'atelier de Tonton Kado (quiz, sur /quiz et l'accueil).
 */
export const CODES_SUIVI = {
  top: AMAZON_TAG,
  rubrique: AMAZON_TAG,
  conseil: AMAZON_TAG,
  quiz: AMAZON_TAG,
} as const satisfies Record<string, string>;
export type Emplacement = keyof typeof CODES_SUIVI;

/**
 * Lien d'achat d'un produit : la fiche Amazon.fr si l'ASIN est connu (vérifié à la main),
 * sinon une recherche Amazon avec les mots du champ « recherche » (dans le rayon indiqué, s'il y en a un).
 * Le code de suivi dépend de l'emplacement du lien (table CODES_SUIVI).
 */
export function amazonUrl(produit: Pick<Produit, "amazonAsin" | "recherche" | "rayon">, emplacement: Emplacement): string {
  const tag = CODES_SUIVI[emplacement];
  if (produit.amazonAsin) return `https://www.amazon.fr/dp/${encodeURIComponent(produit.amazonAsin)}?tag=${tag}`;
  const rayon = produit.rayon ? `&i=${encodeURIComponent(produit.rayon)}` : "";
  return `https://www.amazon.fr/s?k=${encodeURIComponent(produit.recherche)}${rayon}&tag=${tag}`;
}

/**
 * Attributs d'un lien Amazon : lien sponsorisé (obligatoire pour Google), nouvel onglet sans accès à notre page.
 * Pas de « noreferrer » : Amazon doit voir que le visiteur vient de keurkado.com.
 */
export const AMAZON_REL = "sponsored nofollow noopener";

/** Ligne discrète sous chaque bouton « Voir sur Amazon » (même modèle sur tous les sites du groupe). */
export const AMAZON_LIEN_PARTENAIRE = "Lien partenaire Amazon. Prix, disponibilité et vendeur sont indiqués sur Amazon.";

/** Sous la ligne précédente, quand la carte montre une illustration générée par IA. */
export const ILLUSTRATION_IA = "Illustration IA : l'article vendu peut différer.";

/** Mention obligatoire du programme Partenaires Amazon. */
export const AMAZON_DISCLOSURE =
  "En tant que Partenaire Amazon, Keur Kado réalise un bénéfice sur les achats remplissant les conditions requises.";

/** Date du dernier relevé des prix Amazon affichés à titre indicatif (vide tant qu'aucun prix n'est relevé). */
export const AMAZON_PRICES_CHECKED_ON = "";
