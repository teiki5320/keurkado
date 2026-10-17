import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { Breadcrumb, EntryText, PageHeader, Section } from "@/components/layout/Section";
import { ProduitGrid } from "@/components/produit/ProduitCard";
import { siteConfig } from "@/lib/config";
import { produitsVoyage, toCarte } from "@/lib/data/produits";
import { breadcrumbLd, jsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { UNIVERS } from "@/lib/taxonomie";

export const metadata: Metadata = pageMetadata({
  title: "Cadeaux à envoyer au pays : ceux qui voyagent bien",
  description: "Idées cadeaux à envoyer en Afrique par colis ou dans la valise : légers, solides et non périssables. Bijoux, tissus, savons, jouets, livres.",
  path: "/envoyer-au-pays",
});

/** Règles simples pour un colis qui arrive entier, affichées en haut de page. */
const REGLES = [
  { titre: "Léger", texte: "Le prix d'un colis dépend du poids : bijoux, tissus, foulards et livres coûtent peu à envoyer." },
  { titre: "Solide", texte: "Pas de verre ni de céramique fragile : un colis passe par de nombreuses mains." },
  { titre: "Sans liquide", texte: "Parfums et huiles fuient ou sont refusés : préférez les beurres, savons et soins solides." },
  { titre: "Non périssable", texte: "Les délais varient de quelques jours à plusieurs semaines : évitez tout ce qui s'abîme." },
];

export default function EnvoyerPage() {
  const produits = produitsVoyage().map(toCarte);
  const parUnivers = UNIVERS.map((u) => ({ u, liste: produits.filter((p) => p.univers === u.slug) })).filter((g) => g.liste.length > 0);
  const ld = breadcrumbLd([
    { name: "Accueil", url: siteConfig.url },
    { name: "Cadeaux à envoyer au pays", url: `${siteConfig.url}/envoyer-au-pays` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Cadeaux à envoyer au pays" }]} />
      <PageHeader
        eyebrow="Colis et valises"
        title="Cadeaux à envoyer au pays"
        intro="Faire plaisir à la famille restée au pays, c'est choisir des cadeaux qui arrivent entiers et ne coûtent pas une fortune en frais d'envoi. Voici ceux qui voyagent bien."
      >
        <Link href="/quiz?voyage=1" className="btn-primary mt-6">
          Trouver un cadeau à envoyer avec le quiz
        </Link>
      </PageHeader>

      <section className="container-page">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {REGLES.map((r) => (
            <li key={r.titre} className="rounded-2xl bg-vert-soft p-4">
              <p className="font-serif text-xl font-semibold text-vert">{r.titre}</p>
              <p className="mt-1 text-[15px] leading-snug">{r.texte}</p>
            </li>
          ))}
        </ul>
      </section>

      {parUnivers.map(({ u, liste }, i) => (
        <div key={u.slug}>
          <Section title={u.nom} href={`/univers/${u.slug}`} linkLabel="Tout l'univers">
            <ProduitGrid produits={liste} />
          </Section>
          {i === 1 && (
            <div className="container-page">
              <AdSlot placement="rubrique" />
            </div>
          )}
        </div>
      ))}

      <EntryText title="Bien préparer son colis">
        <p>
          Avant d&apos;envoyer, renseignez-vous sur les objets interdits et les droits de douane du pays de destination : chaque pays a ses règles. Notre
          guide <Link href="/conseils/envoyer-colis-afrique">Envoyer un colis en Afrique</Link> fait le point sur ce qui passe et ce qui ne passe pas.
        </p>
        <p>
          Vous rentrez bientôt ? Découvrez aussi <Link href="/conseils/que-rapporter-au-pays">que rapporter à la famille quand on rentre au pays</Link>,
          et notez les dates à ne pas manquer dans notre <Link href="/calendrier">calendrier des fêtes</Link>.
        </p>
      </EntryText>
    </>
  );
}
