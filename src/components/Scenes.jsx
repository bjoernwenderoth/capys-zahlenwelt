// Landschafts-Szenen für die Welten.
// 3D-Wirkung durch: mehrere Tiefenebenen (hinten heller/blauer + weichgezeichnet),
// Licht- und Schattenseiten an Objekten, Bodenschatten, Glanzlichter.

// ---------- Wiederverwendbare Elemente ----------

export function Cloud({ x, y, s = 1, o = 0.9 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <ellipse cx="0" cy="0" rx="46" ry="20" fill="#fff" />
      <ellipse cx="-28" cy="6" rx="28" ry="14" fill="#fff" />
      <ellipse cx="30" cy="6" rx="30" ry="15" fill="#fff" />
      <ellipse cx="0" cy="10" rx="50" ry="12" fill="#eef6ff" />
    </g>
  )
}

export function Sun({ x, y, r = 42 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.9} fill="#fff6c9" opacity="0.35" filter="url(#soft)" />
      <circle cx={x} cy={y} r={r} fill="#ffd93d" />
      <circle cx={x - r * 0.25} cy={y - r * 0.25} r={r * 0.55} fill="#ffe97a" />
    </g>
  )
}

// Laubbaum mit Schattenseite + Glanzlicht + Bodenschatten
export function Tree({ x, y, s = 1, dark = false }) {
  const leaf = dark ? '#3e8e4f' : '#54ad60'
  const leafD = dark ? '#2e6e3c' : '#3d8a49'
  const leafL = dark ? '#57a868' : '#74c77f'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="34" ry="8" fill="#000" opacity="0.15" />
      <path d="M -5 0 L -3 -34 L 3 -34 L 5 0 Z" fill="#8a5a35" />
      <path d="M 0 -34 L 3 -34 L 5 0 L 0 0 Z" fill="#6e4527" />
      <circle cx="0" cy="-56" r="30" fill={leaf} />
      <circle cx="-18" cy="-44" r="20" fill={leaf} />
      <circle cx="18" cy="-44" r="20" fill={leaf} />
      <path d="M 4 -84 A 30 30 0 0 1 28 -40 L 12 -36 Z" fill={leafD} opacity="0.7" />
      <circle cx="-12" cy="-64" r="11" fill={leafL} />
    </g>
  )
}

// Tanne mit Schattenseite
export function Pine({ x, y, s = 1, c = '#2f7a44', cd = '#226034' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="3" rx="24" ry="6" fill="#000" opacity="0.15" />
      <rect x="-4" y="-12" width="8" height="14" fill="#7a4d2b" />
      <path d="M 0 -95 L 22 -55 L -22 -55 Z" fill={c} />
      <path d="M 0 -70 L 28 -30 L -28 -30 Z" fill={c} />
      <path d="M 0 -48 L 34 -8 L -34 -8 Z" fill={c} />
      <path d="M 0 -95 L 22 -55 L 6 -55 Z M 0 -70 L 28 -30 L 7 -30 Z M 0 -48 L 34 -8 L 8 -8 Z" fill={cd} />
      <path d="M 0 -95 L -8 -80 L 0 -78 Z" fill="#4f9c63" />
    </g>
  )
}

export function Flower({ x, y, s = 1, c = '#ff7bac' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M 0 0 L 0 22" stroke="#3d8a49" strokeWidth="3" />
      <path d="M 0 10 Q 9 6 12 0" stroke="#3d8a49" strokeWidth="2.5" fill="none" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="0" cy="-9" rx="5.5" ry="9" fill={c} transform={`rotate(${a})`} />
      ))}
      <circle cx="0" cy="0" r="6" fill="#ffd93d" />
      <circle cx="-1.8" cy="-1.8" r="2.2" fill="#ffe97a" />
    </g>
  )
}

export function Butterfly({ x, y, s = 1, c = '#7ec3ff' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="-7" cy="-3" rx="8" ry="11" fill={c} transform="rotate(-25 -7 -3)" />
      <ellipse cx="7" cy="-3" rx="8" ry="11" fill={c} transform="rotate(25 7 -3)" opacity="0.85" />
      <rect x="-1.5" y="-9" width="3" height="16" rx="1.5" fill="#5a4632" />
    </g>
  )
}

