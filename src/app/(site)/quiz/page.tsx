import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/Section";
import { Atelier } from "@/components/quiz/Atelier";
import { donneesAtelier } from "@/lib/data/atelier";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Trouve le cadeau : le quiz des idées cadeaux africains",
  description: "Trois questions à Tonton Kado (pour qui, quelle occasion, quel budget) et il vous propose des idées cadeaux africains : wax, bijoux, beauté afro, déco, jeux.",
  path: "/quiz",
});

export default function QuizPage() {
  return (
    <>
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
