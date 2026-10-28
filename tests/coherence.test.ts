/**
 * Cohérence des contenus : catalogue, Top 10, conseils, taxonomie et calendrier.
 * Lancer : npm test
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { FETES } from "../src/lib/calendrier";
import { PRODUITS } from "../src/lib/catalogue";
import { internalLinks, parseConseil } from "../src/lib/conseils/article";
import { porte } from "../src/lib/data/produits";
import { GUIDE_QUIZ, GUIDE_TOPS, guideDe, motsDuGuide } from "../src/lib/guides";
import { BUDGETS, DESTINATAIRES, FAMILLES, OCCASIONS, UNIVERS, UNIVERS_FRERES, type Famille } from "../src/lib/taxonomie";
import { TOPS } from "../src/lib/tops";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const produits = new Map(PRODUITS.map((p) => [p.slug, p]));
const DIR_CONSEILS = join(process.cwd(), "content", "conseils");
const conseils = readdirSync(DIR_CONSEILS)
  .filter((f) => f.endsWith(".md"))
  .map((f) => parseConseil(f.replace(/\.md$/, ""), readFileSync(join(DIR_CONSEILS, f), "utf8")));

/** Toutes les adresses internes du site (pour vérifier les liens des articles et du calendrier). */
const ADRESSES = new Set([
  "/",
  "/quiz",
  "/top",
  "/envoyer-au-pays",
  "/calendrier",
  "/conseils",
  "/mentions-legales",
  "/confidentialite",
  "/conditions",
  ...Object.values(FAMILLES).flatMap((f) => f.liste.map((r) => `${f.chemin}/${r.slug}`)),
  ...TOPS.map((t) => `/top/${t.slug}`),
  ...conseils.map((c) => `/conseils/${c.slug}`),
]);

test("catalogue : slugs uniques et champs remplis", () => {
  assert.equal(produits.size, PRODUITS.length, "slug de produit en double");
  for (const p of PRODUITS) {
    assert.match(p.slug, SLUG, p.slug);
    assert.ok(p.nom.length > 0 && p.nom.length <= 60, `nom trop long : ${p.slug}`);
    assert.ok(p.description.length >= 60, `description trop courte : ${p.slug}`);
    assert.ok(p.recherche.trim().length > 0, `recherche Amazon vide : ${p.slug}`);
    assert.ok(p.occasions.length > 0 && p.pour.length > 0, `étiquettes manquantes : ${p.slug}`);
    // Jamais d'ASIN inventé : s'il est rempli, il a le format Amazon (10 caractères).
    if (p.amazonAsin) assert.match(p.amazonAsin, /^[A-Z0-9]{10}$/, `ASIN invalide : ${p.slug}`);
    if (p.priceCents !== undefined) assert.ok(Number.isInteger(p.priceCents) && p.priceCents > 0, `prix invalide : ${p.slug}`);
  }
});

test("rubriques : descriptions de bonne longueur et assez d'idées par page", () => {
  for (const r of [...OCCASIONS, ...DESTINATAIRES, ...BUDGETS, ...UNIVERS]) {
    assert.ok(r.description.length >= 70 && r.description.length <= 160, `description de ${r.slug} : ${r.description.length} caractères`);
  }
  for (const [famille, f] of Object.entries(FAMILLES) as Array<[Famille, (typeof FAMILLES)[Famille]]>) {
    for (const r of f.liste) {
      if (famille === "univers" && UNIVERS_FRERES.includes(r.slug as never)) continue;
      const n = PRODUITS.filter((p) => porte(p, famille, r.slug)).length;
      assert.ok(n >= 6, `${f.chemin}/${r.slug} : seulement ${n} idées`);
    }
  }
});

