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

export function speak(text, muted) {
  if (muted) return
  if (!('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'de-DE'
    u.rate = 0.9
    window.speechSynthesis.speak(u)
  } catch {
    // Sprachausgabe nicht verfügbar
  }
}
