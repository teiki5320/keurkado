import Link from "next/link";
import type { Conseil } from "@/lib/conseils/article";
import { CONSEIL_CATEGORIES } from "@/lib/conseils/categories";
import { formatDate } from "@/lib/format";

export function ConseilCard({ conseil }: { conseil: Conseil }) {
  return (
    <article className="h-full">
      <Link href={`/conseils/${conseil.slug}`} className="carte-cadeau group flex h-full flex-col rounded-2xl border border-line bg-white p-5">
        <span className="eyebrow">
          {CONSEIL_CATEGORIES[conseil.theme]} <span className="font-normal text-muted normal-case">· {formatDate(conseil.date)}</span>
        </span>
        <span className="mt-2 font-serif text-[22px] leading-tight font-semibold group-hover:text-orange">{conseil.title}</span>
        <span className="mt-2 line-clamp-3 text-[15px] text-muted">{conseil.resume}</span>
        <span aria-hidden className="mt-auto pt-3 font-semibold text-orange">Lire →</span>
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
