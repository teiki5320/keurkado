import { FAMILLES, trouver, type Famille } from "../taxonomie";

/** « occasion/tabaski » → nom et adresse de la rubrique de rattachement d'un Top 10. */
export function rubriqueDuTop(rubrique: string): { nom: string; titre: string; href: string } | null {
  const [famille, slug] = rubrique.split("/") as [Famille, string];
  if (!(famille in FAMILLES)) return null;
  const r = trouver(famille, slug);
  return r ? { nom: r.nom, titre: r.titre, href: `${FAMILLES[famille].chemin}/${r.slug}` } : null;
}
