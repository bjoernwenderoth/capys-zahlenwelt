import { useEffect, useRef, useState } from 'react'

// Bilder, die direkt nach dem Start gebraucht werden: Capys Lauf-/Steh-Sprites
// (kommen zum ersten Mal auf der Karte zum Einsatz, sobald Capy loslaeuft)
// sowie die Quiz-Reaktionsbilder (erste Antwort im ersten Level). Werden sie
// erst beim ersten tatsaechlichen Gebrauch angefragt, kann genau in diesem
// Moment ein kurzer Hänger entstehen. Hier laden wir sie einmal vorab, waehrend
// der Nutzer ohnehin auf einen (kurzen) Ladebildschirm schaut.
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
  'assets/generated/royal-treasure.png'
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
  const total = PRELOAD_IMAGES.length

  useEffect(() => {
    let cancelled = false
    const start = Date.now()

    const loads = PRELOAD_IMAGES.map(
      (path) =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = img.onerror = () => {
            if (!cancelled) setLoaded((n) => n + 1)
            resolve()
          }
          img.src = `${import.meta.env.BASE_URL}${path}`
        })
    )

    const timeout = new Promise((resolve) => setTimeout(resolve, MAX_DURATION_MS))

    Promise.race([Promise.all(loads), timeout]).then(() => {
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
