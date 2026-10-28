import Link from "next/link";
import { withBase } from "@/lib/config";
import type { Top } from "@/lib/types";

/** Carte d'un Top 10 : l'épingle Pinterest (format 2:3) dans une bulle crème en arche, et le titre. */
export function TopCard({ top }: { top: Top }) {
  return (
    <Link href={`/top/${top.slug}`} className="carte-cadeau bulle group flex h-full flex-col overflow-hidden rounded-[120px_120px_24px_24px/80px_80px_24px_24px] p-2.5 hover:text-ink">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={withBase(`/epingles/vignettes/${top.slug}.webp`)} alt={`Épingle : ${top.titre}`} width={400} height={600} loading="lazy" className="aspect-[2/3] w-full rounded-[110px_110px_16px_16px/72px_72px_16px_16px] object-cover" />
      <span className="px-2 pt-3 pb-2 text-center font-serif text-[20px] leading-tight font-semibold group-hover:text-terre-texte">{top.titre}</span>
    </Link>
  );
}

export function TopGrid({ tops }: { tops: Top[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {tops.map((t) => (
        <li key={t.slug}>
          <TopCard top={t} />
        </li>
      ))}
    </ul>
  );
}
