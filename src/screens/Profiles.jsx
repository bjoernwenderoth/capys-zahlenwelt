import { useState } from 'react'
import AnimalAvatar from '../components/AnimalAvatar.jsx'
import Capybara from '../components/Capybara.jsx'
import { AVATARS, AVATAR_LABELS } from '../utils/storage.js'

function EditIcon() {
  return (
    <svg
      className="profile-edit-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  )
}

export default function Profiles({ profiles, onSelect, onCreate, onDelete, onEdit }) {
  const [creating, setCreating] = useState(profiles.length === 0)
  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [accent, setAccent] = useState('blue')

  const editingProfile = editingId ? profiles.find((p) => p.id === editingId) : null
  const formOpen = creating || !!editingProfile

  function submit(e) {
    e.preventDefault()
    if (editingProfile) {
      onEdit(editingProfile.id, avatar, accent)
      setEditingId(null)
      return
    }
    const n = name.trim()
    if (!n) return
    onCreate(n, avatar, accent)
    setName('')
    setCreating(false)
  }

  function startEdit(p) {
    setCreating(false)
    setEditingId(p.id)
    setAvatar(p.avatar)
    setAccent(p.accent || 'blue')
  }

  function cancel() {
    setCreating(false)
    setEditingId(null)
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
        <div className={`profile-list${formOpen ? ' profile-list-muted' : ''}`}>
          {profiles.map((p) => (
            <div key={p.id} className={`profile-card profile-accent-${p.accent || 'blue'}`}>
              <button className="profile-main" onClick={() => onSelect(p.id)}>
                <AnimalAvatar avatar={p.avatar} className="profile-avatar" />
                <span className="profile-name">{p.name}</span>
              </button>
              <button
                className="profile-edit"
                title="Profil bearbeiten"
                aria-label={`Profil ${p.name} bearbeiten`}
                onClick={() => startEdit(p)}
              >
                <EditIcon />
              </button>
              <button
                className="profile-delete"
                title="Profil löschen"
                aria-label={`Profil ${p.name} löschen`}
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

      {formOpen ? (
        <form className="profile-form" onSubmit={submit}>
          {editingProfile ? (
            <div className="profile-form-editing-name">
              <AnimalAvatar avatar={avatar} className="profile-avatar" />
              <span className="profile-name">{editingProfile.name}</span>
            </div>
          ) : (
            <>
              <label className="form-label">Wie heißt du?</label>
              <input
                className="name-input"
                value={name}
                maxLength={15}
                autoFocus
                placeholder="Dein Name"
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}
          <label className="form-label">Such dir ein Tier aus:</label>
          <div className="avatar-grid">
            {AVATARS.map((a) => (
              <button
                type="button"
                key={a}
                className={`avatar-btn ${a === avatar ? 'selected' : ''}`}
                aria-label={AVATAR_LABELS[a]}
                aria-pressed={a === avatar}
                onClick={() => setAvatar(a)}
              >
                <AnimalAvatar avatar={a} />
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
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!editingProfile && !name.trim()}
          >
            {editingProfile ? 'Speichern' : "Los geht's! 🚀"}
          </button>
          {(profiles.length > 0 || editingProfile) && (
            <button className="btn btn-ghost" type="button" onClick={cancel}>
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
