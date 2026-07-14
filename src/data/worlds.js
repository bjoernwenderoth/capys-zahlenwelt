import { LEVELS } from './levels.js'

// Der Pfad führt durch 6 Welten. Die nächste Welt wird erst sichtbar,
// wenn alle Level der vorherigen Welt geschafft sind.
export const WORLDS = [
  { id: 'wiese', name: 'Blumenwiese', emoji: '🌸', levelIds: ['lern-5', 'ueben-5', 'lern-10', 'ueben-10', 'wdh-1'] },
  { id: 'wald', name: 'Zahlenwald', emoji: '🌲', levelIds: ['lern-1', 'ueben-1', 'lern-2', 'ueben-2'] },
  { id: 'berge', name: 'Bergwelt', emoji: '⛰️', levelIds: ['lern-3', 'ueben-3', 'lern-4', 'ueben-4', 'wdh-2'] },
  { id: 'see', name: 'Sonnensee', emoji: '⛵', levelIds: ['lern-6', 'ueben-6', 'lern-7', 'ueben-7', 'wdh-3'] },
  { id: 'nacht', name: 'Sternenhimmel', emoji: '🌙', levelIds: ['lern-8', 'ueben-8', 'lern-9', 'ueben-9', 'wdh-4'] },
  { id: 'schloss', name: 'Königsschloss', emoji: '🏰', levelIds: ['final-1', 'final-2', 'final-3'] }
].map((w) => ({
  ...w,
  levels: w.levelIds.map((id) => LEVELS.find((l) => l.id === id))
}))

export function worldDone(world, progress) {
  return world.levels.every((lv) => (progress[lv.id] || 0) > 0)
}

// Temporär: alle Welten sichtbar/entsperrt, während die Welten gestaltet
// werden. Zum Reaktivieren der normalen Freischaltung einfach false setzen.
export const SHOW_ALL_WORLDS = true

export function worldUnlocked(index, progress) {
  return SHOW_ALL_WORLDS || index === 0 || worldDone(WORLDS[index - 1], progress)
}

// Level-Stationen auf dem Boden jeder Szene (Koordinaten im 1000×600-Raum).
// Der Weg schlängelt sich durch den begehbaren Bereich der Landschaft – aber
// NUR über die beiden vorderen Boden-Ebenen (mittlerer + vorderer Boden in
// Panorama.jsx, y ≈ 430–580). Er bleibt bewusst unterhalb der fernen
// Hügel-/Baumlinie am Horizont, statt darüber hinauszuragen. Bäume & Co.
// werden in Panorama.jsx INNERHALB des Bodens, aber VOR dem Weg gezeichnet
// (siehe roadLayer), Deko darf den Weg also überlappen/verdecken – er muss
// ihr nicht mehr geometrisch ausweichen.
export const WORLD_NODES = {
  wald: [[190, 470], [420, 438], [640, 500], [860, 448]],
  wiese: [[150, 470], [300, 436], [480, 505], [660, 442], [900, 478]],
  berge: [[60, 560], [260, 500], [470, 565], [700, 505], [860, 550]],
  see: [[170, 560], [300, 500], [480, 558], [680, 502], [900, 545]],
  nacht: [[80, 525], [300, 462], [470, 548], [680, 468], [940, 535]],
  schloss: [[140, 545], [500, 505], [860, 548]]
}

// Alle Level in Spielreihenfolge und ihre Positionen auf der großen Karte
// (jede Welt belegt 1000 Einheiten in x-Richtung)
export const ORDERED_LEVELS = WORLDS.flatMap((w) => w.levels)

export const GLOBAL_NODES = WORLDS.flatMap((w, wi) =>
  WORLD_NODES[w.id].map(([x, y]) => [wi * 1000 + x, y])
)

export const MAP_WIDTH = WORLDS.length * 1000

export const JUNCTION_Y = 540

export function extendedPoints(nodes, exitX = 1002) {
  return [
    [-2, JUNCTION_Y],
    ...nodes,
    [exitX, JUNCTION_Y]
  ]
}

function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t
  const t3 = t2 * t
  return [
    0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
    0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
  ]
}

// Sanftes, handgezeichnet wirkendes Schlängeln quer zur Laufrichtung –
// pro Segment leicht anders (Frequenz/Phase hängen vom Segmentindex ab),
// damit der Weg nicht wie eine gleichförmige Sinuskurve wirkt. Läuft an
// beiden Segment-Enden auf 0 aus, damit die Level-Knoten exakt auf dem
// Weg liegen bleiben.
function handDrawnWiggle(i, t) {
  const phase = i * 2.7 + 1.3
  const f1 = 1.5 + (i % 3) * 0.4
  const f2 = 2.6 + (i % 2) * 0.6
  const envelope = Math.sin(Math.PI * t)
  return envelope * (11 * Math.sin(f1 * Math.PI * t + phase) + 5 * Math.sin(f2 * Math.PI * t + phase * 1.7))
}

// Punkte eines Kurvenabschnitts (Segment i: von pts[i] nach pts[i+1])
export function sampleSegment(pts, i, n = 30) {
  const p0 = pts[Math.max(0, i - 1)]
  const p1 = pts[i]
  const p2 = pts[i + 1]
  const p3 = pts[Math.min(pts.length - 1, i + 2)]
  const raw = []
  for (let k = 0; k <= n; k++) raw.push(catmull(p0, p1, p2, p3, k / n))
  const out = raw.map((pt, k) => {
    const prev = raw[Math.max(0, k - 1)]
    const next = raw[Math.min(raw.length - 1, k + 1)]
    const dx = next[0] - prev[0]
    const dy = next[1] - prev[1]
    const len = Math.hypot(dx, dy) || 1
    const w = handDrawnWiggle(i, k / n)
    return [pt[0] + (-dy / len) * w, pt[1] + (dx / len) * w]
  })
  return out
}

// Tiefen-Anteil eines y-Werts (0 = hinten, 1 = vorne).
// Gilt für ALLE Welten gleich, damit Weg und Figuren an den
// Weltgrenzen exakt gleich groß sind und nahtlos übergehen.
export function depthNorm(y) {
  return Math.min(1, Math.max(0, (y - 380) / 200))
}
