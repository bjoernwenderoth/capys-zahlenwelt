import { useEffect, useId, useRef } from 'react'
import packageJson from '../../package.json'

export default function InfoModal({ open, accent = 'blue', onClose, returnFocusRef }) {
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      returnFocusRef?.current?.focus()
    }
  }, [open, returnFocusRef])

  if (!open) return null

  return (
    <div className="modal-backdrop info-modal-backdrop" onClick={onClose}>
      <div
        className="modal info-modal"
        data-accent={accent === 'purple' ? 'purple' : 'blue'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          className="info-modal-close"
          type="button"
          aria-label="Infobox schließen"
          onClick={onClose}
        >
          ×
        </button>

        <div className="info-modal-layout">
          <aside className="info-modal-brand">
            <a
              className="info-modal-logo-link"
              href="https://www.bjoern-wenderoth.de"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website von Creative & Code öffnen"
            >
              <img
                className="info-modal-logo"
                src={`${import.meta.env.BASE_URL}assets/creativeandcode-logo.png`}
                alt="Creative & Code"
              />
            </a>
            <p className="info-modal-owner">Inh. Björn Wenderoth</p>
            <a
              className="info-modal-website"
              href="https://www.bjoern-wenderoth.de"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.bjoern-wenderoth.de
            </a>
            <p className="info-modal-version">Version {packageJson.version}</p>
          </aside>

          <div className="info-modal-content">
            <header className="info-modal-header">
              <p className="info-modal-kicker">Über das Spiel</p>
              <h2 className="modal-title" id={titleId}>Capys Zahlenschatz</h2>
              <p className="info-modal-lead">
              Eine kleine Lernreise für Kinder, bei der sich das Üben des kleinen Einmaleins eher wie ein Abenteuer und 
              weniger wie das nächste Arbeitsblatt anfühlen soll.
              </p>
            </header>

            <div className="info-modal-sections">
              <section className="info-modal-section">
                <h3>Ein Herzensprojekt</h3>
                <p>
                  Entstanden ist das Spiel mit und für meine Tochter. Nun sollen auch alle
                  Kinder mit Capy spielerisch üben können – nach der Schule, in den Ferien oder
                  einfach zwischendurch.
                </p>
              </section>

              <section className="info-modal-section">
                <h3>Alles bleibt bei dir</h3>
                <p>
                  Profile, Fortschritte und Einstellungen werden nur auf eurem Gerät
                  gespeichert. Es gibt kein Konto und keine eurer Daten werden auf einem Server gespeichert.
                </p>
              </section>

              <section className="info-modal-section">
                <h3>Kostenlos spielen</h3>
                <p>
                  Das Spiel ist kostenlos. Wenn es euch gefällt und ihr die
                  Weiterentwicklung unterstützen möchtet, freuen wir uns über einen
                  freiwilligen Beitrag.
                </p>
              </section>

              <section className="info-modal-section">
                <h3>Idee, Bug oder eigenes Projekt?</h3>
                <p>
                  Du hast Feedback, einen Fehler entdeckt oder brauchst selbst eine
                  Website oder Softwarelösung? Schreib mir gern – ich freue mich auf
                  deine Nachricht.
                </p>
              </section>
            </div>

            <div className="info-modal-actions">
              <a
                className="info-modal-action info-modal-action-primary"
                href="https://paypal.me/bjoernwenderoth"
                target="_blank"
                rel="noopener noreferrer"
              >
                Via PayPal unterstützen
              </a>
              <a
                className="info-modal-action info-modal-action-secondary"
                href="mailto:bjoernwe1989@googlemail.com"
              >
                Kontakt aufnehmen
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
