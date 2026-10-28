// Vérification des produits Amazon (à lancer sur le Mac, pas sur GitHub : Amazon bloque souvent les serveurs).
// Même principe que Keur Déco : pour chaque produit qui a un ASIN, la fiche amazon.fr/dp/<ASIN> est ouverte
// dans Chrome. Bouton d'achat présent → date du jour ; absent → produit « indisponible » (il n'est plus affiché
// sur le site, son ASIN est gardé, à remplacer par un équivalent vérifié). Rien n'est inventé : seul l'état lu
// sur la fiche est enregistré, dans src/lib/catalogue/verifications.json.
//
// Usage : npm run verifier-produits              (rapport seul)
//         npm run verifier-produits -- --ecrire  (met à jour verifications.json)
//         npm run verifier-produits -- --ecrire --lot 20
//           (seulement les 20 produits vérifiés il y a le plus longtemps, jamais vérifiés d'abord, avec des
//            pauses plus longues : Amazon tolère mieux de petits lots réguliers qu'une rafale de 60 fiches)
// Chrome : CHROMIUM_PATH=/chemin/vers/chrome (par défaut, Google Chrome sur macOS).
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { TOUS_LES_PRODUITS, type Verification } from "../src/lib/catalogue";

const FICHIER = resolve(import.meta.dirname, "..", "src", "lib", "catalogue", "verifications.json");
const ecrire = process.argv.includes("--ecrire");
const aujourdhui = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(new Date());
const chrome = process.env.CHROMIUM_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const verifications: Record<string, Verification> = JSON.parse(readFileSync(FICHIER, "utf8"));
const iLot = process.argv.indexOf("--lot");
const lot = iLot > -1 ? Number(process.argv[iLot + 1]) || 20 : 0;
const dateDe = (slug: string, asin: string) => (verifications[slug]?.asin === asin ? verifications[slug].verifieLe : "");
const tous = TOUS_LES_PRODUITS.flatMap((p) => (p.amazonAsin ? [{ slug: p.slug, asin: p.amazonAsin }] : []));
const aVerifier = lot ? [...tous].sort((a, b) => dateDe(a.slug, a.asin).localeCompare(dateDe(b.slug, b.asin))).slice(0, lot) : tous;

const navigateur = await chromium.launch({ executablePath: chrome, headless: true });
const page = await (await navigateur.newContext({ locale: "fr-FR" })).newPage();
const disponibles: typeof tous = [];
const indisponibles: typeof tous = [];
let bloque = false;

for (const p of aVerifier) {
  let etat: { captcha: boolean; achat: boolean; titre: string; statut?: number };
  try {
    const reponse = await page.goto(`https://www.amazon.fr/dp/${p.asin}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    etat = await page.evaluate(() => ({
      captcha: !!document.querySelector('form[action*="validateCaptcha"]'),
      achat: !!document.querySelector("#add-to-cart-button, #buy-now-button"),
      titre: (document.querySelector("#productTitle")?.textContent || "").trim(),
    }));
    etat.statut = reponse?.status() ?? 0;
  } catch (e) {
    console.log(`? ${p.slug} (${p.asin}) : erreur de chargement, non modifié (${String((e as Error).message).split("\n")[0]})`);
    continue;
  }
  if (etat.captcha) {
    bloque = true;
    console.log(`Amazon demande une vérification (captcha) : arrêt, aucun produit modifié après ${p.slug}.`);
    break;
  }
  if (etat.achat) {
    disponibles.push(p);
    console.log(`✓ ${p.slug} (${p.asin})${etat.titre ? ` · ${etat.titre.slice(0, 60)}` : ""}`);
  } else {
    indisponibles.push(p);
    console.log(`✗ ${p.slug} (${p.asin}) : plus achetable (HTTP ${etat.statut})${etat.titre ? ` · ${etat.titre.slice(0, 60)}` : ""}`);
  }
  // Rythme humain, pour ne pas surcharger Amazon.
  await page.waitForTimeout(lot ? 4000 + Math.random() * 4000 : 1200 + Math.random() * 1500);
}
await navigateur.close();

console.log(`\n${disponibles.length} produit(s) disponible(s), ${indisponibles.length} indisponible(s), ${aVerifier.length - disponibles.length - indisponibles.length} non vérifié(s).`);
if (lot) console.log(`Lot du jour : ${aVerifier.length} sur ${tous.length} produits à ASIN.`);
if (ecrire) {
  for (const p of disponibles) verifications[p.slug] = { asin: p.asin, verifieLe: aujourdhui, statut: "disponible" };
  for (const p of indisponibles) verifications[p.slug] = { asin: p.asin, verifieLe: aujourdhui, statut: "indisponible" };
  const trie = Object.fromEntries(Object.entries(verifications).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(FICHIER, JSON.stringify(trie, null, 2) + "\n");
  console.log(`src/lib/catalogue/verifications.json mis à jour (${aujourdhui}).`);
}
if (indisponibles.length) console.log("À remplacer (masqués du site) : " + indisponibles.map((p) => p.slug).join(", "));
process.exit(bloque ? 2 : 0);
