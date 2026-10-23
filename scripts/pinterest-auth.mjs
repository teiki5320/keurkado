// Création de la clé Pinterest de ce site (parcours OAuth sur un petit serveur local), comme sur Keur Déco.
// Usage : npm run pinterest:auth   puis ouvrir http://localhost:8085/
//
// Prérequis : PINTEREST_APP_ID et PINTEREST_APP_SECRET (application « TOA CORP publication ») dans le fichier .env
// de ce dossier (jamais envoyé sur GitHub), et l'adresse http://localhost:8085/callback déclarée dans l'application
// (déjà fait pour Keur Déco : c'est la même application pour tous les sites).
//
// Le parcours : autorisation sur Pinterest → échange du code → vérification que le compte autorisé est bien celui
// du site (ses tableaux doivent porter les noms de config/pinterest.json) → refresh token enregistré dans .env.
// Le jeton n'est jamais affiché, ni à l'écran ni dans le terminal. Ensuite : npm run pinterest:secrets.
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { api, chargerEnv, demanderJeton, lireConfig, listerTableaux, nomComparable, PORTEES, RACINE, URL_AUTORISATION } from './pinterest-lib.mjs';

chargerEnv();
const config = lireConfig();
const SITE = config.site ?? 'ce site';
const PORT = Number(process.env.PINTEREST_AUTH_PORT ?? 8085);
const REDIRECTION = `http://localhost:${PORT}/callback`;
const APP_ID = process.env.PINTEREST_APP_ID;
const SECRET = process.env.PINTEREST_APP_SECRET;
const etatOAuth = randomBytes(16).toString('hex');

/** Écrit (ou remplace) une ligne CLE=valeur dans .env, sans jamais afficher la valeur. */
function enregistrerEnv(cle, valeur, fichier = resolve(RACINE, '.env')) {
  const texte = existsSync(fichier) ? readFileSync(fichier, 'utf8') : '';
  const ligne = `${cle}=${valeur}`;
  const motif = new RegExp(`^${cle}=.*$`, 'm');
  writeFileSync(fichier, motif.test(texte) ? texte.replace(motif, () => ligne) : `${texte.replace(/\n?$/, '\n')}${ligne}\n`, { mode: 0o600 });
}

