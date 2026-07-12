import { useRef, useState } from 'react'
import Capybara from '../components/Capybara.jsx'
import {
  generateQuestions,
  questionText,
  correctAnswerText,
  tipFor,
  shuffle,
  QUESTIONS_PER_LEVEL
} from '../data/questions.js'
import { playCorrect, playWrong, playWin, playFail, speak } from '../utils/audio.js'

const PRAISE = ['Super! 🎉', 'Klasse gemacht!', 'Richtig! Du bist spitze!', 'Genau! Weiter so!', 'Toll! 💪']
const COMFORT = ['Macht nichts, die kommt gleich nochmal!', 'Kopf hoch, das übst du gleich nochmal!', 'Fast! Merk dir die Lösung gut!']

const PASS_MIN = 8

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
          {o}
        </button>
      ))}
    </div>
  )
}

function TFQuestion({ q, disabled, onAnswer }) {
  return (
    <div className="answers-grid tf">
      <button className="btn answer-btn tf-true" disabled={disabled} onClick={() => onAnswer(q.isTrue)}>
        ✓ Richtig
      </button>
      <button className="btn answer-btn tf-false" disabled={disabled} onClick={() => onAnswer(!q.isTrue)}>
        ✗ Falsch
      </button>
    </div>
  )
}

function InputQuestion({ q, disabled, onAnswer }) {
  const [val, setVal] = useState('')
  const expected = q.type === 'reverse' ? q.answer : q.answer
  const maxLen = 3

  function press(d) {
    if (disabled) return
    if (val.length < maxLen) setVal(val + d)
  }

  return (
    <div className="input-area">
      <div className="input-display">{val || '?'}</div>
      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => (
          <button key={d} className="btn key" disabled={disabled} onClick={() => press(String(d))}>
            {d}
          </button>
        ))}
        <button className="btn key key-del" disabled={disabled || !val} onClick={() => setVal(val.slice(0, -1))}>
          ⌫
        </button>
        <button
          className="btn key key-ok"
          disabled={disabled || !val}
          onClick={() => onAnswer(parseInt(val, 10) === expected)}
        >
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

function QuestionPrompt({ q }) {
  if (q.type === 'mc' || q.type === 'input') {
    return (
      <div className="equation">
        {q.a} × {q.b} = <span className="gap">?</span>
      </div>
    )
  }
  if (q.type === 'reverse') {
    return (
      <div className="equation">
        {q.a} × <span className="gap">?</span> = {q.product}
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

export default function Quiz({ level, muted, onFinish, onExit }) {
  const [round, setRound] = useState(0) // erhöht sich bei "Nochmal"
  const [questions, setQuestions] = useState(() => generateQuestions(level))
  const [queue, setQueue] = useState(() => questions.map((_, i) => i))
  const [pos, setPos] = useState(0)
  const [solved, setSolved] = useState(0)
  const [feedback, setFeedback] = useState(null) // {ok, text}
  const [showTip, setShowTip] = useState(false)
  const [done, setDone] = useState(null) // {pass, stars, correctFirst}
  const wrongSet = useRef(new Set())

  const qIdx = queue[pos]
  const q = questions[qIdx]
  const total = questions.length

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

  function finish(solvedAll) {
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
    setDone(null)
    setRound((r) => r + 1)
  }

  const mood = feedback ? (feedback.ok ? 'happy' : 'sad') : showTip ? 'think' : 'normal'

  // ---------- Ergebnis ----------
  if (done) {
    return (
      <div className="screen quiz-screen result-screen">
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
    <div className="screen quiz-screen">
      <header className="quiz-header">
        <button className="icon-btn" onClick={onExit} title="Level verlassen">✕</button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(solved / total) * 100}%` }} />
        </div>
        <span className="progress-text">{solved}/{total}</span>
      </header>

      <div className="quiz-top">
        <div className="quiz-capy">
          <Capybara mood={mood} size={80} />
        </div>
        <div className="quiz-question">
          <QuestionPrompt q={q} />
          <button className="icon-btn speak-btn" title="Vorlesen" onClick={() => speak(questionText(q), muted)}>
            🔊
          </button>
        </div>
      </div>

      {showTip && !feedback && (
        <div className="bubble tip-bubble">💡 {tipFor(q)}</div>
      )}

      <div className="quiz-body" key={`${round}-${pos}`}>
        {q.type === 'mc' && <MCQuestion q={q} disabled={!!feedback} onAnswer={handleAnswer} />}
        {q.type === 'tf' && <TFQuestion q={q} disabled={!!feedback} onAnswer={handleAnswer} />}
        {(q.type === 'input' || q.type === 'reverse') && (
          <InputQuestion q={q} disabled={!!feedback} onAnswer={handleAnswer} />
        )}
        {q.type === 'pairs' && <PairsQuestion q={q} disabled={!!feedback} onAnswer={handleAnswer} />}
      </div>

      {!feedback && (
        <button className="btn btn-tip" onClick={() => setShowTip((t) => !t)}>
          💡 Tipp von Capy
        </button>
      )}

      {feedback && (
        <div className={`feedback ${feedback.ok ? 'ok' : 'nope'}`}>
          <div className="feedback-text">{feedback.text}</div>
          <button className="btn btn-primary" onClick={next} autoFocus>
            Weiter ➜
          </button>
        </div>
      )}
    </div>
  )
}
