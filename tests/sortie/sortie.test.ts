/**
 * Contrôle du site construit (dossier out/), avant chaque mise en ligne (même principe que Keur Foot).
 * Lancement : npm run build, puis npm run test:sortie (deploy.yml le fait avant de publier).
 * Vérifie chaque page HTML : un seul h1, une description, un titre de 60 caractères au plus, l'adresse canonique,
 * les données structurées (JSON-LD) qui se lisent, la grande image autorisée, les liens Amazon et les images réduites.
 */
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, it } from "node:test";
import { CODES_SUIVI } from "../../src/lib/amazon";

const CODES = new Set<string>(Object.values(CODES_SUIVI));

const out = join(import.meta.dirname, "..", "..", "out");
const SITE = "https://keurkado.com";
const CLE_INDEXNOW = "ad7c52fd83b9796d7b77e4dc39b452d0";

/** Pages du site : chaque index.html de out/ (hors page 404 et fichiers techniques de Next.js). */
function pages(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return ["_next", "404", "_not-found"].includes(f) ? [] : pages(p);
    return f === "index.html" ? [p] : [];
  });
}

/** Adresse publique d'un fichier out/…/index.html (« out/top/index.html » → « https://keurkado.com/top/ »). */
const adresse = (fichier: string) => `${SITE}/${relative(out, fichier).split(sep).slice(0, -1).map((s) => `${s}/`).join("")}`;

const decoder = (t: string) =>
  t
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const fichiers = existsSync(out) ? pages(out) : [];

describe("Site construit (out/)", () => {
  it("le dossier out/ existe et contient les pages", () => {
    assert.ok(existsSync(join(out, "index.html")), "lancer npm run build avant npm run test:sortie");
    assert.ok(fichiers.length >= 50, `${fichiers.length} pages seulement`);
  });

  for (const fichier of fichiers) {
    const url = adresse(fichier);
    it(`${url.slice(SITE.length)} : h1, description, titre, canonique, JSON-LD, liens Amazon, images`, () => {
      const html = readFileSync(fichier, "utf8");
      assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, "un seul titre h1");
      const descriptions = [...html.matchAll(/<meta name="description" content="([^"]*)"/g)];
      assert.equal(descriptions.length, 1, "une seule description");
      assert.ok(descriptions[0][1].length >= 50, "description trop courte");
      const titres = [...html.matchAll(/<title>([^<]*)<\/title>/g)];
      assert.equal(titres.length, 1, "un seul titre");
      assert.ok(decoder(titres[0][1]).length <= 60, `titre de ${decoder(titres[0][1]).length} caractères : ${decoder(titres[0][1])}`);
      assert.match(html, new RegExp(`<link rel="canonical" href="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"/>`), "adresse canonique");
      assert.match(html, /<meta name="robots" content="[^"]*max-image-preview:large/, "grande image autorisée");
      assert.doesNotMatch(html, /<meta name="robots" content="noindex/, "page indexable");
      const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      for (const m of ld) assert.doesNotThrow(() => JSON.parse(m[1]), "JSON-LD illisible");
      for (const m of html.matchAll(/<a [^>]*href="https:\/\/www\.amazon\.fr[^"]*"[^>]*>/g)) {
        assert.match(m[0], /rel="sponsored nofollow noopener"/, `lien Amazon : ${m[0].slice(0, 120)}`);
        const tag = decoder(m[0].match(/href="([^"]*)"/)?.[1] ?? "").match(/[?&]tag=([^&]+)/)?.[1];
        assert.ok(tag && CODES.has(tag), `lien Amazon sans code de suivi de la table : ${m[0].slice(0, 120)}`);
      }
      assert.doesNotMatch(html, /petite commission sur vos achats/, "phrase d'affiliation retirée");
      // Aucun lien vers les autres sites du groupe (seule la vitrine toakeur.com est autorisée).
      for (const m of html.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
        assert.doesNotMatch(m[1], /(keurbook|keur-?cook|keur-?deco|keur-?foot|kultiled|optiled|solelis|alohash|kultiva|palabre|erea)\.|[a-z0-9-]+\.toakeur\.com/i, `lien vers un autre site du groupe : ${m[1]}`);
      }
      // Illustrations des cadeaux (480 px, version 320 px) ; les vignettes des cartes Top 10 font déjà 400 px.
      for (const m of html.matchAll(/<img [^>]*src="\/produits\/[^"]*"[^>]*>/g)) {
        assert.match(m[0], /srcSet="/, `image sans versions réduites : ${m[0].slice(0, 120)}`);
      }
    });
  }

  it("l'épingle en tête de chaque Top 10 propose deux tailles (srcset)", () => {
    for (const f of fichiers.filter((x) => /[\\/]top[\\/][^\\/]+[\\/]index\.html$/.test(x))) {
      assert.match(readFileSync(f, "utf8"), /srcSet="\/epingles\/vignettes\/[a-z0-9-]+\.webp 400w, \/epingles\/vignettes\/[a-z0-9-]+-700\.webp 700w"/, f);
    }
  });

  it("l'accueil porte les balises de vérification (AdSense, Bing)", () => {
    const html = readFileSync(join(out, "index.html"), "utf8");
    assert.match(html, /<meta name="google-adsense-account" content="ca-pub-\d+"/);
    assert.match(html, /<meta name="msvalidate.01" content="[0-9A-F]{32}"/);
  });

  it("le sitemap liste toutes les pages, et seulement elles, avec une date", () => {
    const xml = readFileSync(join(out, "sitemap.xml"), "utf8");
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.equal((xml.match(/<lastmod>\d{4}-\d{2}-\d{2}/g) ?? []).length, locs.length, "une date par page");
    assert.deepEqual([...locs].sort(), fichiers.map(adresse).sort());
  });

  it("les fichiers publics sont présents (ads.txt, robots.txt, clé IndexNow)", () => {
    assert.match(readFileSync(join(out, "ads.txt"), "utf8"), /google\.com, pub-\d+/);
    assert.match(readFileSync(join(out, "robots.txt"), "utf8"), /Sitemap: https:\/\/keurkado\.com\/sitemap\.xml/);
    assert.equal(readFileSync(join(out, `${CLE_INDEXNOW}.txt`), "utf8").trim(), CLE_INDEXNOW);
  });

  it("les .txt de Next.js sont en noindex, mais ni ads.txt, ni robots.txt, ni la clé IndexNow", () => {
    const regles = readFileSync(join(out, "_headers"), "utf8");
    assert.match(regles, /^\/\*\.txt\n {2}X-Robots-Tag: noindex$/m);
    for (const f of ["ads.txt", "robots.txt", `${CLE_INDEXNOW}.txt`]) assert.match(regles, new RegExp(`^/${f.replace(".", "\\.")}\\n {2}! X-Robots-Tag$`, "m"), f);
  });
});
