import type { Guides } from "./types";

/**
 * Guides des pages /occasion/<slug> : un angle propre à chaque fête
 * (Tabaski ≠ Korité, Noël ≠ anniversaire, fête des mères ≠ /pour/maman…).
 */
export const GUIDES_OCCASION: Guides = {
  tabaski: {
    parties: [
      {
        titre: "Tenue de Tabaski : s'y prendre tôt",
        paragraphes: [
          "À la Tabaski, la tenue neuve est presque un rite. Dans beaucoup de familles sénégalaises, maliennes ou guinéennes, on choisit son tissu longtemps à l'avance, puis on le confie au tailleur, qui croule sous les commandes dans les semaines qui précèdent la fête. Offrir un coupon de bazin riche ou de wax la veille, c'est offrir un tissu qui ne sera pas porté le jour J. Le bon moment, c'est juste après la Korité, pour laisser le temps des mesures et des essayages.",
          "Si la fête approche, tournez-vous vers une tenue prête à porter : un grand boubou brodé pour femme, un ensemble boubou trois pièces pour homme, une robe en wax. Les coupes amples pardonnent une taille approximative.",
        ],
      },
      {
        titre: "Qu'offrir pour la Tabaski à sa mère",
        paragraphes: [
          "Les parents sont honorés en premier. Pour une maman, un coupon de bazin qu'elle fera coudre à son goût reste un cadeau très attendu, avec un foulard de tête assorti ou un lot de bracelets joncs dorés pour compléter la tenue. Pour un papa, un grand boubou en bazin brodé, un chapelet ou un tapis de prière accompagnent la prière du matin. Ces présents s'ajoutent souvent à la participation au mouton que beaucoup d'enfants adultes apportent : ils en font une attention plus personnelle.",
        ],
      },
      {
        titre: "Un cadeau pour la famille qui vous reçoit",
        paragraphes: [
          "La Tabaski est aussi une fête de visites : on reçoit, on est reçu, on partage la viande avec les voisins. Si vous passez la journée chez un oncle, une tante ou votre belle-famille en France, arrivez avec un présent pour la maison plutôt qu'un cadeau personnel. Une nappe en wax pour la grande tablée, un plateau de service doré, un service à thé avec ses verres ou un paquet de thé vert pour l'après-midi : ces objets servent le jour même, puis à chaque fête.",
          "Un brûle-encens et son bakhoor font aussi plaisir à la personne qui reçoit, qui parfume la maison avant l'arrivée des invités. Offrez-le de la main à la main, car il voyage mal.",
        ],
      },
      {
        titre: "Envoyer un colis de Tabaski au pays",
        paragraphes: [
          "Quand on ne peut pas rentrer, le colis devient le cadeau. Misez sur ce qui est léger, pliable et solide : coupons de tissu, ensembles en wax pour enfant, robes de petite fille, chapelets, bijoux simples. Laissez de côté les parfums, les liquides et le fragile. Prévoyez large, car les envois se multiplient avant la fête, et pensez au tailleur : un tissu doit arriver assez tôt pour être cousu sur place. La date de la Tabaski suit la lune : notre calendrier des fêtes indique la date estimée, à vérifier avant de fixer votre envoi.",
        ],
      },
    ],
  },

  korite: {
    parties: [
      {
        titre: "Préparer ses cadeaux de Korité pendant le ramadan",
        paragraphes: [
          "La Korité arrive au bout d'un mois de jeûne, et les derniers jours du ramadan passent vite entre les repas du soir, la prière et les préparatifs. Le plus simple est de réunir vos cadeaux dès les premières semaines, pour ne pas courir les magasins quand toute la famille attend l'annonce de la lune. Comme la date exacte n'est connue qu'au dernier moment, notre calendrier des fêtes donne une estimation : visez d'avoir tout en main quelques jours avant.",
        ],
      },
      {
        titre: "Cadeaux de Korité pour les enfants",
        paragraphes: [
          "Pour les enfants, la Korité est le jour des habits neufs et des petites pièces glanées de maison en maison, le « ndéwénël » au Sénégal. Si vous recevez des neveux, des nièces ou les enfants des voisins, prévoyez plusieurs petits présents plutôt qu'un seul gros cadeau : personne ne repart les mains vides.",
          "Un puzzle de la carte d'Afrique en bois, des figurines d'animaux de la savane, un djembé ou un kalimba pour les plus musiciens, une poupée noire aux cheveux crépus ou une tête à coiffer : ces jouets prolongent la fête l'après-midi, pendant que les adultes se rendent visite. Pour les plus grands, un recueil de contes ou un jeu de dames se partagent en famille.",
        ],
      },
      {
        titre: "Une attention pour les visites du pardon",
        paragraphes: [
          "Le jour de la Korité, on passe chez les parents, les voisins, les amis, et l'on se demande pardon pour les torts de l'année. Le pardon se demande de vive voix, mais une petite attention l'accompagne joliment, surtout auprès d'un aîné ou d'un proche avec qui l'année a été difficile. Les douceurs et ce qui se partage conviennent bien à ce moment : des fleurs d'hibiscus séchées pour préparer le bissap, un paquet de thé vert, un service à thé pour la maison qui reçoit. Ce sont des cadeaux modestes, qui disent d'abord « je suis venu ».",
        ],
      },
      {
        titre: "Parfums et élégance sobre pour la Korité",
        paragraphes: [
          "Beaucoup gardent les tenues les plus spectaculaires pour la Tabaski et choisissent pour la Korité une élégance plus retenue : une tenue claire, un bijou discret, un parfum délicat. Pour un homme, une eau de parfum au oud ou un chapelet ; pour une femme, des boucles d'oreilles fines, un bracelet en cauris ou un turban pré-noué. Un brûle-encens avec son bakhoor parfumera la maison pour les visites. Réservez parfums et encens aux cadeaux remis en main propre : ils voyagent mal dans un colis.",
        ],
      },
    ],
  },

  noel: {
    parties: [
      {
        titre: "Une liste de Noël pour toute la famille",
        paragraphes: [
          "À Noël, la liste s'allonge vite : parents, frères et sœurs, neveux, cousins, belle-famille, et ceux qui sont restés au pays. Avant d'acheter quoi que ce soit, notez tout le monde, puis fixez un budget global à répartir. Cela évite d'avoir dépensé l'essentiel pour les premiers noms et de bâcler les derniers.",
          "Pour les cousins d'une même tranche d'âge, choisissez des cadeaux du même type : un livre de coloriage aux motifs africains pour chacun, des lots de chouchous en wax, des chaussettes à motifs. Personne ne compare, et l'ouverture des paquets reste une fête pour tous.",
        ],
      },
      {
        titre: "Quand commander ses cadeaux de Noël",
        paragraphes: [
          "Tout dépend de l'endroit où le cadeau doit arriver. Pour un colis au pays, les achats doivent être chez vous au début de novembre, afin de partir avant la fin du mois : les transporteurs sont très sollicités ensuite. Pour les cadeaux remis en France, commandez au plus tard dans la première quinzaine de décembre, et gardez une marge pour un retard ou un échange. Les jouets demandés par les enfants sont les premiers à manquer : réservez-les en priorité. Et si vous rentrez au pays pour les fêtes, gardez de la place dans la valise pour les cadeaux des plus jeunes, qui attendent souvent ce moment toute l'année.",
        ],
      },
      {
        titre: "Cadeau de Noël à plusieurs pour les parents",
        paragraphes: [
          "Entre frères et sœurs, se regrouper pour les parents permet d'offrir un cadeau qu'aucun n'aurait choisi seul : un grand tableau africain peint à la main pour le salon, un casque chauffant pour les soins capillaires de maman, un beau livre photo sur l'Afrique pour papa. Désignez une seule personne pour commander et récolter les participations : c'est la meilleure façon d'éviter les doublons et les oublis. Prévenez aussi la famille au pays de ce que vous offrez, pour que chacun sache qui a déjà gâté qui.",
        ],
      },
      {
        titre: "Idées pour un Secret Santa africain",
        paragraphes: [
          "Dans les grandes familles comme au bureau, le Secret Santa simplifie tout : chacun tire un nom au sort et n'offre qu'un cadeau, dans un budget fixé à l'avance. Pour qu'il fasse sourire sans gêner, choisissez un objet qui plaît à tous : une trousse ou une casquette en wax, un coffret d'épices africaines, un bracelet en cauris, un bonnet en satin, un jeu d'awalé en bois. Le petit plus : un mot qui explique d'où vient le motif ou à quoi sert l'objet, pour faire découvrir un peu de nos cultures à ceux qui ne les connaissent pas.",
        ],
      },
    ],
  },

  "saint-valentin": {
    parties: [
      {
        titre: "Un cadeau de Saint-Valentin original",
        paragraphes: [
          "La rose et la boîte de chocolats ont leur charme, mais elles ne racontent rien de votre couple. Un cadeau qui marque, c'est celui qui rappelle votre histoire : le pays de l'un, la ville où vous vous êtes rencontrés, un plat découvert ensemble, une musique de mariage. Si vous formez un couple aux origines différentes, c'est aussi l'occasion de faire découvrir à l'autre un peu de votre culture, avec un objet qui en porte les couleurs. Et si vous êtes mariés depuis longtemps, rappelez-vous ce que vous vous offriez au début : un clin d'œil à vos premières années touche souvent plus qu'un cadeau coûteux.",
        ],
      },
      {
        titre: "Une soirée à deux plutôt qu'un objet",
        paragraphes: [
          "Le plus beau cadeau du 14 février est souvent un moment. Choisissez une recette dans un livre de cuisine africaine et préparez-la à deux, faites infuser des fleurs d'hibiscus pour un bissap maison, puis sortez le service à thé et prenez le temps de le préparer comme au pays, sans regarder l'heure. Un jeu d'awalé en bois termine la soirée : les parties sont courtes, on rejoue volontiers, et le perdant fait la vaisselle.",
          "Ces cadeaux ont un autre avantage : ils restent à la maison et resservent à chaque soirée tranquille, bien après la Saint-Valentin.",
        ],
      },
      {
        titre: "Qu'offrir à sa femme ou son mari",
        paragraphes: [
          "Pour elle, un bijou qui se garde : des créoles en or, un pendentif carte d'Afrique, ou une pochette de soirée en wax pour la prochaine sortie. Les perles de taille, que l'on appelle bine-bine au Sénégal, sont un cadeau intime, à réserver à un couple bien installé. Pour lui, une eau de parfum au oud, une montre en bois, un bracelet en perles ou un kit d'entretien de barbe. Observez ce qu'il ou elle porte déjà : le bon cadeau complète un style, il ne le corrige pas.",
        ],
      },
      {
        titre: "La Saint-Valentin à distance",
        paragraphes: [
          "Beaucoup de couples vivent séparés une partie de l'année. Dans ce cas, envoyez votre cadeau plusieurs semaines à l'avance, et choisissez ce qui voyage bien : un bracelet en cauris, un collier pendentif, des boucles d'oreilles. Gardez le parfum pour vos retrouvailles. Le soir du 14, un appel en vidéo pendant qu'elle ou il ouvre le paquet vaut tous les dîners aux chandelles. Et si vous vous retrouvez quelques semaines plus tard, rien ne vous empêche de fêter la Saint-Valentin ce jour-là.",
        ],
      },
    ],
  },

  mariage: {
    parties: [
      {
        titre: "Quel cadeau offrir à chaque étape du mariage",
        paragraphes: [
          "Selon les pays et les familles, on peut vous inviter à la dot, au mariage religieux, au passage à la mairie ou à la grande fête, parfois à tout cela sur plusieurs mois. Chaque étape appelle un geste différent. La dot est d'abord une affaire entre les deux familles : si vous êtes simple invité, on attend surtout votre présence. Au mariage religieux ou civil, une carte et vos vœux suffisent souvent. C'est à la grande fête que l'on apporte en général le cadeau principal. Dans le doute, demandez aux mariés ou à un proche comment cela se passe chez eux.",
        ],
      },
      {
        titre: "Le tissu commun des invités",
        paragraphes: [
          "Dans beaucoup de mariages, la famille ou les mariés choisissent un tissu que les invités portent le jour de la fête. Au Nigeria, on parle d'« aso ebi » ; ailleurs, d'uniforme ou de tissu de la fête. L'acheter et le porter est déjà une façon d'honorer le couple. Procurez-vous-le dès que l'on vous le propose et réservez votre tailleur tôt, car ils sont débordés avant les grandes dates. Pour compléter la tenue, une pochette de soirée, une cravate ou un nœud papillon en wax font leur effet.",
        ],
      },
      {
        titre: "Liste de mariage ou cadeau commun",
        paragraphes: [
          "De plus en plus de couples de la diaspora ouvrent une liste de mariage ou une cagnotte. Si c'est le cas, respectez leur choix : c'est la meilleure façon de leur être utile. Sans liste, regroupez-vous entre amis ou collègues pour un objet qui marquera le nouveau foyer : un grand tableau peint à la main, une statue en bois sculpté, un tabouret africain, une suspension en panier tressé. Dans de nombreuses familles, l'enveloppe remise aux mariés est aussi un cadeau tout à fait habituel.",
        ],
      },
      {
        titre: "Cadeaux pour la mariée et la maison",
        paragraphes: [
          "La famille proche pense souvent à la mariée elle-même : une parure de bijoux dorés, des créoles en or, des joncs qu'elle gardera toute sa vie, ou du henné pour les préparatifs dans les familles où c'est l'usage. Pour la maison, un plateau de service doré, un mortier et son pilon, des sets de table en wax ou un panier tressé serviront à chaque visite. Si le mariage a lieu au pays, privilégiez les bijoux et les tissus, légers et solides, plutôt que la vaisselle, qui supporte mal le voyage. Joignez une carte avec vos vœux : les mariés la liront souvent bien après la fête.",
        ],
      },
    ],
  },

  bapteme: {
    parties: [
      {
        titre: "Baptême ou cérémonie du nom : se renseigner",
        paragraphes: [
          "Derrière le mot « baptême », chaque famille met une cérémonie différente. Dans beaucoup de familles musulmanes d'Afrique de l'Ouest, l'enfant reçoit son nom quelques jours après sa naissance ; dans les familles chrétiennes, le baptême à l'église peut avoir lieu des semaines ou des mois plus tard, avec un parrain et une marraine. Ces différences changent votre calendrier. Pour une cérémonie du nom, le temps est très court : choisissez votre cadeau dès l'annonce de la naissance, ou même avant. Pour un baptême à l'église, demandez au parrain ou à la marraine ce qu'ils prévoient, afin de ne pas offrir le même bijou.",
        ],
      },
      {
        titre: "Qu'offrir à un bébé pour son baptême",
        paragraphes: [
          "Une gourmette de naissance en argent, gravée du prénom, est le cadeau qui se garde toute une vie. Pour les premiers mois, un hochet en bois, un doudou lion, une poupée de chiffon ou un tapis d'éveil aux animaux de la savane. Un imagier bilingue, en français et dans la langue de la famille, est un beau premier livre pour transmettre les mots du pays. Pour tout jouet, vérifiez l'âge indiqué par le fabricant : un nouveau-né porte tout à la bouche.",
        ],
      },
      {
        titre: "Un cadeau pour la jeune maman",
        paragraphes: [
          "Le jour de la fête, la maman reçoit les visites après des semaines de fatigue. Penser à elle touche toujours. Un coupon de wax ou de bazin lui permettra de se faire coudre une tenue à son goût, quand elle aura le temps. Un foulard de tête, un lot de joncs dorés ou des créoles l'aideront à se sentir belle. Une écharpe de portage en wax est à la fois jolie et pratique au quotidien.",
          "Un coffret de soins au karité, du beurre de karité brut ou de l'huile de baobab lui offrent un moment rien qu'à elle. Pour la peau du bébé, laissez les parents décider de ce qu'ils utilisent, en accord avec leur médecin.",
        ],
      },
      {
        titre: "Offrir à plusieurs ou à distance",
        paragraphes: [
          "Si la famille est nombreuse, mettez-vous d'accord pour éviter les doublons : un cadeau commun, comme la gourmette, fait plaisir sans encombrer. Si vous êtes en France et la cérémonie au pays, un cadeau arrivé un peu après la fête, accompagné d'un appel le jour même, sera tout aussi bien reçu. Et pensez à la grand-mère, souvent très présente auprès du bébé : un petit présent pour elle est une belle marque de respect.",
        ],
      },
    ],
  },

  anniversaire: {
    parties: [
      {
        titre: "Cadeau d'anniversaire selon l'âge",
        paragraphes: [
          "Pour les tout-petits, un doudou lion, une poupée de chiffon ou un imagier bilingue. Les enfants d'âge scolaire aiment ce qui s'invente et se manipule : une tête à coiffer, un puzzle carte d'Afrique, un djembé pour enfant, un album jeunesse avec une héroïne qui leur ressemble. Les ados veulent affirmer leur style : une casquette en wax, des bijoux pour tresses et locks, un durag en satin avec sa brosse, une chemise dashiki.",
          "Chez les adultes, l'âge compte moins que les goûts. Pour les aînés, préférez ce qui se partage avec les petits-enfants : un jeu de dames, un recueil de contes à lire à voix haute, un beau livre photo sur l'Afrique à feuilleter ensemble.",
        ],
      },
      {
        titre: "Un cadeau qui ressemble à la personne",
        paragraphes: [
          "Demandez-vous ce qu'elle fait de ses dimanches. Celle qui cuisine pour tout le monde appréciera un coffret d'épices ou un livre de recettes africaines. Celui qui refait sans cesse sa déco, une carte d'Afrique murale en bois ou un lot d'affiches. Celle qui soigne ses cheveux naturels, une huile de ricin noire, des brosses démêlantes ou un sèche-cheveux avec diffuseur. Le passionné d'histoire, un livre illustré sur l'histoire du continent. La coquette, des boucles d'oreilles en wax ou un collier plastron en perles. En cas de doute, regardez ce qu'elle utilise chaque jour et qui s'use vite : c'est souvent la meilleure liste de souhaits.",
        ],
      },
      {
        titre: "Un cadeau d'anniversaire toute l'année",
        paragraphes: [
          "Un anniversaire n'a pas de saison, et c'est un avantage : pas de cohue, pas de délais allongés comme avant Noël. Profitez-en pour noter les dates de vos proches dès janvier, surtout ceux qui vivent au pays, et préparer leur envoi plusieurs semaines à l'avance, avec un cadeau léger et solide. Pour un anniversaire qui tombe près des fêtes de fin d'année, offrez deux cadeaux bien distincts : personne n'aime voir son jour fondu dans Noël.",
        ],
      },
      {
        titre: "Marquer un anniversaire important",
        paragraphes: [
          "Pour un âge rond, une majorité ou un départ à la retraite, choisissez un cadeau qui dure : un pendentif carte d'Afrique en or, une montre en bois, un grand tableau peint à la main. Pour un anniversaire de mariage, une statuette de couple africain dit l'essentiel sans un mot. Ajoutez un mot écrit à la main qui raconte un souvenir partagé : c'est souvent ce qu'on garde le plus longtemps. Et si toute la famille veut participer, réunissez les messages de chacun dans une même carte.",
        ],
      },
    ],
  },

  "fete-des-meres": {
    parties: [
      {
        titre: "Date de la fête des mères en France",
        paragraphes: [
          "En France, la fête des mères tombe le dernier dimanche de mai. Une exception : quand ce dimanche est aussi celui de la Pentecôte, elle est décalée au premier dimanche de juin. La date change donc chaque année, et notre calendrier des fêtes indique la prochaine. Si votre mère vit au pays, vérifiez la date locale : selon les pays, la fête des mères n'est pas toujours célébrée le même jour qu'en France, et vous pourriez avoir deux occasions de la gâter. Dans le doute, demandez à une sœur ou à une tante sur place.",
        ],
      },
      {
        titre: "Cadeau fête des mères : livrer à temps",
        paragraphes: [
          "En France, le piège classique, c'est la fin mai : les commandes se multiplient, et les jours fériés du printemps peuvent ralentir les livraisons. Ne comptez pas sur une livraison le dimanche matin. Commandez au moins une semaine avant, faites livrer chez vous plutôt que chez elle si vous voulez garder la surprise, et emballez le cadeau vous-même. Un vêtement demande encore plus de marge, au cas où il faudrait l'échanger : pour une robe en wax ou un grand boubou brodé, prévoyez large ou choisissez un foulard de tête, sans souci de taille.",
        ],
      },
      {
        titre: "Fête des mères quand maman vit au pays",
        paragraphes: [
          "Pour un envoi en Afrique, comptez une à deux semaines au minimum, davantage selon le pays et le mode d'envoi. Le plus sûr est de préparer le colis dès le début du mois de mai, ou de le confier à un proche qui fait le voyage. Choisissez ce qui supporte la route : un foulard de tête, un lot de joncs dorés, des boucles d'oreilles carte d'Afrique, un sac cabas en wax. Gardez les parfums et les flacons pour une remise en main propre.",
        ],
      },
      {
        titre: "Le jour J, même avec un retard",
        paragraphes: [
          "Si le cadeau n'est pas arrivé, le dimanche reste à vous. Appelez tôt, avant que la maison ne se remplisse, et annoncez-lui le paquet en route : l'attente fait partie du plaisir. Si vous êtes en France, le cadeau du jour J peut être un moment : un repas que vous préparez pour elle avec un livre de recettes africaines, une matinée où elle n'a rien à faire. Une carte écrite par les petits-enfants, lue au téléphone, la touchera tout autant. Et pour l'an prochain, notez la date dès maintenant dans votre agenda, avec un rappel trois semaines avant : vous aurez le temps de choisir sans courir.",
        ],
      },
    ],
  },

  "fete-des-peres": {
    parties: [
      {
        titre: "Quand est la fête des pères en France",
        paragraphes: [
          "La fête des pères tombe le troisième dimanche de juin, quelques semaines seulement après la fête des mères. C'est le bon réflexe à prendre : préparez les deux en même temps. En commandant le cadeau de papa dès la fin mai, vous évitez la course de mi-juin, et un colis pour le pays peut partir dans le même envoi que celui de maman, à ouvrir plus tard. Notre calendrier des fêtes indique la date exacte de l'année. Beaucoup de papas ne fêtent pas ce jour-là avec éclat : raison de plus pour qu'un cadeau arrivé à l'heure le surprenne.",
        ],
      },
      {
        titre: "Cadeau fête des pères de dernière minute",
        paragraphes: [
          "À quelques jours du dimanche, oubliez les vêtements : une chemise en wax demande de connaître la taille, et un échange prend du temps. Misez sur ce qui ne se trompe pas de mesure : une montre en bois, une eau de parfum au oud, un kit d'entretien de barbe, un bracelet en perles, un chapelet. Commandez-les chez vous, et emballez-les vous-même la veille au soir. Si rien n'arrive à temps, un livre ou un beau livre photo sur l'Afrique se trouve encore facilement en librairie le samedi.",
        ],
      },
      {
        titre: "Envoyer un cadeau à papa au pays",
        paragraphes: [
          "Pour un papa resté au pays, il faut s'y prendre plusieurs semaines avant le troisième dimanche de juin. Choisissez des cadeaux plats, légers et solides, qui se glissent facilement dans un colis ou dans la valise d'un proche : une cravate en wax, des chaussettes à motifs, un recueil de proverbes africains, un livre illustré sur l'histoire de l'Afrique. Évitez les parfums et tout ce qui contient du liquide. Pour les règles de douane et les délais, renseignez-vous auprès de votre transporteur. Glissez une photo de famille récente dans le paquet : pour un papa loin de ses enfants, c'est souvent la première chose qu'il regarde.",
        ],
      },
      {
        titre: "Faire du jour J un vrai moment",
        paragraphes: [
          "Si vous êtes près de lui, le cadeau se remet le matin, toute la fratrie réunie si possible. Une théière en inox et un paquet de thé vert gunpowder sont l'occasion de préparer le thé ensemble l'après-midi ; un jeu de dames en bois, celle d'une partie qu'il gagnera peut-être. Pour un cadeau à plusieurs, un masque décoratif, une grande statue en bois sculpté ou un djembé marqueront davantage. Et si vous êtes loin, un appel en vidéo au moment où il ouvre le paquet fera la moitié du cadeau.",
        ],
      },
    ],
  },
};
