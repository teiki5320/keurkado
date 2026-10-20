/**
 * Fond d'atelier du design « Perles de bois » : halos de lumière chaude, trois fils tracés à la main,
 * poussières dorées qui montent. Purement décoratif (aria-hidden, sans interaction), figé si le visiteur
 * a demandé moins d'animations.
 */
const POUSSIERES = [
  { left: "12%", size: 5, delay: "0s", duree: "22s", doree: true },
  { left: "28%", size: 3, delay: "4s", duree: "18s", doree: false },
  { left: "47%", size: 4, delay: "9s", duree: "26s", doree: true },
  { left: "63%", size: 3, delay: "2s", duree: "20s", doree: false },
  { left: "78%", size: 5, delay: "12s", duree: "24s", doree: true },
  { left: "90%", size: 3, delay: "7s", duree: "17s", doree: false },
  { left: "6%", size: 3, delay: "14s", duree: "21s", doree: false },
];

const FILS = [
  { d: "M-50 120 C 200 60, 320 260, 560 190 S 900 60, 1250 160", couleur: "#8a6436", epaisseur: 1.6, delai: "0.2s" },
  { d: "M-50 520 C 180 440, 420 640, 640 540 S 980 420, 1250 560", couleur: "#b84a2a", epaisseur: 1.2, delai: "1s" },
  { d: "M-50 760 C 260 700, 400 820, 700 740 S 1000 660, 1250 720", couleur: "#2b1d14", epaisseur: 1, delai: "1.8s" },
];

export function Ambiance() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <span className="lumiere-1 absolute -top-[20%] -left-[10%] size-[70vw] rounded-full bg-[radial-gradient(circle,rgba(255,236,196,0.9)_0%,rgba(255,236,196,0)_65%)]" />
      <span className="lumiere-2 absolute -right-[15%] -bottom-[25%] size-[80vw] rounded-full bg-[radial-gradient(circle,rgba(184,74,42,0.22)_0%,rgba(184,74,42,0)_65%)]" />
      <span className="lumiere-1 absolute top-[60%] left-[30%] size-[50vw] rounded-full bg-[radial-gradient(circle,rgba(122,90,64,0.18)_0%,rgba(122,90,64,0)_65%)] [animation-direction:reverse] [animation-duration:40s]" />
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full opacity-35">
        {FILS.map((f) => (
          <path
            key={f.d}
            d={f.d}
            fill="none"
            stroke={f.couleur}
            strokeWidth={f.epaisseur}
            strokeDasharray="1600"
            strokeDashoffset="1600"
            className="anim-trace"
            style={{ animationDelay: f.delai }}
          />
        ))}
      </svg>
      {POUSSIERES.map((p) => (
        <span
          key={p.left}
          className="poussiere absolute top-0 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.doree ? "#e8b86a" : "#fff1cc",
            boxShadow: p.doree ? "0 0 8px 2px rgba(232,184,106,.6)" : "0 0 6px 2px rgba(255,241,204,.6)",
            animationDelay: p.delay,
            animationDuration: p.duree,
            transform: "translate(0, 110vh)",
          }}
        />
      ))}
    </div>
  );
}
