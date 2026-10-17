// Génère les épingles Pinterest des pages « Top 10 », avant le build Next.js (npm run build).
// Usage : npm run epingles (module ESM : extension .mts)
//
// Pour chaque Top 10, une image JPG 1000 × 1500 px (format conseillé par Pinterest) :
// motif wax + « TOP 10 » + titre + accroche + signature Keur Kado. Quatre gabarits alternent
// (bandeau haut, cadre, split, bandeau bas), comme sur Keur Déco. Uniquement nos propres visuels :
// jamais de photo de produit Amazon.
//
// Sorties (non versionnées, refaites à chaque build) :
// - public/epingles/<slug>.jpg : les épingles, affichées aussi sur le site (page du Top, vignettes) ;
// - public/epingles.json : manifeste (titre, description, lien, tableau) pour une future publication automatique ;
// - public/epingles-pinterest.csv : import en lot dans Pinterest (« Créer des épingles en masse ») ;
// - public/brand/keurkado-partage.jpg : image de partage par défaut (1200 × 630).
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp, { type OverlayOptions } from "sharp";
import { TOPS } from "../src/lib/tops";
import { rubriqueDuTop } from "../src/lib/tops/rubrique";
import type { Top } from "../src/lib/types";

const RACINE = resolve(import.meta.dirname, "..");
const SORTIE = resolve(RACINE, "public/epingles");
const POLICE_TITRE = resolve(RACINE, "assets/polices/Fraunces_600SemiBold.ttf");
const POLICE_TEXTE = resolve(RACINE, "assets/polices/SourceSans3_600SemiBold.ttf");
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://keurkado.com").replace(/\/$/, "");

export const LARGEUR = 1000;
export const HAUTEUR = 1500;
export const GABARITS = ["bandeau-haut", "cadre", "split", "bandeau-bas"] as const;
export type Gabarit = (typeof GABARITS)[number];

// Palette « Wax » (src/app/globals.css).
const C = { creme: "#FFF7EC", encre: "#2A1810", orange: "#C2410C", soleil: "#F2A900", vert: "#1E7A4E", indigo: "#1F3A8A", fuchsia: "#B5245E" };

/** Tuile du motif wax (la même que .wax-bg sur le site), en motif SVG répété. */
function motifWax(id: string, taille = 120): string {
  const k = taille / 80;
  return `<pattern id="${id}" width="${taille}" height="${taille}" patternUnits="userSpaceOnUse">
    <g transform="scale(${k})">
      <rect width="80" height="80" fill="${C.orange}"/>
      <circle cx="20" cy="20" r="17" fill="${C.soleil}"/><circle cx="20" cy="20" r="11" fill="${C.vert}"/><circle cx="20" cy="20" r="5" fill="${C.creme}"/>
      <circle cx="60" cy="60" r="17" fill="${C.indigo}"/><circle cx="60" cy="60" r="11" fill="${C.soleil}"/><circle cx="60" cy="60" r="5" fill="${C.fuchsia}"/>
      <path d="M60 3l9 17-9 17-9-17z" fill="${C.creme}"/><path d="M20 43l9 17-9 17-9-17z" fill="${C.fuchsia}"/>
      <circle cx="60" cy="20" r="3" fill="${C.orange}"/><circle cx="20" cy="60" r="3" fill="${C.creme}"/>
    </g>
  </pattern>`;
}

/** Emblème « paquet cadeau » (le même que le logo provisoire du site). */
const EMBLEME = `<rect x="4" y="14" width="32" height="22" rx="4" fill="${C.orange}"/><rect x="2" y="9" width="36" height="8" rx="3" fill="${C.soleil}"/><rect x="17" y="9" width="6" height="27" fill="${C.indigo}"/><circle cx="11" cy="26" r="4" fill="${C.soleil}"/><circle cx="11" cy="26" r="1.8" fill="${C.vert}"/><circle cx="29" cy="26" r="4" fill="${C.fuchsia}"/><circle cx="29" cy="26" r="1.8" fill="${C.creme}"/><path d="M20 9c-3-6-11-6-9-1 1 2 5 1 9 1zm0 0c3-6 11-6 9-1-1 2-5 1-9 1z" fill="${C.vert}"/>`;

