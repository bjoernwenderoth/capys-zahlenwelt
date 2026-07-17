// Deko-Liste "Zahlenwald" – lokale Koordinaten (0..1000), siehe wiese.js.
export default [
  // hintere Baumreihe: klein, dunkler, nah am Horizont
  { type: 'pine', x: 90, y: 430, s: 0.5, c: '#2e6e3c', cd: '#1f5c33' },
  { type: 'tree', x: 140, y: 398, s: 0.42, dark: true },
  { type: 'pine', x: 265, y: 402, s: 0.48, c: '#2e6e3c', cd: '#1f5c33' },
  { type: 'tree', x: 560, y: 400, s: 0.46, dark: true },
  { type: 'pine', x: 655, y: 392, s: 0.5, c: '#2e6e3c', cd: '#1f5c33' },
  { type: 'tree', x: 780, y: 415, s: 0.48, dark: true },
  { type: 'pine', x: 925, y: 432, s: 0.55, c: '#2e6e3c', cd: '#1f5c33' },

  // mittlere Baumreihe, entlang der Weg-Aussparungen
  { type: 'tree', x: 160, y: 505, s: 1.2 },
  { type: 'tree', x: 330, y: 452, s: 0.85, dark: true },
  { type: 'pine', x: 520, y: 500, s: 0.8 },
  { type: 'tree', x: 700, y: 458, s: 0.8 },
  { type: 'pine', x: 870, y: 520, s: 0.95 },

  // vordere, größere Baumreihe – rahmt die Szene
  { type: 'pine', x: 110, y: 560, s: 0.95 },
  { type: 'tree', x: 460, y: 545, s: 0.95, dark: true },
  { type: 'pine', x: 565, y: 565, s: 0.8 },
  { type: 'tree', x: 900, y: 565, s: 1.05, dark: true },

  // Waldboden: Farne, Pilze, ein umgestürzter Stamm
  { type: 'fern', x: 175, y: 588, s: 1 },
  { type: 'fern', x: 355, y: 548, s: 0.9 },
  { type: 'fern', x: 615, y: 588, s: 1.05 },
  { type: 'fern', x: 875, y: 562, s: 0.9 },
  { type: 'log', x: 475, y: 592, s: 0.85, rot: -6 },
  { type: 'mushroom', x: 250, y: 560 },
  { type: 'mushroom', x: 790, y: 572, s: 0.8, cap: '#e08a3c' },
  { type: 'mushroom', x: 880, y: 558, s: 0.6, cap: '#e08a3c' },

  // Waldtiere
  { type: 'rabbit', x: 700, y: 530, s: 0.8 },
  { type: 'bear', x: 390, y: 575, s: 1.05 }
]
