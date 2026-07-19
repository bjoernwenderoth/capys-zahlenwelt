import { useEffect, useRef, useState } from 'react'
import Panorama from '../components/Panorama.jsx'
import quizPatternWiese from '../assets/quiz-patterns/wiese.jpg'
import quizPatternWald from '../assets/quiz-patterns/wald.jpg'
import quizPatternBerge from '../assets/quiz-patterns/berge.jpg'
import quizPatternSee from '../assets/quiz-patterns/see.jpg'
import quizPatternNacht from '../assets/quiz-patterns/nacht.jpg'
import quizPatternSchloss from '../assets/quiz-patterns/schloss.jpg'
import panoramaHills from '../assets/panorama/hills.png'
import panoramaGroundTerrain from '../assets/panorama/ground-terrain.png'
import panoramaLake from '../assets/panorama/lake.png'
import panoramaDecorAbove from '../assets/panorama/decor-above.png'
import panoramaDecorForeground from '../assets/panorama/decor-foreground.png'
import fogTeaserArt from '../assets/panorama/fog-teaser-v2.png'
import fogDenseArt from '../assets/panorama/fog-dense-v2.png'

// Bilder, die direkt nach dem Start gebraucht werden: Capys Lauf-/Steh-Sprites
// (kommen zum ersten Mal auf der Karte zum Einsatz, sobald Capy loslaeuft),
// die Quiz-Reaktionsbilder, die Quiz-Hintergründe jeder Welt sowie die
// Avatar-Köpfe. Werden sie erst beim ersten tatsaechlichen Gebrauch
// angefragt, kann genau in diesem Moment ein kurzer Hänger entstehen (z. B.
// beim allerersten Levelstart in einer Welt). Hier laden wir sie einmal
// vorab, waehrend der Nutzer ohnehin auf einen (kurzen) Ladebildschirm
// schaut – kein Bild soll erst "lazy" mitten im Spiel nachgeladen werden.
//
// Die Quiz-Hintergründe liegen unter src/assets (von Vite gebündelt und
// gehasht) statt unter public/bilder – deshalb hier als Modul-Import statt
// als roher Pfad, sonst würde die falsche (ungehashte) URL angefragt.
const PRELOAD_IMAGES = [
  'bilder/capy/idle-stand.png',
  'bilder/capy/walk-start.png',
  'bilder/capy/walk-loop.png',
  'bilder/capy/walk-stop.png',
  'bilder/capy/proud.png',
  'bilder/capy/wrong.png',
  'bilder/capy/happy.png',
  'bilder/capy/cheer.png',
  'bilder/capy/sad.png',
  'bilder/capy/think.png',
  'bilder/avatar/waschbaer-kopf.png',
  'bilder/avatar/t-rex-kopf-v2.png',
  'assets/generated/royal-treasure.png',
  'assets/creativeandcode-logo.png'
]

// Bereits von Vite aufgelöste (gehashte) URLs – werden ohne BASE_URL-Präfix
// direkt verwendet (siehe loads-Schleife unten).
const PRELOAD_IMAGE_URLS = [
  quizPatternWiese,
  quizPatternWald,
  quizPatternBerge,
  quizPatternSee,
  quizPatternNacht,
  quizPatternSchloss,
  panoramaHills,
  panoramaGroundTerrain,
  panoramaLake,
  panoramaDecorAbove,
  panoramaDecorForeground,
  fogTeaserArt,
  fogDenseArt
]

// Mindestdauer, damit der Screen bei schnellem Cache nicht als bloßes
// Aufblitzen wahrgenommen wird; Maximaldauer, damit ein einzelnes langsames
// oder fehlerhaftes Bild niemals blockiert.
const MIN_DURATION_MS = 900
const MAX_DURATION_MS = 4000

const TIPS = [
  'Capy zieht sich die Turnschuhe an…',
  'Die Zahlenwelten werden aufgeräumt…',
  'Sternenhimmel wird poliert…',
  'Blumen werden gegossen…'
]

