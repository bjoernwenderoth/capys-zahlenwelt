// Eine einzige zusammenhängende Landkarte für alle Welten (6000 × 600).
// Himmel und Boden gehen fließend ineinander über, ein durchgehender
// Weg verbindet alle Level. Themen-Deko markiert die Regionen:
// Blumenwiese → Wald → Berge → Sonnensee → Sternenhimmel → Königsschloss
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

// Gänseblümchen – dichte Streu-Deko für die Blumenwiese, viel billiger
// als die große Flower (kein Stiel), aber mit demselben Licht/Schatten-Prinzip
function Bloom({ x, y, s = 1 }) {
  const sway = (x * 0.47 + y * 0.13) % 3
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0.6" cy="1.6" rx="4.2" ry="1.3" fill="#000" opacity="0.12" />
      <g className="pano-sway" style={{ animationDelay: `-${sway}s` }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <ellipse key={a} cx="0" cy="-2.4" rx="1.1" ry="2.6" fill="#fefefc" transform={`rotate(${a})`} />
        ))}
        {/* Schatten- und Lichtseite über die ganze Blüte, statt pro Blatt (bei dieser Größe kaum sichtbar) */}
        <path d="M 0.6 -1 Q 3 0 2.6 2.4 Q 1 3 -0.4 2 Q 0.2 0.6 0.6 -1 Z" fill="#c9c2b4" opacity="0.3" filter="url(#edge)" />
        <circle cx="0" cy="0" r="1.9" fill="#ffd93d" />
        <circle cx="1" cy="1" r="0.9" fill="#c9861c" opacity="0.4" filter="url(#edge)" />
        <circle cx="-0.6" cy="-0.6" r="0.8" fill="#ffe97a" />
      </g>
    </g>
  )
}

// Biene – fliegt in kleinen Schleifen umher, Flügel flattern schnell & unabhängig
function Bee({ x, y, s = 1 }) {
  const delay = (x * 0.53 + y * 0.29) % 6
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="pano-bee" style={{ animationDelay: `-${delay}s` }}>
        <g className="pano-bee-wing" style={{ animationDelay: `-${(delay * 0.4).toFixed(2)}s` }}>
          <ellipse cx="-3.2" cy="-3.6" rx="4.4" ry="2.8" fill="#eaf6ff" opacity="0.8" transform="rotate(-18 -3.2 -3.6)" />
          <ellipse cx="3.2" cy="-3.6" rx="4.4" ry="2.8" fill="#eaf6ff" opacity="0.8" transform="rotate(18 3.2 -3.6)" />
        </g>
        {/* Körper, Licht links oben → Schatten rechts unten */}
        <ellipse cx="0" cy="0" rx="5.4" ry="4" fill="url(#bee-grad)" />
        <path d="M -5.2 -1.1 Q 0 -3.2 5.2 -1.1 Q 0 1 -5.2 -1.1 Z" fill="#2b2320" opacity="0.85" />
        <path d="M -4.4 1.8 Q 0 3.4 4.4 1.8" stroke="#2b2320" strokeWidth="1.5" fill="none" opacity="0.85" />
        <ellipse cx="1.6" cy="1.4" rx="2.3" ry="1.7" fill="#000" opacity="0.18" filter="url(#edge)" />
        <ellipse cx="-1.6" cy="-1.6" rx="1.6" ry="1.1" fill="#fff" opacity="0.35" />
        <circle cx="5.4" cy="-0.6" r="1.5" fill="#2b2320" />
      </g>
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
      <ellipse cx="0" cy="30" rx="42" ry="6" fill="#0c3d5e" opacity="0.25" />
      <path d="M -46 0 Q 0 26 46 0 L 34 16 Q 0 30 -34 16 Z" fill="url(#boat-grad)" />
      <path d="M -46 0 Q 0 26 46 0 L 40 8 Q 0 26 -40 8 Z" fill="#8a3e14" />
      {/* Schlagschatten am Rumpf, Licht kommt von links oben wie bei den Tieren */}
      <path d="M 10 8 Q 30 12 34 16 Q 0 30 -34 16 Q -4 20 10 8 Z" fill="#5c2a0e" opacity="0.3" filter="url(#edge)" />
      <rect x="-2" y="-70" width="4" height="70" fill="#6e4527" />
      <path d="M 2 -68 L 44 -6 L 2 -6 Z" fill="#fff" />
      <path d="M 2 -68 L 44 -6 L 20 -6 Z" fill="#e8edf2" />
      <path d="M -2 -60 L -36 -6 L -2 -6 Z" fill="#ff8a5c" />
      <path d="M 2 -70 L 14 -74 L 2 -78 Z" fill="#e05252" />
    </g>
  )
}

function Palm({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="10" cy="6" rx="42" ry="8" fill="#000" opacity="0.15" />
      <path d="M -6 0 Q -2 -60 18 -92 L 26 -88 Q 8 -58 8 0 Z" fill="url(#palm-grad)" />
      <path d="M 8 -30 Q 12 -60 24 -89 L 26 -88 Q 12 -56 12 -28 Z" fill="#7a4d2b" opacity="0.7" filter="url(#edge)" />
      {[[-60, -18], [-38, -40], [4, -46], [42, -34], [58, -10]].map(([dx, dy], i) => (
        <path key={i} d={`M 22 -90 Q ${22 + dx * 0.6} ${-95 + dy * 0.6} ${22 + dx} ${-90 + dy}`} stroke="#3f9c53" strokeWidth="10" fill="none" strokeLinecap="round" />
      ))}
      <circle cx="16" cy="-84" r="6" fill="#8a5a35" />
      <circle cx="28" cy="-80" r="5" fill="#8a5a35" />
      <circle cx="14.5" cy="-85.5" r="2" fill="#c9a874" opacity="0.6" />
    </g>
  )
}

