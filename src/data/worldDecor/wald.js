// Deko-Liste "Zahlenwald" – lokale Koordinaten (0..1000), siehe wiese.js.
export default [
  // hintere Baumreihe: klein, dunkler, nah am Horizont
  { type: 'pine', x: 90, y: 430, s: 0.5, c: '#2e6e3c', cd: '#1f5c33' },

  { type: 'tree', x: 800, y: 422, s: 0.48, dark: true },
  { type: 'pine', x: 931, y: 421, s: 0.55, c: '#2e6e3c', cd: '#1f5c33' },

  // mittlere Baumreihe, entlang der Weg-Aussparungen
  { type: 'tree', x: 15, y: 550, s: 1.2 },
  { type: 'tree', x: 380, y: 450, s: 0.85, dark: true },
  { type: 'pine', x: 552, y: 490, s: 0.8 },
  { type: 'tree', x: 732, y: 471, s: 0.8 },
  { type: 'pine', x: 900, y: 530, s: 0.95 },

  // vordere, größere Baumreihe – rahmt die Szene
  { type: 'pine', x: 225, y: 567, s: 0.95 },
  { type: 'tree', x: 395, y: 563, s: 0.95, dark: true },
  { type: 'pine', x: 615, y: 568, s: 0.8 },
  { type: 'tree', x: 985, y: 560, s: 1.05, dark: true },

  // Waldboden: Farne, Pilze, ein umgestürzter Stamm
  { type: 'fern', x: 175, y: 588, s: 1 },
  { type: 'fern', x: 355, y: 548, s: 0.9 },
  { type: 'fern', x: 615, y: 588, s: 1.05 },
  { type: 'fern', x: 875, y: 562, s: 0.9 },
  { type: 'log', x: 555, y: 510, s: 0.8, rot: -12 },
  { type: 'mushroom', x: 250, y: 560 },
  { type: 'mushroom', x: 790, y: 572, s: 0.8, cap: '#e08a3c' },
  { type: 'mushroom', x: 880, y: 558, s: 0.6, cap: '#e08a3c' },

  // Waldtiere
  { type: 'rabbit', x: 700, y: 530, s: 0.8 },
  { type: 'bear', x: 390, y: 557, s: 1.05 }
]
