const KEY = 'einmaleins-abenteuer-v1'

export const AVATARS = ['🦊', '🐸', '🦁', '🐼', '🦄', '🐙', '🐯', '🐧', '🦖', '🐰']

function defaults() {
  return { profiles: [], activeProfileId: null, muted: false }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaults()
    const d = JSON.parse(raw)
    if (!d || !Array.isArray(d.profiles)) return defaults()
    return { ...defaults(), ...d }
  } catch {
    return defaults()
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // Speicher voll oder blockiert – Spiel läuft trotzdem weiter
  }
}

export function newProfile(name, avatar) {
  return {
    id: 'p' + Date.now() + Math.floor(Math.random() * 1000),
    name,
    avatar,
    progress: {} // levelId -> beste Sterne (1-3)
  }
}
