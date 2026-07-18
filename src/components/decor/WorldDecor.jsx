import { useMemo } from 'react'
import { DECOR } from './registry.js'

// Rendert die Deko-Liste einer Welt (siehe src/data/worldDecor/*.js) an ihrer
// globalen Position auf der Karte. `active=false` lässt die Welt komplett
// weg (kein DOM, keine laufenden CSS-Animationen) – das ist der Lazy-Mounting-
// Hebel: nur die sichtbare Welt + ihre Nachbarn bekommen active=true
// (siehe Panorama.jsx/Path.jsx).
export default function WorldDecor({ items, offsetX = 0, active = true, pathLayer = 'above' }) {
  // items kommt aus den statischen worldDecor-Datendateien (immer dieselbe
  // Array-Referenz) – ohne useMemo würde jeder Re-Render von Panorama (z. B.
  // durch Fortschritts-Updates anderswo im Baum) hier erneut alle Sprites
  // dieser Welt abbilden, auch wenn active=false gar nichts gerendert wird.
  const sprites = useMemo(
    () =>
      items.map((item, i) => {
        const { type, pathLayer: itemPathLayer = 'above', ...props } = item
        if (itemPathLayer !== pathLayer) return null
        const Sprite = DECOR[type]
        return Sprite ? <Sprite key={i} {...props} /> : null
      }),
    [items, pathLayer]
  )

  if (!active) return null
  return <g transform={`translate(${offsetX} 0)`}>{sprites}</g>
}
