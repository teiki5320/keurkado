import Link from "next/link";
import { CookieSettingsLink } from "@/components/ads/CookieSettingsLink";
import { AMAZON_DISCLOSURE } from "@/lib/amazon";
import { siteConfig } from "@/lib/config";
import { FAMILLES } from "@/lib/taxonomie";
import { Logo } from "./Logo";
import { NAV } from "./nav";

export function Footer() {
  return (
    <footer className="mt-24 bg-sand">
      <div className="wax-band" aria-hidden />
      <div className="container-page grid gap-10 py-12 text-[15px] sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-muted">{siteConfig.tagline}, pour la diaspora et pour tous ceux qui aiment l&apos;Afrique.</p>
          <Link href="/quiz" className="btn-primary mt-5">
            Trouve le cadeau
          </Link>
        </div>
        <nav aria-label="Rubriques" className="flex flex-col gap-2.5">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="font-serif text-xl leading-none font-semibold hover:text-orange">
              {n.label}
            </Link>
          ))}
        </nav>
        {(["occasion", "pour"] as const).map((cle) => (
          <nav key={cle} aria-label={FAMILLES[cle].nom} className="flex flex-col gap-1.5">
            <p className="eyebrow mb-1">{FAMILLES[cle].nom}</p>
            {FAMILLES[cle].liste.map((r) => (
              <Link key={r.slug} href={`${FAMILLES[cle].chemin}/${r.slug}`} className="text-muted hover:text-ink">
                {r.nom}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="container-page flex flex-wrap gap-x-5 gap-y-2 border-t border-line-strong/60 py-5 text-sm text-muted">
        <Link href="/mentions-legales" className="hover:text-ink">Mentions légales</Link>
        <Link href="/confidentialite" className="hover:text-ink">Confidentialité</Link>
        <Link href="/conditions" className="hover:text-ink">Conditions d&apos;utilisation</Link>
        <CookieSettingsLink className="hover:text-ink" />
        <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-ink">{siteConfig.contactEmail}</a>
      </div>
      <div className="container-page space-y-2 pb-8 text-xs leading-relaxed text-muted">
        <p>{AMAZON_DISCLOSURE}</p>
        <p>
          Un site{" "}
          <a href="https://toakeur.com" className="font-semibold text-ink hover:text-orange">TOA KEUR</a>
        </p>
      </div>
    </footer>
  );
}