const svg = (largeur: number, hauteur: number, corps: string) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${largeur}" height="${hauteur}" viewBox="0 0 ${largeur} ${hauteur}">${corps}</svg>`);

const echapper = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Espaces insécables avant « : ; ! ? € » (typographie française), pour éviter un signe seul en début de ligne. */
const typographier = (s: string) => s.replace(/ ([:;!?€»])/g, " $1").replace(/« /g, "« ");

/** Texte en PNG transparent, à la plus grande taille qui tient dans la boîte. */
async function textePng(texte: string, o: { police: "titre" | "texte"; couleur: string; largeur: number; hauteurMax: number; tailleMax: number; tailleMin: number; align?: "centre" | "left" }): Promise<Buffer> {
  for (let taille = o.tailleMax; taille >= o.tailleMin; taille -= 4) {
    const png = await sharp({
      text: {
        text: `<span foreground="${o.couleur}" line_height="1.02">${echapper(typographier(texte))}</span>`,
        font: `${o.police === "titre" ? "Fraunces SemiBold" : "Source Sans 3 SemiBold"} ${taille}`,
        fontfile: o.police === "titre" ? POLICE_TITRE : POLICE_TEXTE,
        width: o.largeur,
        align: o.align ?? "centre",
        rgba: true,
        wrap: "word",
        dpi: 72,
      },
    })
      .png()
      .toBuffer();
    if (((await sharp(png).metadata()).height ?? 0) <= o.hauteurMax) return png;
  }
  throw new Error(`Texte d'épingle trop long : « ${texte} »`);
}

const taille = async (png: Buffer) => {
  const m = await sharp(png).metadata();
  return { l: m.width ?? 0, h: m.height ?? 0 };
};

/** Pastille « TOP 10 » ronde. */
function pastille(fond: string, texte: string): Buffer {
  return svg(
    220,
    220,
    `<circle cx="110" cy="110" r="104" fill="${fond}" stroke="${C.creme}" stroke-width="8"/>` +
      `<text x="110" y="78" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="34" letter-spacing="6" fill="${texte}">TOP</text>`,
  );
}

/** Le « 10 » de la pastille, en Fraunces (la police du site). */
const dix = (couleur: string) => textePng("10", { police: "titre", couleur, largeur: 200, hauteurMax: 140, tailleMax: 120, tailleMin: 80 });

/** Signature en bas d'épingle : emblème + « Keur Kado · keurkado.com ». */
async function signature(couleur: string): Promise<Buffer> {
  const logo = await sharp(svg(64, 64, `<g transform="scale(1.6)">${EMBLEME}</g>`)).png().toBuffer();
  const texte = await sharp({
    text: { text: `<span foreground="${couleur}">Keur Kado · ${echapper(SITE_URL.replace(/^https?:\/\//, ""))}</span>`, font: "Source Sans 3 SemiBold 34", fontfile: POLICE_TEXTE, rgba: true, dpi: 72 },
  })
    .png()
    .toBuffer();
  const t = await taille(texte);
  return sharp({ create: { width: 64 + 16 + t.l, height: 64, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: logo, left: 0, top: 0 },
      { input: texte, left: 80, top: Math.round((64 - t.h) / 2) },
    ])
    .png()
    .toBuffer();
}

/** Gabarit du n-ième Top (alternance dans l'ordre de la liste). */
export const gabaritPour = (index: number): Gabarit => GABARITS[index % GABARITS.length];

