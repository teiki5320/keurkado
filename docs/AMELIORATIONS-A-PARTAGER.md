# Améliorations techniques de Keur Kado

**keurkado.com** · Next.js 16 en site statique (React 19, Tailwind CSS 4) · hébergé sur Cloudflare (Worker de fichiers statiques) · mis en ligne par GitHub Actions avec `wrangler deploy` · liste établie le 28 octobre 2026.

## Par où commencer

1. **Une seule adresse par page, avec des redirections définitives (point 4).** Sans elles, Google voit chaque page en double (http, www, sans barre finale). Avant la correction, Keur Kado avait 216 adresses « Page avec redirection » et 188 doublons dans la Search Console. Cela se met en place en une heure, avec un petit script et ses tests.
2. **Des vérifications qui bloquent la mise en ligne (points 37 et 38).** Lint, types et tests passent avant chaque publication. Un lien interne cassé, un titre trop long ou un Top 10 incomplet empêche la mise en ligne au lieu de partir sur le site.
3. **Des dates de modification réelles et une fiche « éditeur » unique pour Google (points 10 et 11).** Le plan du site et les données structurées donnent à Google la vraie date de chaque page, et une seule fiche Organisation reliée aux réseaux. Google sait ainsi quoi relire et à qui attribuer les pages.

## A. Mise en ligne

### 1. Site entièrement statique
- **Ce qui est fait** : Next.js construit toutes les pages en fichiers HTML dans `out/` (`output: "export"`). Il n'y a ni serveur ni base de données.
- **À quoi ça sert** : rien ne peut tomber en panne côté serveur, l'hébergement est gratuit et rapide, et il n'y a pas de données personnelles à protéger.
- **Comment savoir si un autre site en a besoin** : regarder si le site a un serveur ou une base pour des pages qui ne changent qu'à la publication. Si oui, le passage en statique est possible.
- **Où regarder** : `next.config.ts`
- **État** : fait et vérifié

### 2. Publication automatique sur Cloudflare par GitHub Actions
- **Ce qui est fait** : chaque envoi sur `main` lance lint, types, tests, construction, puis `npx wrangler deploy`.
  - Une seule publication à la fois.
  - Les clés Cloudflare ne sont données qu'à l'étape de publication.
  - La commande `wrangler pages` est interdite, avec un commentaire qui explique pourquoi.
- **À quoi ça sert** : plus de mise en ligne à la main, et une publication qui ne part jamais avec une erreur détectée par les tests.
- **Comment savoir si un autre site en a besoin** : ouvrir l'onglet Actions du dépôt sur GitHub. S'il n'y a pas de publication automatique ou pas d'étape de test avant, c'est à faire.
- **Où regarder** : `.github/workflows/deploy.yml`, `wrangler.jsonc`, `docs/DEPLOIEMENT.md`
- **État** : fait et vérifié

### 3. Publication programmée pour les articles datés
- **Ce qui est fait** : le site est republié chaque lundi, mercredi et vendredi vers minuit. Les articles « Conseils » paraissent donc à leur date sans intervention. Chaque passage programmé réactive la tâche, que GitHub coupe après 60 jours sans activité.
- **À quoi ça sert** : on écrit les articles à l'avance, ils paraissent seuls, et la programmation ne s'arrête pas en silence.
- **Comment savoir si un autre site en a besoin** : chercher `schedule:` dans `.github/workflows/`. Si le site a des contenus datés sans republication programmée, ils ne paraissent pas.
- **Où regarder** : `.github/workflows/deploy.yml`, `src/lib/data/conseils.ts`
- **État** : fait et vérifié (passages programmés réussis les 19, 26 et 28 octobre 2026)

### 4. Redirections définitives (301) vers une seule adresse
- **Ce qui est fait** : un petit script Cloudflare passe avant les fichiers. Il redirige en 301, en un seul saut, vers `https://keurkado.com/…/` :
  - les adresses `http://` et `www.` ;
  - les adresses sans barre finale ;
  - les adresses en `/index.html` ;
  - les anciennes adresses (par exemple `/cgv` vers `/conditions/`).
  Cloudflare seul répondait en 307 (redirection temporaire).
- **À quoi ça sert** : Google ne garde qu'une adresse par page. On évite les doublons et la force des liens qui se disperse.
- **Comment savoir si un autre site en a besoin** :
  ```bash
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://www.<domaine>/<page>
  ```
  Il faut obtenir `301` vers l'adresse https sans www, en une seule fois. Refaire le test sans la barre finale. Dans la Search Console, beaucoup de lignes « Page avec redirection » ou « Autre page avec balise canonique correcte » sont aussi un signe.
