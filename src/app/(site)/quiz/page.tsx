import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/Section";
import { Atelier } from "@/components/quiz/Atelier";
import { siteConfig } from "@/lib/config";
import { donneesAtelier } from "@/lib/data/atelier";
import { breadcrumbLd, jsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Trouve le cadeau : le quiz des idées cadeaux africains",
  description: "Trois questions à Tonton Kado (pour qui, quelle occasion, quel budget) et il vous propose des idées cadeaux africains : wax, bijoux, beauté afro, déco, jeux.",
  path: "/quiz",
});

export default function QuizPage() {
  const ld = breadcrumbLd([
    { name: "Accueil", url: siteConfig.url },
    { name: "Trouve le cadeau", url: `${siteConfig.url}/quiz` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <PageHeader
        eyebrow="Trouve le cadeau"
        title="L'atelier de Tonton Kado"
        intro="Trois questions, et Tonton Kado enfile pour vous les cadeaux qui conviennent. Touchez une perle pour savoir pourquoi il l'a choisie."
      />
      <section className="container-page max-w-4xl">
        <Atelier {...donneesAtelier()} mode="quiz" />
      </section>
    </>
  );
}
