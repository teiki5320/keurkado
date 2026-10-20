import { withBase } from "@/lib/config";

/** Le paquet cadeau du logo (public/brand/keurkado-embleme.webp, tiré du logo par npm run visuels-marque). */
export function Emblem({ className = "h-8 w-auto" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={withBase("/brand/keurkado-embleme.webp")} alt="" width={160} height={126} className={className} />;
}

/**
 * Perle-logo du design « Perles de bois » : le paquet cadeau dans une perle crème cerclée de bois,
 * avec son anneau en pointillés qui tourne et le nœud du cordon au-dessus.
 */
export function PerleLogo({ taille = 56 }: { taille?: number }) {
  return (
    <span className="anim-respire relative inline-block shrink-0" style={{ width: taille, height: taille }}>
      <span className="anneau-pointille anim-tourne -inset-[7px]" />
      <span className="perle absolute inset-0 grid place-items-center" style={{ borderWidth: Math.round(taille / 9) }}>
        <Emblem className="w-[78%]" />
      </span>
      <span className="absolute -top-3 left-1/2 size-2 -translate-x-1/2 rounded-full bg-ink" />
    </span>
  );
}

/** Logo de l'en-tête : perle-logo + « Keur Kado » en Cormorant et la devise. */
export function Logo({ devise = true }: { devise?: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-4">
      <PerleLogo />
      <span className="min-w-0">
        <span className="block font-serif text-[28px] leading-none font-semibold tracking-[0.01em] sm:text-[30px]">Keur Kado</span>
        {devise && (
          <span className="mt-1.5 block truncate text-[10.5px] font-semibold tracking-[0.16em] text-muted uppercase sm:text-[11.5px]">
            L&apos;atelier des <span className="hidden sm:inline">idées </span>cadeaux<span className="hidden sm:inline"> africains</span>
          </span>
        )}
      </span>
    </span>
  );
}

/** Logo complet (pied de page) : public/brand/keurkado-logo.webp. */
export function LogoComplet({ className = "w-40" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={withBase("/brand/keurkado-logo.webp")} alt="Keur Kado, les idées cadeaux africains" width={640} height={596} loading="lazy" className={className} />;
}
