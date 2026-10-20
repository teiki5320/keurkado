import Link from "next/link";
import type { Conseil } from "@/lib/conseils/article";
import { CONSEIL_CATEGORIES } from "@/lib/conseils/categories";
import { formatDate } from "@/lib/format";

export function ConseilCard({ conseil }: { conseil: Conseil }) {
  return (
    <article className="h-full">
      <Link href={`/conseils/${conseil.slug}`} className="carte-cadeau bulle group flex h-full flex-col rounded-[40px_40px_40px_8px] p-6 hover:text-ink">
        <span className="eyebrow">
          {CONSEIL_CATEGORIES[conseil.theme]} <span className="font-normal text-muted normal-case">· {formatDate(conseil.date)}</span>
        </span>
        <span className="mt-2 font-serif text-[25px] leading-tight font-semibold group-hover:text-terre-texte">{conseil.title}</span>
        <span className="mt-2 line-clamp-3 text-[15px] text-muted">{conseil.resume}</span>
        <span aria-hidden className="mt-auto pt-3 font-bold text-terre-texte">Lire →</span>
      </Link>
    </article>
  );
}

export function ConseilGrid({ conseils }: { conseils: Conseil[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {conseils.map((c) => (
        <li key={c.slug}>
          <ConseilCard conseil={c} />
        </li>
      ))}
    </ul>
  );
}
