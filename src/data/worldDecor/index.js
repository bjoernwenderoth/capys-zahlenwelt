import wiese from './wiese.js'
import wald from './wald.js'
import berge from './berge.js'
import see from './see.js'
import nacht from './nacht.js'
import schloss from './schloss.js'

// Reihenfolge entspricht WORLDS in data/worlds.js, jede Welt belegt 1000
// Einheiten – offsetX wird daraus abgeleitet statt von Hand eingetragen, damit
// eine neue Welt nur einen weiteren Eintrag hier braucht. Bewusst trotzdem
// nicht aus worlds.js importiert, damit Panorama rein visuelle Daten bleibt
// und nicht vom Fortschritts-/Level-Datenmodell abhängt.
const WORLDS_IN_ORDER = [
  { id: 'wiese', items: wiese },
  { id: 'wald', items: wald },
  { id: 'berge', items: berge },
  { id: 'see', items: see },
  { id: 'nacht', items: nacht },
  { id: 'schloss', items: schloss.background }
]

export const WORLD_DECOR = WORLDS_IN_ORDER.map((w, i) => ({ ...w, offsetX: i * 1000 }))

export const SCHLOSS_FOREGROUND = {
  id: 'schloss',
  offsetX: (WORLD_DECOR.length - 1) * 1000,
  items: schloss.foreground
}
