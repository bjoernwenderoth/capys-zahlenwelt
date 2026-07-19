import { useEffect, useRef, useState } from 'react'
import Panorama from '../components/Panorama.jsx'
import { cancelSpeech, speakSequence } from '../utils/audio.js'

const INTRO_NARRATION_PARTS = [
  'Capy braucht deine Hilfe!',
  'Capy ist auf der Suche nach einem geheimnisvollen Schatz.',
  'Auf seiner Reise entdeckt er fantastische Welten, begegnet spannenden Abenteuern und folgt geheimnisvollen Spuren.',
  'Doch der Weg zum Schatz ist voller kniffliger Mathe-Rätsel.',
  'Immer wieder versperren Zahlen, Aufgaben und Denkfallen Capy den Weg.',
  'Nur mit deinem Köpfchen kann die Reise weitergehen!',
  'Hilfst du Capy dabei, die Rätsel zu lösen und den verborgenen Schatz zu finden?'
]

export default function Intro({ accent = 'blue', onReadingChange, onContinue }) {
  const [isReading, setIsReading] = useState(false)
  const readingRef = useRef(false)
  const readButtonRef = useRef(null)
  const continueRef = useRef(null)
  const baseUrl = import.meta.env.BASE_URL
  const speechSupported =
    'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => continueRef.current?.focus({ preventScroll: true }))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(
    () => () => {
      cancelSpeech()
      if (readingRef.current) onReadingChange?.(false)
      readingRef.current = false
    },
    [onReadingChange]
  )

  function updateReading(next) {
    if (readingRef.current === next) return
    readingRef.current = next
    setIsReading(next)
    onReadingChange?.(next)
  }

  function stopReading() {
    cancelSpeech()
    updateReading(false)
  }

  function toggleReading() {
    if (isReading) {
      stopReading()
      return
    }

    const started = speakSequence(INTRO_NARRATION_PARTS, false, {
      rate: 0.88,
      pauseMs: 140,
      onEnd: () => updateReading(false),
      onError: () => updateReading(false)
    })
    if (started) updateReading(true)
  }

  function handleContinue() {
    stopReading()
    onContinue()
  }

  function handleKeyDown(event) {
    if (event.key !== 'Tab') return

    const controls = [speechSupported ? readButtonRef.current : null, continueRef.current].filter(Boolean)
    const currentIndex = controls.indexOf(document.activeElement)
    if (currentIndex === -1) return

    event.preventDefault()
    const direction = event.shiftKey ? -1 : 1
    const nextIndex = (currentIndex + direction + controls.length) % controls.length
    controls[nextIndex].focus()
  }

  return (
    <div className="intro-screen" data-accent={accent}>
      <div className="intro-world-preview" aria-hidden="true">
        <div className="intro-panorama-track">
          <Panorama activeWorldWindow={[0, 0]} />
        </div>
      </div>
      <div className="intro-world-scrim" aria-hidden="true" />

      <section
        className="intro-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
        aria-describedby="intro-story intro-invitation"
        onKeyDown={handleKeyDown}
      >
        <div className="intro-visual" aria-hidden="true">
          <span className="intro-visual-badge">Auf Schatzsuche</span>
          <span className="intro-symbol intro-symbol-one">×</span>
          <span className="intro-symbol intro-symbol-two">7</span>
          <span className="intro-symbol intro-symbol-three">✦</span>
          <span className="intro-trail" />

          <span className="intro-capy-stage">
            <span
              className="intro-capy-sprite"
              style={{ backgroundImage: `url(${baseUrl}bilder/capy/idle-stand.png)` }}
            />
          </span>
          <img
            className="intro-treasure"
            src={`${baseUrl}assets/generated/royal-treasure.png`}
            alt=""
            draggable={false}
          />
        </div>

        <div className="intro-copy">
          <div className="intro-toolbar">
            <div className="intro-kicker">
              <span aria-hidden="true">✦</span>
              Dein Abenteuer beginnt
            </div>
            <button
              ref={readButtonRef}
              type="button"
              className={`intro-read-btn${isReading ? ' active' : ''}`}
              aria-pressed={isReading}
              aria-label={isReading ? 'Vorlesen stoppen' : 'Einleitung vorlesen'}
              title={
                speechSupported
                  ? isReading
                    ? 'Vorlesen stoppen'
                    : 'Einleitung vorlesen'
                  : 'Vorlesen wird von diesem Browser nicht unterstützt'
              }
              disabled={!speechSupported}
              onClick={toggleReading}
            >
              <span className="intro-read-icon" aria-hidden="true">{isReading ? '■' : '🔊'}</span>
              <span className="intro-read-label">{isReading ? 'Stoppen' : 'Vorlesen'}</span>
            </button>
          </div>
          <div className="intro-copy-scroll">
            <h1 id="intro-title">Capy braucht deine Hilfe!</h1>
            <div id="intro-story" className="intro-story">
              <p>
              Capy ist auf der Suche nach einem geheimnisvollen Schatz. Auf seiner Reise entdeckt er fantastische Welten, begegnet spannenden Abenteuern und folgt geheimnisvollen Spuren.
              </p>
              <p>
              Doch der Weg zum Schatz ist voller kniffliger Mathe-Rätsel. Immer wieder versperren Zahlen, Aufgaben und Denkfallen Capy den Weg.
              </p>
              <p>Nur mit deinem Köpfchen kann die Reise weitergehen!
              </p>
            </div>
            <p id="intro-invitation" className="intro-invitation">
              <span className="intro-invitation-icon" aria-hidden="true">🧭</span>
              <strong>Hilfst du Capy dabei, die Rätsel zu lösen und den verborgenen Schatz zu finden?</strong>
            </p>
          </div>
          <button ref={continueRef} type="button" className="intro-cta" onClick={handleContinue}>
            <span>Abenteuer starten!</span>
            <span className="intro-cta-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  )
}
