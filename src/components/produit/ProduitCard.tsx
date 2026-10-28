import { BookOpen, CookingPot, Gem, Palette, Puzzle, Shirt, Sparkles, type LucideProps } from "lucide-react";
import { AMAZON_LIEN_PARTENAIRE, AMAZON_REL, ILLUSTRATION_IA } from "@/lib/amazon";
import { withBase } from "@/lib/config";
import type { CarteProduit } from "@/lib/data/produits";
import { formatPrice } from "@/lib/format";

/** Pictogramme de chaque univers, gravé au cœur de la perle (pas de photo : les images Amazon passent par leurs outils). */
export function IconeUnivers({ slug, ...props }: { slug: string } & LucideProps) {
  switch (slug) {
    case "wax-et-mode":
      return <Shirt {...props} />;
    case "beaute-afro":
      return <Sparkles {...props} />;
    case "art-et-deco":
      return <Palette {...props} />;
    case "jeux-et-jouets":
      return <Puzzle {...props} />;
    case "livres":
      return <BookOpen {...props} />;
    case "cuisine":
      return <CookingPot {...props} />;
    default:
      return <Gem {...props} />;
  }
}

/** Les trois essences de bois des perles, qui alternent : bois clair, ébène, acacia. */
const ESSENCES = ["", "perle-ebene", "perle-acacia"] as const;
export const essence = (i: number) => ESSENCES[((i % 3) + 3) % 3];

/** 1 € = 655,957 FCFA (parité fixe) : affiché seulement quand un vrai prix a été relevé. */
export const enFcfa = (cents: number) => (Math.round((cents / 100) * 655.957 / 100) * 100).toLocaleString("fr-FR");

/** Perle de bois avec le pictogramme de l'univers et l'étiquette de budget suspendue dessous. */
export function Perle({ produit, index = 0, taille = 110, etiquette = true, prioritaire = false }: { produit: CarteProduit; index?: number; taille?: number; etiquette?: boolean; prioritaire?: boolean }) {
  return (
    <span className="relative inline-block shrink-0" style={{ width: taille, height: taille }}>
      {/* Attache de la perle au cordon. */}
      <span aria-hidden className="absolute -top-4 left-1/2 h-[18px] w-3.5 -translate-x-1/2 rounded-[50%_50%_40%_40%] border-[2.5px] border-bois border-b-transparent" />
      <span aria-hidden className="anneau-pointille anim-tourne -inset-[7px] border-ink/40" style={{ animationDelay: `${-index * 0.45}s`, animationDuration: "18s" }} />
      <span className={`perle ${essence(index)} absolute inset-0 grid place-items-center overflow-hidden`} style={{ borderWidth: Math.max(7, Math.round(taille / 12)) }}>
        {produit.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={withBase(produit.image)}
            srcSet={`${withBase(produit.image.replace("/produits/", "/produits/320/"))} 320w, ${withBase(produit.image)} 480w`}
            sizes={`${taille}px`}
            alt={`Illustration : ${produit.nom}`}
            width={240}
            height={240}
            loading={prioritaire ? "eager" : "lazy"}
            fetchPriority={prioritaire ? "high" : undefined} className="size-full rounded-full object-cover" />
        ) : (
          <IconeUnivers slug={produit.univers} aria-hidden className="text-bois-fonce" style={{ width: taille * 0.34, height: taille * 0.34 }} strokeWidth={1.6} />
        )}
      </span>
      {etiquette && (
        <span className="absolute -bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-[4px_14px_14px_4px] bg-ink py-1 pr-3 pl-2 text-[12px] font-bold whitespace-nowrap text-creme shadow-[0_6px_10px_-6px_rgba(0,0,0,0.6)]">
          <span aria-hidden className="size-[5px] rounded-full bg-paper" />
          {produit.prix ? formatPrice(produit.prix) : produit.budgetNom}
        </span>
      )}
    </span>
  );
}

/**
 * Carte d'un cadeau, en arche sous sa perle (la fiche « détail » du design) : univers, nom, budget,
 * description, bouton Amazon, puis destinataires et envoi. `children` reçoit le « pourquoi » d'un Top 10 (sous le bouton).
 * Utilisable côté serveur comme dans l'atelier (navigateur).
 */