- **Où regarder** : `worker/index.ts`, `wrangler.jsonc` (`main`, `run_worker_first`), `tests/worker.test.ts`, `public/_redirects`
- **État** : fait et vérifié (testé en ligne le 28 octobre 2026)

### 5. Aucune adresse technique publique
- **Ce qui est fait** : l'adresse `*.workers.dev` et les aperçus publics de Cloudflare sont désactivés. Seuls `keurkado.com` et `www.keurkado.com` servent le site.
- **À quoi ça sert** : Google ne trouve pas de copie du site sur une autre adresse.
- **Comment savoir si un autre site en a besoin** : chercher `workers_dev` et `preview_urls` dans `wrangler.jsonc`. Ou, pour Cloudflare Pages, ouvrir `<projet>.pages.dev` et voir si le site y répond.
- **Où regarder** : `wrangler.jsonc`
- **État** : fait, non vérifié (l'adresse workers.dev n'a pas été testée)

### 6. Ancienne adresse GitHub Pages redirigée
- **Ce qui est fait** : l'ancienne adresse ne sert plus qu'une page `noindex` qui renvoie chaque visiteur vers la même page sur keurkado.com, avec une adresse canonique.
- **À quoi ça sert** : on ne perd ni les visiteurs ni les liens de l'ancienne adresse, et Google ne la garde pas.
- **Comment savoir si un autre site en a besoin** : ouvrir l'ancienne adresse GitHub Pages du site (`https://<compte>.github.io/<dépôt>/`). Si elle montre encore le site complet, c'est à faire.
- **Où regarder** : `.github/workflows/pages.yml`
- **État** : fait et vérifié

### 7. Vraie page 404
- **Ce qui est fait** : une adresse inconnue reçoit le code 404 et une page « introuvable » en `noindex`, avec deux liens utiles.
- **À quoi ça sert** : Google n'indexe pas de fausses pages, et le visiteur perdu repart vers le site.
- **Comment savoir si un autre site en a besoin** :
  ```bash
  curl -s -o /dev/null -w "%{http_code}\n" https://<domaine>/nexistepas/
  ```
  Il faut obtenir `404`, et non `200`.
- **Où regarder** : `src/app/not-found.tsx`, `wrangler.jsonc` (`not_found_handling`)
- **État** : fait et vérifié

## B. Google et référencement

### 8. Adresse canonique, titre et description réglés sur chaque page
- **Ce qui est fait** : une seule fonction produit pour chaque page :
  - l'adresse canonique ;
  - le titre, sans le suffixe « | Keur Kado » s'il dépasse 60 caractères ;
  - la description, coupée proprement à 155 caractères ;
  - les aperçus de partage.
- **À quoi ça sert** : des titres non coupés dans Google, et une adresse officielle par page.
- **Comment savoir si un autre site en a besoin** : afficher la source d'une page et chercher `rel="canonical"`. Vérifier aussi que les titres font 60 caractères au plus.
- **Où regarder** : `src/lib/metadata.ts`
- **État** : fait et vérifié

### 9. Liens internes et adresses données à Google toujours avec la barre finale
- **Ce qui est fait** : les liens internes et les adresses des données structurées passent par des fonctions qui ajoutent la barre finale, comme l'adresse canonique.
- **À quoi ça sert** : aucun lien du site ne coûte une redirection, et Google ne reçoit jamais d'adresse qui redirige.
- **Comment savoir si un autre site en a besoin** : dans une page construite, chercher des liens `href="/…"` sans barre finale alors que les pages sont servies avec. Il y en avait 91 ici avant la correction.
- **Où regarder** : `src/lib/config.ts` (`avecBarre`), `src/lib/json-ld.ts` (`urlPage`)
- **État** : fait et vérifié

### 10. Plan du site avec les vraies dates de modification
- **Ce qui est fait** :
  - le plan du site est généré à la construction ;
  - chaque Top 10 et chaque article porte une date de modification (champ `maj`), reprise dans le plan du site et dans les données structurées ;
  - un test vérifie que `maj` est postérieure à la date de parution ;
  - `robots.txt` donne l'adresse du plan.
- **À quoi ça sert** : Google relit en priorité les pages qui ont vraiment changé.
- **Comment savoir si un autre site en a besoin** : ouvrir `https://<domaine>/sitemap.xml`. Si toutes les pages ont la même date, ou la date du jour à chaque construction, les dates ne servent à rien.
- **Où regarder** : `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/types.ts`, `src/lib/conseils/article.ts`, `docs/REDACTION.md`
- **État** : fait et vérifié (62 adresses en ligne)

