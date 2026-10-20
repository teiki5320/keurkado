"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config";
import { FAMILLES } from "@/lib/taxonomie";
import { Logo } from "./Logo";
import { NAV } from "./nav";

/** En-tête « Perles de bois » : perle-logo, liens en ligne sur grand écran, menu plein écran sur mobile (avec toutes les rubriques). */
export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Menu mobile ouvert : la page derrière ne défile plus, Échap le ferme, le focus va au premier lien.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.querySelector<HTMLElement>("#menu-mobile a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper/85 backdrop-blur-md">
        <div className="container-page flex items-center gap-4 border-b border-ink/25 py-3.5">
          <Link href="/" onClick={close} aria-label={`${siteConfig.name}, accueil`} className="min-w-0 hover:text-ink">
            <Logo />
          </Link>
          <nav aria-label="Menu principal" className="ml-auto hidden items-center gap-6 text-[14px] font-bold lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-terre-texte">
                {n.label}
              </Link>
            ))}
            <Link href="/quiz" className="btn-primary py-2.5">
              Trouve le cadeau
            </Link>
          </nav>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className={`btn ml-auto shrink-0 px-4 py-2 text-[13px] lg:hidden ${open ? "bg-ink text-creme" : "bg-transparent"}`}
          >
            {open ? "Fermer" : "Menu"}
          </button>
        </div>
      </header>
      {open && (
        <div id="menu-mobile" className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-paper px-4 pt-28 pb-8 lg:hidden">
          <Link href="/quiz" onClick={close} className="btn-primary py-4 text-[16px]">
            Trouve le cadeau avec Tonton Kado
          </Link>
          <nav aria-label="Menu mobile" className="mt-6 flex flex-col">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={close} className="border-b border-ink/20 py-3 font-serif text-[32px] leading-none font-semibold hover:text-terre-texte">
                {n.label}
              </Link>
            ))}
          </nav>
          {Object.entries(FAMILLES).map(([cle, f]) => (
            <nav key={cle} aria-label={f.nom} className="mt-7">
              <p className="eyebrow">{f.nom}</p>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {f.liste.map((r) => (
                  <li key={r.slug}>
                    <Link href={`${f.chemin}/${r.slug}`} onClick={close} className="tag">
                      {r.nom}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-10 text-xs text-muted">
            <Link href="/mentions-legales" onClick={close}>Mentions légales</Link>
            <Link href="/confidentialite" onClick={close}>Confidentialité</Link>
            <Link href="/conditions" onClick={close}>Conditions</Link>
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </div>
        </div>
      )}
    </>
  );
}