export function Star({ x, y, s = 1, o = 1 }) {
  return (
    <path
      d="M 0 -6 L 1.7 -1.7 L 6 0 L 1.7 1.7 L 0 6 L -1.7 1.7 L -6 0 L -1.7 -1.7 Z"
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="#fff"
      opacity={o}
    />
  )
}

// Berg mit hellem Gesicht, dunkler Schattenflanke und Schneekappe
export function Mountain({ x, y, w, h, c = '#7fa8cf', cd = '#5f88b3', snow = true }) {
  const peak = [x, y - h]
  return (
    <g>
      <path d={`M ${x - w / 2} ${y} L ${peak[0]} ${peak[1]} L ${x + w / 2} ${y} Z`} fill={c} />
      <path d={`M ${peak[0]} ${peak[1]} L ${x + w / 2} ${y} L ${x + w * 0.1} ${y} Z`} fill={cd} />
      {snow && (
        <path
          d={`M ${x - w * 0.14} ${y - h * 0.62} L ${peak[0]} ${peak[1]} L ${x + w * 0.14} ${y - h * 0.62}
              L ${x + w * 0.07} ${y - h * 0.54} L ${x} ${y - h * 0.62} L ${x - w * 0.07} ${y - h * 0.52} Z`}
          fill="#fff"
        />
      )}
    </g>
  )
}

function Defs() {
  return (
    <defs>
      <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <filter id="far" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" />
      </filter>
      <linearGradient id="sky-wald" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fd7ff" /><stop offset="1" stopColor="#e9f8d8" />
      </linearGradient>
      <linearGradient id="sky-wiese" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7ecbff" /><stop offset="1" stopColor="#fff3d6" />
      </linearGradient>
      <linearGradient id="sky-berge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5aa7e8" /><stop offset="1" stopColor="#d8efff" />
      </linearGradient>
      <linearGradient id="sky-see" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fd3ff" /><stop offset="1" stopColor="#fff0c9" />
      </linearGradient>
      <linearGradient id="sky-nacht" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0c1c45" /><stop offset="1" stopColor="#2c4a8f" />
      </linearGradient>
      <linearGradient id="sky-schloss" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffb1c9" /><stop offset="0.5" stopColor="#ffd9a3" /><stop offset="1" stopColor="#bfe9ff" />
      </linearGradient>
      <linearGradient id="wasser" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#57bdf0" /><stop offset="1" stopColor="#1d7fbd" />
      </linearGradient>
      <linearGradient id="wiese-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8ed36c" /><stop offset="1" stopColor="#5cb04a" />
      </linearGradient>
    </defs>
  )
}

// ---------- Szenen ----------

function Wald() {
  return (
    <>
      <rect width="1000" height="600" fill="url(#sky-wald)" />
      <Sun x={340} y={95} r={38} />
      <Cloud x={420} y={80} s={0.8} o={0.8} />
      <Cloud x={760} y={120} s={0.6} o={0.7} />
      {/* ferner Wald – heller, bläulicher, unscharf */}
      <g filter="url(#far)" opacity="0.75">
        {[60, 200, 340, 490, 640, 790, 930].map((x, i) => (
          <circle key={i} cx={x} cy={330 - (i % 3) * 22} r={70 + (i % 2) * 24} fill="#9ccc9c" />
        ))}
        <rect x="0" y="330" width="1000" height="90" fill="#9ccc9c" />
      </g>
      {/* mittlerer Boden */}
      <path d="M 0 380 Q 250 340 500 375 T 1000 370 L 1000 600 L 0 600 Z" fill="#6fbf5a" />
      {/* vordere Wiese, dunkler = näher */}
      <path d="M 0 480 Q 300 440 600 480 T 1000 475 L 1000 600 L 0 600 Z" fill="#57a747" />
      <Tree x={110} y={430} s={1.25} />
      <Tree x={870} y={415} s={1.1} dark />
      <Tree x={330} y={400} s={0.8} dark />
      <Tree x={680} y={395} s={0.75} />
      <Pine x={480} y={425} s={0.7} />
      <Pine x={960} y={520} s={0.9} />
      <Pine x={40} y={560} s={1.0} />
      {/* Pilze + Gras vorn */}
      <g transform="translate(240 540)">
        <ellipse cx="0" cy="6" rx="16" ry="4" fill="#000" opacity="0.15" />
        <rect x="-5" y="-8" width="10" height="14" rx="4" fill="#f3e3c3" />
        <path d="M -16 -6 A 16 12 0 0 1 16 -6 Z" fill="#e05252" />
        <circle cx="-7" cy="-12" r="3" fill="#fff" /><circle cx="6" cy="-10" r="2.4" fill="#fff" />
      </g>
      <g transform="translate(760 555) scale(0.8)">
        <ellipse cx="0" cy="6" rx="16" ry="4" fill="#000" opacity="0.15" />
        <rect x="-5" y="-8" width="10" height="14" rx="4" fill="#f3e3c3" />
        <path d="M -16 -6 A 16 12 0 0 1 16 -6 Z" fill="#e08a3c" />
        <circle cx="-6" cy="-11" r="2.6" fill="#fff" />
      </g>
      {[80, 180, 420, 560, 660, 900].map((x, i) => (
        <path key={i} d={`M ${x} 585 q 3 -18 6 0 M ${x + 8} 585 q 3 -14 6 0`} stroke="#3d8a49" strokeWidth="3" fill="none" strokeLinecap="round" />
      ))}
    </>
  )
}