### 11. Données structurées complètes et cohérentes
- **Ce qui est fait** :
  - **Organisation** : une seule fiche, avec un identifiant commun, le logo et le lien Pinterest. Elle sert d'éditeur et d'auteur partout.
  - **Fil d'Ariane** sur les pages.
  - **Listes** (ItemList) sur les pages d'entrée et les Top 10.
  - **Article** avec images et dates de modification.
  - **Questions fréquentes** (FAQPage).
  - **WebSite** sur l'accueil.
  Le JSON est protégé contre le caractère « < ».
- **À quoi ça sert** : Google comprend qui publie et comment le site est organisé. Le fil d'Ariane s'affiche dans les résultats.
- **Comment savoir si un autre site en a besoin** : passer une page dans https://search.google.com/test/rich-results et regarder dans la Search Console la partie « Améliorations ».
- **Où regarder** : `src/lib/json-ld.ts`, `src/app/(site)/page.tsx`, `src/app/(site)/top/[slug]/page.tsx`, `src/app/(site)/conseils/[slug]/page.tsx`
- **État** : fait et vérifié (37 fils d'Ariane valides dans la Search Console le 28 octobre 2026)

### 12. Pas de balisage « Événement » pour les fêtes
- **Ce qui est fait** : le calendrier des fêtes n'utilise plus le format « Event ». Il garde seulement le fil d'Ariane.
- **À quoi ça sert** : la Search Console signalait des erreurs le 21 octobre 2026. Google réserve ce format aux vrais événements, avec un lieu et des billets (à vérifier pour le détail exact de la règle).
- **Comment savoir si un autre site en a besoin** : chercher `"Event"` dans le code. Ou regarder « Améliorations → Événements » dans la Search Console.
- **Où regarder** : `src/app/(site)/calendrier/page.tsx`
- **État** : fait et vérifié

### 13. IndexNow pour Bing et les autres moteurs
- **Ce qui est fait** : un script lit le plan du site en ligne et envoie toutes les adresses à IndexNow. La clé publique est servie à la racine du site.
- **À quoi ça sert** : Bing, DuckDuckGo, Ecosia et Yandex voient les pages nouvelles ou modifiées sans attendre leur passage.
- **Comment savoir si un autre site en a besoin** : chercher un fichier `scripts/indexnow.*`. Le lancer doit répondre 200 ou 202.
- **Où regarder** : `scripts/indexnow.mjs`, `public/<clé>.txt`
- **État** : fait et vérifié (réponse 200 le 28 octobre 2026)

### 14. Balises de vérification des services dans le layout
- **Ce qui est fait** : les balises de validation sont posées sur toutes les pages, depuis un seul endroit :
  - AdSense (`google-adsense-account`) ;
  - Pinterest (`p:domain_verify`, par variable GitHub) ;
  - Bing Webmaster Tools (`msvalidate.01`).
- **À quoi ça sert** : on vérifie le site dans chaque service sans fichier à déposer, et la vérification tient tant que la balise reste.
- **Comment savoir si un autre site en a besoin** : afficher la source de l'accueil et chercher ces trois noms. Vérifier aussi que le site est bien listé dans Bing Webmaster Tools.
- **Où regarder** : `src/app/layout.tsx`, `.github/workflows/deploy.yml` (variable `PINTEREST_VERIFY`)
- **État** : fait et vérifié (Bing a validé le site le 28 octobre 2026)

### 15. Grandes images autorisées dans Google
- **Ce qui est fait** : chaque page déclare `max-image-preview:large`.
- **À quoi ça sert** : Google peut montrer de grandes images dans Discover et dans les résultats (à vérifier pour l'effet réel).
- **Comment savoir si un autre site en a besoin** : chercher `max-image-preview` dans la source d'une page.
- **Où regarder** : `src/lib/metadata.ts`, `src/app/layout.tsx`
- **État** : fait et vérifié

## C. Vitesse

### 16. Images légères et bien chargées
- **Ce qui est fait** :
  - images en WebP ;
  - versions réduites générées à la construction (illustrations en 320 px, vignettes d'épingles en 400 px), avec `srcset` et `sizes` ;
  - largeur et hauteur toujours indiquées ;
  - chargement différé partout, sauf la première image de la page, chargée tout de suite en priorité.
- **À quoi ça sert** : moins de données sur téléphone, pas de saut de mise en page, et une première image qui s'affiche vite.
- **Comment savoir si un autre site en a besoin** : lancer PageSpeed (https://pagespeed.web.dev/) sur une page avec images, puis lire « Diffusez des images de taille appropriée » et « Largest Contentful Paint ».
- **Où regarder** : `src/components/produit/ProduitCard.tsx`, `src/components/produit/TopCard.tsx`, `scripts/epingles.mts`, `docs/IMAGES.md`
- **État** : fait et vérifié (mesure locale, voir les points faibles)

### 17. AdSense chargé après l'affichage
- **Ce qui est fait** : le script AdSense (environ 200 Ko) n'est ajouté qu'après le chargement complet de la page, quand le navigateur est libre, au plus tard 3 secondes après. La balise de validation reste dans le `<head>`.
- **À quoi ça sert** : le texte s'affiche plus vite sur téléphone. Par exemple, la page Tabaski est passée de 56 à 96 sur 100 en mesure locale.
- **Comment savoir si un autre site en a besoin** : afficher la source et voir si `adsbygoogle.js` est dans le `<head>`. Dans PageSpeed, regarder « Réduisez le JavaScript inutilisé ».
- **Où regarder** : `src/components/ads/AdsenseScript.tsx`, `src/app/layout.tsx`
- **État** : fait et vérifié (pour le chargement ; voir les points faibles pour l'examen AdSense)

### 18. Polices hébergées par le site
- **Ce qui est fait** : les polices passent par `next/font`. Elles sont servies par le site lui-même, en versions variables (un fichier par style couvre toutes les graisses), avec `display: swap`.
- **À quoi ça sert** : pas d'appel à Google Fonts, et le texte est lisible tout de suite.
- **Comment savoir si un autre site en a besoin** : chercher `fonts.googleapis.com` dans la source des pages.
- **Où regarder** : `src/app/layout.tsx`
- **État** : fait et vérifié

### 19. Cache long pour les fichiers qui ne changent pas
- **Ce qui est fait** :
  - fichiers de construction (`/_next/static/`) gardés un an par le navigateur ;
  - images gardées une semaine ;
  - pages HTML toujours revalidées.
- **À quoi ça sert** : une seconde visite ne retélécharge presque rien, et une page publiée est vue tout de suite.
- **Comment savoir si un autre site en a besoin** :
  ```bash
  curl -sI https://<domaine>/<fichier css ou js> | grep -i cache-control
  ```
  On doit voir `max-age=31536000, immutable`.
- **Où regarder** : `public/_headers`
- **État** : fait et vérifié

### 20. Pages de rubrique allégées
- **Ce qui est fait** : chaque rubrique montre au plus 18 cartes complètes. Les autres idées et les cadeaux déjà présents dans un Top 10 de la rubrique passent en liste courte, sans description.
- **À quoi ça sert** : des pages plus légères (Noël : de 419 à 242 Ko) et moins de texte répété d'une page à l'autre, que Google peut voir comme du contenu en double.
- **Comment savoir si un autre site en a besoin** : comparer le poids des pages de liste avec `curl -s <page> | wc -c`. Vérifier aussi si les mêmes fiches complètes reviennent sur beaucoup de pages.
- **Où regarder** : `src/components/produit/RubriquePage.tsx` (`CARTES_MAX`), `src/components/produit/ProduitCard.tsx` (`ProduitListe`)
- **État** : fait et vérifié

## D. Accessibilité

### 21. Lien « Aller au contenu »
- **Ce qui est fait** : un lien caché apparaît au premier appui sur Tab et mène directement au contenu.
- **À quoi ça sert** : les personnes qui naviguent au clavier ou avec un lecteur d'écran sautent le menu.
- **Comment savoir si un autre site en a besoin** : ouvrir une page et appuyer une fois sur Tab. Le lien doit apparaître.
- **Où regarder** : `src/app/layout.tsx`
- **État** : fait et vérifié

### 22. Menus nommés et page en cours signalée
- **Ce qui est fait** :
  - chaque menu a un nom (« Menu principal », « Rubriques », « Fil d'Ariane »…) ;
  - le fil d'Ariane marque la page en cours (`aria-current`) sur son dernier élément seulement ;
  - les pastilles de rubrique marquent aussi la rubrique active.
- **À quoi ça sert** : un lecteur d'écran annonce où l'on est et à quoi sert chaque menu.
- **Comment savoir si un autre site en a besoin** : chercher `aria-label` sur les balises `<nav>` et `aria-current` dans le code.
- **Où regarder** : `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/Section.tsx`, `src/components/layout/Chips.tsx`
- **État** : fait et vérifié

### 23. Textes alternatifs et boutons explicites
- **Ce qui est fait** :
  - les images ont un texte qui dit ce qu'elles sont (« Illustration : … », « Épingle : … ») ;
  - chaque bouton « Voir sur Amazon » dit pour quel produit il est (« Voir sur Amazon : nom du produit »).
- **À quoi ça sert** : un lecteur d'écran ne lit pas vingt fois « Voir sur Amazon » sans savoir pour quoi.
- **Comment savoir si un autre site en a besoin** : lancer Lighthouse (onglet Accessibilité) et regarder « Les liens n'ont pas de nom distinctif » et « Les images n'ont pas d'attribut alt ».
- **Où regarder** : `src/components/produit/ProduitCard.tsx`, `src/components/produit/TopCard.tsx`
- **État** : fait et vérifié

### 24. Animations coupées sur demande, focus visible
- **Ce qui est fait** : les animations s'arrêtent si l'appareil demande moins de mouvement (`prefers-reduced-motion`). Les boutons montrent un contour net au clavier (`focus-visible`).
- **À quoi ça sert** : le site convient aux personnes sensibles au mouvement et à celles qui naviguent au clavier.
- **Comment savoir si un autre site en a besoin** : chercher `prefers-reduced-motion` dans les feuilles de style.
- **Où regarder** : `src/app/globals.css`
- **État** : fait, non vérifié (pas testé avec le réglage du système activé)

## E. Monétisation et liens partenaires (Amazon, AdSense…)

### 25. Liens Amazon construits en un seul endroit
- **Ce qui est fait** : une fonction fabrique tous les liens Amazon.
  - Elle ajoute toujours l'identifiant partenaire.
  - Elle mène à la fiche du produit si son identifiant Amazon (ASIN) a été vérifié, sinon à une recherche Amazon.
  - Les liens portent `rel="sponsored nofollow noopener noreferrer"` et s'ouvrent dans un nouvel onglet.
- **À quoi ça sert** : aucun lien sans identifiant (donc sans commission), et des liens d'affiliation déclarés à Google comme sponsorisés.
- **Comment savoir si un autre site en a besoin** : chercher `amazon.` dans le code. Les liens écrits à la main à plusieurs endroits, ou sans `rel="sponsored"`, sont à reprendre.
- **Où regarder** : `src/lib/amazon.ts`
- **État** : fait et vérifié

### 26. Mentions d'affiliation près des liens
- **Ce qui est fait** :
  - une ligne « Lien partenaire Amazon… » sous chaque bouton ;
  - une phrase « nous touchons une petite commission » avant chaque liste de produits ;
  - la mention officielle du programme dans le pied de page, les mentions légales et les conditions.
- **À quoi ça sert** : respecter l'obligation d'informer le lecteur. Les règles exactes d'Amazon et de la loi française sont à vérifier.
- **Comment savoir si un autre site en a besoin** : ouvrir une page avec des liens Amazon et voir si une mention est visible près des boutons, pas seulement en bas de page.
- **Où regarder** : `src/lib/amazon.ts`, `src/components/produit/ProduitCard.tsx` (`MentionAffiliation`), `src/components/layout/Footer.tsx`
- **État** : fait et vérifié

### 27. Aucun prix saisi à la main, illustrations signalées
- **Ce qui est fait** :
  - le site n'affiche pas de prix relevé à la main : il montre une tranche de budget (le code prévoit un prix seulement s'il vient de l'API Amazon) ;
  - les illustrations faites par IA portent la mention « Illustration IA : l'article vendu peut différer. ».
- **À quoi ça sert** : pas de prix faux ou périmé, ce que le programme Partenaires interdit (à vérifier), et pas de confusion entre l'illustration et l'article vendu.
- **Comment savoir si un autre site en a besoin** : chercher des prix en euros écrits dans les fichiers de données.
- **Où regarder** : `src/lib/amazon.ts` (`AMAZON_PRICES_CHECKED_ON`), `src/components/produit/ProduitCard.tsx`, `docs/IMAGES.md`, `docs/AMAZON-ASIN.md`
- **État** : fait et vérifié

### 28. Emplacements AdSense prêts et sans risque
- **Ce qui est fait** :
  - les emplacements d'annonces existent dans les pages, mais n'affichent rien tant que l'identifiant du bloc n'est pas réglé ;
  - chaque annonce est marquée « Publicité » ;
  - l'emplacement disparaît si Google n'a pas d'annonce à montrer ;
  - `ads.txt` est en place.
- **À quoi ça sert** : brancher les annonces le jour de l'acceptation sans toucher aux pages, et sans laisser de cadres vides.
- **Comment savoir si un autre site en a besoin** : ouvrir `https://<domaine>/ads.txt`. Chercher aussi `adsbygoogle` dans le code et voir si un emplacement vide reste affiché.
- **Où regarder** : `src/components/ads/AdSlot.tsx`, `src/lib/config.ts` (`ADSENSE_SLOTS`), `src/app/globals.css` (`.ad-slot`), `public/ads.txt`
- **État** : commencé, pas fini (examen AdSense en cours, blocs d'annonces pas encore créés)

## F. Réseaux sociaux et partage (images de partage, Pinterest…)

### 29. Une image de partage par page
- **Ce qui est fait** :
  - chaque Top 10, chaque article et chaque rubrique a sa propre image 1200 × 630, générée à la construction, avec sa largeur et sa hauteur déclarées ;
  - les autres pages ont une image par défaut au logo.
- **À quoi ça sert** : un lien partagé sur WhatsApp, Facebook ou X montre une image propre à la page, pas toujours le logo.
- **Comment savoir si un autre site en a besoin** : chercher `og:image` dans la source de plusieurs pages. Si c'est partout la même image, ou s'il n'y en a pas, c'est à faire.
- **Où regarder** : `scripts/epingles.mts`, `src/lib/metadata.ts`, `src/app/(site)/top/[slug]/page.tsx`, `src/app/(site)/conseils/[slug]/page.tsx`
- **État** : fait et vérifié

### 30. Épingles Pinterest générées à la construction
- **Ce qui est fait** : à chaque construction, un script fabrique une épingle 1000 × 1500 par Top 10, avec 4 gabarits qui alternent. Il produit aussi un manifeste (`/epingles.json`) et un fichier d'import en lot (`/epingles-pinterest.csv`).
- **À quoi ça sert** : de nouvelles épingles sans travail à la main, toujours à jour avec les titres.
- **Comment savoir si un autre site en a besoin** : si le site vise Pinterest, regarder s'il existe un dossier d'épingles ou un fichier `epingles.json` en ligne.
- **Où regarder** : `scripts/epingles.mts`, `assets/`
- **État** : fait et vérifié

### 31. Publication Pinterest automatique
- **Ce qui est fait** : chaque matin, GitHub Actions publie les nouvelles épingles par l'API Pinterest :
  - 5 au plus par jour, jamais deux de la même page le même jour ;
  - la liste des épingles déjà publiées est gardée dans le dépôt ;
  - un mode « à blanc » montre ce qui partirait sans rien publier ;
  - un rappel s'ouvre (un seul ticket) pour refaire la clé avant son échéance d'environ 60 jours ;
  - les jetons ne sont jamais affichés.
- **À quoi ça sert** : Pinterest reste alimenté sans y penser.
- **Comment savoir si un autre site en a besoin** : regarder s'il existe un `.github/workflows/pinterest.yml` et si le compte Pinterest reçoit des épingles régulièrement.
- **Où regarder** : `.github/workflows/pinterest.yml`, `scripts/pinterest-publier.mjs`, `scripts/pinterest-lib.mjs`, `scripts/pinterest-auth.mjs`, `scripts/pinterest-secrets.mjs`, `config/pinterest.json`, `data/pinterest-etat.json`, `docs/PINTEREST.md`
- **État** : fait et vérifié (passages réussis les 27 et 28 octobre 2026)

### 32. Icônes et logos tirés d'un seul fichier
- **Ce qui est fait** : un script tire du logo d'origine toutes les versions utiles :
  - icône d'onglet ;
  - icône d'écran d'accueil iPhone ;
  - logo 512 px pour Google ;
  - emblème pour l'en-tête et les épingles.
- **À quoi ça sert** : des icônes nettes partout, refaites en une commande si le logo change.
- **Comment savoir si un autre site en a besoin** : ouvrir `https://<domaine>/apple-icon.png` et `https://<domaine>/icon.png`.
- **Où regarder** : `scripts/visuels-marque.mts`, `src/app/icon.png`, `src/app/apple-icon.png`, `public/brand/`
- **État** : fait et vérifié

## G. Sécurité et vie privée (en-têtes, cookies, consentement)

### 33. En-têtes de sécurité
- **Ce qui est fait** : toutes les pages reçoivent :
  - une politique de contenu (CSP) qui n'autorise que le site et les domaines Google utiles à AdSense et au bandeau de consentement ;
  - HSTS (https obligatoire pendant 2 ans) ;
  - `nosniff` ;
  - une politique de référent ;
  - une interdiction d'affichage dans le cadre d'un autre site ;
  - le blocage de la caméra, du micro et de la position.
- **À quoi ça sert** : limiter l'injection de scripts étrangers, le détournement de clics et les fuites d'adresses.
- **Comment savoir si un autre site en a besoin** : passer le site dans https://securityheaders.com/. Ou lancer :
  ```bash
  curl -sI https://<domaine>/
  ```
  Puis chercher `content-security-policy` et `strict-transport-security` dans la réponse.
- **Où regarder** : `public/_headers`
- **État** : fait et vérifié

### 34. Consentement aux cookies par le bandeau de Google
- **Ce qui est fait** :
  - le site ne pose aucun cookie à lui ;
  - le consentement passe par le bandeau de Google (outil « Confidentialité et messages » d'AdSense) ;
  - un lien « Gérer mes cookies » dans le pied de page rouvre ce bandeau, ou mène à la politique de confidentialité s'il n'est pas chargé.
- **À quoi ça sert** : le visiteur peut changer d'avis à tout moment. La conformité exacte au RGPD et aux règles de Google pour l'Europe est à vérifier.
- **Comment savoir si un autre site en a besoin** : ouvrir le site en navigation privée depuis la France et voir si le bandeau apparaît. Chercher ensuite un lien pour rouvrir ses choix.
- **Où regarder** : `src/components/ads/CookieSettingsLink.tsx`, `src/components/layout/Footer.tsx`, `src/app/(legal)/confidentialite/page.tsx`
- **État** : fait, non vérifié (le bandeau dépend du réglage dans AdSense)

### 35. Secrets tenus hors du code
- **Ce qui est fait** :
  - les clés (Cloudflare, Pinterest) sont des secrets GitHub, donnés seulement à l'étape qui en a besoin ;
  - les fichiers `.env` ne sont jamais envoyés (`.gitignore`) ;
  - les scripts Pinterest passent la clé à GitHub sans l'afficher ;
  - seuls des identifiants publics par nature sont dans le code (éditeur AdSense, clé IndexNow, codes de vérification).
- **À quoi ça sert** : un dépôt public sans fuite de clé.
- **Comment savoir si un autre site en a besoin** :
  ```bash
  git grep -n -i -E "token|secret|password|api_key"
  ```
  Vérifier aussi que `.env` est dans `.gitignore`.
- **Où regarder** : `.github/workflows/deploy.yml`, `.github/workflows/pinterest.yml`, `scripts/pinterest-secrets.mjs`, `.gitignore`
- **État** : fait et vérifié

### 36. Pas de signature du logiciel serveur
- **Ce qui est fait** : l'en-tête `X-Powered-By: Next.js` est désactivé.
- **À quoi ça sert** : ne pas annoncer l'outil utilisé à ceux qui cherchent des failles connues.
- **Comment savoir si un autre site en a besoin** :
  ```bash
  curl -sI https://<domaine>/ | grep -i powered
  ```
- **Où regarder** : `next.config.ts` (`poweredByHeader`)
- **État** : fait et vérifié

## H. Applications (si le site a une app iOS ou Android)

Rien de particulier : Keur Kado n'a pas d'application.

## I. Méthode : outils de contrôle, tests, tâches automatiques

### 37. Contrôle bloquant avant chaque publication
- **Ce qui est fait** : la publication s'arrête si le lint, la vérification des types ou un test échoue.
- **À quoi ça sert** : une erreur détectable ne part jamais en ligne.
- **Comment savoir si un autre site en a besoin** : lire le workflow de publication et vérifier que `npm test` (ou l'équivalent) passe avant l'étape de mise en ligne.
- **Où regarder** : `.github/workflows/deploy.yml`, `package.json` (scripts `lint`, `typecheck`, `test`)
- **État** : fait et vérifié

### 38. Tests de cohérence des contenus
- **Ce qui est fait** : 7 tests vérifient notamment :
  - catalogue complet, sans doublon ;
  - Top 10 à exactement 10 produits existants ;
  - liens internes des articles et du calendrier vers des pages qui existent ;
  - titres de 60 caractères au plus ;
  - texte propre à chaque rubrique (300 mots ou plus, sans intertitre répété) ;
  - dates de modification valides ;
  - calendrier dans l'ordre.
- **À quoi ça sert** : attraper les erreurs de contenu qui nuisent au référencement (liens cassés, pages trop maigres) avant la publication.
- **Comment savoir si un autre site en a besoin** : s'il n'existe pas de dossier `tests/`, ou si aucun test ne vérifie les liens internes.
- **Où regarder** : `tests/coherence.test.ts`
- **État** : fait et vérifié (13 tests au total, tous réussis le 28 octobre 2026)

### 39. Tests des redirections et de Pinterest
- **Ce qui est fait** :
  - 3 tests vérifient les redirections du script Cloudflare ;
  - 1 test vérifie les règles de choix des épingles Pinterest (5 au plus, jamais deux de la même page le même jour) ;
  - 2 tests vérifient la cohérence de leur configuration et du fichier d'état.
- **À quoi ça sert** : une erreur dans les redirections peut sortir tout le site de Google. Les tests l'empêchent de partir en ligne.
- **Comment savoir si un autre site en a besoin** : si le site a des redirections ou des publications automatiques sans aucun test.
- **Où regarder** : `tests/worker.test.ts`, `tests/pinterest.test.ts`
- **État** : fait et vérifié

### 40. Fiches de suivi à jour dans le dépôt
- **Ce qui est fait** : quatre fiches décrivent l'état réel du site (hébergement, marketing, publication, README). Une règle impose de les mettre à jour dans le même envoi que tout changement, et une tâche du matin les compare à la réalité.
- **À quoi ça sert** : savoir d'un coup d'œil où en est chaque site, sans informations périmées.
- **Comment savoir si un autre site en a besoin** : regarder si `docs/INFRA.md`, `docs/MARKETING.md` et `docs/PUBLICATION.md` existent et disent la vérité d'aujourd'hui.
- **Où regarder** : `CLAUDE.md`, `docs/INFRA.md`, `docs/MARKETING.md`, `docs/PUBLICATION.md`, `README.md`
- **État** : fait et vérifié

### 41. Règles d'écriture vérifiables
- **Ce qui est fait** : un document fixe les règles de chaque type de contenu :
  - longueurs ;
  - ASIN seulement après vérification ;
  - date `maj` en cas de retouche ;
  - pas de promesse de santé.
  Plusieurs de ces règles sont contrôlées par les tests.
- **À quoi ça sert** : le même niveau de qualité, quelle que soit la personne ou la session qui écrit.
- **Comment savoir si un autre site en a besoin** : regarder s'il existe un `docs/REDACTION.md` ou équivalent.
- **Où regarder** : `docs/REDACTION.md`, `docs/AMAZON-ASIN.md`
- **État** : fait et vérifié

### 42. Tâches automatiques sur le Mac
- **Ce qui est fait** : des tâches planifiées de Claude, rangées hors du dépôt, s'occupent chaque jour du site :
  - « Sites du jour » : lancement de Pinterest, référencement de Keur Kado le dimanche (avec IndexNow), vérification des produits Amazon ;
  - « Fiches du jour » : mise à jour des fiches ;
  - « Point du matin » : résumé de la journée.
  Le référencement est noté page par page dans un journal.
- **À quoi ça sert** : un suivi régulier sans y penser, et une trace de ce qui a été changé et de son effet.
- **Comment savoir si un autre site en a besoin** : regarder si le site figure dans `~/.claude/consignes-sites-du-jour/referencement.md` (liste des sites par jour), et s'il a un `docs/referencement.md`.
- **Où regarder** : `docs/referencement.md`, et hors du dépôt `~/.claude/scheduled-tasks/sites-du-jour/SKILL.md`, `~/.claude/consignes-sites-du-jour/referencement.md`
- **État** : fait et vérifié (passages du 28 octobre 2026 réussis)

## Points faibles connus

1. **`/404/` répond 200.** L'adresse de la page d'erreur elle-même est servie normalement, en `noindex`. Les vraies adresses inconnues répondent bien 404. Cela peut toucher tous les sites Next.js en export statique.
2. **CSP avec `'unsafe-inline'` pour les scripts.** Next.js en export statique a besoin de scripts en ligne. La protection contre l'injection de scripts est donc plus faible. Même limite sur les autres sites Next.js statiques.
3. **Pages HTML lourdes.** La page Noël fait 287 Ko non compressée, mais 22 Ko une fois compressée, surtout à cause des données internes de Next.js. Ce n'est pas bloquant, mais c'est à surveiller sur les sites avec beaucoup de pages de liste.
4. **Vitesse réelle inconnue.** Les mesures ont été faites en local, sur un Mac parfois occupé. Le quota de PageSpeed en ligne était dépassé le 28 octobre, et Google n'a pas encore de données de vrais visiteurs (trafic trop faible).
5. **AdSense chargé tard : effet sur l'examen à vérifier.** Si l'examen signale un code introuvable, il faudra remettre le script en tête de page. Même question pour tout site qui retarde AdSense.
6. **Aucune annonce affichée pour l'instant.** Les blocs AdSense seront à créer après l'acceptation : pas de revenu publicitaire en attendant.
7. **42 produits sur 98 mènent à une recherche Amazon**, faute de produit assez fidèle trouvé. La commission sur ces liens de recherche est à vérifier.
8. **Questions fréquentes (FAQPage) sans affichage enrichi.** Google réserve maintenant cet affichage à certains sites (à vérifier). Le balisage ne coûte rien, mais n'apporte peut-être plus rien.
9. **Une date de mise à jour à changer à la main.** La date des rubriques, du quiz et des pages fixes (`MISE_A_JOUR` dans `src/app/sitemap.ts`) n'avance que si on la modifie. Elle peut donc mentir si on l'oublie.
10. **Clé Pinterest à refaire environ tous les 60 jours,** à la main, sur le Mac. Un ticket GitHub le rappelle.
11. **Pas de test sur les pages construites.** Les tests vérifient les données, pas le HTML final : un JSON-LD invalide ou une balise manquante ne serait pas détecté automatiquement.
12. **Demandes d'indexation Google limitées.** La Search Console n'accepte que quelques demandes par jour (quota atteint après une seule le 28 octobre). Il faut compter sur le plan du site et la patience, sur tous les sites.
