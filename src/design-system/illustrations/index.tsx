/**
 * CareAI Illustrationen — 12 SVGs, 2-farbig (Petrol + Orange), organisch.
 * Dark-Mode: Farben passen sich via currentColor/Tailwind automatisch an.
 * Nutzung: <PflegeTeam className="h-64 w-64" />
 */
import * as React from "react";

type SvgProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

const base = "text-primary-700 dark:text-primary-300";
const accent = "text-accent-500";

function Svg({ title, children, className = "", ...rest }: SvgProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 200 200"
      role={title ? "img" : "presentation"}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      className={`${base} ${className}`}
      {...rest}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

/* 1 — Pflegeteam */
export function PflegeTeam(props: SvgProps) {
  return (
    <Svg title="Pflegekraft mit Bewohner" {...props}>
      <circle cx="100" cy="105" r="85" fill="currentColor" opacity="0.08" />
      {/* Bewohner im Sessel */}
      <rect x="40" y="100" width="60" height="70" rx="14" fill="currentColor" opacity="0.2" />
      <circle cx="70" cy="90" r="18" fill="currentColor" />
      {/* Pflegekraft */}
      <rect x="110" y="85" width="50" height="80" rx="14" className={accent} fill="currentColor" opacity="0.85" />
      <circle cx="135" cy="70" r="17" className={accent} fill="currentColor" />
      {/* Herz zwischen beiden */}
      <path
        d="M100 130 c -6 -10 -22 -6 -22 6 c 0 10 22 22 22 22 s 22 -12 22 -22 c 0 -12 -16 -16 -22 -6z"
        className={accent}
        fill="currentColor"
      />
    </Svg>
  );
}

/* 2 — Dokumentation */
export function Dokumentation(props: SvgProps) {
  return (
    <Svg title="Schwebende Berichtskarten" {...props}>
      <circle cx="100" cy="100" r="88" fill="currentColor" opacity="0.06" />
      <rect x="40" y="70" width="80" height="100" rx="10" fill="currentColor" opacity="0.9" />
      <rect x="55" y="50" width="80" height="100" rx="10" fill="currentColor" opacity="0.5" />
      <rect x="70" y="30" width="80" height="100" rx="10" className={accent} fill="currentColor" opacity="0.85" />
      <line x1="85" y1="55" x2="135" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="85" y1="75" x2="125" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="85" y1="95" x2="130" y2="95" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

/* 3 — Spracheingabe (Hero) */
export function SpracheingabeHero(props: SvgProps) {
  return (
    <Svg title="Mikrofon mit Schallwellen" {...props}>
      <circle cx="100" cy="100" r="90" fill="currentColor" opacity="0.05" />
      {/* Schallwellen */}
      <path d="M40 100 Q 55 75 70 100 T 100 100" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M130 100 Q 145 75 160 100 T 190 100" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M25 100 Q 40 65 55 100 T 85 100" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M145 100 Q 160 65 175 100 T 205 100" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
      {/* Mikrofon */}
      <rect x="88" y="55" width="24" height="55" rx="12" className={accent} fill="currentColor" />
      <path d="M75 100 a 25 25 0 0 0 50 0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="130" x2="100" y2="150" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="85" y1="150" x2="115" y2="150" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

/* 4 — Sicherheit */
export function Sicherheit(props: SvgProps) {
  return (
    <Svg title="Schild mit Schloss" {...props}>
      <circle cx="100" cy="100" r="88" fill="currentColor" opacity="0.06" />
      <path
        d="M100 25 L 160 50 L 160 100 Q 160 150 100 175 Q 40 150 40 100 L 40 50 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <rect x="80" y="90" width="40" height="35" rx="4" className={accent} fill="currentColor" />
      <path d="M85 90 V 75 a 15 15 0 0 1 30 0 V 90" fill="none" className={accent} stroke="currentColor" strokeWidth="4" />
    </Svg>
  );
}

/* 5 — EU-Region */
export function EuRegion(props: SvgProps) {
  return (
    <Svg title="EU-Sterne ueber Server" {...props}>
      <circle cx="100" cy="100" r="88" fill="currentColor" opacity="0.06" />
      {/* Sterne */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const angle = (i * 360) / 12 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = 100 + 55 * Math.cos(rad);
        const y = 60 + 30 * Math.sin(rad);
        return (
          <circle key={i} cx={x} cy={y} r="3" className={accent} fill="currentColor" />
        );
      })}
      {/* Server */}
      <rect x="55" y="110" width="90" height="55" rx="6" fill="currentColor" opacity="0.9" />
      <rect x="65" y="120" width="70" height="6" rx="3" className={accent} fill="currentColor" />
      <rect x="65" y="132" width="70" height="6" rx="3" className={accent} fill="currentColor" opacity="0.6" />
      <rect x="65" y="144" width="70" height="6" rx="3" className={accent} fill="currentColor" opacity="0.4" />
    </Svg>
  );
}

/* 6 — Zeitersparnis */
export function Zeitersparnis(props: SvgProps) {
  return (
    <Svg title="Uhr mit Pfeil" {...props}>
      <circle cx="100" cy="100" r="88" fill="currentColor" opacity="0.06" />
      <circle cx="95" cy="100" r="55" fill="currentColor" opacity="0.9" />
      <line x1="95" y1="100" x2="95" y2="65" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="95" y1="100" x2="120" y2="100" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <path d="M 155 90 L 180 65 L 180 75 M 180 65 L 170 65" className={accent} stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/* 7 — Human-in-the-Loop */
export function HumanInTheLoop(props: SvgProps) {
  return (
    <Svg title="Hand mit KI-Gehirn" {...props}>
      <circle cx="100" cy="100" r="88" fill="currentColor" opacity="0.06" />
      {/* Hand (vereinfacht) */}
      <path d="M30 170 Q 30 110 60 110 L 90 110 Q 100 110 100 125 L 100 170 Z" fill="currentColor" opacity="0.9" />
      {/* Gehirn */}
      <circle cx="140" cy="70" r="32" className={accent} fill="currentColor" opacity="0.9" />
      <path d="M125 70 Q 140 55 155 70 M 125 80 Q 140 65 155 80" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Verbindung */}
      <path d="M105 125 Q 120 100 135 95" stroke="currentColor" strokeWidth="3" strokeDasharray="4 4" fill="none" />
    </Svg>
  );
}

/* 8 — Notfall */
export function Notfall(props: SvgProps) {
  return (
    <Svg title="Glocke mit Pulslinie" {...props}>
      <circle cx="100" cy="100" r="88" fill="currentColor" opacity="0.06" />
      <path d="M100 40 Q 140 40 140 85 L 145 115 L 55 115 L 60 85 Q 60 40 100 40 Z" fill="currentColor" opacity="0.9" />
      <circle cx="100" cy="130" r="10" className={accent} fill="currentColor" />
      {/* Puls */}
      <path
        d="M30 155 L 60 155 L 70 140 L 85 170 L 100 150 L 115 165 L 125 155 L 170 155"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={accent}
      />
    </Svg>
  );
}

/* 9 — Angehoerige */
export function Angehoerige(props: SvgProps) {
  return (
    <Svg title="Familie am Tablet" {...props}>
      <circle cx="100" cy="100" r="88" fill="currentColor" opacity="0.06" />
      {/* Tablet */}
      <rect x="55" y="70" width="90" height="70" rx="8" fill="currentColor" opacity="0.9" />
      <rect x="62" y="78" width="76" height="54" rx="3" fill="white" opacity="0.15" />
      {/* Kopf 1 */}
      <circle cx="80" cy="105" r="8" className={accent} fill="currentColor" />
      <circle cx="100" cy="105" r="8" className={accent} fill="currentColor" opacity="0.8" />
      <circle cx="120" cy="105" r="8" className={accent} fill="currentColor" opacity="0.6" />
      {/* Herzen */}
      <path d="M80 50 c -3 -5 -12 -3 -12 4 c 0 5 12 12 12 12 s 12 -7 12 -12 c 0 -7 -9 -9 -12 -4z" className={accent} fill="currentColor" opacity="0.8" />
      <path d="M130 40 c -2 -4 -9 -2 -9 3 c 0 4 9 9 9 9 s 9 -5 9 -9 c 0 -5 -7 -7 -9 -3z" className={accent} fill="currentColor" opacity="0.5" />
    </Svg>
  );
}

/* 10 — Integration */
export function Integration(props: SvgProps) {
  return (
    <Svg title="Puzzle-Stecker" {...props}>
      <circle cx="100" cy="100" r="88" fill="currentColor" opacity="0.06" />
      <path
        d="M40 70 L 90 70 Q 90 55 105 55 Q 120 55 120 70 L 130 70 Q 145 70 145 85 L 145 115 Q 145 130 130 130 L 120 130 Q 120 145 105 145 Q 90 145 90 130 L 40 130 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M170 80 L 155 80 Q 155 95 140 95 Q 125 95 125 80 L 110 80 L 110 120 L 125 120 Q 125 105 140 105 Q 155 105 155 120 L 170 120 Z"
        className={accent}
        fill="currentColor"
        opacity="0.85"
        transform="translate(5, 0)"
      />
    </Svg>
  );
}

/* 11 — Qualitaet */
export function Qualitaet(props: SvgProps) {
  return (
    <Svg title="Siegel mit Haekchen" {...props}>
      <circle cx="100" cy="100" r="88" fill="currentColor" opacity="0.06" />
      <path
        d="M100 30 l 15 12 l 20 -2 l 7 19 l 18 9 l -5 20 l 9 18 l -15 13 l -2 20 l -20 2 l -13 15 l -18 -9 l -18 9 l -13 -15 l -20 -2 l -2 -20 l -15 -13 l 9 -18 l -5 -20 l 18 -9 l 7 -19 l 20 2 l 15 -12 z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M70 100 L 92 120 L 135 78"
        stroke="white"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* 12 — Barrierefreiheit */
export function Barrierefreiheit(props: SvgProps) {
  return (
    <Svg title="Oeffnende Tuer" {...props}>
      <circle cx="100" cy="100" r="88" fill="currentColor" opacity="0.06" />
      <rect x="40" y="40" width="80" height="130" rx="4" fill="currentColor" opacity="0.3" />
      <path d="M55 40 L 135 30 L 135 160 L 55 170 Z" fill="currentColor" opacity="0.9" />
      <circle cx="122" cy="100" r="4" className={accent} fill="currentColor" />
      {/* Lichtstrahl */}
      <path d="M135 30 L 175 50 L 175 155 L 135 160 Z" className={accent} fill="currentColor" opacity="0.2" />
    </Svg>
  );
}

export const illustrations = {
  PflegeTeam,
  Dokumentation,
  SpracheingabeHero,
  Sicherheit,
  EuRegion,
  Zeitersparnis,
  HumanInTheLoop,
  Notfall,
  Angehoerige,
  Integration,
  Qualitaet,
  Barrierefreiheit,
};
