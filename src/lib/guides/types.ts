/**
 * Guide propre à une rubrique (/occasion, /pour, /budget, /univers) : 350 à 450 mots écrits pour cette page,
 * avec un angle qui la distingue de ses voisines (maman ≠ fête des mères, papa ≠ homme…).
 * Affiché sous les idées cadeaux, à la place des deux paragraphes « Bien choisir » de la taxonomie.
 */
export interface Guide {
  /** 3 ou 4 parties, chacune avec un intertitre (h3) et 1 ou 2 paragraphes. */
  parties: { titre: string; paragraphes: string[] }[];
}

/** Guides d'une famille, par slug de rubrique. */
export type Guides = Record<string, Guide>;
