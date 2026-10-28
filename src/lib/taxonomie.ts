/**
 * Les quatre façons de chercher un cadeau : occasion, destinataire, budget, univers.
 * Chaque entrée a sa page (/occasion/<slug>, /pour/<slug>, /budget/<slug>, /univers/<slug>)
 * et sert d'étape au quiz « Trouve le cadeau ».
 */
export interface Rubrique {
  slug: string;
  /** Nom court (menus, quiz, étiquettes). */
  nom: string;
  /** Titre de la page (h1). */
  titre: string;
  /** Description pour Google (70 à 160 caractères). */
  description: string;
  /** Chapô sous le titre. */
  intro: string;
  /** Texte de bas de page : 2 paragraphes. */
  texte: [string, string];
}

export const OCCASIONS = [
  {
    slug: "tabaski",
    nom: "Tabaski",
    titre: "Idées cadeaux pour la Tabaski",
    description: "Idées cadeaux pour la Tabaski (Aïd el-Kébir) : tenues, tissus, parfums, bijoux et douceurs pour gâter la famille, en France ou au pays.",
    intro: "La Tabaski, c'est la fête de la famille : on se fait beau, on partage le repas et on gâte les siens. Voici des cadeaux qui font honneur à ce grand jour.",
    texte: [
      "La Tabaski (Aïd el-Kébir) est la plus grande fête de l'année dans une grande partie de l'Afrique de l'Ouest. Bien avant le jour J, on prépare les tenues neuves, on choisit les tissus, on passe chez le tailleur. Un beau bazin, un parfum, des bijoux ou un joli plateau de service sont des cadeaux toujours appréciés.",
      "Si vous ne pouvez pas rentrer, un colis envoyé quelques semaines avant la fête fait le plus grand plaisir : privilégiez des cadeaux légers et solides, qui voyagent bien. Pensez aussi aux enfants, pour qui la Tabaski rime avec habits neufs et petits présents.",
    ],
  },
  {
    slug: "korite",
    nom: "Korité",
    titre: "Idées cadeaux pour la Korité",
    description: "Qu'offrir pour la Korité (Aïd el-Fitr) ? Tenues, parfums, coffrets, cadeaux pour enfants et douceurs pour fêter la fin du ramadan.",
    intro: "La Korité marque la fin du ramadan : on se pardonne, on se rend visite et on fait plaisir. Des idées pour toute la famille, petits et grands.",
    texte: [
      "La Korité (Aïd el-Fitr) clôt le mois de ramadan. Le matin, on se rend à la prière en habits neufs, puis on passe la journée en visites, à demander pardon et à partager. C'est aussi un jour où les enfants reçoivent cadeaux et petites pièces.",
      "Parfums, encens, tenues, bijoux discrets ou beaux objets pour recevoir : les cadeaux de Korité célèbrent le partage et l'élégance. Pour les proches restés au pays, un colis préparé à l'avance arrive à temps si vous l'envoyez dès le début du ramadan.",
    ],
  },
  {
    slug: "noel",
    nom: "Noël",
    titre: "Idées cadeaux de Noël africains",
    description: "Cadeaux de Noël africains : wax, bijoux, beauté afro, déco, livres et jouets pour mettre un peu d'Afrique sous le sapin.",
    intro: "Un Noël aux couleurs de l'Afrique : des cadeaux qui ont du sens, pour faire plaisir et transmettre un peu de nos racines sous le sapin.",
    texte: [
      "Que l'on fête Noël en famille ou entre amis, un cadeau africain sort de l'ordinaire : un accessoire en wax, un bijou inspiré des perles du continent, un coffret de soins au karité ou une poupée qui ressemble à nos enfants. Ce sont des cadeaux qui racontent une histoire.",
      "Pour Noël, pensez à commander tôt : les produits artisanaux partent vite et les délais s'allongent en décembre. Et si une partie de la famille vit au pays, envoyez votre colis dès la mi-novembre.",
    ],
  },
  {
    slug: "saint-valentin",
    nom: "Saint-Valentin",
    titre: "Idées cadeaux africains pour la Saint-Valentin",
    description: "Cadeaux africains pour la Saint-Valentin : bijoux, wax, parfums, soins au karité et objets à partager pour dire je t'aime avec un peu de chez nous.",
    intro: "Le 14 février, on dit je t'aime avec un cadeau qui a du sens : un bijou, un parfum, un soin, ou un objet à partager à deux.",
    texte: [
      "La Saint-Valentin se fête en France comme dans beaucoup de grandes villes d'Afrique, d'Abidjan à Dakar. Un bijou inspiré du continent, un parfum, un coffret de soins au karité ou une tenue en wax font des cadeaux qui sortent de l'ordinaire.",
      "Pensez aussi aux cadeaux à partager : un service à thé pour les longues soirées, un jeu d'awalé pour deux, un livre de recettes pour cuisiner ensemble. L'attention compte plus que le prix.",
    ],
  },
  {
    slug: "mariage",
    nom: "Mariage",
    titre: "Idées cadeaux de mariage africain",
    description: "Cadeaux de mariage africain : pagnes, vaisselle de fête, déco, bijoux et coffrets pour les mariés, à offrir ou à rapporter au pays.",
    intro: "Un mariage africain, c'est une fête qui réunit deux familles. Des cadeaux pour les mariés, utiles pour leur foyer et beaux pour la fête.",
    texte: [
      "Selon les pays et les familles, le mariage se fait en plusieurs temps : dot, cérémonie religieuse, mariage civil, grande fête. À chaque étape, on offre : des pagnes et des tissus, de la vaisselle pour recevoir, du linge de maison, des bijoux pour la mariée.",
      "Pour un cadeau commun entre amis ou collègues, choisissez un bel objet pour la maison du couple. Pour la famille proche, un ensemble de pagnes ou un service à thé restent des valeurs sûres.",
    ],
  },
  {
    slug: "bapteme",
    nom: "Baptême",
    titre: "Idées cadeaux de baptême africain",
    description: "Cadeaux de baptême africain pour le bébé et la maman : porte-bébé en wax, bijoux de naissance, livres, linge et soins naturels.",
    intro: "Le baptême, ou la cérémonie du nom, accueille l'enfant dans la famille. Des cadeaux doux pour le bébé et bien pensés pour la jeune maman.",
    texte: [
      "Le baptême (le « ngente » au Sénégal) a lieu le plus souvent une semaine après la naissance, le jour où l'enfant reçoit son nom. La maman reçoit des pagnes et des soins, le bébé des habits, des bijoux de naissance et des petits objets qui le suivront longtemps.",
      "Les cadeaux les plus appréciés sont souvent les plus utiles : porte-bébé, linge, soins naturels pour la peau du nourrisson. Un livre d'enfant avec des héros qui lui ressemblent est aussi un très beau premier cadeau.",
    ],
  },
  {
    slug: "anniversaire",
    nom: "Anniversaire",
    titre: "Idées cadeaux d'anniversaire africains",
    description: "Cadeaux d'anniversaire africains pour elle, pour lui et pour les enfants : mode wax, bijoux, beauté afro, déco et jeux.",
    intro: "Un anniversaire, c'est l'occasion d'offrir un cadeau qui ressemble vraiment à la personne : un peu de style, un peu de racines, beaucoup d'attention.",
    texte: [
      "Pour un anniversaire, partez de ce que la personne aime : la mode, la cuisine, la lecture, la déco, les soins. Il y a toujours une version africaine du cadeau qui lui fera plaisir, plus originale qu'un cadeau acheté au hasard.",
      "Pour les enfants, les jeux et les livres avec des personnages noirs ont une vraie valeur : ils permettent de se reconnaître dans les histoires. Pour les adultes, un accessoire en wax ou un bijou fait main a toujours son effet.",
    ],
  },
  {
    slug: "fete-des-meres",
    nom: "Fête des mères",
    titre: "Idées cadeaux pour la fête des mères",
    description: "Cadeaux africains pour la fête des mères : foulards et tenues en wax, bijoux, soins au karité, parfums et déco pour gâter maman.",
    intro: "Maman mérite ce qu'il y a de plus beau. Des cadeaux qui la mettent à l'honneur, pour celle qui s'est toujours occupée de tout le monde.",
    texte: [
      "En France, la fête des mères a lieu le dernier dimanche de mai (sauf si ce jour est celui de la Pentecôte). C'est l'occasion de gâter une maman qui a souvent tout donné, ici ou au pays : un beau foulard de tête, un ensemble en wax, un bijou, un coffret de soins.",
      "Si votre mère vit loin, envoyez votre cadeau une à deux semaines avant. Un petit mot écrit à la main, glissé dans le paquet, compte souvent autant que le cadeau lui-même.",
    ],
  },
  {
    slug: "fete-des-peres",
    nom: "Fête des pères",
    titre: "Idées cadeaux pour la fête des pères",
    description: "Cadeaux africains pour la fête des pères : chemises et accessoires en wax, montres, parfums, livres et objets pour le thé.",
    intro: "Pour papa, des cadeaux élégants et pratiques, avec ce petit air de chez nous qui le fera sourire.",
    texte: [
      "En France, la fête des pères tombe le troisième dimanche de juin. Une chemise ou une pochette en wax, un accessoire en cuir, un parfum, un service à thé ou un bon livre : il y a de quoi faire plaisir à tous les papas, des plus classiques aux plus coquets.",
      "Les papas disent souvent qu'ils n'ont besoin de rien : un cadeau qui leur rappelle le pays ou qui accompagne un moment qu'ils aiment, comme le thé, fait toujours mouche.",
    ],
  },
] as const satisfies readonly Rubrique[];
export const DESTINATAIRES = [
  {
    slug: "maman",
    nom: "Maman",
    titre: "Cadeaux africains pour maman",
    description: "Idées cadeaux africains pour une maman : wax, foulards de tête, bijoux, soins au karité, déco et objets pour recevoir.",
    intro: "Pour la reine de la maison : des cadeaux beaux, utiles et pleins de reconnaissance.",
    texte: [
      "Une maman africaine aime recevoir, s'habiller pour les grandes occasions et prendre soin des siens. Les cadeaux qui l'honorent : un beau tissu, un foulard de tête, un bijou, des soins naturels, ou un bel objet pour servir à table.",
      "Si elle vit au pays, choisissez des cadeaux légers et solides, qui voyagent bien dans une valise ou un colis.",
    ],
  },
  {
    slug: "papa",
    nom: "Papa",
    titre: "Cadeaux africains pour papa",
    description: "Idées cadeaux africains pour un papa : chemises et accessoires en wax, montre, parfum, livres, service à thé et objets du quotidien.",
    intro: "Pour le pilier de la famille : des cadeaux élégants, pratiques, qui rappellent le pays.",
    texte: [
      "Un papa apprécie souvent les cadeaux qui l'accompagnent au quotidien : un accessoire de qualité, une belle chemise, un parfum, un livre sur l'histoire du continent, ou tout ce qu'il faut pour préparer le thé.",
      "Pour les papas restés au pays, un cadeau qui voyage bien et qui se garde longtemps est toujours le bienvenu.",
    ],
  },
  {
    slug: "femme",
    nom: "Femme",
    titre: "Cadeaux africains pour une femme",
    description: "Idées cadeaux africains pour une femme, une épouse, une sœur ou une amie : mode wax, bijoux, beauté afro, déco et livres.",
    intro: "Pour votre épouse, votre sœur, votre amie : des cadeaux qui célèbrent son style et ses racines.",
    texte: [
      "Mode en wax, bijoux inspirés du continent, soins pour cheveux crépus ou bouclés, beaux objets de déco : les idées ne manquent pas pour faire plaisir à une femme qui aime l'Afrique.",
      "Observez son style : couleurs vives ou tons sobres, bijoux dorés ou perles, accessoires discrets ou spectaculaires. Le bon cadeau est celui qu'elle aurait pu choisir elle-même.",
    ],
  },
  {
    slug: "homme",
    nom: "Homme",
    titre: "Cadeaux africains pour un homme",
    description: "Idées cadeaux africains pour un homme, un mari, un frère ou un ami : wax, accessoires, soins de la barbe, déco et livres.",
    intro: "Pour votre mari, votre frère, votre ami : des cadeaux avec du style et du caractère.",
    texte: [
      "Une chemise ou un nœud papillon en wax, un bracelet en perles, des soins pour la barbe et les cheveux, une œuvre d'art pour son salon : un homme peut afficher ses racines avec élégance.",
      "Pour un cadeau sûr, misez sur un accessoire de qualité plutôt que sur un vêtement dont la taille est incertaine.",
    ],
  },
  {
    slug: "enfant",
    nom: "Enfant",
    titre: "Cadeaux africains pour enfant",
    description: "Idées cadeaux africains pour enfant : poupées noires, livres jeunesse, jeux, puzzles d'Afrique et vêtements en wax.",
    intro: "Des jouets, des livres et des jeux où les enfants se reconnaissent, pour grandir fiers de leurs racines.",
    texte: [
      "Une poupée qui lui ressemble, un livre dont le héros a sa couleur de peau, un puzzle de la carte d'Afrique, un jeu d'awalé : ces cadeaux comptent pour un enfant de la diaspora, qui grandit entre deux cultures.",
      "Choisissez des cadeaux adaptés à son âge et vérifiez les indications de sécurité sur la fiche Amazon (âge minimum, petites pièces).",
    ],
  },
  {
    slug: "ado",
    nom: "Ado",
    titre: "Cadeaux africains pour ado",
    description: "Idées cadeaux africains pour ado : mode et accessoires wax, bijoux, soins cheveux, musique, livres et objets déco pour sa chambre.",
    intro: "Pour les ados qui veulent du style : des cadeaux tendance qui mettent l'Afrique à l'honneur.",
    texte: [
      "Les ados aiment les cadeaux qui affirment leur identité : une casquette ou un sac en wax, des bijoux, des produits pour leurs cheveux naturels, un roman d'un auteur africain ou une affiche pour leur chambre.",
      "En cas de doute, demandez discrètement à un frère, une sœur ou un ami ce qui lui ferait plaisir : les goûts changent vite à cet âge.",
    ],
  },
  {
    slug: "collegue",
    nom: "Collègue",
    titre: "Cadeaux africains pour un collègue",
    description: "Idées cadeaux africains pour un collègue : petits prix, objets de bureau en wax, thé, épices, carnets et cadeaux de départ.",
    intro: "Pour un pot de départ, un anniversaire au bureau ou un Secret Santa : des cadeaux originaux sans faire d'impair.",
    texte: [
      "Au bureau, on cherche un cadeau original mais pas trop personnel : un carnet ou une trousse en wax, un coffret de thé ou d'épices, un mug, un petit objet de déco. Ces cadeaux plaisent à tout le monde et font découvrir un peu de nos cultures.",
      "Pour une collecte entre collègues, un bel objet de déco ou un coffret plus généreux fait un cadeau de départ mémorable.",
    ],
  },
] as const satisfies readonly Rubrique[];
/** Tranches de prix : bornes en euros, la borne haute exclue (null = pas de limite). */
export const BUDGETS = [
  {
    slug: "moins-de-20",
    nom: "Moins de 20 €",
    min: 0,
    max: 20,
    titre: "Cadeaux africains à moins de 20 €",
    description: "Idées cadeaux africains à moins de 20 € : petits accessoires en wax, bijoux, soins, épices et livres pour faire plaisir sans se ruiner.",
    intro: "Faire plaisir sans se ruiner : des petits cadeaux africains qui font grand effet.",
    texte: [
      "Un petit budget n'empêche pas de trouver un joli cadeau : chouchou ou bandeau en wax, savon noir, beurre de karité, bracelet en perles, épices… Parfait pour un collègue, un Secret Santa ou pour compléter un cadeau plus important.",
      "Les prix indiqués sont des fourchettes habituelles sur Amazon.fr : vérifiez toujours le prix affiché sur la fiche au moment de l'achat.",
    ],
  },
  {
    slug: "20-50",
    nom: "20 à 50 €",
    min: 20,
    max: 50,
    titre: "Cadeaux africains de 20 à 50 €",
    description: "Idées cadeaux africains entre 20 et 50 € : foulards et sacs en wax, coffrets beauté, bijoux, déco et livres.",
    intro: "Le budget le plus courant pour un anniversaire ou une fête : le choix est large et les cadeaux sont beaux.",
    texte: [
      "Entre 20 et 50 €, on trouve de très beaux cadeaux : un foulard de tête ou un sac en wax, un coffret de soins naturels, un bijou travaillé, un objet de déco ou un beau livre.",
      "C'est aussi le bon budget pour un colis au pays : quelques cadeaux légers réunis dans un même envoi font beaucoup d'heureux.",
    ],
  },
  {
    slug: "50-100",
    nom: "50 à 100 €",
    min: 50,
    max: 100,
    titre: "Cadeaux africains de 50 à 100 €",
    description: "Idées cadeaux africains entre 50 et 100 € : tenues en wax, bijoux, art et déco, coffrets et objets pour recevoir.",
    intro: "Pour marquer le coup : des cadeaux généreux pour les proches et les grandes occasions.",
    texte: [
      "Entre 50 et 100 €, vous pouvez offrir une tenue complète, une belle pièce de déco, un service à thé ou un bijou qui se garde toute une vie.",
      "C'est un bon budget pour un cadeau commun à deux ou trois personnes, ou pour une grande occasion : mariage, fête des mères, Tabaski.",
    ],
  },
  {
    slug: "plus-de-100",
    nom: "Plus de 100 €",
    min: 100,
    max: null,
    titre: "Cadeaux africains à plus de 100 €",
    description: "Cadeaux africains haut de gamme, à plus de 100 € : art, mobilier et déco, bijoux, tenues de fête et cadeaux communs.",
    intro: "Pour les grandes occasions et les cadeaux communs : des pièces qui durent et qui se transmettent.",
    texte: [
      "Au-delà de 100 €, on entre dans les cadeaux qui marquent : une œuvre d'art, un meuble ou un objet de déco artisanal, un bijou précieux, une tenue de fête.",
      "Ce sont souvent des cadeaux de mariage, de grands anniversaires ou des cadeaux communs, entre frères et sœurs ou collègues.",
    ],
  },
] as const satisfies ReadonlyArray<Rubrique & { min: number; max: number | null }>;

