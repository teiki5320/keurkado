import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/layout/Section";
import { TopGrid } from "@/components/produit/TopCard";
import { siteConfig } from "@/lib/config";
import { itemListLd, jsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { TOPS } from "@/lib/tops";

export const metadata: Metadata = pageMetadata({
  title: "Top 10 des idées cadeaux africains",
  description: "Nos sélections de 10 idées cadeaux africains par occasion, par personne, par budget et par univers : Tabaski, Korité, Noël, maman, wax, bijoux…",
  path: "/top",
});

export default function TopsPage() {
  const ld = itemListLd(
    "Top 10 des idées cadeaux africains",
    TOPS.map((t) => ({ name: t.titre, url: `${siteConfig.url}/top/${t.slug}` })),
  );
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <PageHeader
        eyebrow="Nos sélections"
        title="Top 10 des idées cadeaux africains"
        intro="Dix cadeaux choisis pour chaque occasion, chaque personne et chaque budget, avec nos conseils pour bien choisir. Chaque sélection a son épingle Pinterest, à garder de côté."
      />
      <Section title={`${TOPS.length} sélections`}>
        <TopGrid tops={TOPS} />
      </Section>
    </>
  );
}
