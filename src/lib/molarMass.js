export const ATOMIC = {
  H: { mass: 1.008, name: 'Водород' },
  He: { mass: 4.003, name: 'Гелий' },
  Li: { mass: 6.941, name: 'Литий' },
  Be: { mass: 9.012, name: 'Бериллий' },
  B: { mass: 10.81, name: 'Бор' },
  C: { mass: 12.011, name: 'Углерод' },
  N: { mass: 14.007, name: 'Азот' },
  O: { mass: 15.999, name: 'Кислород' },
  F: { mass: 18.998, name: 'Фтор' },
  Ne: { mass: 20.18, name: 'Неон' },
  Na: { mass: 22.99, name: 'Натрий' },
  Mg: { mass: 24.305, name: 'Магний' },
  Al: { mass: 26.982, name: 'Алюминий' },
  Si: { mass: 28.086, name: 'Кремний' },
  P: { mass: 30.974, name: 'Фосфор' },
  S: { mass: 32.065, name: 'Сера' },
  Cl: { mass: 35.453, name: 'Хлор' },
  Ar: { mass: 39.948, name: 'Аргон' },
  K: { mass: 39.098, name: 'Калий' },
  Ca: { mass: 40.078, name: 'Кальций' },
  Sc: { mass: 44.956, name: 'Скандий' },
  Ti: { mass: 47.867, name: 'Титан' },
  V: { mass: 50.942, name: 'Ванадий' },
  Cr: { mass: 51.996, name: 'Хром' },
  Mn: { mass: 54.938, name: 'Марганец' },
  Fe: { mass: 55.845, name: 'Железо' },
  Co: { mass: 58.933, name: 'Кобальт' },
  Ni: { mass: 58.693, name: 'Никель' },
  Cu: { mass: 63.546, name: 'Медь' },
  Zn: { mass: 65.38, name: 'Цинк' },
  Ga: { mass: 69.723, name: 'Галлий' },
  Ge: { mass: 72.64, name: 'Германий' },
  As: { mass: 74.922, name: 'Мышьяк' },
  Se: { mass: 78.96, name: 'Селен' },
  Br: { mass: 79.904, name: 'Бром' },
  Kr: { mass: 83.798, name: 'Криптон' },
  Rb: { mass: 85.468, name: 'Рубидий' },
  Sr: { mass: 87.62, name: 'Стронций' },
  Y: { mass: 88.906, name: 'Иттрий' },
  Zr: { mass: 91.224, name: 'Цирконий' },
  Mo: { mass: 95.96, name: 'Молибден' },
  Ag: { mass: 107.868, name: 'Серебро' },
  Cd: { mass: 112.411, name: 'Кадмий' },
  In: { mass: 114.818, name: 'Индий' },
  Sn: { mass: 118.71, name: 'Олово' },
  Sb: { mass: 121.76, name: 'Сурьма' },
  Te: { mass: 127.6, name: 'Теллур' },
  I: { mass: 126.904, name: 'Иод' },
  Xe: { mass: 131.293, name: 'Ксенон' },
  Cs: { mass: 132.905, name: 'Цезий' },
  Ba: { mass: 137.327, name: 'Барий' },
  La: { mass: 138.905, name: 'Лантан' },
  W: { mass: 183.84, name: 'Вольфрам' },
  Pt: { mass: 195.084, name: 'Платина' },
  Au: { mass: 196.967, name: 'Золото' },
  Hg: { mass: 200.59, name: 'Ртуть' },
  Pb: { mass: 207.2, name: 'Свинец' },
  Bi: { mass: 208.98, name: 'Висмут' },
  U: { mass: 238.029, name: 'Уран' },
}

/** Normalize crystallohydrate separators: · • × * and bare "." (CuSO4.5H2O). */
function normalizeFormula(raw) {
  return String(raw)
    .replace(/\s+/g, '')
    .replace(/[·•×]/g, '*')
    // Dot between formula parts is a hydrate mark, not a decimal.
    // "CuSO4.5H2O" → "CuSO4*5H2O"; keep real decimals out of chem formulas.
    .replace(/\./g, '*')
}

function tokenize(formula) {
  const tokens = []
  let i = 0
  const s = normalizeFormula(formula)
  while (i < s.length) {
    const c = s[i]
    if (c === '(' || c === ')' || c === '[' || c === ']' || c === '*') {
      tokens.push({ type: c === '[' ? '(' : c === ']' ? ')' : c })
      i++
    } else if (/\d/.test(c)) {
      let n = ''
      while (i < s.length && /\d/.test(s[i])) n += s[i++]
      // optional fractional part only if written as 5/2 style is not supported;
      // plain integers only — hydrates use * separator
      tokens.push({ type: 'num', value: Number(n) })
    } else if (/[A-Z]/.test(c)) {
      let el = c
      i++
      while (i < s.length && /[a-z]/.test(s[i])) el += s[i++]
      tokens.push({ type: 'el', value: el })
    } else {
      throw new Error(`Неизвестный символ: «${c}»`)
    }
  }
  return tokens
}