/** Compose une épingle 1000 × 1500 selon le gabarit. */
export async function composerEpingle(top: Pick<Top, "titre" | "accroche">, gabarit: Gabarit): Promise<Buffer> {
  const titre = top.titre.replace(/^10 /, "");
  // Zone de texte (carte claire ou aplat de couleur) et couleurs selon le gabarit.
  const g = {
    "bandeau-haut": { fond: `<rect width="1000" height="1500" fill="url(#wax)"/><rect x="60" y="560" width="880" height="860" rx="44" fill="${C.creme}"/>`, zone: { x: 110, y: 700, l: 780, h: 520 }, titre: C.encre, accroche: C.orange, sig: C.encre, pastille: { x: 390, y: 450, fond: C.indigo, texte: C.creme } },
    cadre: { fond: `<rect width="1000" height="1500" fill="url(#wax)"/><rect x="56" y="56" width="888" height="1388" rx="36" fill="${C.creme}"/>`, zone: { x: 120, y: 470, l: 760, h: 620 }, titre: C.encre, accroche: C.vert, sig: C.encre, pastille: { x: 390, y: 170, fond: C.orange, texte: C.creme } },
    split: { fond: `<rect width="1000" height="1500" fill="${C.indigo}"/><rect width="1000" height="560" fill="url(#wax)"/>`, zone: { x: 100, y: 700, l: 800, h: 520 }, titre: C.creme, accroche: C.soleil, sig: C.creme, pastille: { x: 390, y: 450, fond: C.soleil, texte: C.encre } },
    "bandeau-bas": { fond: `<rect width="1000" height="1500" fill="${C.orange}"/><rect y="1180" width="1000" height="320" fill="url(#wax)"/><rect x="0" y="1160" width="1000" height="20" fill="${C.soleil}"/>`, zone: { x: 100, y: 400, l: 800, h: 600 }, titre: C.creme, accroche: C.soleil, sig: C.creme, pastille: { x: 390, y: 120, fond: C.creme, texte: C.orange } },
  }[gabarit];

  const fond = await sharp(svg(LARGEUR, HAUTEUR, `<defs>${motifWax("wax")}</defs>${g.fond}`)).png().toBuffer();
  const titrePng = await textePng(titre.charAt(0).toUpperCase() + titre.slice(1), { police: "titre", couleur: g.titre, largeur: g.zone.l, hauteurMax: g.zone.h - 130, tailleMax: 104, tailleMin: 56 });
  const accrochePng = await textePng(top.accroche, { police: "texte", couleur: g.accroche, largeur: g.zone.l, hauteurMax: 110, tailleMax: 44, tailleMin: 28 });
  const t = await taille(titrePng);
  const a = await taille(accrochePng);
  const yTitre = g.zone.y + Math.round((g.zone.h - t.h - 30 - a.h) / 2);
  const sig = await signature(gabarit === "bandeau-bas" ? C.creme : g.sig);
  const s = await taille(sig);
  const ySig = gabarit === "bandeau-haut" ? 1320 : gabarit === "cadre" ? 1330 : gabarit === "split" ? 1370 : 1060;
  const dixPng = await dix(g.pastille.texte);
  const d = await taille(dixPng);

  const calques: OverlayOptions[] = [
    { input: pastille(g.pastille.fond, g.pastille.texte), left: g.pastille.x, top: g.pastille.y },
    { input: dixPng, left: g.pastille.x + Math.round((220 - d.l) / 2), top: g.pastille.y + 98 },
    { input: titrePng, left: Math.round((LARGEUR - t.l) / 2), top: yTitre },
    { input: accrochePng, left: Math.round((LARGEUR - a.l) / 2), top: yTitre + t.h + 30 },
    { input: sig, left: Math.round((LARGEUR - s.l) / 2), top: ySig },
  ];
  return sharp(fond).composite(calques).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
}

