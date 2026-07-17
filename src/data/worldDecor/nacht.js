// Deko-Liste "Sternenhimmel" – lokale Koordinaten (0..1000), siehe wiese.js.
export default [
  // Mondlicht hebt die Welt als eigene Insel aus dem dunklen Boden
  { type: 'glow', x: 560, y: 445, rx: 520, ry: 112, fill: '#8ec9e8', opacity: 0.12 },
  { type: 'glow', x: 560, y: 520, rx: 390, ry: 72, fill: '#b9e9f5', opacity: 0.1 },

  // hintere, bläulichere Reihe; vorne dunklere Rahmenbäume
  { type: 'pine', x: 70, y: 446, s: 0.46, c: '#36567b', cd: '#203b62', hi: '#7699b8', trunk: '#34465c' },
  { type: 'pine', x: 225, y: 455, s: 0.52, c: '#35577b', cd: '#1d385e', hi: '#718fad', trunk: '#304258' },
  { type: 'pine', x: 370, y: 438, s: 0.4, c: '#426689', cd: '#29476d', hi: '#83a4bf', trunk: '#3b5067' },
  { type: 'pine', x: 750, y: 442, s: 0.45, c: '#3d6084', cd: '#233f68', hi: '#7c9db9', trunk: '#384b62' },
  { type: 'pine', x: 910, y: 455, s: 0.5, c: '#35577b', cd: '#1d385e', hi: '#718fad', trunk: '#304258' },
  { type: 'pine', x: 150, y: 510, s: 0.85, c: '#172b4d', cd: '#09152d', hi: '#456888', trunk: '#26364a' },
  { type: 'pine', x: 330, y: 565, s: 0.72, c: '#1c3559', cd: '#0b1933', hi: '#4d7090', trunk: '#293a50' },
  { type: 'pine', x: 845, y: 566, s: 0.72, c: '#193052', cd: '#0a172f', hi: '#496c8c', trunk: '#27384d' },
  { type: 'pine', x: 980, y: 515, s: 0.84, c: '#142946', cd: '#081429', hi: '#416481', trunk: '#233348' },

  { type: 'moonRock', x: 75, y: 558, s: 0.85 },
  { type: 'moonRock', x: 260, y: 590, s: 0.62, flip: true },
  { type: 'moonRock', x: 860, y: 592, s: 0.72 },
  { type: 'moonRock', x: 990, y: 568, s: 0.62, flip: true },

  { type: 'observatory', x: 560, y: 470, s: 0.82 },

  // Glühwürmchen
  { type: 'nightGlow', x: 240, y: 480, delay: 0 },
  { type: 'nightGlow', x: 420, y: 545, delay: 0.4 },
  { type: 'nightGlow', x: 610, y: 500, delay: 0.8 },
  { type: 'nightGlow', x: 760, y: 555, delay: 1.2 },
  { type: 'nightGlow', x: 930, y: 570, delay: 1.6 }
]
