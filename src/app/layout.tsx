import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { ADSENSE_CLIENT, siteConfig } from "@/lib/config";
import { DEFAULT_SHARE_IMAGES } from "@/lib/metadata";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });
const sourceSans = Source_Sans_3({ variable: "--font-source-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(`${siteConfig.url}/`),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: DEFAULT_SHARE_IMAGES,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  // Grande image autorisée dans Google Discover et les résultats.
  robots: { "max-image-preview": "large" },
  other: {
    // Validation du site dans AdSense.
    ...(ADSENSE_CLIENT && { "google-adsense-account": ADSENSE_CLIENT }),
    // Revendication du domaine sur Pinterest (variable PINTEREST_VERIFY, voir docs/PINTEREST.md).
    ...(process.env.NEXT_PUBLIC_PINTEREST_VERIFY && { "p:domain_verify": process.env.NEXT_PUBLIC_PINTEREST_VERIFY }),
  },
};

export const viewport: Viewport = {
  themeColor: "#c2410c",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${sourceSans.variable} antialiased`} suppressHydrationWarning>
      {ADSENSE_CLIENT && (
        <head>
          {/* Code AdSense : charge les annonces et le bandeau de consentement de Google (réglé dans AdSense). */}
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        </head>
      )}
      <body className="flex min-h-dvh flex-col">
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded focus:bg-white focus:p-2">
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
