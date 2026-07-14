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

export function worldUnlocked(index, progress) {
  return index === 0 || worldDone(WORLDS[index - 1], progress)
}

// Level-Stationen auf dem Boden jeder Szene (Koordinaten im 1000×600-Raum).
// Der Weg schlängelt sich durch den begehbaren Bereich der Landschaft:
// höher = weiter hinten (kleiner), tiefer = weiter vorne (größer).
// Die Punkte sind bewusst an den Baum-/Tannen-Positionen in Panorama.jsx
// vorbeigeführt (daneben statt durch die Baumkrone), damit Weg und Knoten
// nicht über die Deko hinweglaufen, sondern sich in die Szene einfügen.
export const WORLD_NODES = {
  wald: [[200, 460], [400, 385], [620, 490], [850, 405]],
  wiese: [[160, 455], [280, 380], [490, 500], [700, 390], [900, 480]],
  berge: [[50, 555], [280, 502], [490, 560], [740, 495], [850, 555]],
  see: [[180, 565], [280, 496], [490, 556], [700, 496], [900, 540]],
  nacht: [[90, 520], [280, 455], [490, 545], [700, 460], [940, 538]],
  schloss: [[150, 540], [500, 508], [850, 545]]
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

// Punkte eines Kurvenabschnitts (Segment i: von pts[i] nach pts[i+1])
export function sampleSegment(pts, i, n = 30) {
  const p0 = pts[Math.max(0, i - 1)]
  const p1 = pts[i]
  const p2 = pts[i + 1]
  const p3 = pts[Math.min(pts.length - 1, i + 2)]
  const out = []
  for (let k = 0; k <= n; k++) out.push(catmull(p0, p1, p2, p3, k / n))
  return out
}

export function samplePath(pts, perSeg = 16) {
  const out = []
  for (let i = 0; i < pts.length - 1; i++) {
    const seg = sampleSegment(pts, i, perSeg)
    out.push(...(i === 0 ? seg : seg.slice(1)))
  }
  return out
}

// Tiefen-Anteil eines y-Werts (0 = hinten, 1 = vorne).
// Gilt für ALLE Welten gleich, damit Weg und Figuren an den
// Weltgrenzen exakt gleich groß sind und nahtlos übergehen.
export function depthNorm(y) {
  return Math.min(1, Math.max(0, (y - 380) / 200))
}

// Perspektivisches Weg-Band: hinten schmal, vorne breit
export function ribbonPaths(nodes, exitX = 1002) {
  const samples = samplePath(extendedPoints(nodes, exitX))
  const half = (y, f = 1) => (13 + 19 * depthNorm(y)) * f

  function toPath(f) {
    const left = []
    const right = []
    for (let i = 0; i < samples.length; i++) {
      const cur = samples[i]
      const prev = samples[Math.max(0, i - 1)]
      const next = samples[Math.min(samples.length - 1, i + 1)]
      const dx = next[0] - prev[0]
      const dy = next[1] - prev[1]
      const len = Math.hypot(dx, dy) || 1
      const h = half(cur[1], f)
      // Normale zur Laufrichtung: eine Seite links, eine rechts vom Weg
      const nx = (-dy / len) * h
      const ny = (dx / len) * h
      left.push([cur[0] + nx, cur[1] + ny])
      right.push([cur[0] - nx, cur[1] - ny])
    }
    right.reverse()
    return (
      'M ' +
      left.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ') +
      ' L ' +
      right.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ') +
      ' Z'
    )
  }

  return { outer: toPath(1), inner: toPath(0.68), center: samples }
}
