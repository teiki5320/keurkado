import Link from "next/link";

export function Section({ title, href, linkLabel = "Tout voir", children, id }: { title: string; href?: string; linkLabel?: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="container-page mt-16">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="section-title">{title}</h2>
        {href && (
          <Link href={href} className="text-[14px] font-semibold whitespace-nowrap text-orange hover:text-ink">
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
      <h1 className="font-serif text-[38px] leading-[1.05] font-semibold text-balance sm:text-6xl">{title}</h1>
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
              <span aria-current="page" className="line-clamp-1 text-muted">
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
export function EntryText({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="container-page mt-20 max-w-3xl">
      <h2 className="section-title">{title}</h2>
      <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-muted [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:decoration-line-strong [&_a]:underline-offset-4 [&_a:hover]:text-orange">
        {children}
      </div>
    </section>
  );
}
