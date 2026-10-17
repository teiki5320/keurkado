import { withBase } from "@/lib/config";

/** Le paquet cadeau seul (en-tête) : public/brand/keurkado-embleme.webp, tiré du logo par npm run visuels-marque. */
export function Emblem({ className = "h-10 w-auto" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={withBase("/brand/keurkado-embleme.webp")} alt="" width={160} height={126} className={className} />;
}

/** Logo de l'en-tête : paquet cadeau + « Keur Kado » en noir et rouge, comme le logo complet. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 font-sans text-[27px] leading-none font-black tracking-tight ${className}`}>
      <Emblem />
      <span>
        Keur<span className="text-rouge">Kado</span>
      </span>
    </span>
  );
}

/** Logo complet (pied de page) : public/brand/keurkado-logo.webp. */
export function LogoComplet({ className = "w-44" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={withBase("/brand/keurkado-logo.webp")} alt="Keur Kado, les idées cadeaux africains" width={640} height={596} loading="lazy" className={className} />;
}
