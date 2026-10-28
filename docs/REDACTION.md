# Keur Kado — règles de rédaction des contenus

À lire avant d'ajouter un produit, un Top 10, un article Conseils ou une fête du calendrier. Champs exacts : `src/lib/types.ts`.

## Règles générales

1. Tout est en **français**, ton chaleureux et concret, vouvoiement. On s'adresse à la diaspora africaine en France et à tous ceux qui cherchent un cadeau africain.
2. **Jamais inventés** : ASIN, prix, marques, chiffres. `amazonAsin` : seulement après vérification sur Amazon.fr (produit non sponsorisé, bien noté, conforme à la description ; adapter la description si besoin). `priceCents` : jamais à la main, seulement via l'API Amazon.
3. **Écrit par nous** : descriptions et sélections originales, jamais recopiées d'une fiche Amazon ou d'un autre site.
4. **Justesse culturelle** : parler de familles et de pays précis (Sénégal, Mali, Côte d'Ivoire, Cameroun…), jamais « des Africains » en général. Pas de cliché.
5. **Cosmétiques** : aucune promesse de santé (« soigne », « guérit »).
6. Pas d'image de produit Amazon : le site n'affiche que ses propres visuels (motifs wax, épingles).

## Produit (`src/lib/catalogue/<univers>.ts`)

- `description` : 2 à 3 phrases (ce que c'est, à qui ça fait plaisir).
- `recherche` : 3 à 6 mots tapés dans la recherche Amazon.fr ; `rayon` facultatif (fashion, beauty, jewelry, kitchen, toys, stripbooks…).
- `budget` : tranche habituelle de ce type de produit sur Amazon.fr.
- `voyage: true` seulement si léger, solide, sans liquide et non périssable.
- Étiquettes réalistes : 2 à 5 occasions, 1 à 4 destinataires.

## Top 10 (`src/lib/tops/<slug>.ts`, puis l'ajouter dans `src/lib/tops/index.ts`)

- Titre « 10 … » de 60 caractères au plus (il figure sur l'épingle Pinterest).
- `description` 70 à 160 caractères ; `accroche` 40 caractères environ (sous le titre de l'épingle).
- Exactement 10 produits, qui portent tous l'étiquette de la `rubrique` ; un « pourquoi » propre à la liste pour chacun.
- 2 ou 3 paragraphes de conseils, 3 ou 4 questions fréquentes.
- L'épingle (`public/epingles/<slug>.jpg`) est générée au build : rien à faire.

## Articles Conseils (`content/conseils/<slug>.md`)

```
---
title: La question posée
description: 70 à 160 caractères
date: 2026-10-17
theme: traditions | choisir | envoyer
resume: Réponse courte en 2 à 4 phrases.
produits: slug-1, slug-2, slug-3
---
Introduction, puis 4 à 6 parties « ## Titre ».
```

- 900 à 1 400 mots. L'article paraît à sa date (heure de Paris) ; le site est republié chaque lundi, mercredi et vendredi (3 articles par semaine depuis le 23 octobre 2026).
- Retouche notable d'un article déjà paru (titre, partie, produits) : ajouter ou mettre à jour `maj: AAAA-MM-JJ` dans l'en-tête ; même champ `maj` pour un Top 10 modifié. Google reçoit cette date comme date de modification (données structurées et plan du site).
- Liens internes uniquement vers des pages qui existent (vérifié par `npm test`).

## Calendrier (`src/lib/calendrier.ts`)

- Fêtes lunaires (Korité, Tabaski, Tamkharit, Magal, Maouloud) : `estimee: true`, date corrigée dès l'annonce officielle.
- Ajouter chaque automne les dates de l'année suivante.
