// Landschafts-Szenen für die Welten.
// 3D-Wirkung durch: mehrere Tiefenebenen (hinten heller/blauer + weichgezeichnet),
// EINE durchgehende Lichtrichtung (links oben) mit weichen Verläufen statt harter
// Kanten, organische statt geometrische Silhouetten, Bodenschatten, Glanzlichter
// und dezente Bewegung (Wiegen, Glitzern, Treiben).

// ---------- Wiederverwendbare Elemente ----------

export function Cloud({ x, y, s = 1, o = 0.9 }) {
  const delay = -((x * 0.37) % 9)
  const dur = 9 + ((x * 0.13) % 5)
  return (
    <g className="pano-cloud" style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s` }}>
      <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
        <ellipse cx="0" cy="4" rx="48" ry="16" fill="#dceefb" opacity="0.6" />
        <ellipse cx="0" cy="0" rx="46" ry="20" fill="#fff" />
        <ellipse cx="-28" cy="6" rx="28" ry="14" fill="#fff" />
        <ellipse cx="30" cy="6" rx="30" ry="15" fill="#fff" />
        <ellipse cx="-6" cy="-10" rx="20" ry="14" fill="#fff" />
        <ellipse cx="0" cy="10" rx="50" ry="12" fill="#eef6ff" />
      </g>
    </g>
  )
}

export function Sun({ x, y, r = 42 }) {
  return (
    <g>
      <circle className="pano-glow" cx={x} cy={y} r={r * 1.9} fill="#fff6c9" opacity="0.35" filter="url(#soft)" />
      <circle cx={x} cy={y} r={r} fill="#ffd93d" />
      <circle cx={x - r * 0.25} cy={y - r * 0.25} r={r * 0.55} fill="#ffe97a" />
    </g>
  )
}

// Laubbaum: organische Kronen-Silhouette, weicher Verlauf hell (links oben) →
// dunkel (rechts unten), leichtes Wiegen im Wind
export function Tree({ x, y, s = 1, dark = false }) {
  const leafD = dark ? '#2e6e3c' : '#3d8a49'
  const grad = dark ? 'tree-grad-dark' : 'tree-grad-normal'
  const sway = (x * 0.29) % 3
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="34" ry="8" fill="#000" opacity="0.15" />
      <path d="M -5 0 L -3 -34 L 3 -34 L 5 0 Z" fill="#8a5a35" />
      <path d="M 0 -34 L 3 -34 L 5 0 L 0 0 Z" fill="#6e4527" />
      <g className="pano-sway" style={{ animationDelay: `-${sway}s` }}>
        <path
          d="M -32 -46 Q -38 -74 -14 -84 Q -6 -98 12 -92 Q 34 -88 32 -64 Q 42 -52 30 -38 Q 26 -20 4 -22 Q -14 -18 -24 -30 Q -36 -34 -32 -46 Z"
          fill={`url(#${grad})`}
        />
        <path
          d="M 6 -90 Q 30 -84 30 -58 Q 38 -48 28 -36 Q 24 -22 6 -22 Q 18 -40 16 -58 Q 18 -76 6 -90 Z"
          fill={leafD}
          opacity="0.55"
          filter="url(#edge)"
        />
      </g>
    </g>
  )
}

// Tanne: geschwungene, organische Zweig-Etagen statt spitzer Dreiecke
export function Pine({ x, y, s = 1, c = '#2f7a44', cd = '#226034', hi = '#4f9c63', trunk = '#7a4d2b' }) {
  const sway = (x * 0.31) % 3
  const tier = (top, ty, half) =>
    `M 0 ${top} Q ${(half * 0.62).toFixed(1)} ${((top + ty) / 2).toFixed(1)} ${half} ${ty} ` +
    `Q 0 ${ty - 8} ${-half} ${ty} Q ${(-half * 0.62).toFixed(1)} ${((top + ty) / 2).toFixed(1)} 0 ${top} Z`
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="3" rx="24" ry="6" fill="#000" opacity="0.15" />
      <rect x="-4" y="-12" width="8" height="14" fill={trunk} />
      <g className="pano-sway" style={{ animationDelay: `-${sway}s` }}>
        <path d={tier(-95, -55, 22)} fill={c} />
        <path d={tier(-70, -30, 28)} fill={c} />
        <path d={tier(-48, -8, 34)} fill={c} />
        <path
          d="M 0 -95 L 22 -55 L 6 -55 Z M 0 -70 L 28 -30 L 7 -30 Z M 0 -48 L 34 -8 L 8 -8 Z"
          fill={cd}
          opacity="0.85"
          filter="url(#edge)"
        />
        <path d="M 0 -95 L -8 -80 L 0 -78 Z" fill={hi} />
      </g>
    </g>
  )
}

