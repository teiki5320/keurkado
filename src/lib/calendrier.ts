import { topsDe } from "./tops";
import type { Fete, Top } from "./types";

/**
 * Calendrier des fêtes africaines et des jours où l'on offre, d'octobre 2026 à fin 2027.
 * Les fêtes musulmanes suivent le calendrier lunaire : leur date est estimée (à un jour près)
 * et confirmée par l'observation de la lune. À mettre à jour chaque année (dates de l'année suivante).
 */
export const FETES: Fete[] = [
  {
    slug: "noel-2026",
    nom: "Noël",
    date: "2026-12-25",
    texte:
      "Fêté par les familles chrétiennes, et souvent par toute la famille en France, quelle que soit la religion. C'est le grand moment des cadeaux pour les enfants. Pour un colis au pays, envoyez-le avant la fin novembre.",
    lien: { href: "/occasion/noel", label: "Idées cadeaux de Noël" },
  },
  {
    slug: "saint-valentin-2027",
    nom: "Saint-Valentin",
    date: "2027-02-14",
    texte: "La fête des amoureux : un bijou, un parfum ou un accessoire en wax pour dire je t'aime avec un peu de nos couleurs.",
    lien: { href: "/occasion/saint-valentin", label: "Idées cadeaux pour la Saint-Valentin" },
  },
  {
    slug: "korite-2027",
    nom: "Korité (Aïd el-Fitr)",
    date: "2027-03-10",
    estimee: true,
    texte:
      "La fin du ramadan. On se rend à la prière en habits neufs, on se demande pardon et on rend visite à la famille. Les enfants reçoivent cadeaux et petites pièces.",
    lien: { href: "/occasion/korite", label: "Idées cadeaux pour la Korité" },
  },
  {
    slug: "independance-senegal-2027",
    nom: "Fête de l'indépendance du Sénégal",
    date: "2027-04-04",
    texte: "Le Sénégal fête son indépendance (1960) avec un grand défilé à Dakar. Une belle occasion d'offrir un cadeau aux couleurs du pays.",
  },
  {
    slug: "tabaski-2027",
    nom: "Tabaski (Aïd el-Kébir)",
    date: "2027-05-16",
    estimee: true,
    texte:
      "La plus grande fête de l'année en Afrique de l'Ouest : tenues neuves, repas en famille autour du mouton, visites. On prépare tissus et cadeaux plusieurs semaines à l'avance.",
    lien: { href: "/occasion/tabaski", label: "Idées cadeaux pour la Tabaski" },
  },
  {
    slug: "fete-nationale-cameroun-2027",
    nom: "Fête nationale du Cameroun",
    date: "2027-05-20",
    texte: "Le Cameroun célèbre son unité nationale le 20 mai, avec défilés et fêtes dans tout le pays et dans la diaspora.",
  },
  {
    slug: "journee-de-l-afrique-2027",
    nom: "Journée de l'Afrique",
    date: "2027-05-25",
    texte: "Anniversaire de la création de l'Organisation de l'unité africaine (1963), fêté sur tout le continent et dans la diaspora.",
  },
  {
    slug: "fete-des-meres-2027",
    nom: "Fête des mères (France)",
    date: "2027-05-30",
    texte: "Le dernier dimanche de mai en France. Le moment de gâter maman, ici ou au pays : pensez à envoyer votre colis une à deux semaines avant.",
    lien: { href: "/occasion/fete-des-meres", label: "Idées cadeaux pour la fête des mères" },
  },
  {
    slug: "tamkharit-2027",
    nom: "Tamkharit (Achoura)",
    date: "2027-06-15",
    estimee: true,
    texte:
      "Le nouvel an musulman se fête au Sénégal dix jours après le début de l'année : grand couscous en famille le soir, et les enfants qui passent de maison en maison (le « tajaboone »).",
  },
  {
    slug: "fete-des-peres-2027",
    nom: "Fête des pères (France)",
    date: "2027-06-20",
    texte: "Le troisième dimanche de juin en France. Une chemise en wax, un parfum ou un service à thé pour papa.",
    lien: { href: "/occasion/fete-des-peres", label: "Idées cadeaux pour la fête des pères" },
  },
  {
    slug: "independance-rdc-2027",
    nom: "Fête de l'indépendance de la RDC",
    date: "2027-06-30",
    texte: "La République démocratique du Congo fête son indépendance (1960). La diaspora congolaise de France célèbre souvent l'événement en musique.",
  },
  {
    slug: "magal-touba-2027",
    nom: "Grand Magal de Touba",
    date: "2027-07-23",
    estimee: true,
    texte:
      "Le grand pèlerinage des mourides à Touba, au Sénégal, en souvenir du départ en exil de Cheikh Ahmadou Bamba. Des millions de fidèles s'y rendent chaque année.",
  },
  {
    slug: "independance-cote-d-ivoire-2027",
    nom: "Fête de l'indépendance de la Côte d'Ivoire",
    date: "2027-08-07",
    texte: "La Côte d'Ivoire célèbre son indépendance (1960) le 7 août, avec des festivités dans tout le pays.",
  },
  {
    slug: "maouloud-2027",
    nom: "Maouloud (Gamou)",
    date: "2027-08-14",
    estimee: true,
    texte:
      "La naissance du Prophète. Au Sénégal, le Gamou de Tivaouane réunit des foules immenses ; ailleurs, on se retrouve pour des veillées de chants et de prières.",
  },
  {
    slug: "independance-mali-2027",
    nom: "Fête de l'indépendance du Mali",
    date: "2027-09-22",
    texte: "Le Mali fête son indépendance (1960) le 22 septembre, une date importante pour la grande communauté malienne de France.",
  },
  {
    slug: "noel-2027",
    nom: "Noël",
    date: "2027-12-25",
    texte: "Retour du grand moment des cadeaux en famille. Commandez tôt : les délais s'allongent en décembre.",
    lien: { href: "/occasion/noel", label: "Idées cadeaux de Noël" },
  },
];

/** Fêtes à venir à partir d'une date (AAAA-MM-JJ), dans l'ordre. */
export function fetesAVenir(aujourdhui: string): Fete[] {
  return FETES.filter((f) => f.date >= aujourdhui).sort((a, b) => a.date.localeCompare(b.date));
}

/** Nombre de jours entre deux dates AAAA-MM-JJ. */
export function joursEntre(de: string, a: string): number {
  return Math.round((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${de}T00:00:00Z`)) / 86_400_000);
}

/** Top 10 de la fête, quand son lien mène à une occasion qui en a un (Noël → « 10 idées cadeaux de Noël… »). */
export function topDeLaFete(f: Fete): Top | undefined {
  const occasion = f.lien?.href.match(/^\/occasion\/([a-z0-9-]+)$/)?.[1];
  return occasion ? topsDe(`occasion/${occasion}`)[0] : undefined;
}
