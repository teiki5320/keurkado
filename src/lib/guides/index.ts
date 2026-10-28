import type { Famille } from "../taxonomie";
import { GUIDES_BUDGET } from "./budget";
import { GUIDES_OCCASION } from "./occasion";
import { GUIDES_POUR } from "./pour";
import type { Guide, Guides } from "./types";
import { GUIDES_UNIVERS } from "./univers";

export type { Guide } from "./types";
export { GUIDE_ENVOYER, GUIDE_QUIZ, GUIDE_TOPS } from "./pages";
export { GUIDES_FRERES } from "./univers";

const GUIDES: Record<Famille, Guides> = { occasion: GUIDES_OCCASION, pour: GUIDES_POUR, budget: GUIDES_BUDGET, univers: GUIDES_UNIVERS };

/** Guide propre à une rubrique, s'il existe (les univers « livres » et « cuisine » renvoient aux sites frères). */
export function guideDe(famille: Famille, slug: string): Guide | undefined {
  return GUIDES[famille][slug];
}

/** Nombre de mots d'un guide (intertitres compris). */
export function motsDuGuide(guide: Guide): number {
  return guide.parties.flatMap((p) => [p.titre, ...p.paragraphes]).join(" ").split(/\s+/).filter(Boolean).length;
}
