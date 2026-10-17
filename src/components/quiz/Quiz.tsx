"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProduitCard } from "@/components/produit/ProduitCard";
import type { CarteProduit } from "@/lib/data/produits";

export interface Choix {
  slug: string;
  nom: string;
}

/** Valeur « peu importe » d'une étape. */
const TOUS = "tous";

type Etape = "occasion" | "pour" | "budget";
const ETAPES: Etape[] = ["occasion", "pour", "budget"];

const QUESTIONS: Record<Etape, { titre: string; tous: string }> = {
  occasion: { titre: "Pour quelle occasion ?", tous: "Juste pour faire plaisir" },
  pour: { titre: "Pour qui ?", tous: "Je ne sais pas encore" },
  budget: { titre: "Quel budget ?", tous: "Peu importe" },
};

/** Nombre maximum de cadeaux montrés dans chaque bloc du résultat. */
const MAX = 9;

/**
 * Quiz « Trouve le cadeau » : occasion → personne → budget → sélection.
 * Tout se passe dans le navigateur ; les réponses sont reportées dans l'adresse (?occasion=…&pour=…&budget=…)
 * pour que le résultat puisse être partagé ou ouvert depuis une page rubrique.
 */
export function Quiz({ produits, options }: { produits: CarteProduit[]; options: Record<Etape, Choix[]> }) {
  const [reponses, setReponses] = useState<Partial<Record<Etape, string>>>({});
  const [voyage, setVoyage] = useState(false);
  const titre = useRef<HTMLHeadingElement>(null);
  const premierRendu = useRef(true);

  // Réponses déjà présentes dans l'adresse (lien partagé, bouton « Affiner avec le quiz »).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const lues: Partial<Record<Etape, string>> = {};
    for (const e of ETAPES) {
      const v = q.get(e);
      if (v && (v === TOUS || options[e].some((o) => o.slug === v))) lues[e] = v;
    }
    // Lecture unique de l'adresse au chargement (le rendu statique ne la connaît pas).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (Object.keys(lues).length) setReponses(lues);
    if (q.get("voyage") === "1") setVoyage(true);
  }, [options]);

  const etape = ETAPES.find((e) => !reponses[e]) ?? null;
  const numero = etape ? ETAPES.indexOf(etape) + 1 : 3;

  // Adresse mise à jour à chaque réponse ; le focus va au titre de l'étape (lecteurs d'écran, clavier).
  useEffect(() => {
    const q = new URLSearchParams();
    for (const e of ETAPES) if (reponses[e]) q.set(e, reponses[e]!);
    if (voyage) q.set("voyage", "1");
    const s = q.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    titre.current?.focus();
  }, [reponses, voyage]);

  const resultat = useMemo(() => (etape ? null : selection(produits, reponses, voyage)), [etape, produits, reponses, voyage]);

  const repondre = (e: Etape, v: string) => setReponses((r) => ({ ...r, [e]: v }));
  const revenir = (e: Etape) =>
    setReponses((r) => {
      const garde: Partial<Record<Etape, string>> = {};
      for (const x of ETAPES.slice(0, ETAPES.indexOf(e))) if (r[x]) garde[x] = r[x];
      return garde;
    });
  const nom = (e: Etape) => (reponses[e] === TOUS ? QUESTIONS[e].tous : options[e].find((o) => o.slug === reponses[e])?.nom);

  return (
    <div>
      {/* Progression et réponses déjà données (cliquables pour revenir en arrière). */}
      <ol className="flex flex-wrap items-center gap-2 text-sm" aria-label="Étapes du quiz">
        {ETAPES.map((e, i) => (
          <li key={e}>
            {reponses[e] ? (
              <button type="button" onClick={() => revenir(e)} className="tag border-orange bg-orange-soft font-semibold text-orange" aria-label={`Modifier : ${QUESTIONS[e].titre} (${nom(e)})`}>
                {i + 1}. {nom(e)} ✎
              </button>
            ) : (
              <span className={`tag ${e === etape ? "border-ink font-semibold" : "text-muted"}`} aria-current={e === etape ? "step" : undefined}>
                {i + 1}. {QUESTIONS[e].titre.replace(" ?", "")}
              </span>
            )}
          </li>
        ))}
      </ol>

      {etape ? (
        <section key={etape} className="etape mt-8" aria-labelledby="question">
          <p className="eyebrow">Question {numero} sur 3</p>
          <h2 id="question" ref={titre} tabIndex={-1} className="mt-2 font-serif text-[32px] leading-tight font-semibold outline-none sm:text-5xl">
            {QUESTIONS[etape].titre}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {options[etape].map((o) => (
              <li key={o.slug}>
                <button type="button" onClick={() => repondre(etape, o.slug)} className="carte-cadeau h-full w-full rounded-2xl border-2 border-line bg-white px-4 py-5 text-left text-[17px] font-semibold hover:border-orange focus-visible:border-orange focus-visible:outline-none">
                  {o.nom}
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={() => repondre(etape, TOUS)} className="h-full w-full rounded-2xl border-2 border-dashed border-line-strong px-4 py-5 text-left text-[16px] text-muted hover:border-orange hover:text-ink">
                {QUESTIONS[etape].tous}
              </button>
            </li>
          </ul>
        </section>
      ) : (
        resultat && (
          <section className="etape mt-8" aria-labelledby="resultat">
            <p className="eyebrow">Votre sélection</p>
            <h2 id="resultat" ref={titre} tabIndex={-1} className="mt-2 font-serif text-[32px] leading-tight font-semibold outline-none sm:text-5xl">
              {resultat.exacts.length > 0 ? `${resultat.exacts.length} idée${resultat.exacts.length > 1 ? "s" : ""} pour vous` : "Nos idées les plus proches"}
            </h2>
            <label className="mt-5 inline-flex cursor-pointer items-center gap-3 rounded-full bg-vert-soft px-4 py-2 text-[15px] font-semibold text-vert">
              <input type="checkbox" checked={voyage} onChange={(e) => setVoyage(e.target.checked)} className="size-5 accent-[#1e7a4e]" />
              À envoyer au pays (cadeaux qui voyagent bien)
            </label>

            {resultat.exacts.length > 0 && (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {resultat.exacts.slice(0, MAX).map((p) => (
                  <li key={p.slug}>
                    <ProduitCard produit={p} />
                  </li>
                ))}
              </ul>
            )}

            {resultat.proches.length > 0 && (
              <>
                <h3 className="mt-12 font-serif text-2xl font-semibold">{resultat.exacts.length > 0 ? "Autres idées qui pourraient plaire" : "Ces cadeaux répondent à une partie de vos critères"}</h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {resultat.proches.slice(0, MAX).map((p) => (
                    <li key={p.slug}>
                      <ProduitCard produit={p} />
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setReponses({})} className="btn-secondary">
                Recommencer le quiz
              </button>
              {reponses.occasion && reponses.occasion !== TOUS && (
                <Link href={`/occasion/${reponses.occasion}`} className="btn-secondary">
                  Toutes les idées : {nom("occasion")}
                </Link>
              )}
            </div>
          </section>
        )
      )}
    </div>
  );
}

/** Cadeaux qui répondent à tous les critères, puis ceux qui en remplissent une partie (la personne compte le plus). */
function selection(produits: CarteProduit[], r: Partial<Record<Etape, string>>, voyage: boolean) {
  const ok = (v: string | undefined, test: () => boolean) => !v || v === TOUS || test();
  const base = voyage ? produits.filter((p) => p.voyage) : produits;
  const score = (p: CarteProduit) =>
    (ok(r.pour, () => p.pour.includes(r.pour!)) ? 3 : 0) + (ok(r.occasion, () => p.occasions.includes(r.occasion!)) ? 2 : 0) + (ok(r.budget, () => p.budget === r.budget) ? 1 : 0);
  const notes = base.map((p) => ({ p, s: score(p) }));
  const exacts = notes.filter((n) => n.s === 6).map((n) => n.p);
  // Proches : au moins la personne ou l'occasion, les meilleurs scores d'abord.
  const proches = notes
    .filter((n) => n.s >= 3 && n.s < 6)
    .sort((a, b) => b.s - a.s)
    .map((n) => n.p);
  return { exacts, proches };
}
