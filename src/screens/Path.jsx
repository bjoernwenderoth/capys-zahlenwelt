import { useEffect, useMemo, useRef, useState } from 'react'
import Capybara from '../components/Capybara.jsx'
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
import { currentStreak } from '../utils/storage.js'

const WELCOME = [
  'Schön, dass du da bist! Auf zum nächsten Level!',
  'Übung macht den Meister! 💪',
  'Heute schaffst du bestimmt 3 Sterne!',
  'Ich glaube an dich!',
  'Weiter geht die Reise durch die Zahlenwelten!'
]

const KIND_ICON = { review: '🔁', final: '👑' }

// Temporär deaktiviert, während die Welten gestaltet werden.
// Zum Reaktivieren einfach wieder auf true setzen.
const FOG_ENABLED = false

// Weg und Punkte einmal für die gesamte Karte berechnen
const EXIT_X = MAP_WIDTH + 2
const PTS = extendedPoints(GLOBAL_NODES, EXIT_X)

// merkt sich (solange die Seite offen ist), wo Capy zuletzt stand
let capyLastLevelId = null

function Stars({ n }) {
  return (
    <span className="stars">
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? 'star on' : 'star'}>★</span>
      ))}
    </span>
  )
}

// Punkte auf dem Weg: geschaffte Abschnitte (hinter Capy) leuchten golden,
// kommende sind nur dezent zu sehen
function SegmentDots({ progress }) {
  const dots = []
  for (let k = 0; k <= GLOBAL_NODES.length; k++) {
    const seg = sampleSegment(PTS, k, 20)
    const done = k === 0 ? true : !!progress[ORDERED_LEVELS[k - 1].id]
    for (const i of [4, 7, 10, 13, 16]) {
      const [x, y] = seg[i]
      const r = 3.4 + 2.4 * depthNorm(y)
      dots.push(
        done ? (
          <g key={`${k}-${i}`}>
            <circle cx={x} cy={y} r={r * 1.9} fill="#ffd93d" opacity="0.35" />
            <circle cx={x} cy={y} r={r} fill="#fff" stroke="#ffd93d" strokeWidth={r * 0.55} />
          </g>
        ) : (
          <circle key={`${k}-${i}`} cx={x} cy={y} r={r * 0.8} fill="#8a6b3f" opacity="0.35" />
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
function CapyWalker({ targetIdx, bubbleText, onArrive }) {
  const targetPt = PTS[targetIdx + 1]

  const walkPath = useMemo(() => {
    if (!capyLastLevelId) {
      return targetIdx === 0 ? sampleSegment(PTS, 0, 40) : null // Spielstart: hereinlaufen
    }
    const prevIdx = ORDERED_LEVELS.findIndex((lv) => lv.id === capyLastLevelId)
    if (prevIdx === -1 || prevIdx === targetIdx) return null
    return pathBetween(prevIdx, targetIdx)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [pos, setPos] = useState(() => (walkPath ? walkPath[0] : targetPt))
  const [walking, setWalking] = useState(!!walkPath)
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    if (!walkPath) {
      onArrive?.()
      return
    }
    const dur = Math.min(3200, Math.max(1200, walkPath.length * 26))
    let start = null
    let raf
    function step(ts) {
      if (start === null) start = ts
      let t = Math.min(1, (ts - start) / dur)
      t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const i = Math.min(walkPath.length - 1, Math.floor(t * (walkPath.length - 1)))
      setPos(walkPath[i])
      if (i > 0) setFlip(walkPath[i][0] < walkPath[i - 1][0])
      if (t < 1) raf = requestAnimationFrame(step)
      else {
        setWalking(false)
        onArrive?.()
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
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
        <Capybara mood={walking ? 'normal' : 'happy'} size={150 * scale} />
      </div>
    </div>
  )
}

export default function Path({ profile, muted, onStartLevel, onToggleMute, onSwitchProfile }) {
  const streak = currentStreak(profile.streak)
  const welcome = useMemo(() => WELCOME[Math.floor(Math.random() * WELCOME.length)], [])
  const currentRef = useRef(null)
  const worldsScrollRef = useRef(null)
  const bannerRefs = useRef({})
  // Wenn ein schon geschafftes Level noch einmal geübt wird, läuft Capy
  // erst sichtbar dorthin zurück, bevor das Quiz startet.
  const [pendingWalk, setPendingWalk] = useState(null)

  const progress = profile.progress

  let firstOpenWorld = WORLDS.findIndex((w) => !worldDone(w, progress))
  if (firstOpenWorld === -1) firstOpenWorld = WORLDS.length - 1
  const allDone = WORLDS.every((w) => worldDone(w, progress))

  let currentIdx = ORDERED_LEVELS.findIndex((lv) => !progress[lv.id])
  if (currentIdx === -1) currentIdx = ORDERED_LEVELS.length - 1
  const currentLevel = ORDERED_LEVELS[currentIdx]
  const currentWorldIdx = Math.max(0, WORLDS.findIndex((w) => currentLevel && w.levels.includes(currentLevel)))

  // Welche Welt gerade sichtbar ist (für die feststehende Namensanzeige,
  // die beim seitlichen Scrollen nicht mitwandert)
  const [viewWorldIdx, setViewWorldIdx] = useState(currentWorldIdx)

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
    capyLastLevelId = currentLevel ? currentLevel.id : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = worldsScrollRef.current
    if (!el) return
    let raf = null
    function update() {
      raf = null
      el.style.setProperty('--scroll', `${el.scrollLeft}px`)
      const containerRect = el.getBoundingClientRect()
      // eine Welt gilt schon als "aktiv", sobald ihr Anfang kurz vor der
      // Mitte des sichtbaren Bereichs steht – nicht erst, wenn sie den
      // linken Rand erreicht (das kam bisher spürbar zu spät)
      const threshold = containerRect.width * 0.5 + 30
      let best = null
      WORLDS.forEach((w, wi) => {
        const node = bannerRefs.current[w.id]
        if (!node) return
        if (node.getBoundingClientRect().left - containerRect.left <= threshold) {
          if (best === null || wi > best) best = wi
        }
      })
      if (best !== null) setViewWorldIdx(best)
    }
    function onScroll() {
      if (raf === null) raf = requestAnimationFrame(update)
    }
    update()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const bubbleText = allDone
    ? 'WOW! Du hast ALLE Welten geschafft! Du bist die Königin/der König der Zahlenwelt! 👑'
    : welcome

  function handleNodeClick(lv, gi) {
    if (pendingWalk) return // Capy ist schon unterwegs
    const isPastLevel = !!progress[lv.id] && gi !== currentIdx
    if (isPastLevel) {
      setPendingWalk({ idx: gi, level: lv })
    } else {
      onStartLevel(lv)
    }
  }

  return (
    <div className="screen path-screen">
      <header className="path-header">
        <div className="header-profile">
          <span className="header-avatar">{profile.avatar}</span>
          <span className="header-name">{profile.name}</span>
        </div>
        <div className="header-right">
          <span className="streak" title="Tage-Serie">🔥 {streak}</span>
          <button className="icon-btn" onClick={onToggleMute} title="Ton an/aus">
            {muted ? '🔇' : '🔊'}
          </button>
          <button className="icon-btn" onClick={onSwitchProfile} title="Profil wechseln">
            👤
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
          <Panorama roadLayer={<SegmentDots progress={progress} />} />

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
                ref={isCurrent ? currentRef : null}
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
                >
                  <span className="node-icon" style={{ fontSize: `${1.25 * scale}rem` }}>
                    {!unlocked
                      ? '🔒'
                      : KIND_ICON[lv.kind] || (lv.kind === 'learn' ? `${lv.rows[0]}·` : `${lv.rows[0]}×`)}
                  </span>
                </button>
                <button
                  type="button"
                  className="node-chip"
                  style={{ transform: `scale(${0.85 + 0.15 * scale})` }}
                  disabled={!unlocked}
                  onClick={() => handleNodeClick(lv, gi)}
                >
                  <div className="node-title">{lv.title}</div>
                  <div className="node-sub">{lv.subtitle}</div>
                  {stars > 0 && <Stars n={stars} />}
                </button>
              </div>
            )
          })}

          <CapyWalker
            key={pendingWalk ? `replay-${pendingWalk.level.id}` : 'home'}
            targetIdx={pendingWalk ? pendingWalk.idx : currentIdx}
            bubbleText={pendingWalk ? null : bubbleText}
            onArrive={
              pendingWalk
                ? () => {
                    capyLastLevelId = pendingWalk.level.id
                    onStartLevel(pendingWalk.level)
                  }
                : undefined
            }
          />

          {/* Nebel über noch nicht erreichten Regionen:
              ein Teaser-Nebel über der nächsten Welt und EIN durchgehender
              dichter Nebel über allem danach (keine Kanten zwischen Zonen) */}
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
                  style={{ left: `calc(${teaserIdx * R}% - 4%)`, width: `calc(${R}% + 4%)` }}
                >
                  <div className="locked-center">
                    <div className="locked-lock">🔒</div>
                    <div className="locked-name">Welt {teaserIdx + 1}: ???</div>
                    <div className="locked-hint">
                      Schaffe erst alle Level in „{WORLDS[teaserIdx - 1].name}“, um diese Welt zu
                      entdecken!
                    </div>
                  </div>
                </div>
              )
            }
            if (denseStart < WORLDS.length) {
              // nur EINE Welt liegt komplett im Nebel, der Rest der Karte
              // ist abgeschnitten („weitere geheime Welten“)
              parts.push(
                <div
                  key="fog-dense"
                  className="fog-zone fog-dense"
                  style={{
                    left: `calc(${denseStart * R}% - 7%)`,
                    width: `calc(${R}% + 7%)`
                  }}
                >
                  <div className="locked-center">
                    <div className="locked-name">
                      🗺️ {denseStart + 1 < WORLDS.length ? 'Mehr geheime Welten' : 'Geheime Welt'}
                    </div>
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
    </div>
  )
}
