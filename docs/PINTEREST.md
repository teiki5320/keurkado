# Pinterest

## Ce qui est en place

- **Une épingle par Top 10** : `scripts/epingles.mts` génère au build une image 1000 × 1500 px (`public/epingles/<slug>.jpg`) aux couleurs du wax, avec quatre gabarits qui alternent (bandeau haut, cadre, split, bandeau bas), comme sur Keur Déco. Elle est aussi affichée sur la page du Top, avec un bouton « Épingler sur Pinterest » (sans script externe).
- **Manifeste** : `/epingles.json` (titre, description, lien, tableau, image) pour une future publication automatique par l'API, comme sur Keur Déco.
- **Import en lot** : `/epingles-pinterest.csv`, au format du modèle Pinterest (« Créer des épingles en masse »), une épingle programmée par jour.
- **Revendication du domaine** : balise `p:domain_verify` lue dans la variable GitHub `PINTEREST_VERIFY`.

## À faire à la main

1. Créer le compte professionnel **Keur Kado** (adresse dédiée, par exemple keurkado@toakeur.com).
2. Créer les tableaux (noms dans `TABLEAUX`, `scripts/epingles.mts`) : « Idées cadeaux africains par occasion », « Cadeaux africains pour elle, pour lui, pour les enfants », « Cadeaux africains petits prix », « Wax, bijoux et beauté afro », « Cadeaux à envoyer au pays ».
3. Importer `epingles-pinterest.csv` (après publication du site), ou épingler depuis chaque page Top 10.
4. Quand keurkado.com sera en ligne : revendiquer le domaine (balise HTML, variable `PINTEREST_VERIFY`), puis brancher la publication automatique par l'API (reprendre `scripts/pinterest-publier.mjs` et `.github/workflows/pinterest.yml` de Keur Déco).