function parseGroup(tokens, i) {
  const counts = {}
  const add = (el, n) => {
    counts[el] = (counts[el] || 0) + n
  }

  while (i < tokens.length) {
    const t = tokens[i]
    if (t.type === ')') break

    if (t.type === '*') {
      i++
      let hyd = 1
      if (tokens[i]?.type === 'num') {
        hyd = tokens[i].value
        i++
      }
      if (i >= tokens.length) throw new Error('После · ожидается формула гидрата')
      // hydrate part may be a group "(…)" or a plain formula segment until next * or )
      if (tokens[i]?.type === '(') {
        const [inner, ni] = parseGroup(tokens, i + 1)
        i = ni
        if (tokens[i]?.type !== ')') throw new Error('Нет закрывающей скобки')
        i++
        let mul = 1
        if (tokens[i]?.type === 'num') {
          mul = tokens[i].value
          i++
        }
        for (const [el, n] of Object.entries(inner)) add(el, n * hyd * mul)
      } else {
        const [inner, ni] = parseHydrateSegment(tokens, i)
        i = ni
        for (const [el, n] of Object.entries(inner)) add(el, n * hyd)
      }
      continue
    }

    if (t.type === '(') {
      const [inner, ni] = parseGroup(tokens, i + 1)
      i = ni
      if (tokens[i]?.type !== ')') throw new Error('Нет закрывающей скобки')
      i++
      let mul = 1
      if (tokens[i]?.type === 'num') {
        mul = tokens[i].value
        i++
      }
      for (const [el, n] of Object.entries(inner)) add(el, n * mul)
      continue
    }

    if (t.type === 'el') {
      i++
      let mul = 1
      if (tokens[i]?.type === 'num') {
        mul = tokens[i].value
        i++
      }
      add(t.value, mul)
      continue
    }

    if (t.type === 'num') {
      throw new Error('Число не может стоять в начале фрагмента (кроме коэффициента гидрата)')
    }

    throw new Error('Неверная формула')
  }

  return [counts, i]
}

/** Parse elements until hydrate mark, closing paren, or end. */
function parseHydrateSegment(tokens, i) {
  const counts = {}
  const add = (el, n) => {
    counts[el] = (counts[el] || 0) + n
  }
  let started = false
  while (i < tokens.length) {
    const t = tokens[i]
    if (t.type === '*' || t.type === ')') break
    if (t.type === '(') {
      const [inner, ni] = parseGroup(tokens, i + 1)
      i = ni
      if (tokens[i]?.type !== ')') throw new Error('Нет закрывающей скобки')
      i++
      let mul = 1
      if (tokens[i]?.type === 'num') {
        mul = tokens[i].value
        i++
      }
      for (const [el, n] of Object.entries(inner)) add(el, n * mul)
      started = true
      continue
    }
    if (t.type === 'el') {
      i++
      let mul = 1
      if (tokens[i]?.type === 'num') {
        mul = tokens[i].value
        i++
      }
      add(t.value, mul)
      started = true
      continue
    }
    throw new Error('Неверная формула гидрата')
  }
  if (!started) throw new Error('Пустой фрагмент гидрата')
  return [counts, i]
}

export function parseFormula(formula) {
  if (!formula?.trim()) throw new Error('Введите формулу')
  const tokens = tokenize(formula)
  if (tokens.length === 0) throw new Error('Введите формулу')

  // optional leading coefficient: 2H2O
  let leading = 1
  let start = 0
  if (tokens[0]?.type === 'num') {
    leading = tokens[0].value
    start = 1
    if (start >= tokens.length) throw new Error('После коэффициента нужна формула')
  }

  const [counts, i] = parseGroup(tokens, start)
  if (i !== tokens.length) {
    if (tokens[i]?.type === ')') throw new Error('Лишняя закрывающая скобка')
    throw new Error('Неверная формула')
  }
  if (Object.keys(counts).length === 0) throw new Error('Неверная формула')

  if (leading !== 1) {
    for (const el of Object.keys(counts)) counts[el] *= leading
  }

  const breakdown = []
  let total = 0
  for (const [el, n] of Object.entries(counts)) {
    const info = ATOMIC[el]
    if (!info) throw new Error(`Элемент ${el} не найден в базе`)
    const sub = info.mass * n
    total += sub
    breakdown.push({ el, n, name: info.name, mass: info.mass, sub })
  }
  breakdown.sort((a, b) => b.sub - a.sub)
  return { total, breakdown, counts }
}
