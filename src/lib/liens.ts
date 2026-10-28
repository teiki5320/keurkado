/**
 * Liens « À lire aussi » en boucle (même principe que Keur Déco) : chaque page reçoit autant de liens
 * qu'elle en donne, aucune n'est oubliée, même la plus ancienne.
 */

/** Les `n` éléments qui suivent `courant` dans la liste, en repartant du début après le dernier. */
export function suivantsEnBoucle<T>(liste: readonly T[], courant: T, n: number): T[] {
  const i = liste.indexOf(courant);
  const autres = i < 0 ? [...liste] : [...liste.slice(i + 1), ...liste.slice(0, i)];
  return autres.slice(0, n);
}

/**
 * Liens d'une liste vers une autre (Top 10 → conseils, conseils → Top 10) : la page n° `i` reçoit les éléments
 * `i × n` à `i × n + n − 1` de la cible, en boucle. Les pages se partagent la cible à tour de rôle,
 * si bien que chaque élément de la cible est lié par au moins ⌊(pages × n) / cible⌋ pages.
 */
export function croisesEnBoucle<T>(cible: readonly T[], i: number, n: number): T[] {
  if (cible.length === 0 || i < 0) return [];
  const nombre = Math.min(n, cible.length);
  return Array.from({ length: nombre }, (_, k) => cible[(i * n + k) % cible.length]);
}