export function Flower({ x, y, s = 1, c = '#ff7bac' }) {
  const sway = (x * 0.41) % 4
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="1" cy="23" rx="7" ry="2.2" fill="#000" opacity="0.12" />
      <path d="M 0 0 L 0 22" stroke="#3d8a49" strokeWidth="3" />
      <path d="M 0 10 Q 9 6 12 0" stroke="#3d8a49" strokeWidth="2.5" fill="none" />
      <path d="M 0 4 Q 3.4 8 3 13" stroke="#2c6b38" strokeWidth="1.4" fill="none" opacity="0.5" />
      <g className="pano-sway" style={{ animationDelay: `-${sway}s` }}>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <ellipse cx="0" cy="-9" rx="5.5" ry="9" fill={c} />
            {/* Schlagschatten am äußeren/unteren Blattrand, Licht von links oben */}
            <ellipse cx="1.8" cy="-11.5" rx="2.6" ry="5.5" fill="#000" opacity="0.16" filter="url(#edge)" />
            <ellipse cx="-1.6" cy="-6" rx="2" ry="3.8" fill="#fff" opacity="0.3" filter="url(#edge)" />
          </g>
        ))}
        <circle cx="0" cy="0" r="6" fill="#ffd93d" />
        <circle cx="1.6" cy="1.6" r="2.8" fill="#c9861c" opacity="0.4" filter="url(#edge)" />
        <circle cx="-1.8" cy="-1.8" r="2.2" fill="#ffe97a" />
      </g>
    </g>
  )
}

export function Butterfly({ x, y, s = 1, c = '#7ec3ff' }) {
  const delay = (x * 0.6) % 2
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="pano-flutter" style={{ animationDelay: `-${delay}s` }}>
        <ellipse cx="-7" cy="-3" rx="8" ry="11" fill={c} transform="rotate(-25 -7 -3)" />
        <ellipse cx="7" cy="-3" rx="8" ry="11" fill={c} transform="rotate(25 7 -3)" opacity="0.85" />
        <rect x="-1.5" y="-9" width="3" height="16" rx="1.5" fill="#5a4632" />
      </g>
    </g>
  )
}

export function Star({ x, y, s = 1, o = 1 }) {
  const delay = (x * 0.53 + y * 0.31) % 4
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        className="pano-twinkle"
        d="M 0 -6 L 1.7 -1.7 L 6 0 L 1.7 1.7 L 0 6 L -1.7 1.7 L -6 0 L -1.7 -1.7 Z"
        fill="#fff"
        opacity={o}
        style={{ animationDelay: `-${delay}s` }}
      />
    </g>
  )
}

// Berg: zerklüftete, organische Gratlinie statt eines glatten Dreiecks,
// weicher Verlauf auf der Lichtseite, dezente Fels-Texturstriche im Schatten
const MOUNTAIN_GRAD = {
  '#aac8e6': 'mtn-grad-far',
  '#7fa8cf': 'mtn-grad-mid',
  '#57779c': 'mtn-grad-near'
}

