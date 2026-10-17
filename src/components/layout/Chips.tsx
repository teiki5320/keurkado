import Link from "next/link";
import { FAMILLES, type Famille } from "@/lib/taxonomie";

/** Pastilles de toutes les rubriques d'une famille (la rubrique courante est mise en avant). */
export function Chips({ famille, actif, titre }: { famille: Famille; actif?: string; titre?: string }) {
  const f = FAMILLES[famille];
  return (
    <nav aria-label={titre ?? f.nom}>
      {titre && <p className="eyebrow mb-3">{titre}</p>}
      <ul className="flex flex-wrap gap-2">
        {f.liste.map((r) => (
          <li key={r.slug}>
            <Link
              href={`${f.chemin}/${r.slug}`}
              aria-current={r.slug === actif ? "page" : undefined}
              className={r.slug === actif ? "tag border-orange bg-orange text-white hover:text-white" : "tag"}
            >
              {r.nom}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
