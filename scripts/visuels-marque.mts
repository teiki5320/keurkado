// Tire du logo original (docs/brand/keurkado-logo-transparent.png) toutes les versions utilisées par le site.
// Usage : npm run visuels-marque (à relancer seulement si le logo change ; les fichiers produits sont versionnés).
//
// - public/brand/keurkado-logo.webp : logo complet (pied de page) ;
// - public/brand/keurkado-logo.png : logo complet 512 px (données structurées, réseaux) ;
// - public/brand/keurkado-embleme.webp : le paquet cadeau seul (en-tête) ;
// - assets/marque/embleme.png : le paquet cadeau seul, en grand (épingles Pinterest, image de partage) ;
// - src/app/icon.png et src/app/apple-icon.png : icônes (onglet, écran d'accueil), paquet sur fond crème.
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const RACINE = resolve(import.meta.dirname, "..");
const SOURCE = resolve(RACINE, "docs/brand/keurkado-logo-transparent.png");
const CREME = "#fff7ec";

/**
 * Le paquet cadeau seul : le haut du logo, jusqu'à la pointe de la boîte.
 * La pointe touche presque le « K » de « Kado » : on efface ce qui dépasse à droite de la pointe,
 * et le haut des lettres qui entrent dans la découpe sur les côtés.
 */
async function embleme(): Promise<Buffer> {
  const H = 938;
  const { data, info } = await sharp(SOURCE).extract({ left: 0, top: 0, width: 1312, height: H }).raw().toBuffer({ resolveWithObject: true });
  for (let y = 860; y < H; y++) for (let x = 0; x < info.width; x++) if (x < 330 || x > 1000) data[(y * info.width + x) * 4 + 3] = 0;
  for (let y = 928; y < H; y++) for (let x = 718; x < info.width; x++) data[(y * info.width + x) * 4 + 3] = 0;
  return sharp(data, { raw: info }).trim({ threshold: 10 }).png().toBuffer();
}

/** Icône carrée : le paquet centré sur un carré crème aux coins arrondis. */
async function icone(paquet: Buffer, taille: number, arrondi: boolean): Promise<Buffer> {
  const marge = Math.round(taille * 0.1);
  const p = await sharp(paquet).resize({ width: taille - 2 * marge, height: taille - 2 * marge, fit: "inside" }).toBuffer();
  const m = await sharp(p).metadata();
  const fond = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${taille}" height="${taille}"><rect width="${taille}" height="${taille}" rx="${arrondi ? taille * 0.22 : 0}" fill="${CREME}"/></svg>`);
  return sharp(fond)
    .composite([{ input: p, left: Math.round((taille - (m.width ?? 0)) / 2), top: Math.round((taille - (m.height ?? 0)) / 2) }])
    .png()
    .toBuffer();
}

const paquet = await embleme();
mkdirSync(resolve(RACINE, "public/brand"), { recursive: true });
mkdirSync(resolve(RACINE, "assets/marque"), { recursive: true });
await sharp(SOURCE).trim({ threshold: 10 }).resize({ width: 640 }).webp({ quality: 88 }).toFile(resolve(RACINE, "public/brand/keurkado-logo.webp"));
await sharp(SOURCE).trim({ threshold: 10 }).resize({ width: 512, height: 512, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ palette: true, quality: 90 }).toFile(resolve(RACINE, "public/brand/keurkado-logo.png"));
await sharp(paquet).resize({ width: 160 }).webp({ quality: 90 }).toFile(resolve(RACINE, "public/brand/keurkado-embleme.webp"));
await sharp(paquet).resize({ width: 600 }).png().toFile(resolve(RACINE, "assets/marque/embleme.png"));
await sharp(await icone(paquet, 512, true)).png({ palette: true, quality: 90 }).toFile(resolve(RACINE, "src/app/icon.png"));
// Apple arrondit lui-même les coins : carré plein.
await sharp(await icone(paquet, 180, false)).png({ palette: true, quality: 90 }).toFile(resolve(RACINE, "src/app/apple-icon.png"));
console.log("Visuels de marque générés (public/brand, assets/marque, src/app/icon.png, src/app/apple-icon.png).");
