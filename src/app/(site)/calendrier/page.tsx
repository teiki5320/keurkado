import type { Metadata } from "next";
import Link from "next/link";
import { Compteur } from "@/components/calendrier/Compteur";
import { Breadcrumb, EntryText, PageHeader } from "@/components/layout/Section";
import { FETES, fetesAVenir } from "@/lib/calendrier";
import { siteConfig } from "@/lib/config";
import { todayInParis } from "@/lib/conseils/article";
import { formatDate } from "@/lib/format";
import { breadcrumbLd, jsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Calendrier des fêtes africaines 2026-2027",
  description: "Dates de la Korité, de la Tabaski, du Magal, du Maouloud et des fêtes nationales africaines en 2027, avec les jours où l'on offre en France.",
  path: "/calendrier",
});

const mois = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });
const moisCourt = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" });

export default function CalendrierPage() {
  // Fêtes à venir au moment de la publication ; le site est republié chaque lundi.
  const fetes = fetesAVenir(todayInParis());
  const liste = fetes.length ? fetes : FETES;
  const parMois = new Map<string, typeof liste>();
  for (const f of liste) {
    const cle = mois.format(new Date(`${f.date}T12:00:00Z`));
    parMois.set(cle, [...(parMois.get(cle) ?? []), f]);
  }
  const ld = [
    breadcrumbLd([
      { name: "Accueil", url: siteConfig.url },
      { name: "Calendrier des fêtes", url: `${siteConfig.url}/calendrier` },
    ]),
    ...liste.map((f) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: f.nom,
      startDate: f.date,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      description: f.texte,
      location: { "@type": "Place", name: "Afrique et diaspora", address: "Afrique et France" },
    })),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Calendrier des fêtes" }]} />
      <PageHeader
        eyebrow="Ne ratez plus une fête"
        title="Calendrier des fêtes africaines"
        intro="Les grandes fêtes religieuses, les fêtes nationales et les jours où l'on offre en France, pour préparer vos cadeaux (et vos colis) à temps."
      />
      <div className="container-page space-y-10">
        {[...parMois.entries()].map(([m, fs]) => (
          <section key={m} aria-labelledby={`mois-${m}`}>
            <h2 id={`mois-${m}`} className="font-serif text-2xl font-semibold capitalize">
              {m}
            </h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {fs.map((f) => (
                <li key={f.slug} className="bulle flex gap-4 rounded-[40px_40px_40px_8px] p-5">
                  <div className="perle-pleine grid size-16 shrink-0 place-content-center self-start text-center text-creme">
                    <span className="font-serif text-[26px] leading-none font-bold">{Number(f.date.slice(8, 10))}</span>
                    <span className="text-[10.5px] font-bold uppercase">{moisCourt.format(new Date(`${f.date}T12:00:00Z`))}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-[24px] leading-tight font-semibold">{f.nom}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {formatDate(f.date)}
                      {f.estimee && <span className="ml-2 rounded-full border border-bois px-2 py-0.5 text-[12px] font-semibold text-bois-fonce">date estimée</span>}
                      <Compteur date={f.date} className="ml-2 font-semibold text-bois-fonce" />
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed">{f.texte}</p>
                    {f.lien && (
                      <Link href={f.lien.href} className="mt-2 inline-block font-semibold text-terre-texte hover:text-ink">
                        {f.lien.label} →
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <EntryText title="Pourquoi certaines dates sont « estimées » ?">
        <p>
          Les fêtes musulmanes (Korité, Tabaski, Tamkharit, Magal, Maouloud) suivent le calendrier lunaire, qui compte environ onze jours de moins que
          le calendrier grégorien : elles avancent donc chaque année. Leur date exacte dépend de l&apos;observation du croissant de lune et peut varier
          d&apos;un jour selon les pays. Nous indiquons la date la plus probable et la mettons à jour dès qu&apos;elle est annoncée.
        </p>
        <p>
          Pour un colis au pays, comptez deux à quatre semaines selon le mode d&apos;envoi : nos conseils pour{" "}
          <Link href="/envoyer-au-pays">envoyer des cadeaux au pays</Link> vous aident à choisir des cadeaux qui voyagent bien.
        </p>
      </EntryText>
    </>
  );
}