function Wiese() {
  return (
    <>
      <rect width="1000" height="600" fill="url(#sky-wiese)" />
      <Sun x={660} y={90} r={44} />
      <Cloud x={200} y={90} s={0.9} />
      <Cloud x={550} y={60} s={0.65} o={0.8} />
      {/* Hügel hinten → vorn immer satter */}
      <g filter="url(#far)">
        <path d="M 0 340 Q 250 260 520 330 T 1000 320 L 1000 600 L 0 600 Z" fill="#b5e39a" />
      </g>
      <path d="M 0 400 Q 300 320 620 395 T 1000 390 L 1000 600 L 0 600 Z" fill="#8ed36c" />
      <path d="M 0 480 Q 350 420 700 475 T 1000 470 L 1000 600 L 0 600 Z" fill="url(#wiese-grad)" />
      <Tree x={920} y={430} s={0.9} />
      <Tree x={70} y={415} s={0.7} dark />
      {/* Blumenmeer – hinten klein, vorn groß */}
      <Flower x={200} y={420} s={0.7} c="#ff7bac" />
      <Flower x={330} y={435} s={0.6} c="#b58aff" />
      <Flower x={520} y={425} s={0.65} c="#ffd93d" />
      <Flower x={720} y={440} s={0.7} c="#ff8a5c" />
      <Flower x={120} y={505} s={1.0} c="#ff5c8a" />
      <Flower x={300} y={530} s={1.15} c="#ffd93d" />
      <Flower x={480} y={515} s={1.0} c="#b58aff" />
      <Flower x={650} y={540} s={1.2} c="#ff7bac" />
      <Flower x={840} y={520} s={1.05} c="#ff8a5c" />
      <Flower x={950} y={560} s={1.2} c="#7ec3ff" />
      <Flower x={40} y={570} s={1.25} c="#ffd93d" />
      <Butterfly x={400} y={330} s={1.1} c="#7ec3ff" />
      <Butterfly x={780} y={300} s={0.85} c="#ffb1c9" />
      <Butterfly x={180} y={280} s={0.7} c="#ffd93d" />
    </>
  )
}

