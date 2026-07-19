const KEY = 'einmaleins-abenteuer-v1'

export const RACCOON_AVATAR = '🦝'
export const T_REX_AVATAR = '🦖'
export const AVATARS = ['🐰', '🦊', RACCOON_AVATAR, '🦁', '🐼', '🦄', '🐶', '🐱', '🐴', T_REX_AVATAR]
export const AVATAR_LABELS = {
  '🐰': 'Hase',
  '🦊': 'Fuchs',
  [RACCOON_AVATAR]: 'Waschbär',
  '🦁': 'Löwe',
  '🐼': 'Panda',
  '🦄': 'Einhorn',
  '🐶': 'Hund',
  '🐱': 'Katze',
  '🐴': 'Pferd',
  [T_REX_AVATAR]: 'T-Rex'
}
export const PROFILE_ACCENTS = ['blue', 'purple']

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

export function newProfile(name, avatar, accent = 'blue') {
  return {
    id: 'p' + Date.now() + Math.floor(Math.random() * 1000),
    name,
    avatar,
    accent: PROFILE_ACCENTS.includes(accent) ? accent : 'blue',
    progress: {} // levelId -> beste Sterne (1-3)
  }
}