// Krabbe – huscht seitlich über den Sand, aufgebaut wie die Waldtiere
// (Panzer → Scheren → Beine → Augen), mit Verlauf & weichem Schlagschatten
function Crab({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="8" rx="15" ry="3.6" fill="#000" opacity="0.15" />

      {/* Beine, je 2 pro Seite */}
      <path d="M -9 3 Q -17 5 -21 1 M -9 5 Q -18 9 -22 7" stroke="#c9502e" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      <path d="M 9 3 Q 17 5 21 1 M 9 5 Q 18 9 22 7" stroke="#c9502e" strokeWidth="2.1" fill="none" strokeLinecap="round" />

      {/* Scheren */}
      <path d="M -12 -1 Q -21 -6 -19 -14 Q -15 -10 -9 -8 Z" fill="#e2703f" />
      <circle cx="-19" cy="-13" r="3.4" fill="#e2703f" />
      <ellipse cx="-20" cy="-14" rx="1.4" ry="1.8" fill="#a83c1e" opacity="0.4" filter="url(#edge)" />
      <path d="M 12 -1 Q 21 -6 19 -14 Q 15 -10 9 -8 Z" fill="#e2703f" />
      <circle cx="19" cy="-13" r="3.4" fill="#e2703f" />
      <ellipse cx="20" cy="-14" rx="1.4" ry="1.8" fill="#a83c1e" opacity="0.4" filter="url(#edge)" />

      {/* Panzer, Licht links oben → Schatten rechts unten */}
      <ellipse cx="0" cy="-2" rx="13" ry="9" fill="url(#crab-grad)" />
      <path d="M 6 -8 Q 12 -4 11 3 Q 12 -3 8 -8 Z" fill="#a83c1e" opacity="0.35" filter="url(#edge)" />
      <ellipse cx="-3" cy="-5" rx="3.6" ry="2.4" fill="#f2a583" opacity="0.5" />

      {/* Augen auf Stielen */}
      <path d="M -4 -9 Q -5 -13 -4 -15 M 4 -9 Q 5 -13 4 -15" stroke="#c9502e" strokeWidth="1.4" fill="none" />
      <circle cx="-4" cy="-16" r="1.7" fill="#2b2320" />
      <circle cx="4" cy="-16" r="1.7" fill="#2b2320" />
      <circle cx="-4.5" cy="-16.5" r="0.5" fill="#fff" />
      <circle cx="3.5" cy="-16.5" r="0.5" fill="#fff" />
    </g>
  )
}

// Möwe – gleitet in sanften Wellen, Flügel als schlichter Doppelbogen
function Seagull({ x, y, s = 1 }) {
  const delay = (x * 0.37 + y * 0.2) % 5
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="pano-soar" style={{ animationDelay: `-${delay}s` }}>
        <path d="M -13 0 Q -6 -9 0 -1 Q 6 -9 13 0" stroke="#5a6b78" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M -13 0 Q -6 -6 0 -1" stroke="#8fa0ac" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      </g>
    </g>
  )
}

// Muschel – einfache Streu-Deko für den Sandstrand
function Shell({ x, y, s = 1, c = '#ffb199' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0.6" cy="6" rx="8" ry="2" fill="#000" opacity="0.12" />
      <path d="M -9 4 Q -10 -6 0 -9 Q 10 -6 9 4 Q 0 8 -9 4 Z" fill={c} />
      <path d="M 0 -9 L -1 4 M -5 -7 L -4 4 M 5 -7 L 4 4" stroke="#fff" strokeWidth="1" opacity="0.5" />
      <path d="M 4 -2 Q 9 0 9 4 Q 2 7 -1 6 Q 3 3 4 -2 Z" fill="#000" opacity="0.14" filter="url(#edge)" />
    </g>
  )
}

// Seestern – liegt flach im Sand
function Starfish({ x, y, s = 1, c = '#ff8a5c' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0.6" cy="7" rx="9" ry="2" fill="#000" opacity="0.12" />
      <path d="M 0 -11 Q 3 -4 10 -3 Q 5 2 6 9 Q 0 5 -6 9 Q -5 2 -10 -3 Q -3 -4 0 -11 Z" fill={c} />
      <path d="M 3 -3 Q 6 2 5 8 Q 1 4 3 -3 Z" fill="#c9603a" opacity="0.35" filter="url(#edge)" />
      <circle cx="-3" cy="-3" r="1" fill="#fff" opacity="0.4" />
      <circle cx="0" cy="0" r="1.4" fill="#fff" opacity="0.4" />
      <circle cx="4" cy="1" r="1" fill="#fff" opacity="0.4" />
    </g>
  )
}

