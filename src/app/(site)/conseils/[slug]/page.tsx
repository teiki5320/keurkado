import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { ConseilGrid } from "@/components/conseils/ConseilCard";
import { Section } from "@/components/layout/Section";
import { MentionAffiliation, ProduitGrid } from "@/components/produit/ProduitCard";
import { conseilSections, splitAtMiddleSection } from "@/lib/conseils/article";
import { CONSEIL_CATEGORIES } from "@/lib/conseils/categories";
import { siteConfig, withBase } from "@/lib/config";
import { getConseilBySlug, getConseils, getRelatedConseils, renderConseil } from "@/lib/data/conseils";
import { getProduit, toCarte } from "@/lib/data/produits";
import { formatDate } from "@/lib/format";
import { breadcrumbLd, jsonLd, organisationLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

/** Image propre d'un article : celle de son en-tête, sinon celle générée par scripts/epingles.mts, sinon l'image du site. */
function imageDuConseil(conseil: { slug: string; image?: string | null }): string {
  if (conseil.image) return conseil.image;
  const generee = `/epingles/conseils/${conseil.slug}.jpg`;
  return existsSync(join(process.cwd(), "public", generee)) ? generee : "/brand/keurkado-partage.jpg";
}

export function generateStaticParams() {
  return getConseils().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/conseils/[slug]">): Promise<Metadata> {
  const conseil = getConseilBySlug((await params).slug);
  if (!conseil) return {};
  return pageMetadata({
    title: conseil.title,
    description: conseil.description,
    path: `/conseils/${conseil.slug}`,
    type: "article",
    publishedTime: conseil.date,
    image: imageDuConseil(conseil),
    imageAlt: `Illustration : ${conseil.title}`,
    imageSize: conseil.image ? undefined : [1200, 630],
  });
}

export default async function ConseilPage({ params }: PageProps<"/conseils/[slug]">) {
  const conseil = getConseilBySlug((await params).slug);
  if (!conseil) notFound();
  const cites = conseil.produits.flatMap((s) => {
    const p = getProduit(s);
    return p ? [toCarte(p)] : [];
  });
  const related = getRelatedConseils(conseil);
  const sections = conseilSections(conseil.body);
  const [firstHalf, secondHalf] = splitAtMiddleSection(renderConseil(conseil.body));
  const url = `${siteConfig.url}/conseils/${conseil.slug}/`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: conseil.title,
      description: conseil.description,
      datePublished: conseil.date,
      dateModified: conseil.date,
      inLanguage: "fr",
      image: `${siteConfig.url}${imageDuConseil(conseil)}`,
      author: organisationLd(),
      url,
      publisher: organisationLd(),
    },
    breadcrumbLd([
      { name: "Accueil", url: siteConfig.url },
      { name: "Conseils", url: `${siteConfig.url}/conseils` },
      { name: conseil.title, url },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <article className="container-page max-w-3xl">
        <div className="flex justify-between pt-5 text-[14px]">
          <Link href="/conseils" className="font-semibold text-ink/85 hover:text-terre-texte">
            ← Conseils
          </Link>
          <time dateTime={conseil.date} className="text-muted">
            {formatDate(conseil.date)}
          </time>
        </div>
        <p className="eyebrow mt-8">
          <Link href={`/conseils#${conseil.theme}`} className="hover:text-ink">
            {CONSEIL_CATEGORIES[conseil.theme]}
          </Link>
        </p>
        <h1 className="mt-3 font-serif text-[36px] leading-[1.05] font-semibold text-balance sm:text-6xl">{conseil.title}</h1>
        {conseil.image && (
          <figure className="mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBase(conseil.image)} alt={`Illustration de l'article « ${conseil.title} »`} width={1200} height={800} fetchPriority="high" className="aspect-[3/2] w-full rounded-2xl object-cover" />
          </figure>
        )}
        <p className="bulle mt-8 rounded-[40px_40px_40px_8px] px-7 py-5 font-serif text-[20px] leading-relaxed font-medium">
          <strong className="font-semibold">En bref : </strong>
          {conseil.resume}
        </p>
        {sections.length > 2 && (
          <nav aria-label="Sommaire" className="mt-8 text-[15px]">
            <p className="eyebrow">Sommaire</p>
            <ol className="mt-2 border-b border-line">
              {sections.map((s, i) => (
                <li key={s.id} className="border-t border-line">
                  <a href={`#${s.id}`} className="flex gap-3 py-2.5 hover:text-terre-texte">
                    <span className="font-semibold text-terre-texte">{i + 1}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="prose-text mt-8" dangerouslySetInnerHTML={{ __html: firstHalf }} />
        {secondHalf && (
          <>
            {/* Publicité : au milieu du texte, entre deux parties. */}
            <AdSlot placement="article" />
            <div className="prose-text" dangerouslySetInnerHTML={{ __html: secondHalf }} />
          </>
        )}
      </article>

      {cites.length > 0 && (
        <Section title="Les cadeaux de cet article">
          <MentionAffiliation />
          <ProduitGrid produits={cites} />
        </Section>
      )}

      {related.length > 0 && (
        <Section title="À lire aussi" href="/conseils" linkLabel="Tous les conseils">
          <ConseilGrid conseils={related} />
        </Section>
      )}

      {/* Publicité : en fin de page, après les articles liés (loin des boutons Amazon). */}
      <div className="container-page">
        <AdSlot placement="article" />
      </div>
    </>
  );
}
