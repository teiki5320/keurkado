import type { Guide } from "./types";

/** Guide de la page /quiz : ce que fait Tonton Kado, comment lui répondre, ce que l'on obtient. */
export const GUIDE_QUIZ: Guide = {
  parties: [
    {
      titre: "Ce que fait Tonton Kado",
      paragraphes: [
        "Tonton Kado est le guide de l'atelier : il vous pose quelques questions, puis il enfile sur son cordon les idées cadeaux de notre catalogue qui correspondent à vos réponses. Chaque perle est un cadeau que nous avons choisi et décrit nous-mêmes : wax et mode, bijoux, beauté afro, art et déco, jeux et jouets. Tout se passe dans votre navigateur, sans inscription.",
      ],
    },
    {
      titre: "Comment répondre aux questions",
      paragraphes: [
        "Tonton Kado vous demande d'abord pour qui est le cadeau, puis pour quelle occasion, et enfin quel budget vous avez en tête. Si vous hésitez, rien ne vous oblige à trancher : « Je ne sais pas encore », « Juste pour faire plaisir » et « Peu importe » sont des réponses tout à fait valables. La personne compte le plus dans son choix, l'occasion ensuite, le budget en dernier.",
        "Une fois les idées affichées, une dernière option vous attend si le cadeau part dans un colis : « À envoyer au pays » ne garde que les cadeaux légers, solides et sans liquide. Vous pouvez aussi changer l'occasion ou le budget sans tout recommencer.",
      ],
    },
    {
      titre: "Ce que vous obtenez",
      paragraphes: [
        "Tonton Kado vous montre jusqu'à huit idées à la fois. Quand aucun cadeau ne coche toutes vos réponses, il vous propose les plus proches, en le disant franchement. Touchez une perle pour lire pourquoi il l'a choisie ; le bouton de la fiche vous emmène ensuite sur Amazon.fr, où vous vérifiez le prix et les détails avant de commander. « D'autres idées » élargit la recherche. Et comme vos réponses s'inscrivent dans l'adresse de la page, vous pouvez la garder ou l'envoyer à un proche pour choisir ensemble.",
      ],
    },
  ],
};

/** Guide de la page /top : comment nous composons et classons nos Top 10, et comment choisir le bon. */
export const GUIDE_TOPS: Guide = {
  parties: [
    {
      titre: "Comment nous composons nos Top 10",
      paragraphes: [
        "Chaque Top 10 réunit dix cadeaux de notre catalogue, tous choisis pour la page qu'il accompagne : une occasion, une personne, un budget ou un univers. Pour chacun, nous écrivons un « pourquoi » propre à la liste : le même bijou ne se présente pas de la même façon à une maman pour la fête des mères et à une collègue pour Noël. Chaque sélection se termine par des conseils pour bien choisir et par les réponses aux questions que l'on se pose le plus souvent.",
      ],
    },
    {
      titre: "Comment nos sélections sont classées",
      paragraphes: [
        "L'ordre n'est jamais laissé au hasard, et chaque liste annonce le sien dès l'introduction : du cadeau le plus traditionnel au plus original, de celui qui plaît au plus grand nombre au plus pointu, ou encore du plus facile à glisser dans un colis au plus encombrant. C'est notre classement, pas un palmarès officiel : il ne repose ni sur des ventes ni sur des tests en laboratoire, mais sur notre connaissance des fêtes et des familles.",
      ],
    },
    {
      titre: "Quel Top 10 choisir pour qui",
      paragraphes: [
        "Si vous savez pour qui est le cadeau, partez de la personne : maman, papa, femme, homme, enfant, ado ou collègue. Si c'est la date qui presse, partez de l'occasion : Tabaski, Korité, Noël, mariage, baptême, anniversaire ou fête des mères. Pour un petit budget, une sélection entière réunit des idées à prix doux, et une autre rassemble les cadeaux qui voyagent bien jusqu'au pays. Les prix évoluent sur Amazon : vérifiez-les sur la fiche avant de commander.",
      ],
    },
  ],
};

/** Guide de la page /envoyer-au-pays : choisir un cadeau qui voyage, préparer le colis, penser à la personne qui reçoit. */
export const GUIDE_ENVOYER: Guide = {
  parties: [
    {
      titre: "Que mettre dans un colis pour l'Afrique ?",
      paragraphes: [
        "Avant de penser au carton, pensez au trajet : des mains qui le portent, des piles où il se retrouve coincé, parfois la chaleur d'un entrepôt. Un bon cadeau à envoyer se plie, se roule ou se glisse à plat, ne craint ni les chocs ni les fortes températures, et arrive tel qu'il est parti. Un tissu, un vêtement, un bijou simple, un livre ou un jeu en bois remplissent ces conditions sans rien retirer au plaisir d'offrir.",
        "Posez-vous aussi une question simple : le cadeau gardera-t-il son charme s'il arrive avec du retard ? Un objet lié à une date perd de son sens une fois la fête passée ; un foulard se reçoit avec la même joie quelques jours plus tard.",
      ],
    },
    {
      titre: "Comment préparer un colis depuis la France",
      paragraphes: [
        "Le plus sûr est souvent de vous faire livrer vos achats chez vous, en France, avant de les expédier. Vous vérifiez ainsi la taille, la couleur et l'état de chaque article. Vous retirez les emballages superflus et réunissez le tout dans un seul envoi soigné, chaque cadeau bien calé.",
        "Avant de fermer le carton, dressez la liste de son contenu, article par article, et gardez-en une copie. Elle vous aidera à remplir la déclaration avec une valeur honnête, celle que vous avez réellement payée. Pour les délais, les objets acceptés et la douane, renseignez-vous auprès du transporteur : il connaît les règles du pays de destination.",
      ],
    },
    {
      titre: "Quel cadeau envoyer à sa famille au pays ?",
      paragraphes: [
        "Un cadeau qui part si loin doit tomber juste : on ne l'échange pas facilement à l'arrivée. Pour un vêtement, demandez discrètement les tailles à un proche, ou choisissez une pièce qui s'adapte à toutes les silhouettes, comme un pagne ou un foulard. Pensez aussi au climat et aux habitudes de la personne : une tenue de fête servira pour un baptême ou un mariage, un tissu léger se portera tous les jours.",
        "Le plus beau cadeau répond souvent à un vrai besoin. N'hésitez pas à poser la question franchement : des fournitures pour la rentrée des enfants, un livre attendu depuis longtemps, un accessoire pour les cheveux. Ceux qui reçoivent savent le mieux ce qui leur manque, et votre attention n'en sera que plus touchante.",
      ],
    },
  ],
};
