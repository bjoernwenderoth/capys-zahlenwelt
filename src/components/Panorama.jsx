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

import { Cloud, Sun, Mountain, Star } from './Scenes.jsx'
import { MountainStream, ShootingStar } from './decor/sprites.jsx'
import WorldDecor from './decor/WorldDecor.jsx'
import SharedDefs from './decor/SharedDefs.jsx'
import { WORLD_DECOR, SCHLOSS_FOREGROUND } from '../data/worldDecor/index.js'

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

      {/* ---------- Ebene 2: ferne Hügel & Berge (weichgezeichnet) ---------- */}
      <svg className="pano-layer pano-layer-hills" viewBox="0 0 6000 600" preserveAspectRatio="none">
        <g filter="url(#far)" opacity="0.85">
          <path
            d="M -400 370 Q 250 300 500 350 T 1000 340 T 1500 310 T 2000 350 T 2500 330 T 3000 355 T 3500 340 T 4000 320 T 4500 350 T 5000 330 T 5500 345 T 6400 335 L 6400 600 L -400 600 Z"
            fill="url(#pan-far)"
          />
        </g>
        <g filter="url(#veryFar)" mask="url(#mask-fade-edges-x)" opacity="0.75">
          <Mountain x={2120} y={460} w={460} h={230} c="#aac8e6" cd="#93b6da" />
          <Mountain x={2850} y={460} w={420} h={200} c="#aac8e6" cd="#93b6da" />
        </g>

        {/* ---------- Zahlenwald: dichte Baumkronen-Silhouette am Horizont –
             gibt dem Wald Tiefe, als reiche er weit nach hinten ---------- */}
        <g filter="url(#far)" opacity="0.5">
          <path
            d="M 940 460 Q 990 350 1040 400 Q 1080 330 1130 395 Q 1175 320 1225 392 Q 1270 335 1320 398
               Q 1365 325 1415 393 Q 1460 340 1510 400 Q 1555 330 1605 395 Q 1650 338 1700 398
               Q 1745 325 1795 392 Q 1840 335 1890 400 Q 1935 345 1985 405 Q 2015 360 2050 420
               L 2050 470 L 940 470 Z"
            fill="#1f5c33"
          />
        </g>
        <g filter="url(#far)" opacity="0.65">
          <path
            d="M 940 480 Q 1000 400 1060 440 Q 1110 380 1170 435 Q 1220 390 1280 438 Q 1330 385 1390 436
               Q 1440 395 1500 438 Q 1550 390 1610 436 Q 1660 398 1720 438 Q 1770 390 1830 436
               Q 1840 400 1900 438 Q 1920 415 1940 440 L 1940 490 L 940 490 Z"
            fill="#2e7a44"
          />
        </g>
        {/* Eigenständige, gestaffelte Silhouette der Nachtwelt */}
        <g filter="url(#far)">
          <path d="M 3970 455 Q 4090 370 4200 420 Q 4330 330 4460 408 Q 4580 315 4720 405 Q 4850 350 5030 438 L 5030 500 L 3970 500 Z" fill="#172c55" opacity="0.72" />
          <path d="M 4020 472 Q 4160 410 4290 448 Q 4430 385 4580 449 Q 4740 390 4975 468 L 4975 510 L 4020 510 Z" fill="#263f70" opacity="0.48" />
        </g>
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
        <Mountain x={2200} y={490} w={480} h={280} c="#7fa8cf" cd="#5f88b3" />
        <Mountain x={2520} y={495} w={540} h={330} c="#7fa8cf" cd="#5f88b3" />
        <Mountain x={2820} y={490} w={500} h={290} c="#7fa8cf" cd="#5f88b3" />
        <Mountain x={2380} y={520} w={520} h={240} c="#57779c" cd="#425e80" />
        <Mountain x={2720} y={525} w={560} h={260} c="#57779c" cd="#425e80" />

        {/* mittlerer + vorderer Boden (durchgehend).
            Explizite Q-Kurven statt T-Kurzschrift: die T-Spiegelung hatte sich
            über so viele Segmente aufgeschaukelt, dass die Kontur um den
            Sonnensee herum weit nach unten ausschlug (Kontrollpunkte bis
            y≈600) – dadurch wirkte der See dort wie freischwebend. Jede
            Kurve bekommt jetzt ihren eigenen, begrenzten Kontrollpunkt.
            Rund um den See folgen beide Boden-Kurven seiner unregelmäßigen
            Uferlinie. So entsteht eine echte Aussparung im Gelände, in die
            Strand und Wasser weiter unten bündig eingesetzt werden. */}
        <path
          d="M 0 440 Q 250 417 500 435 Q 750 407 1000 425 Q 1250 407 1500 445 Q 1750 402 2000 420 Q 2180 405 2278 418 C 2284 423 2296 424 2302 419 Q 2400 421 2500 445 Q 2750 412 3000 430 Q 3065 422 3130 414 C 3185 391 3250 381 3320 382 C 3395 367 3470 374 3535 377 C 3610 367 3690 379 3760 387 C 3825 388 3858 399 3870 414 Q 3935 419.5 4000 425 Q 4250 407 4500 445 Q 4750 407 5000 425 Q 5250 407 5500 445 Q 5750 412 6000 430 L 6000 600 L 0 600 Z"
          fill="url(#pan-mid)"
        />
        <path
          d="M 0 505 Q 300 486 600 500 Q 900 481 1200 495 Q 1500 481 1800 505 Q 2050 478 2260 488 C 2290 488 2310 493 2325 497 C 2335 503 2346 503 2357 497 C 2370 490 2385 490 2400 492 Q 2700 478 3000 505 Q 3065 460 3130 414 C 3152 427 3195 436 3260 439 C 3330 444 3405 452 3485 450 C 3560 448 3640 453 3715 442 C 3790 440 3848 431 3870 414 Q 4035 460 4200 505 Q 4500 478 4800 492 Q 5100 478 5400 505 Q 5700 484 6000 498 L 6000 600 L 0 600 Z"
          fill="url(#pan-front)"
        />
        {/* dezente Maserung, bricht die glatten Verläufe auf */}
        <rect x="0" y="410" width="6000" height="190" filter="url(#grain)" opacity="0.5" style={{ mixBlendMode: 'overlay' }} />

        {/* Breite, ruhige Lichtungen verbinden die Welten. Himmel, Boden und
            Weg bleiben durchgehend, während die Themen-Deko an den Grenzen
            bewusst etwas mehr Abstand bekommt. */}
        {[1000, 2000, 3000, 4000, 5000].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="474" rx="118" ry="54" fill="#fff7d6" opacity="0.09" filter="url(#soft)" />
            <ellipse cx={x} cy="548" rx="128" ry="42" fill="#fff" opacity="0.055" filter="url(#soft)" />
          </g>
        ))}

        {/* Der Bach ist Teil des Geländes und liegt deshalb unter Weg und
            Brücke. Seine Breite nimmt mit der Nähe zum Betrachter zu. */}
        <MountainStream />

        {/* Brücken und andere begehbare Deko liegen unter dem Pfad, damit
            dessen Markierungen auf ihrer Oberfläche sichtbar bleiben. */}
        {WORLD_DECOR.map((w, i) => (
          <WorldDecor
            key={`below-path-${w.id}`}
            items={w.items}
            offsetX={w.offsetX}
            active={isWorldActive(i)}
            pathLayer="below"
          />
        ))}

        {/* Weg: liegt auf dem Boden, aber UNTER der gesamten Deko (Bäume,
            Büsche, Tiere …), damit diese realistisch vor/neben dem Weg
            stehen. Begehbare Objekte wie die Brücke werden direkt davor
            gerendert, sodass der Weg auf ihnen sichtbar bleibt. */}
        {roadLayer}

        {/* ---------- Sonnensee: Ufer/Sand/Wasser ----------
            Bleibt hier fest codiert (wie der Bach) statt in den Welt-Deko-
            Daten, weil die Kontur exakt an die Boden-Kurve angepasst ist.
            Unregelmäßige, gestaffelte Uferzonen betten den See ins Gelände
            ein. Der dunkle Außenrand liegt nur an der nahen Kante und wirkt
            wie eine flache Böschung statt wie ein Schlagschatten unter einer
            Scheibe. */}
        <path
          d="M 3130 414 C 3185 391 3250 381 3320 382 C 3395 367 3470 374 3535 377 C 3610 367 3690 379 3760 387 C 3825 388 3858 399 3870 414 C 3848 431 3790 440 3715 442 C 3640 453 3560 448 3485 450 C 3405 452 3330 444 3260 439 C 3195 436 3152 427 3130 414 Z"
          fill="url(#lake-bank)"
          opacity="0.42"
          filter="url(#lake-edge)"
        />
        <path
          d="M 3142 413 C 3194 394 3260 385 3325 386 C 3398 373 3468 379 3536 381 C 3608 373 3682 383 3754 390 C 3812 391 3848 401 3858 413 C 3837 425 3782 433 3709 435 C 3636 445 3560 440 3485 443 C 3408 445 3335 438 3266 433 C 3207 431 3161 423 3142 413 Z"
          fill="url(#lake-sand)"
          opacity="0.72"
          filter="url(#lake-edge)"
        />
        <path
          d="M 3133 414 C 3187 392 3251 382 3321 383 C 3395 368 3470 375 3535 378 C 3610 368 3690 380 3759 388 C 3823 389 3856 400 3868 414 C 3828 422 3774 428 3703 429 C 3633 437 3560 433 3486 436 C 3414 438 3342 432 3275 428 C 3218 426 3168 421 3133 414 Z"
          fill="url(#pan-wasser)"
          filter="url(#lake-edge)"
        />
        {/* Tiefere Vorderkante und eine feine, helle Linie dort, wo das
            Wasser auf den flachen Sand ausläuft. */}
        <path
          d="M 3148 410 C 3240 418 3355 427 3485 426 C 3600 424 3740 420 3852 410
             C 3822 422 3770 428 3703 429 C 3633 437 3560 433 3486 436
             C 3414 438 3342 432 3275 428 C 3218 426 3168 421 3133 414 Z"
          fill="#0d699d"
          opacity="0.15"
        />
        <path
          d="M 3138 414 C 3180 421 3220 426 3275 428 C 3342 432 3414 438 3486 436
             C 3560 433 3633 437 3703 429 C 3774 428 3828 422 3864 414"
          fill="none"
          stroke="#c6edf3"
          strokeWidth="1.6"
          opacity="0.48"
          strokeLinecap="round"
          filter="url(#edge)"
        />
        {/* Gebrochene Himmels- und Sonnenreflexe statt einer einzigen weißen Fläche. */}
        <path d="M 3290 397 C 3400 385 3550 385 3775 401 C 3635 396 3435 407 3290 397 Z" fill="#fff8d9" opacity="0.16" filter="url(#soft)" />
        <path d="M 3550 389 Q 3620 383 3690 391 M 3570 399 Q 3630 394 3680 400 M 3590 409 Q 3630 406 3665 410" stroke="#fffbe7" strokeWidth="3" fill="none" opacity="0.22" strokeLinecap="round" filter="url(#edge)" />

        {/* Themen-Deko je Welt (Bäume, Tiere, Strand-/Bergsachen, …) – siehe
            src/data/worldDecor/*.js. Nicht aktive Welten (weit außerhalb des
            sichtbaren Bereichs) werden ausgelassen: kein DOM, keine
            CSS-Animationen. Bekannter, bewusst nicht gelöster Sonderfall:
            läuft Capy quer über mehrere übersprungene Welten (Wiederholen
            eines alten Levels), bleibt deren Deko für die Dauer der
            Laufanimation ausgeblendet – Boden und Weg bleiben aber sichtbar. */}
        {WORLD_DECOR.map((w, i) => (
          <WorldDecor key={w.id} items={w.items} offsetX={w.offsetX} active={isWorldActive(i)} />
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
        <WorldDecor items={SCHLOSS_FOREGROUND.items} offsetX={SCHLOSS_FOREGROUND.offsetX} active={isWorldActive(LAST_WORLD_IDX)} />
      </svg>
    </div>
  )
}
