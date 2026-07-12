import { useState } from 'react'
import Capybara from '../components/Capybara.jsx'
import { AVATARS } from '../utils/storage.js'

export default function Profiles({ profiles, onSelect, onCreate, onDelete }) {
  const [creating, setCreating] = useState(profiles.length === 0)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])

  function submit(e) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return
    onCreate(n, avatar)
    setName('')
    setCreating(false)
  }

  return (
    <div className="screen profiles-screen">
      <div className="profiles-hero">
        <Capybara mood="happy" size={130} />
        <div className="bubble">
          Hallo! Ich bin <strong>Capy</strong>! Wer möchte heute mit mir das 1×1 üben?
        </div>
      </div>

      <h1 className="app-title">Capys Zahlenwelt</h1>

      {profiles.length > 0 && (
        <div className="profile-list">
          {profiles.map((p) => (
            <div key={p.id} className="profile-card">
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
