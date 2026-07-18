import { useEffect, useRef, useState } from 'react'
import Start from './screens/Start.jsx'
import Profiles from './screens/Profiles.jsx'
import Path from './screens/Path.jsx'
import Quiz from './screens/Quiz.jsx'
import { loadData, saveData, newProfile } from './utils/storage.js'

export default function App() {
  const [data, setData] = useState(loadData)
  const [screen, setScreen] = useState('splash') // splash | profiles | path | quiz
  const [activeLevel, setActiveLevel] = useState(null)
  const backgroundMusicRef = useRef(null)
  // Level, das zuletzt gespielt (und bestanden) wurde – bestimmt, wie weit
  // Capy auf der Karte läuft (immer nur einen Schritt weiter, auch wenn ein
  // altes Level wiederholt wurde).
  const [lastPlayedLevelId, setLastPlayedLevelId] = useState(null)

  // Spielstand bei jeder Änderung auf dem Gerät speichern
  useEffect(() => {
    saveData(data)
  }, [data])

  // Eine einzige Audio-Instanz bleibt über alle Ansichten hinweg erhalten.
  // pause() bewahrt currentTime, sodass die Musik nach dem Quiz weiterläuft,
  // statt bei jedem Kartenbesuch wieder von vorne zu beginnen.
  useEffect(() => {
    const music = new Audio(`${import.meta.env.BASE_URL}audio/background-music.mp3`)
    music.loop = true
    music.preload = 'auto'
    music.volume = 0.28
    backgroundMusicRef.current = music

    return () => {
      music.pause()
      // Die Quelle lösen, damit auch ein bereits angestoßener asynchroner
      // play()-Versuch diese alte Instanz nicht später wiederbeleben kann.
      music.removeAttribute('src')
      music.load()
      if (backgroundMusicRef.current === music) backgroundMusicRef.current = null
    }
  }, [])

  useEffect(() => {
    const music = backgroundMusicRef.current
    if (!music) return

    const shouldPlay = !data.muted && (screen === 'splash' || screen === 'path')
    if (!shouldPlay) {
      music.pause()
      return
    }

    // Browser dürfen Audio vor der ersten Interaktion blockieren. In diesem
    // Fall genügt der erste Klick oder Tastendruck, um dieselbe Instanz zu
    // starten; danach funktionieren Pause und Fortsetzen ohne Neustart.
    let waitingForInteraction = false
    let cancelled = false
    function playMusic() {
      if (cancelled || backgroundMusicRef.current !== music) return
      const result = music.play()
      if (result) result.catch(() => {})
    }
    function onFirstInteraction() {
      if (cancelled || !waitingForInteraction) return
      playMusic()
    }

    const result = music.play()
    if (result) {
      result.catch(() => {
        if (cancelled || backgroundMusicRef.current !== music) return
        waitingForInteraction = true
        window.addEventListener('pointerdown', onFirstInteraction, { once: true })
        window.addEventListener('keydown', onFirstInteraction, { once: true })
      })
    }

    return () => {
      cancelled = true
      waitingForInteraction = false
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
  }, [screen, data.muted])

  const profile = data.profiles.find((p) => p.id === data.activeProfileId) || null

  function createProfile(name, avatar, accent) {
    const p = newProfile(name, avatar, accent)
    setData((d) => ({ ...d, profiles: [...d.profiles, p], activeProfileId: p.id }))
    setLastPlayedLevelId(null)
    setScreen('path')
  }

  function selectProfile(id) {
    setData((d) => ({ ...d, activeProfileId: id }))
    setLastPlayedLevelId(null)
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
    setLastPlayedLevelId(levelId)
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
        accent={profile.accent || 'blue'}
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
        lastPlayedLevelId={lastPlayedLevelId}
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
