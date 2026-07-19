import { useEffect, useMemo, useRef, useState } from 'react'
import AnimalAvatar from '../components/AnimalAvatar.jsx'
import InfoModal from '../components/InfoModal.jsx'
import Panorama from '../components/Panorama.jsx'
import {
  WORLDS,
  worldDone,
  worldUnlocked,
  SHOW_ALL_WORLDS,
  ORDERED_LEVELS,
  GLOBAL_NODES,
  MAP_WIDTH,
  extendedPoints,
  sampleSegment,
  depthNorm
} from '../data/worlds.js'
import fogTeaserArt from '../assets/panorama/fog-teaser-v2.png'
import fogDenseArt from '../assets/panorama/fog-dense-v2.png'

const WELCOME = [
  'Schön, dass du da bist! Auf zum nächsten Level!',
  'Übung macht den Meister! 💪',
  'Heute schaffst du bestimmt 3 Sterne!',
  'Ich glaube an dich!',
  'Weiter geht die Reise durch die Zahlenwelten!'
]

const KIND_ICON = { review: '🔁', final: '👑' }

// TODO: Temporär deaktiviert, während die Welten gestaltet werden.
// Zum Reaktivieren einfach wieder auf true setzen (siehe auch
// SHOW_ALL_WORLDS in data/worlds.js).
const FOG_ENABLED = true

// Weg und Punkte einmal für die gesamte Karte berechnen
const EXIT_X = MAP_WIDTH + 2
const PTS = extendedPoints(GLOBAL_NODES, EXIT_X)

// merkt sich (solange die Seite offen ist), wo Capy zuletzt stand
let capyLastLevelId = null
// welches "gerade bestandene Level" schon für einen Schritt vorwärts
// verbraucht wurde – verhindert, dass dasselbe bestandene Level beim
// nächsten Kartenbesuch (z. B. nach einem abgebrochenen Extra-Level)
// nochmal zu einem Vorwärtslaufen führt
let capyConsumedPassId = null
// welchem Profil die gemerkte Position oben gehört – wechselt das Profil,
// ist die alte Position wertlos (sonst steht Capy beim Profilwechsel an der
// Stelle des vorherigen Kindes statt am eigenen Fortschritt)
let capyProfileId = null

function Stars({ n }) {
  return (
    <span className="stars">
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? 'star on' : 'star'}>★</span>
      ))}
    </span>
  )
}

// Soll-Abstand zwischen zwei Wegmarkierungen (in Karten-Einheiten). Bleibt für
// alle Segmente gleich – die Anzahl der Punkte pro Segment ergibt sich aus
// dessen tatsächlicher Bogenlänge und variiert dadurch bewusst (kurze
// Abschnitte bekommen wenige, lange Abschnitte mehr Punkte).
const DOT_SPACING = 34
// Anteil an jedem Segmentende, der frei von Punkten bleibt (Platz für den
// Levelknoten selbst statt einer Markierung direkt darunter).
const DOT_EDGE_GAP = 0.14

