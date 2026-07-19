import { useEffect, useRef, useState } from 'react'
import Capybara from '../components/Capybara.jsx'
import { WORLDS } from '../data/worlds.js'
import {
  generateQuestions,
  questionText,
  correctAnswerText,
  tipFor,
  shuffle
} from '../data/questions.js'
import { playCorrect, playWrong, playWin, playFail, speak } from '../utils/audio.js'

const PRAISE = ['Super! 🎉', 'Klasse gemacht!', 'Richtig! Du bist spitze!', 'Genau! Weiter so!', 'Toll! 💪']
const COMFORT = ['Macht nichts, die kommt gleich nochmal!', 'Kopf hoch, das übst du gleich nochmal!', 'Fast! Merk dir die Lösung gut!']

const PASS_MIN = 8

function WorldBackdrop({ world }) {
  return (
    <div className={`quiz-world-backdrop world-${world.id}`} aria-hidden="true">
      <span className="quiz-world-scene" />
    </div>
  )
}

// ---------- Aufgabentypen ----------

function MCQuestion({ q, disabled, onAnswer }) {
  const [chosen, setChosen] = useState(null)
  return (
    <div className="answers-grid">
      {q.options.map((o) => (
        <button
          key={o}
          className={`btn answer-btn ${chosen === o ? (o === q.answer ? 'right' : 'wrong') : ''} ${
            disabled && o === q.answer ? 'right' : ''
          }`}
          disabled={disabled}
          onClick={() => {
            setChosen(o)
            onAnswer(o === q.answer)
          }}
        >
          <span className="answer-marker" aria-hidden="true">
            {chosen === o && disabled ? (o === q.answer ? '✓' : '×') : ''}
          </span>
          <span>{o}</span>
        </button>
      ))}
    </div>
  )
}

