/**
 * Redirections du Worker de keurkado.com : une seule adresse par page.
 * Lancer : npm test
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { redirection } from "../worker/index";

test("http et www vont vers https://keurkado.com en gardant le chemin et les paramètres", () => {
  assert.equal(redirection("http://keurkado.com/"), "https://keurkado.com/");
  assert.equal(redirection("https://www.keurkado.com/top/cadeaux-wax/"), "https://keurkado.com/top/cadeaux-wax/");
  assert.equal(redirection("http://www.keurkado.com/quiz/?pour=maman"), "https://keurkado.com/quiz/?pour=maman");
});

test("une page sans barre finale la reçoit, en une seule redirection", () => {
  assert.equal(redirection("https://keurkado.com/top"), "https://keurkado.com/top/");
  assert.equal(redirection("https://keurkado.com/quiz?occasion=noel"), "https://keurkado.com/quiz/?occasion=noel");
  assert.equal(redirection("http://www.keurkado.com/pour/maman"), "https://keurkado.com/pour/maman/");
  assert.equal(redirection("https://keurkado.com/cgv"), "https://keurkado.com/conditions/");
  assert.equal(redirection("https://keurkado.com/top/index.html"), "https://keurkado.com/top/");
  assert.equal(redirection("http://keurkado.com/index.html"), "https://keurkado.com/");
});

test("la bonne adresse et les fichiers ne sont pas redirigés", () => {
  assert.equal(redirection("https://keurkado.com/"), null);
  assert.equal(redirection("https://keurkado.com/top/cadeaux-wax/"), null);
  assert.equal(redirection("https://keurkado.com/ads.txt"), null);
  assert.equal(redirection("https://keurkado.com/sitemap.xml"), null);
  assert.equal(redirection("https://keurkado.com/_next/static/chunks/a.js"), null);
  assert.equal(redirection("https://keurkado.com/produits/kalimba.webp"), null);
});
