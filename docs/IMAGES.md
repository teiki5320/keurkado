# Images des cadeaux

- Une illustration par produit, **créée par IA** (OpenArt, modèle Kling 3 Omni, octobre 2026) à partir de la description du produit : photo de produit sur fond sable uni, lumière chaude, sans texte, sans marque, sans personne.
- Fichiers : `public/produits/<slug>.webp` (480 × 480). Une carte produit affiche l'image si le fichier existe, sinon le pictogramme de l'univers.
- Versions réduites générées au build par `scripts/epingles.mts` (non versionnées) : `public/produits/320/<slug>.webp` pour les cartes (srcset), et pour le partage `public/epingles/vignettes/` (épingles 400 et 700 px), `partage/` (Top 10 en 1200 × 630), `conseils/` et `rubriques/` (une image 1200 × 630 par article et par rubrique).
- Ce ne sont pas des photos des articles vendus : chaque carte porte la mention « Illustration IA : l'article vendu peut différer. », sous la ligne « Lien partenaire Amazon. Prix, disponibilité et vendeur sont indiqués sur Amazon. », reprise dans les mentions légales et les conditions.
- Nouveau produit : générer une image dans le même style (même fin de consigne : « Placed on a plain warm sand-beige background (#e6d8bf), soft warm natural light from the upper left… No text, no letters, no logo, no brand name, no people, no hands. »), puis la convertir en WebP 480 px.
- Les vraies photos des produits ne pourront venir que de l'API Amazon (Product Advertising API).
