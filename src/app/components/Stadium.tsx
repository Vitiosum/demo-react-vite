import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ACCEL, PACER_COLOR, lapSeconds } from "../utils/hares";

// Le stade vu de haut : piste de 400 m, 8 couloirs, pelouse, tribunes et projecteurs.
// Les coureurs tournent dans le sens réglementaire (inverse des aiguilles d'une montre),
// la ligne d'arrivée est au bout de la ligne droite du bas. Tout est dessiné ici, en SVG.

const W = 1000;
const H = 640;
const CX = 500;
const CY = 320;
const A = 190; // demi-longueur des lignes droites
const R0 = 206; // rayon de la corde
const LW = 9.5; // largeur d'un couloir
const LANES = 8;
const R8 = R0 + LANES * LW;
const RL = R0 - 4; // feux de cadence, côté pelouse de la corde

export const laneRadius = (lane: number) => R0 + (lane - 0.5) * LW;

/** Contour de la piste au rayon r, départ sur la ligne d'arrivée, sens de course. */
function oval(r: number) {
  return `M${CX + A} ${CY + r}A${r} ${r} 0 0 0 ${CX + A} ${CY - r}L${CX - A} ${CY - r}A${r} ${r} 0 0 0 ${CX - A} ${CY + r}Z`;
}

/** Point de la piste à la fraction f d'un tour (0 = ligne d'arrivée), au rayon r. */
function pointAt(f: number, r: number): [number, number] {
  const S = 2 * A;
  const C = Math.PI * r;
  let d = (((f % 1) + 1) % 1) * (2 * S + 2 * C);
  if (d < C) {
    const t = Math.PI / 2 - Math.PI * (d / C);
    return [CX + A + r * Math.cos(t), CY + r * Math.sin(t)];
  }
  d -= C;
  if (d < S) return [CX + A - d, CY - r];
  d -= S;
  if (d < C) {
    const t = 1.5 * Math.PI - Math.PI * (d / C);
    return [CX - A + r * Math.cos(t), CY + r * Math.sin(t)];
  }
  return [CX - A + (d - C), CY + r];
}

/** Distance d'un point au bord d'une piste de rayon nul (pour placer le public). */
function ovalDistance(x: number, y: number) {
  const dx = Math.max(Math.abs(x - CX) - A, 0);
  return Math.hypot(dx, y - CY);
}

// Public des tribunes : points générés une fois, graine fixe (même image à chaque visite).
function crowd() {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const tones = ["#2a2f55", "#353a66", "#41467a", "#2c3152", "#4c5185", "#5a4b72", "#6b3b55"];
  const dots: { x: number; y: number; r: number; c: string; flash: number }[] = [];
  let flashes = 0;
  for (let i = 0; i < 4200 && dots.length < 1100; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    if (ovalDistance(x, y) < R8 + 16) continue;
    const flash = flashes < 16 && rnd() < 0.03 ? ++flashes : 0;
    dots.push({ x, y, r: 1.1 + rnd() * 1.3, c: tones[Math.floor(rnd() * tones.length)], flash });
  }
  return dots;
}
const CROWD = crowd();
const MASTS: [number, number][] = [[40, 34], [960, 34], [40, 606], [960, 606]];

export interface Mover {
  id: string;
  /** Allure en s/km ; null = ne court pas (temps invalide). */
  pace: number | null;
  lane: number;
  color: string;
  you?: boolean;
}

function useReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(() => window.matchMedia?.(query)?.matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

interface StadiumProps {
  movers: Mover[];
  /** Objectif du club (GOAL_PACE), en s/km : vitesse des feux de cadence. */
  goalPace: number;
  /** Allure servant à figer la scène (mouvement réduit, premier affichage). */
  refPace: number;
  label: string;
}

export function Stadium({ movers, goalPace, refPace, label }: StadiumProps) {
  const reduced = useReducedMotion();
  const all: Mover[] = [...movers, { id: "pacer", pace: goalPace, lane: 0, color: PACER_COLOR }];

  // Position de chacun (fraction de tour). Premier affichage : une scène déjà lancée,
  // au moment où vous avez couru 62 % d'un tour.
  const frac = useRef<Record<string, number>>({});
  const paces = useRef<Record<string, number | null>>({});
  const nodes = useRef<Record<string, SVGGElement | null>>({});
  const streaks = useRef<Record<string, SVGPathElement | null>>({});
  const lights = useRef<SVGPathElement[]>([]);
  const current = useRef(all);
  current.current = all;

  const t0 = lapSeconds(refPace) * 0.62;
  for (const m of all) {
    paces.current[m.id] = m.pace;
    if (frac.current[m.id] === undefined || reduced) frac.current[m.id] = m.pace ? t0 / lapSeconds(m.pace) : 0;
  }

  const place = () => {
    for (const m of current.current) {
      const f = frac.current[m.id];
      if (m.id === "pacer") {
        lights.current.forEach((el, i) => el?.setAttribute("stroke-dashoffset", String(-(f * 1000 - (i ? 30 : 95)))));
        continue;
      }
      const [x, y] = pointAt(f, laneRadius(m.lane));
      nodes.current[m.id]?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      streaks.current[m.id]?.setAttribute("stroke-dashoffset", String(-(f * 1000 - 34)));
    }
  };

  useLayoutEffect(place);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      for (const id of Object.keys(paces.current)) {
        const p = paces.current[id];
        if (p) frac.current[id] = (frac.current[id] + (dt * ACCEL) / lapSeconds(p)) % 1;
      }
      place();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]); // place() lit les refs, toujours à jour : pas d'autre dépendance

  const runners = movers.filter((m) => m.pace !== null);

  return (
    <svg className="rr-oval" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <defs>
        <radialGradient id="rrFlood" r="0.5">
          <stop offset="0" stopColor="#fff3d1" stopOpacity="0.32" />
          <stop offset="0.45" stopColor="#fff3d1" stopOpacity="0.08" />
          <stop offset="1" stopColor="#fff3d1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rrBloom" r="0.5">
          <stop offset="0" stopColor="#fffbe9" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#fff3d1" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff3d1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rrVignette" r="0.75">
          <stop offset="0.55" stopColor="#060818" stopOpacity="0" />
          <stop offset="1" stopColor="#060818" stopOpacity="0.85" />
        </radialGradient>
        <pattern id="rrMow" x="237" y="0" width="105" height={H} patternUnits="userSpaceOnUse">
          <rect width="52.5" height={H} fill="#1f5236" />
          <rect x="52.5" width="52.5" height={H} fill="#1b4a31" />
        </pattern>
        <mask id="rrLightsHead" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <path ref={(el) => { if (el) lights.current[1] = el; }} d={oval(RL)} pathLength={1000} fill="none" stroke="#fff" strokeWidth="12" strokeDasharray="30 970" />
        </mask>
        <mask id="rrLightsTail" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <path ref={(el) => { if (el) lights.current[0] = el; }} d={oval(RL)} pathLength={1000} fill="none" stroke="#fff" strokeWidth="12" strokeDasharray="95 905" />
        </mask>
      </defs>

      {/* Tribunes */}
      <rect width={W} height={H} fill="#0a0d22" />
      {[300, 322, 344, 366, 388, 410].map((r) => (
        <path key={r} d={oval(r)} fill="none" stroke="#1a1e3d" strokeWidth="1" />
      ))}
      <g>
        {CROWD.map((d, i) => (
          <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r.toFixed(2)} fill={d.flash ? "#fff" : d.c}
            className={d.flash ? "rr-flash" : undefined} style={d.flash ? { animationDelay: `${(d.flash * 1.37) % 9}s` } : undefined} />
        ))}
      </g>
      <path d={oval(R8 + 12)} fill="#151936" />

      {/* Piste, couloirs, pelouse */}
      <path d={`${oval(R8 + 4)}${oval(R0)}`} fill="#9b3a2a" fillRule="evenodd" />
      {Array.from({ length: LANES + 1 }, (_, i) => (
        <path key={i} d={oval(R0 + i * LW)} fill="none" stroke="#f4efe6" strokeOpacity={i === 0 ? 0.95 : 0.55} strokeWidth={i === 0 ? 2 : 0.8} />
      ))}
      <path d={oval(R0 - 1)} fill="url(#rrMow)" />
      <g fill="none" stroke="#f4efe6" strokeOpacity="0.32" strokeWidth="1.4">
        <rect x="237" y="150" width="526" height="340" />
        <line x1="500" y1="150" x2="500" y2="490" />
        <circle cx="500" cy="320" r="46" />
        <rect x="237" y="220" width="82" height="200" />
        <rect x="681" y="220" width="82" height="200" />
        <rect x="237" y="274" width="27" height="92" />
        <rect x="736" y="274" width="27" height="92" />
      </g>

      {/* Ligne d'arrivée, numéros de couloir, cabine photo-finish */}
      <line x1={CX + A} y1={CY + R0} x2={CX + A} y2={CY + R8} stroke="#fff" strokeWidth="3" />
      {Array.from({ length: LANES }, (_, i) => (
        <text key={i} x={CX + A - 16} y={CY + laneRadius(i + 1) + 2.6} className="rr-oval__lane">{i + 1}</text>
      ))}
      <g transform={`translate(${CX + A} ${CY + R8 + 20})`}>
        <rect x="-9" y="-6" width="18" height="12" rx="2" fill="#2a2f55" stroke="#f4efe6" strokeOpacity="0.5" />
        <circle cx="0" cy="-6" r="2.4" fill="#cb1c42" />
      </g>

      {/* Projecteurs */}
      {MASTS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="560" fill="url(#rrFlood)" className="rr-oval__flood" />
      ))}
      <rect width={W} height={H} fill="url(#rrVignette)" />

      {/* Feux de cadence (GOAL_PACE) le long de la corde */}
      <path d={oval(RL)} fill="none" stroke="#1d4a31" strokeWidth="3" strokeLinecap="round" strokeDasharray="0 6.4" />
      <path d={oval(RL)} fill="none" stroke={PACER_COLOR} strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" strokeDasharray="0 6.4" mask="url(#rrLightsTail)" />
      <path d={oval(RL)} fill="none" stroke={PACER_COLOR} strokeOpacity="0.35" strokeWidth="10" strokeLinecap="round" strokeDasharray="0 6.4" mask="url(#rrLightsHead)" />
      <path d={oval(RL)} fill="none" stroke={PACER_COLOR} strokeWidth="3.6" strokeLinecap="round" strokeDasharray="0 6.4" mask="url(#rrLightsHead)" className="rr-oval__pacer" />

      {/* Coureurs : traînée lumineuse + point */}
      {runners.map((m) => (
        <path key={`s-${m.id}`} ref={(el) => { streaks.current[m.id] = el; }} d={oval(laneRadius(m.lane))} pathLength={1000}
          fill="none" stroke={m.color} strokeOpacity={m.you ? 0.7 : 0.5} strokeWidth={m.you ? 5 : 4} strokeLinecap="round" strokeDasharray="34 966" />
      ))}
      {runners.map((m) => (
        <g key={m.id} ref={(el) => { nodes.current[m.id] = el; }} className={m.you ? "rr-oval__you" : undefined}>
          <circle r={m.you ? 15 : 11} fill={m.color} opacity="0.28" />
          <circle r={m.you ? 7.5 : 6} fill={m.color} stroke={m.you ? "#fff" : "#0a0d22"} strokeWidth={m.you ? 2.6 : 1.5} />
          {m.you && (
            <g transform="translate(0 -24)">
              <rect x="-22" y="-10" width="44" height="19" rx="9.5" fill="#fff" />
              <text y="4" className="rr-oval__tag">Vous</text>
            </g>
          )}
        </g>
      ))}

      {MASTS.map(([x, y]) => (
        <g key={`m-${x}-${y}`} transform={`translate(${x} ${y}) rotate(${(Math.atan2(CY - y, CX - x) * 180) / Math.PI - 90})`}>
          <circle r="54" fill="url(#rrBloom)" />
          <rect x="-15" y="-5" width="30" height="10" rx="2" fill="#2a2f55" />
          {[-10, -3.3, 3.3, 10].map((dx) => <circle key={dx} cx={dx} cy="1.5" r="2.4" fill="#fffef5" />)}
        </g>
      ))}
    </svg>
  );
}
