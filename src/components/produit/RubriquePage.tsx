import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { Chips } from "@/components/layout/Chips";
import { Breadcrumb, EntryText, GuideTexte, PageHeader, Section } from "@/components/layout/Section";
import { siteConfig } from "@/lib/config";
import { produitsParPertinence, toCarte } from "@/lib/data/produits";
import { guideDe } from "@/lib/guides";
import { breadcrumbLd, itemListLd, jsonLd } from "@/lib/json-ld";
import { FAMILLES, type Famille, type Rubrique } from "@/lib/taxonomie";
import { topsDe } from "@/lib/tops";
import { ProduitGrid, ProduitListe } from "./ProduitCard";

/** Cartes complètes en haut d'une rubrique ; les autres idées suivent en liste courte (moins de texte répété d'une page à l'autre). */
const CARTES_MAX = 18;
import { TopGrid } from "./TopCard";

/** Paramètre du quiz correspondant à chaque famille (lien « Affiner avec le quiz »). */
const PARAM_QUIZ: Partial<Record<Famille, string>> = { occasion: "occasion", pour: "pour", budget: "budget" };

/** Page d'une rubrique : occasion, destinataire, budget ou univers. */
export function RubriquePage({ famille, rubrique }: { famille: Famille; rubrique: Rubrique }) {
  const f = FAMILLES[famille];
  const path = `${f.chemin}/${rubrique.slug}`;
  const tops = topsDe(`${famille}/${rubrique.slug}`);
  const produits = produitsParPertinence(famille, rubrique.slug).map((p) => toCarte(p, "rubrique"));
  // Les cadeaux déjà présentés dans un Top 10 de la rubrique (avec leur « pourquoi ») passent en liste courte.
  const dansUnTop = new Set(tops.flatMap((t) => t.items.map((it) => it.produit)));
  const cartes = produits.filter((p) => !dansUnTop.has(p.slug)).slice(0, CARTES_MAX);
  const autres = produits.filter((p) => !cartes.includes(p));
  const param = PARAM_QUIZ[famille];
  const guide = guideDe(famille, rubrique.slug);
  const url = `${siteConfig.url}${path}`;

  const structuredData = [
    breadcrumbLd([
      { name: "Accueil", url: siteConfig.url },
      { name: rubrique.titre, url },
    ]),
    itemListLd(
      rubrique.titre,
      tops.map((t) => ({ name: t.titre, url: `${siteConfig.url}/top/${t.slug}` })),
    ),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(tops.length > 1 ? structuredData : structuredData.slice(0, 1)) }} />
      <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: f.nom }, { name: rubrique.nom }]} />
      <PageHeader eyebrow={f.nom} title={rubrique.titre} intro={rubrique.intro}>
        {param && (
          <Link href={`/quiz?${param}=${rubrique.slug}`} className="btn-primary mt-6">
            Affiner avec le quiz
          </Link>
        )}
      </PageHeader>

      {tops.length > 0 && (
        <Section title={tops.length > 1 ? "Nos sélections" : "Notre sélection"}>
          <TopGrid tops={tops} prioritaire />
        </Section>
      )}

      <Section title={`${produits.length} idées cadeaux`}>
        {cartes.length > 0 && <ProduitGrid produits={cartes} prioritaire={tops.length === 0} />}
        {autres.length > 0 && (
          <>
            <h3 className="mt-14 mb-5 font-serif text-[26px] leading-tight font-semibold">
              {cartes.length > 0 ? `Encore ${autres.length} idées` : "Toutes les idées"}
            </h3>
            <ProduitListe produits={autres} />
          </>
        )}
      </Section>

      <div className="container-page">
        <AdSlot placement="rubrique" />
      </div>

      {guide ? (
        <GuideTexte title={`Bien choisir : ${rubrique.nom.toLowerCase()}`} guide={guide} />
      ) : (
        <EntryText title={`Bien choisir : ${rubrique.nom.toLowerCase()}`}>
          {rubrique.texte.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </EntryText>
      )}

      <section className="container-page mt-16 space-y-8">
        <Chips famille={famille} actif={rubrique.slug} titre={`Toutes les idées ${f.nom.toLowerCase()}`} />
        {(Object.keys(FAMILLES) as Famille[])
          .filter((k) => k !== famille)
          .map((k) => (
            <Chips key={k} famille={k} titre={FAMILLES[k].nom} />
          ))}
      </section>
    </>
  );
}
