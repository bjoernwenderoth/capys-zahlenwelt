import { useEffect, useRef } from 'react'
import Panorama from '../components/Panorama.jsx'

export default function Intro({ accent = 'blue', onContinue }) {
  const continueRef = useRef(null)
  const baseUrl = import.meta.env.BASE_URL

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => continueRef.current?.focus({ preventScroll: true }))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  function handleKeyDown(event) {
    // Im Dialog gibt es bewusst nur eine Entscheidung. Dadurch kann der Fokus
    // nicht versehentlich auf die noch nicht bedienbare Welt dahinter wandern.
    if (event.key === 'Tab') {
      event.preventDefault()
      continueRef.current?.focus()
    }
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
          <div className="intro-copy-scroll">
            <div className="intro-kicker">
              <span aria-hidden="true">✦</span>
              Dein Abenteuer beginnt
            </div>
            <h1 id="intro-title">Capy braucht deine Hilfe!</h1>
            <div id="intro-story" className="intro-story">
              <p>
              Capy ist auf der Suche nach einem geheimnisvollen Schatz. Auf ihrer Reise entdeckt sie fantastische Welten, begegnet spannenden Abenteuern und folgt geheimnisvollen Spuren.
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
          <button ref={continueRef} type="button" className="intro-cta" onClick={onContinue}>
            <span>Abenteuer starten!</span>
            <span className="intro-cta-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  )
}
