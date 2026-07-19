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

function SettingsIcon() {
  return (
    <svg
      className="settings-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4A2 2 0 0 0 4 9.9l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.8l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.8v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

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
        alt="Capys Zahlenschatz"
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
          aria-label="Informationen über Capys Zahlenschatz öffnen"
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
          <SettingsIcon />
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
            <h2 className="modal-title settings-modal-title">
              <SettingsIcon />
              <span>Einstellungen</span>
            </h2>
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
