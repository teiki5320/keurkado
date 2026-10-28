import type { Guides } from "./types";

/**
 * Guides d'achat des univers (/univers/<slug>) : matières, bien choisir, entretien, pour qui, quoi éviter.
 * Pas de guide pour « livres » et « cuisine », qui renvoient vers les sites frères.
 */
export const GUIDES_UNIVERS: Guides = {
  "wax-et-mode": {
    parties: [
      {
        titre: "Comment reconnaître un vrai wax",
        paragraphes: [
          "Sous le nom de « wax », on trouve deux familles de tissus. Le vrai wax est imprimé à la résine sur les deux faces du coton : son motif est aussi net et aussi vif à l'envers qu'à l'endroit, avec souvent de fines craquelures qui font son charme. L'imprimé fantaisie, lui, n'est imprimé que d'un côté ; il peut être très joli, mais son envers est plus pâle et ses couleurs tiennent moins longtemps.",
          "En ligne, regardez les photos de l'envers et lisez la description avec attention : si rien n'est précisé sur la fabrication, considérez qu'il s'agit d'un imprimé. Sur Amazon, le mot « wax » désigne souvent les deux : nous ne pouvons pas garantir qu'un article est un vrai wax, c'est à sa fiche de le préciser.",
        ],
      },
      {
        titre: "Wax, bazin ou boubou : bien choisir",
        paragraphes: [
          "Chaque tissu a ses moments. Le wax, coloré et joyeux, habille le quotidien comme les fêtes. Le bazin, damassé et brillant, est réservé aux grands jours : Tabaski, Korité, mariage. Le boubou brodé, ample, se porte pour la prière de l'Aïd ou une cérémonie, tandis que la chemise dashiki, plus décontractée, plaît aux ados comme à leurs aînés.",
          "Pensez aussi à la personne : une maman qui fait coudre ses tenues sera ravie d'un beau coupon à confier à son tailleur, un papa discret préférera une cravate ou un nœud papillon qui apporte juste une touche de couleur.",
        ],
      },
      {
        titre: "Offrir un vêtement sans se tromper de taille",
        paragraphes: [
          "C'est le piège des vêtements offerts. Avant de commander, comparez le guide des tailles de la fiche avec un vêtement que la personne porte déjà, et non avec la taille qu'elle annonce. Les coupes amples, comme le grand boubou, laissent plus de marge que les robes ajustées.",
          "Dans le doute, choisissez un accessoire : foulard de tête, turban pré-noué, sac cabas, pochette ou casquette. Ils n'ont pas de taille et se portent tout de suite.",
        ],
      },
      {
        titre: "Comment laver et entretenir le wax",
        paragraphes: [
          "Suivez toujours l'étiquette. En règle générale, un tissu imprimé se lave à l'envers, en eau froide ou tiède, avec des couleurs proches, et sèche à l'ombre plutôt qu'au soleil ou au sèche-linge. Un premier lavage seul évite les mauvaises surprises si la teinture dégorge. Le repassage se fait de préférence sur l'envers. Le bazin brodé, plus délicat, mérite souvent un passage au pressing : mieux vaut le préciser en offrant le cadeau.",
        ],
      },
    ],
  },

  bijoux: {
    parties: [
      {
        titre: "Perles, cauris, laiton ou or : quelles matières",
        paragraphes: [
          "Les perles de verre, de bois ou de pierre donnent des bijoux colorés et légers, souvent montés sur fil élastique : faciles à porter, mais ce fil finit par se détendre avec le temps. Le cauri, petit coquillage qui servait autrefois de monnaie, se tresse en bracelets et en colliers porte-bonheur. Le laiton, alliage doré au ton chaud, est très utilisé pour les grands bijoux ; il fonce avec le temps et laisse parfois une légère trace verte sur la peau.",
          "L'acier doré ou argenté résiste bien au quotidien et convient à ceux qui portent un bijou tous les jours. Le plaqué or offre l'éclat de l'or à petit prix, mais sa couche finit par s'user. L'or massif, enfin, se garde toute une vie et se transmet : c'est le bijou des grandes occasions.",
        ],
      },
      {
        titre: "Choisir un bijou selon son style",
        paragraphes: [
          "Observez ce que la personne porte déjà. Plutôt doré ou argenté ? Des pièces discrètes pour le bureau, ou des parures qui se voient de loin pour les fêtes ? Pour quelqu'un qui porte peu de bijoux, un pendentif fin ou des boucles légères passent partout. Pour celle qui aime briller, un collier plastron en perles ou une série de joncs accompagnent une tenue en wax ou un grand boubou. Les hommes se tournent volontiers vers un bracelet en perles, un pendentif en acier ou un chapelet.",
        ],
      },
      {
        titre: "Bien choisir la taille d'un bijou",
        paragraphes: [
          "Un jonc rigide doit passer la main sans glisser trop librement : comparez le diamètre indiqué sur la fiche avec un bracelet qu'elle porte déjà. Pour un collier, regardez la longueur de la chaîne, qui change tout entre un ras-du-cou et un pendentif sur la poitrine. Les bracelets élastiques laissent plus de marge. Si les oreilles sont sensibles, vérifiez la matière des attaches.",
        ],
      },
      {
        titre: "Comment entretenir ses bijoux",
        paragraphes: [
          "Mettez vos bijoux après le parfum et la crème, et retirez-les pour la douche, la baignade ou le sport. Rangez-les séparément, dans une pochette ou une petite boîte, pour éviter les rayures et les fils emmêlés. Le laiton et l'argent qui ont terni retrouvent leur éclat avec un chiffon doux. Les cauris et les perles de bois n'aiment pas l'eau : un coup de chiffon sec suffit.",
        ],
      },
    ],
  },

  "beaute-afro": {
    parties: [
      {
        titre: "Beurre de karité, savon noir, huiles : que choisir",
        paragraphes: [
          "Le beurre de karité brut non raffiné garde sa couleur ivoire à jaune et son odeur marquée ; la version raffinée, plus blanche et presque sans odeur, plaît à ceux qui n'aiment pas les parfums forts. Le savon noir traditionnel, fabriqué à partir de cendres végétales et d'huiles, se prête au visage comme au corps. Côté huiles, celle de baobab est légère et celle de ricin noire, épaisse, s'utilise surtout en bain d'huile sur les cheveux.",
        ],
      },
      {
        titre: "Choisir un soin selon le type de cheveux",
        paragraphes: [
          "Avant d'offrir, renseignez-vous sur la routine de la personne. Des cheveux crépus portés naturels, des boucles définies, des tresses ou des locks n'appellent pas les mêmes gestes. Les accessoires en satin, bonnet ou taie d'oreiller, conviennent à presque toutes les chevelures et ne risquent pas de déplaire. Les brosses démêlantes rendront service aux parents qui coiffent leurs enfants, le duo durag et brosse plaira aux garçons qui soignent leurs waves.",
          "Pour celle qui consacre déjà son dimanche à ses cheveux, un appareil comme le sèche-cheveux à diffuseur ou le casque chauffant sera un vrai cadeau d'expert.",
        ],
      },
      {
        titre: "Lire la composition avant d'acheter",
        paragraphes: [
          "Prenez le temps de lire la liste des ingrédients sur la fiche. Si vous ne connaissez pas bien les habitudes de la personne, préférez les produits simples, à la liste courte, et sans parfum marqué. Une peau ou un cuir chevelu sensible peut réagir à un ingrédient : en cas de doute, un accessoire ou un coffret dont elle connaît déjà les produits reste le choix le plus sûr. Un parfum, comme une eau de parfum au oud, est un cadeau très personnel : offrez-le à quelqu'un dont vous connaissez les goûts.",
        ],
      },
      {
        titre: "Conserver et envoyer des soins",
        paragraphes: [
          "Le beurre de karité durcit au froid et ramollit à la chaleur : c'est normal, il suffit de le chauffer entre les mains. Gardez beurres et huiles à l'abri du soleil, bien refermés. Pour un colis envoyé au pays, choisissez les beurres, les savons et les accessoires en satin, qui voyagent bien ; les huiles et les autres liquides risquent de couler dans le carton. Et si la personne découvre ces soins, glissez un petit mot pour lui expliquer comment utiliser chacun d'eux.",
        ],
      },
    ],
  },

  "art-et-deco": {
    parties: [
      {
        titre: "Bois, fibres tressées ou tissu : les matières",
        paragraphes: [
          "La déco africaine joue sur quelques grandes matières. Le bois sculpté donne les statues, les masques, les tabourets taillés dans un seul bloc et les cartes murales. Les fibres tressées, comme l'herbe éléphant des paniers de Bolgatanga au Ghana, donnent des paniers solides, des corbeilles murales et des suspensions qui dessinent de jolies ombres. Le tissu, wax ou bogolan, habille les coussins, les nappes et les sets de table.",
          "Lisez bien la fiche : un objet en bois massif n'a ni le poids ni le prix d'un objet en résine façon bois, et une toile peinte à la main n'est pas une affiche imprimée. Les deux ont leur place, à condition de savoir ce que l'on offre.",
        ],
      },
      {
        titre: "Comment choisir une déco africaine à offrir",
        paragraphes: [
          "Partez de l'intérieur de la personne. Pour un salon déjà chargé, un petit objet utile, comme un panier ou une housse de coussin, s'intègre sans effort. Pour une crémaillère ou un jeune couple, des sets de table, une nappe en wax ou une suspension tressée font plaisir longtemps. Une grande toile, une statue ou un masque se choisissent pour quelqu'un dont vous connaissez les goûts, ou en cadeau commun. Les affiches et la carte murale en bois plaisent beaucoup dans une chambre d'ado ou un bureau.",
        ],
      },
      {
        titre: "Entretenir le bois et les paniers",
        paragraphes: [
          "Le bois n'aime ni la chaleur sèche ni le soleil direct : éloignez statues et tabourets des radiateurs pour éviter les fentes, et dépoussiérez-les avec un chiffon sec. Les paniers tressés se nettoient à la brosse douce et doivent sécher à l'air s'ils ont pris l'eau. Les housses et les nappes en wax se lavent à l'envers, en suivant l'étiquette.",
        ],
      },
      {
        titre: "Ce qu'il vaut mieux éviter",
        paragraphes: [
          "Un masque ou une statuette vendus en ligne sont des créations récentes, inspirées des grandes traditions d'Afrique de l'Ouest et du Centre : offrez-les comme de beaux objets, pas comme des pièces anciennes. Pour une grande statue ou un tabouret, pensez aussi au poids et à la place dont la personne dispose chez elle. Pour un envoi au pays, laissez de côté les pièces lourdes ou fragiles et préférez ce qui se plie dans une valise : housses de coussin, nappes, sets de table.",
        ],
      },
    ],
  },

  "jeux-et-jouets": {
    parties: [
      {
        titre: "Jeux africains traditionnels à offrir",
        paragraphes: [
          "L'awalé est un jeu de semailles : on égrène des graines de trou en trou sur un plateau en bois, et l'on capture celles de l'adversaire. Les règles s'apprennent vite et les parties se jouent à tout âge, ce qui en fait un très beau cadeau à partager entre grands-parents et petits-enfants. Le jeu de dames, lui, réunit les joueurs de tous les quartiers. Choisissez un plateau en bois massif, plus agréable en main et plus durable.",
          "Les jeux qui font apprendre ont aussi leur place : avec le puzzle de la carte d'Afrique, chaque pièce est un pays, et les enfants découvrent en jouant où se trouvent le Sénégal, le Mali ou la Côte d'Ivoire. Pour un ado ou un adulte curieux, la kalimba, cousine moderne de la sanza, se joue avec les pouces et donne des mélodies dès le premier jour.",
        ],
      },
      {
        titre: "Choisir une poupée noire",
        paragraphes: [
          "Pour un enfant de la diaspora, jouer avec une poupée qui lui ressemble compte beaucoup. Regardez la texture des cheveux : une poupée aux cheveux crépus que l'on peut vraiment coiffer offre des heures de jeu, et une tête à coiffer permet de s'entraîner aux tresses et aux chignons. Pour un bébé, la poupée de chiffon, toute souple, est plus adaptée qu'une poupée rigide aux petits accessoires.",
        ],
      },
      {
        titre: "Âge et sécurité des jouets",
        paragraphes: [
          "Vérifiez toujours l'âge minimum indiqué sur la fiche et la présence du marquage CE, obligatoire pour les jouets vendus en Europe. Pour les plus petits, écartez les jouets à petites pièces, les perles et les graines qui peuvent se détacher : l'awalé, par exemple, est un jeu pour les plus grands. Hochet en bois, doudou, tapis d'éveil et figurines de grande taille conviennent mieux aux premiers mois.",
          "Les instruments, comme le petit djembé, éveillent l'oreille ; prévenez simplement les parents, qui apprécieront de savoir que le cadeau fait du bruit.",
        ],
      },
      {
        titre: "Entretien et envoi au pays",
        paragraphes: [
          "Les jouets en bois se nettoient avec un chiffon à peine humide, sans les laisser tremper. Les doudous et poupées de chiffon se lavent selon leur étiquette. Pour un colis, les jeux en bois, les puzzles et les figurines voyagent très bien : légers ou solides, ils arrivent entiers et ne demandent ni pile ni chargeur.",
        ],
      },
    ],
  },
};

