// Klassisch-didaktische Reihenfolge: erst die Kernreihen 1, 2, 5, 10,
// dann 3, 4, 6, 7, 8, 9.
export const ROW_ORDER = [1, 2, 5, 10, 3, 4, 6, 7, 8, 9]

const ALL_ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Nach diesen Reihen kommt jeweils ein Wiederholungslevel
const REVIEW_AFTER = [10, 4, 7, 9]

function buildLevels() {
  const levels = []
  const learned = []
  let reviewNr = 0

  ROW_ORDER.forEach((r) => {
    learned.push(r)
    levels.push({
      id: `lern-${r}`,
      title: `${r}er-Reihe`,
      subtitle: 'Lernen',
      kind: 'learn',
      rows: [r],
      types: ['mc', 'tf']
    })
    levels.push({
      id: `ueben-${r}`,
      title: `${r}er-Reihe`,
      subtitle: 'Üben',
      kind: 'practice',
      rows: [r],
      types: ['mc', 'input', 'reverse']
    })
    if (REVIEW_AFTER.includes(r)) {
      reviewNr += 1
      levels.push({
        id: `wdh-${reviewNr}`,
        title: `Wiederholung ${reviewNr}`,
        subtitle: [...learned].sort((a, b) => a - b).join('er, ') + 'er',
        kind: 'review',
        rows: [...learned],
        types: ['mc', 'input', 'reverse', 'tf', 'pairs']
      })
    }
  })

  levels.push({
    id: 'final-1',
    title: 'Abschluss 1',
    subtitle: 'Alles gemischt',
    kind: 'final',
    rows: ALL_ROWS,
    types: ['mc', 'tf']
  })
  levels.push({
    id: 'final-2',
    title: 'Abschluss 2',
    subtitle: 'Alles gemischt',
    kind: 'final',
    rows: ALL_ROWS,
    types: ['mc', 'input', 'reverse', 'pairs']
  })
  levels.push({
    id: 'final-3',
    title: 'Königslevel',
    subtitle: 'Die große Prüfung',
    kind: 'final',
    rows: ALL_ROWS,
    types: ['input', 'reverse']
  })

  return levels
}

export const LEVELS = buildLevels()
