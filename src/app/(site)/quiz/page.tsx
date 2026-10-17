import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";
import { getProduits, toCarte } from "@/lib/data/produits";
import { pageMetadata } from "@/lib/metadata";
import { BUDGETS, DESTINATAIRES, OCCASIONS } from "@/lib/taxonomie";

export const metadata: Metadata = pageMetadata({
  title: "Trouve le cadeau : le quiz des idées cadeaux africains",
  description: "Trois questions (occasion, personne, budget) et nous vous proposons des idées cadeaux africains adaptées : wax, bijoux, beauté afro, déco, jeux.",
  path: "/quiz",
});

export default function QuizPage() {
  const produits = getProduits().map(toCarte);
  const options = {
    occasion: OCCASIONS.map(({ slug, nom }) => ({ slug, nom })),
    pour: DESTINATAIRES.map(({ slug, nom }) => ({ slug, nom })),
    budget: BUDGETS.map(({ slug, nom }) => ({ slug, nom })),
  };
  return (
    <>
      <section className="wax-bg">
        <div className="container-page py-8 sm:py-12">
          <div className="rounded-3xl bg-paper p-5 shadow-xl sm:p-10">
            <h1 className="font-serif text-[34px] leading-[1.05] font-semibold sm:text-6xl">
              Trouve le <span className="text-orange">cadeau</span>
            </h1>
            <p className="mt-3 max-w-xl text-[17px] text-muted">Trois questions, et nous vous proposons les cadeaux qui conviennent. Vous pouvez revenir en arrière à tout moment.</p>
            <div className="mt-8">
              <Quiz produits={produits} options={options} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
