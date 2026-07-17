// Deko-Liste "Königsschloss" – lokale Koordinaten (0..1000), siehe wiese.js.
// Aufgeteilt in background/foreground, weil die generierte Schatztruhe
// (ein <image>, braucht import.meta.env.BASE_URL) zwischen Schloss-Büschen
// und Kleindeko liegt und dafür in Panorama.jsx fest verdrahtet bleibt.

export default {
  // Weg + Schloss + Büsche (Vorderseite)
  background: [
    { type: 'castleApproach', x: 500, y: 424, s: 0.92, greenery: false },
    { type: 'castle', x: 500, y: 425, s: 0.94 },
    { type: 'castleApproach', x: 500, y: 424, s: 0.92, path: false }
  ],

  // Kleindeko, die vor/über der Schatztruhe liegt
  foreground: [
    { type: 'heraldicShield', x: 250, y: 472, s: 0.62 },
    { type: 'heraldicShield', x: 750, y: 474, s: 0.62, flip: true },
    { type: 'royalLantern', x: 335, y: 505, s: 0.62 },
    { type: 'royalLantern', x: 665, y: 505, s: 0.62 },
    { type: 'stoneBench', x: 225, y: 565, s: 0.76 },
    { type: 'stoneBench', x: 775, y: 565, s: 0.76, flip: true },
    { type: 'crownPlanter', x: 375, y: 566, s: 0.74, c: '#f18aaf' },
    { type: 'crownPlanter', x: 625, y: 566, s: 0.74, c: '#b995e8' },
    { type: 'star', x: 240, y: 300, s: 1.4, o: 0.9 },
    { type: 'star', x: 760, y: 280, s: 1.1, o: 0.8 },
    { type: 'flower', x: 130, y: 555, s: 1.05, c: '#ff7bac' },
    { type: 'flower', x: 960, y: 520, s: 0.85, c: '#b58aff' }
  ]
}
