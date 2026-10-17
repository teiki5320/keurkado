import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { Breadcrumb, Section } from "@/components/layout/Section";
import { ProduitCard } from "@/components/produit/ProduitCard";
import { TopGrid } from "@/components/produit/TopCard";
import { siteConfig, withBase } from "@/lib/config";
import { getProduit, toCarte } from "@/lib/data/produits";
import { formatDate } from "@/lib/format";
import { breadcrumbLd, jsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { getTop, TOPS } from "@/lib/tops";
import { rubriqueDuTop } from "@/lib/tops/rubrique";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOPS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/top/[slug]">): Promise<Metadata> {
  const top = getTop((await params).slug);
  if (!top) return {};
  return pageMetadata({
    title: top.titre,
    description: top.description,
    path: `/top/${top.slug}`,
    type: "article",
    publishedTime: top.date,
    image: `/epingles/${top.slug}.jpg`,
    imageAlt: `Épingle : ${top.titre}`,
  });
}

export default async function TopPage({ params }: PageProps<"/top/[slug]">) {
  const top = getTop((await params).slug);
  if (!top) notFound();
  const rubrique = rubriqueDuTop(top.rubrique);
  const items = top.items.flatMap((it) => {
    const p = getProduit(it.produit);
    return p ? [{ carte: toCarte(p), pourquoi: it.pourquoi }] : [];
  });
  const url = `${siteConfig.url}/top/${top.slug}`;
  const image = `${siteConfig.url}/epingles/${top.slug}.jpg`;
  const pinterest = `https://www.pinterest.fr/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(`${top.titre} — ${top.description}`)}`;
  const autres = TOPS.filter((t) => t.slug !== top.slug).slice(0, 4);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: top.titre,
      description: top.description,
      datePublished: top.date,
      dateModified: top.date,
      inLanguage: "fr",
      image,
      url,
      author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: top.titre,
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.carte.nom })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: top.faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.reponse } })),
    },
    breadcrumbLd([
      { name: "Accueil", url: siteConfig.url },
      { name: "Top 10", url: `${siteConfig.url}/top` },
      { name: top.titre, url },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Top 10", href: "/top" }, { name: top.titre }]} />

      <article>
        <header className="container-page grid gap-8 pt-6 md:grid-cols-[1fr_260px] md:items-start">
          <div>
            <p className="eyebrow">Top 10{rubrique ? ` · ${rubrique.nom}` : ""}</p>
            <h1 className="mt-3 font-serif text-[36px] leading-[1.05] font-semibold text-balance sm:text-6xl">{top.titre}</h1>
            <p className="mt-3 text-sm text-muted">
              Mis à jour le <time dateTime={top.date}>{formatDate(top.date)}</time>
            </p>
            <p className="mt-5 max-w-2xl border-l-4 border-soleil pl-4 text-[18px] leading-relaxed">{top.intro}</p>
            <nav aria-label="Les 10 cadeaux" className="mt-6 max-w-2xl">
              <ol className="grid gap-x-6 gap-y-1 text-[15px] sm:grid-cols-2">
                {items.map((it, i) => (
                  <li key={it.carte.slug}>
                    <a href={`#cadeau-${i + 1}`} className="flex gap-2 py-1 hover:text-orange">
                      <span className="font-semibold text-orange">{i + 1}.</span> {it.carte.nom}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <figure className="mx-auto w-48 md:w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBase(`/epingles/${top.slug}.jpg`)} alt={`Épingle Pinterest : ${top.titre}`} width={1000} height={1500} className="aspect-[2/3] w-full rounded-2xl shadow-xl" />
            <a href={pinterest} target="_blank" rel="noopener noreferrer" className="btn mt-3 w-full bg-[#bd081c] py-2.5 text-sm text-white hover:bg-ink">
              Épingler sur Pinterest
            </a>
          </figure>
        </header>

        {[items.slice(0, 5), items.slice(5)].map((moitie, m) => (
          <Fragment key={m}>
            {/* Publicité : entre le 5e et le 6e cadeau. */}
            {m === 1 && (
              <div className="container-page">
                <AdSlot placement="top" />
              </div>
            )}
            <ol start={m * 5 + 1} className="container-page mt-10 grid gap-5 md:grid-cols-2">
              {moitie.map((it, j) => {
                const rang = m * 5 + j + 1;
                return (
                  <li key={it.carte.slug} id={`cadeau-${rang}`} className="scroll-mt-24">
                    <ProduitCard produit={it.carte} rang={rang}>
                      <p className="mt-3 rounded-xl bg-paper p-3 text-[15px] leading-relaxed">
                        <strong className="font-semibold">Pourquoi on l&apos;aime : </strong>
                        {it.pourquoi}
                      </p>
                    </ProduitCard>
                  </li>
                );
              })}
            </ol>
          </Fragment>
        ))}

        <section className="container-page mt-14 max-w-3xl">
          <h2 className="section-title">Nos conseils pour bien choisir</h2>
          <div className="prose-text mt-4">
            {top.conseils.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <section className="container-page mt-12 max-w-3xl">
          <h2 className="section-title">Questions fréquentes</h2>
          <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
            {top.faq.map((f) => (
              <details key={f.question} className="group p-4">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  <span className="mr-2 inline-block text-orange transition group-open:rotate-45">+</span>
                  {f.question}
                </summary>
                <p className="mt-2 text-[16px] leading-relaxed text-muted">{f.reponse}</p>
              </details>
            ))}
          </div>
        </section>
      </article>

      <section className="container-page mt-12 flex flex-col gap-3 sm:flex-row">
        <Link href="/quiz" className="btn-primary">
          Trouver un autre cadeau avec le quiz
        </Link>
        {rubrique && (
          <Link href={rubrique.href} className="btn-secondary">
            Toutes les idées : {rubrique.nom}
          </Link>
        )}
      </section>

      {autres.length > 0 && (
        <Section title="Autres sélections" href="/top" linkLabel="Tous les Top 10">
          <TopGrid tops={autres} />
        </Section>
      )}

      {/* Publicité : en fin de page, loin des boutons Amazon. */}
      <div className="container-page">
        <AdSlot placement="top" />
      </div>
    </>
  );
}
