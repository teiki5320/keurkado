import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RubriquePage } from "@/components/produit/RubriquePage";
import { pageMetadata } from "@/lib/metadata";
import { FAMILLES, trouver } from "@/lib/taxonomie";

export const dynamicParams = false;

export function generateStaticParams() {
  return FAMILLES.budget.liste.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/budget/[slug]">): Promise<Metadata> {
  const r = trouver("budget", (await params).slug);
  if (!r) return {};
  return pageMetadata({ title: r.titre, description: r.description, path: `/budget/${r.slug}` });
}

export default async function Page({ params }: PageProps<"/budget/[slug]">) {
  const r = trouver("budget", (await params).slug);
  if (!r) notFound();
  return <RubriquePage famille="budget" rubrique={r} />;
}
