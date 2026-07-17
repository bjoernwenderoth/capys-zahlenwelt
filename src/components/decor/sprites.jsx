// Wiederverwendbare Deko-Sprites für die Panorama-Karte.
// Reine Darstellungskomponenten – welche Sprites wo auf der Karte stehen,
// steht in src/data/worldDecor/*.js (siehe WorldDecor.jsx für den Renderer).

export function Mushroom({ x, y, s = 1, cap = '#e05252' }) {
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
export function Bloom({ x, y, s = 1 }) {
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
export function Bee({ x, y, s = 1 }) {
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
export function Fern({ x, y, s = 1, c = '#2e6e3c' }) {
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
export function Log({ x, y, s = 1, rot = 0 }) {
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

export function Rabbit({ x, y, s = 1 }) {
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

export function Bear({ x, y, s = 1 }) {
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

export function Boat({ x, y, s = 1 }) {
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

export function Palm({ x, y, s = 1 }) {
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
export function Crab({ x, y, s = 1 }) {
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
export function Seagull({ x, y, s = 1 }) {
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
export function Shell({ x, y, s = 1, c = '#ffb199', rot = 0 }) {
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
export function Starfish({ x, y, s = 1, c = '#ff8a5c', rot = 0 }) {
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
export function DuneGrass({ x, y, s = 1 }) {
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
export function Sandcastle({ x, y, s = 1 }) {
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
export function Umbrella({ x, y, s = 1, c = '#ff5c5c' }) {
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
export function BeachToys({ x, y, s = 1, flip = false }) {
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
export function BeachMarks({ x, y, s = 1, rot = 0 }) {
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
export function Fish({ x, y, s = 1, flip = false, rot = 0 }) {
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
export function SwimRing({ x, y, s = 1, rot = 0 }) {
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
// Fester Bestandteil des Geländes (siehe Panorama.jsx) statt einer
// Deko-Instanz, da seine Koordinaten fix an die Bergwelt-Kontur gebunden sind.
export function MountainStream() {
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

export function MountainBridge({ x, y, s = 1 }) {
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
export function Rock({ x, y, s = 1 }) {
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
export function Cairn({ x, y, s = 1 }) {
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
export function AlpineFlower({ x, y, s = 1 }) {
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
export function Goat({ x, y, s = 1 }) {
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
export function Eagle({ x, y, s = 1 }) {
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

export function RoyalLantern({ x, y, s = 1 }) {
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

export function HeraldicShield({ x, y, s = 1, flip = false }) {
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

export function StoneBench({ x, y, s = 1, flip = false }) {
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

export function CrownPlanter({ x, y, s = 1, c = '#f18aaf' }) {
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

export function CastleApproach({ x, y, s = 1, path = true, greenery = true }) {
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
export function Castle({ x, y, s = 1 }) {
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
export function Observatory({ x, y, s = 1 }) {
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

export function MoonRock({ x, y, s = 1, flip = false }) {
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

export function ShootingStar({ x, y, s = 1, rot = 0 }) {
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

// Weicher Lichtfleck (Sonnenlicht auf der Wiese, Mondschein über der Sternwarte …)
export function Glow({ x, y, rx, ry, fill, opacity = 1 }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={fill} opacity={opacity} filter="url(#soft)" />
}

// Glitzern auf dem See – ein einzelnes Segment aus dem Sonnenreflex-Band
export function LakeShimmer({ x, y, width, opacity, delay = 0 }) {
  return (
    <g className="pano-shimmer" style={{ animationDelay: `-${delay}s` }} opacity={opacity}>
      <path d={`M ${x - width / 2} ${y} Q ${x} ${y - 3} ${x + width / 2} ${y}`} stroke="#c9f1fb" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={`M ${x - width * 0.3} ${y + 5} Q ${x} ${y + 2.5} ${x + width * 0.3} ${y + 5}`} stroke="#267eae" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
    </g>
  )
}

// Glühwürmchen der Nachtwelt – warmes, pulsierendes Licht
export function NightGlow({ x, y, delay = 0 }) {
  return (
    <g className="pano-pulse" style={{ animationDelay: `-${delay}s` }}>
      <circle cx={x} cy={y} r="12" fill="#ffe97a" opacity="0.28" filter="url(#soft)" />
      <circle cx={x} cy={y} r="3.2" fill="#fff2a8" />
      <circle cx={x - 1} cy={y - 1} r="1" fill="#fff" opacity="0.85" />
    </g>
  )
}
