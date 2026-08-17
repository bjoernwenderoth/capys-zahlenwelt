// Deko-Liste "Blumenwiese" – Koordinaten lokal im 1000×600-Raum dieser Welt
// (wie WORLD_NODES in worlds.js). WorldDecor verschiebt sie beim Rendern an
// die richtige Stelle der Gesamtkarte.
export default [
  { type: 'glow', x: 500, y: 480, rx: 620, ry: 180, fill: '#fff3c2', opacity: 0.14 },

  { type: 'tree', x: 72, y: 470, s: 0.8, dark: true },
  { type: 'flower', x: 180, y: 520, s: 1.1, c: '#ff5c8a' },
  { type: 'flower', x: 350, y: 500, s: 0.85, c: '#b58aff' },
  { type: 'flower', x: 420, y: 555, s: 1.2, c: '#ffd93d' },
  { type: 'flower', x: 580, y: 500, s: 0.95, c: '#ff7bac' },
  { type: 'flower', x: 700, y: 545, s: 1.1, c: '#ff8a5c' },
  { type: 'flower', x: 830, y: 490, s: 0.85, c: '#7ec3ff' },
  { type: 'flower', x: 890, y: 560, s: 1.15, c: '#ffd93d' },

  // dichte Streu aus kleinen Gänseblümchen zwischen den großen Blüten
 

  { type: 'bee', x: 400, y: 420, s: 1 },
  { type: 'bee', x: 760, y: 440, s: 0.9 },

  { type: 'butterfly', x: 400, y: 330, s: 1.05, c: '#7ec3ff' },
  { type: 'butterfly', x: 750, y: 290, s: 0.8, c: '#ffb1c9' }
]
