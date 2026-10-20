// Génère les épingles Pinterest des pages « Top 10 », avant le build Next.js (npm run build).
// Usage : npm run epingles (module ESM : extension .mts)
//
// Pour chaque Top 10, une image JPG 1000 × 1500 px (format conseillé par Pinterest) :
// décor « Perles de bois » + perle « TOP 10 » + titre + accroche + signature (paquet cadeau du logo + Keur Kado).
// Quatre gabarits alternent (arche, bulle, ébène, cordon), comme sur Keur Déco. Uniquement nos propres visuels :
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
export const GABARITS = ["arche", "bulle", "ebene", "cordon"] as const;
export type Gabarit = (typeof GABARITS)[number];

// Palette « Perles de bois » (src/app/globals.css).
const C = { sable: "#E6D8BF", creme: "#FDF7EA", creme2: "#F4E9D2", encre: "#2B1D14", terre: "#B84A2A", terreTexte: "#9C3A1C", bois: "#8A6436", boisFonce: "#5A3516", ombre: "#9C7A4A", or: "#E8B86A" };

/** Dégradés des trois essences de perles (bois clair, ébène, acacia) et halos de lumière. */
const DEFS = `
  <radialGradient id="bois" cx="35%" cy="28%" r="75%"><stop offset="0" stop-color="#d9a76a"/><stop offset=".45" stop-color="#9a6230"/><stop offset=".8" stop-color="#5a3516"/><stop offset="1" stop-color="#3a2010"/></radialGradient>
  <radialGradient id="ebene" cx="35%" cy="28%" r="75%"><stop offset="0" stop-color="#5a4a40"/><stop offset=".45" stop-color="#2a1d16"/><stop offset="1" stop-color="#120c08"/></radialGradient>
  <radialGradient id="acacia" cx="35%" cy="28%" r="75%"><stop offset="0" stop-color="#efcf8a"/><stop offset=".5" stop-color="#b07a3c"/><stop offset="1" stop-color="#6a401c"/></radialGradient>
  <linearGradient id="cordon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8b67e"/><stop offset=".45" stop-color="#8a6436"/><stop offset=".55" stop-color="#5a3a18"/><stop offset="1" stop-color="#b8945e"/></linearGradient>
  <radialGradient id="halo1"><stop offset="0" stop-color="rgb(255,236,196)" stop-opacity=".9"/><stop offset=".65" stop-color="rgb(255,236,196)" stop-opacity="0"/></radialGradient>
  <radialGradient id="halo2"><stop offset="0" stop-color="rgb(184,74,42)" stop-opacity=".25"/><stop offset=".65" stop-color="rgb(184,74,42)" stop-opacity="0"/></radialGradient>`;

/** Fond d'atelier : sable, halos de lumière, trois fils tracés à la main. */
const FOND_ATELIER = `<rect width="1000" height="1500" fill="${C.sable}"/>
  <circle cx="150" cy="120" r="620" fill="url(#halo1)"/><circle cx="900" cy="1380" r="700" fill="url(#halo2)"/>
  <g fill="none" opacity=".4"><path d="M-40 260 C 200 160, 320 420, 560 330 S 900 160, 1040 280" stroke="${C.bois}" stroke-width="3"/>
  <path d="M-40 980 C 180 880, 420 1120, 640 1000 S 900 860, 1040 1000" stroke="${C.terre}" stroke-width="2.4"/>
  <path d="M-40 1400 C 260 1330, 400 1480, 700 1390 S 900 1300, 1040 1370" stroke="${C.encre}" stroke-width="2"/></g>`;

