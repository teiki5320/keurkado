import type { Produit } from "../types";
import { PRODUITS_ART_ET_DECO } from "./art-et-deco";
import { PRODUITS_BEAUTE_AFRO } from "./beaute-afro";
import { PRODUITS_BIJOUX } from "./bijoux";
import { PRODUITS_CUISINE } from "./cuisine";
import { PRODUITS_JEUX } from "./jeux";
import { PRODUITS_LIVRES } from "./livres";
import { PRODUITS_WAX_ET_MODE } from "./wax-et-mode";

export const PRODUITS: Produit[] = [
  ...PRODUITS_WAX_ET_MODE,
  ...PRODUITS_BIJOUX,
  ...PRODUITS_BEAUTE_AFRO,
  ...PRODUITS_ART_ET_DECO,
  ...PRODUITS_JEUX,
  ...PRODUITS_LIVRES,
  ...PRODUITS_CUISINE,
];
