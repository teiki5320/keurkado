import type { Metadata } from "next";
import Link from "next/link";
import { Compteur } from "@/components/calendrier/Compteur";
import { ConseilGrid } from "@/components/conseils/ConseilCard";
import { EntryText, Section } from "@/components/layout/Section";
import { styleUnivers } from "@/components/produit/ProduitCard";
import { TopGrid } from "@/components/produit/TopCard";
import { fetesAVenir } from "@/lib/calendrier";
import { siteConfig } from "@/lib/config";
import { todayInParis } from "@/lib/conseils/article";
import { getConseils } from "@/lib/data/conseils";
import { comptes } from "@/lib/data/produits";
import { formatDate } from "@/lib/format";
import { jsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { BUDGETS, DESTINATAIRES, OCCASIONS, SITES_FRERES, UNIVERS, UNIVERS_FRERES } from "@/lib/taxonomie";
import { TOPS } from "@/lib/tops";

export const metadata: Metadata = pageMetadata({
  title: `${siteConfig.name} — Idées cadeaux africains pour toutes les occasions`,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

/** Couleurs des tuiles d'occasion, dans l'ordre (alternance des couleurs du wax). */
const TUILES = ["bg-orange text-white", "bg-vert text-white", "bg-indigo text-white", "bg-fuchsia text-white", "bg-soleil text-ink"];

export default function HomePage() {
  const prochaines = fetesAVenir(todayInParis()).slice(0, 3);
  const prochaine = prochaines[0];
  const nbOccasion = comptes("occasion");
  const conseils = getConseils().slice(0, 3);
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "fr",
    publisher: { "@type": "Organization", name: "TOA KEUR", url: "https://toakeur.com" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />

      {/* 1. Accroche + quiz */}
      <section className="wax-bg">
        <div className="container-page py-8 sm:py-14">
          <div className="max-w-3xl rounded-3xl bg-paper p-6 shadow-xl sm:p-10">
            <p className="eyebrow">Idées cadeaux africains</p>
            <h1 className="mt-3 font-serif text-[40px] leading-[1.02] font-semibold text-balance sm:text-7xl">
              Le cadeau qui fait plaisir, avec un peu de <span className="text-orange">chez nous</span>
            </h1>
            <p className="mt-4 max-w-xl text-[18px] leading-relaxed text-muted">
              Tabaski, Korité, Noël, mariage, baptême : des idées cadeaux en wax, bijoux, beauté afro et déco, pour la famille ici et au pays.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/quiz" className="btn-primary py-4 text-[17px]">
                Trouve le cadeau en 3 questions
              </Link>
              <Link href="/top" className="btn-secondary py-4">
                Voir nos Top 10
              </Link>
            </div>
            {prochaine && (
              <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-4 text-[15px]">
                <span className="font-semibold">Prochaine fête :</span>
                <Link href={prochaine.lien?.href ?? "/calendrier"} className="font-semibold text-orange underline underline-offset-2 hover:text-ink">
                  {prochaine.nom}
                </Link>
                <span className="text-muted">
                  le {formatDate(prochaine.date)}
                  {prochaine.estimee && " (date estimée)"}
                </span>
                <Compteur date={prochaine.date} className="rounded-full bg-vert-soft px-2.5 py-0.5 text-sm font-semibold text-vert" />
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Par occasion */}
      <Section title="Par occasion" id="occasions">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {OCCASIONS.map((o, i) => (
            <li key={o.slug}>
              <Link href={`/occasion/${o.slug}`} className={`carte-cadeau flex h-28 flex-col justify-between rounded-2xl p-4 sm:h-36 ${TUILES[i % TUILES.length]}`}>
                <span className="font-serif text-[21px] leading-none font-semibold break-words hyphens-auto sm:text-3xl">{o.nom}</span>
                <span className="text-sm opacity-90">{nbOccasion.get(o.slug)} idées →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3. Top 10 */}
      {TOPS.length > 0 && (
        <Section title="Nos Top 10" href="/top" linkLabel="Tous les Top 10">
          <TopGrid tops={TOPS.slice(0, 8)} />
        </Section>
      )}

      {/* 4. Pour qui ? */}
      <Section title="Pour qui ?" id="pour">
        <ul className="flex flex-wrap gap-2.5">
          {DESTINATAIRES.map((d) => (
            <li key={d.slug}>
              <Link href={`/pour/${d.slug}`} className="tag px-5 py-3 text-[17px] font-semibold">
                {d.nom}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 5. Par budget */}
      <Section title="Par budget" id="budget">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BUDGETS.map((b) => (
            <li key={b.slug}>
              <Link href={`/budget/${b.slug}`} className="carte-cadeau flex h-full flex-col rounded-2xl border-2 border-soleil bg-soleil-soft p-4">
                <span className="font-serif text-[24px] leading-none font-semibold">{b.nom}</span>
                <span className="mt-2 text-sm text-muted">{b.intro.split(":")[0]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 6. Univers */}
      <Section title="Par univers" id="univers">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {UNIVERS.map((u) => {
            const s = styleUnivers(u.slug);
            const Icone = s.icone;
            const frere = UNIVERS_FRERES.includes(u.slug) ? SITES_FRERES[u.slug as keyof typeof SITES_FRERES] : null;
            return (
              <li key={u.slug}>
                <Link href={`/univers/${u.slug}`} className={`carte-cadeau flex h-full items-center gap-3 rounded-2xl p-4 ${s.fond}`}>
                  <Icone aria-hidden className={`size-7 shrink-0 ${s.texte}`} />
                  <span>
                    <span className="block font-serif text-[19px] leading-tight font-semibold">{u.nom}</span>
                    {frere && <span className="text-[13px] text-muted">avec {frere.nom}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* 7. Envoyer au pays */}
      <section className="container-page mt-16">
        <Link href="/envoyer-au-pays" className="carte-cadeau flex flex-col gap-4 rounded-3xl bg-vert p-6 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.12em] text-soleil uppercase">Colis et valises</p>
            <p className="mt-2 font-serif text-[30px] leading-tight font-semibold sm:text-5xl">Cadeaux à envoyer au pays</p>
            <p className="mt-2 max-w-xl text-[17px] text-white/85">Légers, solides, sans liquide : les cadeaux qui arrivent entiers chez la famille.</p>
          </div>
          <span className="btn shrink-0 bg-soleil text-ink sm:ml-auto">Voir les idées →</span>
        </Link>
      </section>

      {/* 8. Calendrier */}
      {prochaines.length > 0 && (
        <Section title="Les prochaines fêtes" href="/calendrier" linkLabel="Tout le calendrier">
          <ul className="grid gap-3 md:grid-cols-3">
            {prochaines.map((f) => (
              <li key={f.slug} className="rounded-2xl border border-line bg-white p-4">
                <p className="text-sm font-semibold text-orange">
                  {formatDate(f.date)}
                  {f.estimee && " · estimée"}
                </p>
                <p className="mt-1 font-serif text-xl font-semibold">{f.nom}</p>
                {f.lien && (
                  <Link href={f.lien.href} className="mt-2 inline-block text-[15px] font-semibold text-orange hover:text-ink">
                    {f.lien.label} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 9. Conseils */}
      {conseils.length > 0 && (
        <Section title="Conseils" href="/conseils" linkLabel="Tous les conseils">
          <ConseilGrid conseils={conseils} />
        </Section>
      )}

      <EntryText title="Keur Kado, la maison des cadeaux">
        <p>
          « Keur » veut dire « maison » en wolof : Keur Kado, c&apos;est la maison des cadeaux africains. Nous y réunissons des idées pour toutes les
          occasions de la vie, de la <Link href="/occasion/tabaski">Tabaski</Link> au <Link href="/occasion/bapteme">baptême</Link>, pour faire plaisir à la
          famille en France comme au pays.
        </p>
        <p>
          Nous ne vendons rien nous-mêmes : chaque idée renvoie vers Amazon.fr, où vous pouvez comparer les modèles et les prix. Nos sélections sont choisies
          pour leur intérêt, pas pour leur commission. Pour les livres, rendez-vous sur <a href="https://keurbook.com">Keurbook</a> ; pour la cuisine, sur{" "}
          <a href="https://keurcook.com">Keur Cook</a>.
        </p>
      </EntryText>
    </>
  );
}
