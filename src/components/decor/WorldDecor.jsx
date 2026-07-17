import { DECOR } from './registry.js'

// Rendert die Deko-Liste einer Welt (siehe src/data/worldDecor/*.js) an ihrer
// globalen Position auf der Karte. `active=false` lässt die Welt komplett
// weg (kein DOM, keine laufenden CSS-Animationen) – das ist der Lazy-Mounting-
// Hebel: nur die sichtbare Welt + ihre Nachbarn bekommen active=true
// (siehe Panorama.jsx/Path.jsx).
export default function WorldDecor({ items, offsetX = 0, active = true }) {
  if (!active) return null
  return (
    <g transform={`translate(${offsetX} 0)`}>
      {items.map((item, i) => {
        const { type, ...props } = item
        const Sprite = DECOR[type]
        return Sprite ? <Sprite key={i} {...props} /> : null
      })}
    </g>
  )
}
