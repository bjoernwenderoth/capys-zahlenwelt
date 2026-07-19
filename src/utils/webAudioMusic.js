// Hintergrundmusik läuft bewusst über die Web Audio API statt über ein
// <audio>-Element: HTMLMediaElement-Wiedergabe wird von iOS/Safari
// automatisch im System-Player (Kontrollzentrum/Sperrbildschirm) angezeigt,
// auch nach dem Pausieren. Ein AudioBufferSourceNode-Graph bleibt dagegen
// rein innerhalb der Seite und taucht dort nie auf.
//
// API-Ausschnitt ist absichtlich klein gehalten und an HTMLAudioElement
// angelehnt (volume/paused/play()/pause()), damit der aufrufende Code
// (Fade-Logik in App.jsx) unverändert bleiben kann.
export class WebAudioMusicPlayer {
  constructor(url) {
    this.url = url
    this._ctx = null
    this._gain = null
    this._buffer = null
    this._bufferPromise = null
    this._source = null
    this._offset = 0
    this._startedAtCtxTime = 0
    this._playing = false
    this._volume = 1
  }

  _ensureCtx() {
    if (!this._ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      this._ctx = new AC()
      this._gain = this._ctx.createGain()
      this._gain.gain.value = this._volume
      this._gain.connect(this._ctx.destination)
    }
    return this._ctx
  }

  _loadBuffer() {
    if (this._bufferPromise) return this._bufferPromise
    const ctx = this._ensureCtx()
    this._bufferPromise = fetch(this.url)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .then((buffer) => {
        this._buffer = buffer
        return buffer
      })
    return this._bufferPromise
  }

  get volume() {
    return this._volume
  }

  set volume(v) {
    this._volume = v
    if (this._gain) this._gain.gain.value = v
  }

  get paused() {
    return !this._playing
  }

  play() {
    return this._loadBuffer().then((buffer) => {
      const ctx = this._ensureCtx()
      return ctx.resume().then(() => {
        if (ctx.state !== 'running') return Promise.reject(new Error('AudioContext blockiert'))
        if (this._playing) return

        const source = ctx.createBufferSource()
        source.buffer = buffer
        source.loop = true
        source.connect(this._gain)
        const offset = this._offset % buffer.duration
        source.start(0, offset)
        this._source = source
        this._startedAtCtxTime = ctx.currentTime - offset
        this._playing = true
      })
    })
  }

  pause() {
    if (!this._playing) return
    if (this._source) {
      try {
        this._source.stop()
      } catch {
        // bereits gestoppt
      }
      this._source.disconnect()
      this._source = null
    }
    if (this._ctx) this._offset = this._ctx.currentTime - this._startedAtCtxTime
    this._playing = false
  }

  dispose() {
    this.pause()
    if (this._ctx) {
      this._ctx.close().catch(() => {})
      this._ctx = null
      this._gain = null
    }
  }
}
