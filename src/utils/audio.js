// Soundeffekte über die Web Audio API + Vorlesen über Sprachausgabe

let ctx = null
function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, startDelay, duration, type = 'sine', vol = 0.18) {
  const c = ensureCtx()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t0 = c.currentTime + startDelay
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

export function playCorrect(muted) {
  if (muted) return
  tone(660, 0, 0.15, 'triangle')
  tone(880, 0.12, 0.2, 'triangle')
}

export function playWrong(muted) {
  if (muted) return
  tone(220, 0, 0.25, 'sawtooth', 0.08)
  tone(180, 0.15, 0.3, 'sawtooth', 0.08)
}

export function playWin(muted) {
  if (muted) return
  ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.25, 'triangle'))
}

export function playFail(muted) {
  if (muted) return
  ;[392, 330, 262].forEach((f, i) => tone(f, i * 0.18, 0.3, 'sine', 0.12))
}

let cachedVoice = null
let voicesReady = false
let voicesPromise = null
let speechRequestId = 0

// Sucht die beste verfügbare deutsche Stimme: bevorzugt hochwertige
// Online-/Natural-Stimmen, meidet einfache "Compact"-Systemstimmen.
function pickGermanVoice() {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  const germanVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('de'))
  if (!germanVoices.length) return null

  const rank = (v) => {
    const name = v.name.toLowerCase()
    if (name.includes('compact')) return 0
    if (/google|natural|enhanced|neural|online|premium|siri/.test(name)) return 2
    return 1
  }

  return germanVoices.sort((a, b) => rank(b) - rank(a))[0]
}

function tryResolveVoices() {
  const voice = pickGermanVoice()
  if (voice || window.speechSynthesis.getVoices().length) {
    cachedVoice = voice
    voicesReady = true
    return true
  }
  return false
}

// Die Stimmenliste wird von manchen Browsern erst asynchron nachgeladen.
// Ohne Wartezeit würde die erste Sprachausgabe mit der schlechteren
// System-Standardstimme statt der bevorzugten Stimme starten.
function waitForVoices() {
  if (voicesReady) return Promise.resolve()
  if (voicesPromise) return voicesPromise

  voicesPromise = new Promise((resolve) => {
    if (tryResolveVoices()) {
      resolve()
      return
    }
    const onChange = () => {
      if (tryResolveVoices()) {
        window.speechSynthesis.removeEventListener('voiceschanged', onChange)
        resolve()
      }
    }
    window.speechSynthesis.addEventListener('voiceschanged', onChange)
    setTimeout(() => {
      tryResolveVoices()
      window.speechSynthesis.removeEventListener('voiceschanged', onChange)
      resolve()
    }, 1000)
  })
  return voicesPromise
}

export function cancelSpeech() {
  speechRequestId += 1
  if (!('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
  } catch {
    // Sprachausgabe nicht verfügbar
  }
}

// Die Request-ID verhindert, dass eine während des asynchronen Stimmen-Ladens
// gestoppte Ausgabe bis zu eine Sekunde später doch noch startet. Mehrere
// Abschnitte werden nacheinander mit derselben Stimme gesprochen; das klingt
// bei längeren Geschichten natürlicher als ein einziger großer Textblock.
function startSpeech(parts, muted, {
  onStart,
  onEnd,
  onError,
  rate = 0.9,
  pitch = 1,
  pauseMs = 0
} = {}) {
  if (muted) return false
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return false

  const chunks = (Array.isArray(parts) ? parts : [parts])
    .map((part) => String(part || '').trim())
    .filter(Boolean)
  if (!chunks.length) return false

  const requestId = ++speechRequestId

  try {
    window.speechSynthesis.cancel()
    waitForVoices()
      .then(() => {
        if (requestId !== speechRequestId) return

        let chunkIndex = 0

        function fail(event) {
          if (requestId !== speechRequestId) return
          speechRequestId += 1
          onError?.(event)
        }

        function speakNext() {
          if (requestId !== speechRequestId) return

          try {
            const u = new SpeechSynthesisUtterance(chunks[chunkIndex])
            u.lang = 'de-DE'
            u.rate = rate
            u.pitch = pitch
            if (cachedVoice) u.voice = cachedVoice

            u.onstart = () => {
              if (requestId === speechRequestId && chunkIndex === 0) onStart?.()
            }
            u.onend = () => {
              if (requestId !== speechRequestId) return

              if (chunkIndex >= chunks.length - 1) {
                speechRequestId += 1
                onEnd?.()
                return
              }

              chunkIndex += 1
              if (pauseMs > 0) window.setTimeout(speakNext, pauseMs)
              else speakNext()
            }
            u.onerror = (event) => {
              fail(event)
            }

            window.speechSynthesis.speak(u)
          } catch (error) {
            fail(error)
          }
        }

        speakNext()
      })
      .catch((error) => {
        if (requestId !== speechRequestId) return
        speechRequestId += 1
        onError?.(error)
      })
    return true
  } catch (error) {
    if (requestId === speechRequestId) speechRequestId += 1
    onError?.(error)
    return false
  }
}

// options ist optional, damit bestehende Aufrufe (z. B. im Quiz) unverändert
// dieselbe Stimme und dasselbe Tempo verwenden.
export function speak(text, muted, options = {}) {
  return startSpeech([text], muted, options)
}

export function speakSequence(parts, muted, options = {}) {
  return startSpeech(parts, muted, options)
}
