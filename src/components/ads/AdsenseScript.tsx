"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT } from "@/lib/config";

/**
 * Code AdSense (annonces et bandeau de consentement de Google, réglé dans AdSense), chargé une fois la page affichée :
 * environ 200 Ko de scripts Google qui ne retardent plus l'affichage du texte sur téléphone.
 * La validation du site reste assurée par la balise « google-adsense-account » du layout.
 */
export function AdsenseScript() {
  useEffect(() => {
    if (!ADSENSE_CLIENT || document.querySelector("script[data-adsense]")) return;
    const charger = () => {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
      s.crossOrigin = "anonymous";
      s.dataset.adsense = "";
      document.head.appendChild(s);
    };
    // Après le chargement de la page, quand le navigateur est libre (au plus tard 3 secondes après).
    const plusTard = () => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(charger, { timeout: 3000 });
      else setTimeout(charger, 1500);
    };
    if (document.readyState === "complete") plusTard();
    else window.addEventListener("load", plusTard, { once: true });
  }, []);
  return null;
}