function Berge() {
  return (
    <>
      <rect width="1000" height="600" fill="url(#sky-berge)" />
      <Sun x={350} y={85} r={36} />
      <Cloud x={500} y={70} s={0.8} />
      <Cloud x={820} y={130} s={0.6} o={0.8} />
      {/* fernste Kette – fast himmelfarben */}
      <g filter="url(#far)" opacity="0.8">
        <Mountain x={200} y={400} w={480} h={230} c="#aac8e6" cd="#93b6da" />
        <Mountain x={620} y={400} w={520} h={260} c="#aac8e6" cd="#93b6da" />
        <Mountain x={950} y={400} w={420} h={200} c="#aac8e6" cd="#93b6da" />
      </g>
      {/* mittlere Kette */}
      <Mountain x={90} y={450} w={420} h={280} c="#7fa8cf" cd="#5f88b3" />
      <Mountain x={430} y={455} w={540} h={330} c="#7fa8cf" cd="#5f88b3" />
      <Mountain x={800} y={450} w={500} h={300} c="#7fa8cf" cd="#5f88b3" />
      {/* nahe dunkle Kette */}
      <Mountain x={250} y={520} w={560} h={260} c="#57779c" cd="#425e80" />
      <Mountain x={730} y={525} w={620} h={290} c="#57779c" cd="#425e80" />
      {/* grüner Talboden */}
      <path d="M 0 500 Q 250 470 500 495 T 1000 490 L 1000 600 L 0 600 Z" fill="#6fae5c" />
      <path d="M 0 545 Q 300 520 620 545 T 1000 540 L 1000 600 L 0 600 Z" fill="#588f47" />
      <Pine x={120} y={560} s={0.85} />
      <Pine x={340} y={545} s={0.65} />
      <Pine x={620} y={555} s={0.8} />
      <Pine x={880} y={570} s={0.95} />
      {/* Adler */}
      <path d="M 560 160 q 14 -12 28 0 q 14 -12 28 0" stroke="#3a4a5c" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M 700 210 q 10 -9 20 0 q 10 -9 20 0" stroke="#3a4a5c" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  )
}

function See() {
  return (
    <>
      <rect width="1000" height="600" fill="url(#sky-see)" />
      <Sun x={650} y={95} r={40} />
      <Cloud x={250} y={80} s={0.85} />
      <Cloud x={600} y={120} s={0.6} o={0.8} />
      {/* ferne Inseln */}
      <g filter="url(#far)" opacity="0.8">
        <path d="M 80 330 Q 160 280 260 330 Z" fill="#7fae8a" />
        <path d="M 620 325 Q 700 285 800 325 Z" fill="#7fae8a" />
      </g>
      {/* Wasser */}
      <rect x="0" y="325" width="1000" height="180" fill="url(#wasser)" />
      {/* Sonnenglitzer */}
      <ellipse cx="840" cy="360" rx="90" ry="10" fill="#fff" opacity="0.35" />
      <ellipse cx="840" cy="385" rx="60" ry="7" fill="#fff" opacity="0.25" />
      {[120, 320, 520, 700, 920].map((x, i) => (
        <path key={i} d={`M ${x} ${360 + (i % 3) * 32} q 18 -10 36 0 q 18 -10 36 0`} stroke="#bfe9ff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
      ))}
      {/* Segelboot mit Spiegelung */}
      <g transform="translate(430 380)">
        <path d="M -46 0 Q 0 26 46 0 L 34 16 Q 0 30 -34 16 Z" fill="#b3541e" />
        <path d="M -46 0 Q 0 26 46 0 L 40 8 Q 0 26 -40 8 Z" fill="#8a3e14" />
        <rect x="-2" y="-70" width="4" height="70" fill="#6e4527" />
        <path d="M 2 -68 L 44 -6 L 2 -6 Z" fill="#fff" />
        <path d="M 2 -68 L 44 -6 L 20 -6 Z" fill="#e8edf2" />
        <path d="M -2 -60 L -36 -6 L -2 -6 Z" fill="#ff8a5c" />
        <path d="M 2 -70 L 14 -74 L 2 -78 Z" fill="#e05252" />
        <ellipse cx="0" cy="34" rx="42" ry="7" fill="#0c3d5e" opacity="0.25" />
      </g>
      {/* Strand vorn */}
      <path d="M 0 470 Q 300 430 650 475 T 1000 480 L 1000 600 L 0 600 Z" fill="#f4dfa4" />
      <path d="M 0 470 Q 300 430 650 475 T 1000 480 L 1000 492 Q 660 488 320 452 Q 140 448 0 483 Z" fill="#fff" opacity="0.5" />
      {/* Palme mit Schattenseite */}
      <g transform="translate(120 555)">
        <ellipse cx="10" cy="6" rx="42" ry="8" fill="#000" opacity="0.15" />
        <path d="M -6 0 Q -2 -60 18 -92 L 26 -88 Q 8 -58 8 0 Z" fill="#9c6b3f" />
        <path d="M 8 -30 Q 12 -60 24 -89 L 26 -88 Q 12 -56 12 -28 Z" fill="#7a4d2b" />
        {[[-60, -18], [-38, -40], [4, -46], [42, -34], [58, -10]].map(([dx, dy], i) => (
          <path key={i} d={`M 22 -90 Q ${22 + dx * 0.6} ${-95 + dy * 0.6} ${22 + dx} ${-90 + dy}`} stroke="#3f9c53" strokeWidth="10" fill="none" strokeLinecap="round" />
        ))}
        <circle cx="16" cy="-84" r="6" fill="#8a5a35" />
        <circle cx="28" cy="-80" r="5" fill="#8a5a35" />
      </g>
      {/* Muschel + Ball */}
      <g transform="translate(700 555)">
        <ellipse cx="0" cy="5" rx="14" ry="4" fill="#000" opacity="0.12" />
        <path d="M -12 0 A 12 12 0 0 1 12 0 Z" fill="#ffb1c9" />
        <path d="M -6 0 L -4 -10 M 0 0 L 0 -12 M 6 0 L 4 -10" stroke="#e88aa8" strokeWidth="2" />
      </g>
      <g transform="translate(880 545)">
        <ellipse cx="0" cy="14" rx="16" ry="4" fill="#000" opacity="0.15" />
        <circle cx="0" cy="0" r="15" fill="#e05252" />
        <path d="M -15 0 A 15 15 0 0 1 15 0 A 20 8 0 0 0 -15 0" fill="#fff" />
        <circle cx="-5" cy="-6" r="4" fill="#ff9d9d" opacity="0.8" />
      </g>
    </>
  )
}

function Nacht() {
  return (
    <>
      <rect width="1000" height="600" fill="url(#sky-nacht)" />
      {/* Sterne */}
      {[[60, 60, 1], [150, 130, 0.7], [260, 50, 0.9], [370, 110, 0.6], [480, 40, 1], [560, 150, 0.7],
        [660, 70, 0.9], [760, 140, 0.6], [860, 60, 1], [950, 120, 0.8], [200, 220, 0.5], [420, 200, 0.6],
        [720, 230, 0.5], [900, 210, 0.7], [90, 300, 0.4], [530, 280, 0.5]].map(([x, y, o], i) => (
        <Star key={i} x={x} y={y} s={0.5 + o * 0.7} o={o} />
      ))}
      {/* Mond mit Hof und Kratern */}
      <circle cx="660" cy="115" r="95" fill="#fff8d9" opacity="0.18" filter="url(#soft)" />
      <circle cx="660" cy="115" r="52" fill="#f5ecc8" />
      <circle cx="640" cy="100" r="10" fill="#e3d7ac" />
      <circle cx="678" cy="133" r="7" fill="#e3d7ac" />
      <circle cx="665" cy="107" r="4" fill="#d8cb9e" />
      {/* Hügel-Silhouetten */}
      <g filter="url(#far)" opacity="0.9">
        <path d="M 0 360 Q 250 290 520 355 T 1000 345 L 1000 600 L 0 600 Z" fill="#1d3260" />
      </g>
      <path d="M 0 430 Q 300 360 640 425 T 1000 420 L 1000 600 L 0 600 Z" fill="#152548" />
      <path d="M 0 510 Q 350 460 700 505 T 1000 500 L 1000 600 L 0 600 Z" fill="#0e1a36" />
      {/* Tannen-Silhouetten */}
      <Pine x={140} y={505} s={0.9} c="#0e1a36" cd="#0a1428" />
      <Pine x={880} y={495} s={0.8} c="#0e1a36" cd="#0a1428" />
      <Pine x={320} y={490} s={0.6} c="#152548" cd="#0e1a36" />
      {/* Glühwürmchen */}
      {[[240, 470], [420, 520], [610, 480], [760, 540], [90, 550], [530, 560]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="#ffe97a" opacity="0.25" filter="url(#soft)" />
          <circle cx={x} cy={y} r="3" fill="#ffe97a" />
        </g>
      ))}
      {/* Sternschnuppe */}
      <path d="M 180 100 L 260 150" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <Star x={175} y={97} s={1.2} />
    </>
  )
}

