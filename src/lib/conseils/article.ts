import { suivantsEnBoucle } from "../liens";
import { isConseilCategory, type ConseilCategory } from "./categories";

/** Article de la rubrique Conseils : un fichier Markdown de content/conseils/, une question. */
export interface Conseil {
  slug: string;
  /** La question posée, qui sert de titre. */
  title: string;
  /** Description pour Google (70 à 170 caractères). */
  description: string;
  /** Date de publication (AAAA-MM-JJ, de préférence un lundi) : l'article n'apparaît qu'à partir de ce jour. */
  date: string;
  /** Dernière modification notable (AAAA-MM-JJ, champ « maj » de l'en-tête), si elle est postérieure à la publication. */
  maj?: string;
  theme: ConseilCategory;
  /** Réponse courte affichée en haut de l'article. */
  resume: string;
  /** Produits du catalogue cités (slugs), affichés en cartes avec bouton Amazon. */
  produits: string[];
  /** Corps de l'article en Markdown (parties en « ## »). */
  body: string;
  /** Illustration Keur Kado : public/conseils/<slug>.webp, si elle existe. */
  image?: string | null;
}

export const DESCRIPTION_MIN = 70;
export const DESCRIPTION_MAX = 160;

/** En-tête simple « clé: valeur » entre deux lignes « --- » ; les listes sont séparées par des virgules. */
export function parseConseil(slug: string, raw: string): Conseil {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`Conseil « ${slug} » : en-tête manquant.`);
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const list = (v?: string) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);
  const theme = meta.theme ?? "";
  if (!isConseilCategory(theme)) throw new Error(`Conseil « ${slug} » : catégorie inconnue « ${theme} ».`);
  return {
    slug,
    title: meta.title ?? "",
    description: meta.description ?? "",
    date: meta.date ?? "",
    ...(meta.maj ? { maj: meta.maj } : {}),
    theme,
    resume: meta.resume ?? "",
    produits: list(meta.produits),
    body: match[2].trim(),
  };
}

/** Date du jour à Paris (AAAA-MM-JJ) : un article paraît le jour de sa date à 0 h, heure française. */
export function todayInParis(now = new Date()): string {
  return new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export const isPublished = (c: Pick<Conseil, "date">, today: string) => /^\d{4}-\d{2}-\d{2}$/.test(c.date) && c.date <= today;

/** Parties de l'article (titres « ## ») pour le sommaire, avec leur ancre. */
export function conseilSections(body: string): Array<{ id: string; title: string }> {
  return [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => ({ id: anchorId(m[1]), title: m[1].trim() }));
}

export function anchorId(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Liens internes du corps de l'article (« /top/… », « /occasion/… », « /conseils/… »). */
export function internalLinks(body: string): string[] {
  return [...body.matchAll(/\]\((\/[^)\s#?]*)[^)]*\)/g)].map((m) => m[1]);
}

/**
 * « À lire aussi » : les articles qui suivent dans la liste, en boucle (après le dernier, on repart du premier).
 * Chaque article reçoit ainsi `count` liens des autres articles, même le plus ancien.
 */
export function relatedConseils(current: Conseil, all: Conseil[], count = 3): Conseil[] {
  const courant = all.find((c) => c.slug === current.slug) ?? current;
  return suivantsEnBoucle(all, courant, count).filter((c) => c.slug !== current.slug);
}

/**
 * Coupe le HTML d'un article en deux, juste avant la partie (h2) du milieu, pour y glisser une annonce.
 * Moins de 3 parties : pas de coupure (l'article est trop court pour une annonce au milieu).
 */
export function splitAtMiddleSection(html: string): [string, string] {
  const starts = [...html.matchAll(/<h2[\s>]/g)].map((m) => m.index);
  if (starts.length < 3) return [html, ""];
  const cut = starts[Math.floor(starts.length / 2)];
  return [html.slice(0, cut), html.slice(cut)];
}

/**
 * Encadré produit dans le texte d'un article : une ligne « {{produits: slug-a, slug-b}} » (1 ou 2 produits),
 * placée juste après le paragraphe qui les cite. marked la rend en paragraphe, que la page remplace par l'encadré.
 */
const ENCADRE_MD = /^\{\{produits: ([a-z0-9, -]+)\}\}$/gm;
const ENCADRE_HTML = /<p>\{\{produits: ([a-z0-9, -]+)\}\}<\/p>\n?/g;
const slugsDe = (liste: string) => liste.split(",").map((s) => s.trim()).filter(Boolean);

/** Encadrés du corps Markdown : leurs produits et le nombre de parties (h2) qui les précèdent (0 = introduction). */
export function encadresDuCorps(body: string): Array<{ produits: string[]; partie: number }> {
  return [...body.matchAll(ENCADRE_MD)].map((m) => ({
    produits: slugsDe(m[1]),
    partie: (body.slice(0, m.index).match(/^##\s/gm) ?? []).length,
  }));
}

/**
 * Parties de l'article où un encadré est interdit, car trop près de l'annonce du milieu
 * (celle qui précède la coupure et celle qui la suit). Rien d'interdit sans annonce au milieu.
 */
export function partiesProchesDeLaPub(body: string): number[] {
  const h2 = (body.match(/^##\s/gm) ?? []).length;
  if (h2 < 3) return [];
  const coupure = Math.floor(h2 / 2);
  return [coupure, coupure + 1];
}

/** Découpe le HTML d'un article autour de ses encadrés produits : morceaux de texte et listes de produits, dans l'ordre. */
export function decouperEncadres(html: string): Array<{ html: string } | { produits: string[] }> {
  const morceaux: Array<{ html: string } | { produits: string[] }> = [];
  let debut = 0;
  for (const m of html.matchAll(ENCADRE_HTML)) {
    morceaux.push({ html: html.slice(debut, m.index) });
    morceaux.push({ produits: slugsDe(m[1]) });
    debut = m.index + m[0].length;
  }
  morceaux.push({ html: html.slice(debut) });
  return morceaux.filter((m) => !("html" in m) || m.html.trim() !== "");
}
