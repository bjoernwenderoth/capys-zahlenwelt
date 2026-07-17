// Deko-Liste "Bergwelt" – lokale Koordinaten (0..1000), siehe wiese.js.
// Die großen Berg-Silhouetten selbst gehören zum Gelände (Panorama.jsx) und
// bleiben dort, da sie fest mit dem durchgehenden Boden-Pfad verzahnt sind.
export default [
  { type: 'mountainBridge', x: 355, y: 526, s: 0.9 },

  // zweite, höher gelegene Bodenebene: kleinere Vegetation und Geröll
  { type: 'pine', x: 115, y: 444, s: 0.42, c: '#3b7650', cd: '#285c3b' },
  { type: 'rock', x: 185, y: 448, s: 0.48 },
  { type: 'alpineFlower', x: 240, y: 444, s: 0.58 },
  { type: 'goat', x: 255, y: 456, s: 0.5 },
  { type: 'pine', x: 440, y: 463, s: 0.46, c: '#3b7650', cd: '#285c3b' },
  { type: 'cairn', x: 460, y: 455, s: 0.52 },
  { type: 'alpineFlower', x: 535, y: 448, s: 0.55 },
  { type: 'rock', x: 635, y: 447, s: 0.5 },
  { type: 'goat', x: 685, y: 452, s: 0.46 },
  { type: 'pine', x: 745, y: 458, s: 0.44, c: '#3b7650', cd: '#285c3b' },
  { type: 'cairn', x: 835, y: 449, s: 0.48 },
  { type: 'alpineFlower', x: 910, y: 443, s: 0.58 },
  { type: 'pine', x: 935, y: 452, s: 0.4, c: '#3b7650', cd: '#285c3b' },

  // Kiefern in mehreren Reihen, unterschiedlich groß für Tiefe
  { type: 'pine', x: 100, y: 545, s: 0.8 },
  { type: 'pine', x: 430, y: 525, s: 0.6 },
  { type: 'pine', x: 650, y: 555, s: 0.85 },
  { type: 'pine', x: 920, y: 540, s: 0.7 },
  { type: 'pine', x: 50, y: 588, s: 0.6 },
  { type: 'pine', x: 200, y: 568, s: 0.7 },
  { type: 'pine', x: 285, y: 592, s: 0.55 },
  { type: 'pine', x: 550, y: 582, s: 0.75 },
  { type: 'pine', x: 780, y: 565, s: 0.65 },
  { type: 'pine', x: 870, y: 592, s: 0.7 },
  { type: 'pine', x: 930, y: 562, s: 0.6 },

  // Felsbrocken & Steinmänner säumen den Bergpfad
  { type: 'rock', x: 150, y: 596, s: 1 },
  { type: 'rock', x: 500, y: 593, s: 0.85 },
  { type: 'rock', x: 620, y: 572, s: 0.6 },
  { type: 'rock', x: 750, y: 596, s: 0.95 },
  { type: 'rock', x: 900, y: 559, s: 0.65 },
  { type: 'cairn', x: 470, y: 590, s: 0.62 },
  { type: 'cairn', x: 830, y: 576, s: 0.7 },

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
  { type: 'goat', x: 250, y: 548, s: 0.85 },
  { type: 'goat', x: 720, y: 560, s: 0.75 },

  // Adler ziehen ruhige Kreise hoch über den Gipfeln
  { type: 'eagle', x: 200, y: 170, s: 1 },
  { type: 'eagle', x: 650, y: 140, s: 0.9 },
  { type: 'eagle', x: 900, y: 190, s: 0.8 }
]
