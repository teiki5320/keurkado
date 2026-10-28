/**
 * Worker de keurkado.com : une seule adresse par page, puis les fichiers statiques de out/.
 * - http:// et www.keurkado.com → https://keurkado.com, en 301 (redirection définitive) ;
 * - page sans barre finale (« /top ») → « /top/ », en 301 (Cloudflare seul répond en 307, temporaire) ;
 * - tout le reste est servi tel quel par les fichiers statiques (en-têtes de public/_headers, redirections de public/_redirects).
 */

const HOTE = "keurkado.com";

/** Anciennes adresses déplacées : une seule redirection vers la page finale. */
const DEPLACEES: Record<string, string> = { "/cgv": "/conditions/", "/cgv/": "/conditions/" };

/** Adresse vers laquelle rediriger en 301, ou null si la requête est déjà la bonne. */
export function redirection(adresse: string): string | null {
  const url = new URL(adresse);
  let changee = false;
  if (url.protocol === "http:" || url.hostname === `www.${HOTE}`) {
    url.protocol = "https:";
    url.hostname = HOTE;
    url.port = "";
    changee = true;
  }
  const deplacee = DEPLACEES[url.pathname];
  if (deplacee) {
    url.pathname = deplacee;
    return url.toString();
  }
  // Une page (pas un fichier : pas d'extension) sans barre finale.
  const dernier = url.pathname.split("/").pop() ?? "";
  if (dernier !== "" && !dernier.includes(".")) {
    url.pathname = `${url.pathname}/`;
    changee = true;
  }
  return changee ? url.toString() : null;
}

interface Env {
  ASSETS: { fetch(requete: Request): Promise<Response> };
}

const worker = {
  async fetch(requete: Request, env: Env): Promise<Response> {
    const cible = redirection(requete.url);
    if (cible) return new Response(null, { status: 301, headers: { Location: cible, "Cache-Control": "public, max-age=86400" } });
    return env.ASSETS.fetch(requete);
  },
};

export default worker;
