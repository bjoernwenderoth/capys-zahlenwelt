import { useEffect, useRef, useState } from 'react'
import Start from './screens/Start.jsx'
import Loading from './screens/Loading.jsx'
import Intro from './screens/Intro.jsx'
import Profiles from './screens/Profiles.jsx'
import Path from './screens/Path.jsx'
import Quiz from './screens/Quiz.jsx'
import { loadData, saveData, newProfile } from './utils/storage.js'

// Lautstärke der Hintergrundmusik: normal, und leiser ("geduckt"), während
// gleichzeitig etwas vorgelesen wird, damit man die Sprachausgabe versteht.
const BASE_MUSIC_VOLUME = 0.14
const DUCKED_MUSIC_VOLUME = 0.035
const MUSIC_FADE_MS = 600

// Überblendet die Lautstärke sanft statt abrupt zu springen (z. B. beim
// Start/Ende eines Levels). Ein Token auf dem Audio-Element sorgt dafür,
// dass eine neu gestartete Überblendung eine noch laufende ältere abbricht,
// ohne deren (dann veraltetes) onDone auszulösen.
function fadeMusicVolume(music, target, onDone) {
  const token = {}
  music._fadeToken = token
  const start = music.volume
  if (start === target) {
    onDone?.()
    return
  }
  const startTime = performance.now()
  function step(now) {
    if (music._fadeToken !== token) return
    const t = Math.max(0, Math.min(1, (now - startTime) / MUSIC_FADE_MS))
    music.volume = start + (target - start) * t
    if (t < 1) requestAnimationFrame(step)
    else onDone?.()
  }
  requestAnimationFrame(step)
}

export default function App() {
  const [data, setData] = useState(loadData)
  const [screen, setScreen] = useState('splash') // splash | loading | intro | profiles | path | quiz
  const [activeLevel, setActiveLevel] = useState(null)
  const [introReading, setIntroReading] = useState(false)
  const [pageHidden, setPageHidden] = useState(() => typeof document !== 'undefined' && document.hidden)
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
    music.volume = BASE_MUSIC_VOLUME
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

  // Wird der Tab/die App in den Hintergrund geschickt (z. B. iOS: nach oben
  // wischen), soll die Musik sofort stoppen statt als Hintergrund-Player
  // weiterzulaufen. requestAnimationFrame (das der Fade-Mechanismus nutzt)
  // pausiert selbst im Hintergrund, ein Fade-out würde die Musik also einfach
  // ungebremst weiterlaufen lassen – deshalb hier direkt pausieren.
  useEffect(() => {
    function onVisibilityChange() {
      if (document.hidden) backgroundMusicRef.current?.pause()
      setPageHidden(document.hidden)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  useEffect(() => {
    const music = backgroundMusicRef.current
    if (!music) return

    const shouldPlay =
      !data.muted &&
      !pageHidden &&
      (screen === 'splash' || screen === 'intro' || screen === 'path')

    // Beim Levelstart (Quiz) und beim Stummschalten soll die Musik kurz
    // ausklingen statt abrupt zu stoppen.
    if (!shouldPlay) {
      fadeMusicVolume(music, 0, () => {
        if (backgroundMusicRef.current === music) music.pause()
      })
      return
    }

    const targetVolume = introReading ? DUCKED_MUSIC_VOLUME : BASE_MUSIC_VOLUME

    // Läuft die Musik schon (oder klingt gerade erst aus, ist also noch nicht
    // pausiert), muss nichts neu gestartet werden – nur sanft auf die
    // richtige Lautstärke einregeln (normal, oder geduckt während Vorlesen).
    // Das übernimmt auch einen noch laufenden Fade-out, falls der Screen
    // wechselt, bevor die Musik tatsächlich pausiert wurde.
    if (!music.paused) {
      fadeMusicVolume(music, targetVolume)
      return
    }

    music.volume = 0

    // Browser dürfen Audio vor der ersten Interaktion blockieren. In diesem
    // Fall genügt der erste Klick oder Tastendruck, um dieselbe Instanz zu
    // starten; danach funktionieren Pause und Fortsetzen ohne Neustart.
    let waitingForInteraction = false
    let cancelled = false
    function playMusic() {
      if (cancelled || backgroundMusicRef.current !== music) return
      const result = music.play()
      if (result) result.then(fadeIn).catch(() => {})
    }
    function fadeIn() {
      if (cancelled || backgroundMusicRef.current !== music) return
      fadeMusicVolume(music, targetVolume)
    }
    function onFirstInteraction() {
      if (cancelled || !waitingForInteraction) return
      playMusic()
    }

    const result = music.play()
    if (result) {
      result.then(fadeIn).catch(() => {
        if (cancelled || backgroundMusicRef.current !== music) return
        waitingForInteraction = true
        window.addEventListener('pointerdown', onFirstInteraction, { once: true })
        window.addEventListener('keydown', onFirstInteraction, { once: true })
      })
    } else {
      fadeIn()
    }

    return () => {
      cancelled = true
      waitingForInteraction = false
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
  }, [screen, data.muted, introReading, pageHidden])

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

  if (screen === 'loading') {
    return <Loading onDone={() => setScreen('intro')} />
  }

  if (screen === 'intro') {
    return (
      <Intro
        accent={profile?.accent || 'blue'}
        onReadingChange={setIntroReading}
        onContinue={() => {
          setIntroReading(false)
          setScreen(profile ? 'path' : 'profiles')
        }}
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
      onStart={() => setScreen('loading')}
      onToggleMute={toggleMute}
      onSwitchProfile={() => setScreen('profiles')}
    />
  )
}
