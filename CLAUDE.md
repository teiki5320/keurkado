@AGENTS.md

- Site en français : textes UI, commentaires et messages en français.
- Contenus : respecter docs/REDACTION.md (descriptions écrites par nous, jamais d'ASIN, de prix ou de marque inventés).
- Données : catalogue dans src/lib/catalogue, Top 10 dans src/lib/tops, articles dans content/conseils, calendrier dans src/lib/calendrier.ts (site statique, sans base).
- Travail uniquement sur la branche main, sans branche ni pull request.
- Vérifications : `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

## Fiches à jour à chaque changement (règle de Jean, 22 octobre 2026)

Le Studio de Jean affiche les fiches de ce dépôt (docs/INFRA.md, docs/MARKETING.md, docs/PUBLICATION.md) et le README. Elles doivent toujours dire la vérité d'aujourd'hui.

- Dès qu'un travail change un fait affiché par ces fiches — version envoyée ou en ligne (App Store, Google Play, site), date de mise en ligne, hébergement ou domaine, service ajouté ou retiré, code Amazon Partenaires, état AdSense ou Pinterest, monétisation, nombre de contenus publiés —, mets à jour **dans le même envoi** toutes les phrases concernées des trois fiches (En bref, Parcours, Boutiques, Vue d'ensemble, Ce qui reste…) et du README.
- Une ancienne valeur ne reste qu'au passé, datée (« la 1.0.4 a été mise en ligne le 15 octobre »).
- Ne recopie jamais de secret ni de clé dans ces fichiers.
- Chaque matin, la tâche « Fiches Mes Apps » du Studio vérifie derrière toi, compare les versions avec ce que servent réellement les boutiques et signale toute phrase fausse.
