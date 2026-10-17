import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getConseils } from "@/lib/data/conseils";
import { FAMILLES } from "@/lib/taxonomie";
import { TOPS } from "@/lib/tops";

export const dynamic = "force-static";

/** Dernière mise à jour des pages fixes (rubriques, quiz, calendrier, pages légales). */
const MISE_A_JOUR = "2026-10-17";

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
  return [
    page("", 1, "weekly"),
    page("/quiz", 0.9),
    page("/top", 0.8, "weekly"),
    page("/envoyer-au-pays", 0.8),
    page("/calendrier", 0.8, "weekly"),
    page("/conseils", 0.7, "weekly"),
    ...Object.values(FAMILLES).flatMap((f) => f.liste.map((r) => page(`${f.chemin}/${r.slug}`, 0.7))),
    ...TOPS.map((t) => page(`/top/${t.slug}`, 0.9, "monthly", t.date)),
    ...conseils.map((c) => page(`/conseils/${c.slug}`, 0.6, "monthly", c.date)),
    ...["/mentions-legales", "/confidentialite", "/conditions"].map((p) => page(p, 0.2, "yearly")),
  ];
}
