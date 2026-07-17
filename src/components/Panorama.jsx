// Eine einzige zusammenhängende Landkarte für alle Welten (6000 × 600).
// Himmel und Boden gehen fließend ineinander über, ein durchgehender
// Weg verbindet alle Level. Themen-Deko markiert die Regionen:
// Blumenwiese → Wald → Berge → Sonnensee → Sternenhimmel → Königsschloss
//
// Vier Tiefenebenen (Himmel, ferne Hügel, Wolken, Hauptebene mit dem Weg)
// bewegen sich beim Scrollen minimal unterschiedlich schnell (siehe --scroll
// in Path.jsx), dazu kommen dezente Animationen (Treiben, Glitzern, Wiegen)
// für einen lebendigeren, weniger flachen Look.
//
// Terrain (Himmel/Hügel/Boden/See-/Bachform) ist hier bewusst weiter fest
// codiert – seine Kontur ist durchgehend über die ganze Karte verzahnt (z. B.
// läuft die Bodenkurve unverändert durch alle 6 Welten). Die eigentliche
// Themen-DEKO (Bäume, Tiere, Strandsachen, Schloss-Kleinteile, …) kommt
// dagegen aus src/data/worldDecor/*.js und wird über WorldDecor gerendert –
// so lässt sich eine Welt neu bepflanzen, ohne diese Datei anzufassen, und
// nicht sichtbare Welten können ohne DOM/Animationen bleiben (active=false).

import { Cloud, Sun, Mountain, Star } from './Scenes.jsx'
import { MountainStream, ShootingStar } from './decor/sprites.jsx'
import WorldDecor from './decor/WorldDecor.jsx'
import { WORLD_DECOR, SCHLOSS_FOREGROUND } from '../data/worldDecor/index.js'

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

// activeWorldWindow = [ersterIndex, letzterIndex] der Welten (0..5, Reihenfolge
// wie WORLD_DECOR/WORLDS), deren Deko tatsächlich gerendert wird. Welten
// außerhalb bleiben ohne Deko-DOM und ohne laufende CSS-Animationen – Boden,
// Weg und Levelknoten bleiben davon unberührt (siehe Path.jsx).
export default function Panorama({ roadLayer, activeWorldWindow = [0, 5] } = {}) {
  const [activeLo, activeHi] = activeWorldWindow
  const isWorldActive = (i) => i >= activeLo && i <= activeHi

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

        {/* ---------- Sonnensee: Ufer/Sand/Wasser ----------
            Bleibt hier fest codiert (wie der Bach) statt in den Welt-Deko-
            Daten, weil die Kontur exakt an die Boden-Kurve angepasst ist.
            Unregelmäßige, gestaffelte Uferzonen betten den See ins Gelände
            ein. Der dunkle Außenrand liegt nur an der nahen Kante und wirkt
            wie eine flache Böschung statt wie ein Schlagschatten unter einer
            Scheibe. */}
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

        {/* Themen-Deko je Welt (Bäume, Tiere, Strand-/Bergsachen, …) – siehe
            src/data/worldDecor/*.js. Nicht aktive Welten (weit außerhalb des
            sichtbaren Bereichs) werden ausgelassen: kein DOM, keine
            CSS-Animationen. Bekannter, bewusst nicht gelöster Sonderfall:
            läuft Capy quer über mehrere übersprungene Welten (Wiederholen
            eines alten Levels), bleibt deren Deko für die Dauer der
            Laufanimation ausgeblendet – Boden und Weg bleiben aber sichtbar. */}
        {WORLD_DECOR.map((w, i) => (
          <WorldDecor key={w.id} items={w.items} offsetX={w.offsetX} active={isWorldActive(i)} />
        ))}

        {/* Generierte, freigestellte Schatztruhe als finales Reiseziel – fest
            zwischen Schloss-Hintergrund (Weg/Gebäude/Büsche) und -Kleindeko
            verdrahtet, da sie ein einmaliges <image> mit BASE_URL ist. */}
        <image
          href={`${import.meta.env.BASE_URL}assets/generated/royal-treasure.png`}
          x="5775" y="390" width="170" height="170"
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: 'saturate(0.72) contrast(0.92) brightness(0.98)' }}
        />
        <WorldDecor items={SCHLOSS_FOREGROUND.items} offsetX={SCHLOSS_FOREGROUND.offsetX} active={isWorldActive(5)} />
      </svg>
    </div>
  )
}
