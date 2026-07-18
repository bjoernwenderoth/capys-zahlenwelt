// Deko-Liste "Bergwelt" – lokale Koordinaten (0..1000), siehe wiese.js.
// Die großen Berg-Silhouetten selbst gehören zum Gelände (Panorama.jsx) und
// bleiben dort, da sie fest mit dem durchgehenden Boden-Pfad verzahnt sind.
export default [
  { type: 'mountainBridge', x: 355, y: 516, s: 0.9, pathLayer: 'below' },

  // zweite, höher gelegene Bodenebene: kleinere Vegetation und Geröll
  { type: 'pine', x: 115, y: 440, s: 0.42, c: '#3b7650', cd: '#285c3b' },
  { type: 'rock', x: 185, y: 448, s: 0.48 },
  { type: 'alpineFlower', x: 240, y: 444, s: 0.58 },
  { type: 'goat', x: 254, y: 444, s: 0.5 },
  { type: 'pine', x: 440, y: 456, s: 0.46, c: '#3b7650', cd: '#285c3b' },
  { type: 'cairn', x: 464, y: 455, s: 0.52 },
  { type: 'alpineFlower', x: 535, y: 448, s: 0.55 },
  { type: 'rock', x: 635, y: 445, s: 0.5 },
  { type: 'goat', x: 685, y: 451, s: 0.46 },
  { type: 'pine', x: 745, y: 455, s: 0.44, c: '#3b7650', cd: '#285c3b' },
  { type: 'cairn', x: 835, y: 449, s: 0.48 },
  { type: 'alpineFlower', x: 910, y: 443, s: 0.58 },
  { type: 'pine', x: 935, y: 410, s: 0.4, c: '#3b7650', cd: '#285c3b' },

  // Kiefern in mehreren Reihen, unterschiedlich groß für Tiefe
  { type: 'pine', x: 129, y: 528, s: 0.8 },
  { type: 'pine', x: 633, y: 558, s: 0.85 },
  { type: 'pine', x: 922, y: 488, s: 0.7 },
  { type: 'pine', x: 35, y: 478, s: 0.6 },
  { type: 'pine', x: 198, y: 568, s: 0.7 },
  { type: 'pine', x: 340, y: 572, s: 0.55 },
  { type: 'pine', x: 550, y: 571, s: 0.75 },
  { type: 'pine', x: 780, y: 565, s: 0.65 },
  { type: 'pine', x: 930, y: 570, s: 0.7 },
  { type: 'pine', x: 980, y: 494, s: 0.6 },

  // Felsbrocken & Steinmänner säumen den Bergpfad
  { type: 'rock', x: 150, y: 563, s: 1 },
  { type: 'rock', x: 527, y: 565, s: 0.85 },
  { type: 'rock', x: 620, y: 569, s: 0.6 },
  { type: 'rock', x: 760, y: 563, s: 0.95 },
  { type: 'rock', x: 920, y: 563, s: 0.65 },
  { type: 'cairn', x: 520, y: 574, s: 0.62 },
  { type: 'cairn', x: 790, y: 570, s: 0.7 },

  // Alpenblumen zwischen den Felsen
  { type: 'alpineFlower', x: 80, y: 600, s: 0.8 },
  { type: 'alpineFlower', x: 180, y: 548, s: 0.7 },
  { type: 'alpineFlower', x: 280, y: 585, s: 0.9 },
  { type: 'alpineFlower', x: 380, y: 610, s: 0.75 },
  { type: 'alpineFlower', x: 480, y: 555, s: 0.8 },
  { type: 'alpineFlower', x: 580, y: 600, s: 0.7 },
  { type: 'alpineFlower', x: 680, y: 548, s: 0.85 },
  { type: 'alpineFlower', x: 780, y: 608, s: 0.75 },
  { type: 'alpineFlower', x: 880, y: 540, s: 0.8 },
  { type: 'alpineFlower', x: 925, y: 598, s: 0.7 },

  // Steinböcke stehen still auf den Felsen
  { type: 'goat', x: 200, y: 562, s: 0.85 },
  { type: 'goat', x: 775, y: 563, s: 0.75 },

  // Adler ziehen ruhige Kreise hoch über den Gipfeln
  { type: 'eagle', x: 200, y: 170, s: 1 },
  { type: 'eagle', x: 650, y: 140, s: 0.9 },
  { type: 'eagle', x: 900, y: 190, s: 0.8 }
]
