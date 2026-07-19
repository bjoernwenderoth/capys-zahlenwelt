import { useMemo } from 'react'
import { DECOR, ANIMATED_DECOR_TYPES } from './registry.js'

// Rendert die Deko-Liste einer Welt (siehe src/data/worldDecor/*.js) an ihrer
// globalen Position auf der Karte. `active=false` lässt die Welt komplett
// weg (kein DOM, keine laufenden CSS-Animationen) – das ist der Lazy-Mounting-
// Hebel: nur die sichtbare Welt + ihre Nachbarn bekommen active=true
// (siehe Panorama.jsx/Path.jsx).
//
// `variant` filtert zusätzlich nach Bewegung: 'dynamic' rendert nur Typen mit
// eigener CSS-Animation (siehe ANIMATED_DECOR_TYPES) – alles Unbewegte davon
// ist bereits Teil der vorgerenderten Hintergrundbilder in Panorama.jsx und
// würde hier doppelt (und unnötig teuer) gerendert. 'static' ist das
// Gegenstück und wird nur vom Capture-Skript zur Bild-Erzeugung gebraucht;
// im normalen Spielbetrieb kommt nur 'dynamic' (oder 'all', z. B. falls eine
// Welt komplett neu gebacken werden muss) zum Einsatz.
export default function WorldDecor({ items, offsetX = 0, active = true, pathLayer = 'above', variant = 'all' }) {
  // items kommt aus den statischen worldDecor-Datendateien (immer dieselbe
  // Array-Referenz) – ohne useMemo würde jeder Re-Render von Panorama (z. B.
  // durch Fortschritts-Updates anderswo im Baum) hier erneut alle Sprites
  // dieser Welt abbilden, auch wenn active=false gar nichts gerendert wird.
  const sprites = useMemo(
    () =>
      items.map((item, i) => {
        const { type, pathLayer: itemPathLayer = 'above', ...props } = item
        if (itemPathLayer !== pathLayer) return null
        if (variant !== 'all') {
          const isAnimated = ANIMATED_DECOR_TYPES.has(type)
          if (variant === 'dynamic' && !isAnimated) return null
          if (variant === 'static' && isAnimated) return null
        }
        const Sprite = DECOR[type]
        return Sprite ? <Sprite key={i} {...props} /> : null
      }),
    [items, pathLayer, variant]
  )

  if (!active) return null
  return <g transform={`translate(${offsetX} 0)`}>{sprites}</g>
}