/** Univers. */
export const UNIVERS = [
  {
    slug: "wax-et-mode",
    nom: "Wax et mode",
    titre: "Cadeaux wax et mode africaine",
    description: "Cadeaux en wax et mode africaine : foulards de tête, sacs, chemises, robes, accessoires et tissus à offrir.",
    intro: "Le wax, c'est la couleur, la joie et l'élégance. Des vêtements et accessoires à offrir pour toutes les occasions.",
    texte: [
      "Le wax est devenu le symbole de la mode africaine, du marché de Dakar aux podiums. Foulard de tête, sac, chemise, nœud papillon, coupon de tissu : il y a un cadeau en wax pour chaque style et chaque budget.",
      "Pour un vêtement, vérifiez le guide des tailles sur la fiche Amazon. Pour un cadeau sans risque, préférez les accessoires ou un beau coupon de tissu que la personne fera coudre à son goût.",
    ],
  },
  {
    slug: "bijoux",
    nom: "Bijoux",
    titre: "Bijoux africains à offrir",
    description: "Bijoux africains à offrir : colliers et bracelets en perles, boucles d'oreilles carte d'Afrique, bijoux de taille et créoles dorées.",
    intro: "Perles, laiton, or, cauris : des bijoux qui portent l'histoire du continent.",
    texte: [
      "Les bijoux tiennent une place à part dans les cultures africaines : on les offre à la naissance, au mariage, pour les grandes fêtes. Perles de verre, cauris, laiton, pendentifs en forme de carte d'Afrique : chaque bijou raconte quelque chose.",
      "Un bijou est aussi le cadeau idéal à envoyer au pays : petit, léger, il voyage sans risque.",
    ],
  },
  {
    slug: "beaute-afro",
    nom: "Beauté afro",
    titre: "Cadeaux beauté afro",
    description: "Cadeaux beauté afro : soins pour cheveux crépus et bouclés, beurre de karité, savon noir, huiles naturelles et accessoires.",
    intro: "Des soins pensés pour nos cheveux et nos peaux, et des rituels hérités de nos mères.",
    texte: [
      "Beurre de karité, savon noir, huile de baobab ou de ricin, bonnets en satin, peignes adaptés : la beauté afro offre de très jolis cadeaux, utiles et agréables.",
      "Vérifiez la composition et préférez les produits simples et naturels si vous ne connaissez pas les habitudes de la personne. Les liquides voyagent mal : pour un colis, choisissez plutôt les beurres et les savons.",
    ],
  },
  {
    slug: "art-et-deco",
    nom: "Art et déco",
    titre: "Cadeaux art et déco africaine",
    description: "Cadeaux déco africaine : paniers tressés, coussins en wax, masques, affiches, bougies et objets pour une maison aux couleurs du continent.",
    intro: "Pour une maison qui raconte d'où l'on vient : paniers, coussins, affiches et objets d'art.",
    texte: [
      "Paniers tressés, coussins en wax ou en bogolan, affiches d'artistes africains, statuettes, bougies parfumées : la déco africaine se glisse dans tous les intérieurs et fait un cadeau qui dure.",
      "Pour un cadeau réussi, pensez à la pièce où l'objet ira vivre : un panier pour l'entrée, un coussin pour le salon, une suspension pour la chambre. Les objets en fibres tressées et en bois sont légers et solides, parfaits pour un colis.",
    ],
  },
  {
    slug: "jeux-et-jouets",
    nom: "Jeux et jouets",
    titre: "Jeux et jouets africains à offrir",
    description: "Jeux et jouets africains à offrir : poupées noires, awalé, jeu de dames, puzzles de la carte d'Afrique, djembés et jouets d'éveil.",
    intro: "Des jeux pour rire ensemble et des jouets où les enfants se reconnaissent : de l'awalé de grand-père à la poupée qui leur ressemble.",
    texte: [
      "Les jeux traditionnels comme l'awalé ou le jeu de dames se transmettent de génération en génération, à l'ombre d'un arbre comme dans le salon. Les offrir, c'est s'assurer de belles parties en famille et faire découvrir aux plus jeunes les jeux de leurs grands-parents.",
      "Pour les tout-petits, choisissez des poupées, des peluches et des jouets d'éveil adaptés à leur âge, et vérifiez toujours l'âge minimum indiqué sur la fiche Amazon. Les jouets en bois et les jeux de société voyagent bien : parfaits pour un colis envoyé au pays.",
    ],
  },
  {
    slug: "livres",
    nom: "Livres",
    titre: "Livres africains à offrir",
    description: "Livres africains à offrir : contes illustrés, imagiers bilingues, histoire de l'Afrique, proverbes et beaux livres pour tous les âges.",
    intro: "Un livre, c'est un cadeau qui reste : contes, imagiers, histoire et proverbes d'Afrique, pour les petits comme pour les grands.",
    texte: [
      "Contes illustrés, imagiers bilingues, livres d'histoire, recueils de proverbes, beaux livres photo : les livres sur l'Afrique se lisent à tout âge et se relisent longtemps.",
      "Un livre est léger, solide et ne craint ni la chaleur ni les secousses : c'est l'un des meilleurs cadeaux à glisser dans un colis pour le pays.",
    ],
  },
  {
    slug: "cuisine",
    nom: "Cuisine",
    titre: "Cadeaux pour les amoureux de cuisine africaine",
    description: "Cadeaux pour les gourmands : livre de recettes africaines, théière pour l'ataya, mortier et pilon, épices, bissap et service à thé.",
    intro: "Thiéboudienne, mafé, poulet yassa, thé à la menthe : des cadeaux pour ceux qui cuisinent et ceux qui reçoivent.",
    texte: [
      "Un livre de recettes, des épices, un bel ustensile : les cadeaux gourmands font toujours plaisir, surtout quand ils rappellent les plats de la maison.",
      "Pour ceux qui reçoivent, un plateau doré ou un service à thé accompagnent l'ataya des grandes occasions ; pour ceux qui cuisinent, un mortier en bois ou une théière solide serviront des années.",
    ],
  },
] as const satisfies readonly Rubrique[];

export type OccasionSlug = (typeof OCCASIONS)[number]["slug"];
export type DestinataireSlug = (typeof DESTINATAIRES)[number]["slug"];
export type BudgetSlug = (typeof BUDGETS)[number]["slug"];
export type UniversSlug = (typeof UNIVERS)[number]["slug"];


/** Les quatre familles, dans l'ordre des adresses du site. */
export const FAMILLES = {
  occasion: { nom: "Par occasion", chemin: "/occasion", liste: OCCASIONS },
  pour: { nom: "Par destinataire", chemin: "/pour", liste: DESTINATAIRES },
  budget: { nom: "Par budget", chemin: "/budget", liste: BUDGETS },
  univers: { nom: "Par univers", chemin: "/univers", liste: UNIVERS },
} as const;
export type Famille = keyof typeof FAMILLES;

export function trouver<F extends Famille>(famille: F, slug: string): (typeof FAMILLES)[F]["liste"][number] | undefined {
  return (FAMILLES[famille].liste as ReadonlyArray<Rubrique>).find((r) => r.slug === slug) as (typeof FAMILLES)[F]["liste"][number] | undefined;
}
