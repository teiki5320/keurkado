import Link from "next/link";
import type { Guide } from "@/lib/guides";

export function Section({ title, href, linkLabel = "Tout voir", children, id }: { title: string; href?: string; linkLabel?: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="container-page mt-16">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="section-title">{title}</h2>
        {href && (
          <Link href={href} className="text-[14px] font-semibold whitespace-nowrap text-terre-texte hover:text-ink">
            {linkLabel} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function PageHeader({ title, intro, eyebrow, children }: { title: string; intro?: string; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <header className="container-page pt-6 pb-6">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="font-serif text-[44px] leading-[1.02] font-semibold text-balance sm:text-7xl">{title}</h1>
      {intro && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">{intro}</p>}
      {children}
    </header>
  );
}

export function Breadcrumb({ items }: { items: Array<{ name: string; href?: string }> }) {
  return (
    <nav aria-label="Fil d'Ariane" className="container-page pt-5 text-[14px] text-muted">
      <ol className="flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-1.5">
            {i > 0 && <span aria-hidden>·</span>}
            {it.href ? (
              <Link href={it.href} className="hover:text-ink">
                {it.name}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined} className="line-clamp-1 text-muted">
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Texte de présentation d'une page d'entrée (en bas de page), lu par les visiteurs comme par les moteurs de recherche. */
/** Guide écrit pour une page : intertitres (h3) et paragraphes, dans le gabarit des textes de bas de page. */
export function GuideTexte({ title, guide }: { title: string; guide: Guide }) {
  return (
    <EntryText title={title}>
      {guide.parties.map((partie) => (
        <div key={partie.titre} className="space-y-4">
          <h3 className="pt-4 font-serif text-[24px] leading-tight font-semibold text-ink">{partie.titre}</h3>
          {partie.paragraphes.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ))}
    </EntryText>
  );
}

export function EntryText({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="container-page mt-20 max-w-3xl">
      <h2 className="section-title">{title}</h2>
      <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-muted [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:decoration-line-strong [&_a]:underline-offset-4 [&_a:hover]:text-terre-texte">
        {children}
      </div>
    </section>
  );
}
