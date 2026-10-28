import type { Produit } from "../types";
import { PRODUITS_ART_ET_DECO } from "./art-et-deco";
import { PRODUITS_BEAUTE_AFRO } from "./beaute-afro";
import { PRODUITS_BIJOUX } from "./bijoux";
import { PRODUITS_CUISINE } from "./cuisine";
import { PRODUITS_JEUX } from "./jeux";
import { PRODUITS_LIVRES } from "./livres";
import { PRODUITS_WAX_ET_MODE } from "./wax-et-mode";

import VERIFICATIONS from "./verifications.json";

/**
 * Relevé de disponibilité des fiches Amazon (scripts/verifier-produits.mts, lancé sur le Mac) :
 * pour chaque produit à ASIN, l'ASIN vérifié, la date et l'état lu sur la fiche.
 */
export interface Verification {
  asin: string;
  /** Date du dernier passage (AAAA-MM-JJ). */
  verifieLe: string;
  /** « indisponible » : plus de bouton d'achat sur la fiche ; le produit n'est plus affiché (à remplacer). */
  statut: "disponible" | "indisponible";
}
export const VERIFICATIONS_PRODUITS = VERIFICATIONS as Record<string, Verification>;

/** Tout le catalogue, produits indisponibles compris (pour le script de vérification). */
export const TOUS_LES_PRODUITS: Produit[] = [
  ...PRODUITS_WAX_ET_MODE,
  ...PRODUITS_BIJOUX,
  ...PRODUITS_BEAUTE_AFRO,
  ...PRODUITS_ART_ET_DECO,
  ...PRODUITS_JEUX,
  ...PRODUITS_LIVRES,
  ...PRODUITS_CUISINE,
];

/** Le produit est-il marqué indisponible pour son ASIN actuel ? (un nouvel ASIN repart de zéro) */
export function estIndisponible(p: Produit): boolean {
  const v = VERIFICATIONS_PRODUITS[p.slug];
  return !!p.amazonAsin && v?.asin === p.amazonAsin && v.statut === "indisponible";
}

/** Catalogue affiché : jamais un produit dont la fiche Amazon n'a plus de bouton d'achat. */
export const PRODUITS: Produit[] = TOUS_LES_PRODUITS.filter((p) => !estIndisponible(p));
