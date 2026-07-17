import { useEffect, useState } from 'react'
import Start from './screens/Start.jsx'
import Profiles from './screens/Profiles.jsx'
import Path from './screens/Path.jsx'
import Quiz from './screens/Quiz.jsx'
import { loadData, saveData, newProfile } from './utils/storage.js'

export default function App() {
  const [data, setData] = useState(loadData)
  const [screen, setScreen] = useState('splash') // splash | profiles | path | quiz
  const [activeLevel, setActiveLevel] = useState(null)

  // Spielstand bei jeder Änderung auf dem Gerät speichern
  useEffect(() => {
    saveData(data)
  }, [data])

  const profile = data.profiles.find((p) => p.id === data.activeProfileId) || null

  function createProfile(name, avatar) {
    const p = newProfile(name, avatar)
    setData((d) => ({ ...d, profiles: [...d.profiles, p], activeProfileId: p.id }))
    setScreen('path')
  }

  function selectProfile(id) {
    setData((d) => ({ ...d, activeProfileId: id }))
    setScreen('path')
  }

  function deleteProfile(id) {
    setData((d) => ({
      ...d,
      profiles: d.profiles.filter((p) => p.id !== id),
      activeProfileId: d.activeProfileId === id ? null : d.activeProfileId
    }))
  }

  function completeLevel(levelId, stars) {
    setData((d) => ({
      ...d,
      profiles: d.profiles.map((p) => {
        if (p.id !== d.activeProfileId) return p
        const best = Math.max(p.progress[levelId] || 0, stars)
        return {
          ...p,
          progress: { ...p.progress, [levelId]: best }
        }
      })
    }))
    setScreen('path')
    setActiveLevel(null)
  }

  function toggleMute() {
    setData((d) => ({ ...d, muted: !d.muted }))
  }

  if (screen === 'quiz' && profile && activeLevel) {
    return (
      <Quiz
        key={activeLevel.id}
        level={activeLevel}
        muted={data.muted}
        onFinish={(stars) => completeLevel(activeLevel.id, stars)}
        onExit={() => {
          setScreen('path')
          setActiveLevel(null)
        }}
      />
    )
  }

  if (screen === 'path' && profile) {
    return (
      <Path
        profile={profile}
        muted={data.muted}
        onStartLevel={(lv) => {
          setActiveLevel(lv)
          setScreen('quiz')
        }}
        onToggleMute={toggleMute}
        onSwitchProfile={() => setScreen('profiles')}
      />
    )
  }

  if (screen === 'profiles') {
    return (
      <Profiles
        profiles={data.profiles}
        onSelect={selectProfile}
        onCreate={createProfile}
        onDelete={deleteProfile}
      />
    )
  }

  // Startbildschirm (Splash)
  return (
    <Start
      profile={profile}
      muted={data.muted}
      onStart={() => setScreen(profile ? 'path' : 'profiles')}
      onToggleMute={toggleMute}
      onSwitchProfile={() => setScreen('profiles')}
    />
  )
}
