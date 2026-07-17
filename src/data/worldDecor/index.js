import wiese from './wiese.js'
import wald from './wald.js'
import berge from './berge.js'
import see from './see.js'
import nacht from './nacht.js'
import * as schloss from './schloss.js'

// Reihenfolge und globale x-Offsets entsprechen WORLDS in data/worlds.js
// (jede Welt belegt 1000 Einheiten). Bewusst hier separat gehalten statt aus
// worlds.js importiert, damit Panorama rein visuelle Daten bleibt und nicht
// vom Fortschritts-/Level-Datenmodell abhängt.
export const WORLD_DECOR = [
  { id: 'wiese', offsetX: 0, items: wiese },
  { id: 'wald', offsetX: 1000, items: wald },
  { id: 'berge', offsetX: 2000, items: berge },
  { id: 'see', offsetX: 3000, items: see },
  { id: 'nacht', offsetX: 4000, items: nacht },
  { id: 'schloss', offsetX: 5000, items: schloss.background }
]

export const SCHLOSS_FOREGROUND = { id: 'schloss', offsetX: 5000, items: schloss.foreground }
