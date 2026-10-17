"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config";
import { FAMILLES } from "@/lib/taxonomie";
import { Logo } from "./Logo";
import { NAV } from "./nav";

/** En-tête : bandeau wax, liens en ligne sur grand écran, menu plein écran sur mobile (avec toutes les rubriques). */
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
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur">
        <div className="wax-band" aria-hidden />
        <div className="container-page flex h-16 items-center gap-6">
          <Link href="/" onClick={close} aria-label={`${siteConfig.name}, accueil`}>
            <Logo />
          </Link>
          <nav aria-label="Menu principal" className="hidden gap-5 text-[15px] font-semibold text-ink/80 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-orange">
                {n.label}
              </Link>
            ))}
          </nav>
          <Link href="/quiz" className="btn-primary ml-auto hidden py-2 lg:inline-flex">
            Trouve le cadeau
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className={`ml-auto rounded-full border-2 px-4 py-1.5 text-sm font-semibold lg:hidden ${open ? "border-orange text-orange" : "border-ink/70"}`}
          >
            {open ? "Fermer" : "Menu"}
          </button>
        </div>
      </header>
      {open && (
        <div id="menu-mobile" className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-paper px-4 pt-24 pb-8 lg:hidden">
          <Link href="/quiz" onClick={close} className="btn-primary py-4 text-lg">
            Trouve le cadeau en 3 questions
          </Link>
          <nav aria-label="Menu mobile" className="mt-6 flex flex-col">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={close} className="border-b border-line py-3 font-serif text-[30px] leading-none font-semibold hover:text-orange">
                {n.label}
              </Link>
            ))}
          </nav>
          {Object.entries(FAMILLES).map(([cle, f]) => (
            <nav key={cle} aria-label={f.nom} className="mt-6">
              <p className="eyebrow">{f.nom}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
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
