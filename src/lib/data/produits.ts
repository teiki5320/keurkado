import { existsSync } from "node:fs";
import { join } from "node:path";
import { amazonUrl } from "@/lib/amazon";
import { PRODUITS } from "@/lib/catalogue";
import { BUDGETS, DESTINATAIRES, FAMILLES, UNIVERS, type Famille } from "@/lib/taxonomie";
import type { Produit } from "@/lib/types";

/** Produit prêt à afficher (carte, quiz) : uniquement des données simples, transmissibles au navigateur. */
export interface CarteProduit {
  slug: string;
  nom: string;
  description: string;
  univers: string;
  universNom: string;
  budget: string;
  budgetNom: string;
  occasions: string[];
  pour: string[];
  /** Destinataires en toutes lettres (« maman, femme »). */
  pourNoms: string;
  voyage: boolean;
  url: string;
  prix: number | null;
  /** Illustration du produit créée par IA (public/produits/<slug>.webp), si elle existe. */
  image: string | null;
}

/** Dossier des illustrations des produits (créées par IA, voir docs/IMAGES.md). */
const DOSSIER_IMAGES = join(process.cwd(), "public", "produits");

const UNIVERS_NOM = new Map<string, string>(UNIVERS.map((u) => [u.slug, u.nom]));
const BUDGET_NOM = new Map<string, string>(BUDGETS.map((b) => [b.slug, b.nom]));
const POUR_NOM = new Map<string, string>(DESTINATAIRES.map((d) => [d.slug, d.nom.toLowerCase()]));
const PAR_SLUG = new Map(PRODUITS.map((p) => [p.slug, p]));

export function getProduits(): Produit[] {
  return PRODUITS;
}

export function getProduit(slug: string): Produit | undefined {
  return PAR_SLUG.get(slug);
}

export function toCarte(p: Produit): CarteProduit {
  return {
    slug: p.slug,
    nom: p.nom,
    description: p.description,
    univers: p.univers,
    universNom: UNIVERS_NOM.get(p.univers) ?? p.univers,
    budget: p.budget,
    budgetNom: BUDGET_NOM.get(p.budget) ?? p.budget,
    occasions: [...p.occasions],
    pour: [...p.pour],
    pourNoms: p.pour.map((x) => POUR_NOM.get(x) ?? x).join(", "),
    voyage: p.voyage,
    url: amazonUrl(p),
    prix: p.priceCents ?? null,
    image: existsSync(join(DOSSIER_IMAGES, `${p.slug}.webp`)) ? `/produits/${p.slug}.webp` : null,
  };
}

/** Le produit porte-t-il l'étiquette de cette rubrique ? */
export function porte(p: Produit, famille: Famille, slug: string): boolean {
  switch (famille) {
    case "occasion":
      return (p.occasions as readonly string[]).includes(slug);
    case "pour":
      return (p.pour as readonly string[]).includes(slug);
    case "budget":
      return p.budget === slug;
    case "univers":
      return p.univers === slug;
  }
}

/** Produits d'une rubrique (occasion, destinataire, budget ou univers), du moins cher au plus cher. */
export function produitsDe(famille: Famille, slug: string): Produit[] {
  return trierParBudget(PRODUITS.filter((p) => porte(p, famille, slug)));
}

/**
 * Produits d'une rubrique, les plus propres à cette rubrique d'abord (étiquetés pour peu d'autres occasions
 * ou destinataires), puis ceux qui ont un lien Amazon direct ; à égalité, du moins cher au plus cher.
 * Ainsi « papa » et « fête des pères » ne commencent pas par les mêmes cadeaux.
 */
export function produitsParPertinence(famille: Famille, slug: string): Produit[] {
  const etiquettes = (p: Produit) => (famille === "occasion" ? p.occasions.length : famille === "pour" ? p.pour.length : 1);
  return [...produitsDe(famille, slug)].sort((a, b) => etiquettes(a) - etiquettes(b) || Number(!!b.amazonAsin) - Number(!!a.amazonAsin));
}

/** Produits qui voyagent bien (« Cadeaux à envoyer au pays »). */
export function produitsVoyage(): Produit[] {
  return trierParBudget(PRODUITS.filter((p) => p.voyage));
}

const RANG_BUDGET = new Map<string, number>(BUDGETS.map((b, i) => [b.slug, i]));
export function trierParBudget(liste: Produit[]): Produit[] {
  return [...liste].sort((a, b) => (RANG_BUDGET.get(a.budget) ?? 0) - (RANG_BUDGET.get(b.budget) ?? 0) || a.nom.localeCompare(b.nom, "fr"));
}

/** Nombre de produits de chaque rubrique d'une famille (pour les pastilles « 12 idées »). */
export function comptes(famille: Famille): Map<string, number> {
  return new Map(FAMILLES[famille].liste.map((r) => [r.slug, produitsDe(famille, r.slug).length]));
}
