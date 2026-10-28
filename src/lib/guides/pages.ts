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
