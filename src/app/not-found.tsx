import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "Cette page n'existe pas ou n'est plus disponible sur Keur Kado.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className="container-page flex min-h-[70dvh] flex-col justify-center py-16">
        <p className="font-serif text-[120px] leading-[0.8] font-bold text-terre-texte sm:text-[200px]">404</p>
        <h1 className="mt-6 font-serif text-[40px] leading-none font-semibold sm:text-6xl">Ce cadeau s&apos;est perdu en route</h1>
        <p className="mt-3 max-w-md text-[17px] text-muted">Cette page n&apos;existe pas ou n&apos;est plus disponible.</p>
        <div className="mt-8 flex max-w-sm flex-col gap-2 sm:max-w-none sm:flex-row">
          <Link href="/quiz" className="btn-primary py-4">
            Trouver un cadeau
          </Link>
          <Link href="/" className="btn-secondary py-4">
            Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