export function ProduitCard({ produit, rang, index = 0, niveau = 3, prioritaire = false, children }: { produit: CarteProduit; rang?: number; index?: number; niveau?: 2 | 3; prioritaire?: boolean; children?: React.ReactNode }) {
  // Dans un Top 10, chaque cadeau est un intertitre de la page (h2) ; ailleurs il suit le titre d'une section (h3).
  const Titre = niveau === 2 ? "h2" : "h3";
  return (
    <article className="carte-cadeau relative flex h-full flex-col items-center">
      <span className="relative z-10 mt-4">
        <Perle produit={produit} index={index} taille={produit.image ? 150 : 104} etiquette={false} prioritaire={prioritaire} />
        {rang && (
          <span className="perle-pleine absolute -top-1 -right-3 grid size-10 place-items-center text-[17px] font-extrabold text-creme">{rang}</span>
        )}
      </span>
      <div className={`bulle flex w-full flex-1 flex-col items-center gap-2.5 rounded-[200px_200px_40px_40px/120px_120px_40px_40px] px-5 pb-6 text-center sm:px-7 ${produit.image ? "-mt-20 pt-24" : "-mt-12 pt-16"}`}>
        <p className="text-[11px] font-bold tracking-[0.18em] text-terre-texte uppercase">{produit.universNom}</p>
        <Titre className="font-serif text-[26px] leading-[1.1] font-bold text-balance">{produit.nom}</Titre>
        <div className="separateur" aria-hidden>
          <span />
        </div>
        <p className="text-[18px] font-extrabold text-terre-texte">
          {produit.prix ? formatPrice(produit.prix) : produit.budgetNom}
          {produit.prix && <span className="ml-1.5 text-[12.5px] font-semibold text-faint">≈ {enFcfa(produit.prix)} FCFA</span>}
        </p>
        <p className="text-[15px] leading-relaxed text-muted">{produit.description}</p>
        {/* Le bouton suit directement la description : sur téléphone, il arrive sans avoir à faire défiler tout le « pourquoi ». */}
        <div className="pt-1">
          <a href={produit.url} target="_blank" rel={AMAZON_REL} aria-label={`Voir sur Amazon : ${produit.nom}`} className="btn-amazon px-7 py-3.5 text-[15px]">
            Voir sur Amazon
          </a>
          <p className="mt-2.5 text-[11px] leading-snug text-faint">{AMAZON_LIEN_PARTENAIRE}</p>
          {produit.image && <p className="mt-1 text-[11px] leading-snug text-faint">{ILLUSTRATION_IA}</p>}
        </div>
        {children}
        <div className="mt-auto flex flex-wrap justify-center gap-2 pt-1 text-[12px] font-semibold">
          <span className="rounded-full border border-ink/35 px-3 py-1.5">Pour {produit.pourNoms}</span>
          <span className="rounded-full border border-ink/35 px-3 py-1.5">{produit.voyage ? "Voyage bien dans un colis" : "À offrir en main propre"}</span>
        </div>
      </div>
    </article>
  );
}

/** Grille de cartes ; `prioritaire` : la première image est chargée tout de suite (elle est en haut de la page). */
export function ProduitGrid({ produits, prioritaire = false }: { produits: CarteProduit[]; prioritaire?: boolean }) {
  return (
    <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {produits.map((p, i) => (
        <li key={p.slug}>
          <ProduitCard produit={p} index={i} prioritaire={prioritaire && i === 0} />
        </li>
      ))}
    </ul>
  );
}

/** Liste courte des autres idées d'une rubrique : nom, univers, budget et lien Amazon, sans la description (déjà sur d'autres pages). */
export function ProduitListe({ produits }: { produits: CarteProduit[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {produits.map((p) => (
        <li key={p.slug} className="bulle flex items-center justify-between gap-4 rounded-[28px_28px_28px_6px] px-5 py-3">
          <span className="min-w-0">
            <span className="block font-serif text-[20px] leading-tight font-semibold">{p.nom}</span>
            <span className="block text-[13px] text-muted">
              {p.universNom} · {p.prix ? formatPrice(p.prix) : p.budgetNom}
            </span>
          </span>
          <span className="flex shrink-0 flex-col items-end text-right">
            <a href={p.url} target="_blank" rel={AMAZON_REL} aria-label={`Voir sur Amazon : ${p.nom}`} className="btn-amazon px-4 py-2 text-[13px]">
              Voir sur Amazon
            </a>
            <span className="mt-1.5 max-w-[14rem] text-[11px] leading-snug text-faint">{AMAZON_LIEN_PARTENAIRE}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Encadré de 1 ou 2 cadeaux au fil d'un article, juste après le paragraphe qui les cite (loin des annonces) :
 * perle, nom, budget, bouton « Voir sur Amazon » et ligne « Lien partenaire ».
 */
export function EncadreProduits({ produits }: { produits: CarteProduit[] }) {
  if (produits.length === 0) return null;
  return (
    <aside aria-label="Les cadeaux cités" className="my-8">
      <ul className={`grid gap-4 ${produits.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {produits.map((p, i) => (
          <li key={p.slug} className="bulle flex items-center gap-4 rounded-[32px_32px_32px_8px] px-4 pt-6 pb-4">
            <Perle produit={p} index={i} taille={72} etiquette={false} />
            <div className="min-w-0">
              <p className="font-serif text-[19px] leading-tight font-semibold">{p.nom}</p>
              <p className="mt-0.5 text-[13px] text-muted">
                {p.universNom} · {p.prix ? formatPrice(p.prix) : p.budgetNom}
              </p>
              <a href={p.url} target="_blank" rel={AMAZON_REL} aria-label={`Voir sur Amazon : ${p.nom}`} className="btn-amazon mt-2.5 px-4 py-2 text-[13px]">
                Voir sur Amazon
              </a>
              <p className="mt-1.5 text-[11px] leading-snug text-faint">{AMAZON_LIEN_PARTENAIRE}</p>
              {p.image && <p className="mt-0.5 text-[11px] leading-snug text-faint">{ILLUSTRATION_IA}</p>}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
