import type { Top } from "../types";
import bapteme from "./cadeaux-bapteme-africain";
import beaute from "./cadeaux-beaute-afro";
import enfant from "./cadeaux-africains-enfant";
import homme from "./cadeaux-africains-homme";
import maman from "./cadeaux-africains-maman";
import mariage from "./cadeaux-mariage-africain";
import moinsDe20 from "./cadeaux-africains-moins-de-20-euros";
import wax from "./cadeaux-wax";
import bijoux from "./bijoux-africains-a-offrir";
import korite from "./idees-cadeaux-korite";
import noel from "./idees-cadeaux-noel-africain";
import tabaski from "./idees-cadeaux-tabaski";
import ado from "./cadeaux-africains-ado";
import collegue from "./cadeaux-africains-collegue";
import feteDesMeres from "./idees-cadeaux-fete-des-meres";
import feteDesPeres from "./idees-cadeaux-fete-des-peres";
import anniversaire from "./idees-cadeaux-anniversaire";
import envoyer from "./cadeaux-a-envoyer-au-pays";
import femme from "./cadeaux-africains-femme";
import papa from "./cadeaux-africains-papa";
import saintValentin from "./idees-cadeaux-saint-valentin";

/** Toutes les pages « Top 10 », dans l'ordre d'affichage : la prochaine fête d'abord, puis les recherches les plus fréquentes. */
export const TOPS: Top[] = [
  noel,
  saintValentin,
  maman,
  femme,
  homme,
  papa,
  envoyer,
  wax,
  bijoux,
  beaute,
  moinsDe20,
  enfant,
  ado,
  collegue,
  anniversaire,
  korite,
  tabaski,
  feteDesMeres,
  feteDesPeres,
  mariage,
  bapteme,
];

export function getTop(slug: string): Top | undefined {
  return TOPS.find((t) => t.slug === slug);
}

/** Tops rattachés à une rubrique (« occasion/tabaski »). */
export function topsDe(rubrique: string): Top[] {
  return TOPS.filter((t) => t.rubrique === rubrique);
}
