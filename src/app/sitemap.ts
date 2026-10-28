import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getConseils } from "@/lib/data/conseils";
import { FAMILLES } from "@/lib/taxonomie";
import { TOPS } from "@/lib/tops";

export const dynamic = "force-static";

/** Dernière mise à jour des rubriques, du quiz, du calendrier et de la page « Envoyer au pays » (guides écrits le 28/10/2026). */
const MISE_A_JOUR = "2026-10-28";
/** Dernière mise à jour des pages légales. */
const LEGAL = "2026-10-17";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const day = (d: string) => new Date(`${d}T00:00:00Z`);
  const conseils = getConseils();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly", d = MISE_A_JOUR) => ({
    url: `${base}${path}/`,
    lastModified: day(d),
    changeFrequency,
    priority,
  });
  // Les pages qui listent les nouveautés changent quand un article ou un Top 10 paraît.
  const plusRecent = (...dates: string[]) => dates.reduce((a, b) => (a > b ? a : b));
  const dernierConseil = plusRecent(MISE_A_JOUR, ...conseils.map((c) => c.date));
  const dernierTop = plusRecent(MISE_A_JOUR, ...TOPS.map((t) => t.date));
  return [
    page("", 1, "weekly", plusRecent(dernierConseil, dernierTop)),
    page("/quiz", 0.9),
    page("/top", 0.8, "weekly", dernierTop),
    page("/envoyer-au-pays", 0.8),
    page("/calendrier", 0.8, "weekly"),
    page("/conseils", 0.7, "weekly", dernierConseil),
    ...Object.values(FAMILLES).flatMap((f) => f.liste.map((r) => page(`${f.chemin}/${r.slug}`, 0.7))),
    ...TOPS.map((t) => page(`/top/${t.slug}`, 0.9, "monthly", t.date)),
    ...conseils.map((c) => page(`/conseils/${c.slug}`, 0.6, "monthly", c.date)),
    ...["/mentions-legales", "/confidentialite", "/conditions"].map((p) => page(p, 0.2, "yearly", LEGAL)),
  ];
}
