import { useEffect, useMemo, useState } from 'react'

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
  const [portrait, setPortrait] = useState(
    () => window.matchMedia('(orientation: portrait)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)')
    const fn = (e) => setPortrait(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  // Zufällige Begrüßung – bei jedem Seitenaufruf anders
  const greeting = useMemo(() => {
    if (!profile) return null
    const g = GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
    return g.replace('{name}', profile.name)
  }, [profile])

  const imgSrc = portrait ? 'bilder/start-hoch.png' : 'bilder/start-quer.png'

  return (
    <div className="splash">
      <img
        className="splash-img"
        src={imgSrc}
        alt="Capys Zahlenwelt"
        onError={(e) => {
          e.target.style.display = 'none'
        }}
      />
      <div className="splash-scrim" />

      <button
        className="icon-btn splash-settings"
        title="Einstellungen"
        onClick={() => setShowSettings(true)}
      >
        ⚙️
      </button>

      <div className="splash-bottom">
        {greeting ? (
          <div className="splash-greeting">{greeting}</div>
        ) : (
          <div className="splash-greeting">Hallo! Wer möchte mit Capy rechnen?</div>
        )}
        <button className="btn btn-start" onClick={onStart}>
          ▶ Spielen
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
    </div>
  )
}
