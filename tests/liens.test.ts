/**
 * Liens en boucle entre pages, titres coupés et attributs des liens Amazon.
 * Lancer : npm test
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { AMAZON_REL } from "../src/lib/amazon";
import { parseConseil, relatedConseils } from "../src/lib/conseils/article";
import { croisesEnBoucle, suivantsEnBoucle } from "../src/lib/liens";
import { couperTexte } from "../src/lib/metadata";
import { TOPS } from "../src/lib/tops";

const DIR = join(process.cwd(), "content", "conseils");
const conseils = readdirSync(DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => parseConseil(f.replace(/\.md$/, ""), readFileSync(join(DIR, f), "utf8")))
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "fr"));

test("suivantsEnBoucle : les suivants, puis retour au début", () => {
  assert.deepEqual(suivantsEnBoucle([1, 2, 3, 4], 3, 3), [4, 1, 2]);
  assert.deepEqual(suivantsEnBoucle([1, 2], 1, 3), [2]);
});

test("croisesEnBoucle : la cible est partagée à tour de rôle", () => {
  assert.deepEqual(croisesEnBoucle(["a", "b", "c"], 0, 2), ["a", "b"]);
  assert.deepEqual(croisesEnBoucle(["a", "b", "c"], 1, 2), ["c", "a"]);
  assert.deepEqual(croisesEnBoucle([], 1, 2), []);
  assert.deepEqual(croisesEnBoucle(["a"], -1, 2), []);
});

test("liens « À lire aussi » : chaque conseil et chaque Top 10 reçoit au moins 3 liens", () => {
  const recus = new Map<string, number>();
  const compter = (cle: string) => recus.set(cle, (recus.get(cle) ?? 0) + 1);
  for (const c of conseils) {
    for (const r of relatedConseils(c, conseils)) compter(`conseil:${r.slug}`);
    for (const t of croisesEnBoucle(TOPS, conseils.indexOf(c), 2)) compter(`top:${t.slug}`);
  }
  TOPS.forEach((t, i) => {
    for (const s of suivantsEnBoucle(TOPS, t, 3)) compter(`top:${s.slug}`);
    for (const c of croisesEnBoucle(conseils, i, 2)) compter(`conseil:${c.slug}`);
  });
  for (const c of conseils) assert.ok((recus.get(`conseil:${c.slug}`) ?? 0) >= 3, `conseil ${c.slug} : ${recus.get(`conseil:${c.slug}`) ?? 0} lien(s)`);
  for (const t of TOPS) assert.ok((recus.get(`top:${t.slug}`) ?? 0) >= 3, `top ${t.slug} : ${recus.get(`top:${t.slug}`) ?? 0} lien(s)`);
});

test("couperTexte : 60 caractères au plus, coupé en fin de mot", () => {
  const long = "Idées cadeaux africains pour une maman qui aime le wax et les bijoux";
  const coupe = couperTexte(long, 60);
  assert.ok(coupe.length <= 60, coupe);
  assert.ok(coupe.endsWith("…"));
  assert.ok(long.startsWith(coupe.slice(0, -1)), "coupé sur un mot entier");
  assert.equal(couperTexte("Court", 60), "Court");
});

test("liens Amazon : sponsorisés, sans « noreferrer » (Amazon voit la provenance)", () => {
  assert.equal(AMAZON_REL, "sponsored nofollow noopener");
});
