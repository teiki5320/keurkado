/** Catégories de la rubrique Conseils. */
export const CONSEIL_CATEGORIES = {
  traditions: "Fêtes et traditions",
  choisir: "Bien choisir",
  envoyer: "Envoyer au pays",
} as const;

export type ConseilCategory = keyof typeof CONSEIL_CATEGORIES;

export const isConseilCategory = (v: string): v is ConseilCategory => v in CONSEIL_CATEGORIES;
