// Publication automatique des épingles sur Pinterest (API v5), même système que Keur Déco.
// Usage : node scripts/pinterest-publier.mjs [--a-blanc] [--local]
//
// 1. Lit le manifeste publié (<site>/epingles.json, ou public/epingles.json avec --local)
//    et le fichier d'état data/pinterest-etat.json (épingles déjà publiées).
// 2. Choisit au plus N épingles (config/pinterest.json, 5 par défaut), jamais deux de la même page le même jour.
// 3. Publie chacune par POST /v5/pins (image du site, lien vers la page) dans le tableau prévu
//    (config/pinterest.json : board_id, ou à défaut le tableau du compte qui porte ce nom), puis met à jour l'état.
//
// Secrets : PINTEREST_APP_ID, PINTEREST_APP_SECRET, PINTEREST_REFRESH_TOKEN (propre à ce compte Pinterest).
// Sans eux (ou avec --a-blanc) : mode « à blanc », qui affiche ce qui serait publié sans rien envoyer.
// Aucun jeton n'est jamais affiché ni écrit dans un fichier.
import { appendFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { api, aujourdhuiParis, chargerEnv, choisirEpingles, corpsEpingle, epinglesDu, hoteApi, lireConfig, lireJson, listerTableaux, RACINE, relierTableaux, renouvelerJeton, tableauPour } from './pinterest-lib.mjs';

chargerEnv();
const env = process.env;
const args = process.argv.slice(2);
const config = lireConfig();
const SITE_URL = (env.SITE_URL || config.site_url).replace(/\/?$/, '/');
const FICHIER_ETAT = resolve(RACINE, 'data/pinterest-etat.json');
// Variable GitHub absente : le workflow passe une chaîne vide, qui ne doit pas devenir « 0 épingle ».
const MAX = Number(env.PINTEREST_MAX || config.max_par_execution || 5);

/** Écrit une sortie lue par le workflow (alerte, résumé). */
const sortie = (cle, valeur) => env.GITHUB_OUTPUT && appendFileSync(env.GITHUB_OUTPUT, `${cle}=${valeur}\n`);
const avertir = (texte) => console.log(env.GITHUB_ACTIONS ? `::warning::${texte}` : `⚠ ${texte}`);

async function lireManifeste() {
  const local = resolve(RACINE, 'public', config.manifeste ?? 'epingles.json');
  if (!args.includes('--local')) {
    const url = `${SITE_URL}${config.manifeste ?? 'epingles.json'}`;
    try {
      const rep = await fetch(url, { headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'Mozilla/5.0 (publication Pinterest)' } });
      if (rep.ok) {
        console.log(`Manifeste : ${url}`);
        return rep.json();
      }
      console.warn(`Manifeste en ligne indisponible (${rep.status}) : ${url}`);
    } catch (e) {
      console.warn(`Manifeste en ligne injoignable : ${e.message}`);
    }
  }
  console.log(`Manifeste local : ${local}`);
  return lireJson(local, { epingles: [] });
}

async function jetonAcces() {
  const { PINTEREST_APP_ID: appId, PINTEREST_APP_SECRET: secret, PINTEREST_REFRESH_TOKEN: refreshToken } = env;
  if (!appId || !secret || !refreshToken) return null;
  const r = await renouvelerJeton({ appId, secret, refreshToken });
  if (r.refresh_token && r.refresh_token !== refreshToken) {
    // Pinterest renvoie un nouveau refresh token à chaque renouvellement ; l'ancien reste valable jusqu'à son échéance.
    // Le jeton lui-même n'est jamais écrit : seul un signal est transmis au workflow.
    sortie('nouveau_refresh_token', '1');
    console.log('ℹ Pinterest a fourni un nouveau refresh token (l’ancien reste valable jusqu’à son échéance, environ 60 jours après sa création).');
  }
  return r.access_token;
}

async function principal() {
  const aujourdhui = aujourdhuiParis();
  const manifeste = await lireManifeste();
  const etat = lireJson(FICHIER_ETAT, { publiees: [] });
  etat.publiees ??= [];
  const choix = choisirEpingles(manifeste, etat, { max: MAX, aujourdhui });
  const jeton = args.includes('--a-blanc') ? null : await jetonAcces();
  const aBlanc = !jeton;

  console.log(`${config.site ?? 'Site'} · ${aBlanc ? 'mode à blanc (aucune publication)' : `publication sur ${hoteApi(env)}`} · ${choix.length} épingle(s) retenue(s) sur ${epinglesDu(manifeste).length}, maximum ${MAX}.`);
  if (aBlanc && !args.includes('--a-blanc')) {
    avertir(`Clé Pinterest de ${config.site ?? 'ce site'} absente (secrets PINTEREST_APP_ID, PINTEREST_APP_SECRET, PINTEREST_REFRESH_TOKEN) : rien n'est publié. Voir docs/PINTEREST.md.`);
  }

  // Identifiants des tableaux : ceux de la config, complétés par les noms des tableaux du compte.
  let ids = Object.fromEntries(Object.entries(config.tableaux ?? {}).map(([cle, t]) => [cle, t.board_id || null]));
  if (!aBlanc && Object.values(ids).some((id) => !id)) {
    ids = relierTableaux(config, await listerTableaux(jeton, env));
    const manquants = Object.entries(ids).filter(([, id]) => !id).map(([cle]) => `« ${config.tableaux[cle].nom} »`);
    if (manquants.length) avertir(`Tableaux introuvables sur le compte Pinterest : ${manquants.join(', ')} (à créer sous ce nom exact).`);
  }

  let erreurs = 0;
  let publiees = 0;
  let sansTableau = 0;
  for (const e of choix) {
    const boardId = tableauPour(e.tableau, ids, config);
    const nom = config.tableaux?.[e.tableau]?.nom ?? e.tableau;
    const ligne = `• ${e.id} → « ${nom} »${boardId ? ` (${boardId})` : ''} : ${e.titre}`;
    if (aBlanc) {
      console.log(`${ligne}\n  image ${e.image}\n  lien  ${e.lien}`);
      continue;
    }
    if (!boardId) {
      sansTableau++;
      console.warn(`${ligne}\n  ⚠ tableau introuvable : épingle laissée pour plus tard.`);
      continue;
    }
    try {
      const pin = await api('/pins', { jeton, methode: 'POST', corps: corpsEpingle(e, boardId), env });
      etat.publiees.push({ id: e.id, slug: e.slug, pin_id: pin.id, tableau: e.tableau, board_id: boardId, publie_le: aujourdhui, publie_a: new Date().toISOString() });
      writeFileSync(FICHIER_ETAT, JSON.stringify(etat, null, 2) + '\n');
      publiees++;
      console.log(`${ligne}\n  ✓ épingle ${pin.id}`);
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      erreurs++;
      console.error(`${ligne}\n  ✗ ${err.message}`);
    }
  }
  sortie('publiees', publiees);
  if (sansTableau && !aBlanc) {
    console.error(`✗ ${sansTableau} épingle(s) sans tableau : créez les tableaux nommés dans config/pinterest.json (ou renseignez leur board_id).`);
    process.exit(1);
  }
  if (erreurs) process.exit(1);
}

if (import.meta.main) {
  principal().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