function TFQuestion({ q, disabled, onAnswer }) {
  const [chosen, setChosen] = useState(null)
  const options = [
    { value: true, label: 'Richtig', icon: '✓' },
    { value: false, label: 'Falsch', icon: '×' }
  ]

  return (
    <div className="answers-grid tf">
      {options.map((option) => {
        const isCorrect = option.value === q.isTrue
        const stateClass = disabled && (chosen === option.value || isCorrect) ? (isCorrect ? 'right' : 'wrong') : ''
        return (
          <button
            key={option.label}
            className={`btn answer-btn tf-${option.value ? 'true' : 'false'} ${stateClass}`}
            disabled={disabled}
            onClick={() => {
              setChosen(option.value)
              onAnswer(isCorrect)
            }}
          >
            <span className="answer-marker" aria-hidden="true">{option.icon}</span>
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function InputQuestion({ q, val, setVal, disabled, onAnswer }) {
  const expected = q.answer
  const maxLen = 3

  function press(d) {
    if (disabled) return
    setVal((v) => (v.length < maxLen ? v + d : v))
  }

  function submit(current) {
    if (disabled || !current) return
    onAnswer(parseInt(current, 10) === expected)
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (disabled) return
      if (e.key >= '0' && e.key <= '9') {
        press(e.key)
      } else if (e.key === 'Backspace') {
        setVal((v) => v.slice(0, -1))
      } else if (e.key === 'Enter') {
        submit(val)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [disabled, val])

  return (
    <div className="input-area">
      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => (
          <button key={d} className="btn key" disabled={disabled} onClick={() => press(String(d))}>
            {d}
          </button>
        ))}
        <button className="btn key key-del" disabled={disabled || !val} onClick={() => setVal(val.slice(0, -1))}>
          ⌫
        </button>
        <button className="btn key key-ok" disabled={disabled || !val} onClick={() => submit(val)}>
          ✓
        </button>
      </div>
    </div>
  )
}

function PairsQuestion({ q, disabled, onAnswer }) {
  const [left] = useState(() => shuffle(q.items))
  const [right] = useState(() => shuffle(q.items))
  const [selLeft, setSelLeft] = useState(null)
  const [matched, setMatched] = useState([]) // Ergebniswerte
  const mistakeRef = useRef(false)
  const [shakeKey, setShakeKey] = useState(0)

  function chooseRight(item) {
    if (selLeft === null) return
    if (selLeft.c === item.c) {
      const m = [...matched, item.c]
      setMatched(m)
      setSelLeft(null)
      if (m.length === q.items.length) onAnswer(!mistakeRef.current)
    } else {
      mistakeRef.current = true
      setShakeKey((k) => k + 1)
      setSelLeft(null)
    }
  }

  return (
    <div className={`pairs ${shakeKey ? 'shake-' + (shakeKey % 2) : ''}`}>
      <div className="pairs-col">
        {left.map((it) => (
          <button
            key={`t${it.c}`}
            className={`btn pair-btn ${selLeft && selLeft.c === it.c ? 'selected' : ''} ${
              matched.includes(it.c) ? 'matched' : ''
            }`}
            disabled={disabled || matched.includes(it.c)}
            onClick={() => setSelLeft(it)}
          >
            {it.a} × {it.b}
          </button>
        ))}
      </div>
      <div className="pairs-col">
        {right.map((it) => (
          <button
            key={`r${it.c}`}
            className={`btn pair-btn ${matched.includes(it.c) ? 'matched' : ''}`}
            disabled={disabled || matched.includes(it.c) || selLeft === null}
            onClick={() => chooseRight(it)}
          >
            {it.c}
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------- Fragetext ----------

function QuestionPrompt({ q, inputValue = '' }) {
  if (q.type === 'mc' || q.type === 'input') {
    return (
      <div className="equation">
        {q.a} × {q.b} = <span className={`gap ${q.type === 'input' && inputValue ? 'is-filled' : ''}`} aria-live="polite">
          {q.type === 'input' ? inputValue || '?' : '?'}
        </span>
      </div>
    )
  }
  if (q.type === 'reverse') {
    return (
      <div className="equation">
        {q.a} × <span className={`gap ${inputValue ? 'is-filled' : ''}`} aria-live="polite">
          {inputValue || '?'}
        </span> = {q.product}
      </div>
    )
  }
  if (q.type === 'tf') {
    return (
      <div className="equation">
        {q.a} × {q.b} = {q.shown}
        <div className="tf-hint">Stimmt das?</div>
      </div>
    )
  }
  return <div className="equation pairs-title">Finde die Paare!</div>
}

// ---------- Quiz ----------

export default function Quiz({ level, accent = 'blue', muted, onFinish, onExit }) {
  const [round, setRound] = useState(0) // erhöht sich bei "Nochmal"
  const [questions, setQuestions] = useState(() => generateQuestions(level))
  const [queue, setQueue] = useState(() => questions.map((_, i) => i))
  const [pos, setPos] = useState(0)
  const [solved, setSolved] = useState(0)
  const [feedback, setFeedback] = useState(null) // {ok, text}
  const [showTip, setShowTip] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [done, setDone] = useState(null) // {pass, stars, correctFirst}
  const wrongSet = useRef(new Set())
  const weiterBtnRef = useRef(null)

  // Fokus erst einen Frame später setzen, damit ein per Tastatur (Enter)
  // abgeschicktes Ergebnis nicht sofort denselben Tastendruck für "Weiter" nutzt.
  useEffect(() => {
    if (!feedback) return
    const id = requestAnimationFrame(() => weiterBtnRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [feedback])

  const qIdx = queue[pos]
  const q = questions[qIdx]
  const total = questions.length
  const worldIndex = Math.max(0, WORLDS.findIndex((candidate) => candidate.levels.some((item) => item.id === level.id)))
  const world = WORLDS[worldIndex]
  const levelIndex = Math.max(0, world.levels.findIndex((item) => item.id === level.id))

  function handleAnswer(ok) {
    if (feedback) return
    if (ok) {
      playCorrect(muted)
      setSolved((s) => s + 1)
      setFeedback({ ok: true, text: PRAISE[Math.floor(Math.random() * PRAISE.length)] })
    } else {
      playWrong(muted)
      wrongSet.current.add(qIdx)
      const comfort = COMFORT[Math.floor(Math.random() * COMFORT.length)]
      const correct = correctAnswerText(q)
      setFeedback({ ok: false, text: correct ? `${correct}. ${comfort}` : comfort })
    }
  }

  function finish() {
    const correctFirst = total - wrongSet.current.size
    const pass = correctFirst >= PASS_MIN
    const stars = correctFirst >= total ? 3 : correctFirst >= total - 1 ? 2 : correctFirst >= PASS_MIN ? 1 : 0
    if (pass) playWin(muted)
    else playFail(muted)
    setDone({ pass, stars, correctFirst })
  }

  function next() {
    const wasOk = feedback.ok
    setFeedback(null)
    setShowTip(false)
    setInputValue('')
    let newQueue = queue
    if (!wasOk) {
      newQueue = [...queue, qIdx] // falsche Aufgabe kommt ans Ende nochmal
      setQueue(newQueue)
    }
    if (wasOk && solved >= total) {
      finish()
      return
    }
    if (pos + 1 < newQueue.length) {
      setPos(pos + 1)
    } else {
      finish()
    }
  }

  function retry() {
    const qs = generateQuestions(level)
    wrongSet.current = new Set()
    setQuestions(qs)
    setQueue(qs.map((_, i) => i))
    setPos(0)
    setSolved(0)
    setFeedback(null)
    setShowTip(false)
    setInputValue('')
    setDone(null)
    setRound((r) => r + 1)
  }

  const mood = feedback ? (feedback.ok ? 'proud' : 'wrong') : showTip ? 'think' : 'start'

  // ---------- Ergebnis ----------
  if (done) {
    return (
      <div className="screen quiz-screen result-screen" data-accent={accent}>
        <WorldBackdrop world={world} />
        <Capybara mood={done.pass ? 'cheer' : 'sad'} size={150} />
        <div className="bubble">
          {done.pass
            ? done.stars === 3
              ? 'PERFEKT! Alle Aufgaben beim ersten Versuch! Du bist ein Star! 🌟'
              : 'Geschafft! Level gemeistert! 🎉'
            : `Diesmal hat es noch nicht gereicht – du brauchst ${PASS_MIN} von ${total} richtig. Aber Übung macht den Meister!`}
        </div>
        <div className="result-stars">
          {[1, 2, 3].map((i) => (
            <span key={i} className={`big-star ${i <= done.stars ? 'on' : ''}`}>★</span>
          ))}
        </div>
        <div className="result-score">
          {done.correctFirst} von {total} beim ersten Versuch richtig
        </div>
        {done.pass ? (
          <>
            <button className="btn btn-primary" onClick={() => onFinish(done.stars)}>
              Weiter auf dem Pfad ➜
            </button>
            {done.stars < 3 && (
              <button className="btn btn-ghost" onClick={retry}>
                Nochmal für 3 Sterne ⭐
              </button>
            )}
          </>
        ) : (
          <>
            <button className="btn btn-primary" onClick={retry}>
              Nochmal versuchen 💪
            </button>
            <button className="btn btn-ghost" onClick={onExit}>
              Zurück zum Pfad
            </button>
          </>
        )}
      </div>
    )
  }

  // ---------- Frage ----------
  return (
    <div className="screen quiz-screen" data-accent={accent} data-question-type={q.type}>
      <WorldBackdrop world={world} />
      <header className="quiz-header">
        <button className="quiz-back-btn" onClick={onExit} title="Zurück zum Pfad" aria-label="Zurück zum Pfad">
          <span aria-hidden="true">←</span> Pfad
        </button>
        <div className="quiz-status-card" aria-label={`Welt ${worldIndex + 1}, ${world.name}; Level ${levelIndex + 1}, ${level.title}; ${solved} von ${total} Fragen geschafft`}>
          <span className="quiz-status-top">
            <span className="quiz-location-icon" aria-hidden="true">{world.emoji}</span>
            <span className="quiz-location-copy">
              <span className="quiz-world-name">Welt {worldIndex + 1} · {world.name}</span>
              <span className="quiz-level-name">Level {levelIndex + 1} · {level.title} – {level.subtitle}</span>
            </span>
            <span className="progress-text"><strong>{solved}</strong> / {total}</span>
          </span>
          <span
            className="progress-bar"
            role="progressbar"
            aria-label="Fragenfortschritt"
            aria-valuemin="0"
            aria-valuemax={total}
            aria-valuenow={solved}
          >
            <span className="progress-fill" style={{ width: `${(solved / total) * 100}%` }} />
          </span>
        </div>
      </header>

      <main className="quiz-content">
        <section className="question-card" aria-label="Aufgabe">
          <div className="question-card-heading">
            <div className="quiz-capy">
              <Capybara mood={mood} size={72} />
            </div>
            <div className="question-meta">
              <span className="question-kicker">Aufgabe {Math.min(solved + 1, total)} von {total}</span>
              <span className="question-instruction">
                {q.type === 'pairs' ? 'Ordne richtig zu' : q.type === 'tf' ? 'Prüfe die Aussage' : 'Finde die Lösung'}
              </span>
            </div>
            <div className="question-actions">
              <button className="icon-btn speak-btn" title="Aufgabe vorlesen" aria-label="Aufgabe vorlesen" onClick={() => speak(questionText(q))}>
                🔊
              </button>
              {!feedback && (
                <button
                  className={`btn btn-tip ${showTip ? 'active' : ''}`}
                  onClick={() => setShowTip((t) => !t)}
                  aria-expanded={showTip}
                  title={showTip ? 'Tipp ausblenden' : 'Tipp anzeigen'}
                >
                  <span aria-hidden="true">💡</span>
                  <span className="tip-action-label">Tipp</span>
                </button>
              )}
            </div>
          </div>
          <div className="quiz-question"><QuestionPrompt q={q} inputValue={inputValue} /></div>
        </section>

        {showTip && !feedback && (
          <div className="bubble tip-bubble" role="status"><span aria-hidden="true">💡</span> {tipFor(q)}</div>
        )}

        <div className="quiz-body" key={`${round}-${pos}`}>
          {q.type === 'mc' && <MCQuestion q={q} disabled={!!feedback} onAnswer={handleAnswer} />}
          {q.type === 'tf' && <TFQuestion q={q} disabled={!!feedback} onAnswer={handleAnswer} />}
          {(q.type === 'input' || q.type === 'reverse') && (
            <InputQuestion
              q={q}
              val={inputValue}
              setVal={setInputValue}
              disabled={!!feedback}
              onAnswer={handleAnswer}
            />
          )}
          {q.type === 'pairs' && <PairsQuestion q={q} disabled={!!feedback} onAnswer={handleAnswer} />}
        </div>

      </main>

      {feedback && (
        <div className={`feedback ${feedback.ok ? 'ok' : 'nope'}`}>
          <div className="feedback-content">
            <div className="feedback-message">
              <span className="feedback-icon" aria-hidden="true">{feedback.ok ? '✓' : '×'}</span>
              <div className="feedback-text">{feedback.text}</div>
            </div>
            <button className="btn btn-primary" onClick={next} ref={weiterBtnRef}>
              Weiter <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