// Punkte auf dem Weg: geschaffte Abschnitte (hinter Capy) leuchten golden,
// kommende sind nur dezent zu sehen
function SegmentDots({ progress }) {
  const dots = []
  for (let k = 0; k <= GLOBAL_NODES.length; k++) {
    const seg = sampleSegment(PTS, k, 50)
    const done = k === 0 ? true : !!progress[ORDERED_LEVELS[k - 1].id]

    // Bogenlänge entlang der (gewellten) Kurve aufsummieren, damit Punkte in
    // echtem Abstand statt in gleichmäßigen Kurven-Parametern gesetzt werden
    // – sonst lägen sie auf langen Segmenten weiter auseinander als auf
    // kurzen.
    const cum = [0]
    for (let i = 1; i < seg.length; i++) {
      cum.push(cum[i - 1] + Math.hypot(seg[i][0] - seg[i - 1][0], seg[i][1] - seg[i - 1][1]))
    }
    const total = cum[cum.length - 1]
    const from = total * DOT_EDGE_GAP
    const to = total * (1 - DOT_EDGE_GAP)
    const usable = to - from
    const count = Math.max(2, Math.round(usable / DOT_SPACING))

    for (let d = 0; d <= count; d++) {
      const targetLen = from + (usable * d) / count
      let i = 1
      while (i < cum.length - 1 && cum[i] < targetLen) i++
      const frac = (targetLen - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
      const x = seg[i - 1][0] + (seg[i][0] - seg[i - 1][0]) * frac
      const y = seg[i - 1][1] + (seg[i][1] - seg[i - 1][1]) * frac
      const r = 3.4 + 2.4 * depthNorm(y)
      dots.push(
        done ? (
          <g key={`${k}-${d}`}>
            <circle cx={x} cy={y} r={r * 1.9} fill="#ffd93d" opacity="0.35" />
            <circle cx={x} cy={y} r={r} fill="#fff" stroke="#ffd93d" strokeWidth={r * 0.55} />
          </g>
        ) : (
          <circle key={`${k}-${d}`} cx={x} cy={y} r={r * 0.8} fill="#8a6b3f" opacity="0.35" />
        )
      )
    }
  }
  return <g>{dots}</g>
}

// Punkte des Wegs zwischen zwei beliebigen Level-Knoten (vorwärts ODER
// rückwärts, auch über mehrere Level hinweg) – folgt dabei dem echten
// Wegverlauf statt einer geraden Linie.
function pathBetween(fromNodeIdx, toNodeIdx, perSeg = 16) {
  const points = []
  if (toNodeIdx > fromNodeIdx) {
    for (let k = fromNodeIdx + 1; k <= toNodeIdx; k++) {
      const seg = sampleSegment(PTS, k, perSeg)
      points.push(...(points.length ? seg.slice(1) : seg))
    }
  } else {
    for (let k = fromNodeIdx; k > toNodeIdx; k--) {
      const seg = sampleSegment(PTS, k, perSeg).slice().reverse()
      points.push(...(points.length ? seg.slice(1) : seg))
    }
  }
  return points
}

// Capy, der auf dem Weg steht und zum Ziel-Level läuft (vorwärts zum
// nächsten Level, oder rückwärts, wenn ein schon geschafftes Level
// noch einmal geübt wird). onArrive feuert, sobald Capy angekommen ist.
function CapyWalker({ targetIdx, bubbleText, onArrive, onWalkingChange }) {
  const targetPt = PTS[targetIdx + 1]

  const walkPath = useMemo(() => {
    // Keine gemerkte Vorposition (Spielstart oder Profilwechsel): Capy steht
    // sofort ohne Laufanimation am weitesten erreichten Level.
    if (!capyLastLevelId) return null
    const prevIdx = ORDERED_LEVELS.findIndex((lv) => lv.id === capyLastLevelId)
    if (prevIdx === -1 || prevIdx === targetIdx) return null
    return pathBetween(prevIdx, targetIdx)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [pos, setPos] = useState(() => (walkPath ? walkPath[0] : targetPt))
  const [walking, setWalking] = useState(!!walkPath)
  const [walkPhase, setWalkPhase] = useState('start')
  const [flip, setFlip] = useState(() => {
    if (!walkPath) return false
    const firstStep = walkPath.find((point) => point[0] !== walkPath[0][0])
    return firstStep ? firstStep[0] < walkPath[0][0] : false
  })

  // Meldet an Path, ob gerade eine Lauf-Animation läuft – damit handleNodeClick
  // auch das automatische Weiterlaufen nach einem Levelabschluss blockieren
  // kann (nicht nur pendingWalk/Replay). Der Cleanup meldet "fertig", falls
  // dieser CapyWalker aus irgendeinem Grund vorzeitig unmountet (z. B.
  // Profilwechsel mitten in der Animation), damit die Sperre nie hängen bleibt.
  useEffect(() => {
    onWalkingChange?.(walking)
    return () => onWalkingChange?.(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walking])

  useEffect(() => {
    const sources = [
      '/bilder/capy/walk-start.png',
      '/bilder/capy/walk-loop.png',
      '/bilder/capy/walk-stop.png',
      '/bilder/capy/idle-stand.png'
    ]
    sources.forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    if (!walkPath) {
      onArrive?.()
      return
    }
    const dur = Math.min(3200, Math.max(1200, walkPath.length * 26))
    let start = null
    let raf
    let finishTimer
    function step(ts) {
      if (start === null) start = ts
      const elapsed = ts - start
      const nextPhase = elapsed < 300 ? 'start' : 'loop'
      setWalkPhase((phase) => phase === nextPhase ? phase : nextPhase)
      let t = Math.min(1, elapsed / dur)
      t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const i = Math.min(walkPath.length - 1, Math.floor(t * (walkPath.length - 1)))
      setPos(walkPath[i])
      if (i > 0) {
        const dx = walkPath[i][0] - walkPath[i - 1][0]
        if (dx !== 0) setFlip(dx < 0)
      }
      if (t < 1) raf = requestAnimationFrame(step)
      else {
        // Erst am Ziel abbremsen. onArrive darf erst feuern, wenn der letzte
        // Frame der Schlussanimation sichtbar abgeschlossen ist.
        setWalkPhase('stop')
        finishTimer = window.setTimeout(() => {
          setWalking(false)
          onArrive?.()
        }, 300)
      }
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(finishTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scale = 0.75 + 0.35 * depthNorm(pos[1])
  const bubbleShift = pos[0] < 260 ? '-12%' : pos[0] > MAP_WIDTH - 260 ? '-88%' : '-50%'
  return (
    <div
      className={`capy-walker ${walking ? 'walking' : ''}`}
      style={{ left: `${(pos[0] / MAP_WIDTH) * 100}%`, top: `calc(${pos[1] / 6}% - 22px)` }}
    >
      {!walking && bubbleText && (
        <div className="bubble capy-bubble" style={{ transform: `translateX(${bubbleShift})` }}>
          {bubbleText}
        </div>
      )}
      <div style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
        <span
          className={`capy-motion-stage ${walking ? 'walking' : ''} ${walkPhase === 'stop' ? 'stopping' : ''}`}
          style={{
            '--capy-walk-size': `${130 * scale}px`,
            '--capy-idle-size': `${130 * scale}px`
          }}
          role="img"
          aria-label={walking ? 'Capy läuft zum nächsten Level' : 'Capy wartet'}
        >
          <span className="capy-idle-stage" aria-hidden="true">
            <span className="capy-idle-sprite capy-idle-stand" />
          </span>
          {walking && (
            <span
              className={`capy-walk-sprite capy-walk-${walkPhase}`}
              aria-hidden="true"
            />
          )}
        </span>
      </div>
    </div>
  )
}

export default function Path({ profile, muted, lastPlayedLevelId, onStartLevel, onToggleMute, onSwitchProfile, revealed = true }) {
  const welcome = useMemo(() => WELCOME[Math.floor(Math.random() * WELCOME.length)], [])
  const currentRef = useRef(null)
  const worldsScrollRef = useRef(null)
  const bannerRefs = useRef({})
  const infoButtonRef = useRef(null)
  // Merkt sich, für welches Ziel zuletzt zur aktuellen Position gescrollt
  // wurde – siehe scrollIntoView-Effekt unten.
  const scrolledForTargetRef = useRef(null)
  // Wenn ein schon geschafftes Level noch einmal geübt wird, läuft Capy
  // erst sichtbar dorthin zurück, bevor das Quiz startet.
  const [pendingWalk, setPendingWalk] = useState(null)
  const [showInfo, setShowInfo] = useState(false)
  // true, solange CapyWalker gerade läuft (egal ob automatisches
  // Weiterlaufen nach Levelabschluss oder Replay) – siehe handleNodeClick.
  const [capyBusy, setCapyBusy] = useState(false)

  const progress = profile.progress

  // Anderes Profil als beim letzten Mal? Dann ist Capys gemerkte Position
  // die des vorherigen Profils – verwerfen, damit die Figur sofort (ohne
  // Laufanimation) am eigenen Fortschritt dieses Profils steht.
  if (profile.id !== capyProfileId) {
    capyProfileId = profile.id
    capyLastLevelId = null
    capyConsumedPassId = null
  }

  let firstOpenWorld = WORLDS.findIndex((w) => !worldDone(w, progress))
  if (firstOpenWorld === -1) firstOpenWorld = WORLDS.length - 1
  const allDone = WORLDS.every((w) => worldDone(w, progress))

  let currentIdx = ORDERED_LEVELS.findIndex((lv) => !progress[lv.id])
  if (currentIdx === -1) currentIdx = ORDERED_LEVELS.length - 1

  // Ziel für Capys "Heimweg" auf der Karte: Wurde gerade frisch ein Level
  // bestanden (auch ein wiederholtes altes), läuft Capy von GENAU DIESEM
  // Level aus einen Schritt weiter – nicht zum neuesten/aktuellen Level.
  // "Frisch" heißt: dieses bestandene Level wurde noch nicht für einen
  // Schritt verbraucht (siehe capyConsumedPassId unten). Ist gerade nichts
  // frisch bestanden (z. B. nach Abbruch/Nichtbestehen), bleibt Capy dort
  // stehen, wo sie zuletzt war, statt irgendwohin zu springen.
  const freshlyPassedIdx =
    lastPlayedLevelId && lastPlayedLevelId !== capyConsumedPassId
      ? ORDERED_LEVELS.findIndex((lv) => lv.id === lastPlayedLevelId)
      : -1
  const anchorIdx = capyLastLevelId ? ORDERED_LEVELS.findIndex((lv) => lv.id === capyLastLevelId) : -1
  const walkTargetIdx =
    freshlyPassedIdx !== -1
      ? Math.min(freshlyPassedIdx + 1, ORDERED_LEVELS.length - 1)
      : anchorIdx !== -1
        ? anchorIdx
        : currentIdx
  const walkTargetLevel = ORDERED_LEVELS[walkTargetIdx]
  const walkTargetWorldIdx = Math.max(0, WORLDS.findIndex((w) => walkTargetLevel && w.levels.includes(walkTargetLevel)))

  // Welche Welt gerade sichtbar ist (für die feststehende Namensanzeige,
  // die beim seitlichen Scrollen nicht mitwandert)
  const [viewWorldIdx, setViewWorldIdx] = useState(walkTargetWorldIdx)

  // Beim allerersten Rendern bekommt nur die sichtbare Welt + ihr Vorgänger
  // (wo Capy ggf. herläuft) sofort ihre Deko gerendert – mountete React sie
  // hier für ALLE Welten auf einen Schlag, gleichzeitig mit Kamera-Scroll und
  // Capys Lauf-Animation, war das die Hauptursache für das Ruckeln beim
  // Freischalten einer neuen Welt. Nach diesem kurzen Settle wird aber sofort
  // auf ALLE Welten umgeschaltet (nicht nur ein Fenster um die sichtbare
  // Welt): Seit Berge/Hügel/See als vorgerenderte Bilder liegen (siehe
  // Panorama.jsx), ist die verbleibende Live-Deko pro Welt günstig genug, um
  // sie dauerhaft geladen zu halten – vorher fehlte dieser Schritt, und beim
  // schnellen Hin-und-Herscrollen sah man Level-Deko und Nebel sichtbar
  // nachträglich einblenden, sobald man ihr Fenster erreichte.
  const aheadReadyRef = useRef(false)
  const [aheadReady, setAheadReady] = useState(false)
  useEffect(() => {
    if (aheadReadyRef.current) {
      setAheadReady(true)
      return
    }
    const id = window.setTimeout(() => {
      aheadReadyRef.current = true
      setAheadReady(true)
    }, 400)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeWorldWindow = useMemo(
    () =>
      aheadReady
        ? [0, WORLDS.length - 1]
        : [Math.max(0, viewWorldIdx - 1), viewWorldIdx],
    [viewWorldIdx, aheadReady]
  )

  // Path bleibt jetzt über den Quiz-Besuch hinweg gemountet (siehe App.jsx),
  // muss also nicht mehr bei jeder Rückkehr vom Quiz (revealed → true) neu
  // zur aktuellen Position scrollen – die Scrollposition ist ja unverändert
  // stehen geblieben. Ein erneutes scrollIntoView bei jeder Rückkehr kostete
  // im Performance-Profil genau in diesem Moment sichtbar Paint-/Raster-Zeit
  // und wirkte wie ein kleiner Ruckler der ganzen Karte. Gescrollt wird
  // deshalb nur noch, wenn sich das Ziel (walkTargetIdx) seit dem letzten
  // Scroll tatsächlich geändert hat – also beim allerersten Laden und wenn
  // Capy nach einem bestandenen Level einen Schritt weiterrückt.
  useEffect(() => {
    if (!revealed) return
    if (scrolledForTargetRef.current !== walkTargetIdx) {
      scrolledForTargetRef.current = walkTargetIdx
      if (currentRef.current) {
        currentRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
    // capyConsumedPassId wird bewusst NICHT hier gesetzt (siehe CapyWalker
    // onArrive unten) – dieser Effekt kann während der noch laufenden
    // Lauf-Animation mehrfach erneut feuern (z. B. durch einen Scroll-Event,
    // der währenddessen viewWorldIdx ändert). Würde capyConsumedPassId schon
    // hier "verbraucht", während capyLastLevelId noch den alten Stand zeigt
    // (Capy ist ja noch unterwegs), fiele walkTargetIdx auf einem
    // Zwischen-Render wieder auf die ALTE Position zurück – CapyWalker
    // bekäme dadurch einen neuen key, würde mitten in der Animation
    // abgebrochen und an der alten Stelle neu gemountet. Capy "vergaß" so
    // das Weiterlaufen in eine frisch freigeschaltete Welt komplett.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, walkTargetIdx])

  // Welche Welt beim Scrollen als "aktiv" gilt, wird aus den Banner-Positionen
  // bestimmt. Die Positionen selbst ändern sich nur bei Größenänderungen des
  // Fensters (das Layout ist rein prozentual) – sie deshalb bei JEDEM
  // Scroll-Frame per getBoundingClientRect() neu zu messen (wie zuvor)
  // erzwingt an dieser Stelle bei jedem Frame ein synchrones Layout-Recalc
  // (im Performance-Profil klar als "ForcedStyleAndLayout" sichtbar) – eine
  // spürbare Ursache für Ruckeln beim Scrollen. Stattdessen werden die
  // Positionen einmalig (und bei Resize) gemessen und gecacht; der
  // Scroll-Handler selbst liest nur noch scrollLeft/clientWidth, ohne das
  // Layout zu erzwingen.
  useEffect(() => {
    const el = worldsScrollRef.current
    if (!el) return
    let bannerOffsets = []
    function measure() {
      const containerLeft = el.getBoundingClientRect().left
      bannerOffsets = WORLDS.map((w) => {
        const node = bannerRefs.current[w.id]
        return node ? node.getBoundingClientRect().left - containerLeft + el.scrollLeft : 0
      })
    }
    let raf = null
    function update() {
      raf = null
      const scrollLeft = el.scrollLeft
      el.style.setProperty('--scroll', `${scrollLeft}px`)
      // eine Welt gilt schon als "aktiv", sobald ihr Anfang kurz vor der
      // Mitte des sichtbaren Bereichs steht – nicht erst, wenn sie den
      // linken Rand erreicht (das kam bisher spürbar zu spät)
      const threshold = el.clientWidth * 0.5 + 30
      let best = null
      for (let wi = 0; wi < bannerOffsets.length; wi++) {
        if (bannerOffsets[wi] - scrollLeft <= threshold) best = wi
      }
      if (best !== null) setViewWorldIdx(best)
    }
    function onScroll() {
      if (raf === null) raf = requestAnimationFrame(update)
    }
    measure()
    update()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [])

  const bubbleText = allDone
    ? 'WOW! Du hast ALLE Welten geschafft! Du bist die Königin/der König der Zahlenwelt! 👑'
    : welcome

  function handleNodeClick(lv, gi) {
    if (pendingWalk || capyBusy) return // Capy ist schon unterwegs
    const capyIdx = capyLastLevelId
      ? ORDERED_LEVELS.findIndex((level) => level.id === capyLastLevelId)
      : -1
    const needsWalk = capyIdx !== -1 && capyIdx !== gi
    const isPastLevel = !!progress[lv.id] && gi !== currentIdx
    if (needsWalk || isPastLevel) {
      setPendingWalk({ idx: gi, level: lv })
    } else {
      onStartLevel(lv)
    }
  }

  return (
    <div
      className={`screen path-screen ${!revealed ? 'is-hidden' : ''}`}
      data-accent={profile.accent || 'blue'}
      inert={!revealed ? '' : undefined}
    >
      <header className="path-header">
        <div className="header-profile">
          <span className="header-avatar">
            <AnimalAvatar avatar={profile.avatar} className="header-avatar-symbol" />
          </span>
          <span className="header-name">{profile.name}</span>
        </div>
        <div className="header-right">
          <button className="icon-btn" onClick={onToggleMute} title="Ton an/aus">
            {muted ? '🔇' : '🔊'}
          </button>
          <button className="icon-btn" onClick={onSwitchProfile} title="Profil wechseln">
            👤
          </button>
          <button
            ref={infoButtonRef}
            className="icon-btn info-btn"
            onClick={() => setShowInfo(true)}
            title="Über dieses Spiel"
            aria-label="Über dieses Spiel"
          >
            <span aria-hidden="true">i</span>
          </button>
        </div>
      </header>

      {/* Name der gerade sichtbaren Welt – schwebt fest oben links,
          bleibt beim seitlichen Scrollen an derselben Stelle stehen.
          Für noch gesperrte Welten wird der Name nicht verraten. */}
      {viewWorldIdx >= 0 && WORLDS[viewWorldIdx] && (
        worldUnlocked(viewWorldIdx, progress) ? (
          (() => {
            const w = WORLDS[viewWorldIdx]
            const doneCount = w.levels.filter((lv) => progress[lv.id]).length
            const pct = Math.round((doneCount / w.levels.length) * 100)
            return (
              <div className="world-banner-fixed">
                <div className="world-banner-icon">{w.emoji}</div>
                <div className="world-banner-label">Welt {viewWorldIdx + 1}</div>
                <div className="world-banner-name">{w.name}</div>
                <div className="world-banner-bar-track">
                  <div className="world-banner-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="world-banner-progress-text">
                  {doneCount}/{w.levels.length} Level ✓
                </div>
              </div>
            )
          })()
        ) : (
          <div className="world-banner-fixed locked">
            <div className="world-banner-icon">🔒</div>
            <div className="world-banner-label">Welt {viewWorldIdx + 1}</div>
            <div className="world-banner-name">???</div>
            <div className="world-banner-progress-text">Noch nicht freigeschaltet</div>
          </div>
        )
      )}

      <div className="worlds" ref={worldsScrollRef}>
        <div
          className="map-clip"
          style={{
            width: `calc(${SHOW_ALL_WORLDS ? WORLDS.length : Math.min(WORLDS.length, firstOpenWorld + 3)} * max(100vw, 166dvh))`
          }}
        >
        <div className="panorama">
          {/* Der Weg wird INNERHALB von Panorama gerendert (zwischen Boden-Fläche
              und Deko), damit Bäume & Co. realistisch VOR dem Weg stehen statt
              dass der Weg über Baumkronen gemalt wird. Der braune Belag ist
              bewusst weg – nur die Punkte markieren den Streckenverlauf. */}
          <Panorama roadLayer={<SegmentDots progress={progress} />} activeWorldWindow={activeWorldWindow} />

          {/* unsichtbare Marker an der Startposition jeder Welt – dienen
              nur dazu, beim Scrollen zu erkennen, welche Welt gerade sichtbar ist */}
          {WORLDS.map((w, wi) => (
            <div
              key={w.id}
              ref={(el) => { bannerRefs.current[w.id] = el }}
              className="world-banner-anchor"
              style={{ left: `${(wi * 100) / WORLDS.length}%` }}
            />
          ))}

          {/* Level-Stationen */}
          {ORDERED_LEVELS.map((lv, gi) => {
            const wi = WORLDS.findIndex((w) => w.levels.includes(lv))
            if (!worldUnlocked(wi, progress)) return null
            const levelNumber = WORLDS[wi].levels.indexOf(lv) + 1
            const stars = progress[lv.id] || 0
            const unlocked = gi === 0 || !!progress[ORDERED_LEVELS[gi - 1].id]
            const isCurrent = gi === currentIdx
            const [x, y] = GLOBAL_NODES[gi]
            const scale = 0.8 + 0.35 * depthNorm(y)
            const state = !unlocked ? 'locked' : stars ? 'done' : 'open'
            return (
              <div
                key={lv.id}
                className="world-node"
                ref={gi === walkTargetIdx ? currentRef : null}
                style={{
                  left: `${(x / MAP_WIDTH) * 100}%`,
                  top: `${y / 6}%`,
                  zIndex: Math.round(y / 100) + 14
                }}
              >
                <button
                  className={`node node-${lv.kind} ${state} ${isCurrent ? 'current' : ''}`}
                  style={{ width: 64 * scale, height: 64 * scale }}
                  disabled={!unlocked}
                  onClick={() => handleNodeClick(lv, gi)}
                  aria-label={`${lv.title}: ${lv.subtitle}${stars ? `, ${stars} von 3 Sternen` : ''}`}
                >
                  <span className="node-shine" aria-hidden="true" />
                  <span className="node-icon" style={{ fontSize: `${1.25 * scale}rem` }}>
                    {!unlocked
                      ? '🔒'
                      : KIND_ICON[lv.kind] || (lv.kind === 'learn' ? `${lv.rows[0]}·` : `${lv.rows[0]}×`)}
                  </span>
                  {unlocked && lv.kind !== 'final' && (
                    <span className="node-level-number" aria-hidden="true">{levelNumber}</span>
                  )}
                </button>
                <button
                  type="button"
                  className="node-chip"
                  style={{ transform: `translateX(-50%) scale(${0.85 + 0.15 * scale})` }}
                  disabled={!unlocked}
                  onClick={() => handleNodeClick(lv, gi)}
                >
                  {isCurrent && <span className="node-status">Als Nächstes</span>}
                  <div className="node-title">{lv.title}</div>
                  <div className="node-sub">{lv.subtitle}</div>
                  {stars > 0 && <Stars n={stars} />}
                </button>
              </div>
            )
          })}

          <CapyWalker
            key={pendingWalk ? `replay-${pendingWalk.level.id}` : `home-${walkTargetIdx}`}
            targetIdx={pendingWalk ? pendingWalk.idx : walkTargetIdx}
            onWalkingChange={setCapyBusy}
            bubbleText={pendingWalk ? null : bubbleText}
            onArrive={
              pendingWalk
                ? () => {
                    capyLastLevelId = pendingWalk.level.id
                    onStartLevel(pendingWalk.level)
                    // Path bleibt jetzt während des Quiz gemountet (siehe
                    // App.jsx) statt neu aufgebaut zu werden – das setzte
                    // pendingWalk früher automatisch zurück. Ohne dieses
                    // explizite Zurücksetzen bliebe pendingWalk beim
                    // Verlassen eines unvollständigen Quiz stehen und
                    // handleNodeClick würde JEDEN weiteren Klick blockieren
                    // ("if (pendingWalk) return").
                    setPendingWalk(null)
                  }
                : () => {
                    capyLastLevelId = walkTargetLevel ? walkTargetLevel.id : null
                    // Atomar zusammen mit capyLastLevelId setzen (siehe
                    // Kommentar beim scrollIntoView-Effekt oben): erst wenn
                    // Capy wirklich angekommen ist, gilt der frische Pass als
                    // verbraucht. So bleibt walkTargetIdx während der
                    // gesamten Lauf-Animation stabil, auch wenn Path
                    // zwischendurch (z. B. durch Scrollen) erneut rendert.
                    capyConsumedPassId = lastPlayedLevelId
                  }
            }
          />

          {/* Nebel über noch nicht erreichten Regionen: ein Teaser-Nebel über
              der nächsten Welt und EIN durchgehender dichter Nebel über allem
              danach. Beide sind vorgerenderte Bilder (siehe fog-capture.html
              zur Erzeugung) statt live berechneter Verläufe/Masken/Blur mit
              Dauer-Animation – das war zum einen unnötig teuer beim Scrollen,
              zum anderen blendete die alte, sehr sanfte Masken-Rampe über
              einen so großen Bereich ein, dass die gesperrte Welt kurz nach
              der Grenze noch fast unvernebelt sichtbar war. Die neuen Bilder
              haben den Übergang fest eingebacken und werden direkt am
              Weltrand (alle Welten sind exakt gleich breit) angesetzt. Die
              v2-Dateien nutzen in der 7%-Überlappung einen abgestimmten
              Crossfade: Der Teaser blendet aus, während der dichte Nebel
              über dieselbe Strecke weich einblendet. */}
          {FOG_ENABLED && (() => {
            const teaserIdx = firstOpenWorld + 1
            const denseStart = firstOpenWorld + 2
            const R = 100 / WORLDS.length
            const parts = []
            if (teaserIdx < WORLDS.length && !worldUnlocked(teaserIdx, progress)) {
              parts.push(
                <div
                  key="fog-teaser"
                  className="fog-zone fog-teaser"
                  style={{
                    left: `calc(${teaserIdx * R}% - 4%)`,
                    width: `calc(${R}% + 4%)`,
                    backgroundImage: `url(${fogTeaserArt})`
                  }}
                >
                  <div className="locked-center">
                    <div className="locked-card">
                      <div className="locked-lock" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V6Zm3 9.73V18h-2v-2.27a2 2 0 1 1 2 0Z" />
                        </svg>
                      </div>
                      <div className="locked-card-copy">
                        <div className="locked-kicker">Welt {teaserIdx + 1}</div>
                        <div className="locked-name">Diese Welt ist noch geheim</div>
                        <div className="locked-hint">
                          Schaffe zuerst alle Level in „{WORLDS[teaserIdx - 1].name}“.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            if (denseStart < WORLDS.length) {
              // Der dichte Nebel reicht ohne Rundungs-/Viewport-Lücke bis
              // exakt ans Ende des aktuell erreichbaren Kartenausschnitts.
              parts.push(
                <div
                  key="fog-dense"
                  className="fog-zone fog-dense"
                  style={{
                    left: `calc(${denseStart * R}% - 7%)`,
                    // Der dichte Nebel endet am Rand des tatsächlich
                    // erreichbaren Kartenausschnitts. So liegt sein Inhalt
                    // nicht unsichtbar in den später abgeschnittenen Welten.
                    width: `calc(${R}% + 7%)`,
                    backgroundImage: `url(${fogDenseArt})`
                  }}
                >
                  <div className="more-worlds-hint">
                    <span className="more-worlds-copy">
                      <span className="more-worlds-title">
                        {denseStart + 1 < WORLDS.length
                          ? 'Hier gibt es noch mehr Welten'
                          : 'Hier gibt es noch eine weitere Welt'}
                      </span>
                      <span className="more-worlds-subtitle">Was wohl hinter dem Nebel wartet?</span>
                    </span>
                  </div>
                </div>
              )
            }
            return parts
          })()}

          {allDone && <div className="path-end panorama-end">🏆</div>}
        </div>
        </div>
      </div>

      <InfoModal
        open={showInfo}
        accent={profile.accent || 'blue'}
        onClose={() => setShowInfo(false)}
        returnFocusRef={infoButtonRef}
      />
    </div>
  )
}
