// Eine einzige zusammenhängende Landkarte für alle Welten (6000 × 600).
// Himmel und Boden gehen fließend ineinander über, ein durchgehender
// Weg verbindet alle Level. Themen-Deko markiert die Regionen:
// Wald → Blumenwiese → Berge → Sonnensee → Sternenhimmel → Königsschloss
//
// Vier Tiefenebenen (Himmel, ferne Hügel, Wolken, Hauptebene mit dem Weg)
// bewegen sich beim Scrollen minimal unterschiedlich schnell (siehe --scroll
// in Path.jsx), dazu kommen dezente Animationen (Treiben, Glitzern, Wiegen)
// für einen lebendigeren, weniger flachen Look.

import { Cloud, Sun, Tree, Pine, Flower, Butterfly, Star, Mountain } from './Scenes.jsx'

function Mushroom({ x, y, s = 1, cap = '#e05252' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="6" rx="16" ry="4" fill="#000" opacity="0.15" />
      <rect x="-5" y="-8" width="10" height="14" rx="4" fill="#f3e3c3" />
      <path d="M -16 -6 A 16 12 0 0 1 16 -6 Z" fill={cap} />
      <circle cx="-7" cy="-12" r="3" fill="#fff" />
      <circle cx="6" cy="-10" r="2.4" fill="#fff" />
    </g>
  )
}