function Schloss() {
  return (
    <>
      <rect width="1000" height="600" fill="url(#sky-schloss)" />
      <Sun x={330} y={100} r={40} />
      {/* Regenbogen – Halbkreis, verschwindet hinter den Hügeln */}
      <g opacity="0.8">
        {['#ff5c5c', '#ff9d3c', '#ffd93d', '#58cc02', '#1cb0f6', '#b58aff'].map((c, i) => {
          const r = 340 - i * 15
          return (
            <path key={c} d={`M ${500 - r} 620 A ${r} ${r} 0 0 1 ${500 + r} 620`} stroke={c} strokeWidth="15" fill="none" />
          )
        })}
      </g>
      <Cloud x={260} y={230} s={0.9} />
      <Cloud x={740} y={100} s={0.7} />
      {/* Hügel */}
      <g filter="url(#far)" opacity="0.85">
        <path d="M 0 400 Q 300 330 600 395 T 1000 385 L 1000 600 L 0 600 Z" fill="#a8dd8c" />
      </g>
      <path d="M 0 470 Q 500 380 1000 465 L 1000 600 L 0 600 Z" fill="#78c25e" />
      {/* Schloss – jede Fläche mit Licht- und Schattenseite */}
      <g transform="translate(500 455)">
        <ellipse cx="0" cy="8" rx="190" ry="18" fill="#000" opacity="0.12" />
        {/* Seitentürme */}
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
        {/* Mauer */}
        <rect x="-140" y="-95" width="280" height="95" fill="#efe0c8" />
        <rect x="60" y="-95" width="80" height="95" fill="#dcc8a8" />
        {[-120, -80, -40, 0, 40, 80].map((bx) => (
          <rect key={bx} x={bx} y="-107" width="24" height="14" fill="#efe0c8" />
        ))}
        {/* Hauptturm */}
        <rect x="-45" y="-205" width="90" height="115" fill="#f8ecd8" />
        <rect x="15" y="-205" width="30" height="115" fill="#e0cdad" />
        <path d="M -55 -205 L 0 -280 L 55 -205 Z" fill="#e05252" />
        <path d="M 0 -280 L 55 -205 L 12 -205 Z" fill="#b53e3e" />
        <rect x="-2" y="-305" width="3" height="28" fill="#8a5a35" />
        <path d="M 1 -305 L 30 -296 L 1 -287 Z" fill="#ffd93d" />
        <circle cx="0" cy="-160" r="13" fill="#7ec3ff" stroke="#5a7a9c" strokeWidth="3" />
        {/* Uhr */}
        <circle cx="0" cy="-122" r="11" fill="#fff" stroke="#b8a888" strokeWidth="2.5" />
        <path d="M 0 -122 L 0 -129 M 0 -122 L 5 -119" stroke="#5a4632" strokeWidth="2" strokeLinecap="round" />
        {/* Tor */}
        <rect x="-30" y="-52" width="60" height="52" rx="28" fill="#8a5a35" />
        <rect x="-30" y="-52" width="60" height="52" rx="28" fill="none" stroke="#6e4527" strokeWidth="5" />
        <path d="M 0 -50 L 0 0" stroke="#6e4527" strokeWidth="3" />
        {/* Weg zum Tor */}
        <path d="M -18 0 L 18 0 L 40 40 L -40 40 Z" fill="#e8d5ae" />
      </g>
      {/* Fähnchen + Funkeln */}
      <Star x={330} y={300} s={1.4} o={0.9} />
      <Star x={680} y={280} s={1.1} o={0.8} />
      <Star x={840} y={330} s={1.3} o={0.9} />
      <Flower x={150} y={545} s={1.1} c="#ff7bac" />
      <Flower x={870} y={550} s={1.0} c="#ffd93d" />
      <Flower x={60} y={580} s={0.9} c="#b58aff" />
    </>
  )
}

const SCENES = { wald: Wald, wiese: Wiese, berge: Berge, see: See, nacht: Nacht, schloss: Schloss }

export default function Scene({ theme }) {
  const Inner = SCENES[theme] || Wald
  return (
    <svg
      className="world-scene"
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <Defs />
      <Inner />
    </svg>
  )
}
