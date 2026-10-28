import type { Produit } from "./types";

/** Programme Partenaires Amazon : identifiant ajouté à tous les liens vers Amazon.fr. */
export const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "keurkadofr-21";

/**
 * Lien d'achat d'un produit : la fiche Amazon.fr si l'ASIN est connu (vérifié à la main),
 * sinon une recherche Amazon avec les mots du champ « recherche » (dans le rayon indiqué, s'il y en a un).
 */
export function amazonUrl(produit: Pick<Produit, "amazonAsin" | "recherche" | "rayon">): string {
  if (produit.amazonAsin) return `https://www.amazon.fr/dp/${encodeURIComponent(produit.amazonAsin)}?tag=${AMAZON_TAG}`;
  const rayon = produit.rayon ? `&i=${encodeURIComponent(produit.rayon)}` : "";
  return `https://www.amazon.fr/s?k=${encodeURIComponent(produit.recherche)}${rayon}&tag=${AMAZON_TAG}`;
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
