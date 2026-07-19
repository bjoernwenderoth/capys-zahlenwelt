// Eine einzige zusammenhängende Landkarte für alle Welten (6000 × 600).
// Himmel und Boden gehen fließend ineinander über, ein durchgehender
// Weg verbindet alle Level. Themen-Deko markiert die Regionen:
// Blumenwiese → Wald → Berge → Sonnensee → Sternenhimmel → Königsschloss
//
// Vier Tiefenebenen (Himmel, ferne Hügel, Wolken, Hauptebene mit dem Weg)
// bewegen sich beim Scrollen minimal unterschiedlich schnell (siehe --scroll
// in Path.jsx), dazu kommen dezente Animationen (Treiben, Glitzern, Wiegen)
// für einen lebendigeren, weniger flachen Look.
//
// Terrain (Himmel/Hügel/Boden/See-/Bachform) ist hier bewusst weiter fest
// codiert – seine Kontur ist durchgehend über die ganze Karte verzahnt (z. B.
// läuft die Bodenkurve unverändert durch alle 6 Welten). Die eigentliche
// Themen-DEKO (Bäume, Tiere, Strandsachen, Schloss-Kleinteile, …) kommt
// dagegen aus src/data/worldDecor/*.js und wird über WorldDecor gerendert –
// so lässt sich eine Welt neu bepflanzen, ohne diese Datei anzufassen, und
// nicht sichtbare Welten können ohne DOM/Animationen bleiben (active=false).

import { Cloud, Sun, Star } from './Scenes.jsx'
import { ShootingStar } from './decor/sprites.jsx'
import WorldDecor from './decor/WorldDecor.jsx'
import SharedDefs from './decor/SharedDefs.jsx'
import { WORLD_DECOR, SCHLOSS_FOREGROUND } from '../data/worldDecor/index.js'
import hillsArt from '../assets/panorama/hills.png'
import groundTerrainArt from '../assets/panorama/ground-terrain.png'
import lakeArt from '../assets/panorama/lake.png'
import decorAboveArt from '../assets/panorama/decor-above.png'
import decorForegroundArt from '../assets/panorama/decor-foreground.png'

// activeWorldWindow = [ersterIndex, letzterIndex] der Welten (Reihenfolge wie
// WORLD_DECOR/WORLDS), deren Deko tatsächlich gerendert wird. Welten
// außerhalb bleiben ohne Deko-DOM und ohne laufende CSS-Animationen – Boden,
// Weg und Levelknoten bleiben davon unberührt (siehe Path.jsx).
const LAST_WORLD_IDX = WORLD_DECOR.length - 1

