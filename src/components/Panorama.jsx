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
      {/* Wasserlage und gebrochene Spiegelung unter dem Rumpf. */}
      <ellipse cx="0" cy="31" rx="46" ry="5.5" fill="#0c3d5e" opacity="0.2" filter="url(#edge)" />
      <path d="M -50 34 Q -24 30 0 34 Q 24 38 50 33" stroke="#b9e8f5" strokeWidth="2" fill="none" opacity="0.48" strokeLinecap="round" />
      <path d="M -28 41 Q 0 45 28 40 M -17 49 Q 0 52 18 48" stroke="#287da8" strokeWidth="2.2" fill="none" opacity="0.28" strokeLinecap="round" />
      <path d="M 0 33 Q 3 41 0 49" stroke="#e8f7fb" strokeWidth="2" fill="none" opacity="0.2" filter="url(#edge)" />

      <path d="M -46 0 Q 0 26 46 0 L 34 16 Q 0 30 -34 16 Z" fill="url(#boat-grad)" />
      <path d="M -46 0 Q 0 26 46 0 L 40 8 Q 0 26 -40 8 Z" fill="#8a3e14" />
      {/* Schlagschatten am Rumpf, Licht kommt von links oben wie bei den Tieren */}
      <path d="M 10 8 Q 30 12 34 16 Q 0 30 -34 16 Q -4 20 10 8 Z" fill="#5c2a0e" opacity="0.3" filter="url(#edge)" />
      <path d="M -40 8 Q 0 27 40 8" stroke="#f5a46c" strokeWidth="2" fill="none" opacity="0.55" />
      <path d="M -28 17 Q 0 27 27 17" stroke="#5c2a0e" strokeWidth="1.2" fill="none" opacity="0.45" />

      <rect x="-2" y="-70" width="4" height="71" rx="1" fill="#6e4527" />
      <path d="M -0.5 -68 L -0.5 -2" stroke="#b98752" strokeWidth="1" opacity="0.7" />
      {/* leicht gewölbte Segel, Nähte und dünne Takelage */}
      <path d="M 2 -68 Q 29 -47 44 -6 Q 23 -10 2 -6 Z" fill="#fff" />
      <path d="M 2 -68 Q 29 -47 44 -6 Q 30 -11 20 -18 Q 14 -43 2 -68 Z" fill="#dbe7ee" opacity="0.72" />
      <path d="M -2 -60 Q -25 -38 -36 -6 Q -19 -10 -2 -6 Z" fill="#ff8a5c" />
      <path d="M -2 -60 Q -11 -34 -12 -9 Q -7 -7 -2 -6 Z" fill="#d95845" opacity="0.48" />
      <path d="M 3 -66 L 43 -5 M -3 -58 L -35 -5" stroke="#6e4527" strokeWidth="0.9" fill="none" opacity="0.55" />
      <path d="M 6 -46 Q 21 -35 31 -17" stroke="#b6cbd7" strokeWidth="0.8" fill="none" opacity="0.6" />
      <path d="M 2 -70 L 14 -74 L 2 -78 Z" fill="#e05252" />
    </g>
  )
}

function PalmFrond({ angle, length, droop = 18, shade = 0 }) {
  const ribs = [0.24, 0.36, 0.48, 0.6, 0.72, 0.82]
  const bezierPoint = (start, control1, control2, end, t) => {
    const inverse = 1 - t
    return inverse ** 3 * start
      + 3 * inverse ** 2 * t * control1
      + 3 * inverse * t ** 2 * control2
      + t ** 3 * end
  }

  return (
    <g transform={`rotate(${angle})`}>
      {/* Geschlossene, spitz zulaufende Silhouette statt einer dicken runden Linie. */}
      <path
        d={`M 0 -3 C ${length * 0.3} -13 ${length * 0.72} ${droop - 12} ${length} ${droop}
            C ${length * 0.7} ${droop + 2} ${length * 0.28} 7 0 4 Z`}
        fill="url(#palm-leaf-grad)"
      />
      {/* Die unteren/rechten Wedel zeigen mehr von ihrer kühleren Unterseite. */}
      <path
        d={`M 2 1 C ${length * 0.38} 1 ${length * 0.73} ${droop + 1} ${length} ${droop}
            C ${length * 0.68} ${droop + 5} ${length * 0.3} 9 2 5 Z`}
        fill="#185f3c"
        opacity={0.3 + shade}
        filter="url(#edge)"
      />

      {/* Mittelrippe und einzelne, abwechselnd geneigte Blattfiedern. */}
      <path
        d={`M 1 1 C ${length * 0.32} -7 ${length * 0.7} ${droop - 5} ${length} ${droop}`}
        stroke="#276d3d"
        strokeWidth="1.8"
        fill="none"
        opacity="0.9"
        filter="url(#palm-detail-soft)"
        strokeLinecap="round"
      />
      {ribs.map((t, i) => {
        const px = bezierPoint(1, length * 0.32, length * 0.7, length, t)
        const py = bezierPoint(1, -7, droop - 5, droop, t)
        const ribLength = 2.4 + Math.sin(t * Math.PI) * 2.2
        return (
          <g key={t} opacity="0.9" filter="url(#palm-detail-soft)">
            <path
              d={`M ${px} ${py} q ${ribLength * 0.35} ${-ribLength * 0.55} ${ribLength * 0.78} ${-ribLength}`}
              stroke="#59b968"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M ${px} ${py + 0.5} q ${ribLength * 0.34} ${ribLength * 0.5} ${ribLength * 0.72} ${ribLength * 0.9}`}
              stroke={i > 3 ? '#246f43' : '#31894b'}
              strokeWidth="1.15"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        )
      })}
      {/* Schmale Sonnenkante entlang der linken/oberen Blattfläche. */}
      <path
        d={`M 6 -1 C ${length * 0.3} -6 ${length * 0.62} ${droop - 7} ${length * 0.84} ${droop - 3}`}
        stroke="#8bd77b"
        strokeWidth="0.9"
        fill="none"
        opacity="0.48"
        filter="url(#palm-detail-soft)"
        strokeLinecap="round"
      />
    </g>
  )
}

function Palm({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="12" cy="6" rx="44" ry="8" fill="#000" opacity="0.16" filter="url(#edge)" />

      {/* Leicht geneigter, nach oben dünner werdender Stamm. */}
      <path d="M -8 1 C -5 -31 2 -67 18 -94 L 29 -90 C 15 -60 10 -28 9 1 Z" fill="url(#palm-grad)" />
      <path d="M 6 0 C 7 -34 13 -67 25 -92 L 29 -90 C 16 -59 12 -27 9 1 Z" fill="#603a25" opacity="0.5" filter="url(#edge)" />
      <path d="M -1 -5 C 2 -35 9 -67 21 -90" stroke="#e1b27a" strokeWidth="1.1" fill="none" opacity="0.42" filter="url(#palm-detail-soft)" strokeLinecap="round" />

      {/* Alte Blattansätze ergeben die typischen unregelmäßigen Stammringe. */}
      {[
        { y: -14, x1: -4, x2: 8 },
        { y: -29, x1: -2, x2: 10 },
        { y: -44, x1: 1, x2: 13 },
        { y: -59, x1: 5, x2: 16 },
        { y: -73, x1: 10, x2: 20 }
      ].map(({ y, x1, x2 }) => (
        <path
          key={y}
          d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + 3} ${x2} ${y + 0.8}`}
          stroke="#674128"
          strokeWidth="1.15"
          fill="none"
          opacity="0.5"
          filter="url(#palm-detail-soft)"
          strokeLinecap="round"
        />
      ))}

      <g transform="translate(23 -92)">
        <g>
          <PalmFrond angle={-174} length={76} droop={18} />
          <PalmFrond angle={-145} length={76} droop={12} />
          <PalmFrond angle={-112} length={70} droop={8} />
          <PalmFrond angle={-78} length={72} droop={9} />
          <PalmFrond angle={-43} length={78} droop={13} shade={0.04} />
          <PalmFrond angle={-8} length={76} droop={20} shade={0.08} />
          <PalmFrond angle={22} length={66} droop={24} shade={0.13} />
        </g>

        {/* Blattkrone und Kokosnüsse liegen vor den Wedelansätzen. */}
        <ellipse cx="0" cy="2" rx="10" ry="7" fill="#397f43" />
        <circle cx="-5" cy="5" r="6" fill="url(#coconut-grad)" />
        <circle cx="7" cy="7" r="5.5" fill="url(#coconut-grad)" />
        <circle cx="1" cy="12" r="5" fill="url(#coconut-grad)" />
        <circle cx="-7" cy="3" r="1.6" fill="#e5c08a" opacity="0.6" filter="url(#palm-detail-soft)" />
        <circle cx="5" cy="5" r="1.4" fill="#e5c08a" opacity="0.5" filter="url(#palm-detail-soft)" />
      </g>
    </g>
  )
}