// Dünengras – wie Fern, aber kürzer/sandiger, für die Strandkante
function DuneGrass({ x, y, s = 1 }) {
  const delay = (x * 0.31) % 4
  const blade = (angle, len) => {
    const rad = (angle * Math.PI) / 180
    const ex = Math.sin(rad) * len
    const ey = -Math.cos(rad) * len
    return `M 0 2 Q ${(ex * 0.3).toFixed(1)} ${(ey * 0.5).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="pano-sway" style={{ animationDelay: `-${delay}s` }}>
        {[-28, -9, 9, 28].map((a) => (
          <path key={a} d={blade(a, 17 - Math.abs(a) * 0.15)} stroke="#9caf4f" strokeWidth="3" fill="none" strokeLinecap="round" />
        ))}
      </g>
    </g>
  )
}

// Sandburg – kleine Strand-Deko, Türmchen + Fähnchen
function Sandcastle({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="15" rx="26" ry="5" fill="#000" opacity="0.15" />
      <path d="M -22 13 Q -24 -3 -10 -7 Q -6 -13 0 -11 Q 6 -13 10 -7 Q 24 -3 22 13 Q 0 17 -22 13 Z" fill="#e8c08a" />
      <path d="M 10 -7 Q 24 -3 22 13 Q 12 15 4 14 Q 12 5 10 -7 Z" fill="#c9985e" opacity="0.5" filter="url(#edge)" />
      <rect x="-16" y="5" width="6" height="8" rx="1" fill="#c9985e" />
      <rect x="10" y="5" width="6" height="8" rx="1" fill="#c9985e" />
      <circle cx="-3" cy="1" r="3" fill="#c9985e" />
      <circle cx="3" cy="1" r="3" fill="#c9985e" />
      <path d="M -18 6 q 3 -2 6 0 M 8 6 q 3 -2 6 0" stroke="#a97c4a" strokeWidth="1.2" fill="none" opacity="0.6" />
      <rect x="-1" y="-19" width="2" height="9" fill="#8a5a35" />
      <path d="M 1 -19 L 9 -16 L 1 -13 Z" fill="#ff5c5c" />
    </g>
  )
}

// Sonnenschirm – ersetzt den alten Strandball, mit Streifen & Eigenschatten
function Umbrella({ x, y, s = 1, c = '#ff5c5c' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="47" rx="30" ry="6" fill="#000" opacity="0.15" />
      <rect x="-2" y="-10" width="4" height="57" fill="#8a5a35" />
      <path d="M -34 -8 Q 0 -34 34 -8 Q 34 -2 0 -4 Q -34 -2 -34 -8 Z" fill={c} />
      <path d="M -34 -8 Q -17 -22 0 -22 L 0 -4 Q -17 -3 -34 -8 Z" fill="#fff" opacity="0.85" />
      <path d="M 0 -22 Q 17 -22 34 -8 Q 17 -3 0 -4 Z" fill={c} opacity="0.7" />
      <path d="M -34 -8 Q 0 -3 34 -8" stroke="#b53e3e" strokeWidth="2" fill="none" opacity="0.35" />
      {/* gestreiftes Handtuch daneben */}
      <g transform="translate(46 46)">
        <rect x="-22" y="-8" width="44" height="16" rx="4" fill="#ffe97a" />
        <rect x="-22" y="-8" width="11" height="16" fill="#7ec3ff" opacity="0.8" />
        <rect x="0" y="-8" width="11" height="16" fill="#7ec3ff" opacity="0.8" />
      </g>
    </g>
  )
}

// Springender Fisch – kleiner Bogen über der Wasseroberfläche
function Fish({ x, y, s = 1, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M -10 0 Q -4 -8 8 -4 Q 12 0 8 4 Q -4 8 -10 0 Z" fill="#7ec3ff" />
      <path d="M -10 0 Q -4 -5 3 -2 Q -3 2 -10 0 Z" fill="#5aa7e8" opacity="0.6" />
      <path d="M 8 -4 L 15 -7 L 12 0 L 15 7 L 8 4 Z" fill="#5aa7e8" />
      <circle cx="-5" cy="-1" r="1.2" fill="#2b2320" />
    </g>
  )
}

// Fels – Streu-Deko für den Bergpfad, Licht links oben → Schatten rechts unten
function Rock({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="10" rx="20" ry="5" fill="#000" opacity="0.15" />
      <path d="M -18 8 Q -22 -8 -6 -14 Q 4 -20 14 -12 Q 22 -6 18 8 Q 0 14 -18 8 Z" fill="url(#rock-grad)" />
      <path d="M 8 -14 Q 22 -6 18 8 Q 8 12 2 10 Q 10 2 10 -6 Q 10 -11 8 -14 Z" fill="#465a68" opacity="0.4" filter="url(#edge)" />
      <path d="M -14 -8 Q -8 -14 0 -13" stroke="#fff" strokeWidth="2" opacity="0.3" fill="none" strokeLinecap="round" />
    </g>
  )
}

// Steinmann – gestapelte Felsbrocken, markiert den Bergpfad
function Cairn({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="16" ry="4" fill="#000" opacity="0.15" />
      <ellipse cx="0" cy="0" rx="15" ry="8" fill="url(#rock-grad)" />
      <ellipse cx="3" cy="1" rx="6" ry="3.4" fill="#465a68" opacity="0.35" filter="url(#edge)" />
      <ellipse cx="0" cy="-9" rx="11" ry="6" fill="url(#rock-grad)" />
      <ellipse cx="2" cy="-8" rx="4.4" ry="2.6" fill="#465a68" opacity="0.35" filter="url(#edge)" />
      <ellipse cx="0" cy="-17" rx="7" ry="4.4" fill="url(#rock-grad)" />
      <ellipse cx="1.5" cy="-16" rx="2.6" ry="1.8" fill="#465a68" opacity="0.35" filter="url(#edge)" />
    </g>
  )
}

// Alpenblume (Edelweiß-artig) – fusselig-weiße Blätter statt glatter Blütenblätter
function AlpineFlower({ x, y, s = 1 }) {
  const sway = (x * 0.41) % 4
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M 0 0 L 0 9" stroke="#7a9c5a" strokeWidth="2" />
      <g className="pano-sway" style={{ animationDelay: `-${sway}s` }}>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse key={a} cx="0" cy="-3.6" rx="2.2" ry="3.6" fill="#f2ede0" transform={`rotate(${a})`} />
        ))}
        <path d="M 1 -1.4 Q 3 0 2.4 2 Q 0.6 2.6 -0.6 1.8 Q 0.2 0.4 1 -1.4 Z" fill="#c9c2ac" opacity="0.35" filter="url(#edge)" />
        <circle cx="0" cy="0" r="1.6" fill="#ffd93d" />
      </g>
    </g>
  )
}

// Steinbock – steht still auf dem Fels, aufgebaut wie die anderen Waldtiere
// (Körper → Kopf → Hörner → Gesicht), mit Verlauf & weichem Schlagschatten
function Goat({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="14" rx="19" ry="4.2" fill="#000" opacity="0.15" />

      {/* Beine & Hufe */}
      <rect x="-11" y="0" width="4" height="14" rx="2" fill="#e8e0d0" />
      <rect x="7" y="0" width="4" height="14" rx="2" fill="#e8e0d0" />
      <ellipse cx="-9" cy="14" rx="2.6" ry="1.6" fill="#3a332b" />
      <ellipse cx="9" cy="14" rx="2.6" ry="1.6" fill="#3a332b" />

      {/* Schwänzchen */}
      <ellipse cx="-17" cy="0" rx="3" ry="2.2" fill="#e8e0d0" />

      {/* Körper, Licht links oben → Schatten rechts unten */}
      <path d="M -16 2 Q -18 -10 -6 -13 Q 6 -16 15 -8 Q 19 -2 15 4 Q 15 8 0 9 Q -16 8 -16 2 Z" fill="url(#goat-grad)" />
      <path d="M 8 -13 Q 19 -2 15 4 Q 15 8 0 9 Q 6 3 8 -4 Q 9 -9 8 -13 Z" fill="#a89c86" opacity="0.35" filter="url(#edge)" />

      {/* Hörner, geschwungen nach hinten */}
      <path d="M 14 -19 Q 12 -27 17 -31" stroke="#8a7a62" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M 18 -19 Q 18 -27 23 -30" stroke="#8a7a62" strokeWidth="2.6" fill="none" strokeLinecap="round" />

      {/* Kopf, überdeckt die Hornansätze */}
      <ellipse cx="17" cy="-13" rx="7.5" ry="7" fill="url(#goat-grad)" />
      <path d="M 21 -18 Q 25 -16 24 -10 Q 22 -13 19 -14 Z" fill="#a89c86" opacity="0.4" filter="url(#edge)" />

      {/* Ohren */}
      <path d="M 12 -16 Q 8 -18 8 -14 Q 11 -12 14 -13 Z" fill="#e8e0d0" />

      {/* Schnauze & Gesicht */}
      <ellipse cx="22" cy="-10" rx="3.6" ry="3" fill="#f4efe4" />
      <circle cx="19" cy="-14" r="1.3" fill="#2b2320" />
      <circle cx="18.4" cy="-14.5" r="0.4" fill="#fff" />
      <ellipse cx="23" cy="-9.5" rx="1" ry="0.8" fill="#3a332b" />
    </g>
  )
}

// Adler – zieht große, ruhige Kreise hoch über den Bergen
function Eagle({ x, y, s = 1 }) {
  const delay = (x * 0.37 + y * 0.21) % 6
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="pano-soar" style={{ animationDelay: `-${delay}s` }}>
        <path d="M -22 0 Q -10 -14 0 -2 Q 10 -14 22 0 Q 10 -4 0 2 Q -10 -4 -22 0 Z" fill="#4a3626" />
        <path d="M -22 0 Q -10 -8 0 -2" stroke="#6b4a2e" strokeWidth="1.6" fill="none" opacity="0.6" />
        <path d="M 22 0 Q 10 -8 0 -2" stroke="#6b4a2e" strokeWidth="1.6" fill="none" opacity="0.6" />
        <ellipse cx="0" cy="-1" rx="3" ry="2" fill="#e8dcc0" />
      </g>
    </g>
  )
}

// Wasserfall – kaskadiert eine Bergflanke hinab in ein kleines Becken
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
        {/* Nur für die Uferflächen: etwas breiter als "edge", damit Sand,
            Böschung und Wasser ohne sichtbare Konturringe ineinanderlaufen. */}
        <filter id="lake-edge" x="-8%" y="-35%" width="116%" height="170%">
          <feGaussianBlur stdDeviation="1.25" />
        </filter>
        {/* dezente Maserung für Boden/Berge – bricht die flachen Verläufe auf */}
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="3" stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>

        {/* Himmel: fließt über die ganze Karte von Tag zu Nacht zu Abendrot.
            Die Dämmerungs-Übergänge (Sonnensee → Sternenhimmel → Königsschloss)
            sind bewusst breit gezogen, damit man beim freien Scrollen nie mitten
            in einem harten Farbsprung landet, sondern immer eine sanfte
            Dämmerung sieht, egal wo man gerade stehen bleibt. */}
        <linearGradient id="pan-sky" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.00" stopColor="#8fd7ff" />
          <stop offset="0.18" stopColor="#7ecbff" />
          <stop offset="0.38" stopColor="#5aa7e8" />
          <stop offset="0.55" stopColor="#8fd3ff" />
          <stop offset="0.59" stopColor="#8fd3ff" />
          <stop offset="0.69" stopColor="#28457f" />
          <stop offset="0.75" stopColor="#0f2049" />
          <stop offset="0.78" stopColor="#0f2049" />
          <stop offset="0.85" stopColor="#3d4a86" />
          <stop offset="0.95" stopColor="#ffb1c9" />
          <stop offset="1.00" stopColor="#ffd9a3" />
        </linearGradient>
        {/* ferne Hügelkette */}
        <linearGradient id="pan-far" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.00" stopColor="#9ccc9c" />
          <stop offset="0.20" stopColor="#b5e39a" />
          <stop offset="0.38" stopColor="#aac8e6" />
          <stop offset="0.55" stopColor="#7fae8a" />
          <stop offset="0.59" stopColor="#7fae8a" />
          <stop offset="0.70" stopColor="#24386b" />
          <stop offset="0.76" stopColor="#1d3260" />
          <stop offset="0.79" stopColor="#1d3260" />
          <stop offset="0.87" stopColor="#7c9a6f" />
          <stop offset="1.00" stopColor="#a8dd8c" />
        </linearGradient>
        {/* mittlerer Boden */}
        <linearGradient id="pan-mid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.00" stopColor="#6fbf5a" />
          <stop offset="0.20" stopColor="#8ed36c" />
          <stop offset="0.38" stopColor="#6fae5c" />
          <stop offset="0.52" stopColor="#e8d9a8" />
          <stop offset="0.60" stopColor="#f7e7bb" />
          <stop offset="0.72" stopColor="#20355f" />
          <stop offset="0.78" stopColor="#152548" />
          <stop offset="0.80" stopColor="#152548" />
          <stop offset="0.90" stopColor="#5f9e54" />
          <stop offset="1.00" stopColor="#78c25e" />
        </linearGradient>
        {/* vorderer Boden (dunkler = näher) */}
        <linearGradient id="pan-front" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.00" stopColor="#57a747" />
          <stop offset="0.20" stopColor="#5cb04a" />
          <stop offset="0.38" stopColor="#588f47" />
          <stop offset="0.52" stopColor="#f0dca2" />
          <stop offset="0.60" stopColor="#f4dfa4" />
          <stop offset="0.72" stopColor="#122040" />
          <stop offset="0.78" stopColor="#0e1a36" />
          <stop offset="0.80" stopColor="#0e1a36" />
          <stop offset="0.90" stopColor="#4f8f45" />
          <stop offset="1.00" stopColor="#66b053" />
        </linearGradient>
        <linearGradient id="pan-wasser" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#57bdf0" />
          <stop offset="1" stopColor="#1d7fbd" />
        </linearGradient>
        {/* Am rechten Seeufer fällt bereits das kühlere Licht der Nachtwelt
            ein; der Übergang beginnt spät und bleibt auf der Sonnenseite warm. */}
        <linearGradient id="lake-bank" gradientUnits="userSpaceOnUse" x1="3130" y1="0" x2="3870" y2="0">
          <stop offset="0" stopColor="#dfc991" />
          <stop offset="0.62" stopColor="#dfc991" />
          <stop offset="0.84" stopColor="#b9aa84" />
          <stop offset="1" stopColor="#8b826f" />
        </linearGradient>
        <linearGradient id="lake-sand" gradientUnits="userSpaceOnUse" x1="3130" y1="0" x2="3870" y2="0">
          <stop offset="0" stopColor="#efdaa0" />
          <stop offset="0.6" stopColor="#efdaa0" />
          <stop offset="0.82" stopColor="#c9ba91" />
          <stop offset="1" stopColor="#978f7b" />
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
        <linearGradient id="bee-grad" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffd93d" />
          <stop offset="0.55" stopColor="#f5b82e" />
          <stop offset="1" stopColor="#d99518" />
        </linearGradient>
        <linearGradient id="palm-grad" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#c9986a" />
          <stop offset="0.55" stopColor="#9c6b3f" />
          <stop offset="1" stopColor="#7a4d2b" />
        </linearGradient>
        <linearGradient id="boat-grad" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#d97a3e" />
          <stop offset="0.55" stopColor="#b3541e" />
          <stop offset="1" stopColor="#8a3e14" />
        </linearGradient>
        <linearGradient id="crab-grad" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f2895c" />
          <stop offset="0.55" stopColor="#e2703f" />
          <stop offset="1" stopColor="#c9502e" />
        </linearGradient>
        <linearGradient id="rock-grad" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#c3d0d6" />
          <stop offset="0.55" stopColor="#94a6b0" />
          <stop offset="1" stopColor="#6b7a86" />
        </linearGradient>
        <linearGradient id="goat-grad" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f4efe4" />
          <stop offset="0.55" stopColor="#d9d0bc" />
          <stop offset="1" stopColor="#b8a888" />
        </linearGradient>
        <linearGradient id="mtn-grad-far" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#d9eafa" />
          <stop offset="0.5" stopColor="#bcd6ed" />
          <stop offset="1" stopColor="#9ebfdd" />
        </linearGradient>
        <linearGradient id="mtn-grad-mid" x1="0" y1="0" x2="0.65" y2="1">
          <stop offset="0" stopColor="#b3d0e9" />
          <stop offset="0.48" stopColor="#83acd1" />
          <stop offset="1" stopColor="#688fb6" />
        </linearGradient>
        <linearGradient id="mtn-grad-near" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#8ba8c3" />
          <stop offset="0.5" stopColor="#607f9f" />
          <stop offset="1" stopColor="#405d7b" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Panorama({ roadLayer } = {}) {
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
            d="M 940 460 Q 990 350 1040 400 Q 1080 330 1130 395 Q 1175 320 1225 392 Q 1270 335 1320 398
               Q 1365 325 1415 393 Q 1460 340 1510 400 Q 1555 330 1605 395 Q 1650 338 1700 398
               Q 1745 325 1795 392 Q 1840 335 1890 400 Q 1935 345 1985 405 Q 2015 360 2050 420
               L 2050 470 L 940 470 Z"
            fill="#1f5c33"
          />
        </g>
        <g filter="url(#far)" opacity="0.65">
          <path
            d="M 940 480 Q 1000 400 1060 440 Q 1110 380 1170 435 Q 1220 390 1280 438 Q 1330 385 1390 436
               Q 1440 395 1500 438 Q 1550 390 1610 436 Q 1660 398 1720 438 Q 1770 390 1830 436
               Q 1880 400 1940 438 Q 1980 405 2020 440 L 2020 490 L 940 490 Z"
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

        {/* mittlerer + vorderer Boden (durchgehend).
            Explizite Q-Kurven statt T-Kurzschrift: die T-Spiegelung hatte sich
            über so viele Segmente aufgeschaukelt, dass die Kontur um den
            Sonnensee herum weit nach unten ausschlug (Kontrollpunkte bis
            y≈600) – dadurch wirkte der See dort wie freischwebend. Jede
            Kurve bekommt jetzt ihren eigenen, begrenzten Kontrollpunkt.
            Rund um den See folgen beide Boden-Kurven seiner unregelmäßigen
            Uferlinie. So entsteht eine echte Aussparung im Gelände, in die
            Strand und Wasser weiter unten bündig eingesetzt werden. */}
        <path
          d="M 0 440 Q 250 417 500 435 Q 750 407 1000 425 Q 1250 407 1500 445 Q 1750 402 2000 420 Q 2250 402 2500 445 Q 2750 412 3000 430 Q 3065 422 3130 414 C 3185 391 3250 381 3320 382 C 3395 367 3470 374 3535 377 C 3610 367 3690 379 3760 387 C 3825 388 3858 399 3870 414 Q 3935 419.5 4000 425 Q 4250 407 4500 445 Q 4750 407 5000 425 Q 5250 407 5500 445 Q 5750 412 6000 430 L 6000 600 L 0 600 Z"
          fill="url(#pan-mid)"
        />
        <path
          d="M 0 505 Q 300 486 600 500 Q 900 481 1200 495 Q 1500 481 1800 505 Q 2100 478 2400 492 Q 2700 478 3000 505 Q 3065 460 3130 414 C 3152 427 3195 436 3260 439 C 3330 444 3405 452 3485 450 C 3560 448 3640 453 3715 442 C 3790 440 3848 431 3870 414 Q 4035 460 4200 505 Q 4500 478 4800 492 Q 5100 478 5400 505 Q 5700 484 6000 498 L 6000 600 L 0 600 Z"
          fill="url(#pan-front)"
        />
        {/* dezente Maserung, bricht die glatten Verläufe auf */}
        <rect x="0" y="410" width="6000" height="190" filter="url(#grain)" opacity="0.5" style={{ mixBlendMode: 'overlay' }} />

        {/* Weg: liegt auf dem Boden, aber UNTER der gesamten Deko (Bäume,
            Büsche, Tiere …), damit die Deko realistisch vor/neben dem Weg
            steht statt dass der Weg über Baumkronen gemalt wird. */}
        {roadLayer}

        {/* ---------- Region: Blumenwiese ---------- */}
        {/* warmer Sonnenfleck – hebt die Wiese wie ein Lichtstreifen von der übrigen Karte ab */}
        <ellipse cx="500" cy="480" rx="620" ry="180" fill="#fff3c2" opacity="0.14" filter="url(#soft)" />

        <Tree x={80} y={470} s={0.8} dark />
        <Flower x={180} y={520} s={1.1} c="#ff5c8a" />
        <Flower x={320} y={480} s={0.85} c="#b58aff" />
        <Flower x={450} y={555} s={1.2} c="#ffd93d" />
        <Flower x={580} y={500} s={0.95} c="#ff7bac" />
        <Flower x={700} y={545} s={1.1} c="#ff8a5c" />
        <Flower x={830} y={490} s={0.85} c="#7ec3ff" />
        <Flower x={930} y={560} s={1.15} c="#ffd93d" />

        {/* dichte Streu aus kleinen Gänseblümchen zwischen den großen Blüten – unregelmäßig
             verteilt (Mindestabstand zueinander & zu den großen Blüten) statt im Raster */}
        {[
          [762, 451, 0.8], [651, 571, 0.8], [511, 567, 0.8],
          [769, 535, 0.6], [507, 512, 0.6], [820, 581, 0.8],
          [903, 503, 0.6], [285, 454, 0.8], [419, 467, 0.8],
          [854, 504, 0.6], [152, 470, 0.6], [976, 457, 0.8],
          [816, 455, 0.8], [771, 495, 0.8], [565, 540, 0.6],
          [555, 595, 0.8], [336, 543, 0.8], [296, 569, 0.6],
          [121, 506, 0.8], [860, 565, 0.6], [45, 493, 0.6],
          [939, 519, 0.8], [54, 537, 0.8], [511, 472, 0.6],
          [447, 515, 0.6], [980, 551, 0.6], [233, 450, 0.8],
          [267, 486, 0.8], [203, 551, 0.8], [976, 499, 0.8],
          [679, 592, 0.8], [35, 597, 0.8], [621, 540, 0.6],
          [667, 490, 0.8], [231, 597, 0.6], [202, 493, 0.6],
          [90, 559, 0.6], [376, 551, 0.8], [372, 484, 0.6],
          [262, 525, 0.6], [880, 464, 0.6], [609, 480, 0.8],
          [476, 476, 0.6], [342, 602, 0.8], [14, 466, 0.8],
          [601, 572, 0.8], [804, 546, 0.8], [9, 565, 0.6],
          [710, 483, 0.8], [405, 505, 0.6], [717, 596, 0.6],
          [166, 598, 0.8], [239, 562, 0.8], [655, 456, 0.8],
          [117, 454, 0.6], [434, 601, 0.6], [924, 601, 0.6],
          [566, 450, 0.8]
        ].map(([bx, by, bs], i) => (
          <Bloom key={i} x={bx} y={by} s={bs} />
        ))}

        {/* Bienen, fliegen in kleinen Schleifen zwischen den Blumen umher */}
        <Bee x={400} y={420} s={1} />
        <Bee x={760} y={440} s={0.9} />

        <Butterfly x={400} y={330} s={1.05} c="#7ec3ff" />
        <Butterfly x={750} y={290} s={0.8} c="#ffb1c9" />

        {/* ---------- Region: Zahlenwald ---------- */}
        {/* zarte grüne Kronen-Abdunklung – wirkt wie Schatten unter dichtem Blätterdach */}
        <ellipse cx="1500" cy="230" rx="680" ry="270" fill="#1f4a2c" opacity="0.1" filter="url(#soft)" />

        {/* hintere Baumreihe: klein, dunkler, nah am Horizont – zieht den Wald nach hinten */}
        <Pine x={1030} y={430} s={0.5} c="#2e6e3c" cd="#1f5c33" />
        <Tree x={1100} y={398} s={0.42} dark />
        <Pine x={1265} y={402} s={0.48} c="#2e6e3c" cd="#1f5c33" />
        <Tree x={1560} y={400} s={0.46} dark />
        <Pine x={1655} y={392} s={0.5} c="#2e6e3c" cd="#1f5c33" />
        <Tree x={1780} y={415} s={0.48} dark />
        <Pine x={1975} y={432} s={0.55} c="#2e6e3c" cd="#1f5c33" />

        {/* mittlere Baumreihe, entlang der bereits vorhandenen Weg-Aussparungen */}
        <Tree x={1120} y={505} s={1.2} />
        <Tree x={1330} y={452} s={0.85} dark />
        <Pine x={1520} y={500} s={0.8} />
        <Tree x={1700} y={458} s={0.8} />
        <Pine x={1905} y={520} s={0.95} />

        {/* vordere, größere Baumreihe – rahmt die Szene und macht sie dicht */}
        <Pine x={1055} y={560} s={0.95} />
        <Tree x={1460} y={545} s={0.95} dark />
        <Pine x={1565} y={565} s={0.8} />
        <Tree x={1945} y={565} s={1.05} dark />

        {/* Waldboden: Farne, Pilze, ein umgestürzter Stamm */}
        <Fern x={1175} y={588} s={1} />
        <Fern x={1355} y={548} s={0.9} />
        <Fern x={1615} y={588} s={1.05} />
        <Fern x={1875} y={562} s={0.9} />
        <Log x={1475} y={592} s={0.85} rot={-6} />
        <Mushroom x={1250} y={560} />
        <Mushroom x={1790} y={572} s={0.8} cap="#e08a3c" />
        <Mushroom x={1920} y={558} s={0.6} cap="#e08a3c" />

        {/* Waldtiere */}
        <Rabbit x={1700} y={530} s={0.8} />
        <Bear x={1390} y={575} s={1.05} />

        {/* ---------- Region: Bergwelt ---------- */}
        {/* zweite, höher gelegene Bodenebene: kleinere Vegetation und Geröll
            lassen die Bergwelt bis an den Fuß der Gipfel belebt wirken */}
        <Pine x={2075} y={444} s={0.42} c="#3b7650" cd="#285c3b" />
        <Rock x={2185} y={448} s={0.48} />
        <AlpineFlower x={2240} y={444} s={0.58} />
        <Goat x={2295} y={456} s={0.5} />
        <Pine x={2370} y={463} s={0.46} c="#3b7650" cd="#285c3b" />
        <Cairn x={2460} y={455} s={0.52} />
        <AlpineFlower x={2535} y={448} s={0.55} />
        <Rock x={2635} y={447} s={0.5} />
        <Goat x={2685} y={452} s={0.46} />
        <Pine x={2745} y={458} s={0.44} c="#3b7650" cd="#285c3b" />
        <Cairn x={2835} y={449} s={0.48} />
        <AlpineFlower x={2910} y={443} s={0.58} />
        <Pine x={2980} y={452} s={0.4} c="#3b7650" cd="#285c3b" />

        {/* Kiefern in mehreren Reihen, unterschiedlich groß für Tiefe */}
        <Pine x={2100} y={545} s={0.8} />
        <Pine x={2430} y={525} s={0.6} />
        <Pine x={2650} y={555} s={0.85} />
        <Pine x={2920} y={540} s={0.7} />
        <Pine x={2050} y={588} s={0.6} />
        <Pine x={2200} y={568} s={0.7} />
        <Pine x={2320} y={592} s={0.55} />
        <Pine x={2550} y={582} s={0.75} />
        <Pine x={2780} y={565} s={0.65} />
        <Pine x={2870} y={592} s={0.7} />
        <Pine x={2980} y={562} s={0.6} />

        {/* Felsbrocken & Steinmänner säumen den Bergpfad */}
        <Rock x={2150} y={596} s={1} />
        <Rock x={2350} y={556} s={0.7} />
        <Rock x={2500} y={593} s={0.85} />
        <Rock x={2620} y={572} s={0.6} />
        <Rock x={2750} y={596} s={0.95} />
        <Rock x={2900} y={559} s={0.65} />
        <Cairn x={2400} y={586} s={0.75} />
        <Cairn x={2830} y={576} s={0.7} />

        {/* Alpenblumen zwischen den Felsen */}
        <AlpineFlower x={2080} y={600} s={0.8} />
        <AlpineFlower x={2180} y={548} s={0.7} />
        <AlpineFlower x={2280} y={585} s={0.9} />
        <AlpineFlower x={2380} y={610} s={0.75} />
        <AlpineFlower x={2480} y={555} s={0.8} />
        <AlpineFlower x={2580} y={600} s={0.7} />
        <AlpineFlower x={2680} y={548} s={0.85} />
        <AlpineFlower x={2780} y={608} s={0.75} />
        <AlpineFlower x={2880} y={540} s={0.8} />
        <AlpineFlower x={2960} y={598} s={0.7} />

        {/* Steinböcke stehen still auf den Felsen */}
        <Goat x={2250} y={548} s={0.85} />
        <Goat x={2720} y={560} s={0.75} />

        {/* Adler ziehen ruhige Kreise hoch über den Gipfeln */}
        <Eagle x={2200} y={170} s={1} />
        <Eagle x={2650} y={140} s={0.9} />
        <Eagle x={2900} y={190} s={0.8} />

        {/* ---------- Region: Sonnensee ---------- */}
        {/* Unregelmäßige, gestaffelte Uferzonen betten den See ins Gelände ein.
            Der dunkle Außenrand liegt nur an der nahen Kante und wirkt wie
            eine flache Böschung statt wie ein Schlagschatten unter einer Scheibe. */}
        <path
          d="M 3130 414 C 3185 391 3250 381 3320 382 C 3395 367 3470 374 3535 377 C 3610 367 3690 379 3760 387 C 3825 388 3858 399 3870 414 C 3848 431 3790 440 3715 442 C 3640 453 3560 448 3485 450 C 3405 452 3330 444 3260 439 C 3195 436 3152 427 3130 414 Z"
          fill="url(#lake-bank)"
          opacity="0.42"
          filter="url(#lake-edge)"
        />
        <path
          d="M 3142 413 C 3194 394 3260 385 3325 386 C 3398 373 3468 379 3536 381 C 3608 373 3682 383 3754 390 C 3812 391 3848 401 3858 413 C 3837 425 3782 433 3709 435 C 3636 445 3560 440 3485 443 C 3408 445 3335 438 3266 433 C 3207 431 3161 423 3142 413 Z"
          fill="url(#lake-sand)"
          opacity="0.72"
          filter="url(#lake-edge)"
        />
        <path
          d="M 3133 414 C 3187 392 3251 382 3321 383 C 3395 368 3470 375 3535 378 C 3610 368 3690 380 3759 388 C 3823 389 3856 400 3868 414 C 3828 422 3774 428 3703 429 C 3633 437 3560 433 3486 436 C 3414 438 3342 432 3275 428 C 3218 426 3168 421 3133 414 Z"
          fill="url(#pan-wasser)"
          filter="url(#lake-edge)"
        />
        {/* warmer Glanzstreifen auf dem Wasser, wie Sonnenlicht auf der Oberfläche */}
        <path d="M 3305 402 C 3410 387 3600 387 3775 404 C 3650 399 3440 410 3305 402 Z" fill="#fff8d9" opacity="0.2" filter="url(#soft)" />
        <path d="M 3176 418 C 3330 432 3660 438 3826 418" fill="none" stroke="#e9d59d" strokeWidth="2" opacity="0.18" strokeLinecap="round" filter="url(#edge)" />
        <ellipse className="pano-shimmer" cx="3620" cy="402" rx="64" ry="6" fill="#fff" opacity="0.3" />
        {[3220, 3380, 3540, 3680].map((x, i) => (
          <path
            key={i}
            className="pano-shimmer"
            style={{ animationDelay: `-${i * 0.6}s` }}
            d={`M ${x} ${406 + (i % 2) * 12} q 14 -8 28 0 q 14 -8 28 0`}
            stroke="#bfe9ff"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        ))}

        {/* kleines Segelboot weiter hinten auf dem See, gibt Tiefe */}
        <Boat x={3370} y={394} s={0.4} />
        <Boat x={3500} y={408} s={0.75} />
        <Fish x={3260} y={432} s={0.8} />
        <Fish x={3730} y={426} s={0.7} flip />

        {/* Möwen, gleiten über dem See */}
        <Seagull x={3200} y={345} s={1} />
        <Seagull x={3550} y={328} s={0.85} />
        <Seagull x={3820} y={358} s={0.9} />

        {/* Palmen rahmen den Strand */}
        <Palm x={3090} y={545} s={0.95} />
        <Palm x={3960} y={568} s={0.75} />
        <Palm x={3025} y={598} s={0.55} />

        {/* Strand-Deko: Sonnenschirm mit Handtuch, Sandburg, Krabben */}
        <Umbrella x={3780} y={575} s={0.72} />
        <Sandcastle x={3250} y={582} s={0.8} />
        <Crab x={3400} y={594} s={0.9} />
        <Crab x={3680} y={577} s={0.7} />

        {/* Dünengras, Muscheln & Seesterne verteilen sich am Ufer */}
        <DuneGrass x={3050} y={578} s={0.9} />
        <DuneGrass x={3195} y={600} s={0.8} />
        <DuneGrass x={3615} y={600} s={0.85} />
        <DuneGrass x={3915} y={583} s={0.8} />
        <Shell x={3155} y={562} s={0.8} c="#ffb199" />
        <Shell x={3480} y={598} s={0.7} c="#ffd9a3" />
        <Shell x={3750} y={548} s={0.75} c="#f4dfa4" />
        <Shell x={3985} y={597} s={0.65} c="#ffb199" />
        <Starfish x={3320} y={562} s={0.8} c="#ff8a5c" />
        <Starfish x={3600} y={592} s={0.75} c="#ffb199" />

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