export default function Panorama({ roadLayer, activeWorldWindow = [0, LAST_WORLD_IDX] } = {}) {
  const [activeLo, activeHi] = activeWorldWindow
  const isWorldActive = (i) => i >= activeLo && i <= activeHi

  return (
    <div className="panorama-scene" aria-hidden="true">
      <SharedDefs />

      {/* ---------- Ebene 1: Himmel (bewegt sich am langsamsten) ---------- */}
      <svg className="pano-layer pano-layer-sky" viewBox="0 0 6000 600" preserveAspectRatio="none">
        <rect x="-400" width="6800" height="600" fill="url(#pan-sky)" />

        <Sun x={400} y={95} r={38} />
        {/* Mond als klare Lichtquelle und vertikale Achse über der Sternwarte */}
        <circle cx="4560" cy="115" r="116" fill="#dff3ff" opacity="0.16" filter="url(#soft)" />
        <circle cx="4560" cy="115" r="55" fill="#f5ecc8" />
        <path d="M 4568 61 A 55 55 0 0 1 4611 135 A 55 55 0 0 1 4572 168 Q 4591 137 4584 103 Q 4580 78 4568 61 Z" fill="#c9c5ad" opacity="0.52" filter="url(#edge)" />
        <ellipse cx="4538" cy="97" rx="11" ry="8" fill="#d8d1b5" />
        <ellipse cx="4578" cy="132" rx="8" ry="6" fill="#d3ccb0" />
        <ellipse cx="4548" cy="141" rx="6" ry="4" fill="#e2d9bd" />
        <path d="M 4528 82 Q 4543 68 4561 66" stroke="#fffdec" strokeWidth="5" opacity="0.48" fill="none" strokeLinecap="round" />
        {[[4070, 185, 0.45], [4125, 105, 0.7], [4180, 70, 0.9], [4260, 150, 0.6], [4360, 50, 1], [4450, 120, 0.7], [4650, 200, 0.6],
          [4720, 60, 0.9], [4800, 140, 0.7], [4880, 90, 0.8], [4950, 175, 0.55], [4420, 230, 0.5], [4250, 260, 0.4], [4775, 260, 0.5]].map(([x, y, o], i) => (
          <Star key={i} x={x} y={y} s={0.5 + o * 0.7} o={o} />
        ))}
        <ShootingStar x={4195} y={87} s={0.92} rot={18} />
        {/* Milchstraßen-Schleier: hell genug zur Abgrenzung, aber hinter den Sternen */}
        <path d="M 4050 255 Q 4330 115 4600 205 Q 4810 275 5010 105" stroke="#b8c8ff" strokeWidth="52" opacity="0.055" fill="none" filter="url(#soft)" />

        {/* Königsschloss: Die Sonnenaufgangsfarben kommen aus dem einen
            durchgehenden Himmelsverlauf; keine radialen Lichtflächen oder Bögen. */}
        <rect x="4740" y="0" width="1260" height="450" fill="url(#castle-sunrise-wash)" mask="url(#castle-sunrise-mask)" />
        <path d="M 5010 205 C 5200 128 5380 155 5535 115 C 5700 72 5860 108 6050 55"
          stroke="url(#castle-cirrus)" strokeWidth="34" fill="none" opacity="0.58" filter="url(#soft)" strokeLinecap="round" />
        <path d="M 5100 272 C 5290 204 5460 232 5635 187 C 5775 151 5910 169 6035 132"
          stroke="url(#castle-cirrus)" strokeWidth="18" fill="none" opacity="0.42" filter="url(#soft)" strokeLinecap="round" />
        <path d="M 5205 82 Q 5400 34 5580 74 M 5650 250 Q 5820 212 5995 236"
          stroke="#ffffff" strokeWidth="7" fill="none" opacity="0.18" filter="url(#soft)" strokeLinecap="round" />
      </svg>

      {/* ---------- Ebene 2: ferne Hügel & Berge (weichgezeichnet) ----------
           Komplett statisch (nichts hier animiert oder hängt vom Spielstand
           ab) und zugleich der teuerste Teil der Szene: mehrere breite
           Weichzeichner-Filter über große Flächen. Live als Vektor gezeichnet
           musste der Browser das beim Scrollen ständig neu rastern (siehe
           Performance-Profil). Deshalb liegt hier ein einmal vorgerendertes
           Bild (siehe capture-entry.jsx zur Erzeugung) statt der Live-SVG-Deko. */}
      <svg className="pano-layer pano-layer-hills" viewBox="0 0 6000 600" preserveAspectRatio="none">
        <image href={hillsArt} x="0" y="0" width="6000" height="600" preserveAspectRatio="none" />
      </svg>

      {/* ---------- Ebene 3: Wolken (treiben unabhängig, eigenes Tempo) ---------- */}
      <svg className="pano-layer pano-layer-clouds" viewBox="0 0 6000 600" preserveAspectRatio="none">
        <Cloud x={700} y={80} s={0.8} o={0.8} />
        <Cloud x={1250} y={110} s={0.9} />
        <Cloud x={1700} y={60} s={0.65} o={0.8} />
        <Cloud x={2400} y={90} s={0.8} />
        <Cloud x={2820} y={140} s={0.6} o={0.8} />
        <Cloud x={3400} y={75} s={0.85} />
        <Cloud x={3740} y={120} s={0.6} o={0.8} />
        <Cloud x={5150} y={190} s={0.9} />
        <Cloud x={5800} y={90} s={0.7} />
      </svg>

      {/* ---------- Ebene 4: Hauptebene – Boden, Weg-Umgebung, Deko
           (bewegt sich 1:1 mit dem Weg/den Levelknoten, keine eigene
           Parallaxe – hier müssen Koordinaten exakt stimmen) ---------- */}
      <svg className="pano-layer pano-layer-ground" viewBox="0 0 6000 600" preserveAspectRatio="none">
        {/* Berge, Boden-Verläufe, Maserung und Bach ändern sich nie und
            hängen nicht vom Spielstand ab – zusammen mit der Grain-Textur
            (feTurbulence) waren sie beim Scrollen der teuerste Teil zum
            Neu-Rastern. Deshalb hier ein einmal vorgerendertes Bild statt
            Live-Vektorgrafik (siehe capture-entry.jsx zur Erzeugung). Weg,
            Levelknoten, Deko-Tiere/-Pflanzen und Capy bleiben unverändert
            echtes SVG/DOM, weil sie sich bewegen oder vom Fortschritt abhängen. */}
        <image href={groundTerrainArt} x="0" y="0" width="6000" height="600" preserveAspectRatio="none" />

        {/* Brücken und andere begehbare Deko liegen unter dem Pfad, damit
            dessen Markierungen auf ihrer Oberfläche sichtbar bleiben. Aktuell
            ist hier nichts animiert (nur die Brücke) – sie steckt deshalb
            schon mit im Bild oben (siehe capture-entry.jsx). variant="dynamic"
            bleibt trotzdem stehen, falls eine Welt hier künftig ein bewegtes
            Element bekommt (rendert sonst nichts, kostet also nichts). */}
        {WORLD_DECOR.map((w, i) => (
          <WorldDecor
            key={`below-path-${w.id}`}
            items={w.items}
            offsetX={w.offsetX}
            active={isWorldActive(i)}
            pathLayer="below"
            variant="dynamic"
          />
        ))}

        {/* Weg: liegt auf dem Boden, aber UNTER der gesamten Deko (Bäume,
            Büsche, Tiere …), damit diese realistisch vor/neben dem Weg
            stehen. Begehbare Objekte wie die Brücke werden direkt davor
            gerendert, sodass der Weg auf ihnen sichtbar bleibt. */}
        {roadLayer}

        {/* ---------- Sonnensee: Ufer/Sand/Wasser ----------
            Wie der Bach fest an die Boden-Kurve gebunden statt Teil der
            Welt-Deko-Daten – und wie diese komplett statisch, deshalb
            ebenfalls als vorgerendertes Bild (siehe capture-entry.jsx). Liegt
            bewusst nach wie vor NACH {roadLayer} im DOM, damit die
            Stapelreihenfolge (See vor dem Weg) exakt erhalten bleibt. */}
        <image href={lakeArt} x="0" y="0" width="6000" height="600" preserveAspectRatio="none" />

        {/* Themen-Deko je Welt (Bäume, Tiere, Strand-/Bergsachen, …) – siehe
            src/data/worldDecor/*.js. Der unbewegte Großteil (Pilze, Felsen,
            Tiere, Strandsachen, Schlossgebäude, …) steckt als vorgerendertes
            Bild in decorAboveArt (siehe capture-entry.jsx); live bleibt nur,
            was sich tatsächlich bewegt (schwankende Bäume/Blumen, Schmetterlinge,
            Bienen, Möwen, …) – variant="dynamic" filtert das entsprechend.
            Nicht aktive Welten (weit außerhalb des sichtbaren Bereichs) werden
            für die verbliebene Live-Deko ausgelassen: kein DOM, keine
            CSS-Animationen. Bekannter, bewusst nicht gelöster Sonderfall:
            läuft Capy quer über mehrere übersprungene Welten (Wiederholen
            eines alten Levels), bleibt deren Live-Deko für die Dauer der
            Laufanimation ausgeblendet – Boden, Weg und die gebackene
            Hintergrund-Deko bleiben aber sichtbar. */}
        <image href={decorAboveArt} x="0" y="0" width="6000" height="600" preserveAspectRatio="none" />
        {WORLD_DECOR.map((w, i) => (
          <WorldDecor key={w.id} items={w.items} offsetX={w.offsetX} active={isWorldActive(i)} variant="dynamic" />
        ))}

        {/* Generierte, freigestellte Schatztruhe als finales Reiseziel – fest
            zwischen Schloss-Hintergrund (Weg/Gebäude/Büsche) und -Kleindeko
            verdrahtet, da sie ein einmaliges <image> mit BASE_URL ist. */}
        <image
          href={`${import.meta.env.BASE_URL}assets/generated/royal-treasure.png`}
          x="5775" y="390" width="170" height="170"
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: 'saturate(0.72) contrast(0.92) brightness(0.98)' }}
        />
        {/* Unbewegte Schloss-Kleindeko (Wappen, Laternen, Bänke, Blumenkübel)
            ebenfalls gebacken; Sterne/Blumen bleiben live (siehe oben). */}
        <image href={decorForegroundArt} x="0" y="0" width="6000" height="600" preserveAspectRatio="none" />
        <WorldDecor items={SCHLOSS_FOREGROUND.items} offsetX={SCHLOSS_FOREGROUND.offsetX} active={isWorldActive(LAST_WORLD_IDX)} variant="dynamic" />
      </svg>
    </div>
  )
}