// Krabbe – huscht seitlich über den Sand, aufgebaut wie die Waldtiere
// (Panzer → Scheren → Beine → Augen), mit Verlauf & weichem Schlagschatten
function Crab({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="1" cy="8" rx="17" ry="3.8" fill="#000" opacity="0.14" filter="url(#edge)" />

      {/* Drei gegliederte Laufbeine pro Seite. */}
      <path d="M -9 0 Q -15 1 -20 -3 L -23 -1 M -10 3 Q -17 5 -22 3 L -25 5 M -9 5 Q -16 9 -21 9 L -23 11" stroke="#bd4829" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 9 0 Q 15 1 20 -3 L 23 -1 M 10 3 Q 17 5 22 3 L 25 5 M 9 5 Q 16 9 21 9 L 23 11" stroke="#bd4829" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Scheren */}
      <path d="M -12 -1 Q -21 -6 -19 -14 Q -15 -10 -9 -8 Z" fill="#e2703f" />
      <circle cx="-19" cy="-13" r="3.4" fill="#e2703f" />
      <ellipse cx="-20" cy="-14" rx="1.4" ry="1.8" fill="#a83c1e" opacity="0.4" filter="url(#edge)" />
      <path d="M -22 -14 Q -19 -11 -16 -14" stroke="#a83c1e" strokeWidth="1" fill="none" opacity="0.55" />
      <path d="M 12 -1 Q 21 -6 19 -14 Q 15 -10 9 -8 Z" fill="#e2703f" />
      <circle cx="19" cy="-13" r="3.4" fill="#e2703f" />
      <ellipse cx="20" cy="-14" rx="1.4" ry="1.8" fill="#a83c1e" opacity="0.4" filter="url(#edge)" />
      <path d="M 16 -14 Q 19 -11 22 -14" stroke="#a83c1e" strokeWidth="1" fill="none" opacity="0.55" />

      {/* Panzer, Licht links oben → Schatten rechts unten */}
      <ellipse cx="0" cy="-2" rx="13" ry="9" fill="url(#crab-grad)" />
      <path d="M 6 -8 Q 12 -4 11 3 Q 12 -3 8 -8 Z" fill="#a83c1e" opacity="0.35" filter="url(#edge)" />
      <ellipse cx="-3" cy="-5" rx="3.6" ry="2.4" fill="#f2a583" opacity="0.5" />
      <path d="M -8 1 Q 0 5 8 1 M -7 -5 Q 0 -2 7 -5" stroke="#a83c1e" strokeWidth="0.9" fill="none" opacity="0.35" strokeLinecap="round" />
      <circle cx="-7" cy="-1" r="0.8" fill="#ffd0b8" opacity="0.6" />
      <circle cx="5" cy="1" r="0.65" fill="#8f321c" opacity="0.45" />

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
function Shell({ x, y, s = 1, c = '#ffb199', rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx="0.8" cy="6.5" rx="9.5" ry="2.2" fill="#000" opacity="0.11" filter="url(#edge)" />
      {/* Gefächerte, leicht asymmetrische Schale mit verdicktem Schlossrand. */}
      <path d="M -10 4 Q -10 -3 -6 -7 Q -2 -11 1 -10 Q 7 -8 10 3 Q 6 7 0 7 Q -6 7 -10 4 Z" fill={c} />
      <path d="M 1 -10 Q 7 -8 10 3 Q 7 7 1 7 Q 5 2 4 -4 Q 4 -8 1 -10 Z" fill="#b75f54" opacity="0.2" filter="url(#edge)" />
      <path d="M -8 3 Q 0 6 9 3" stroke="#a85f55" strokeWidth="1.4" fill="none" opacity="0.45" strokeLinecap="round" />
      {[-6, -3, 0, 3, 6].map((sx) => (
        <path key={sx} d={`M ${sx * 0.12} -8 Q ${sx} -2 ${sx} 4`} stroke="#fff7e8" strokeWidth="0.75" fill="none" opacity="0.58" strokeLinecap="round" />
      ))}
      <path d="M -6 -5 Q -3 -9 0 -9" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.55" strokeLinecap="round" />
    </g>
  )
}

// Seestern – liegt flach im Sand
function Starfish({ x, y, s = 1, c = '#ff8a5c', rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx="1" cy="7" rx="10" ry="2.4" fill="#000" opacity="0.11" filter="url(#edge)" />
      <path d="M 0 -11 C 3 -9 2 -5 3 -3 C 6 -3 9 -5 11 -2 C 10 1 7 2 5 3 C 7 6 8 9 5 11 C 2 9 1 6 0 5 C -2 7 -4 10 -7 9 C -8 6 -5 3 -4 2 C -7 1 -10 0 -10 -3 C -7 -5 -4 -4 -2 -3 C -2 -7 -2 -10 0 -11 Z" fill={c} />
      <path d="M 2 -3 Q 6 0 5 9 Q 2 7 0 4 Q 2 1 2 -3 Z" fill="#b94f32" opacity="0.28" filter="url(#edge)" />
      <path d="M -1 -8 Q 0 -4 0 1 M -7 -2 Q -3 -1 0 1" stroke="#ffd2bc" strokeWidth="0.8" fill="none" opacity="0.55" strokeLinecap="round" />
      {[[-3, -3], [0, 0], [4, 1], [-2, 4], [2, 5]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 1 ? 1 : 0.65} fill="#ffe0cc" opacity="0.56" />
      ))}
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
      <ellipse cx="0" cy="3" rx="10" ry="2.7" fill="#b78d52" opacity="0.2" />
      <g className="pano-sway" style={{ animationDelay: `-${delay}s` }}>
        {[-38, -24, -10, 4, 17, 31, 43].map((a, i) => (
          <path
            key={a}
            d={blade(a, 16 + (i % 3) * 2.5 - Math.abs(a) * 0.08)}
            stroke={i % 2 ? '#819744' : '#a9b85b'}
            strokeWidth={i % 3 === 0 ? 1.5 : 1.9}
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </g>
    </g>
  )
}

// Sandburg – kleine Strand-Deko, Türmchen + Fähnchen
function Sandcastle({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="1" cy="16" rx="30" ry="6" fill="#000" opacity="0.13" filter="url(#edge)" />
      <path d="M -30 14 Q -20 8 -12 12 Q 0 8 12 12 Q 22 8 30 15 Q 12 20 -8 18 Q -22 19 -30 14 Z" fill="#d9ad70" opacity="0.75" />

      {/* Zwei Seitentürme und ein höherer Mittelbau mit echten Zinnen. */}
      <path d="M -25 14 L -25 -3 L -21 -3 L -21 -8 L -16 -8 L -16 -3 L -11 -3 L -11 -8 L -6 -8 L -6 -3 L -4 -3 L -4 14 Z" fill="url(#sandcastle-grad)" />
      <path d="M 4 14 L 4 -3 L 7 -3 L 7 -8 L 12 -8 L 12 -3 L 17 -3 L 17 -8 L 22 -8 L 22 -3 L 25 -3 L 25 14 Z" fill="url(#sandcastle-grad)" />
      <path d="M -12 14 L -12 -11 L -8 -11 L -8 -16 L -3 -16 L -3 -11 L 2 -11 L 2 -16 L 7 -16 L 7 -11 L 11 -11 L 11 14 Z" fill="url(#sandcastle-grad)" />
      <path d="M 5 -15 Q 11 -8 10 14 L 25 14 L 25 -3 Q 19 -7 17 -4 L 17 -8 L 12 -8 L 12 -3 L 7 -3 L 7 -8 L 4 -8 Z" fill="#a9773f" opacity="0.22" filter="url(#edge)" />

      {/* Tor, Fenster und angedeutete verdichtete Sandschichten. */}
      <path d="M -4 14 L -4 7 A 4 4 0 0 1 4 7 L 4 14 Z" fill="#9f6f3f" opacity="0.78" />
      <path d="M -19 4 A 2.5 2.5 0 0 1 -14 4 L -14 8 L -19 8 Z M 11 4 A 2.5 2.5 0 0 1 16 4 L 16 8 L 11 8 Z" fill="#ac7944" opacity="0.7" />
      <path d="M -23 0 L -6 0 M 5 0 L 22 0 M -10 -7 L 9 -7 M -22 10 L -8 10 M 8 10 L 22 10" stroke="#fff0c9" strokeWidth="0.8" fill="none" opacity="0.5" strokeLinecap="round" />
      <circle cx="-18" cy="-4" r="0.8" fill="#fff0c9" opacity="0.7" />
      <circle cx="8" cy="-9" r="0.7" fill="#9f6f3f" opacity="0.4" />

      <path d="M 0 -16 L 0 -29" stroke="#795031" strokeWidth="1.5" />
      <path d="M 1 -29 Q 8 -27 12 -23 Q 6 -22 1 -24 Z" fill="#ff665f" />
      <path d="M 2 -28 Q 7 -27 9 -25" stroke="#ffaaa0" strokeWidth="0.8" fill="none" opacity="0.8" />
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

// Eimer und Schaufel lockern größere freie Sandflächen auf.
function BeachToys({ x, y, s = 1, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="0" cy="9" rx="19" ry="4" fill="#000" opacity="0.12" filter="url(#edge)" />
      <path d="M -10 -7 Q 0 -14 10 -7" stroke="#477ca2" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M -12 -6 L -9 8 Q 0 12 9 8 L 12 -6 Z" fill="url(#bucket-grad)" />
      <ellipse cx="0" cy="-6" rx="12" ry="3.8" fill="#4f9fd1" />
      <ellipse cx="0" cy="-6" rx="8.5" ry="2.2" fill="#366f94" opacity="0.65" />
      <path d="M 14 7 L 22 -12" stroke="#8a5a35" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M 20 -11 Q 25 -16 29 -12 L 25 -4 Q 21 -5 20 -11 Z" fill="#ff775f" />
      <path d="M 22 -12 Q 25 -13 27 -11" stroke="#ffb09d" strokeWidth="0.9" fill="none" />
    </g>
  )
}

// Kleine Mulden, Kiesel und Sandkörner verhindern große sterile Leerflächen.
function BeachMarks({ x, y, s = 1, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity="0.55">
      <path d="M -15 1 Q -10 -2 -5 1 M 3 -3 Q 8 -6 13 -3" stroke="#b98e57" strokeWidth="1" fill="none" strokeLinecap="round" />
      <ellipse cx="-10" cy="5" rx="2.8" ry="1.4" fill="#d5b178" />
      <ellipse cx="8" cy="3" rx="2.2" ry="1.2" fill="#a98761" />
      <circle cx="0" cy="5" r="1" fill="#f5dfb3" />
      <circle cx="15" cy="1" r="0.8" fill="#c59a61" />
    </g>
  )
}

// Fisch knapp über der Wasseroberfläche – Spritzer und Ringe verankern ihn im See.
function Fish({ x, y, s = 1, flip = false, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {/* Wasserringe bleiben direkt unter dem Fisch und nicht auf dem Strand. */}
      <path d="M -22 10 Q -11 6 0 10 Q 11 14 22 10" stroke="#c9f1fb" strokeWidth="1.6" fill="none" opacity="0.72" strokeLinecap="round" />
      <path d="M -14 15 Q 0 19 14 15" stroke="#2387b8" strokeWidth="1.4" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M -9 7 Q -12 1 -9 -2 M 8 7 Q 12 2 10 -1" stroke="#e5faff" strokeWidth="1.4" fill="none" opacity="0.75" strokeLinecap="round" />
      <circle cx="-12" cy="-4" r="1.4" fill="#dff8ff" opacity="0.75" />
      <circle cx="12" cy="-3" r="1" fill="#dff8ff" opacity="0.7" />

      <g transform={`rotate(${rot})`}>
        <path d="M -11 0 Q -5 -9 7 -6 Q 13 -3 12 2 Q 8 8 -3 7 Q -8 6 -11 0 Z" fill="url(#fish-grad)" />
        <path d="M 11 -3 L 18 -8 L 16 0 L 19 7 L 11 4 Q 13 1 11 -3 Z" fill="#2787bd" />
        <path d="M -1 -7 Q 3 -13 7 -6 Z" fill="#4fb8df" />
        <path d="M 1 3 Q 5 9 8 4 Z" fill="#1f78ac" opacity="0.72" />
        <path d="M -10 -1 Q -4 -6 3 -5" stroke="#a9ecf7" strokeWidth="1.4" fill="none" opacity="0.75" strokeLinecap="round" />
        <path d="M -4 -5 Q -1 0 -4 5" stroke="#237aa9" strokeWidth="0.9" fill="none" opacity="0.6" />
        <path d="M 1 -3 Q 4 -1 6 2 M 4 -4 Q 7 -2 8 0" stroke="#d0f3f8" strokeWidth="0.7" fill="none" opacity="0.5" />
        <circle cx="-6.5" cy="-2" r="1.45" fill="#17384b" />
        <circle cx="-7" cy="-2.5" r="0.48" fill="#fff" />
      </g>
    </g>
  )
}

// Kleiner Schwimmring mit echter Öffnung und Kontaktwellen auf dem Wasser.
function SwimRing({ x, y, s = 1, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx="1" cy="6" rx="24" ry="5" fill="#0b5f8d" opacity="0.2" filter="url(#edge)" />
      <path d="M -29 8 Q 0 13 29 8 M -21 14 Q 0 17 21 13" stroke="#bdebf5" strokeWidth="1.5" fill="none" opacity="0.52" strokeLinecap="round" />

      {/* Die zweite Ellipse wird durch evenodd wirklich ausgespart; dadurch
          bleibt das Wasser in der Mitte sichtbar. */}
      <path
        d="M -20 0 A 20 9 0 1 0 20 0 A 20 9 0 1 0 -20 0 Z
           M -9 0 A 9 4 0 1 1 9 0 A 9 4 0 1 1 -9 0 Z"
        fill="url(#swim-ring-grad)"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path d="M -19 1 A 19 8 0 0 0 19 1" stroke="#bd3f42" strokeWidth="2.4" fill="none" opacity="0.46" strokeLinecap="round" />
      <path d="M -15 -4 Q 0 -10 15 -4" stroke="#ffd3bd" strokeWidth="1.6" fill="none" opacity="0.72" strokeLinecap="round" />
      <path d="M -10 -7 L -5 -3 M 10 -7 L 5 -3 M -18 -2 L -9 -1 M 18 -2 L 9 -1" stroke="#fff1df" strokeWidth="1.2" opacity="0.68" strokeLinecap="round" />
      <ellipse cx="-9" cy="-4" rx="4" ry="1.5" fill="#fff" opacity="0.24" filter="url(#palm-detail-soft)" />
    </g>
  )
}

// Der Bach folgt dem Gefälle des Tals: hinten schmal, vorne breiter und mit
// einem seitlichen Versatz. Er wird unter dem Weg gezeichnet, damit er wie
// ein Teil des Bodens und nicht wie ein aufgelegtes Band wirkt.
function MountainStream() {
  return (
    <g>
      {/* Die Quelle öffnet sich direkt an der Wiesenkante (hier y≈420).
          Keine umlaufende dunkle Fläche: links liegt heller Kies, nur die
          rechte/unten liegende Böschung bekommt einen schmalen Schatten. */}
      <path d="M 2278 421 C 2294 447 2329 467 2327 489 C 2325 507 2346 516 2343 535
               C 2340 554 2393 570 2405 600 L 2435 600 C 2422 566 2365 550 2368 532
               C 2371 510 2346 503 2348 488 C 2351 464 2317 445 2301 421
               Q 2289 415 2278 421 Z"
        fill="url(#mountain-stream-grad)" />
      {/* Flaches Quellbecken an der Wiesenkante: Die transparente Lichtfläche
          folgt derselben Öffnung und geht ohne sichtbare Abschlusslinie in
          den schmaleren Bachlauf über. */}
      <path d="M 2280 422 Q 2289 417 2299 422 C 2303 431 2311 440 2319 447
               Q 2307 446 2295 438 Q 2287 431 2280 422 Z"
        fill="#c8f2f8" opacity="0.34" />
      <path d="M 2283 423 Q 2289 420 2297 423 M 2290 429 Q 2298 427 2306 432"
        stroke="#effdff" strokeWidth="1.5" fill="none" opacity="0.56" strokeLinecap="round" />
      {/* An der Kante zur vorderen Bodenebene fällt das Bachbett wenige Pixel
          ab. Zwei helle Brechungen vermitteln den kleinen Höhenwechsel. */}
      <path d="M 2322 489 Q 2338 498 2354 489" stroke="#f4fdff" strokeWidth="3.2" fill="none" opacity="0.82" strokeLinecap="round" />
      <path d="M 2325 495 Q 2338 501 2352 495" stroke="#8edcf1" strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round" />
      {/* Eine flache Stufe zeigt das Gefälle, ohne einen senkrechten Wasserfall vorzutäuschen. */}
      <path d="M 2327 487 Q 2338 493 2348 487" stroke="#f5fdff" strokeWidth="3" fill="none" opacity="0.72" strokeLinecap="round" />
      <path d="M 2341 544 Q 2354 550 2368 543 M 2384 574 Q 2400 581 2417 574"
        stroke="#e7faff" strokeWidth="2.4" fill="none" opacity="0.62" strokeLinecap="round" />
      <path d="M 2296 436 C 2306 451 2338 467 2336 482 M 2354 514 C 2347 531 2351 544 2372 555
               M 2388 567 C 2402 576 2414 584 2420 594"
        stroke="#dff8ff" strokeWidth="1.8" fill="none" opacity="0.58" strokeLinecap="round" />
      {/* Steine werden nach vorne größer und verstärken die Tiefenwirkung. */}
      {[[2295, 444, 3], [2321, 465, 4], [2318, 493, 5], [2366, 520, 5], [2338, 548, 7], [2390, 570, 8], [2440, 593, 9]].map(([sx, sy, r], i) => (
        <g key={i}>
          <ellipse cx={sx + 2} cy={sy + 2} rx={r + 2} ry={r * 0.55} fill="#263b42" opacity="0.24" />
          <ellipse cx={sx} cy={sy} rx={r} ry={r * 0.62} fill="#8fa0a2" />
          <ellipse cx={sx - r * 0.25} cy={sy - r * 0.18} rx={r * 0.42} ry={r * 0.2} fill="#d8dfdc" opacity="0.48" />
        </g>
      ))}
      {/* Schaum teilt sich an einzelnen Steinen und schließt danach wieder. */}
      <path d="M 2311 491 q 7 -5 14 0 M 2358 518 q 8 -6 16 0 M 2380 568 q 10 -7 20 0 M 2428 590 q 12 -7 22 1"
        stroke="#f4fdff" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
    </g>
  )
}

function MountainBridge({ x, y, s = 1 }) {
  const planks = [-36, -24, -12, 0, 12, 24, 36]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Die Brücke bleibt leicht gewölbt, ist als Ganzes aber gerade ausgerichtet. */}
      <g>
        <ellipse cx="3" cy="8" rx="57" ry="15" fill="#182c32" opacity="0.28" filter="url(#edge)" />
        <path d="M -51 -13 Q 0 -22 51 -13 L 49 14 Q 0 5 -49 14 Z" fill="#704521" />
        {planks.map((px, i) => (
          <g key={px} transform={`translate(${px} ${-(1 - Math.abs(px) / 36) * 7})`}>
            <rect x="-5.5" y="-13" width="11" height="26" rx="1.5" fill={i % 2 ? '#a96f35' : '#bb7d3d'} />
            <path d="M -3 -8 Q 0 -10 3 -8 M -3 5 Q 0 3 3 5" stroke="#68401f" strokeWidth="0.8" fill="none" opacity="0.55" />
            <path d="M -3.5 -10 L -3.5 9" stroke="#e5aa62" strokeWidth="0.7" opacity="0.45" />
          </g>
        ))}
        <path d="M -49 -13 Q 0 -22 49 -13 M -49 13 Q 0 4 49 13" stroke="#57351c" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Geländer mit Pfosten und sichtbarer Lichtkante. */}
        <path d="M -47 -17 L -47 -38 M -18 -20 L -18 -42 M 18 -20 L 18 -42 M 47 -17 L 47 -38"
          stroke="#65401f" strokeWidth="4" strokeLinecap="round" />
        <path d="M -48 -37 Q 0 -50 48 -37" stroke="#7f5128" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M -47 -39 Q 0 -51 47 -39" stroke="#d99a54" strokeWidth="1.4" fill="none" opacity="0.7" strokeLinecap="round" />
      </g>
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

function RoyalLantern({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="5" cy="5" rx="18" ry="5" fill="#243728" opacity="0.24" />
      <path d="M -10 3 L -7 -4 H 7 L 12 3 Z" fill="url(#royal-stone)" />
      <path d="M -4 -4 L -3 -39 H 4 L 7 -4 Z" fill="url(#royal-metal)" />
      <path d="M -12 -39 L -8 -61 H 9 L 13 -39 Z" fill="#33465b" />
      <path d="M -7 -42 L -5 -57 H 5 L 8 -42 Z" fill="url(#royal-lamp-glow)" />
      <path d="M -12 -61 L 0 -72 L 13 -61 Z" fill="url(#castle-roof-blue)" />
      <path d="M 0 -72 L 13 -61 H 4 Z" fill="#264f7c" opacity="0.7" />
      <path d="M -5 -55 L -3 -57" stroke="#fff" strokeWidth="2" opacity="0.65" strokeLinecap="round" />
    </g>
  )
}

function HeraldicShield({ x, y, s = 1, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="5" cy="5" rx="22" ry="5" fill="#263929" opacity="0.22" />
      <path d="M -3 3 V -42 H 3 V 3 Z" fill="url(#royal-metal)" />
      <path d="M -22 -43 Q 0 -53 22 -43 L 18 -16 Q 0 3 -18 -16 Z" fill="url(#royal-banner)" stroke="#e4c36b" strokeWidth="3" />
      <path d="M 2 -48 Q 21 -47 22 -43 L 18 -16 Q 9 -6 2 -2 Z" fill="#6f2f55" opacity="0.45" />
      <path d="M -11 -30 L -8 -40 L -2 -34 L 3 -42 L 8 -34 L 12 -40 L 10 -27 Z" fill="#f4cf62" />
      <path d="M -10 -26 H 10" stroke="#fff0a0" strokeWidth="3" />
    </g>
  )
}

function StoneBench({ x, y, s = 1, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="5" cy="8" rx="38" ry="7" fill="#263929" opacity="0.24" filter="url(#edge)" />
      <path d="M -33 -13 Q 0 -20 33 -13 L 30 -3 Q 0 -8 -30 -3 Z" fill="url(#royal-stone)" />
      <path d="M -28 -1 H 29 L 33 7 H -32 Z" fill="#a99d89" />
      <path d="M -24 6 L -20 17 H -12 L -11 5 M 22 5 L 23 17 H 31 L 29 5" fill="#8d806c" />
      <path d="M -27 -14 Q -2 -20 23 -15" stroke="#f7f0df" strokeWidth="2" opacity="0.52" fill="none" />
    </g>
  )
}

function CrownPlanter({ x, y, s = 1, c = '#f18aaf' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="4" cy="8" rx="22" ry="6" fill="#263929" opacity="0.22" />
      {[-12, -4, 5, 13].map((dx, i) => (
        <g key={dx} transform={`translate(${dx} ${-15 - (i % 2) * 5})`}>
          <path d="M 0 9 V -5" stroke="#397447" strokeWidth="2.4" />
          <circle cy="-7" r="6" fill={i % 2 ? '#f7d461' : c} />
          <circle cx="-2" cy="-9" r="2" fill="#fff" opacity="0.32" />
        </g>
      ))}
      <path d="M -20 -5 L -15 10 H 16 L 21 -5 L 12 0 L 5 -8 L -2 0 L -11 -8 Z" fill="url(#royal-planter)" />
      <path d="M 4 -7 L -2 0 L -11 -8 L -7 8 H 15 L 20 -4 L 12 0 Z" fill="#7e5c28" opacity="0.38" />
      <path d="M -14 6 H 15" stroke="#ffe39a" strokeWidth="2" opacity="0.55" />
    </g>
  )
}

function LegacyRoyalTreasure({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="3" cy="10" rx="72" ry="15" fill="#253528" opacity="0.3" filter="url(#edge)" />
      <ellipse className="pano-pulse" cx="0" cy="-35" rx="88" ry="76" fill="#ffe16b" opacity="0.16" filter="url(#soft)" />

      {/* Großer geöffneter Deckel klar hinter dem Inhalt. */}
      <path d="M -62 -37 L -58 -69 Q -50 -103 0 -107 Q 50 -103 58 -69 L 62 -37 Z"
        fill="url(#treasure-wood)" stroke="#4f2d1b" strokeWidth="5" />
      <path d="M -49 -42 L -46 -68 Q -38 -91 0 -94 Q 38 -91 46 -68 L 49 -42 Z" fill="#38252d" />
      <path d="M -58 -68 Q 0 -55 58 -68 M -50 -91 Q 0 -79 50 -91"
        stroke="url(#treasure-gold)" strokeWidth="6" fill="none" />
      <path d="M -43 -84 Q -26 -98 -5 -99" stroke="#eeb06b" strokeWidth="4" opacity="0.45" fill="none" strokeLinecap="round" />

      {/* Hoher, eindeutig sichtbarer Goldhaufen. */}
      <path d="M -55 -35 Q -40 -64 -20 -55 Q -4 -75 14 -56 Q 38 -68 56 -34 Z" fill="#d99e27" />
      {[-48, -36, -24, -12, 0, 12, 24, 36, 48].map((cx, i) => (
        <g key={cx} transform={`translate(${cx} ${-37 - (i % 3) * 8}) rotate(${i % 2 ? 9 : -7})`}>
          <ellipse rx="11" ry="5" fill="url(#treasure-gold)" stroke="#976718" strokeWidth="1.4" />
          <path d="M -6 -1 H 6" stroke="#fff3a5" strokeWidth="1.3" opacity="0.7" />
        </g>
      ))}

      {/* Drei große facettierte Diamanten ragen aus dem Gold. */}
      <g transform="translate(-25 -65)">
        <path d="M -14 0 L -7 -12 H 8 L 15 0 L 0 22 Z" fill="url(#diamond-blue)" stroke="#2f7fa2" strokeWidth="1.6" />
        <path d="M -14 0 H 15 M -7 -12 L 0 22 L 8 -12 M -14 0 L 0 -12 L 15 0" stroke="#e8fbff" strokeWidth="1" opacity="0.7" fill="none" />
      </g>
      <g transform="translate(12 -73) scale(1.18)">
        <path d="M -14 0 L -7 -12 H 8 L 15 0 L 0 22 Z" fill="url(#diamond-clear)" stroke="#6aa7c5" strokeWidth="1.6" />
        <path d="M -14 0 H 15 M -7 -12 L 0 22 L 8 -12 M -14 0 L 0 -12 L 15 0" stroke="#fff" strokeWidth="1" opacity="0.82" fill="none" />
      </g>
      <g transform="translate(39 -57) scale(.82)">
        <path d="M -14 0 L -7 -12 H 8 L 15 0 L 0 22 Z" fill="url(#diamond-pink)" stroke="#a84571" strokeWidth="1.6" />
        <path d="M -14 0 H 15 M -7 -12 L 0 22 L 8 -12 M -14 0 L 0 -12 L 15 0" stroke="#fff0f7" strokeWidth="1" opacity="0.72" fill="none" />
      </g>

      {/* Massiver rechteckiger Truhenkörper im Vordergrund. */}
      <path d="M -64 -38 H 64 L 58 14 Q 0 25 -58 14 Z" fill="url(#treasure-wood)" stroke="#4f2d1b" strokeWidth="5" />
      <path d="M 10 -38 H 64 L 58 14 Q 34 20 10 21 Z" fill="#542f20" opacity="0.48" />
      <path d="M -62 -29 H 62 M -60 3 Q 0 14 60 3" stroke="url(#treasure-gold)" strokeWidth="7" fill="none" />
      <path d="M -52 -22 V 8 M 52 -22 V 8" stroke="#f0c253" strokeWidth="5" opacity="0.9" />
      <path d="M -10 -35 H 10 L 13 -3 Q 0 9 -13 -3 Z" fill="url(#treasure-gold)" stroke="#815b18" strokeWidth="2" />
      <circle cx="0" cy="-15" r="4" fill="#51371f" />
      <path d="M 0 -11 V -5" stroke="#51371f" strokeWidth="3" strokeLinecap="round" />
      <path d="M -54 -34 Q -25 -27 1 -30" stroke="#f3b875" strokeWidth="3" opacity="0.5" fill="none" />

      {[-70, -56, 56, 70].map((mx, i) => (
        <ellipse key={mx} cx={mx} cy={10 + (i % 2) * 5} rx="10" ry="4.5" fill="url(#treasure-gold)" stroke="#946619" strokeWidth="1.2" />
      ))}
      <Star x={-55} y={-74} s={0.8} o={0.9} />
      <Star x={53} y={-59} s={0.66} o={0.85} />
    </g>
  )
}

function RoyalTreasure({ x, y, s = 1 }) {
  const coins = [
    [-30, -32, -8], [-17, -37, 7], [-3, -34, -5], [12, -39, 9], [27, -33, -6]
  ]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="5" cy="9" rx="50" ry="10" fill="#263629" opacity="0.27" filter="url(#edge)" />

      {/* Geöffneter Deckel: einfache, kräftige Silhouette. */}
      <path d="M -45 -31 L -43 -55 Q -38 -78 0 -82 Q 38 -78 43 -55 L 45 -31 Z"
        fill="url(#treasure-wood)" stroke="#55321f" strokeWidth="4" />
      <path d="M -36 -34 L -34 -54 Q -28 -68 0 -71 Q 28 -68 34 -54 L 36 -34 Z" fill="#3c2930" />
      <path d="M -43 -54 Q 0 -45 43 -54" stroke="url(#treasure-gold)" strokeWidth="5" fill="none" />
      <path d="M -34 -67 Q -19 -77 -2 -77" stroke="#efb16e" strokeWidth="3" opacity="0.42" fill="none" strokeLinecap="round" />

      {/* Wenige Münzen bleiben auch in kleiner Darstellung klar lesbar. */}
      {coins.map(([cx, cy, rot]) => (
        <g key={cx} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
          <ellipse rx="9" ry="4" fill="url(#treasure-gold)" stroke="#98691c" strokeWidth="1.2" />
          <path d="M -4 -1 H 4" stroke="#fff0a0" strokeWidth="1" opacity="0.7" />
        </g>
      ))}

      {/* Zwei große Diamanten statt vieler kleiner, unruhiger Edelsteine. */}
      <g transform="translate(-14 -53) scale(.82)">
        <path d="M -12 0 L -6 -10 H 7 L 13 0 L 0 19 Z" fill="url(#diamond-clear)" stroke="#5795b6" strokeWidth="1.5" />
        <path d="M -12 0 H 13 M -6 -10 L 0 19 L 7 -10" stroke="#fff" strokeWidth="1" opacity="0.75" fill="none" />
      </g>
      <g transform="translate(18 -49) scale(.72)">
        <path d="M -12 0 L -6 -10 H 7 L 13 0 L 0 19 Z" fill="url(#diamond-blue)" stroke="#2d789c" strokeWidth="1.5" />
        <path d="M -12 0 H 13 M -6 -10 L 0 19 L 7 -10" stroke="#ecfdff" strokeWidth="1" opacity="0.7" fill="none" />
      </g>

      {/* Kompakter Truhenkörper mit drei klaren Goldbeschlägen. */}
      <path d="M -47 -31 H 47 L 43 10 Q 0 18 -43 10 Z" fill="url(#treasure-wood)" stroke="#55321f" strokeWidth="4" />
      <path d="M 8 -31 H 47 L 43 10 Q 25 14 8 15 Z" fill="#583321" opacity="0.4" />
      <path d="M -45 -23 H 45 M -44 3 Q 0 11 44 3" stroke="url(#treasure-gold)" strokeWidth="5" fill="none" />
      <path d="M -38 -22 V 7 M 38 -22 V 7" stroke="#d8aa3c" strokeWidth="4" />
      <path d="M -8 -28 H 8 L 10 -4 Q 0 5 -10 -4 Z" fill="url(#treasure-gold)" stroke="#80591a" strokeWidth="1.8" />
      <circle cx="0" cy="-13" r="3" fill="#50351f" />
      <path d="M -38 -27 Q -18 -22 0 -24" stroke="#f0b372" strokeWidth="2.5" opacity="0.45" fill="none" />

      <ellipse cx="-48" cy="9" rx="8" ry="3.5" fill="#e4b23b" stroke="#97691c" strokeWidth="1" />
      <ellipse cx="51" cy="11" rx="8" ry="3.5" fill="#e4b23b" stroke="#97691c" strokeWidth="1" />
      <Star x={37} y={-56} s={0.48} o={0.72} />
    </g>
  )
}

function CastleApproach({ x, y, s = 1, path = true, greenery = true }) {
  const bushes = [
    [-48, 27, 0.66], [48, 27, 0.66],
    [-63, 54, 0.78], [63, 54, 0.78],
    [-82, 84, 0.92], [82, 84, 0.92]
  ]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {path && (
        <g>
          {/* Perspektivisch breiter werdender Kiesweg vom Tor zum Hauptpfad. */}
          <path d="M -22 0 L 22 0 C 30 28 42 58 58 101 L -58 101 C -42 58 -30 28 -22 0 Z"
            fill="url(#castle-approach)" />
          <path d="M -19 3 C -28 37 -39 69 -50 96 M 19 3 C 28 37 39 69 50 96"
            stroke="#fff0ce" strokeWidth="3" opacity="0.6" fill="none" strokeLinecap="round" />
          <path d="M -30 35 Q 0 39 30 35 M -43 68 Q 0 73 43 68"
            stroke="#a99270" strokeWidth="1.4" opacity="0.35" fill="none" />
        </g>
      )}
      {greenery && bushes.map(([bx, by, bs], i) => (
        <g key={`${bx}-${by}`} transform={`translate(${bx} ${by}) scale(${bs})`}>
          <ellipse cx="5" cy="11" rx="24" ry="7" fill="#203b29" opacity="0.25" filter="url(#edge)" />
          <path d="M -23 6 C -27 -8 -17 -23 -3 -25 C 10 -31 25 -20 25 -5 C 28 9 14 16 -1 16 C -15 16 -24 12 -23 6 Z"
            fill="url(#royal-bush)" />
          <path d="M 5 -27 C 21 -23 28 -9 25 3 C 23 13 12 17 2 16 C 10 3 12 -12 5 -27 Z"
            fill="#245c38" opacity="0.48" filter="url(#edge)" />
          <path d="M -15 -12 Q -7 -23 4 -23" stroke="#c5e69b" strokeWidth="3.5" opacity="0.46" fill="none" strokeLinecap="round" />
          {i % 2 === 0 && <circle cx="-9" cy="-2" r="2" fill="#eef6c8" opacity="0.5" />}
        </g>
      ))}
    </g>
  )
}

// Naturstein-Schloss: unregelmäßige Silhouette, klare Lichtquelle links oben
// und materialabhängige Schatten statt flacher Farbblöcke.
function Castle({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="13" cy="16" rx="214" ry="25" fill="#263827" opacity="0.27" filter="url(#edge)" />
      <path d="M -205 -5 Q 0 -20 205 -5 L 194 20 Q 0 33 -194 20 Z" fill="url(#castle-terrace)" />
      <path d="M -196 9 Q 0 23 196 9" stroke="#8f7e68" strokeWidth="3" fill="none" opacity="0.68" />
      {[-130, 130].map((tx) => (
        <g key={tx} transform={`translate(${tx} 0)`}>
          <path d="M -33 0 L -31 -149 Q 0 -157 32 -149 L 34 0 Z" fill="url(#castle-stone)" />
          <path d="M 8 -154 Q 22 -153 32 -149 L 34 0 L 9 0 Z" fill="#a99982" opacity="0.56" filter="url(#edge)" />
          <path d="M -42 -148 L 0 -230 L 42 -148 Q 0 -158 -42 -148 Z" fill="url(#castle-roof-blue)" />
          <path d="M 0 -230 L 42 -148 L 8 -153 Z" fill="#264f7c" opacity="0.62" />
          {/* Dachschindeln folgen perspektivisch der steilen Dachfläche. */}
          <path d="M -29 -165 L 0 -222 L 29 -165 M -21 -181 Q 0 -187 21 -181 M -13 -199 Q 0 -203 13 -199"
            stroke="#b9ddef" strokeWidth="1.25" opacity="0.42" fill="none" />
          <path d="M -39 -148 Q 0 -157 39 -148" stroke="#183e67" strokeWidth="4" opacity="0.5" fill="none" />
          <path d="M -29 -153 Q 0 -164 29 -153" stroke="#d9eef6" strokeWidth="3" opacity="0.55" fill="none" />
          <rect x="-2" y="-258" width="3" height="28" fill="#8a5a35" />
          <path d="M 1 -258 L 26 -250 L 1 -242 Z" fill="#ff5c5c" />
          <path d="M -15 -112 Q -6 -130 3 -112 V -92 H -15 Z" fill="url(#castle-glass)" stroke="#766d62" strokeWidth="3" />
          <path d="M -17 -114 Q -6 -134 5 -114" stroke="#514b45" strokeWidth="2" fill="none" opacity="0.55" />
          <path d="M -6 -127 V -94 M -14 -108 H 2" stroke="#eaf8fb" strokeWidth="1.2" opacity="0.7" />
          <path d="M -16 -50 Q -2 -74 12 -50 V -13 H -16 Z" fill="url(#castle-door)" stroke="#543724" strokeWidth="3" />
          <path d="M -26 -82 H 27 M -27 -32 H 31" stroke="#aa9a82" strokeWidth="1.5" opacity="0.5" />
          <path d="M -27 -137 H 26 M -27 -107 H 27 M -28 -67 H 28 M -29 -17 H 31"
            stroke="#95856f" strokeWidth="1" opacity="0.34" />
          <path d="M -12 -137 V -123 M 14 -137 V -123 M -18 -82 V -68 M 10 -82 V -68"
            stroke="#95856f" strokeWidth="1" opacity="0.25" />
          <path d="M -27 -143 Q -24 -68 -27 -6" stroke="#fffdf2" strokeWidth="2.2" opacity="0.34" fill="none" />
        </g>
      ))}
      <path d="M -142 0 L -141 -96 Q 0 -104 141 -96 L 142 0 Z" fill="url(#castle-stone)" />
      <path d="M 58 -99 Q 104 -100 141 -96 L 142 0 H 58 Z" fill="#aa9a82" opacity="0.44" filter="url(#edge)" />
      {[-120, -80, -40, 0, 40, 80].map((bx) => (
        <path key={bx} d={`M ${bx} -96 V -111 H ${bx + 24} V -97 Z`} fill="url(#castle-stone)" />
      ))}
      <path d="M -141 -94 Q 0 -102 141 -94" stroke="#756b5d" strokeWidth="4" opacity="0.32" fill="none" />
      {/* versetzte Steinlagen, Strebepfeiler und verwitterte Stellen */}
      <path d="M -137 -76 H 137 M -138 -49 H 138 M -140 -23 H 140" stroke="#a9977e" strokeWidth="1.5" opacity="0.48" />
      {[-108, 108].map((px) => <path key={px} d={`M ${px - 9} 0 L ${px - 5} -92 H ${px + 7} L ${px + 13} 0 Z`} fill="#d8cbb5" opacity="0.72" />)}
      <path d="M -126 -69 l 19 -2 M 68 -37 l 22 1 M -76 -20 l 15 -2" stroke="#8f806c" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
      {/* Schmale Schießscharten liegen tief in der Mauer und werfen eine
          kleine Schattenkante nach rechts unten. */}
      {[-72, 72].map((wx) => (
        <g key={wx} transform={`translate(${wx} -55)`}>
          <path d="M -6 13 V -8 Q 0 -16 6 -8 V 13 Z" fill="#655f59" opacity="0.7" />
          <path d="M -3 10 V -7 Q 0 -11 3 -7 V 10 Z" fill="url(#castle-glass)" />
          <path d="M -2 -7 V 8" stroke="#e8f8fb" strokeWidth="1" opacity="0.48" />
        </g>
      ))}
      {/* Die Seitentürme werden nach der verbindenden Mittelmauer nochmals
          in der Vordergrundebene aufgebaut. So liegen ihre kompletten
          Baukörper sichtbar vor der Mauer; der Hauptturm folgt danach. */}
      {[-130, 130].map((tx) => (
        <g key={`front-${tx}`} transform={`translate(${tx} 0)`}>
          <path d="M -33 0 L -31 -149 Q 0 -157 32 -149 L 34 0 Z" fill="url(#castle-stone)" />
          <path d="M 8 -154 Q 22 -153 32 -149 L 34 0 L 9 0 Z" fill="#a99982" opacity="0.56" filter="url(#edge)" />
          <path d="M -42 -148 L 0 -230 L 42 -148 Q 0 -158 -42 -148 Z" fill="url(#castle-roof-blue)" />
          <path d="M 0 -230 L 42 -148 L 8 -153 Z" fill="#264f7c" opacity="0.62" />
          <path d="M -29 -165 L 0 -222 L 29 -165 M -21 -181 Q 0 -187 21 -181 M -13 -199 Q 0 -203 13 -199"
            stroke="#b9ddef" strokeWidth="1.25" opacity="0.42" fill="none" />
          <path d="M -39 -148 Q 0 -157 39 -148" stroke="#183e67" strokeWidth="4" opacity="0.5" fill="none" />
          <path d="M -29 -153 Q 0 -164 29 -153" stroke="#d9eef6" strokeWidth="3" opacity="0.55" fill="none" />
          <rect x="-2" y="-258" width="3" height="28" fill="#8a5a35" />
          <path d="M 1 -258 L 26 -250 L 1 -242 Z" fill="#ff5c5c" />
          <path d="M -15 -112 Q -6 -130 3 -112 V -92 H -15 Z" fill="url(#castle-glass)" stroke="#766d62" strokeWidth="3" />
          <path d="M -17 -114 Q -6 -134 5 -114" stroke="#514b45" strokeWidth="2" fill="none" opacity="0.55" />
          <path d="M -6 -127 V -94 M -14 -108 H 2" stroke="#eaf8fb" strokeWidth="1.2" opacity="0.7" />
          <path d="M -16 -50 Q -2 -74 12 -50 V -13 H -16 Z" fill="url(#castle-door)" stroke="#543724" strokeWidth="3" />
          <path d="M -26 -82 H 27 M -27 -32 H 31" stroke="#aa9a82" strokeWidth="1.5" opacity="0.5" />
          <path d="M -27 -137 H 26 M -27 -107 H 27 M -28 -67 H 28 M -29 -17 H 31" stroke="#95856f" strokeWidth="1" opacity="0.34" />
          <path d="M -12 -137 V -123 M 14 -137 V -123 M -18 -82 V -68 M 10 -82 V -68" stroke="#95856f" strokeWidth="1" opacity="0.25" />
          <path d="M -27 -143 Q -24 -68 -27 -6" stroke="#fffdf2" strokeWidth="2.2" opacity="0.34" fill="none" />
          <path d="M -27 -78 Q 0 -64 27 -78" stroke="#6d5846" strokeWidth="1.5" fill="none" opacity="0.78" />
          {[
            [-20, -74, '#d95762'], [-10, -69, '#f0b94f'], [0, -67, '#4f91bd'],
            [10, -69, '#a55f98'], [20, -74, '#d95762']
          ].map(([px, py, c], i) => (
            <g key={`tower-pennant-${i}`} transform={`translate(${px} ${py})`}>
              <path d="M -4 0 L 5 0 L 1 11 Z" fill={c} />
              <path d="M 1 0 L 5 0 L 1 11 Z" fill="#4b3544" opacity="0.22" />
              <path d="M -3 1 H 3" stroke="#fff" strokeWidth="0.8" opacity="0.35" />
            </g>
          ))}
        </g>
      ))}
      {/* Der komplette Hauptturm steht minimal höher; alle zugehörigen
          Details bewegen sich als eine gemeinsame Baugruppe. */}
      <g transform="translate(0 -8)">
      <path d="M -48 -90 L -47 -205 Q 0 -214 47 -205 L 48 -90 Z" fill="url(#castle-stone-light)" />
      <path d="M 14 -210 Q 34 -209 47 -205 L 48 -90 H 14 Z" fill="#b5a38a" opacity="0.56" filter="url(#edge)" />
      {/* Steinlagen und versetzte Stoßfugen wie an den Seitentürmen. */}
      <path d="M -45 -184 Q 0 -188 45 -184 M -46 -157 H 46 M -47 -129 H 47 M -47 -103 H 47"
        stroke="#9f8f78" strokeWidth="1.25" opacity="0.42" fill="none" />
      <path d="M -22 -184 V -170 M 9 -184 V -170 M -34 -157 V -143 M 23 -157 V -143
               M -16 -129 V -116 M 31 -129 V -116 M -32 -103 V -92 M 5 -103 V -92"
        stroke="#95856f" strokeWidth="1.05" opacity="0.3" />
      {/* Sonnenkante links und kleine unregelmäßige Verwitterungsspuren. */}
      <path d="M -42 -198 Q -45 -150 -43 -98" stroke="#fffdf2" strokeWidth="2.5" opacity="0.36" fill="none" strokeLinecap="round" />
      <path d="M -37 -146 l 12 -2 M 18 -188 l 16 1 M 22 -112 l 13 -2 M -31 -95 l 10 1"
        stroke="#857662" strokeWidth="1.8" opacity="0.34" strokeLinecap="round" />
      <path d="M -60 -204 L 0 -302 L 60 -204 Q 0 -216 -60 -204 Z" fill="url(#castle-roof-red)" />
      <path d="M 0 -302 L 60 -204 L 12 -210 Z" fill="#87343b" opacity="0.62" />
      {/* feine Dachziegel folgen der Dachneigung */}
      <path d="M -42 -217 Q 0 -229 42 -217 M -33 -235 Q 0 -244 33 -235 M -22 -254 Q 0 -261 22 -254" stroke="#ffd1bd" strokeWidth="1.4" opacity="0.42" fill="none" />
      <path d="M -57 -204 Q 0 -215 57 -204" stroke="#642a32" strokeWidth="5" opacity="0.5" fill="none" />
      <path d="M -45 -215 L 0 -294" stroke="#fff0df" strokeWidth="3" opacity="0.22" strokeLinecap="round" />
      <rect x="-2" y="-334" width="3" height="32" fill="#8a5a35" />
      <path d="M 1 -334 L 30 -325 L 1 -316 Z" fill="#ffd93d" />
      <path d="M -14 -174 Q 0 -199 14 -174 V -146 H -14 Z" fill="url(#castle-glass)" stroke="#766d62" strokeWidth="3" />
      <path d="M 0 -195 V -148 M -13 -171 H 13" stroke="#edfaff" strokeWidth="1.3" opacity="0.7" />
      <circle cx="0" cy="-122" r="11" fill="#fff" stroke="#b8a888" strokeWidth="2.5" />
      <path d="M 0 -122 L 0 -129 M 0 -122 L 5 -119" stroke="#5a4632" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Dieselbe Verbindungsmauer wird im zentralen Ausschnitt vor den
          Hauptturm gelegt. Kontur und Höhe bleiben exakt unverändert. */}
      <g clipPath="url(#castle-center-wall-clip)">
        <path d="M -142 0 L -141 -96 Q 0 -104 141 -96 L 142 0 Z" fill="url(#castle-stone)" />
        <path d="M 58 -99 Q 104 -100 141 -96 L 142 0 H 58 Z" fill="#aa9a82" opacity="0.44" filter="url(#edge)" />
        {[-120, -80, -40, 0, 40, 80].map((bx) => (
          <path key={`center-wall-${bx}`} d={`M ${bx} -96 V -111 H ${bx + 24} V -97 Z`} fill="url(#castle-stone)" />
        ))}
        <path d="M -141 -94 Q 0 -102 141 -94" stroke="#756b5d" strokeWidth="4" opacity="0.32" fill="none" />
        <path d="M -137 -76 H 137 M -138 -49 H 138 M -140 -23 H 140" stroke="#a9977e" strokeWidth="1.5" opacity="0.48" />
      </g>
      <path d="M -33 0 V -47 Q 0 -82 33 -47 V 0 Z" fill="url(#castle-door)" stroke="#543724" strokeWidth="5" />
      <path d="M 0 -50 L 0 0" stroke="#6e4527" strokeWidth="3" />
      <path d="M -25 -42 Q 0 -68 25 -42" stroke="#d19a61" strokeWidth="2" opacity="0.45" fill="none" />
      <path d="M -24 -8 V -41 M -12 -2 V -54 M 12 -2 V -54 M 24 -8 V -41" stroke="#4a2f20" strokeWidth="1.4" opacity="0.55" />
      <path d="M -28 -32 H 28 M -31 -14 H 31" stroke="#39271d" strokeWidth="2.4" opacity="0.55" />
      {[-20, -10, 10, 20].map((nx) => <circle key={nx} cx={nx} cy="-24" r="1.6" fill="#bd8e52" opacity="0.7" />)}
      {/* Vorderste Ebene: Die Kette hängt sichtbar vor Mauer und Tor. */}
      <path d="M -82 -87 Q 0 -70 82 -87" stroke="#6d5846" strokeWidth="1.7" fill="none" opacity="0.8" />
      {[
        [-70, -83, '#4f91bd'], [-48, -78, '#f0b94f'], [-25, -74, '#d95762'],
        [0, -72, '#a55f98'], [25, -74, '#4f91bd'], [48, -78, '#f0b94f'], [70, -83, '#d95762']
      ].map(([px, py, c], i) => (
        <g key={`gate-pennant-${i}`} transform={`translate(${px} ${py})`}>
          <path d="M -4.5 0 L 5 0 L 1 12 Z" fill={c} />
          <path d="M 1 0 L 5 0 L 1 12 Z" fill="#4b3544" opacity="0.22" />
          <path d="M -3.5 1 H 3.5" stroke="#fff" strokeWidth="0.8" opacity="0.38" />
        </g>
      ))}
      <path d="M -31 0 H 31 L 48 23 H -48 Z" fill="url(#castle-steps)" />
      <path d="M -34 5 H 34 M -40 13 H 40" stroke="#f4ecdc" strokeWidth="2" opacity="0.68" />
      <path d="M 0 2 L 43 20 L 48 23 H 2 Z" fill="#75634f" opacity="0.2" filter="url(#edge)" />
    </g>
  )
}

// Kleine Sternwarte als Wahrzeichen der Nachtwelt. Die helle Mondkante liegt
// konsequent links oben, alle rechten Flächen sind kühler und dunkler.
function Observatory({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="9" rx="92" ry="15" fill="#071127" opacity="0.48" filter="url(#edge)" />
      <ellipse cx="-12" cy="4" rx="76" ry="10" fill="#9ec8e8" opacity="0.12" filter="url(#soft)" />

      {/* gemauerter Sockel mit runder, statt kastenförmiger Silhouette */}
      <path d="M -54 4 L -48 -82 Q 0 -105 48 -82 L 54 4 Z" fill="url(#observatory-wall)" />
      <path d="M 8 -96 Q 48 -91 48 -82 L 54 4 L 9 4 Z" fill="#17284b" opacity="0.6" filter="url(#edge)" />
      <path d="M -43 -71 Q -8 -88 29 -77" stroke="#b9d5e8" strokeWidth="3" opacity="0.28" fill="none" />
      {[[-36, -54], [-10, -64], [20, -52], [38, -27], [-27, -21], [2, -32]].map(([bx, by], i) => (
        <path key={i} d={`M ${bx - 9} ${by} Q ${bx} ${by - 3} ${bx + 9} ${by}`} stroke="#829ab2" strokeWidth="2" opacity="0.22" fill="none" />
      ))}

      {/* Kuppel mit segmentierter Metallhaut und kräftigem Mondreflex */}
      <path d="M -58 -78 Q -46 -137 0 -143 Q 47 -137 58 -78 Z" fill="url(#observatory-dome)" />
      <path d="M 2 -142 Q 45 -134 58 -78 L 7 -78 Z" fill="#172b55" opacity="0.58" filter="url(#edge)" />
      <path d="M -43 -91 Q -32 -126 -4 -134" stroke="#dff4ff" strokeWidth="5" opacity="0.48" fill="none" strokeLinecap="round" filter="url(#edge)" />
      <path d="M -58 -78 L 58 -78" stroke="#0c1934" strokeWidth="7" />
      <path d="M -51 -81 L 51 -81" stroke="#8cb3d2" strokeWidth="2" opacity="0.65" />
      <path d="M 0 -142 L 0 -80 M -34 -121 Q -17 -102 -16 -80 M 34 -121 Q 17 -102 16 -80" stroke="#0e1d3c" strokeWidth="2" opacity="0.55" fill="none" />

      {/* geöffnetes Beobachtungsfenster und Teleskop */}
      <path d="M -8 -143 Q 6 -148 19 -140 L 10 -82 L -4 -82 Z" fill="#081124" />
      <g transform="translate(3 -119) rotate(-32)">
        <rect x="-7" y="-49" width="14" height="65" rx="6" fill="url(#telescope-grad)" />
        <rect x="-10" y="-53" width="20" height="12" rx="4" fill="#a9c8dc" />
        <path d="M -6 -48 L -6 8" stroke="#e6f6ff" strokeWidth="2" opacity="0.46" />
        <circle cx="0" cy="-48" r="5" fill="#bcecff" opacity="0.8" />
      </g>

      {/* warme Tür schafft einen gut lesbaren Mittelpunkt im dunklen Boden */}
      <path d="M -17 4 L -17 -39 Q 0 -56 17 -39 L 17 4 Z" fill="#091329" stroke="#728ba6" strokeWidth="3" />
      <path d="M -11 4 L -11 -35 Q 0 -46 11 -35 L 11 4 Z" fill="url(#door-glow)" />
      <circle cx="7" cy="-16" r="1.8" fill="#fff2a8" />
      <path d="M -26 5 L 26 5" stroke="#b3cbe0" strokeWidth="3" opacity="0.48" />
    </g>
  )
}

function MoonRock({ x, y, s = 1, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="2" cy="4" rx="31" ry="7" fill="#061020" opacity="0.38" />
      <path d="M -30 2 Q -25 -22 -9 -29 Q 8 -34 28 -9 L 31 3 Z" fill="url(#moon-rock)" />
      <path d="M 4 -30 Q 21 -25 28 -9 L 31 3 L 8 2 Q 15 -10 4 -30 Z" fill="#243b61" opacity="0.62" filter="url(#edge)" />
      <path d="M -20 -10 Q -11 -22 -2 -24" stroke="#d4e9f5" strokeWidth="3" opacity="0.35" fill="none" strokeLinecap="round" />
      <path d="M -12 -8 L -2 -13 L 7 -9 M 10 -18 L 18 -11" stroke="#101f3c" strokeWidth="2" opacity="0.5" fill="none" />
    </g>
  )
}

function ShootingStar({ x, y, s = 1, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* breiter Lichtschleier und darin ein schmaler, heller Meteor-Schweif */}
      <path d="M 2 1 C 31 3 67 11 111 26 C 72 18 36 14 0 8 Z" fill="url(#shooting-tail-glow)" filter="url(#soft)" opacity="0.55" />
      <path d="M 2 1 C 34 5 70 13 111 26 C 68 20 31 14 0 8 Z" fill="url(#shooting-tail)" />
      <path d="M 4 4 C 35 7 66 14 94 22" stroke="#fff" strokeWidth="2.2" opacity="0.84" fill="none" strokeLinecap="round" />

      {/* glühender Kopf mit kleiner, unregelmäßiger Sternform */}
      <circle cx="0" cy="4" r="14" fill="#dff5ff" opacity="0.25" filter="url(#soft)" />
      <path d="M 0 -5 L 2.5 1.3 L 9 4 L 2.7 6.4 L 0 13 L -2.5 6.5 L -8 4 L -2.4 1.4 Z" fill="#fffdf0" />
      <circle cx="-1.5" cy="2.5" r="2.2" fill="#fff" />

      {/* kleine glühende Splitter lösen sich vom Schweif */}
      <circle cx="42" cy="17" r="1.5" fill="#d8efff" opacity="0.72" />
      <circle cx="62" cy="7" r="1.1" fill="#fff7c7" opacity="0.58" />
      <circle cx="78" cy="24" r="0.9" fill="#c7e4ff" opacity="0.48" />
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
        <clipPath id="castle-center-wall-clip">
          <rect x="-96" y="-114" width="192" height="116" />
        </clipPath>
        {/* weichzeichnet Schatten-Overlays, damit Kanten nicht hart wirken */}
        <filter id="edge" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        {/* Sehr kleine Weichzeichnung nur für Palmadern und Stammstruktur. */}
        <filter id="palm-detail-soft" x="-12%" y="-12%" width="124%" height="124%">
          <feGaussianBlur stdDeviation="0.28" />
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
          <stop offset="0.58" stopColor="#8fd3ff" />
          <stop offset="0.61" stopColor="#718fbd" />
          <stop offset="0.64" stopColor="#465f96" />
          <stop offset="0.67" stopColor="#203968" />
          <stop offset="0.70" stopColor="#0f2049" />
          <stop offset="0.76" stopColor="#0f2049" />
          <stop offset="0.78" stopColor="#263d70" />
          <stop offset="0.80" stopColor="#607fb5" />
          <stop offset="0.82" stopColor="#9bbcdf" />
          <stop offset="0.84" stopColor="#c3deef" />
          <stop offset="0.86" stopColor="#d5eaf4" />
          <stop offset="0.90" stopColor="#cbe7f4" />
          <stop offset="0.95" stopColor="#e8ddf1" />
          <stop offset="0.98" stopColor="#ffe2cf" />
          <stop offset="1.00" stopColor="#fff0c7" />
        </linearGradient>
        <linearGradient id="castle-cirrus" gradientUnits="userSpaceOnUse" x1="5050" y1="80" x2="6040" y2="235">
          <stop offset="0" stopColor="#d8efff" stopOpacity="0" />
          <stop offset="0.25" stopColor="#f8e8f2" stopOpacity="0.4" />
          <stop offset="0.62" stopColor="#ffd6c7" stopOpacity="0.46" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* Gerader Sonnenaufgangs-Verlauf ohne radiale Kontur. */}
        <linearGradient id="castle-sunrise-wash" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="440">
          <stop offset="0" stopColor="#91c9ec" stopOpacity="0.46" />
          <stop offset="0.28" stopColor="#c9b9e9" stopOpacity="0.58" />
          <stop offset="0.56" stopColor="#f3abc2" stopOpacity="0.66" />
          <stop offset="0.78" stopColor="#ffbe9e" stopOpacity="0.72" />
          <stop offset="1" stopColor="#ffe39b" stopOpacity="0.78" />
        </linearGradient>
        <linearGradient id="castle-sunrise-side-fade" gradientUnits="userSpaceOnUse" x1="4740" y1="0" x2="6000" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="0.34" stopColor="#fff" stopOpacity="0.78" />
          <stop offset="0.48" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="castle-sunrise-mask" maskUnits="userSpaceOnUse" x="4740" y="0" width="1260" height="450">
          <rect x="4740" y="0" width="1260" height="450" fill="url(#castle-sunrise-side-fade)" />
        </mask>
        <radialGradient id="observatory-wall" cx="0.22" cy="0.12" r="0.95">
          <stop offset="0" stopColor="#9ab8cd" />
          <stop offset="0.5" stopColor="#536d8b" />
          <stop offset="1" stopColor="#263a5d" />
        </radialGradient>
        <linearGradient id="observatory-dome" x1="0.12" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#b5d4e6" />
          <stop offset="0.38" stopColor="#6688a9" />
          <stop offset="1" stopColor="#243d69" />
        </linearGradient>
        <linearGradient id="telescope-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d6e7ef" /><stop offset="0.45" stopColor="#6f91aa" /><stop offset="1" stopColor="#2b4561" />
        </linearGradient>
        <radialGradient id="door-glow" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fff7bd" /><stop offset="0.45" stopColor="#ffd766" /><stop offset="1" stopColor="#d8882e" />
        </radialGradient>
        <linearGradient id="moon-rock" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#819bb3" /><stop offset="0.5" stopColor="#4d6785" /><stop offset="1" stopColor="#243956" />
        </linearGradient>
        <linearGradient id="shooting-tail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.96" />
          <stop offset="0.28" stopColor="#dff4ff" stopOpacity="0.72" />
          <stop offset="0.7" stopColor="#9fc9ff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#9fc9ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="shooting-tail-glow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9f8ff" stopOpacity="0.72" />
          <stop offset="1" stopColor="#8abfff" stopOpacity="0" />
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
          <stop offset="0.84" stopColor="#152548" />
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
          <stop offset="0.84" stopColor="#0e1a36" />
          <stop offset="0.90" stopColor="#4f8f45" />
          <stop offset="1.00" stopColor="#66b053" />
        </linearGradient>
        <linearGradient id="pan-wasser" gradientUnits="userSpaceOnUse" x1="3200" y1="375" x2="3820" y2="440">
          <stop offset="0" stopColor="#70d2ee" />
          <stop offset="0.42" stopColor="#3aadd9" />
          <stop offset="0.78" stopColor="#2388bd" />
          <stop offset="1" stopColor="#176895" />
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
        <linearGradient id="palm-leaf-grad" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#76c96d" />
          <stop offset="0.45" stopColor="#3f9c53" />
          <stop offset="1" stopColor="#226b42" />
        </linearGradient>
        <radialGradient id="coconut-grad" cx="0.3" cy="0.25" r="0.8">
          <stop offset="0" stopColor="#b98752" />
          <stop offset="0.55" stopColor="#81512f" />
          <stop offset="1" stopColor="#4e3020" />
        </radialGradient>
        <linearGradient id="sandcastle-grad" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f5d79d" />
          <stop offset="0.55" stopColor="#dfb675" />
          <stop offset="1" stopColor="#bd874c" />
        </linearGradient>
        <linearGradient id="bucket-grad" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#83c9ee" />
          <stop offset="0.6" stopColor="#4f9fd1" />
          <stop offset="1" stopColor="#2e769f" />
        </linearGradient>
        <linearGradient id="fish-grad" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#92e0ed" />
          <stop offset="0.48" stopColor="#48b6db" />
          <stop offset="1" stopColor="#1d79ad" />
        </linearGradient>
        <linearGradient id="swim-ring-grad" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#ffb076" />
          <stop offset="0.42" stopColor="#ff7164" />
          <stop offset="1" stopColor="#dc4651" />
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
        <linearGradient id="mountain-stream-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8edcf1" />
          <stop offset="0.48" stopColor="#3d9bc1" />
          <stop offset="1" stopColor="#176b94" />
        </linearGradient>
        <linearGradient id="goat-grad" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f4efe4" />
          <stop offset="0.55" stopColor="#d9d0bc" />
          <stop offset="1" stopColor="#b8a888" />
        </linearGradient>
        <linearGradient id="castle-stone" x1="0.08" y1="0" x2="0.92" y2="1">
          <stop offset="0" stopColor="#fff9eb" /><stop offset="0.46" stopColor="#e5dac5" /><stop offset="1" stopColor="#ad9c83" />
        </linearGradient>
        <linearGradient id="castle-stone-light" x1="0.08" y1="0" x2="0.92" y2="1">
          <stop offset="0" stopColor="#fffdf3" /><stop offset="0.5" stopColor="#eee3cf" /><stop offset="1" stopColor="#b7a58a" />
        </linearGradient>
        <linearGradient id="castle-roof-blue" x1="0.12" y1="0" x2="0.88" y2="1">
          <stop offset="0" stopColor="#88c8e9" /><stop offset="0.48" stopColor="#438bbd" /><stop offset="1" stopColor="#264f7c" />
        </linearGradient>
        <linearGradient id="castle-roof-red" x1="0.12" y1="0" x2="0.88" y2="1">
          <stop offset="0" stopColor="#ff9384" /><stop offset="0.48" stopColor="#cf5053" /><stop offset="1" stopColor="#87343b" />
        </linearGradient>
        <radialGradient id="castle-glass" cx="0.28" cy="0.2" r="0.9">
          <stop offset="0" stopColor="#f2fdff" /><stop offset="0.45" stopColor="#76c7e2" /><stop offset="1" stopColor="#356f9c" />
        </radialGradient>
        <linearGradient id="castle-door" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a87545" /><stop offset="0.52" stopColor="#795032" /><stop offset="1" stopColor="#49301f" />
        </linearGradient>
        <linearGradient id="castle-terrace" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#eee4cf" /><stop offset="0.55" stopColor="#c6b79c" /><stop offset="1" stopColor="#918069" />
        </linearGradient>
        <linearGradient id="castle-steps" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eee4d1" /><stop offset="1" stopColor="#aa987c" />
        </linearGradient>
        <linearGradient id="royal-stone" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#eee9db" /><stop offset="0.55" stopColor="#bdb4a3" /><stop offset="1" stopColor="#817767" />
        </linearGradient>
        <linearGradient id="royal-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8c9cad" /><stop offset="0.45" stopColor="#526474" /><stop offset="1" stopColor="#293a49" />
        </linearGradient>
        <radialGradient id="royal-lamp-glow" cx="0.3" cy="0.25" r="0.85">
          <stop offset="0" stopColor="#fffbd2" /><stop offset="0.48" stopColor="#ffd86d" /><stop offset="1" stopColor="#dc8d35" />
        </radialGradient>
        <linearGradient id="royal-banner" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#bf648d" /><stop offset="0.52" stopColor="#93456f" /><stop offset="1" stopColor="#642b50" />
        </linearGradient>
        <linearGradient id="royal-planter" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffe28a" /><stop offset="0.5" stopColor="#c99a3f" /><stop offset="1" stopColor="#7e5c28" />
        </linearGradient>
        <linearGradient id="treasure-wood" x1="0.08" y1="0" x2="0.92" y2="1">
          <stop offset="0" stopColor="#e29a55" /><stop offset="0.5" stopColor="#9b552d" /><stop offset="1" stopColor="#512c1c" />
        </linearGradient>
        <linearGradient id="treasure-gold" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#fff3a6" /><stop offset="0.45" stopColor="#e2b63f" /><stop offset="1" stopColor="#8c621a" />
        </linearGradient>
        <linearGradient id="diamond-clear" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#fff" /><stop offset="0.35" stopColor="#c9f4ff" /><stop offset="0.7" stopColor="#83cce8" /><stop offset="1" stopColor="#5294bb" />
        </linearGradient>
        <linearGradient id="diamond-blue" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#d9fbff" /><stop offset="0.4" stopColor="#65d3ed" /><stop offset="1" stopColor="#267da7" />
        </linearGradient>
        <linearGradient id="diamond-pink" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffe5f1" /><stop offset="0.42" stopColor="#ef83ae" /><stop offset="1" stopColor="#a43f70" />
        </linearGradient>
        <linearGradient id="castle-approach" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f4e6c8" /><stop offset="0.52" stopColor="#d3bb93" /><stop offset="1" stopColor="#a58c69" />
        </linearGradient>
        <radialGradient id="royal-bush" cx="0.28" cy="0.2" r="0.86">
          <stop offset="0" stopColor="#91cf75" /><stop offset="0.5" stopColor="#4d9253" /><stop offset="1" stopColor="#285f3b" />
        </radialGradient>
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
        {/* Mond als klare Lichtquelle und vertikale Achse über der Sternwarte */}
        <circle cx="4560" cy="115" r="116" fill="#dff3ff" opacity="0.16" filter="url(#soft)" />
        <circle cx="4560" cy="115" r="55" fill="#f5ecc8" />
        <path d="M 4568 61 A 55 55 0 0 1 4611 135 A 55 55 0 0 1 4572 168 Q 4591 137 4584 103 Q 4580 78 4568 61 Z" fill="#c9c5ad" opacity="0.52" filter="url(#edge)" />
        <ellipse cx="4538" cy="97" rx="11" ry="8" fill="#d8d1b5" />
        <ellipse cx="4578" cy="132" rx="8" ry="6" fill="#d3ccb0" />
        <ellipse cx="4548" cy="141" rx="6" ry="4" fill="#e2d9bd" />
        <path d="M 4528 82 Q 4543 68 4561 66" stroke="#fffdec" strokeWidth="5" opacity="0.48" fill="none" strokeLinecap="round" />
        {[[4070, 185, 0.45], [4125, 105, 0.7], [4180, 70, 0.9], [4260, 150, 0.6], [4360, 50, 1], [4450, 120, 0.7], [4650, 200, 0.6],
          [4720, 60, 0.9], [4800, 140, 0.7], [4880, 90, 0.8], [4950, 175, 0.55], [4420, 230, 0.5], [4250, 260, 0.4], [4775, 260, 0.5]].map(([x, y, o], i) => (
          <Star key={i} x={x} y={y} s={0.5 + o * 0.7} o={o} />
        ))}
        <ShootingStar x={4195} y={87} s={0.92} rot={18} />
        {/* Milchstraßen-Schleier: hell genug zur Abgrenzung, aber hinter den Sternen */}
        <path d="M 4050 255 Q 4330 115 4600 205 Q 4810 275 5010 105" stroke="#b8c8ff" strokeWidth="52" opacity="0.055" fill="none" filter="url(#soft)" />

        {/* Königsschloss: Die Sonnenaufgangsfarben kommen aus dem einen
            durchgehenden Himmelsverlauf; keine radialen Lichtflächen oder Bögen. */}
        <rect x="4740" y="0" width="1260" height="450" fill="url(#castle-sunrise-wash)" mask="url(#castle-sunrise-mask)" />
        <path d="M 5010 205 C 5200 128 5380 155 5535 115 C 5700 72 5860 108 6050 55"
          stroke="url(#castle-cirrus)" strokeWidth="34" fill="none" opacity="0.58" filter="url(#soft)" strokeLinecap="round" />
        <path d="M 5100 272 C 5290 204 5460 232 5635 187 C 5775 151 5910 169 6035 132"
          stroke="url(#castle-cirrus)" strokeWidth="18" fill="none" opacity="0.42" filter="url(#soft)" strokeLinecap="round" />
        <path d="M 5205 82 Q 5400 34 5580 74 M 5650 250 Q 5820 212 5995 236"
          stroke="#ffffff" strokeWidth="7" fill="none" opacity="0.18" filter="url(#soft)" strokeLinecap="round" />
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
               Q 1840 400 1900 438 Q 1920 415 1940 440 L 1940 490 L 940 490 Z"
            fill="#2e7a44"
          />
        </g>
        {/* Eigenständige, gestaffelte Silhouette der Nachtwelt */}
        <g filter="url(#far)">
          <path d="M 3970 455 Q 4090 370 4200 420 Q 4330 330 4460 408 Q 4580 315 4720 405 Q 4850 350 5030 438 L 5030 500 L 3970 500 Z" fill="#172c55" opacity="0.72" />
          <path d="M 4020 472 Q 4160 410 4290 448 Q 4430 385 4580 449 Q 4740 390 4975 468 L 4975 510 L 4020 510 Z" fill="#263f70" opacity="0.48" />
        </g>
      </svg>

      {/* ---------- Ebene 3: Wolken (treiben unabhängig, eigenes Tempo) ---------- */}
      <svg className="pano-layer pano-layer-clouds" viewBox="0 0 6000 600" preserveAspectRatio="none">
        <Cloud x={700} y={80} s={0.8} o={0.8} />
        <Cloud x={1250} y={110} s={0.9} />
        <Cloud x={1700} y={60} s={0.65} o={0.8} />
        <Cloud x={2400} y={90} s={0.8} />
        <Cloud x={2820} y={140} s={0.6} o={0.8} />
        <Cloud x={3400} y={75} s={0.85} />
        <Cloud x={3740} y={120} s={0.6} o={0.8} />
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
          d="M 0 440 Q 250 417 500 435 Q 750 407 1000 425 Q 1250 407 1500 445 Q 1750 402 2000 420 Q 2180 405 2278 418 C 2284 423 2296 424 2302 419 Q 2400 421 2500 445 Q 2750 412 3000 430 Q 3065 422 3130 414 C 3185 391 3250 381 3320 382 C 3395 367 3470 374 3535 377 C 3610 367 3690 379 3760 387 C 3825 388 3858 399 3870 414 Q 3935 419.5 4000 425 Q 4250 407 4500 445 Q 4750 407 5000 425 Q 5250 407 5500 445 Q 5750 412 6000 430 L 6000 600 L 0 600 Z"
          fill="url(#pan-mid)"
        />
        <path
          d="M 0 505 Q 300 486 600 500 Q 900 481 1200 495 Q 1500 481 1800 505 Q 2050 478 2260 488 C 2290 488 2310 493 2325 497 C 2335 503 2346 503 2357 497 C 2370 490 2385 490 2400 492 Q 2700 478 3000 505 Q 3065 460 3130 414 C 3152 427 3195 436 3260 439 C 3330 444 3405 452 3485 450 C 3560 448 3640 453 3715 442 C 3790 440 3848 431 3870 414 Q 4035 460 4200 505 Q 4500 478 4800 492 Q 5100 478 5400 505 Q 5700 484 6000 498 L 6000 600 L 0 600 Z"
          fill="url(#pan-front)"
        />
        {/* dezente Maserung, bricht die glatten Verläufe auf */}
        <rect x="0" y="410" width="6000" height="190" filter="url(#grain)" opacity="0.5" style={{ mixBlendMode: 'overlay' }} />

        {/* Breite, ruhige Lichtungen verbinden die Welten. Himmel, Boden und
            Weg bleiben durchgehend, während die Themen-Deko an den Grenzen
            bewusst etwas mehr Abstand bekommt. */}
        {[1000, 2000, 3000, 4000, 5000].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="474" rx="118" ry="54" fill="#fff7d6" opacity="0.09" filter="url(#soft)" />
            <ellipse cx={x} cy="548" rx="128" ry="42" fill="#fff" opacity="0.055" filter="url(#soft)" />
          </g>
        ))}

        {/* Der Bach ist Teil des Geländes und liegt deshalb unter Weg und
            Brücke. Seine Breite nimmt mit der Nähe zum Betrachter zu. */}
        <MountainStream />

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
        <Flower x={890} y={560} s={1.15} c="#ffd93d" />

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
        <Pine x={1090} y={430} s={0.5} c="#2e6e3c" cd="#1f5c33" />
        <Tree x={1140} y={398} s={0.42} dark />
        <Pine x={1265} y={402} s={0.48} c="#2e6e3c" cd="#1f5c33" />
        <Tree x={1560} y={400} s={0.46} dark />
        <Pine x={1655} y={392} s={0.5} c="#2e6e3c" cd="#1f5c33" />
        <Tree x={1780} y={415} s={0.48} dark />
        <Pine x={1925} y={432} s={0.55} c="#2e6e3c" cd="#1f5c33" />

        {/* mittlere Baumreihe, entlang der bereits vorhandenen Weg-Aussparungen */}
        <Tree x={1160} y={505} s={1.2} />
        <Tree x={1330} y={452} s={0.85} dark />
        <Pine x={1520} y={500} s={0.8} />
        <Tree x={1700} y={458} s={0.8} />
        <Pine x={1870} y={520} s={0.95} />

        {/* vordere, größere Baumreihe – rahmt die Szene und macht sie dicht */}
        <Pine x={1110} y={560} s={0.95} />
        <Tree x={1460} y={545} s={0.95} dark />
        <Pine x={1565} y={565} s={0.8} />
        <Tree x={1900} y={565} s={1.05} dark />

        {/* Waldboden: Farne, Pilze, ein umgestürzter Stamm */}
        <Fern x={1175} y={588} s={1} />
        <Fern x={1355} y={548} s={0.9} />
        <Fern x={1615} y={588} s={1.05} />
        <Fern x={1875} y={562} s={0.9} />
        <Log x={1475} y={592} s={0.85} rot={-6} />
        <Mushroom x={1250} y={560} />
        <Mushroom x={1790} y={572} s={0.8} cap="#e08a3c" />
        <Mushroom x={1880} y={558} s={0.6} cap="#e08a3c" />

        {/* Waldtiere */}
        <Rabbit x={1700} y={530} s={0.8} />
        <Bear x={1390} y={575} s={1.05} />

        {/* ---------- Region: Bergwelt ---------- */}
        <MountainBridge x={2355} y={526} s={0.9} />
        {/* zweite, höher gelegene Bodenebene: kleinere Vegetation und Geröll
            lassen die Bergwelt bis an den Fuß der Gipfel belebt wirken */}
        <Pine x={2115} y={444} s={0.42} c="#3b7650" cd="#285c3b" />
        <Rock x={2185} y={448} s={0.48} />
        <AlpineFlower x={2240} y={444} s={0.58} />
        <Goat x={2255} y={456} s={0.5} />
        <Pine x={2440} y={463} s={0.46} c="#3b7650" cd="#285c3b" />
        <Cairn x={2460} y={455} s={0.52} />
        <AlpineFlower x={2535} y={448} s={0.55} />
        <Rock x={2635} y={447} s={0.5} />
        <Goat x={2685} y={452} s={0.46} />
        <Pine x={2745} y={458} s={0.44} c="#3b7650" cd="#285c3b" />
        <Cairn x={2835} y={449} s={0.48} />
        <AlpineFlower x={2910} y={443} s={0.58} />
        <Pine x={2935} y={452} s={0.4} c="#3b7650" cd="#285c3b" />

        {/* Kiefern in mehreren Reihen, unterschiedlich groß für Tiefe */}
        <Pine x={2100} y={545} s={0.8} />
        <Pine x={2430} y={525} s={0.6} />
        <Pine x={2650} y={555} s={0.85} />
        <Pine x={2920} y={540} s={0.7} />
        <Pine x={2050} y={588} s={0.6} />
        <Pine x={2200} y={568} s={0.7} />
        <Pine x={2285} y={592} s={0.55} />
        <Pine x={2550} y={582} s={0.75} />
        <Pine x={2780} y={565} s={0.65} />
        <Pine x={2870} y={592} s={0.7} />
        <Pine x={2930} y={562} s={0.6} />

        {/* Felsbrocken & Steinmänner säumen den Bergpfad */}
        <Rock x={2150} y={596} s={1} />
        <Rock x={2500} y={593} s={0.85} />
        <Rock x={2620} y={572} s={0.6} />
        <Rock x={2750} y={596} s={0.95} />
        <Rock x={2900} y={559} s={0.65} />
        <Cairn x={2470} y={590} s={0.62} />
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
        <AlpineFlower x={2925} y={598} s={0.7} />

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
        {/* Tiefere Vorderkante und eine feine, helle Linie dort, wo das
            Wasser auf den flachen Sand ausläuft. */}
        <path
          d="M 3148 410 C 3240 418 3355 427 3485 426 C 3600 424 3740 420 3852 410
             C 3822 422 3770 428 3703 429 C 3633 437 3560 433 3486 436
             C 3414 438 3342 432 3275 428 C 3218 426 3168 421 3133 414 Z"
          fill="#0d699d"
          opacity="0.15"
        />
        <path
          d="M 3138 414 C 3180 421 3220 426 3275 428 C 3342 432 3414 438 3486 436
             C 3560 433 3633 437 3703 429 C 3774 428 3828 422 3864 414"
          fill="none"
          stroke="#c6edf3"
          strokeWidth="1.6"
          opacity="0.48"
          strokeLinecap="round"
          filter="url(#edge)"
        />

        {/* Gebrochene Himmels- und Sonnenreflexe statt einer einzigen weißen Fläche. */}
        <path d="M 3290 397 C 3400 385 3550 385 3775 401 C 3635 396 3435 407 3290 397 Z" fill="#fff8d9" opacity="0.16" filter="url(#soft)" />
        <path d="M 3550 389 Q 3620 383 3690 391 M 3570 399 Q 3630 394 3680 400 M 3590 409 Q 3630 406 3665 410" stroke="#fffbe7" strokeWidth="3" fill="none" opacity="0.22" strokeLinecap="round" filter="url(#edge)" />

        {[
          [3195, 405, 42, 0.48],
          [3290, 392, 30, 0.38],
          [3428, 419, 48, 0.5],
          [3520, 388, 32, 0.34],
          [3665, 414, 44, 0.46],
          [3785, 402, 34, 0.42]
        ].map(([x, y, width, opacity], i) => (
          <g key={x} className="pano-shimmer" style={{ animationDelay: `-${i * 0.45}s` }} opacity={opacity}>
            <path d={`M ${x - width / 2} ${y} Q ${x} ${y - 3} ${x + width / 2} ${y}`} stroke="#c9f1fb" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d={`M ${x - width * 0.3} ${y + 5} Q ${x} ${y + 2.5} ${x + width * 0.3} ${y + 5}`} stroke="#267eae" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
          </g>
        ))}

        {/* Das kleine Boot liegt weiter hinten und höher; das größere näher
            an der vorderen Wasserkante. Beide Spiegelungen enden im See. */}
        <Boat x={3395} y={395} s={0.36} />
        <Boat x={3550} y={401} s={0.65} />

        {/* Die Fische sitzen sichtbar innerhalb der blauen Wasserfläche. */}
        <Fish x={3238} y={400} s={0.74} rot={-8} />
        <Fish x={3765} y={399} s={0.68} rot={-6} flip />

        {/* Freier Bereich zwischen Fisch und Boot: kleiner Schwimmring. */}
        <SwimRing x={3315} y={410} s={0.62} rot={-4} />

        {/* Möwen, gleiten über dem See */}
        <Seagull x={3200} y={345} s={1} />
        <Seagull x={3550} y={328} s={0.85} />
        <Seagull x={3820} y={358} s={0.9} />

        {/* Palmen bilden einen lockeren Rahmen; die kleinere Palme steht näher
            am Wasser und schafft eine zusätzliche Tiefenstufe. */}
        <Palm x={3085} y={548} s={0.95} />
        <Palm x={3970} y={566} s={0.75} />
        <Palm x={3878} y={486} s={0.48} />

        {/* Größere Strandobjekte stehen mit Abstand zueinander in den freien
            Bereichen zwischen den Levelstationen. */}
        <Sandcastle x={3225} y={558} s={0.82} />
        <BeachToys x={3545} y={590} s={0.78} />
        <Umbrella x={3800} y={552} s={0.72} />
        <Crab x={3385} y={535} s={0.72} />
        <Crab x={3705} y={586} s={0.66} />

        {/* Vegetation und Fundstücke verteilen sich von der Wasserkante bis
            in den Vordergrund statt in einer einzigen unteren Reihe. */}
        <DuneGrass x={3040} y={505} s={0.72} />
        <DuneGrass x={3150} y={598} s={0.82} />
        <DuneGrass x={3515} y={474} s={0.62} />
        <DuneGrass x={3625} y={600} s={0.86} />
        <DuneGrass x={3940} y={505} s={0.7} />

        <Shell x={3115} y={482} s={0.6} rot={-14} c="#ffb199" />
        <Shell x={3305} y={594} s={0.75} rot={9} c="#ffd9a3" />
        <Shell x={3440} y={475} s={0.58} rot={-8} c="#f4c6a4" />
        <Shell x={3590} y={566} s={0.68} rot={15} c="#f4dfa4" />
        <Shell x={3755} y={535} s={0.7} rot={-12} c="#ffb199" />
        <Shell x={3955} y={596} s={0.62} rot={8} c="#ffd9a3" />

        <Starfish x={3270} y={532} s={0.66} rot={-18} c="#ff8a5c" />
        <Starfish x={3485} y={596} s={0.76} rot={14} c="#ff9d78" />
        <Starfish x={3650} y={472} s={0.56} rot={-9} c="#ffb199" />
        <Starfish x={3900} y={558} s={0.68} rot={22} c="#ff8a5c" />

        {/* Dezente Sandspuren füllen nur die großen Zwischenräume. */}
        <BeachMarks x={3075} y={580} s={0.9} rot={-8} />
        <BeachMarks x={3345} y={472} s={0.72} rot={12} />
        <BeachMarks x={3425} y={570} s={0.9} rot={-15} />
        <BeachMarks x={3560} y={505} s={0.78} rot={8} />
        <BeachMarks x={3725} y={472} s={0.68} rot={-5} />
        <BeachMarks x={3860} y={600} s={0.85} rot={14} />

        {/* ---------- Region: Sternenhimmel ---------- */}
        {/* Mondlicht hebt die Welt als eigene Insel aus dem dunklen Boden. */}
        <ellipse cx="4560" cy="445" rx="520" ry="112" fill="#8ec9e8" opacity="0.12" filter="url(#soft)" />
        <ellipse cx="4560" cy="520" rx="390" ry="72" fill="#b9e9f5" opacity="0.1" filter="url(#soft)" />

        {/* hintere, bläulichere Reihe; vorne dunklere Rahmenbäume */}
        <Pine x={4070} y={446} s={0.46} c="#36567b" cd="#203b62" hi="#7699b8" trunk="#34465c" />
        <Pine x={4225} y={455} s={0.52} c="#35577b" cd="#1d385e" hi="#718fad" trunk="#304258" />
        <Pine x={4370} y={438} s={0.4} c="#426689" cd="#29476d" hi="#83a4bf" trunk="#3b5067" />
        <Pine x={4750} y={442} s={0.45} c="#3d6084" cd="#233f68" hi="#7c9db9" trunk="#384b62" />
        <Pine x={4910} y={455} s={0.5} c="#35577b" cd="#1d385e" hi="#718fad" trunk="#304258" />
        <Pine x={4150} y={510} s={0.85} c="#172b4d" cd="#09152d" hi="#456888" trunk="#26364a" />
        <Pine x={4330} y={565} s={0.72} c="#1c3559" cd="#0b1933" hi="#4d7090" trunk="#293a50" />
        <Pine x={4845} y={566} s={0.72} c="#193052" cd="#0a172f" hi="#496c8c" trunk="#27384d" />
        <Pine x={4980} y={515} s={0.84} c="#142946" cd="#081429" hi="#416481" trunk="#233348" />

        <MoonRock x={4075} y={558} s={0.85} />
        <MoonRock x={4260} y={590} s={0.62} flip />
        <MoonRock x={4860} y={592} s={0.72} />
        <MoonRock x={4990} y={568} s={0.62} flip />

        <Observatory x={4560} y={470} s={0.82} />
        {[[4240, 480], [4420, 545], [4610, 500], [4760, 555], [4930, 570]].map(([x, y], i) => (
          <g key={i} className="pano-pulse" style={{ animationDelay: `-${i * 0.4}s` }}>
            <circle cx={x} cy={y} r="12" fill="#ffe97a" opacity="0.28" filter="url(#soft)" />
            <circle cx={x} cy={y} r="3.2" fill="#fff2a8" />
            <circle cx={x - 1} cy={y - 1} r="1" fill="#fff" opacity="0.85" />
          </g>
        ))}

        {/* ---------- Region: Königsschloss ---------- */}
        {/* Das Schloss sitzt direkt auf der vorhandenen mittleren Bodenebene. */}
        {/* Klare Tiefenfolge: Weg hinten, Schloss in der Mitte, Büsche vorne. */}
        <CastleApproach x={5500} y={424} s={0.92} greenery={false} />
        <Castle x={5500} y={425} s={0.94} />
        <CastleApproach x={5500} y={424} s={0.92} path={false} />
        {/* Generierte, freigestellte Schatztruhe als finales Reiseziel. */}
        <image
          href={`${import.meta.env.BASE_URL}assets/generated/royal-treasure.png`}
          x="5775" y="390" width="170" height="170"
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: 'saturate(0.72) contrast(0.92) brightness(0.98)' }}
        />
        {/* Königliche Kleindeko in gestaffelten Tiefen. Die drei Levelpunkte
            bei x=5140/5500/5860 bleiben gut erreichbar und lesbar. */}
        <HeraldicShield x={5250} y={472} s={0.62} />
        <HeraldicShield x={5750} y={474} s={0.62} flip />
        <RoyalLantern x={5335} y={505} s={0.62} />
        <RoyalLantern x={5665} y={505} s={0.62} />
        <StoneBench x={5225} y={580} s={0.76} />
        <StoneBench x={5775} y={580} s={0.76} flip />
        <CrownPlanter x={5375} y={572} s={0.74} c="#f18aaf" />
        <CrownPlanter x={5625} y={572} s={0.74} c="#b995e8" />
        <Star x={5240} y={300} s={1.4} o={0.9} />
        <Star x={5760} y={280} s={1.1} o={0.8} />
        <Flower x={5130} y={555} s={1.05} c="#ff7bac" />
        <Flower x={5960} y={520} s={0.85} c="#b58aff" />
      </svg>
    </div>
  )
}