export default function Loading({ onDone }) {
  const [loaded, setLoaded] = useState(0)
  const tip = useRef(TIPS[Math.floor(Math.random() * TIPS.length)]).current
  const total = PRELOAD_IMAGES.length + PRELOAD_IMAGE_URLS.length

  useEffect(() => {
    let cancelled = false
    const start = Date.now()

    const loadUrl = (src) =>
      new Promise((resolve) => {
        const img = new Image()
        img.onload = img.onerror = () => {
          if (!cancelled) setLoaded((n) => n + 1)
          resolve()
        }
        img.src = src
      })

    const loads = [
      ...PRELOAD_IMAGES.map((path) => loadUrl(`${import.meta.env.BASE_URL}${path}`)),
      ...PRELOAD_IMAGE_URLS.map((url) => loadUrl(url))
    ]

    // Die Panorama-Szene hat kein "fertig geladen"-Ereignis wie ein <img> –
    // zwei verschachtelte requestAnimationFrame-Aufrufe garantieren aber,
    // dass der Browser einen echten Malvorgang abgeschlossen hat, bevor es
    // weitergeht (nicht nur, dass React sie ins DOM committed hat).
    const panoramaPainted = new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    })

    const timeout = new Promise((resolve) => setTimeout(resolve, MAX_DURATION_MS))

    Promise.race([Promise.all([...loads, panoramaPainted]), timeout]).then(() => {
      if (cancelled) return
      const elapsed = Date.now() - start
      const rest = Math.max(0, MIN_DURATION_MS - elapsed)
      setTimeout(() => {
        if (!cancelled) onDone()
      }, rest)
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pct = Math.round((Math.min(loaded, total) / total) * 100)

  return (
    <div className="screen loading-screen">
      {/* Unsichtbar mitgerendert: dieselbe Panorama-Szene, die gleich im
          Intro-Screen erscheint. Ihr erster Aufbau (SVG-Filter, Verläufe,
          viele Deko-Sprites) kostet spürbar Zeit – findet das hier statt,
          während ohnehin schon der Ladebildschirm läuft, statt erst in dem
          Moment, in dem die Introbox aufploppt. */}
      <div className="loading-panorama-prewarm" aria-hidden="true">
        <Panorama activeWorldWindow={[0, 0]} />
      </div>
      <div className="loading-sky" aria-hidden="true">
        <span className="loading-cloud loading-cloud-one" />
        <span className="loading-cloud loading-cloud-two" />
        <span className="loading-spark loading-spark-one">✦</span>
        <span className="loading-spark loading-spark-two">✦</span>
        <span className="loading-spark loading-spark-three">✦</span>
      </div>

      <main className="loading-card">
        <div className="loading-capy-wrap" aria-hidden="true">
          <span className="loading-orbit loading-orbit-one">2</span>
          <span className="loading-orbit loading-orbit-two">×</span>
          <span className="loading-orbit loading-orbit-three">5</span>
          <img className="loading-capy" src="bilder/icon/capy-kopf.png" alt="" draggable={false} />
        </div>

        <div className="loading-copy">
          <h1>Capy macht alles bereit</h1>
          <p>{tip}</p>
        </div>

        <div
          className="loading-progress"
          role="progressbar"
          aria-label="Spiel wird geladen"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={pct}
        >
          <div className="loading-bar-track">
            <div className="loading-bar-fill" style={{ width: `${pct}%` }}>
              <span className="loading-bar-glint" />
            </div>
          </div>
          <div className="loading-progress-meta">
            <span>Auf ins Abenteuer!</span>
            <strong>{pct}%</strong>
          </div>
        </div>
      </main>

      <div className="loading-landscape" aria-hidden="true">
        <span className="loading-hill loading-hill-back" />
        <span className="loading-hill loading-hill-front" />
        <span className="loading-flower loading-flower-one">✿</span>
        <span className="loading-flower loading-flower-two">✿</span>
      </div>
    </div>
  )
}
