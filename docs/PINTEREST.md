# Pinterest

## Ce qui est en place

- **Une épingle par Top 10** : `scripts/epingles.mts` génère au build une image 1000 × 1500 px (`public/epingles/<slug>.jpg`) aux couleurs du wax, avec quatre gabarits qui alternent (bandeau haut, cadre, split, bandeau bas), comme sur Keur Déco. Elle est aussi affichée sur la page du Top, avec un bouton « Épingler sur Pinterest » (sans script externe).
- **Manifeste** : `/epingles.json` (titre, description, lien, tableau, image) pour une future publication automatique par l'API, comme sur Keur Déco.
- **Import en lot** : `/epingles-pinterest.csv`, au format du modèle Pinterest (« Créer des épingles en masse »), une épingle programmée par jour.
- **Revendication du domaine** : balise `p:domain_verify` lue dans la variable GitHub `PINTEREST_VERIFY`.

## État au 21 octobre 2026

- Compte professionnel **Keur Kado** créé sur Pinterest.
- Domaine keurkado.com revendiqué (balise `p:domain_verify` présente sur le site en ligne, variable `PINTEREST_VERIFY`).
- 21 épingles programmées directement dans Pinterest, une par jour à partir du 21 octobre 2026 (les 21 lignes de `epingles-pinterest.csv`).

## Reste à faire

- Brancher la publication automatique par l'API pour les épingles suivantes (reprendre `scripts/pinterest-publier.mjs` et `.github/workflows/pinterest.yml` de Keur Déco).
- Tableaux prévus (noms dans `TABLEAUX`, `scripts/epingles.mts`) : « Idées cadeaux africains par occasion », « Cadeaux africains pour elle, lui et les enfants », « Cadeaux africains petits prix », « Wax, bijoux et beauté afro », « Cadeaux à envoyer au pays ».
