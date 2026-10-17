import { BookOpen, CookingPot, Gem, Palette, Plane, Puzzle, Shirt, Sparkles, type LucideIcon } from "lucide-react";
import { AMAZON_REL } from "@/lib/amazon";
import type { CarteProduit } from "@/lib/data/produits";
import { formatPrice } from "@/lib/format";

/** Couleur et pictogramme de chaque univers (étiquette en haut de la carte). */
const STYLE_UNIVERS: Record<string, { icone: LucideIcon; fond: string; texte: string }> = {
  "wax-et-mode": { icone: Shirt, fond: "bg-orange-soft", texte: "text-orange" },
  bijoux: { icone: Gem, fond: "bg-soleil-soft", texte: "text-[#8a5a00]" },
  "beaute-afro": { icone: Sparkles, fond: "bg-fuchsia-soft", texte: "text-fuchsia" },
  "art-et-deco": { icone: Palette, fond: "bg-indigo-soft", texte: "text-indigo" },
  "jeux-et-jouets": { icone: Puzzle, fond: "bg-vert-soft", texte: "text-vert" },
  livres: { icone: BookOpen, fond: "bg-indigo-soft", texte: "text-indigo" },
  cuisine: { icone: CookingPot, fond: "bg-vert-soft", texte: "text-vert" },
};

export function styleUnivers(slug: string) {
  return STYLE_UNIVERS[slug] ?? STYLE_UNIVERS["wax-et-mode"];
}

/**
 * Carte d'un cadeau : univers, nom, description, budget indicatif et bouton Amazon.
 * Pas de photo : les images des produits Amazon ne peuvent être affichées que via les outils Amazon Partenaires.
 * Utilisable côté serveur comme dans le quiz (navigateur).
 */
export function ProduitCard({ produit, rang, children }: { produit: CarteProduit; rang?: number; children?: React.ReactNode }) {
  const s = styleUnivers(produit.univers);
  const Icone = s.icone;
  return (
    <article className="carte-cadeau flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className={`flex items-center gap-2 px-4 py-2.5 ${s.fond} ${s.texte}`}>
        {rang ? (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white font-serif text-lg font-bold text-ink">{rang}</span>
        ) : (
          <Icone aria-hidden className="size-5 shrink-0" />
        )}
        <span className="text-[13px] font-semibold tracking-wide uppercase">{produit.universNom}</span>
        {produit.voyage && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[12px] font-semibold text-vert" title="Léger et solide : idéal pour un colis au pays">
            <Plane aria-hidden className="size-3.5" /> Voyage bien
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-[21px] leading-tight font-semibold">{produit.nom}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{produit.description}</p>
        {children}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-sm text-muted">
            {produit.prix ? (
              <>
                Environ <strong className="text-ink">{formatPrice(produit.prix)}</strong>
              </>
            ) : (
              <>
                Budget : <strong className="text-ink">{produit.budgetNom}</strong>
              </>
            )}
          </span>
          <a href={produit.url} target="_blank" rel={AMAZON_REL} className="btn-amazon shrink-0">
            Voir sur Amazon
          </a>
        </div>
      </div>
    </article>
  );
}

export function ProduitGrid({ produits }: { produits: CarteProduit[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {produits.map((p) => (
        <li key={p.slug}>
          <ProduitCard produit={p} />
        </li>
      ))}
    </ul>
  );
}
