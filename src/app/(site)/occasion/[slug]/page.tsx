import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RubriquePage } from "@/components/produit/RubriquePage";
import { pageMetadata } from "@/lib/metadata";
import { FAMILLES, trouver } from "@/lib/taxonomie";

export const dynamicParams = false;

export function generateStaticParams() {
  return FAMILLES.occasion.liste.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/occasion/[slug]">): Promise<Metadata> {
  const r = trouver("occasion", (await params).slug);
  if (!r) return {};
  return pageMetadata({ title: r.titre, description: r.description, path: `/occasion/${r.slug}`, image: `/epingles/rubriques/occasion-${r.slug}.jpg`, imageAlt: r.titre, imageSize: [1200, 630] });
}

export default async function Page({ params }: PageProps<"/occasion/[slug]">) {
  const r = trouver("occasion", (await params).slug);
  if (!r) notFound();
  return <RubriquePage famille="occasion" rubrique={r} />;
}
