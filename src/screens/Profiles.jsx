import { useState } from 'react'
import Capybara from '../components/Capybara.jsx'
import { AVATARS } from '../utils/storage.js'

export default function Profiles({ profiles, onSelect, onCreate, onDelete }) {
  const [creating, setCreating] = useState(profiles.length === 0)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [accent, setAccent] = useState('blue')

  function submit(e) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return
    onCreate(n, avatar, accent)
    setName('')
    setCreating(false)
  }

  return (
    <div className="screen profiles-screen" data-accent={accent}>
      <div className="profiles-hero">
        <Capybara mood="happy" size={130} />
        <div className="bubble">
          Hallo! Ich bin <strong>Capy</strong>! Wer hilft mir heute bei der Schatzsuche?
        </div>
      </div>

      <h1 className="app-title">Capys Zahlenschatz</h1>

      {profiles.length > 0 && (
        <div className={`profile-list${creating ? ' profile-list-muted' : ''}`}>
          {profiles.map((p) => (
            <div key={p.id} className={`profile-card profile-accent-${p.accent || 'blue'}`}>
              <button className="profile-main" onClick={() => onSelect(p.id)}>
                <span className="profile-avatar">{p.avatar}</span>
                <span className="profile-name">{p.name}</span>
              </button>
              <button
                className="profile-delete"
                title="Profil löschen"
                onClick={() => {
                  if (window.confirm(`Profil "${p.name}" wirklich löschen?`)) onDelete(p.id)
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {creating ? (
        <form className="profile-form" onSubmit={submit}>
          <label className="form-label">Wie heißt du?</label>
          <input
            className="name-input"
            value={name}
            maxLength={15}
            autoFocus
            placeholder="Dein Name"
            onChange={(e) => setName(e.target.value)}
          />
          <label className="form-label">Such dir ein Tier aus:</label>
          <div className="avatar-grid">
            {AVATARS.map((a) => (
              <button
                type="button"
                key={a}
                className={`avatar-btn ${a === avatar ? 'selected' : ''}`}
                onClick={() => setAvatar(a)}
              >
                {a}
              </button>
            ))}
          </div>
          <fieldset className="accent-fieldset">
            <legend className="form-label">Wähle deine Farbe:</legend>
            <div className="accent-options">
              <button
                type="button"
                className={`accent-option accent-blue ${accent === 'blue' ? 'selected' : ''}`}
                aria-pressed={accent === 'blue'}
                onClick={() => setAccent('blue')}
              >
                <span className="accent-swatch" aria-hidden="true" />
                Blau
              </button>
              <button
                type="button"
                className={`accent-option accent-purple ${accent === 'purple' ? 'selected' : ''}`}
                aria-pressed={accent === 'purple'}
                onClick={() => setAccent('purple')}
              >
                <span className="accent-swatch" aria-hidden="true" />
                Lila
              </button>
            </div>
          </fieldset>
          <button className="btn btn-primary" type="submit" disabled={!name.trim()}>
            Los geht&apos;s! 🚀
          </button>
          {profiles.length > 0 && (
            <button className="btn btn-ghost" type="button" onClick={() => setCreating(false)}>
              Abbrechen
            </button>
          )}
        </form>
      ) : (
        <button className="btn btn-secondary" onClick={() => setCreating(true)}>
          ➕ Neues Profil
        </button>
      )}
    </div>
  )
}
