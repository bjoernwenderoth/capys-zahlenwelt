// Aufgaben-Generator

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function makeMC(a, b) {
  const c = a * b
  const cands = [c + a, c - a, c + b, c - b, a * (b + 1), a * (b - 1), (a + 1) * b, c + 10, c - 10]
  const pool = [...new Set(cands.filter((x) => x > 0 && x !== c))]
  // Fallback, falls zu wenige unterschiedliche falsche Antworten (z. B. bei 1×1)
  let delta = 1
  while (pool.length < 3) {
    for (const x of [c + delta, c - delta]) {
      if (x > 0 && x !== c && !pool.includes(x)) pool.push(x)
    }
    delta++
  }
  const distractors = shuffle(pool).slice(0, 3)
  return { type: 'mc', a, b, answer: c, options: shuffle([c, ...distractors]) }
}

function makeInput(a, b) {
  return { type: 'input', a, b, answer: a * b }
}

function makeReverse(a, b) {
  // a × ? = a·b  → gesucht ist b
  return { type: 'reverse', a, b, answer: b, product: a * b }
}

function makeTF(a, b) {
  const c = a * b
  const isTrue = Math.random() < 0.5
  let shown = c
  if (!isTrue) {
    const deltas = [a, -a, b, -b, 10, -10].filter((d) => c + d > 0 && d !== 0)
    shown = c + pick(deltas.length ? deltas : [1])
  }
  return { type: 'tf', a, b, shown, isTrue }
}

function makePairs(rows) {
  const used = new Set()
  const items = []
  let guard = 0
  while (items.length < 4 && guard < 200) {
    guard++
    const a = pick(rows)
    const b = randInt(1, 10)
    const key = `${a}x${b}`
    const c = a * b
    if (used.has(key)) continue
    if (items.some((it) => it.c === c)) continue // Ergebnisse müssen eindeutig sein
    used.add(key)
    items.push({ a, b, c })
  }
  return { type: 'pairs', items }
}

function uniqueTasks(rows, n) {
  if (rows.length === 1) {
    // Eine Reihe: alle 10 Aufgaben der Reihe, gemischt
    const r = rows[0]
    return shuffle(Array.from({ length: 10 }, (_, i) => ({ a: r, b: i + 1 }))).slice(0, n)
  }
  const set = new Set()
  const tasks = []
  let guard = 0
  while (tasks.length < n && guard < 500) {
    guard++
    const a = pick(rows)
    const b = randInt(1, 10)
    const key = `${a}x${b}`
    if (set.has(key)) continue
    set.add(key)
    tasks.push({ a, b })
  }
  return tasks
}

export const QUESTIONS_PER_LEVEL = 10

export function generateQuestions(level) {
  const types = level.types
  const withPairs = types.includes('pairs')
  const pairsCount = withPairs ? 1 : 0
  const normalTypes = types.filter((t) => t !== 'pairs')

  const tasks = uniqueTasks(level.rows, QUESTIONS_PER_LEVEL - pairsCount)
  const questions = tasks.map(({ a, b }, i) => {
    const t = normalTypes[i % normalTypes.length]
    if (t === 'mc') return makeMC(a, b)
    if (t === 'input') return makeInput(a, b)
    if (t === 'reverse') return makeReverse(a, b)
    return makeTF(a, b)
  })

  const result = shuffle(questions)
  if (pairsCount) {
    // Paare-Aufgabe irgendwo in der Mitte einfügen
    result.splice(randInt(3, result.length - 1), 0, makePairs(level.rows))
  }
  return result
}

// Capys Tipps
export function tipFor(q) {
  if (q.type === 'pairs') {
    return 'Rechne jede Aufgabe einzeln aus und such dann das passende Ergebnis!'
  }
  const { a, b } = q
  const other = a === 1 ? b : a
  if (q.type === 'reverse') {
    return `Zähle in ${a}er-Schritten, bis du bei ${q.product} bist. Wie viele Schritte brauchst du?`
  }
  if (a === 1 || b === 1) return `Mal 1 ist leicht: Die Zahl bleibt einfach gleich! Also ${other}.`
  if (a === 10 || b === 10) return 'Mal 10 ist ein Trick: Häng einfach eine 0 an die Zahl!'
  if (a === 2 || b === 2) {
    const o = a === 2 ? b : a
    return `Mal 2 heißt verdoppeln: ${o} + ${o} = ?`
  }
  if (a === 5 || b === 5) return 'Zähle in 5er-Schritten: 5, 10, 15, 20, 25 …'
  if (a === 9 || b === 9) {
    const o = a === 9 ? b : a
    return `Trick für mal 9: Rechne erst ${o} × 10 und zieh dann einmal ${o} ab!`
  }
  return `Kennst du ${a} × ${b - 1}? Dann zähl einfach noch einmal ${a} dazu! Oder tausche: ${b} × ${a} ist genauso viel.`
}

export function questionText(q) {
  if (q.type === 'mc' || q.type === 'input') return `Was ist ${q.a} mal ${q.b}?`
  if (q.type === 'reverse') return `${q.a} mal wie viel ist ${q.product}?`
  if (q.type === 'tf') return `Stimmt das? ${q.a} mal ${q.b} ist ${q.shown}?`
  return 'Finde die Paare!'
}

export function correctAnswerText(q) {
  if (q.type === 'mc' || q.type === 'input') return `${q.a} × ${q.b} = ${q.a * q.b}`
  if (q.type === 'reverse') return `${q.a} × ${q.answer} = ${q.product}`
  if (q.type === 'tf') return q.isTrue ? `Es stimmt: ${q.a} × ${q.b} = ${q.shown}` : `Richtig wäre: ${q.a} × ${q.b} = ${q.a * q.b}`
  return ''
}
