import type { Choix, FeteAtelier } from "@/components/quiz/Atelier";
import { FETES } from "@/lib/calendrier";
import { getProduits, toCarte } from "@/lib/data/produits";
import { BUDGETS, DESTINATAIRES, OCCASIONS } from "@/lib/taxonomie";
import { TOPS } from "@/lib/tops";

const dateCourte = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Première phrase d'un texte (réplique courte de Tonton Kado). */
const premierePhrase = (t: string) => t.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? t;

/** Données de l'atelier de Tonton Kado (accueil et /quiz) : catalogue, choix, fêtes à venir, Top 10. */
export function donneesAtelier() {
  const options: { pour: Choix[]; occasion: Choix[]; budget: Choix[] } = {
    pour: DESTINATAIRES.map(({ slug, nom }) => ({ slug, nom })),
    occasion: OCCASIONS.map(({ slug, nom, intro }) => ({ slug, nom, note: premierePhrase(intro) })),
    budget: BUDGETS.map(({ slug, nom }) => ({ slug, nom })),
  };
  const fetes: FeteAtelier[] = FETES.map((f) => {
    const occasion = f.lien?.href.match(/^\/occasion\/(.+)$/)?.[1];
    return {
      slug: f.slug,
      nom: f.nom.replace(/ \(.*\)$/, ""),
      date: f.date,
      dateLabel: `${dateCourte.format(new Date(`${f.date}T12:00:00Z`))}${f.estimee ? " · estimée" : ""}`,
      occasion,
      href: f.lien?.href,
    };
  });
  return {
    produits: getProduits().map((p) => toCarte(p, "quiz")),
    options,
    fetes,
    tops: TOPS.slice(0, 6).map(({ slug, titre }) => ({ slug, titre })),
  };
}
