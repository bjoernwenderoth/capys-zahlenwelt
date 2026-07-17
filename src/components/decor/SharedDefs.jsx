// Gemeinsame SVG-Defs (Filter/Gradients) für die gesamte Panorama-Karte –
// sowohl das Terrain (Panorama.jsx) als auch die Deko-Sprites (sprites.jsx)
// referenzieren diese IDs per url(#...). Einmal pro Karte gerendert.
export default function SharedDefs() {
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