const echapper = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function page(titre, contenu) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${echapper(titre)} · ${echapper(SITE)}</title>
<style>
body{font-family:system-ui,sans-serif;background:#F7F0E6;color:#1C1B22;max-width:760px;margin:0 auto;padding:32px 20px;line-height:1.55}
h1{font-family:Georgia,serif}.bouton{display:inline-block;background:#E60023;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600}
code{font-family:ui-monospace,monospace;font-size:.9rem}.note{background:#EFE3D0;padding:14px 18px;border-radius:12px}
.ok{color:#2F6B2F;font-weight:700}.erreur{color:#B4232F;font-weight:700}li{margin:.3em 0}
</style></head><body><h1>${echapper(titre)}</h1>${contenu}</body></html>`;
}

function accueil() {
  if (!APP_ID || !SECRET) {
    return page(
      'Il manque l’application Pinterest',
      `<p class="erreur">PINTEREST_APP_ID et PINTEREST_APP_SECRET sont introuvables dans le fichier .env de ce dossier.</p>
<p>Dans le Terminal, copiez-les depuis Keur Déco (rien ne s'affiche) :</p>
<pre>grep -E '^PINTEREST_APP_(ID|SECRET)=' ~/Dev/apps/keurdeco/.env >> .env</pre><p>puis relancez <code>npm run pinterest:auth</code>.</p>`,
    );
  }
  return page(
    `${SITE} × Pinterest`,
    `<div class="note"><p><strong>Avant de cliquer :</strong> sur <a href="https://fr.pinterest.com/">pinterest.fr</a>, dans ce même navigateur, le compte actif doit être <strong>${echapper(config.compte_pinterest ?? SITE)}</strong> (menu du compte en haut à droite › « Vos comptes » › ${echapper(config.compte_pinterest ?? SITE)}).</p></div>
<p>L'application « TOA CORP publication » demandera : lire le compte et les tableaux, créer des épingles (${PORTEES.map((p) => `<code>${p}</code>`).join(', ')}).</p>
<p><a class="bouton" href="/connexion">Autoriser ${echapper(SITE)} sur Pinterest</a></p>`,
  );
}

function lienAutorisation() {
  const p = new URLSearchParams({ client_id: APP_ID, redirect_uri: REDIRECTION, response_type: 'code', scope: PORTEES.join(','), state: etatOAuth });
  return `${URL_AUTORISATION}?${p.toString()}`;
}

/** Échange le code, vérifie le compte, enregistre le refresh token s'il s'agit du bon compte. */
async function terminer(code) {
  const session = await demanderJeton({ grant_type: 'authorization_code', code, redirect_uri: REDIRECTION }, { appId: APP_ID, secret: SECRET });
  const [compte, tableaux] = await Promise.all([api('/user_account', { jeton: session.access_token }).catch(() => ({})), listerTableaux(session.access_token)]);
  const noms = new Set(tableaux.map((t) => nomComparable(t.name)));
  const attendus = Object.values(config.tableaux ?? {}).map((t) => t.nom);
  const trouves = attendus.filter((n) => noms.has(nomComparable(n)));
  const liste = attendus.map((n) => `<li>${noms.has(nomComparable(n)) ? '✓' : '✗ à créer :'} ${echapper(n)}</li>`).join('');

  if (attendus.length && trouves.length === 0) {
    return page(
      'Ce n’est pas le bon compte',
      `<p class="erreur">Le compte autorisé (${echapper(compte.username ?? 'inconnu')}) n'a aucun des tableaux de ${echapper(SITE)}. Rien n'a été enregistré.</p>
<p>Sur pinterest.fr, passez au compte <strong>${echapper(config.compte_pinterest ?? SITE)}</strong> (menu du compte › « Vos comptes »), puis <a href="/">recommencez</a>.</p><ul>${liste}</ul>`,
    );
  }
  if (!session.refresh_token) return page('Erreur', '<p class="erreur">Pinterest n’a renvoyé aucun refresh token. <a href="/">Recommencer</a>.</p>');
  enregistrerEnv('PINTEREST_REFRESH_TOKEN', session.refresh_token);
  console.log(`\n✓ Clé Pinterest de ${SITE} enregistrée dans .env (non affichée). Étape suivante : npm run pinterest:secrets\n`);
  return page(
    'Clé créée',
    `<p class="ok">✓ ${echapper(SITE)} est autorisé sur le compte Pinterest « ${echapper(compte.username ?? '')} ».</p>
<p>La clé (refresh token) est enregistrée dans le fichier <code>.env</code> de ce dossier, sans être affichée. Elle reste valable environ ${session.refresh_token_expires_in ? Math.round(session.refresh_token_expires_in / 86400) : 60} jours.</p>
<p><strong>Étape suivante</strong> : revenez au Terminal, arrêtez ce programme (Ctrl+C) et lancez <code>npm run pinterest:secrets</code>.</p>
<h2>Tableaux du site</h2><ul>${liste}</ul>`,
  );
}

const serveur = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const envoyer = (html, statut = 200) => {
    res.writeHead(statut, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  };
  try {
    if (url.pathname === '/') return envoyer(accueil());
    if (url.pathname === '/connexion' && APP_ID && SECRET) {
      res.writeHead(302, { Location: lienAutorisation() });
      return res.end();
    }
    if (url.pathname === '/callback') {
      if (url.searchParams.get('state') !== etatOAuth) return envoyer(page('Erreur', '<p class="erreur">Lien périmé : <a href="/">recommencez</a>.</p>'), 400);
      const code = url.searchParams.get('code');
      if (!code) return envoyer(page('Autorisation refusée', `<p class="erreur">${echapper(url.searchParams.get('error_description') ?? 'Aucun code reçu.')}</p>`), 400);
      return envoyer(await terminer(code));
    }
    envoyer(page('Introuvable', '<p><a href="/">Accueil</a></p>'), 404);
  } catch (e) {
    envoyer(page('Erreur', `<p class="erreur">${echapper(e.message)}</p><p><a href="/">Recommencer</a></p>`), 500);
  }
});

serveur.listen(PORT, () => {
  console.log(`Clé Pinterest de ${SITE} : ouvrez http://localhost:${PORT}/ (Ctrl+C pour arrêter).`);
});
