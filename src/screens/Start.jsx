import { useMemo, useRef, useState } from 'react'
import InfoModal from '../components/InfoModal.jsx'
import { usePortrait } from '../utils/useOrientation.js'

const GREETINGS = [
  'Da bist du ja wieder, {name}! 🎉',
  'Hallo, {name}!',
  'Schön, dass du da bist, {name}!',
  'Willkommen zurück, {name}! 🦫',
  'Na, {name}? Bereit zum Rechnen?',
  'Capy hat schon auf dich gewartet, {name}!'
]

export default function Start({ profile, muted, onStart, onToggleMute, onSwitchProfile }) {
  const [showSettings, setShowSettings] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const infoButtonRef = useRef(null)
  const portrait = usePortrait()

  // Zufällige Begrüßung – bei jedem Seitenaufruf anders
  const greeting = useMemo(() => {
    if (!profile) return null
    const g = GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
    return g.replace('{name}', profile.name)
  }, [profile])

  const imgSrc = portrait ? 'bilder/start-hoch-v2.png' : 'bilder/start-quer.png'

  return (
    <div className="splash" data-accent={profile?.accent || 'blue'}>
      <img
        className="splash-img"
        src={imgSrc}
        alt="Capys Zahlenwelt"
        onError={(e) => {
          e.target.style.display = 'none'
        }}
      />
      <div className="splash-scrim" />

      <div className="splash-header-actions" role="group" aria-label="Weitere Optionen">
        <button
          ref={infoButtonRef}
          className="icon-btn info-btn"
          type="button"
          title="Über dieses Spiel"
          aria-label="Informationen über Capys Zahlenwelt öffnen"
          onClick={() => setShowInfo(true)}
        >
          <span aria-hidden="true">i</span>
        </button>
        <button
          className="icon-btn splash-settings"
          type="button"
          title="Einstellungen"
          aria-label="Einstellungen öffnen"
          onClick={() => setShowSettings(true)}
        >
          ⚙️
        </button>
      </div>

      <div className="splash-bottom">
        {greeting ? (
          <div className="splash-greeting">{greeting}</div>
        ) : (
          <div className="splash-greeting">Hallo! Wer möchte mit Capy rechnen?</div>
        )}
        <button className="btn btn-start" onClick={onStart}>
          <span className="start-play-icon" aria-hidden="true">▶</span>
          <span>Spielen</span>
        </button>
      </div>

      {showSettings && (
        <div className="modal-backdrop" onClick={() => setShowSettings(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">⚙️ Einstellungen</h2>
            <button className="btn btn-secondary" onClick={onToggleMute}>
              {muted ? '🔇 Ton ist aus' : '🔊 Ton ist an'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowSettings(false)
                onSwitchProfile()
              }}
            >
              👤 Profil wechseln
            </button>
            <button className="btn btn-ghost" onClick={() => setShowSettings(false)}>
              Schließen
            </button>
          </div>
        </div>
      )}

      <InfoModal
        open={showInfo}
        accent={profile?.accent || 'blue'}
        onClose={() => setShowInfo(false)}
        returnFocusRef={infoButtonRef}
      />
    </div>
  )
}
