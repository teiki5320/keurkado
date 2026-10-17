"use client";

import { useEffect, useState } from "react";
import { joursEntre } from "@/lib/calendrier";
import { todayInParis } from "@/lib/conseils/article";

/**
 * « Dans 12 jours » : calculé dans le navigateur, pour rester juste entre deux publications du site.
 * Sans JavaScript (ou avant le calcul), rien n'est affiché.
 */
export function Compteur({ date, className = "" }: { date: string; className?: string }) {
  const [jours, setJours] = useState<number | null>(null);
  useEffect(() => {
    // Calcul unique au chargement (le rendu statique ne connaît pas la date du visiteur).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJours(joursEntre(todayInParis(), date));
  }, [date]);
  if (jours === null || jours < 0) return null;
  return <span className={className}>{jours === 0 ? "Aujourd'hui !" : jours === 1 ? "Demain" : `Dans ${jours} jours`}</span>;
}