export function Mountain({ x, y, w, h, c = '#7fa8cf', cd = '#5f88b3', snow = true }) {
  const fill = MOUNTAIN_GRAD[c] ? `url(#${MOUNTAIN_GRAD[c]})` : c
  const mountainPath = `M ${-w / 2} 0 L ${-w * 0.38} ${-h * 0.25} L ${-w * 0.29} ${-h * 0.43}
    L ${-w * 0.2} ${-h * 0.5} L ${-w * 0.11} ${-h * 0.8} L ${-w * 0.045} ${-h * 0.88}
    L 0 ${-h} L ${w * 0.055} ${-h * 0.86} L ${w * 0.13} ${-h * 0.73}
    L ${w * 0.2} ${-h * 0.58} L ${w * 0.32} ${-h * 0.4} L ${w / 2} 0 Z`
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Grundkörper mit kleinen Vorgipfeln und einer unregelmäßigen Gratlinie. */}
      <path
        d={mountainPath}
        fill={fill}
        stroke={fill}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Große Felsflächen: Licht fällt konsequent von links oben ein. */}
      <path
        d={`M 0 ${-h} L ${-w * 0.045} ${-h * 0.88} L ${-w * 0.11} ${-h * 0.8}
            L ${-w * 0.2} ${-h * 0.5} L ${-w * 0.38} ${-h * 0.25} L ${-w / 2} 0
            L ${-w * 0.14} ${-h * 0.12} L ${-w * 0.055} ${-h * 0.52} Z`}
        fill="#fff" opacity="0.11" filter="url(#edge)"
      />
      <path
        d={`M 0 ${-h} L ${w * 0.055} ${-h * 0.86} L ${w * 0.13} ${-h * 0.73}
            L ${w * 0.2} ${-h * 0.58} L ${w * 0.32} ${-h * 0.4} L ${w / 2} 0
            L ${w * 0.08} 0 L ${w * 0.035} ${-h * 0.42} Z`}
        fill={cd} opacity="0.7" filter="url(#edge)"
      />
      <path
        d={`M ${w * 0.035} ${-h * 0.42} L ${w * 0.13} ${-h * 0.73} L ${w * 0.2} ${-h * 0.58}
            L ${w * 0.12} ${-h * 0.28} L ${w * 0.28} ${-h * 0.08} L ${w * 0.08} 0 Z`}
        fill="#58738b" opacity="0.13" filter="url(#edge)"
      />
      {/* Die klare Bergsilhouette liegt hinter dem Schnee: So bleibt der
          Felsrand präzise, ohne am verschneiten Gipfel durchzuscheinen. */}
      <path
        d={mountainPath}
        fill="none"
        stroke={fill}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {snow && (
        <g>
          <path
            d={`M ${-w * 0.105} ${-h * 0.79} L ${-w * 0.045} ${-h * 0.88} L 0 ${-h}
                L ${w * 0.055} ${-h * 0.86} L ${w * 0.12} ${-h * 0.74}
                Q ${w * 0.095} ${-h * 0.755} ${w * 0.075} ${-h * 0.77}
                Q ${w * 0.058} ${-h * 0.735} ${w * 0.045} ${-h * 0.68}
                Q ${w * 0.028} ${-h * 0.735} ${w * 0.012} ${-h * 0.78}
                Q ${-w * 0.006} ${-h * 0.735} ${-w * 0.025} ${-h * 0.7}
                Q ${-w * 0.04} ${-h * 0.755} ${-w * 0.055} ${-h * 0.78}
                Q ${-w * 0.08} ${-h * 0.765} ${-w * 0.105} ${-h * 0.79} Z`}
            fill="#e8f1f7"
            opacity="0.94"
            stroke="#e8f1f7"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d={`M 0 ${-h} L ${w * 0.055} ${-h * 0.86} L ${w * 0.12} ${-h * 0.74}
                Q ${w * 0.095} ${-h * 0.755} ${w * 0.075} ${-h * 0.77}
                Q ${w * 0.058} ${-h * 0.735} ${w * 0.045} ${-h * 0.68}
                Q ${w * 0.028} ${-h * 0.735} ${w * 0.012} ${-h * 0.78} Z`}
            fill="#b9cedd" opacity="0.58" filter="url(#edge)"
          />
          <path
            d={`M ${-w * 0.065} ${-h * 0.84} L ${-w * 0.018} ${-h * 0.94}`}
            stroke="#f7fbff" strokeWidth="3" opacity="0.38" strokeLinecap="round" filter="url(#edge)"
          />
        </g>
      )}
      {/* Geröllrinnen, Felsbänder und sonnenbeschienene Kanten. */}
      <path
        d={`M ${-w * 0.11} ${-h * 0.72} L ${-w * 0.16} ${-h * 0.55} L ${-w * 0.13} ${-h * 0.39}
            M ${-w * 0.25} ${-h * 0.4} L ${-w * 0.18} ${-h * 0.34} L ${-w * 0.21} ${-h * 0.22}
            M ${w * 0.13} ${-h * 0.56} L ${w * 0.09} ${-h * 0.39} L ${w * 0.16} ${-h * 0.25}
            M ${w * 0.25} ${-h * 0.34} L ${w * 0.2} ${-h * 0.2} L ${w * 0.27} ${-h * 0.1}`}
        stroke="#49677f" strokeWidth="3" opacity="0.2"
        strokeLinecap="round"
        filter="url(#edge)"
      />
      <path
        d={`M ${-w * 0.31} ${-h * 0.31} L ${-w * 0.23} ${-h * 0.42}
            M ${-w * 0.18} ${-h * 0.55} L ${-w * 0.12} ${-h * 0.7}
            M ${w * 0.2} ${-h * 0.18} L ${w * 0.3} ${-h * 0.29}`}
        stroke="#fff" strokeWidth="3.5" opacity="0.16" strokeLinecap="round" filter="url(#edge)"
      />
    </g>
  )
}
