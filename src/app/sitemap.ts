import { execFileSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getConseils } from "@/lib/data/conseils";
import { FAMILLES } from "@/lib/taxonomie";
import { TOPS } from "@/lib/tops";

export const dynamic = "force-static";

/**
 * Date du dernier commit qui a touché ces fichiers (AAAA-MM-JJ), comme Keur Déco : la date des pages fixes
 * avance toute seule quand leur texte change. Sans historique git (dossier copié), on prend le jour du build.
 * En publication (deploy.yml), le dépôt est récupéré avec tout son historique (fetch-depth: 0).
 */
function dateGit(...fichiers: string[]): string {
  try {
    const date = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...fichiers], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  } catch {
    // git absent : date du jour ci-dessous.
  }
  return new Date().toISOString().slice(0, 10);
}

/** Fichiers communs à toutes les rubriques (gabarit, catalogue, rubriques, Top 10 affichés). */
const SOURCES_RUBRIQUES = ["src/components/produit/RubriquePage.tsx", "src/components/produit/ProduitCard.tsx", "src/lib/catalogue", "src/lib/taxonomie.ts", "src/lib/data/produits.ts"];

/** Fichiers source de chaque page fixe (page, textes, données affichées). */
const SOURCES: Record<string, string[]> = {
  "/quiz": ["src/app/(site)/quiz", "src/components/quiz", "src/lib/data/atelier.ts", "src/lib/guides/pages.ts", "src/lib/catalogue"],
  "/envoyer-au-pays": ["src/app/(site)/envoyer-au-pays", "src/lib/guides/pages.ts", "src/lib/catalogue"],
  "/calendrier": ["src/app/(site)/calendrier", "src/lib/calendrier.ts", "src/components/calendrier"],
  "/top": ["src/app/(site)/top/page.tsx", "src/lib/guides/pages.ts"],
  "/conseils": ["src/app/(site)/conseils/page.tsx", "src/lib/conseils/categories.ts"],
  "/mentions-legales": ["src/app/(legal)/mentions-legales", "src/components/layout/LegalPage.tsx"],
  "/confidentialite": ["src/app/(legal)/confidentialite", "src/components/layout/LegalPage.tsx"],
  "/conditions": ["src/app/(legal)/conditions", "src/components/layout/LegalPage.tsx"],
};

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const day = (d: string) => new Date(`${d}T00:00:00Z`);
  const conseils = getConseils();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly", d: string) => ({
    url: `${base}${path}/`,
    lastModified: day(d),
    changeFrequency,
    priority,
  });
  const fixe = (path: string) => dateGit(...SOURCES[path]);
  // Les pages qui listent les nouveautés changent quand un article ou un Top 10 paraît.
  const plusRecent = (...dates: string[]) => dates.reduce((a, b) => (a > b ? a : b));
  const dernierConseil = plusRecent(fixe("/conseils"), ...conseils.map((c) => c.maj ?? c.date));
  const dernierTop = plusRecent(fixe("/top"), ...TOPS.map((t) => t.maj ?? t.date));
  const rubriques = Object.values(FAMILLES).flatMap((f) => {
    // Une famille (occasion, pour, budget, univers) : sa page, son fichier de textes, plus les fichiers communs.
    const famille = f.chemin.slice(1);
    const d = dateGit(`src/app/(site)/${famille}`, `src/lib/guides/${famille}.ts`, ...SOURCES_RUBRIQUES);
    return f.liste.map((r) => page(`${f.chemin}/${r.slug}`, 0.7, "monthly", d));
  });
  return [
    page("", 1, "weekly", plusRecent(dernierConseil, dernierTop, dateGit("src/app/(site)/page.tsx"))),
    page("/quiz", 0.9, "monthly", fixe("/quiz")),
    page("/top", 0.8, "weekly", dernierTop),
    page("/envoyer-au-pays", 0.8, "monthly", fixe("/envoyer-au-pays")),
    page("/calendrier", 0.8, "weekly", fixe("/calendrier")),
    page("/conseils", 0.7, "weekly", dernierConseil),
    ...rubriques,
    // Top 10 et conseils : champ « maj » (modification notable du contenu), sinon date de publication.
    ...TOPS.map((t) => page(`/top/${t.slug}`, 0.9, "monthly", t.maj ?? t.date)),
    ...conseils.map((c) => page(`/conseils/${c.slug}`, 0.6, "monthly", c.maj ?? c.date)),
    ...["/mentions-legales", "/confidentialite", "/conditions"].map((p) => page(p, 0.2, "yearly", fixe(p))),
  ];
}
