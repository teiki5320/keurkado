import type { Metadata } from "next";
import Link from "next/link";
import { Compteur } from "@/components/calendrier/Compteur";
import { ConseilGrid } from "@/components/conseils/ConseilCard";
import { EntryText, Section } from "@/components/layout/Section";
import { essence, IconeUnivers } from "@/components/produit/ProduitCard";
import { TopGrid } from "@/components/produit/TopCard";
import { Atelier } from "@/components/quiz/Atelier";
import { fetesAVenir } from "@/lib/calendrier";
import { siteConfig } from "@/lib/config";
import { todayInParis } from "@/lib/conseils/article";
import { donneesAtelier } from "@/lib/data/atelier";
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

/** Formes des bulles : la queue de la bulle change de coin, comme dans une conversation. */
const COINS = ["rounded-[40px_40px_40px_6px]", "rounded-[40px_40px_6px_40px]", "rounded-[6px_40px_40px_40px]", "rounded-[40px_6px_40px_40px]"];

export default function HomePage() {
  const prochaines = fetesAVenir(todayInParis()).slice(0, 3);
  const prochaine = prochaines[0];
  const nbOccasion = comptes("occasion");
  const conseils = getConseils().slice(0, 3);
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: "fr",
      publisher: { "@type": "Organization", name: "TOA KEUR", url: "https://toakeur.com" },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/brand/keurkado-logo.png`,
      parentOrganization: { "@type": "Organization", name: "TOA KEUR", url: "https://toakeur.com" },
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />

      {/* 1. Accroche + l'atelier de Tonton Kado (le quiz en conversation) */}
      <section className="container-page max-w-4xl pt-8 sm:pt-12">
        <p className="eyebrow text-center">Idées cadeaux africains</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-center font-serif text-[42px] leading-[1.02] font-semibold text-balance sm:text-7xl">
          Le cadeau qui fait plaisir, avec un peu de <em className="text-terre-texte">chez nous</em>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-[17px] leading-relaxed text-muted">
          Tabaski, Korité, Noël, mariage, baptême : demandez à Tonton Kado, il enfile pour vous les idées qui conviennent, ici et au pays.
        </p>
        {prochaine && (
          <p className="mx-auto mt-5 flex w-fit max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-ink/25 bg-creme/70 px-4 py-2 text-center text-[14px]">
            <span className="font-bold">Prochaine fête :</span>
            <Link href={prochaine.lien?.href ?? "/calendrier"} className="font-bold text-terre-texte underline underline-offset-2 hover:text-ink">
              {prochaine.nom}
            </Link>
            <span className="text-muted">
              le {formatDate(prochaine.date)}
              {prochaine.estimee && " (estimée)"}
            </span>
            <Compteur date={prochaine.date} className="font-bold text-bois-fonce" />
          </p>
        )}
        <div className="mt-8">
          <Atelier {...donneesAtelier()} mode="accueil" />
        </div>
      </section>

      {/* 2. Par occasion */}
      <Section title="Par occasion" id="occasions">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {OCCASIONS.map((o, i) => (
            <li key={o.slug}>
              <Link
                href={`/occasion/${o.slug}`}
                className={`carte-cadeau flex h-28 flex-col justify-between border-[1.5px] border-ink p-4 sm:h-32 ${COINS[i % COINS.length]} ${i % 3 === 1 ? "bg-ink text-creme shadow-[5px_6px_0_var(--color-ombre)] hover:text-creme" : "bulle hover:text-ink"}`}
              >
                <span className="font-serif text-[25px] leading-none font-semibold hyphens-auto sm:text-[30px]">{o.nom}</span>
                <span className={`text-[13px] font-bold ${i % 3 === 1 ? "text-or" : "text-terre-texte"}`}>{nbOccasion.get(o.slug)} idées →</span>
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
        <ul className="flex flex-wrap gap-3">
          {DESTINATAIRES.map((d) => (
            <li key={d.slug}>
              <Link href={`/pour/${d.slug}`} className="tag px-6 py-3 text-[16px]">
                {d.nom}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 5. Par budget */}
      <Section title="Par budget" id="budget">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BUDGETS.map((b, i) => (
            <li key={b.slug}>
              <Link href={`/budget/${b.slug}`} className={`carte-cadeau bulle flex h-full flex-col p-5 hover:text-ink ${COINS[(i + 1) % COINS.length]}`}>
                <span className="font-serif text-[26px] leading-none font-bold text-terre-texte">{b.nom}</span>
                <span className="mt-2 text-[14px] text-muted">{b.intro.split(":")[0]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 6. Univers : une perle par univers, enfilées sur le cordon. */}
      <Section title="Par univers" id="univers">
        <div className="relative">
          <span aria-hidden className="cordon absolute inset-x-0 top-[42px] hidden lg:block" />
          <ul className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
            {UNIVERS.map((u, i) => {
              const frere = UNIVERS_FRERES.includes(u.slug) ? SITES_FRERES[u.slug as keyof typeof SITES_FRERES] : null;
              return (
                <li key={u.slug}>
                  <Link href={`/univers/${u.slug}`} className="carte-cadeau group flex flex-col items-center text-center hover:text-ink">
                    <span className={`perle ${essence(i)} grid size-[84px] place-items-center border-[8px]`}>
                      <IconeUnivers slug={u.slug} aria-hidden className="size-8 text-bois-fonce" strokeWidth={1.6} />
                    </span>
                    <span className="mt-3 font-serif text-[20px] leading-tight font-semibold group-hover:text-terre-texte">{u.nom}</span>
                    {frere && <span className="font-serif text-[14px] text-faint italic">avec {frere.nom}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* 7. Envoyer au pays */}
      <section className="container-page mt-20">
        <Link
          href="/envoyer-au-pays"
          className="carte-cadeau flex flex-col gap-5 rounded-[60px_60px_60px_10px] border-[1.5px] border-ink bg-ink p-7 text-creme shadow-[inset_0_0_0_5px_var(--color-ink),inset_0_0_0_6px_rgba(232,184,106,0.45),8px_8px_0_var(--color-ombre)] hover:text-creme sm:flex-row sm:items-center sm:p-12"
        >
          <div>
            <p className="text-[12px] font-bold tracking-[0.16em] text-or uppercase">Colis et valises</p>
            <p className="mt-2 font-serif text-[36px] leading-tight font-semibold sm:text-5xl">Cadeaux à envoyer au pays</p>
            <p className="mt-2 max-w-xl text-[16px] text-creme/85">Légers, solides, sans liquide : les cadeaux qui arrivent entiers chez la famille.</p>
          </div>
          <span className="btn shrink-0 border-or bg-or text-ink sm:ml-auto">Voir les idées →</span>
        </Link>
      </section>

      {/* 8. Calendrier */}
      {prochaines.length > 0 && (
        <Section title="Les prochaines fêtes" href="/calendrier" linkLabel="Tout le calendrier">
          <ul className="grid gap-4 md:grid-cols-3">
            {prochaines.map((f, i) => (
              <li key={f.slug} className={`bulle p-5 ${COINS[i % COINS.length]}`}>
                <p className="text-[13px] font-bold text-terre-texte">
                  {formatDate(f.date)}
                  {f.estimee && " · estimée"}
                </p>
                <p className="mt-1 font-serif text-[24px] leading-tight font-semibold">{f.nom}</p>
                {f.lien && (
                  <Link href={f.lien.href} className="mt-2 inline-block text-[14px] font-bold text-terre-texte hover:text-ink">
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