/** Image de partage par défaut (Open Graph, 1200 × 630) : motif wax, carte crème, nom et devise. */
async function imagePartage(): Promise<Buffer> {
  const fond = await sharp(svg(1200, 630, `<defs>${motifWax("wax", 100)}</defs><rect width="1200" height="630" fill="url(#wax)"/><rect x="150" y="135" width="900" height="360" rx="40" fill="${C.creme}"/><g transform="translate(540 165) scale(3)">${EMBLEME}</g>`))
    .png()
    .toBuffer();
  const nom = await textePng("Keur Kado", { police: "titre", couleur: C.encre, largeur: 820, hauteurMax: 120, tailleMax: 104, tailleMin: 60 });
  const devise = await textePng("Les idées cadeaux africains", { police: "texte", couleur: C.orange, largeur: 820, hauteurMax: 60, tailleMax: 44, tailleMin: 30 });
  const n = await taille(nom);
  const dv = await taille(devise);
  return sharp(fond)
    .composite([
      { input: nom, left: Math.round((1200 - n.l) / 2), top: 300 },
      { input: devise, left: Math.round((1200 - dv.l) / 2), top: 300 + n.h + 8 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
}

export interface EntreeManifeste {
  id: string;
  gabarit: Gabarit;
  image: string;
  titre: string;
  description: string;
  alt: string;
  lien: string;
  tableau: string;
  publie_le: string;
}

/** Description de l'épingle : description du Top + mots-clés (500 caractères max). */
export function descriptionEpingle(top: Top): string {
  const r = rubriqueDuTop(top.rubrique);
  const texte = `${top.description} ${r ? `Idées cadeaux ${r.nom.toLowerCase()}, ` : ""}cadeaux africains, wax, idées cadeaux diaspora sur Keur Kado.`;
  return texte.length > 500 ? `${texte.slice(0, 499)}…` : texte;
}

/** Tableau Pinterest de chaque famille de rubrique (à créer sous ces noms, voir docs/PINTEREST.md). */
export const TABLEAUX: Record<string, string> = {
  occasion: "Idées cadeaux africains par occasion",
  pour: "Cadeaux africains pour elle, pour lui, pour les enfants",
  budget: "Cadeaux africains petits prix",
  univers: "Wax, bijoux et beauté afro",
};

/** Fichier d'import en lot pour Pinterest : colonnes du modèle Pinterest, une épingle programmée par jour. */
export function csvPinterest(entrees: EntreeManifeste[]): string {
  const cellule = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lignes = [["Title", "Media URL", "Pinterest board", "Thumbnail", "Description", "Link", "Publish date", "Keywords"].join(",")];
  entrees.forEach((e, i) => {
    const date = new Date(Date.now() + (i + 1) * 86_400_000);
    date.setUTCHours(17, 0, 0, 0); // 18 h ou 19 h à Paris : un bon créneau sur Pinterest
    lignes.push([e.titre, e.image, e.tableau, "", e.description, e.lien, date.toISOString().slice(0, 19), "cadeaux africains, idées cadeaux, wax"].map(cellule).join(","));
  });
  return lignes.join("\n") + "\n";
}

async function main() {
  rmSync(SORTIE, { recursive: true, force: true });
  mkdirSync(SORTIE, { recursive: true });
  mkdirSync(resolve(RACINE, "public/brand"), { recursive: true });
  const manifeste: EntreeManifeste[] = [];
  for (const [i, top] of TOPS.entries()) {
    const gabarit = gabaritPour(i);
    writeFileSync(resolve(SORTIE, `${top.slug}.jpg`), await composerEpingle(top, gabarit));
    manifeste.push({
      id: top.slug,
      gabarit,
      image: `${SITE_URL}/epingles/${top.slug}.jpg`,
      titre: top.titre,
      description: descriptionEpingle(top),
      alt: `${top.titre} : ${top.accroche}. Épingle Keur Kado aux couleurs du wax.`,
      lien: `${SITE_URL}/top/${top.slug}`,
      tableau: TABLEAUX[top.rubrique.split("/")[0]] ?? TABLEAUX.occasion,
      publie_le: top.date,
    });
  }
  writeFileSync(resolve(RACINE, "public/epingles.json"), JSON.stringify(manifeste, null, 2) + "\n");
  writeFileSync(resolve(RACINE, "public/epingles-pinterest.csv"), csvPinterest(manifeste));
  writeFileSync(resolve(RACINE, "public/brand/keurkado-partage.jpg"), await imagePartage());
  console.log(`${manifeste.length} épingles Pinterest générées dans public/epingles/ (+ manifeste, CSV et image de partage).`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
