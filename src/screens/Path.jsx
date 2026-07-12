import { useEffect, useMemo, useRef, useState } from 'react'
import Capybara from '../components/Capybara.jsx'
import Panorama from '../components/Panorama.jsx'
import {
  WORLDS,
  worldDone,
  worldUnlocked,
  ORDERED_LEVELS,
  GLOBAL_NODES,
  MAP_WIDTH,
  extendedPoints,
  sampleSegment,
  ribbonPaths,
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

// Weg und Punkte einmal für die gesamte Karte berechnen
const EXIT_X = MAP_WIDTH + 2
const PTS = extendedPoints(GLOBAL_NODES, EXIT_X)
const RIBBON = ribbonPaths(GLOBAL_NODES, EXIT_X)

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

// Capy, der auf dem Weg steht und zum aktuellen Level läuft
function CapyWalker({ targetIdx, bubbleText }) {
  const targetPt = PTS[targetIdx + 1]

  const walkFrom = useMemo(() => {
    if (capyLastLevelId) {
      const prevIdx = ORDERED_LEVELS.findIndex((lv) => lv.id === capyLastLevelId)
      if (prevIdx !== -1 && prevIdx === targetIdx - 1) return targetIdx
    }
    if (targetIdx === 0 && !capyLastLevelId) return 0 // Spielstart: hereinlaufen
    return -1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [pos, setPos] = useState(() =>
    walkFrom >= 0 ? sampleSegment(PTS, walkFrom, 1)[0] : targetPt
  )
  const [walking, setWalking] = useState(walkFrom >= 0)
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    if (walkFrom < 0) return
    const samples = sampleSegment(PTS, walkFrom, 60)
    const dur = 1800
    let start = null
    let raf
    function step(ts) {
      if (start === null) start = ts
      let t = Math.min(1, (ts - start) / dur)
      t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const i = Math.min(samples.length - 1, Math.floor(t * (samples.length - 1)))
      setPos(samples[i])
      if (i > 0) setFlip(samples[i][0] < samples[i - 1][0])
      if (t < 1) raf = requestAnimationFrame(step)
      else setWalking(false)
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
      style={{ left: `${(pos[0] / MAP_WIDTH) * 100}%`, top: `${pos[1] / 6}%` }}
    >
      {!walking && bubbleText && (
        <div className="bubble capy-bubble" style={{ transform: `translateX(${bubbleShift})` }}>
          {bubbleText}
        </div>
      )}
      <div style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
        <Capybara mood={walking ? 'normal' : 'happy'} size={180 * scale} />
      </div>
    </div>
  )
}

export default function Path({ profile, muted, onStartLevel, onToggleMute, onSwitchProfile }) {
  const streak = currentStreak(profile.streak)
  const welcome = useMemo(() => WELCOME[Math.floor(Math.random() * WELCOME.length)], [])
  const currentRef = useRef(null)

  const progress = profile.progress

  let firstOpenWorld = WORLDS.findIndex((w) => !worldDone(w, progress))
  if (firstOpenWorld === -1) firstOpenWorld = WORLDS.length - 1
  const allDone = WORLDS.every((w) => worldDone(w, progress))

  let currentIdx = ORDERED_LEVELS.findIndex((lv) => !progress[lv.id])
  if (currentIdx === -1) currentIdx = ORDERED_LEVELS.length - 1
  const currentLevel = ORDERED_LEVELS[currentIdx]

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
    capyLastLevelId = currentLevel ? currentLevel.id : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bubbleText = allDone
    ? 'WOW! Du hast ALLE Welten geschafft! Du bist die Königin/der König der Zahlenwelt! 👑'
    : welcome

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

      <div className="worlds">
        <div
          className="map-clip"
          style={{
            width: `calc(${Math.min(WORLDS.length, firstOpenWorld + 3)} * max(100vw, 166dvh))`
          }}
        >
        <div className="panorama">
          <Panorama />

          {/* durchgehender Weg über die ganze Karte */}
          <svg className="world-road" viewBox={`0 0 ${MAP_WIDTH} 600`} preserveAspectRatio="none">
            <path d={RIBBON.outer} fill="#a8834f" opacity="0.95" />
            <path d={RIBBON.inner} fill="#ecd9a8" />
            <SegmentDots progress={progress} />
          </svg>

          {/* Weltbanner */}
          {WORLDS.map((w, wi) => {
            if (!worldUnlocked(wi, progress)) return null
            const doneCount = w.levels.filter((lv) => progress[lv.id]).length
            return (
              <div
                key={w.id}
                className="world-banner"
                style={{ left: `calc(${(wi * 100) / WORLDS.length}% + 14px)` }}
              >
                <span className="world-emoji">{w.emoji}</span>
                <span>
                  Welt {wi + 1}: {w.name}
                </span>
                <span className="world-count">{doneCount}/{w.levels.length} ✓</span>
              </div>
            )
          })}

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
                  zIndex: Math.round(y / 100) + 4
                }}
              >
                <button
                  className={`node node-${lv.kind} ${state} ${isCurrent ? 'current' : ''}`}
                  style={{ width: 64 * scale, height: 64 * scale }}
                  disabled={!unlocked}
                  onClick={() => onStartLevel(lv)}
                >
                  <span className="node-icon" style={{ fontSize: `${1.25 * scale}rem` }}>
                    {!unlocked
                      ? '🔒'
                      : KIND_ICON[lv.kind] || (lv.kind === 'learn' ? `${lv.rows[0]}·` : `${lv.rows[0]}×`)}
                  </span>
                </button>
                <div className="node-chip" style={{ transform: `scale(${0.85 + 0.15 * scale})` }}>
                  <div className="node-title">{lv.title}</div>
                  <div className="node-sub">{lv.subtitle}</div>
                  {stars > 0 && <Stars n={stars} />}
                </div>
              </div>
            )
          })}

          <CapyWalker targetIdx={currentIdx} bubbleText={bubbleText} />

          {/* Nebel über noch nicht erreichten Regionen:
              ein Teaser-Nebel über der nächsten Welt und EIN durchgehender
              dichter Nebel über allem danach (keine Kanten zwischen Zonen) */}
          {(() => {
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