// Farn für den Waldboden – mehrere Wedel fächern sich vom Ansatzpunkt auf
function Fern({ x, y, s = 1, c = '#2e6e3c' }) {
  const delay = (x * 0.31) % 4
  const frond = (angle, len) => {
    const rad = (angle * Math.PI) / 180
    const ex = Math.sin(rad) * len
    const ey = -Math.cos(rad) * len
    return `M 0 2 Q ${(ex * 0.35).toFixed(1)} ${(ey * 0.5).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="pano-sway" style={{ animationDelay: `-${delay}s` }}>
        {[-42, -20, 0, 20, 42].map((a) => (
          <path key={a} d={frond(a, 28 - Math.abs(a) * 0.18)} stroke={c} strokeWidth="5" fill="none" strokeLinecap="round" />
        ))}
      </g>
    </g>
  )
}

// Umgestürzter Baumstamm – Waldboden-Deko, unterstreicht den "gewachsenen" Wald
function Log({ x, y, s = 1, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx="0" cy="10" rx="52" ry="8" fill="#000" opacity="0.15" />
      <rect x="-50" y="-8" width="100" height="16" rx="8" fill="#8a5a35" />
      <rect x="-50" y="-9" width="100" height="5" rx="2.5" fill="#a97a4d" opacity="0.6" />
      <ellipse cx="-50" cy="0" rx="8" ry="8" fill="#6e4527" />
      <ellipse cx="-50" cy="0" rx="5" ry="5" fill="#c9a874" />
      <path d="M -18 -6 q 4 -3 8 0 M 4 -5 q 4 -3 8 0 M 24 -6 q 4 -3 8 0" stroke="#6e4527" strokeWidth="2" fill="none" opacity="0.5" />
    </g>
  )
}

// Waldtiere – sitzen/stehen still zwischen den Bäumen, rein dekorativ.
// Aufgebaut wie Capy (Körper → Kopf → Ohren → Gesicht), mit großzügigen
// Überlappungen zwischen den Teilen, damit nichts "lose" wirkt.

function Rabbit({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="9" rx="19" ry="4.5" fill="#000" opacity="0.15" />

      {/* Puschelschwanz: weiches, flauschiges Eigenschatten statt harter Kante */}
      <circle cx="14" cy="8" r="6" fill="#fbf3e6" />
      <ellipse cx="16.5" cy="10" rx="3.4" ry="3" fill="#d9c9b8" opacity="0.45" filter="url(#edge)" />

      {/* Körper, Licht links oben → Schatten rechts unten wie bei den Bäumen */}
      <path d="M -15 12 Q -18 -6 -8 -12 Q 0 -15 8 -12 Q 18 -6 15 12 Q 15 15 0 16 Q -15 15 -15 12 Z" fill="url(#rabbit-grad)" />

      {/* Pfoten */}
      <ellipse cx="-6" cy="13" rx="4" ry="3" fill="#f4e6d2" />
      <ellipse cx="6" cy="13" rx="4" ry="3" fill="#f4e6d2" />

      {/* helleres Bauchfell */}
      <ellipse cx="0" cy="6" rx="8" ry="7" fill="#f4e6d2" />

      {/* Ein durchgehender, heller Schlagschatten über Körper UND Bauchfell hinweg,
          damit beide wie ein einheitliches Fell wirken statt getrennt beschattet */}
      <path d="M 8 -12 Q 18 -6 15 12 Q 15 15 0 16 Q 5 9 7 -1 Q 8 -7 8 -12 Z" fill="#9c7c56" opacity="0.25" filter="url(#edge)" />

      {/* Ohren (Basis liegt tief im Kopf), Außenseite im selben Verlauf wie Körper/Kopf,
          Innenseite mit eigenem Schatten zur Ohrbasis hin (wirkt "gemuldet") */}
      <path d="M -9 -22 Q -13 -40 -6 -47 Q -2 -44 -4 -24 Z" fill="url(#rabbit-grad)" />
      <path d="M -7 -30 Q -8 -40 -6 -46 Q -4 -42 -5 -31 Q -6 -29 -7 -30 Z" fill="#a9825a" opacity="0.4" filter="url(#edge)" />
      <path d="M -8 -25 Q -10 -38 -6 -44 Q -3 -41 -5 -26 Z" fill="#f4c9d6" />
      <ellipse cx="-6.5" cy="-27" rx="1.6" ry="3.4" fill="#dba0b6" opacity="0.5" filter="url(#edge)" />

      <path d="M 9 -22 Q 13 -40 6 -47 Q 2 -44 4 -24 Z" fill="url(#rabbit-grad)" />
      <path d="M 6 -33 Q 9 -40 6 -47 Q 3 -42 4 -33 Q 5 -30 6 -33 Z" fill="#a9825a" opacity="0.45" filter="url(#edge)" />
      <path d="M 8 -25 Q 10 -38 6 -44 Q 3 -41 5 -26 Z" fill="#f4c9d6" />
      <ellipse cx="6.5" cy="-27" rx="1.6" ry="3.4" fill="#dba0b6" opacity="0.5" filter="url(#edge)" />

      {/* Kopf, überdeckt die Ohren-Basis */}
      <ellipse cx="0" cy="-20" rx="11" ry="11" fill="url(#rabbit-grad)" />
      {/* Schlagschatten am Kopf, rechte/untere Wange */}
      <path d="M 6 -13 Q 11 -17 10 -24 Q 11 -18 8 -12 Q 4 -9 -1 -9 Q 3 -10 6 -13 Z" fill="#7c5c3c" opacity="0.35" filter="url(#edge)" />

      {/* helleres Schnäuzchen, mit eigenem kleinen Schatten rechts */}
      <ellipse cx="0" cy="-15" rx="6" ry="5" fill="#f4e6d2" />
      <ellipse cx="2.2" cy="-13.2" rx="3" ry="2.2" fill="#d3b896" opacity="0.4" filter="url(#edge)" />

      {/* Augen & Näschen */}
      <circle cx="-3.5" cy="-21" r="1.5" fill="#2b2320" />
      <circle cx="3.5" cy="-21" r="1.5" fill="#2b2320" />
      <circle cx="-2.9" cy="-21.6" r="0.5" fill="#fff" />
      <circle cx="4.1" cy="-21.6" r="0.5" fill="#fff" />
      <ellipse cx="0" cy="-17" rx="1.5" ry="1.1" fill="#e0839a" />
    </g>
  )
}

function Bear({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="11" rx="23" ry="5" fill="#000" opacity="0.15" />

      {/* Körper, kräftig-rund, Licht links oben → Schatten rechts unten */}
      <path d="M -18 15 Q -22 -8 -10 -15 Q 0 -19 10 -15 Q 22 -8 18 15 Q 18 19 0 20 Q -18 19 -18 15 Z" fill="url(#bear-grad)" />

      {/* Pfoten, kräftig */}
      <ellipse cx="-7" cy="16" rx="5" ry="3.6" fill="#4a3626" />
      <ellipse cx="7" cy="16" rx="5" ry="3.6" fill="#4a3626" />

      {/* helleres Brustfell */}
      <ellipse cx="0" cy="8" rx="9" ry="8" fill="#c9a06a" />

      {/* Ein durchgehender Schlagschatten über Körper UND Brustfell hinweg */}
      <path d="M 10 -15 Q 22 -8 18 15 Q 18 19 0 20 Q 6 11 8 -1 Q 9 -8 10 -15 Z" fill="#5c3f22" opacity="0.25" filter="url(#edge)" />

      {/* Ohren: klein, rund, mit eigenem Mulden-Schatten */}
      <circle cx="-9" cy="-30" r="5.5" fill="url(#bear-grad)" />
      <circle cx="-8.5" cy="-29" r="3" fill="#6b4a2e" opacity="0.6" filter="url(#edge)" />
      <circle cx="9" cy="-30" r="5.5" fill="url(#bear-grad)" />
      <circle cx="8.5" cy="-29" r="3" fill="#6b4a2e" opacity="0.6" filter="url(#edge)" />

      {/* Kopf, überdeckt die Ohren-Basis */}
      <ellipse cx="0" cy="-20" rx="13" ry="12" fill="url(#bear-grad)" />
      {/* Schlagschatten am Kopf, rechte/untere Wange */}
      <path d="M 7 -13 Q 12 -18 11 -25 Q 12 -18 9 -12 Q 4 -9 -2 -9 Q 4 -10 7 -13 Z" fill="#4a3320" opacity="0.35" filter="url(#edge)" />

      {/* Rundliche, helle Schnauze mit eigenem kleinen Schatten */}
      <ellipse cx="0" cy="-14" rx="7.5" ry="6" fill="#c9a06a" />
      <ellipse cx="2.5" cy="-12.5" rx="3.4" ry="2.4" fill="#a37c4d" opacity="0.4" filter="url(#edge)" />

      {/* Augen (klein, eng beieinander) & große runde Nase */}
      <circle cx="-4" cy="-21" r="1.4" fill="#2b2320" />
      <circle cx="4" cy="-21" r="1.4" fill="#2b2320" />
      <circle cx="-3.4" cy="-21.6" r="0.5" fill="#fff" />
      <circle cx="4.6" cy="-21.6" r="0.5" fill="#fff" />
      <ellipse cx="0" cy="-15" rx="2.6" ry="2" fill="#2b2320" />
      <ellipse cx="-0.8" cy="-15.6" rx="0.6" ry="0.4" fill="#fff" opacity="0.5" />
    </g>
  )
}

function Boat({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -46 0 Q 0 26 46 0 L 34 16 Q 0 30 -34 16 Z" fill="#b3541e" />
      <path d="M -46 0 Q 0 26 46 0 L 40 8 Q 0 26 -40 8 Z" fill="#8a3e14" />
      <rect x="-2" y="-70" width="4" height="70" fill="#6e4527" />
      <path d="M 2 -68 L 44 -6 L 2 -6 Z" fill="#fff" />
      <path d="M 2 -68 L 44 -6 L 20 -6 Z" fill="#e8edf2" />
      <path d="M -2 -60 L -36 -6 L -2 -6 Z" fill="#ff8a5c" />
      <path d="M 2 -70 L 14 -74 L 2 -78 Z" fill="#e05252" />
      <ellipse cx="0" cy="30" rx="42" ry="6" fill="#0c3d5e" opacity="0.25" />
    </g>
  )
}

function Palm({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="10" cy="6" rx="42" ry="8" fill="#000" opacity="0.15" />
      <path d="M -6 0 Q -2 -60 18 -92 L 26 -88 Q 8 -58 8 0 Z" fill="#9c6b3f" />
      <path d="M 8 -30 Q 12 -60 24 -89 L 26 -88 Q 12 -56 12 -28 Z" fill="#7a4d2b" />
      {[[-60, -18], [-38, -40], [4, -46], [42, -34], [58, -10]].map(([dx, dy], i) => (
        <path key={i} d={`M 22 -90 Q ${22 + dx * 0.6} ${-95 + dy * 0.6} ${22 + dx} ${-90 + dy}`} stroke="#3f9c53" strokeWidth="10" fill="none" strokeLinecap="round" />
      ))}
      <circle cx="16" cy="-84" r="6" fill="#8a5a35" />
      <circle cx="28" cy="-80" r="5" fill="#8a5a35" />
    </g>
  )
}

function Castle({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="8" rx="190" ry="18" fill="#000" opacity="0.12" />
      {[-130, 130].map((tx) => (
        <g key={tx} transform={`translate(${tx} 0)`}>
          <rect x="-30" y="-150" width="60" height="150" fill="#f3e6d0" />
          <rect x="8" y="-150" width="22" height="150" fill="#d9c5a5" />
          <path d="M -38 -150 L 0 -215 L 38 -150 Z" fill="#4a90d9" />
          <path d="M 0 -215 L 38 -150 L 8 -150 Z" fill="#3572b0" />
          <rect x="-2" y="-238" width="3" height="26" fill="#8a5a35" />
          <path d="M 1 -238 L 26 -230 L 1 -222 Z" fill="#ff5c5c" />
          <circle cx="-6" cy="-110" r="9" fill="#7ec3ff" stroke="#5a7a9c" strokeWidth="2.5" />
          <rect x="-14" y="-56" width="24" height="40" rx="12" fill="#8a5a35" />
        </g>
      ))}
      <rect x="-140" y="-95" width="280" height="95" fill="#efe0c8" />
      <rect x="60" y="-95" width="80" height="95" fill="#dcc8a8" />
      {[-120, -80, -40, 0, 40, 80].map((bx) => (
        <rect key={bx} x={bx} y="-107" width="24" height="14" fill="#efe0c8" />
      ))}
      <rect x="-45" y="-205" width="90" height="115" fill="#f8ecd8" />
      <rect x="15" y="-205" width="30" height="115" fill="#e0cdad" />
      <path d="M -55 -205 L 0 -280 L 55 -205 Z" fill="#e05252" />
      <path d="M 0 -280 L 55 -205 L 12 -205 Z" fill="#b53e3e" />
      <rect x="-2" y="-305" width="3" height="28" fill="#8a5a35" />
      <path d="M 1 -305 L 30 -296 L 1 -287 Z" fill="#ffd93d" />
      <circle cx="0" cy="-160" r="13" fill="#7ec3ff" stroke="#5a7a9c" strokeWidth="3" />
      <circle cx="0" cy="-122" r="11" fill="#fff" stroke="#b8a888" strokeWidth="2.5" />
      <path d="M 0 -122 L 0 -129 M 0 -122 L 5 -119" stroke="#5a4632" strokeWidth="2" strokeLinecap="round" />
      <rect x="-30" y="-52" width="60" height="52" rx="28" fill="#8a5a35" />
      <rect x="-30" y="-52" width="60" height="52" rx="28" fill="none" stroke="#6e4527" strokeWidth="5" />
      <path d="M 0 -50 L 0 0" stroke="#6e4527" strokeWidth="3" />
      <path d="M -18 0 L 18 0 L 40 40 L -40 40 Z" fill="#e8d5ae" />
    </g>
  )
}

function SharedDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="far" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        {/* für die fernsten, dunstigen Bergketten – kräftigere Streuung,
            damit sie nicht wie eine Fläche mit scharfem Rand "auftaucht" */}
        <filter id="veryFar" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {/* Kanten links/rechts weich ausblenden statt hartem Formrand */}
        <linearGradient id="fade-edges-x" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.82" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="mask-fade-edges-x" maskUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
          <rect x="0" y="0" width="1" height="1" fill="url(#fade-edges-x)" />
        </mask>
        {/* weichzeichnet Schatten-Overlays, damit Kanten nicht hart wirken */}
        <filter id="edge" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        {/* dezente Maserung für Boden/Berge – bricht die flachen Verläufe auf */}
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="3" stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>

        {/* Himmel: fließt über die ganze Karte von Tag zu Nacht zu Abendrot */}
        <linearGradient id="pan-sky" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.00" stopColor="#8fd7ff" />
          <stop offset="0.18" stopColor="#7ecbff" />
          <stop offset="0.38" stopColor="#5aa7e8" />
          <stop offset="0.55" stopColor="#8fd3ff" />
          <stop offset="0.68" stopColor="#28457f" />
          <stop offset="0.75" stopColor="#0f2049" />
          <stop offset="0.83" stopColor="#3d4a86" />
          <stop offset="0.93" stopColor="#ffb1c9" />
          <stop offset="1.00" stopColor="#ffd9a3" />
        </linearGradient>
        {/* ferne Hügelkette */}
        <linearGradient id="pan-far" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.00" stopColor="#9ccc9c" />
          <stop offset="0.20" stopColor="#b5e39a" />
          <stop offset="0.38" stopColor="#aac8e6" />
          <stop offset="0.55" stopColor="#7fae8a" />
          <stop offset="0.68" stopColor="#24386b" />
          <stop offset="0.75" stopColor="#1d3260" />
          <stop offset="0.85" stopColor="#7c9a6f" />
          <stop offset="1.00" stopColor="#a8dd8c" />
        </linearGradient>
        {/* mittlerer Boden */}
        <linearGradient id="pan-mid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.00" stopColor="#6fbf5a" />
          <stop offset="0.20" stopColor="#8ed36c" />
          <stop offset="0.38" stopColor="#6fae5c" />
          <stop offset="0.52" stopColor="#e8d9a8" />
          <stop offset="0.60" stopColor="#f7e7bb" />
          <stop offset="0.68" stopColor="#20355f" />
          <stop offset="0.78" stopColor="#152548" />
          <stop offset="0.87" stopColor="#5f9e54" />
          <stop offset="1.00" stopColor="#78c25e" />
        </linearGradient>
        {/* vorderer Boden (dunkler = näher) */}
        <linearGradient id="pan-front" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.00" stopColor="#57a747" />
          <stop offset="0.20" stopColor="#5cb04a" />
          <stop offset="0.38" stopColor="#588f47" />
          <stop offset="0.52" stopColor="#f0dca2" />
          <stop offset="0.60" stopColor="#f4dfa4" />
          <stop offset="0.68" stopColor="#122040" />
          <stop offset="0.78" stopColor="#0e1a36" />
          <stop offset="0.87" stopColor="#4f8f45" />
          <stop offset="1.00" stopColor="#66b053" />
        </linearGradient>
        <linearGradient id="pan-wasser" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#57bdf0" />
          <stop offset="1" stopColor="#1d7fbd" />
        </linearGradient>

        {/* Licht (links oben, hell) → Schatten (rechts unten, dunkel) –
            gilt einheitlich für Baumkronen und Berge */}
        <linearGradient id="tree-grad-normal" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#8ee39a" />
          <stop offset="0.55" stopColor="#54ad60" />
          <stop offset="1" stopColor="#3d8a49" />
        </linearGradient>
        <linearGradient id="tree-grad-dark" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#6fc47e" />
          <stop offset="0.55" stopColor="#3e8e4f" />
          <stop offset="1" stopColor="#2e6e3c" />
        </linearGradient>
        <linearGradient id="rabbit-grad" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#e2c299" />
          <stop offset="0.55" stopColor="#cfa77a" />
          <stop offset="1" stopColor="#a9825a" />
        </linearGradient>
        <linearGradient id="bear-grad" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#a97c52" />
          <stop offset="0.55" stopColor="#8a5a35" />
          <stop offset="1" stopColor="#6b4a2e" />
        </linearGradient>
        <linearGradient id="mtn-grad-far" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#c9e0f5" />
          <stop offset="1" stopColor="#aac8e6" />
        </linearGradient>
        <linearGradient id="mtn-grad-mid" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#9dc0e0" />
          <stop offset="1" stopColor="#7fa8cf" />
        </linearGradient>
        <linearGradient id="mtn-grad-near" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#7595b8" />
          <stop offset="1" stopColor="#57779c" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Panorama() {
  return (
    <div className="panorama-scene" aria-hidden="true">
      <SharedDefs />

      {/* ---------- Ebene 1: Himmel (bewegt sich am langsamsten) ---------- */}
      <svg className="pano-layer pano-layer-sky" viewBox="0 0 6000 600" preserveAspectRatio="none">
        <rect x="-400" width="6800" height="600" fill="url(#pan-sky)" />

        <Sun x={400} y={95} r={38} />
        <circle cx="4560" cy="115" r="95" fill="#fff8d9" opacity="0.18" filter="url(#soft)" />
        <circle cx="4560" cy="115" r="52" fill="#f5ecc8" />
        <circle cx="4540" cy="100" r="10" fill="#e3d7ac" />
        <circle cx="4578" cy="133" r="7" fill="#e3d7ac" />
        <Sun x={5280} y={110} r={34} />

        {[[4180, 70, 0.9], [4260, 150, 0.6], [4360, 50, 1], [4450, 120, 0.7], [4650, 200, 0.6],
          [4720, 60, 0.9], [4800, 140, 0.7], [4880, 90, 0.8], [4420, 230, 0.5], [4250, 260, 0.4]].map(([x, y, o], i) => (
          <Star key={i} x={x} y={y} s={0.5 + o * 0.7} o={o} />
        ))}
        <path d="M 4200 90 L 4280 140" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <Star x={4195} y={87} s={1.2} />

        <g opacity="0.8">
          {['#ff5c5c', '#ff9d3c', '#ffd93d', '#58cc02', '#1cb0f6', '#b58aff'].map((c, i) => {
            const r = 340 - i * 15
            return (
              <path key={c} d={`M ${5500 - r} 620 A ${r} ${r} 0 0 1 ${5500 + r} 620`} stroke={c} strokeWidth="15" fill="none" />
            )
          })}
        </g>
      </svg>

      {/* ---------- Ebene 2: ferne Hügel & Berge (weichgezeichnet) ---------- */}
      <svg className="pano-layer pano-layer-hills" viewBox="0 0 6000 600" preserveAspectRatio="none">
        <g filter="url(#far)" opacity="0.85">
          <path
            d="M -400 370 Q 250 300 500 350 T 1000 340 T 1500 310 T 2000 350 T 2500 330 T 3000 355 T 3500 340 T 4000 320 T 4500 350 T 5000 330 T 5500 345 T 6400 335 L 6400 600 L -400 600 Z"
            fill="url(#pan-far)"
          />
        </g>
        <g filter="url(#veryFar)" mask="url(#mask-fade-edges-x)" opacity="0.75">
          <Mountain x={2120} y={460} w={460} h={230} c="#aac8e6" cd="#93b6da" />
          <Mountain x={2850} y={460} w={420} h={200} c="#aac8e6" cd="#93b6da" />
        </g>

        {/* ---------- Zahlenwald: dichte Baumkronen-Silhouette am Horizont –
             gibt dem Wald Tiefe, als reiche er weit nach hinten ---------- */}
        <g filter="url(#far)" opacity="0.5">
          <path
            d="M -60 460 Q -10 350 40 400 Q 80 330 130 395 Q 175 320 225 392 Q 270 335 320 398
               Q 365 325 415 393 Q 460 340 510 400 Q 555 330 605 395 Q 650 338 700 398
               Q 745 325 795 392 Q 840 335 890 400 Q 935 345 985 405 Q 1015 360 1050 420
               L 1050 470 L -60 470 Z"
            fill="#1f5c33"
          />
        </g>
        <g filter="url(#far)" opacity="0.65">
          <path
            d="M -60 480 Q 0 400 60 440 Q 110 380 170 435 Q 220 390 280 438 Q 330 385 390 436
               Q 440 395 500 438 Q 550 390 610 436 Q 660 398 720 438 Q 770 390 830 436
               Q 880 400 940 438 Q 980 405 1020 440 L 1020 490 L -60 490 Z"
            fill="#2e7a44"
          />
        </g>
      </svg>

      {/* ---------- Ebene 3: Wolken (treiben unabhängig, eigenes Tempo) ---------- */}
      <svg className="pano-layer pano-layer-clouds" viewBox="0 0 6000 600" preserveAspectRatio="none">
        <Cloud x={700} y={80} s={0.8} o={0.8} />
        <Cloud x={1250} y={110} s={0.9} />
        <Cloud x={1750} y={60} s={0.65} o={0.8} />
        <Cloud x={2400} y={90} s={0.8} />
        <Cloud x={2900} y={140} s={0.6} o={0.8} />
        <Cloud x={3350} y={75} s={0.85} />
        <Cloud x={3800} y={120} s={0.6} o={0.8} />
        <Cloud x={5150} y={190} s={0.9} />
        <Cloud x={5800} y={90} s={0.7} />
      </svg>

      {/* ---------- Ebene 4: Hauptebene – Boden, Weg-Umgebung, Deko
           (bewegt sich 1:1 mit dem Weg/den Levelknoten, keine eigene
           Parallaxe – hier müssen Koordinaten exakt stimmen) ---------- */}
      <svg className="pano-layer pano-layer-ground" viewBox="0 0 6000 600" preserveAspectRatio="none">
        <Mountain x={2200} y={490} w={480} h={280} c="#7fa8cf" cd="#5f88b3" />
        <Mountain x={2520} y={495} w={540} h={330} c="#7fa8cf" cd="#5f88b3" />
        <Mountain x={2820} y={490} w={500} h={290} c="#7fa8cf" cd="#5f88b3" />
        <Mountain x={2380} y={520} w={520} h={240} c="#57779c" cd="#425e80" />
        <Mountain x={2720} y={525} w={560} h={260} c="#57779c" cd="#425e80" />

        {/* mittlerer + vorderer Boden (durchgehend) */}
        <path
          d="M 0 440 Q 250 400 500 435 T 1000 425 T 1500 445 T 2000 420 T 2500 445 T 3000 430 T 3500 450 T 4000 425 T 4500 445 T 5000 425 T 5500 445 T 6000 430 L 6000 600 L 0 600 Z"
          fill="url(#pan-mid)"
        />
        <path
          d="M 0 505 Q 300 475 600 500 T 1200 495 T 1800 505 T 2400 492 T 3000 505 T 3600 495 T 4200 505 T 4800 492 T 5400 505 T 6000 498 L 6000 600 L 0 600 Z"
          fill="url(#pan-front)"
        />
        {/* dezente Maserung, bricht die glatten Verläufe auf */}
        <rect x="0" y="410" width="6000" height="190" filter="url(#grain)" opacity="0.5" style={{ mixBlendMode: 'overlay' }} />

        {/* ---------- Region: Zahlenwald ---------- */}
        {/* zarte grüne Kronen-Abdunklung – wirkt wie Schatten unter dichtem Blätterdach */}
        <ellipse cx="500" cy="230" rx="680" ry="270" fill="#1f4a2c" opacity="0.1" filter="url(#soft)" />

        {/* hintere Baumreihe: klein, dunkler, nah am Horizont – zieht den Wald nach hinten */}
        <Pine x={30} y={430} s={0.5} c="#2e6e3c" cd="#1f5c33" />
        <Tree x={100} y={398} s={0.42} dark />
        <Pine x={265} y={402} s={0.48} c="#2e6e3c" cd="#1f5c33" />
        <Tree x={560} y={400} s={0.46} dark />
        <Pine x={655} y={392} s={0.5} c="#2e6e3c" cd="#1f5c33" />
        <Tree x={780} y={415} s={0.48} dark />
        <Pine x={975} y={432} s={0.55} c="#2e6e3c" cd="#1f5c33" />

        {/* mittlere Baumreihe, entlang der bereits vorhandenen Weg-Aussparungen */}
        <Tree x={120} y={505} s={1.2} />
        <Tree x={330} y={452} s={0.85} dark />
        <Pine x={520} y={500} s={0.8} />
        <Tree x={700} y={458} s={0.8} />
        <Pine x={905} y={520} s={0.95} />

        {/* vordere, größere Baumreihe – rahmt die Szene und macht sie dicht */}
        <Pine x={55} y={560} s={0.95} />
        <Tree x={460} y={545} s={0.95} dark />
        <Pine x={565} y={565} s={0.8} />
        <Tree x={945} y={565} s={1.05} dark />

        {/* Waldboden: Farne, Pilze, ein umgestürzter Stamm */}
        <Fern x={175} y={588} s={1} />
        <Fern x={355} y={548} s={0.9} />
        <Fern x={615} y={588} s={1.05} />
        <Fern x={875} y={562} s={0.9} />
        <Log x={475} y={592} s={0.85} rot={-6} />
        <Mushroom x={250} y={560} />
        <Mushroom x={790} y={572} s={0.8} cap="#e08a3c" />
        <Mushroom x={920} y={558} s={0.6} cap="#e08a3c" />

        {/* Waldtiere */}
        <Rabbit x={700} y={530} s={0.8} />
        <Bear x={390} y={575} s={1.05} />

        {/* ---------- Region: Blumenwiese ---------- */}
        <Tree x={1080} y={470} s={0.8} dark />
        <Flower x={1180} y={520} s={1.1} c="#ff5c8a" />
        <Flower x={1320} y={480} s={0.85} c="#b58aff" />
        <Flower x={1450} y={555} s={1.2} c="#ffd93d" />
        <Flower x={1580} y={500} s={0.95} c="#ff7bac" />
        <Flower x={1700} y={545} s={1.1} c="#ff8a5c" />
        <Flower x={1830} y={490} s={0.85} c="#7ec3ff" />
        <Flower x={1930} y={560} s={1.15} c="#ffd93d" />
        <Butterfly x={1400} y={330} s={1.05} c="#7ec3ff" />
        <Butterfly x={1750} y={290} s={0.8} c="#ffb1c9" />

        {/* ---------- Region: Bergwelt ---------- */}
        <Pine x={2100} y={545} s={0.8} />
        <Pine x={2430} y={525} s={0.6} />
        <Pine x={2650} y={555} s={0.85} />
        <Pine x={2920} y={540} s={0.7} />
        <path d="M 2560 160 q 14 -12 28 0 q 14 -12 28 0" stroke="#3a4a5c" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* ---------- Region: Sonnensee ---------- */}
        <ellipse cx="3500" cy="415" rx="460" ry="58" fill="url(#pan-wasser)" />
        <ellipse cx="3500" cy="415" rx="460" ry="58" fill="none" stroke="#f4dfa4" strokeWidth="6" opacity="0.7" />
        <ellipse className="pano-shimmer" cx="3660" cy="402" rx="80" ry="8" fill="#fff" opacity="0.3" />
        {[3180, 3380, 3580, 3760].map((x, i) => (
          <path
            key={i}
            className="pano-shimmer"
            style={{ animationDelay: `-${i * 0.6}s` }}
            d={`M ${x} ${408 + (i % 2) * 14} q 16 -9 32 0 q 16 -9 32 0`}
            stroke="#bfe9ff"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        ))}
        <Boat x={3520} y={410} s={0.8} />
        <Palm x={3090} y={545} s={0.95} />
        <g transform="translate(3850 560)">
          <ellipse cx="0" cy="14" rx="16" ry="4" fill="#000" opacity="0.15" />
          <circle cx="0" cy="0" r="15" fill="#e05252" />
          <path d="M -15 0 A 15 15 0 0 1 15 0 A 20 8 0 0 0 -15 0" fill="#fff" />
          <circle cx="-5" cy="-6" r="4" fill="#ff9d9d" opacity="0.8" />
        </g>

        {/* ---------- Region: Sternenhimmel ---------- */}
        <Pine x={4150} y={510} s={0.85} c="#0e1a36" cd="#0a1428" />
        <Pine x={4480} y={495} s={0.6} c="#152548" cd="#0e1a36" />
        <Pine x={4880} y={515} s={0.8} c="#0e1a36" cd="#0a1428" />
        {[[4240, 480], [4420, 545], [4610, 500], [4760, 555], [4930, 570]].map(([x, y], i) => (
          <g key={i} className="pano-pulse" style={{ animationDelay: `-${i * 0.4}s` }}>
            <circle cx={x} cy={y} r="9" fill="#ffe97a" opacity="0.25" filter="url(#soft)" />
            <circle cx={x} cy={y} r="3" fill="#ffe97a" />
          </g>
        ))}

        {/* ---------- Region: Königsschloss ---------- */}
        <Castle x={5500} y={470} s={0.95} />
        <Star x={5240} y={300} s={1.4} o={0.9} />
        <Star x={5760} y={280} s={1.1} o={0.8} />
        <Flower x={5130} y={555} s={1.05} c="#ff7bac" />
        <Flower x={5860} y={560} s={1.0} c="#ffd93d" />
        <Flower x={5960} y={520} s={0.85} c="#b58aff" />
      </svg>
    </div>
  )
}
