import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Chips } from "@/components/layout/Chips";
import { Breadcrumb, GuideTexte, PageHeader, Section } from "@/components/layout/Section";
import { MentionAffiliation, ProduitGrid } from "@/components/produit/ProduitCard";
import { RubriquePage } from "@/components/produit/RubriquePage";
import { produitsDe, toCarte } from "@/lib/data/produits";
import { GUIDES_FRERES } from "@/lib/guides";
import { breadcrumbLd, jsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { FAMILLES, SITES_FRERES, trouver, UNIVERS_FRERES, type Rubrique, type UniversSlug } from "@/lib/taxonomie";

export const dynamicParams = false;

export function generateStaticParams() {
  return FAMILLES.univers.liste.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/univers/[slug]">): Promise<Metadata> {
  const r = trouver("univers", (await params).slug);
  if (!r) return {};
  return pageMetadata({ title: r.titre, description: r.description, path: `/univers/${r.slug}`, image: `/epingles/rubriques/univers-${r.slug}.jpg`, imageAlt: r.titre, imageSize: [1200, 630] });
}

export default async function Page({ params }: PageProps<"/univers/[slug]">) {
  const r = trouver("univers", (await params).slug);
  if (!r) notFound();
  if (UNIVERS_FRERES.includes(r.slug as UniversSlug)) return <PasserelleFrere rubrique={r} cle={r.slug as keyof typeof SITES_FRERES} />;
  return <RubriquePage famille="univers" rubrique={r} />;
}

/** Univers « livres » et « cuisine » : renvoi vers Keurbook ou Keur Cook, avec nos quelques idées du catalogue. */
function PasserelleFrere({ rubrique, cle }: { rubrique: Rubrique; cle: keyof typeof SITES_FRERES }) {
  const site = SITES_FRERES[cle];
  const produits = produitsDe("univers", rubrique.slug).map(toCarte);
  const ld = breadcrumbLd([
    { name: "Accueil", url: "/" },
    { name: rubrique.titre, url: `/univers/${rubrique.slug}` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Par univers" }, { name: rubrique.nom }]} />
      <PageHeader eyebrow="Par univers" title={rubrique.titre} intro={rubrique.intro} />
      <section className="container-page">
        <a href={site.url} className="carte-cadeau block rounded-[60px_60px_60px_10px] border-[1.5px] border-ink bg-ink p-7 text-creme shadow-[inset_0_0_0_5px_var(--color-ink),inset_0_0_0_6px_rgba(232,184,106,0.45),8px_8px_0_var(--color-ombre)] hover:text-creme sm:p-12">
          <p className="text-[13px] font-semibold tracking-[0.12em] text-or uppercase">Notre site frère</p>
          <p className="mt-2 font-serif text-[34px] leading-none font-semibold sm:text-5xl">{site.nom}</p>
          <p className="mt-3 max-w-xl text-[17px] text-white/85">{site.accroche}</p>
          <div className="mt-4 max-w-2xl space-y-3 text-[16px] text-white/85">
            {rubrique.texte.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <span className="btn mt-6 border-or bg-or text-ink">Aller sur {site.nom} →</span>
        </a>
      </section>
      {produits.length > 0 && (
        <Section title="Quelques idées à offrir">
          <MentionAffiliation />
          <ProduitGrid produits={produits} />
        </Section>
      )}
      {GUIDES_FRERES[rubrique.slug] && <GuideTexte title={`Bien choisir : ${rubrique.nom.toLowerCase()}`} guide={GUIDES_FRERES[rubrique.slug]} />}
      <section className="container-page mt-16">
        <Chips famille="univers" actif={rubrique.slug} titre="Tous les univers" />
      </section>
    </>
  );
}
