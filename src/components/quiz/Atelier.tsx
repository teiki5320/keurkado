"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Perle, ProduitCard } from "@/components/produit/ProduitCard";
import type { CarteProduit } from "@/lib/data/produits";

export interface Choix {
  slug: string;
  nom: string;
  /** Réplique de Tonton Kado quand on choisit cette option (occasions). */
  note?: string;
}

export interface FeteAtelier {
  slug: string;
  nom: string;
  date: string;
  dateLabel: string;
  /** Occasion du site correspondante (« tabaski »), si la fête en a une. */
  occasion?: string;
  href?: string;
}

type Etape = "debut" | "pour" | "occasion" | "budget" | "apres" | "attente";
type Reponses = { pour?: string; occasion?: string; budget?: string; voyage?: boolean };
type Message =
  | { t: "bot"; text: string }
  | { t: "user"; text: string }
  | { t: "perles"; slugs: string[] }
  | { t: "detail"; slug: string }
  | { t: "fetes" }
  | { t: "tops" };

interface Etat {
  log: Message[];
  etape: Etape;
  rep: Reponses;
}

/** Typographie française : espace insécable avant « ? ! : ; » et à l'intérieur des guillemets (jamais de signe seul en début de ligne). */
const fr = (t: string) => t.replace(/ ([?!:;»])/g, "\u00a0$1").replace(/« /g, "«\u00a0");

/** Nombre de perles montrées à la fois. */
const MAX = 8;
const CLE = "keurkado-atelier";
const BONJOUR = "Bienvenue à l'atelier ! Je suis Tonton Kado. On enfile des perles de bois, une idée après l'autre. Pour qui cherchez-vous un cadeau ?";
const DEPART: Etat = { log: [{ t: "bot", text: BONJOUR }], etape: "debut", rep: {} };

/**
 * L'atelier de Tonton Kado (design « Perles de bois ») : une conversation qui remplace le quiz.
 * Personne → occasion → budget → perles (cadeaux) → détail et lien Amazon. Tout se passe dans le navigateur.
 * - mode « accueil » : la conversation est gardée dans le navigateur (stockage local) pour la retrouver ;
 * - mode « quiz » (/quiz) : les réponses sont lues et reportées dans l'adresse (?pour=…&occasion=…&budget=…&voyage=1),
 *   pour partager un résultat ou arriver depuis une page rubrique.
 */
