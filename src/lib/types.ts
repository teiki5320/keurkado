import type { BudgetSlug, DestinataireSlug, OccasionSlug, UniversSlug } from "./taxonomie";

/**
 * Idée cadeau du catalogue (src/lib/catalogue/*.ts).
 * Un produit apparaît automatiquement sur toutes les pages dont il porte l'étiquette
 * (occasion, destinataire, budget, univers, « à envoyer au pays ») et dans le quiz.
 */
export interface Produit {
  /** Identifiant unique, en minuscules avec tirets (« coffret-beurre-de-karite »). */
  slug: string;
  /** Nom court affiché sur la carte (« Coffret beurre de karité et savon noir »). */
  nom: string;
  /** Deux à trois phrases écrites par nous : ce que c'est et pourquoi ça fait plaisir. */
  description: string;
  univers: UniversSlug;
  occasions: OccasionSlug[];
  pour: DestinataireSlug[];
  /** Tranche de prix habituelle de ce type de produit sur Amazon.fr (indicative). */
  budget: BudgetSlug;
  /** Voyage bien : léger, incassable, non périssable, sans liquide en grande quantité (« Cadeaux à envoyer au pays »). */
  voyage: boolean;
  /** Mots tapés dans la recherche Amazon quand l'ASIN n'est pas encore vérifié. */
  recherche: string;
  /** Rayon de la recherche Amazon (paramètre « i »), facultatif : fashion, beauty, kitchen, toys, jewelry… */
  rayon?: string;
  /** ASIN vérifié à la main sur Amazon.fr (jamais inventé) : le bouton mène alors à la fiche du produit. */
  amazonAsin?: string;
  /**
   * Prix en centimes, affiché seulement s'il est rempli. Règle du programme Partenaires : uniquement un prix fourni
   * par l'API Amazon (Product Advertising API) et rafraîchi toutes les 24 h — jamais un prix recopié à la main.
   */
  priceCents?: number;
}

/** Une ligne d'un Top 10 : le produit et la raison propre à cette liste. */
export interface TopItem {
  produit: string;
  /** Deux à quatre phrases : pourquoi ce cadeau pour cette occasion ou cette personne. */
  pourquoi: string;
}

/** Page « Top 10 » (src/lib/tops/*.ts), avec son épingle Pinterest. */
export interface Top {
  slug: string;
  /** Titre de la page et de l'épingle (« 10 idées cadeaux pour la Tabaski »). */
  titre: string;
  /** Description pour Google et Pinterest (70 à 160 caractères). */
  description: string;
  /** Date de mise en ligne (AAAA-MM-JJ). */
  date: string;
  /** Page de rattachement, pour le fil d'Ariane et les liens « Voir aussi » (« occasion/tabaski »). */
  rubrique: string;
  /**
   * Chapô : 2 à 4 phrases, au modèle Keurbook : le critère de classement, le n° 1 nommé,
   * et « C'est notre classement, pas un palmarès officiel. »
   */
  intro: string;
  /** Exactement 10 produits. */
  items: TopItem[];
  /** Conseils pour bien choisir : 2 ou 3 paragraphes. */
  conseils: string[];
  /** « Par où commencer » : 2 ou 3 phrases qui orientent vers 2 ou 3 cadeaux de la liste selon la personne ou le budget. */
  commencer: string;
  /** Questions fréquentes (données structurées FAQPage). */
  faq: Array<{ question: string; reponse: string }>;
  /** Phrase d'accroche de l'épingle, sous le titre (40 caractères environ). */
  accroche: string;
}

/** Fête du calendrier (src/lib/calendrier.ts). */
export interface Fete {
  slug: string;
  nom: string;
  /** Date (AAAA-MM-JJ) ; pour une fête de plusieurs jours, le premier jour. */
  date: string;
  /** Fête du calendrier lunaire : date estimée, confirmée par l'observation de la lune. */
  estimee?: boolean;
  /** Où et par qui elle est fêtée, et la place du cadeau : 2 à 3 phrases. */
  texte: string;
  /** Page d'idées cadeaux liée (« /occasion/tabaski », « /top/… »). */
  lien?: { href: string; label: string };
}
