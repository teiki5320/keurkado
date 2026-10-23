# Pinterest

Même système que Keur Déco (et Keur Cook) : chaque matin, GitHub publie jusqu'à 5 épingles sur le compte Pinterest « Keur Kado » par l'API Pinterest, avec l'application « TOA CORP publication » (accès standard accordé, la même pour tous les sites).

## Ce qui est en place

- **Une épingle par Top 10** : `scripts/epingles.mts` génère au build une image 1000 × 1500 px (`public/epingles/<slug>.jpg`) aux couleurs du wax, avec quatre gabarits qui alternent, comme sur Keur Déco. Elle est aussi affichée sur la page du Top, avec un bouton « Épingler sur Pinterest » (sans script externe).
- **Manifeste** : `/epingles.json` (titre, description, lien vers `/top/<slug>/`, image, clé du tableau), lu par la publication automatique.
- **Import en lot** : `/epingles-pinterest.csv`, au format du modèle Pinterest (« Créer des épingles en masse »), une épingle programmée par jour.
- **Revendication du domaine** : balise `p:domain_verify` lue dans la variable GitHub `PINTEREST_VERIFY`.
- **Publication automatique** (depuis le 23 octobre 2026) : `.github/workflows/pinterest.yml`, chaque jour à 4 h 17 UTC (6 h 17 à Paris en été, 5 h 17 en hiver ; GitHub peut lancer plus tard). `scripts/pinterest-publier.mjs` prend au plus 5 épingles (`config/pinterest.json`), jamais deux du même Top le même jour, les publie dans le tableau de leur rubrique et les note dans `data/pinterest-etat.json`, enregistré sur `main`.
- **Tableaux** (`config/pinterest.json`, mêmes noms que `TABLEAUX` dans `scripts/epingles.mts`) : « Idées cadeaux africains par occasion », « Cadeaux africains pour elle, lui et les enfants », « Cadeaux africains petits prix », « Wax, bijoux et beauté afro », « Cadeaux à envoyer au pays ». Le `board_id` peut rester vide : le script prend le tableau du compte qui porte exactement ce nom.
- **Sans clé, rien n'est publié** : tant que les secrets Pinterest du dépôt n'existent pas, le passage affiche un avertissement et la liste des épingles qui partiraient.

## État au 23 octobre 2026

- Compte professionnel **Keur Kado** créé ; domaine keurkado.com revendiqué.
- 21 épingles programmées directement dans Pinterest, une par jour du 21 octobre au 10 novembre 2026 (les 21 Top 10). Elles sont notées dans `data/pinterest-etat.json` : la publication automatique ne les reprendra pas et ne prendra que les épingles des prochains Top 10.
- Clé du compte : pas encore créée.

## Créer la clé du compte Keur Kado (une fois, environ 5 minutes)

Dans le Terminal du Mac :

1. `cd ~/Dev/apps/keurkado && git pull`
2. Copier l'application Pinterest depuis Keur Déco (rien ne s'affiche) : `grep -E '^PINTEREST_APP_(ID|SECRET)=' ~/Dev/apps/keurdeco/.env >> .env`
3. Dans le navigateur, sur https://fr.pinterest.com/ : menu du compte (flèche en haut à droite) › « Vos comptes » › **Keur Kado**.
4. `npm run pinterest:auth`, ouvrir http://localhost:8085/ dans ce même navigateur, cliquer sur « Autoriser Keur Kado sur Pinterest », puis accepter sur la page Pinterest. La page vérifie que le compte a bien les tableaux de Keur Kado ; sinon elle refuse et n'enregistre rien.
5. Ctrl+C dans le Terminal, puis `npm run pinterest:secrets` : envoie `PINTEREST_APP_ID`, `PINTEREST_APP_SECRET` et `PINTEREST_REFRESH_TOKEN` dans les secrets GitHub du dépôt, sans les afficher.

À la main, si besoin : `gh secret set PINTEREST_REFRESH_TOKEN --repo teiki5320/keurkado` puis coller la valeur (même chose pour les deux autres).

## Durée de la clé

Pinterest renvoie un nouveau refresh token à chaque passage, mais l'ancien reste valable jusqu'à son échéance, environ 60 jours après sa création. Le workflow ouvre un seul ticket GitHub « refaire la clé » (pas un par jour) ; avant l'échéance, refaire les étapes 4 et 5.

## Vérifier

- *Actions* › « Publier les épingles Pinterest » › *Run workflow* (case « Mode à blanc » cochée) : le journal liste les épingles qui partiraient.
- Erreur 401 : clé expirée ou révoquée, refaire les étapes 4 et 5. « Tableau introuvable » : créer le tableau sous le nom exact de `config/pinterest.json`.
