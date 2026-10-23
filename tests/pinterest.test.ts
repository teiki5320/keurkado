/**
 * Publication Pinterest (scripts/pinterest-*.mjs, même système que Keur Déco) : choix des épingles du jour,
 * tableaux reliés par leur nom, cohérence de la config avec scripts/epingles.mts et du fichier d'état.
 * Lancer : npm test
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { TOPS } from "../src/lib/tops";
import { choisirEpingles, relierTableaux } from "../scripts/pinterest-lib.mjs";

const racine = join(import.meta.dirname, "..");
const config = JSON.parse(readFileSync(join(racine, "config/pinterest.json"), "utf8"));
const etat = JSON.parse(readFileSync(join(racine, "data/pinterest-etat.json"), "utf8"));

const e = (id: string, slug: string, publie_le = "2026-10-01", numero = 1) => ({ id, slug, numero, publie_le, titre: id, description: "", lien: "", image: "", tableau: "occasion" });

test("Pinterest : au plus 5 épingles, jamais deux de la même page le même jour, rien de déjà publié ni de futur", () => {
  const m = { epingles: [e("a-1", "a"), e("a-2", "a", "2026-10-01", 2), e("b-1", "b"), e("c-1", "c"), e("d-1", "d"), e("f-1", "f"), e("g-1", "g"), e("h-1", "h", "2026-12-01")] };
  const choix = choisirEpingles(m, { publiees: [{ id: "b-1", slug: "b", publie_le: "2026-10-01" }] }, { max: 5, aujourdhui: "2026-10-23" });
  assert.equal(choix.length, 5);
  assert.equal(new Set(choix.map((x: { slug: string }) => x.slug)).size, 5);
  assert.ok(!choix.some((x: { id: string }) => ["b-1", "h-1", "a-2"].includes(x.id)));
});

test("Pinterest : config/pinterest.json et TABLEAUX (scripts/epingles.mts) ont les mêmes tableaux", async () => {
  // Import dynamique : scripts/epingles.mts est un module ESM (await au niveau du module).
  const { TABLEAUX, tableauDuTop } = await import("../scripts/epingles.mjs");
  assert.deepEqual(Object.fromEntries(Object.entries(config.tableaux).map(([cle, t]) => [cle, (t as { nom: string }).nom])), TABLEAUX);
  for (const top of TOPS) assert.ok(config.tableaux[tableauDuTop(top)], top.slug);
  const ids = relierTableaux(config, [{ id: "1", name: "cadeaux à envoyer au pays" }]);
  assert.equal(ids.page, "1");
  assert.equal(ids.occasion, null);
});

test("Pinterest : le fichier d'état ne cite que des Top 10 existants, sans doublon", () => {
  const slugs = new Set(TOPS.map((t) => t.slug));
  const ids = etat.publiees.map((p: { id: string }) => p.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const p of etat.publiees) {
    assert.ok(slugs.has(p.slug), p.slug);
    assert.equal(p.id, `${p.slug}-1`);
  }
});
