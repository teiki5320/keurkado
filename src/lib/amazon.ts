import type { Produit } from "./types";

/** Programme Partenaires Amazon : identifiant ajouté à tous les liens vers Amazon.fr. */
export const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "keurkado-21";

/**
 * Lien d'achat d'un produit : la fiche Amazon.fr si l'ASIN est connu (vérifié à la main),
 * sinon une recherche Amazon avec les mots du champ « recherche » (dans le rayon indiqué, s'il y en a un).
 */
export function amazonUrl(produit: Pick<Produit, "amazonAsin" | "recherche" | "rayon">): string {
  if (produit.amazonAsin) return `https://www.amazon.fr/dp/${encodeURIComponent(produit.amazonAsin)}?tag=${AMAZON_TAG}`;
  const rayon = produit.rayon ? `&i=${encodeURIComponent(produit.rayon)}` : "";
  return `https://www.amazon.fr/s?k=${encodeURIComponent(produit.recherche)}${rayon}&tag=${AMAZON_TAG}`;
}

/** Attributs d'un lien Amazon : nouvel onglet, lien sponsorisé (obligatoire pour Google). */
export const AMAZON_REL = "sponsored nofollow noopener noreferrer";

/** Mention obligatoire du programme Partenaires Amazon. */
export const AMAZON_DISCLOSURE =
  "En tant que Partenaire Amazon, Keur Kado réalise un bénéfice sur les achats remplissant les conditions requises.";

/** Date du dernier relevé des prix Amazon affichés à titre indicatif (vide tant qu'aucun prix n'est relevé). */
export const AMAZON_PRICES_CHECKED_ON = "";