/**
 * Univers « livres » et « cuisine » : courts guides des pages passerelles vers les sites frères
 * (Keurbook et Keur Cook), qui ont chacun leurs propres conseils détaillés.
 */
export const GUIDES_FRERES: Guides = {
  livres: {
    parties: [
      {
        titre: "Offrir un livre d'auteur africain",
        paragraphes: [
          "Un livre se garde, se prête et se relit : c'est l'un des cadeaux qui durent le plus longtemps. Pour qu'il touche juste, partez de la personne plutôt que du livre. Une grande lectrice de romans n'attend pas la même chose qu'un papa curieux d'histoire ou qu'un enfant qui commence à lire seul.",
          "Les auteurs d'Afrique et de la diaspora écrivent dans tous les genres : romans, poésie, bandes dessinées, albums jeunesse, essais, récits de voyage. Il y a forcément un livre qui parle à la personne que vous voulez gâter, en français ou dans une autre langue.",
        ],
      },
      {
        titre: "Livre jeunesse : des héros qui leur ressemblent",
        paragraphes: [
          "Pour un enfant de la diaspora, un album dont le héros lui ressemble compte beaucoup : il s'y reconnaît, en parle et le relit. Choisissez selon l'âge, et préférez un livre que vous pourrez lire avec lui le soir.",
        ],
      },
      {
        titre: "Nos conseils de lecture sur Keurbook",
        paragraphes: [
          "Keurbook, notre site frère, présente les livres un par un, avec un résumé, une fiche sur l'auteur et des sélections par âge et par thème. C'est le meilleur endroit pour trouver le bon titre. Ici, vous trouverez aussi quelques idées de livres à glisser dans un colis : un livre est léger, solide et voyage très bien.",
        ],
      },
    ],
  },
  cuisine: {
    parties: [
      {
        titre: "Un cadeau pour les amoureux de cuisine africaine",
        paragraphes: [
          "Les cadeaux gourmands ont un pouvoir particulier : ils rappellent la cuisine de la maison, les repas de fête et les odeurs de l'enfance. Un livre de recettes, un bel ustensile ou un service pour recevoir font plaisir à ceux qui cuisinent comme à ceux qui aiment simplement bien manger.",
          "Pensez à la personne : celle qui cuisine tous les jours appréciera un ustensile solide, celle qui reçoit souvent un joli plateau ou un service à thé, et celle qui veut apprendre un livre de recettes expliquées pas à pas.",
        ],
      },
      {
        titre: "Ustensiles et service : du solide",
        paragraphes: [
          "Mortier et pilon, théière pour l'ataya, plateau de service : choisissez des objets solides et faciles à entretenir, qui serviront longtemps. Vérifiez sur la fiche Amazon la taille, la matière et le mode d'entretien avant de commander.",
        ],
      },
      {
        titre: "Toutes nos recettes sur Keur Cook",
        paragraphes: [
          "Keur Cook, notre site frère, rassemble les recettes de la cuisine africaine pas à pas, avec les ingrédients et les ustensiles pour les réussir. Si vous offrez un ustensile, glissez-y une recette de Keur Cook : le cadeau sera tout de suite utile.",
        ],
      },
    ],
  },
};
