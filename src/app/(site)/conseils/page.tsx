import type { Metadata } from "next";
import Link from "next/link";
import { ConseilGrid } from "@/components/conseils/ConseilCard";
import { PageHeader } from "@/components/layout/Section";
import { CONSEIL_CATEGORIES } from "@/lib/conseils/categories";
import { getConseils } from "@/lib/data/conseils";
import { siteConfig } from "@/lib/config";
import { itemListLd, jsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Conseils cadeaux : fêtes, traditions et colis",
  description: "Qu'offrir pour la Tabaski ou la Korité, comment choisir un wax, que mettre dans un colis pour l'Afrique : nos conseils pour bien offrir.",
  path: "/conseils",
});

export default function ConseilsPage() {
  const conseils = getConseils();
  const categories = Object.entries(CONSEIL_CATEGORIES).filter(([k]) => conseils.some((c) => c.theme === k));
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(itemListLd("Conseils cadeaux", conseils.map((c) => ({ name: c.title, url: `${siteConfig.url}/conseils/${c.slug}` })))) }}
      />
      <PageHeader eyebrow="Bien offrir" title="Conseils" intro="Les usages des fêtes, les astuces pour bien choisir et tout ce qu'il faut savoir pour envoyer un cadeau au pays.">
        <nav aria-label="Catégories" className="mt-6 flex flex-wrap gap-2">
          {categories.map(([k, name]) => (
            <Link key={k} href={`#${k}`} className="tag">
              {name}
            </Link>
          ))}
        </nav>
      </PageHeader>
      <div className="container-page space-y-12">
        {categories.map(([k, name]) => (
          <section key={k} id={k} className="scroll-mt-24">
            <h2 className="section-title mb-5">{name}</h2>
            <ConseilGrid conseils={conseils.filter((c) => c.theme === k)} />
          </section>
        ))}
      </div>
    </>
  );
}
