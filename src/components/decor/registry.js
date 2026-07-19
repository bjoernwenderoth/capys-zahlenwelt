// Ordnet jeden in den Welt-Deko-Daten verwendeten "type"-String der
// passenden Sprite-Komponente zu. Eine neue Welt kann nur Typen benutzen,
// die hier eingetragen sind – neue Sprites also hier UND in sprites.jsx
// (bzw. Scenes.jsx) ergänzen, dann in beliebigen Welt-Datendateien nutzen.

import { Tree, Pine, Flower, Butterfly, Star } from '../Scenes.jsx'
import {
  Mushroom, Bloom, Bee, Fern, Log, Rabbit, Bear,
  Boat, Palm, Crab, Seagull, Shell, Starfish, DuneGrass,
  Sandcastle, Umbrella, BeachToys, BeachMarks, Fish, SwimRing,
  MountainBridge, Rock, Cairn, AlpineFlower, Goat, Eagle,
  RoyalLantern, HeraldicShield, StoneBench, CrownPlanter,
  CastleApproach, Castle, Observatory, MoonRock,
  Glow, LakeShimmer, NightGlow
} from './sprites.jsx'

// Typen mit einer eigenen CSS-Animation (Wiegen, Flattern, Flügelschlag,
// Funkeln, Kreisen, Glitzern, Pulsieren) – siehe die jeweilige Komponente in
// Scenes.jsx/sprites.jsx (Klassen wie pano-sway, pano-flutter, pano-bee, …).
// Alle anderen Typen stehen bewegungslos herum und werden deshalb NICHT mehr
// live gerendert, sondern sind Teil der vorgerenderten Hintergrundbilder in
// Panorama.jsx (siehe capture-entry.jsx zur Erzeugung). Ein Typ hier zu
// vergessen bedeutet nur, dass er unnötig live bleibt (kostet etwas
// Performance) – ihn faelschlich hier einzutragen würde ihn dagegen unsichtbar
// machen (er würde dann weder gebacken noch live gerendert). Im Zweifel also
// eher NICHT eintragen.
export const ANIMATED_DECOR_TYPES = new Set([
  'flower', 'butterfly', 'star', 'bee', 'fern',
  'seagull', 'duneGrass', 'alpineFlower', 'eagle', 'lakeShimmer', 'nightGlow'
])

export const DECOR = {
  tree: Tree,
  pine: Pine,
  flower: Flower,
  butterfly: Butterfly,
  star: Star,
  mushroom: Mushroom,
  bloom: Bloom,
  bee: Bee,
  fern: Fern,
  log: Log,
  rabbit: Rabbit,
  bear: Bear,
  boat: Boat,
  palm: Palm,
  crab: Crab,
  seagull: Seagull,
  shell: Shell,
  starfish: Starfish,
  duneGrass: DuneGrass,
  sandcastle: Sandcastle,
  umbrella: Umbrella,
  beachToys: BeachToys,
  beachMarks: BeachMarks,
  fish: Fish,
  swimRing: SwimRing,
  mountainBridge: MountainBridge,
  rock: Rock,
  cairn: Cairn,
  alpineFlower: AlpineFlower,
  goat: Goat,
  eagle: Eagle,
  royalLantern: RoyalLantern,
  heraldicShield: HeraldicShield,
  stoneBench: StoneBench,
  crownPlanter: CrownPlanter,
  castleApproach: CastleApproach,
  castle: Castle,
  observatory: Observatory,
  moonRock: MoonRock,
  glow: Glow,
  lakeShimmer: LakeShimmer,
  nightGlow: NightGlow
}