export function Atelier({
  produits,
  options,
  fetes,
  tops,
  mode,
}: {
  produits: CarteProduit[];
  options: { pour: Choix[]; occasion: Choix[]; budget: Choix[] };
  fetes: FeteAtelier[];
  tops: Array<{ slug: string; titre: string }>;
  mode: "accueil" | "quiz";
}) {
  const [etat, setEtat] = useState<Etat>(DEPART);
  /** Réponse que Tonton Kado est en train d'« écrire » (affichée après un court délai). */
  const [enAttente, setEnAttente] = useState<{ reponse: Message[]; etape: Etape } | null>(null);
  const ecrit = enAttente !== null;
  const fil = useRef<HTMLDivElement>(null);
  const pret = useRef(false);
  const parSlug = useMemo(() => new Map(produits.map((p) => [p.slug, p])), [produits]);
  const nom = useCallback((liste: Choix[], slug?: string) => liste.find((c) => c.slug === slug)?.nom, []);

  /** Cadeaux qui cochent tout, puis ceux qui en remplissent une partie (la personne compte le plus). */
  const selection = useCallback(
    (r: Reponses) => {
      const base = r.voyage ? produits.filter((p) => p.voyage) : produits;
      const ok = (v: string | undefined, test: () => boolean) => !v || test();
      const score = (p: CarteProduit) =>
        (ok(r.pour, () => p.pour.includes(r.pour!)) ? 3 : 0) + (ok(r.occasion, () => p.occasions.includes(r.occasion!)) ? 2 : 0) + (ok(r.budget, () => p.budget === r.budget) ? 1 : 0);
      const notes = base.map((p) => ({ p, s: score(p) }));
      return {
        exacts: notes.filter((n) => n.s === 6).map((n) => n.p),
        proches: notes
          .filter((n) => n.s >= 3 && n.s < 6)
          .sort((a, b) => b.s - a.s)
          .map((n) => n.p),
      };
    },
    [produits],
  );

  const resultat = useCallback(
    (r: Reponses): Message[] => {
      const { exacts, proches } = selection(r);
      const pour = nom(options.pour, r.pour);
      const occ = nom(options.occasion, r.occasion);
      const pour_ = pour ? ` pour ${pour.toLowerCase()}` : "";
      const occ_ = occ ? `, ${occ}` : "";
      const liste = (exacts.length ? exacts : proches).slice(0, MAX);
      const intro = exacts.length
        ? `J'ai ${exacts.length} idée${exacts.length > 1 ? "s" : ""} qui cochent tout${pour_}${occ_}. Touchez une perle pour savoir pourquoi je l'ai choisie.`
        : `Rien d'exact avec ces critères, mais voici le plus proche${pour_}${occ_}. Touchez une perle pour en savoir plus.`;
      return liste.length ? [{ t: "bot", text: intro }, { t: "perles", slugs: liste.map((p) => p.slug) }] : [{ t: "bot", text: "Je n'ai rien trouvé avec ces critères. Changeons quelque chose ?" }];
    },
    [selection, nom, options],
  );

  // Au chargement : réponses de l'adresse (/quiz) ou conversation gardée (accueil).
  useEffect(() => {
    let depart: Etat | null = null;
    if (mode === "quiz") {
      const q = new URLSearchParams(window.location.search);
      const rep: Reponses = {};
      const lire = (cle: "pour" | "occasion" | "budget", liste: Choix[]) => {
        const v = q.get(cle);
        if (v && liste.some((c) => c.slug === v)) rep[cle] = v;
      };
      lire("pour", options.pour);
      lire("occasion", options.occasion);
      lire("budget", options.budget);
      if (q.get("voyage") === "1") rep.voyage = true;
      if (Object.keys(rep).length) {
        const resume = [nom(options.pour, rep.pour), nom(options.occasion, rep.occasion), nom(options.budget, rep.budget), rep.voyage ? "à envoyer au pays" : null].filter(Boolean).join(" · ");
        const suite: Etape = !rep.pour ? "pour" : !rep.occasion ? "occasion" : !rep.budget ? "budget" : "apres";
        const question = suite === "pour" ? "C'est pour qui ?" : suite === "occasion" ? "Et pour quelle occasion ?" : "Quel budget ?";
        depart = {
          log: [{ t: "bot", text: BONJOUR }, { t: "user", text: resume }, ...(suite === "apres" ? resultat(rep) : [{ t: "bot" as const, text: question }])],
          etape: suite,
          rep,
        };
      }
    } else {
      try {
        const garde = JSON.parse(localStorage.getItem(CLE) || "null") as Etat | null;
        if (garde?.log?.length) depart = { ...garde, etape: garde.etape === "attente" ? "apres" : garde.etape };
      } catch {
        // Stockage indisponible (navigation privée…) : on part de zéro.
      }
    }
    // Lecture unique au chargement (le rendu statique ne connaît ni l'adresse ni le stockage du visiteur).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (depart) setEtat(depart);
    pret.current = true;
  }, [mode, options, nom, resultat]);

  // Après chaque message : défilement du fil, sauvegarde (accueil) ou adresse à jour (quiz).
  useEffect(() => {
    const el = fil.current;
    if (el && pret.current) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    if (!pret.current) return;
    if (mode === "accueil") {
      try {
        localStorage.setItem(CLE, JSON.stringify(etat));
      } catch {
        // Stockage indisponible : la conversation ne sera simplement pas gardée.
      }
    } else {
      const q = new URLSearchParams();
      if (etat.rep.pour) q.set("pour", etat.rep.pour);
      if (etat.rep.occasion) q.set("occasion", etat.rep.occasion);
      if (etat.rep.budget) q.set("budget", etat.rep.budget);
      if (etat.rep.voyage) q.set("voyage", "1");
      const s = q.toString();
      window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
    }
  }, [etat, ecrit, mode]);

  // Tonton Kado « écrit » un instant, puis sa réponse s'ajoute au fil.
  useEffect(() => {
    if (!enAttente) return;
    const t = setTimeout(() => {
      setEtat((e) => ({ ...e, log: [...e.log, ...enAttente.reponse], etape: enAttente.etape }));
      setEnAttente(null);
    }, 850);
    return () => clearTimeout(t);
  }, [enAttente]);

  /** Le visiteur répond ; la réponse de Tonton Kado suit après le délai d'écriture. */
  const dire = (texte: string, reponse: Message[], suite: { etape: Etape; rep?: Reponses }) => {
    setEtat((e) => ({ log: [...e.log, { t: "user", text: texte }], etape: "attente", rep: suite.rep ?? e.rep }));
    setEnAttente({ reponse, etape: suite.etape });
  };

  const recommencer = () => {
    setEnAttente(null);
    setEtat({ log: [{ t: "bot", text: "On repart de zéro. Pour qui cherchez-vous un cadeau ?" }], etape: "debut", rep: {} });
  };

  const ouvrir = (p: CarteProduit) =>
    dire(`Parle-moi de « ${p.nom} »`, [{ t: "detail", slug: p.slug }, { t: "bot", text: "Si ça vous plaît, le bouton vous emmène sur Amazon.fr. Sinon, je vous montre d'autres idées." }], { etape: "apres" });

  const choisirFete = (f: FeteAtelier) => {
    const occ = options.occasion.find((o) => o.slug === f.occasion);
    if (!occ) return;
    dire(`Des idées pour ${f.nom}`, [{ t: "bot", text: `${occ.note ?? ""} Pour qui est-ce ?`.trim() }], { etape: "pour", rep: { occasion: occ.slug } });
  };

  // Boutons proposés selon l'étape (le « plan » de la conversation).
  const { invite, boutons } = ((): { invite: string; boutons: Array<{ label: string; action: () => void }> } => {
    const { etape, rep } = etat;
    const b = (label: string, action: () => void) => ({ label, action });
    const versOccasion = (r: Reponses) => (r.occasion ? { etape: "budget" as Etape, texte: "Quel budget ?" } : { etape: "occasion" as Etape, texte: "Et pour quelle occasion ?" });
    if (etape === "debut")
      return {
        invite: "Pour commencer",
        boutons: [
          ...options.pour.slice(0, 4).map((p) =>
            b(`Pour ${p.nom.toLowerCase()}`, () => dire(`Pour ${p.nom.toLowerCase()}`, [{ t: "bot", text: `Très bien, ${p.nom.toLowerCase()}. C'est pour quelle occasion ?` }], { etape: "occasion", rep: { pour: p.slug } })),
          ),
          b("Quelqu'un d'autre", () => dire("Pour quelqu'un d'autre", [{ t: "bot", text: "Dites-moi pour qui." }], { etape: "pour" })),
          b("Le calendrier des fêtes", () => dire("Quelles sont les prochaines fêtes ?", [{ t: "bot", text: "Voici les prochaines fêtes. Touchez-en une pour voir les idées." }, { t: "fetes" }], { etape: "debut" })),
          b("Vos Top 10", () => dire("Montre-moi vos Top 10", [{ t: "bot", text: "Nos sélections de dix cadeaux, chacune avec ses conseils :" }, { t: "tops" }], { etape: "debut" })),
        ],
      };
    if (etape === "pour")
      return {
        invite: "C'est pour qui ?",
        boutons: [
          ...options.pour.map((p) =>
            b(p.nom, () => {
              const r = { ...rep, pour: p.slug };
              const s = versOccasion(r);
              dire(p.nom, [{ t: "bot", text: s.texte }], { etape: s.etape, rep: r });
            }),
          ),
          b("Je ne sais pas encore", () => {
            const s = versOccasion(rep);
            dire("Je ne sais pas encore", [{ t: "bot", text: `Pas de souci. ${s.texte}` }], { etape: s.etape, rep: { ...rep, pour: undefined } });
          }),
        ],
      };
    if (etape === "occasion")
      return {
        invite: "Quelle occasion ?",
        boutons: [
          ...options.occasion.map((o) => b(o.nom, () => dire(o.nom, [{ t: "bot", text: `${o.note ?? ""} Quel budget ?`.trim() }], { etape: "budget", rep: { ...rep, occasion: o.slug } }))),
          b("Juste pour faire plaisir", () => dire("Juste pour faire plaisir", [{ t: "bot", text: "Le meilleur des motifs. Quel budget ?" }], { etape: "budget", rep: { ...rep, occasion: undefined } })),
        ],
      };
    if (etape === "budget")
      return {
        invite: "Quel budget ?",
        boutons: [
          ...options.budget.map((x) =>
            b(x.nom, () => {
              const r = { ...rep, budget: x.slug };
              dire(x.nom, resultat(r), { etape: "apres", rep: r });
            }),
          ),
          b("Peu importe", () => {
            const r = { ...rep, budget: undefined };
            dire("Peu importe", resultat(r), { etape: "apres", rep: r });
          }),
        ],
      };
    if (etape === "apres") {
      const resume = [nom(options.pour, rep.pour), nom(options.occasion, rep.occasion), nom(options.budget, rep.budget), rep.voyage ? "à envoyer au pays" : null].filter(Boolean).join(" · ");
      return {
        invite: resume || "Et maintenant ?",
        boutons: [
          b("D'autres idées", () => {
            const { exacts, proches } = selection(rep);
            const deja = new Set(etat.log.flatMap((m) => (m.t === "perles" ? m.slugs : [])));
            const plus = [...exacts, ...proches].filter((p) => !deja.has(p.slug)).slice(0, MAX);
            dire("D'autres idées ?", plus.length ? [{ t: "bot", text: "Dans le même esprit, un peu plus loin de votre demande :" }, { t: "perles", slugs: plus.map((p) => p.slug) }] : [{ t: "bot", text: "J'ai fait le tour pour ces critères. Changeons quelque chose ?" }], { etape: "apres" });
          }),
          b("Changer le budget", () => dire("Changeons le budget", [{ t: "bot", text: "Quel budget, alors ?" }], { etape: "budget", rep: { ...rep, budget: undefined } })),
          b("Changer l'occasion", () => dire("Changeons l'occasion", [{ t: "bot", text: "Pour quelle occasion ?" }], { etape: "occasion", rep: { ...rep, occasion: undefined } })),
          ...(rep.voyage
            ? []
            : [
                b("À envoyer au pays", () => {
                  const r = { ...rep, voyage: true };
                  dire("Quelque chose qui voyage bien dans un colis", [{ t: "bot", text: "Léger, solide, sans liquide : voilà ce qui arrive entier." }, ...resultat(r).slice(1)], { etape: "apres", rep: r });
                }),
              ]),
          b("Recommencer", recommencer),
        ],
      };
    }
    return { invite: "Un instant…", boutons: [] };
  })();

  const lienOccasion = etat.etape === "apres" && etat.rep.occasion ? options.occasion.find((o) => o.slug === etat.rep.occasion) : undefined;

  return (
    <div className="relative flex max-h-[min(82dvh,820px)] min-h-[440px] flex-col overflow-hidden rounded-[36px] border-[1.5px] border-ink/30 bg-paper/60 shadow-[inset_0_0_0_6px_rgba(253,247,234,0.5)]">
      <div className="flex items-center justify-between gap-3 border-b border-ink/20 px-4 py-3 sm:px-6">
        <p className="flex items-center gap-2.5 text-[12px] font-bold tracking-[0.16em] text-muted uppercase">
          <span aria-hidden className="perle-pleine inline-block size-4" />
          Tonton Kado · l&apos;atelier
        </p>
        <button type="button" onClick={recommencer} className="btn px-4 py-1.5 text-[13px]">
          Recommencer
        </button>
      </div>

      {/* Le fil de la conversation, avec le cordon qui descend au centre. */}
      <div ref={fil} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-6 pb-10 sm:px-8" aria-live="polite" aria-relevant="additions">
        <svg aria-hidden viewBox="0 0 100 2000" preserveAspectRatio="none" className="pointer-events-none absolute top-0 left-1/2 h-full min-h-full w-14 -translate-x-1/2">
          <path d="M50 0 C 90 120, 10 240, 50 360 S 90 600, 50 720 S 10 960, 50 1080 S 90 1320, 50 1440 S 10 1680, 50 1800 S 90 1950, 50 2000" fill="none" stroke="#8a6436" strokeWidth="3.5" vectorEffect="non-scaling-stroke" strokeDasharray="2400" strokeDashoffset="2400" className="anim-trace" style={{ animationDuration: "4s" }} />
          <path d="M50 0 C 90 120, 10 240, 50 360 S 90 600, 50 720 S 10 960, 50 1080 S 90 1320, 50 1440 S 10 1680, 50 1800 S 90 1950, 50 2000" fill="none" stroke="#f1dfb8" strokeWidth="1" strokeDasharray="3 6" vectorEffect="non-scaling-stroke" />
        </svg>
        <ol className="relative flex flex-col gap-7">
          {etat.log.map((m, i) => (
            <li key={i} className={`flex flex-col ${m.t === "user" ? "items-end" : "items-start"}`}>
              {m.t === "bot" && (
                <div className="anim-chute flex max-w-[min(90%,540px)] flex-col gap-1.5">
                  <span className="pl-8 text-[10.5px] font-bold tracking-[0.18em] text-muted uppercase">Tonton Kado</span>
                  <p className="bulle anim-balance relative origin-bottom-left rounded-[48px_48px_48px_6px] py-4 pr-6 pl-8 font-serif text-[19px] leading-[1.45] font-medium">
                    <span aria-hidden className="perle-pleine absolute -bottom-3.5 -left-3.5 size-7 border-2 border-paper" />
                    {fr(m.text)}
                  </p>
                </div>
              )}
              {m.t === "user" && (
                <p className="anim-chute relative max-w-[min(85%,440px)] origin-bottom-right rounded-[48px_48px_6px_48px] border-[1.5px] border-ink bg-linear-[160deg] from-[#c9532f] to-[#a63d20] px-7 py-3.5 text-[15px] leading-snug font-bold text-[#fbf4e6] shadow-[inset_0_0_0_4px_#b84a2a,inset_0_0_0_5px_rgba(255,230,200,0.45),-5px_6px_0_#2b1d14]">
                  <span aria-hidden className="absolute -right-3.5 -bottom-3.5 size-7 rounded-full border-2 border-paper bg-[radial-gradient(circle_at_35%_28%,#5a4a40,#1a120c_65%)] shadow-[inset_0_-4px_6px_rgba(0,0,0,0.5)]" />
                  {fr(m.text)}
                </p>
              )}
              {m.t === "perles" && (
                <div className="relative -mx-3 w-[calc(100%+1.5rem)] overflow-x-auto pt-6 pb-4 sm:mx-0 sm:w-full">
                  <div className="relative mx-auto flex w-max min-w-full justify-center gap-5 px-4">
                    <span aria-hidden className="cordon absolute inset-x-0 top-[55px]" />
                    {m.slugs.map((s, j) => {
                      const p = parSlug.get(s);
                      if (!p) return null;
                      return (
                        <button key={s} type="button" onClick={() => ouvrir(p)} className="anim-bascule group flex w-[124px] origin-top flex-col items-center text-center" style={{ animationDelay: `${j * 0.12}s` }}>
                          <span className="anim-perle" style={{ animationDelay: `${-j * 0.45}s` }}>
                            <Perle produit={p} index={j} taille={110} />
                          </span>
                          <span className="mt-6 text-[13px] leading-tight font-semibold group-hover:text-terre-texte">{p.nom}</span>
                          <span className="mt-0.5 font-serif text-[14px] leading-tight text-faint italic">{p.universNom}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {m.t === "detail" &&
                (() => {
                  const p = parSlug.get(m.slug);
                  return p ? (
                    <div className="anim-chute w-full max-w-[420px] self-center">
                      <ProduitCard produit={p} />
                    </div>
                  ) : null;
                })()}
              {m.t === "fetes" && <ListeFetes fetes={fetes} choisir={choisirFete} />}
              {m.t === "tops" && (
                <ul className="flex max-w-[min(96%,600px)] flex-wrap gap-3">
                  {tops.map((t) => (
                    <li key={t.slug} className="anim-chute">
                      <Link href={`/top/${t.slug}`} className="bulle flex min-h-12 items-center rounded-[40px_40px_40px_6px] px-5 py-3 font-serif text-[18px] leading-tight font-semibold hover:text-terre-texte">
                        {t.titre}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
        {ecrit && (
          <div className="flex gap-2.5 px-8 pt-6" aria-label="Tonton Kado écrit…">
            <span className="anim-points size-3.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#d9a76a,#4a2a12)]" />
            <span className="anim-points size-3.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#5a4a40,#1a120c)] [animation-delay:0.2s]" />
            <span className="anim-points size-3.5 rounded-full bg-terre [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {/* Réponses proposées. */}
      <div className="border-t border-ink/20 bg-linear-to-b from-paper/70 to-paper px-3 pt-3 pb-4 backdrop-blur-sm sm:px-6">
        <p className="flex items-center justify-center gap-3 text-center text-[11px] font-bold tracking-[0.16em] text-muted uppercase">
          <span aria-hidden className="h-px w-7 bg-bois" />
          {invite}
          <span aria-hidden className="h-px w-7 bg-bois" />
        </p>
        <div className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pt-1 pb-2 sm:mx-0 sm:max-h-[30dvh] sm:flex-wrap sm:justify-center sm:overflow-x-visible sm:overflow-y-auto sm:px-0">
          {boutons.map((b, i) => (
            <button key={`${etat.etape}-${b.label}`} type="button" onClick={b.action} className="tag anim-bascule shrink-0 origin-bottom-left whitespace-nowrap" style={{ animationDelay: `${i * 0.07}s` }}>
              {b.label}
            </button>
          ))}
          {lienOccasion && (
            <Link href={`/occasion/${lienOccasion.slug}`} className="tag shrink-0 whitespace-nowrap">
              Toutes les idées : {lienOccasion.nom}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/** Prochaines fêtes (calculées dans le navigateur pour rester justes entre deux publications). */
function ListeFetes({ fetes, choisir }: { fetes: FeteAtelier[]; choisir: (f: FeteAtelier) => void }) {
  const [aujourdhui, setAujourdhui] = useState("");
  useEffect(() => {
    // Date du visiteur, connue seulement dans le navigateur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAujourdhui(new Date().toISOString().slice(0, 10));
  }, []);
  const prochaines = fetes.filter((f) => !aujourdhui || f.date >= aujourdhui).slice(0, 6);
  const classe = "bulle anim-chute flex min-h-[50px] flex-col gap-0.5 rounded-[40px_40px_40px_6px] px-5 py-3 text-left shadow-[3px_3px_0_var(--color-ombre)] transition hover:-translate-y-0.5 hover:bg-terre hover:from-terre hover:to-terre hover:text-white";
  return (
    <ul className="flex max-w-[min(96%,600px)] flex-wrap gap-3">
      {prochaines.map((f) => (
        <li key={f.slug}>
          {f.occasion ? (
            <button type="button" onClick={() => choisir(f)} className={classe}>
              <span className="font-serif text-[19px] leading-tight font-semibold">{f.nom}</span>
              <span className="text-[11px] font-semibold tracking-[0.06em] opacity-80">{f.dateLabel}</span>
            </button>
          ) : (
            <Link href={f.href ?? "/calendrier"} className={classe}>
              <span className="font-serif text-[19px] leading-tight font-semibold">{f.nom}</span>
              <span className="text-[11px] font-semibold tracking-[0.06em] opacity-80">{f.dateLabel}</span>
            </Link>
          )}
        </li>
      ))}
      <li>
        <Link href="/calendrier" className={classe}>
          <span className="font-serif text-[19px] leading-tight font-semibold">Tout le calendrier</span>
          <span className="text-[11px] font-semibold tracking-[0.06em] opacity-80">fêtes et dates estimées</span>
        </Link>
      </li>
    </ul>
  );
}