test("Top 10 : 10 produits existants, de la bonne rubrique, sans doublon", () => {
  assert.ok(TOPS.length >= 12, `${TOPS.length} Top 10 seulement`);
  assert.equal(new Set(TOPS.map((t) => t.slug)).size, TOPS.length, "slug de Top en double");
  for (const t of TOPS) {
    assert.match(t.slug, SLUG, t.slug);
    assert.ok(t.titre.length <= 60, `titre trop long : ${t.slug}`);
    assert.ok(t.description.length >= 70 && t.description.length <= 160, `description de ${t.slug} : ${t.description.length} caractères`);
    assert.ok(t.accroche.length <= 45, `accroche trop longue : ${t.slug}`);
    assert.match(t.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(t.items.length, 10, `${t.slug} : ${t.items.length} produits`);
    assert.equal(new Set(t.items.map((i) => i.produit)).size, 10, `${t.slug} : produit en double`);
    assert.ok(t.conseils.length >= 2 && t.faq.length >= 3, `${t.slug} : conseils ou FAQ incomplets`);
    assert.ok(t.commencer.length >= 80, `${t.slug} : « Par où commencer » manquant ou trop court`);
    assert.match(t.intro, /pas un palmarès officiel/, `${t.slug} : le chapô doit expliquer le classement (modèle Keurbook)`);
    const [famille, slug] = t.rubrique.split("/") as [Famille | "page", string];
    // Top rattaché à une page (« page/envoyer-au-pays ») : ses produits doivent voyager bien.
    const page = famille === "page";
    assert.ok(page ? ADRESSES.has(`/${slug}`) : ADRESSES.has(`${FAMILLES[famille]?.chemin}/${slug}`), `${t.slug} : rubrique inconnue ${t.rubrique}`);
    for (const it of t.items) {
      const p = produits.get(it.produit);
      assert.ok(p, `${t.slug} : produit inconnu ${it.produit}`);
      assert.ok(famille === "page" ? p.voyage : porte(p, famille, slug), `${t.slug} : ${it.produit} n'a pas l'étiquette ${t.rubrique}`);
      assert.ok(it.pourquoi.length >= 80, `${t.slug} : « pourquoi » trop court pour ${it.produit}`);
    }
  }
});

test("conseils : en-tête complet, produits existants, liens internes valides", () => {
  assert.ok(conseils.length >= 4, `${conseils.length} articles seulement`);
  for (const c of conseils) {
    assert.ok(c.title && c.resume && c.body, `${c.slug} : en-tête incomplet`);
    assert.match(c.date, /^\d{4}-\d{2}-\d{2}$/, `${c.slug} : date invalide`);
    assert.ok(c.description.length >= 70 && c.description.length <= 160, `${c.slug} : description de ${c.description.length} caractères`);
    for (const s of c.produits) assert.ok(produits.has(s), `${c.slug} : produit inconnu ${s}`);
    for (const l of internalLinks(c.body)) assert.ok(ADRESSES.has(l.replace(/\/$/, "") || "/"), `${c.slug} : lien vers une page inexistante ${l}`);
  }
});

test("guides : chaque rubrique a son propre texte (300 mots ou plus), sans doublon d'intertitre", () => {
  const intertitres = new Set<string>();
  for (const [famille, f] of Object.entries(FAMILLES) as Array<[Famille, (typeof FAMILLES)[Famille]]>) {
    for (const r of f.liste) {
      if (famille === "univers" && UNIVERS_FRERES.includes(r.slug as never)) continue;
      const g = guideDe(famille, r.slug);
      assert.ok(g, `${f.chemin}/${r.slug} : guide manquant`);
      assert.ok(motsDuGuide(g) >= 300, `${f.chemin}/${r.slug} : guide de ${motsDuGuide(g)} mots`);
      for (const p of g.parties) {
        assert.ok(!intertitres.has(p.titre), `intertitre en double : ${p.titre}`);
        intertitres.add(p.titre);
      }
    }
  }
  assert.ok(motsDuGuide(GUIDE_QUIZ) >= 180 && motsDuGuide(GUIDE_TOPS) >= 180, "textes du quiz ou des Top 10 trop courts");
});

test("titres pour Google : 60 caractères au plus", () => {
  for (const t of TOPS) assert.ok(t.titre.length <= 60, `Top ${t.slug} : ${t.titre.length} caractères`);
  for (const c of conseils) assert.ok(c.title.length <= 60, `Conseil ${c.slug} : ${c.title.length} caractères`);
});

test("calendrier : dates valides, dans l'ordre, liens existants", () => {
  for (const [i, f] of FETES.entries()) {
    assert.ok(!Number.isNaN(Date.parse(f.date)), `${f.slug} : date invalide`);
    if (i > 0) assert.ok(FETES[i - 1].date <= f.date, `${f.slug} : fêtes pas dans l'ordre`);
    if (f.lien) assert.ok(ADRESSES.has(f.lien.href), `${f.slug} : lien vers une page inexistante ${f.lien.href}`);
  }
});
