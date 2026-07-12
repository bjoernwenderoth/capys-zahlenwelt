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
    progress: {}, // levelId -> beste Sterne (1-3)
    streak: { count: 0, lastDay: null }
  }
}

export function todayStr() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

// Streak beim Levelabschluss aktualisieren
export function updatedStreak(streak) {
  const today = todayStr()
  if (streak.lastDay === today) return streak
  if (streak.lastDay === yesterdayStr()) {
    return { count: streak.count + 1, lastDay: today }
  }
  return { count: 1, lastDay: today }
}

// Streak nur anzeigen, wenn sie nicht abgerissen ist
export function currentStreak(streak) {
  if (!streak || !streak.lastDay) return 0
  if (streak.lastDay === todayStr() || streak.lastDay === yesterdayStr()) {
    return streak.count
  }
  return 0
}