/** Perle de bois (anneau d'essence, cœur crème) centrée en (cx, cy). */
const perle = (cx: number, cy: number, r: number, essence = "bois") =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${essence})"/><circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="${C.creme}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="2"/>`;

/** Cordon horizontal avec ses perles. */
const cordon = (y: number) => `<rect x="0" y="${y - 6}" width="1000" height="12" rx="6" fill="url(#cordon)"/>`;

/** Bulle crème au double liseré et à l'ombre décalée (le cadre du design). */
const bulle = (x: number, y: number, l: number, h: number, rx: number, fond = C.creme) =>
  `<rect x="${x + 12}" y="${y + 14}" width="${l}" height="${h}" rx="${rx}" fill="${C.ombre}"/><rect x="${x}" y="${y}" width="${l}" height="${h}" rx="${rx}" fill="${fond}" stroke="${C.encre}" stroke-width="3.5"/><rect x="${x + 11}" y="${y + 11}" width="${l - 22}" height="${h - 22}" rx="${Math.max(rx - 11, 4)}" fill="none" stroke="rgba(138,100,54,.55)" stroke-width="2"/>`;

/** Le paquet cadeau du logo (assets/marque/embleme.png, produit par npm run visuels-marque). */
const EMBLEME = resolve(RACINE, "assets/marque/embleme.png");
const LOGO = resolve(RACINE, "docs/brand/keurkado-logo-transparent.png");

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

/** Pastille « TOP 10 » : grosse perle de bois au cœur crème, suspendue à son attache. */
function pastille(essence: string, texte: string): Buffer {
  return svg(
    220,
    250,
    `<defs>${DEFS}</defs><path d="M98 6 q12 -10 24 0 l0 24" fill="none" stroke="${C.bois}" stroke-width="6"/>${perle(110, 140, 104, essence)}` +
      `<text x="110" y="${108}" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="28" letter-spacing="6" fill="${texte}">TOP</text>`,
  );
}

/** Le « 10 » de la pastille. */
const dix = (couleur: string) => textePng("10", { police: "titre", couleur, largeur: 200, hauteurMax: 120, tailleMax: 104, tailleMin: 70 });

/** Signature en bas d'épingle : emblème + « Keur Kado · keurkado.com ». */
async function signature(couleur: string): Promise<Buffer> {
  const logo = await sharp(EMBLEME).resize({ width: 64, height: 64, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
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
  // Décor, zone de texte, couleurs et position de la perle « TOP 10 » selon le gabarit.
  const g = {
    // Arche crème sous une perle de bois.
    arche: { decor: `${FOND_ATELIER}<path d="M90 1420 L90 640 Q90 330 500 330 Q910 330 910 640 L910 1420 Z" fill="${C.ombre}" transform="translate(12 14)"/><path d="M90 1420 L90 640 Q90 330 500 330 Q910 330 910 640 L910 1420 Z" fill="${C.creme}" stroke="${C.encre}" stroke-width="3.5"/>`, zone: { x: 150, y: 560, l: 700, h: 600 }, titre: C.encre, accroche: C.terreTexte, sig: C.encre, ySig: 1300, pastille: { x: 390, y: 205, essence: "bois", texte: C.encre } },
    // Bulle de Tonton Kado, perles enfilées au-dessus.
    bulle: { decor: `${FOND_ATELIER}${cordon(250)}${perle(170, 250, 62, "ebene")}${perle(830, 250, 62, "acacia")}${bulle(80, 420, 840, 820, 110)}<path d="M150 1230 l-40 90 l120 -90 z" fill="${C.creme}" stroke="${C.encre}" stroke-width="3.5"/>`, zone: { x: 140, y: 560, l: 720, h: 560 }, titre: C.encre, accroche: C.terreTexte, sig: C.encre, ySig: 1380, pastille: { x: 390, y: 130, essence: "bois", texte: C.encre } },
    // Aplat d'ébène, cordon doré.
    ebene: { decor: `<rect width="1000" height="1500" fill="${C.encre}"/><rect x="40" y="40" width="920" height="1420" rx="60" fill="none" stroke="rgba(232,184,106,.5)" stroke-width="3"/>${cordon(330)}${perle(190, 330, 58, "acacia")}${perle(810, 330, 58, "bois")}`, zone: { x: 110, y: 560, l: 780, h: 620 }, titre: C.creme, accroche: C.or, sig: C.creme, ySig: 1330, pastille: { x: 390, y: 205, essence: "acacia", texte: C.encre } },
    // Sable, grand cordon de perles en bas.
    cordon: { decor: `${FOND_ATELIER}${bulle(70, 380, 860, 760, 60)}${cordon(1290)}${perle(150, 1290, 56, "ebene")}${perle(380, 1290, 56, "bois")}${perle(620, 1290, 56, "acacia")}${perle(850, 1290, 56, "ebene")}`, zone: { x: 130, y: 470, l: 740, h: 560 }, titre: C.encre, accroche: C.terreTexte, sig: C.encre, ySig: 1060, pastille: { x: 390, y: 150, essence: "ebene", texte: C.encre } },
  }[gabarit];

  const fond = await sharp(svg(LARGEUR, HAUTEUR, `<defs>${DEFS}</defs>${g.decor}`)).png().toBuffer();
  const titrePng = await textePng(titre.charAt(0).toUpperCase() + titre.slice(1), { police: "titre", couleur: g.titre, largeur: g.zone.l, hauteurMax: g.zone.h - 140, tailleMax: 100, tailleMin: 56 });
  const accrochePng = await textePng(top.accroche, { police: "texte", couleur: g.accroche, largeur: g.zone.l, hauteurMax: 110, tailleMax: 42, tailleMin: 28 });
  const t = await taille(titrePng);
  const a = await taille(accrochePng);
  // Séparateur « trait · perle · trait » entre le titre et l'accroche.
  const sep = svg(160, 20, `<rect x="0" y="9" width="60" height="2" fill="${gabarit === "ebene" ? C.or : C.bois}"/><circle cx="80" cy="10" r="6" fill="${gabarit === "ebene" ? C.or : C.bois}"/><rect x="100" y="9" width="60" height="2" fill="${gabarit === "ebene" ? C.or : C.bois}"/>`);
  const yTitre = g.zone.y + Math.round((g.zone.h - t.h - 60 - a.h) / 2);
  const sig = await signature(g.sig);
  const s = await taille(sig);
  const dixPng = await dix(g.pastille.texte);
  const d = await taille(dixPng);

  const calques: OverlayOptions[] = [
    { input: pastille(g.pastille.essence, g.pastille.texte), left: g.pastille.x, top: g.pastille.y },
    { input: dixPng, left: g.pastille.x + Math.round((220 - d.l) / 2), top: g.pastille.y + 116 },
    { input: titrePng, left: Math.round((LARGEUR - t.l) / 2), top: yTitre },
    { input: sep, left: 420, top: yTitre + t.h + 20 },
    { input: accrochePng, left: Math.round((LARGEUR - a.l) / 2), top: yTitre + t.h + 60 },
    { input: sig, left: Math.round((LARGEUR - s.l) / 2), top: g.ySig },
  ];
  return sharp(fond).composite(calques).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
}

/** Image de partage par défaut (Open Graph, 1200 × 630) : cordon de perles et logo complet dans une bulle crème. */
async function imagePartage(): Promise<Buffer> {
  const fond = await sharp(
    svg(1200, 630, `<defs>${DEFS}</defs><rect width="1200" height="630" fill="${C.sable}"/><circle cx="150" cy="80" r="520" fill="url(#halo1)"/><circle cx="1100" cy="600" r="560" fill="url(#halo2)"/>${cordon(315).replace('width="1000"', 'width="1200"')}${perle(130, 315, 60, "ebene")}${perle(1070, 315, 60, "acacia")}${bulle(300, 45, 600, 540, 60)}`),
  )
    .png()
    .toBuffer();
  const logo = await sharp(LOGO).trim({ threshold: 10 }).resize({ width: 500, height: 470, fit: "inside" }).png().toBuffer();
  const l = await taille(logo);
  return sharp(fond)
    .composite([{ input: logo, left: Math.round((1200 - l.l) / 2), top: Math.round((630 - l.h) / 2) }])
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
  page: "Cadeaux à envoyer au pays",
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
      alt: `${top.titre} : ${top.accroche}. Épingle Keur Kado, perles de bois sur fond sable.`,
      lien: `${SITE_URL}/top/${top.slug}/`,
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
