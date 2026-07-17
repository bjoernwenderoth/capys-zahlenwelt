// Deko-Liste "Sonnensee" – lokale Koordinaten (0..1000), siehe wiese.js.
// Die Seeform selbst (Ufer/Sand/Wasser/Spiegelungen) gehört zum Gelände
// (Panorama.jsx) und bleibt dort, da ihre Kontur exakt an die Boden-Kurve
// angepasst ist.
export default [
  { type: 'lakeShimmer', x: 195, y: 405, width: 42, opacity: 0.48, delay: 0 },
  { type: 'lakeShimmer', x: 290, y: 392, width: 30, opacity: 0.38, delay: 0.45 },
  { type: 'lakeShimmer', x: 428, y: 419, width: 48, opacity: 0.5, delay: 0.9 },
  { type: 'lakeShimmer', x: 520, y: 388, width: 32, opacity: 0.34, delay: 1.35 },
  { type: 'lakeShimmer', x: 665, y: 414, width: 44, opacity: 0.46, delay: 1.8 },
  { type: 'lakeShimmer', x: 785, y: 402, width: 34, opacity: 0.42, delay: 2.25 },

  // kleines Boot weiter hinten/höher, größeres näher an der Wasserkante
  { type: 'boat', x: 395, y: 395, s: 0.36 },
  { type: 'boat', x: 550, y: 401, s: 0.65 },

  { type: 'fish', x: 238, y: 400, s: 0.74, rot: -8 },
  { type: 'fish', x: 765, y: 399, s: 0.68, rot: -6, flip: true },

  { type: 'swimRing', x: 315, y: 410, s: 0.62, rot: -4 },

  { type: 'seagull', x: 200, y: 345, s: 1 },
  { type: 'seagull', x: 550, y: 328, s: 0.85 },
  { type: 'seagull', x: 820, y: 358, s: 0.9 },

  // Palmen bilden einen lockeren Rahmen
  { type: 'palm', x: 81, y: 547, s: 0.95 },
  { type: 'palm', x: 978, y: 566, s: 0.75 },
  { type: 'palm', x: 877, y: 471, s: 0.48 },

  // Größere Strandobjekte mit Abstand zwischen den Levelstationen
  { type: 'sandcastle', x: 237, y: 557, s: 0.82 },
  { type: 'beachToys', x: 545, y: 590, s: 0.78 },
  { type: 'umbrella', x: 800, y: 539, s: 0.72 },
  { type: 'crab', x: 385, y: 535, s: 0.72 },
  { type: 'crab', x: 705, y: 586, s: 0.66 },

  // Vegetation und Fundstücke von der Wasserkante bis in den Vordergrund
  { type: 'duneGrass', x: 40, y: 505, s: 0.72 },
  { type: 'duneGrass', x: 150, y: 598, s: 0.82 },
  { type: 'duneGrass', x: 515, y: 474, s: 0.62 },
  { type: 'duneGrass', x: 625, y: 600, s: 0.86 },
  { type: 'duneGrass', x: 940, y: 505, s: 0.7 },

  { type: 'shell', x: 115, y: 482, s: 0.6, rot: -14, c: '#ffb199' },
  { type: 'shell', x: 305, y: 594, s: 0.75, rot: 9, c: '#ffd9a3' },
  { type: 'shell', x: 440, y: 475, s: 0.58, rot: -8, c: '#f4c6a4' },
  { type: 'shell', x: 590, y: 566, s: 0.68, rot: 15, c: '#f4dfa4' },
  { type: 'shell', x: 755, y: 535, s: 0.7, rot: -12, c: '#ffb199' },
  { type: 'shell', x: 955, y: 596, s: 0.62, rot: 8, c: '#ffd9a3' },

  { type: 'starfish', x: 270, y: 532, s: 0.66, rot: -18, c: '#ff8a5c' },
  { type: 'starfish', x: 485, y: 596, s: 0.76, rot: 14, c: '#ff9d78' },
  { type: 'starfish', x: 650, y: 472, s: 0.56, rot: -9, c: '#ffb199' },
  { type: 'starfish', x: 900, y: 558, s: 0.68, rot: 22, c: '#ff8a5c' },

  // dezente Sandspuren füllen nur die großen Zwischenräume
  { type: 'beachMarks', x: 75, y: 580, s: 0.9, rot: -8 },
  { type: 'beachMarks', x: 345, y: 472, s: 0.72, rot: 12 },
  { type: 'beachMarks', x: 425, y: 570, s: 0.9, rot: -15 },
  { type: 'beachMarks', x: 560, y: 505, s: 0.78, rot: 8 },
  { type: 'beachMarks', x: 725, y: 472, s: 0.68, rot: -5 },
  { type: 'beachMarks', x: 860, y: 600, s: 0.85, rot: 14 }
]
