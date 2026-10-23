// Envoie la clé Pinterest de ce site dans les secrets GitHub du dépôt, sans jamais l'afficher.
// Usage : npm run pinterest:secrets   (après npm run pinterest:auth ; nécessite gh connecté : gh auth status)
//
// Lit PINTEREST_APP_ID, PINTEREST_APP_SECRET et PINTEREST_REFRESH_TOKEN dans le fichier .env de ce dossier
// et les transmet à « gh secret set » par l'entrée standard (jamais en argument, jamais à l'écran).
import { spawnSync } from 'node:child_process';
import { chargerEnv, lireConfig } from './pinterest-lib.mjs';

chargerEnv();
const config = lireConfig();
const NOMS = ['PINTEREST_APP_ID', 'PINTEREST_APP_SECRET', 'PINTEREST_REFRESH_TOKEN'];
const manquants = NOMS.filter((n) => !process.env[n]);
if (manquants.length) {
  console.error(`✗ Absent du fichier .env : ${manquants.join(', ')}. Lancez d'abord npm run pinterest:auth (voir docs/PINTEREST.md).`);
  process.exit(1);
}
let erreurs = 0;
for (const nom of NOMS) {
  const r = spawnSync('gh', ['secret', 'set', nom, '--repo', config.depot], { input: process.env[nom], stdio: ['pipe', 'ignore', 'pipe'], encoding: 'utf8' });
  if (r.status === 0) console.log(`✓ ${nom} enregistré dans les secrets GitHub de ${config.depot}`);
  else {
    erreurs++;
    console.error(`✗ ${nom} : ${(r.stderr || r.error?.message || 'échec').trim()}`);
  }
}
if (erreurs) process.exit(1);
console.log(`\nC'est fait : la publication automatique de ${config.site} démarrera au prochain passage (chaque matin, lancement prévu à 4 h 17 UTC).`);
