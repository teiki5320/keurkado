import { FAMILLES, trouver, type Famille } from "../taxonomie";

/** Pages du site qui peuvent porter un Top 10 sans être une rubrique (« page/envoyer-au-pays »). */
export const PAGES_TOP = {
  "envoyer-au-pays": { nom: "Envoyer au pays", titre: "Cadeaux à envoyer au pays", href: "/envoyer-au-pays" },
} as const;

/** « occasion/tabaski » ou « page/envoyer-au-pays » → nom et adresse de la page de rattachement d'un Top 10. */
export function rubriqueDuTop(rubrique: string): { nom: string; titre: string; href: string } | null {
  const [famille, slug] = rubrique.split("/");
  if (famille === "page") return PAGES_TOP[slug as keyof typeof PAGES_TOP] ?? null;
  if (!(famille in FAMILLES)) return null;
  const r = trouver(famille as Famille, slug);
  return r ? { nom: r.nom, titre: r.titre, href: `${FAMILLES[famille as Famille].chemin}/${r.slug}` } : null;
}
