/**
 * Logo provisoire : emblème « paquet cadeau » aux couleurs du wax + nom en Fraunces.
 * À remplacer par le logo définitif (public/brand/) quand il sera prêt.
 */
export function Emblem({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <rect x="4" y="14" width="32" height="22" rx="4" fill="#c2410c" />
      <rect x="2" y="9" width="36" height="8" rx="3" fill="#f2a900" />
      <rect x="17" y="9" width="6" height="27" fill="#1f3a8a" />
      <circle cx="11" cy="26" r="4" fill="#f2a900" />
      <circle cx="11" cy="26" r="1.8" fill="#1e7a4e" />
      <circle cx="29" cy="26" r="4" fill="#b5245e" />
      <circle cx="29" cy="26" r="1.8" fill="#fff7ec" />
      <path d="M20 9c-3-6-11-6-9-1 1 2 5 1 9 1zm0 0c3-6 11-6 9-1-1 2-5 1-9 1z" fill="#1e7a4e" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 font-serif text-[26px] leading-none font-semibold ${className}`}>
      <Emblem />
      <span>
        Keur <span className="text-orange">Kado</span>
      </span>
    </span>
  );
}
