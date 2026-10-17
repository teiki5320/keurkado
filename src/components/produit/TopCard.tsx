import Link from "next/link";
import { withBase } from "@/lib/config";
import type { Top } from "@/lib/types";

/** Carte d'un Top 10 : vignette de l'épingle Pinterest (format 2:3) et titre. */
export function TopCard({ top }: { top: Top }) {
  return (
    <Link href={`/top/${top.slug}`} className="carte-cadeau group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={withBase(`/epingles/${top.slug}.jpg`)} alt="" width={500} height={750} loading="lazy" className="aspect-[2/3] w-full object-cover" />
      <span className="p-4 font-serif text-[19px] leading-tight font-semibold group-hover:text-orange">{top.titre}</span>
    </Link>
  );
}

export function TopGrid({ tops }: { tops: Top[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {tops.map((t) => (
        <li key={t.slug}>
          <TopCard top={t} />
        </li>
      ))}
    </ul>
  );
}
