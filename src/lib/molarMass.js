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
  K: { mass: 39.098, name: 'Калий' },
  Ca: { mass: 40.078, name: 'Кальций' },
  Cr: { mass: 51.996, name: 'Хром' },
  Mn: { mass: 54.938, name: 'Марганец' },
  Fe: { mass: 55.845, name: 'Железо' },
  Co: { mass: 58.933, name: 'Кобальт' },
  Ni: { mass: 58.693, name: 'Никель' },
  Cu: { mass: 63.546, name: 'Медь' },
  Zn: { mass: 65.38, name: 'Цинк' },
  Br: { mass: 79.904, name: 'Бром' },
  Ag: { mass: 107.868, name: 'Серебро' },
  I: { mass: 126.904, name: 'Иод' },
  Ba: { mass: 137.327, name: 'Барий' },
  Pb: { mass: 207.2, name: 'Свинец' },
  Hg: { mass: 200.59, name: 'Ртуть' },
}

function tokenize(formula) {
  const tokens = []
  let i = 0
  const s = formula.replace(/\s+/g, '').replace(/·/g, '*')
  while (i < s.length) {
    const c = s[i]
    if (c === '(' || c === ')' || c === '[' || c === ']' || c === '*') {
      tokens.push({ type: c === '[' ? '(' : c === ']' ? ')' : c })
      i++
    } else if (/\d/.test(c) || c === '.') {
      let n = ''
      while (i < s.length && /[\d.]/.test(s[i])) n += s[i++]
      tokens.push({ type: 'num', value: Number(n) })
    } else if (/[A-Z]/.test(c)) {
      let el = c
      i++
      while (i < s.length && /[a-z]/.test(s[i])) el += s[i++]
      tokens.push({ type: 'el', value: el })
    } else {
      throw new Error(`Неизвестный символ: ${c}`)
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
      const [inner, ni] = parseGroup(tokens, i)
      i = ni
      for (const [el, n] of Object.entries(inner)) add(el, n * hyd)
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
    throw new Error('Неверная формула')
  }
  return [counts, i]
}

export function parseFormula(formula) {
  if (!formula?.trim()) throw new Error('Введите формулу')
  const tokens = tokenize(formula)
  const [counts, i] = parseGroup(tokens, 0)
  if (i !== tokens.length && tokens[i]?.type !== ')') {
    throw new Error('Неверная формула')
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
  return { total, breakdown }
}
