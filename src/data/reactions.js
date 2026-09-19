/** Educational reaction database — free, offline */

export const REACTIONS = [
  {
    id: 'naoh-hcl',
    eq: 'NaOH + HCl → NaCl + H₂O',
    type: 'обмен',
    reagents: ['NaOH', 'HCl', 'NaCl', 'H2O'],
    note: 'Нейтрализация: щёлочь + кислота → соль + вода. Экзотермическая.',
  },
  {
    id: 'naoh-h2so4',
    eq: '2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O',
    type: 'обмен',
    reagents: ['NaOH', 'H2SO4', 'Na2SO4', 'H2O'],
    note: 'Нейтрализация серной кислоты.',
  },
  {
    id: 'caoh2-co2',
    eq: 'Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O',
    type: 'обмен',
    reagents: ['Ca(OH)2', 'CO2', 'CaCO3', 'H2O'],
    note: 'Известковая вода мутнеет — качественная реакция на CO₂.',
  },
  {
    id: 'caco3-hcl',
    eq: 'CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O',
    type: 'обмен',
    reagents: ['CaCO3', 'HCl', 'CaCl2', 'CO2', 'H2O'],
    note: 'Карбонаты с кислотами выделяют углекислый газ.',
  },
  {
    id: 'zn-hcl',
    eq: 'Zn + 2HCl → ZnCl₂ + H₂↑',
    type: 'замещение',
    reagents: ['Zn', 'HCl', 'ZnCl2', 'H2'],
    note: 'Металл до H₂ в ряду активности вытесняет водород из кислот.',
  },
  {
    id: 'fe-cuso4',
    eq: 'Fe + CuSO₄ → FeSO₄ + Cu',
    type: 'замещение',
    reagents: ['Fe', 'CuSO4', 'FeSO4', 'Cu'],
    note: 'Более активный металл вытесняет менее активный из соли.',
  },
  {
    id: 'cuso4-naoh',
    eq: 'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',
    type: 'обмен',
    reagents: ['CuSO4', 'NaOH', 'Cu(OH)2', 'Na2SO4'],
    note: 'Голубой студенистый осадок гидроксида меди(II).',
  },
  {
    id: 'agno3-nacl',
    eq: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃',
    type: 'обмен',
    reagents: ['AgNO3', 'NaCl', 'AgCl', 'NaNO3'],
    note: 'Качественная реакция на Cl⁻: белый творожистый осадок AgCl.',
  },
  {
    id: 'h2-o2',
    eq: '2H₂ + O₂ → 2H₂O',
    type: 'соединение',
    reagents: ['H2', 'O2', 'H2O'],
    note: 'Горение водорода («гремучий газ»).',
  },
  {
    id: 'c-o2',
    eq: 'C + O₂ → CO₂',
    type: 'соединение',
    reagents: ['C', 'O2', 'CO2'],
    note: 'Горение угля / углерода.',
  },
  {
    id: 'ch4-o2',
    eq: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    type: 'горение',
    reagents: ['CH4', 'O2', 'CO2', 'H2O'],
    note: 'Горение метана.',
  },
  {
    id: 'c2h5oh-o2',
    eq: 'C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O',
    type: 'горение',
    reagents: ['C2H5OH', 'O2', 'CO2', 'H2O'],
    note: 'Горение этанола.',
  },
  {
    id: 'n2-h2',
    eq: 'N₂ + 3H₂ ⇌ 2NH₃',
    type: 'соединение',
    reagents: ['N2', 'H2', 'NH3'],
    note: 'Синтез аммиака (процесс Габера–Боша), обратимая.',
  },
  {
    id: 'nh3-hcl',
    eq: 'NH₃ + HCl → NH₄Cl',
    type: 'соединение',
    reagents: ['NH3', 'HCl', 'NH4Cl'],
    note: 'Белый дым хлорида аммония.',
  },
  {
    id: '2kclo3',
    eq: '2KClO₃ → 2KCl + 3O₂↑',
    type: 'разложение',
    reagents: ['KClO3', 'KCl', 'O2'],
    note: 'Разложение бертолетовой соли (катализатор MnO₂) — получение O₂.',
  },
  {
    id: '2h2o2',
    eq: '2H₂O₂ → 2H₂O + O₂↑',
    type: 'разложение',
    reagents: ['H2O2', 'H2O', 'O2'],
    note: 'Разложение пероксида водорода (катализатор MnO₂ / каталаза).',
  },
  {
    id: 'caco3-heat',
    eq: 'CaCO₃ → CaO + CO₂↑',
    type: 'разложение',
    reagents: ['CaCO3', 'CaO', 'CO2'],
    note: 'Термическое разложение известняка (обжиг).',
  },
  {
    id: '2hgo',
    eq: '2HgO → 2Hg + O₂↑',
    type: 'разложение',
    reagents: ['HgO', 'Hg', 'O2'],
    note: 'Исторический опыт Пристли / Лавуазье.',
  },
  {
    id: 'al-fe2o3',
    eq: '2Al + Fe₂O₃ → Al₂O₃ + 2Fe',
    type: 'замещение',
    reagents: ['Al', 'Fe2O3', 'Al2O3', 'Fe'],
    note: 'Алюминотермия (реакция Гольдшмидта).',
  },
  {
    id: 'mg-co2',
    eq: '2Mg + CO₂ → 2MgO + C',
    type: 'замещение',
    reagents: ['Mg', 'CO2', 'MgO', 'C'],
    note: 'Магний горит в атмосфере CO₂.',
  },
  {
    id: 'fe-o2',
    eq: '4Fe + 3O₂ → 2Fe₂O₃',
    type: 'соединение',
    reagents: ['Fe', 'O2', 'Fe2O3'],
    note: 'Окисление / ржавление железа (упрощённо).',
  },
  {
    id: 'na-h2o',
    eq: '2Na + 2H₂O → 2NaOH + H₂↑',
    type: 'замещение',
    reagents: ['Na', 'H2O', 'NaOH', 'H2'],
    note: 'Щелочные металлы бурно реагируют с водой.',
  },
  {
    id: 'cl2-h2',
    eq: 'H₂ + Cl₂ → 2HCl',
    type: 'соединение',
    reagents: ['H2', 'Cl2', 'HCl'],
    note: 'Синтез хлороводорода (на свету — цепная).',
  },
  {
    id: 'cl2-ki',
    eq: 'Cl₂ + 2KI → 2KCl + I₂',
    type: 'замещение',
    reagents: ['Cl2', 'KI', 'KCl', 'I2'],
    note: 'Более активный галоген вытесняет менее активный.',
  },
  {
    id: 'baso4-qual',
    eq: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',
    type: 'обмен',
    reagents: ['BaCl2', 'Na2SO4', 'BaSO4', 'NaCl'],
    note: 'Качественная реакция на SO₄²⁻: белый осадок BaSO₄.',
  },
  {
    id: 'fecl3-kcns',
    eq: 'FeCl₃ + 3KCNS → Fe(CNS)₃ + 3KCl',
    type: 'обмен',
    reagents: ['FeCl3', 'KCNS', 'Fe(CNS)3', 'KCl', 'KSCN'],
    note: 'Качественная на Fe³⁺: кроваво-красное окрашивание.',
  },
  {
    id: 'h2so4-cu',
    eq: 'Cu + 2H₂SO₄(конц.) → CuSO₄ + SO₂↑ + 2H₂O',
    type: 'окислит.-восст.',
    reagents: ['Cu', 'H2SO4', 'CuSO4', 'SO2', 'H2O'],
    note: 'Конц. H₂SO₄ — окислитель; разб. с Cu не реагирует.',
  },
  {
    id: 'hno3-cu',
    eq: '3Cu + 8HNO₃(разб.) → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O',
    type: 'окислит.-восст.',
    reagents: ['Cu', 'HNO3', 'Cu(NO3)2', 'NO', 'H2O'],
    note: 'Азотная кислота окисляет медь (нет H₂).',
  },
  {
    id: 'so2-h2o',
    eq: 'SO₂ + H₂O ⇌ H₂SO₃',
    type: 'соединение',
    reagents: ['SO2', 'H2O', 'H2SO3'],
    note: 'Сернистая кислота — только в растворе.',
  },
  {
    id: 'co2-h2o',
    eq: 'CO₂ + H₂O ⇌ H₂CO₃',
    type: 'соединение',
    reagents: ['CO2', 'H2O', 'H2CO3'],
    note: 'Угольная кислота слабая, неустойчивая.',
  },
  {
    id: 'hcooh-h2so4',
    eq: 'HCOOH →(H₂SO₄) CO↑ + H₂O',
    type: 'разложение',
    reagents: ['HCOOH', 'H2SO4', 'CO', 'H2O', 'H2O+HCOOH'],
    note: 'Дегидратация муравьиной кислоты — получение CO в лаборатории.',
  },
  {
    id: 'ch3cooh-naoh',
    eq: 'CH₃COOH + NaOH → CH₃COONa + H₂O',
    type: 'обмен',
    reagents: ['CH3COOH', 'NaOH', 'CH3COONa', 'H2O'],
    note: 'Нейтрализация уксусной кислоты.',
  },
  {
    id: 'c2h4-br2',
    eq: 'C₂H₄ + Br₂ → C₂H₄Br₂',
    type: 'присоединение',
    reagents: ['C2H4', 'Br2', 'C2H4Br2'],
    note: 'Обесцвечивание бромной воды — качественная на кратные связи.',
  },
  {
    id: 'c2h2-h2',
    eq: 'C₂H₂ + H₂ → C₂H₄',
    type: 'присоединение',
    reagents: ['C2H2', 'H2', 'C2H4'],
    note: 'Гидрирование ацетилена (катализатор).',
  },
  {
    id: 'k2cr2o7-qual',
    eq: 'K₂Cr₂O₇ + 4H₂SO₄ + 3K₂SO₃ → Cr₂(SO₄)₃ + 4K₂SO₄ + 4H₂O',
    type: 'окислит.-восст.',
    reagents: ['K2Cr2O7', 'H2SO4', 'K2SO3', 'Cr2(SO4)3'],
    note: 'Оранжевый → зелёный: восстановление Cr₂O₇²⁻.',
  },
  {
    id: 'kmno4-h2o2',
    eq: '2KMnO₄ + 3H₂SO₄ + 5H₂O₂ → 2MnSO₄ + K₂SO₄ + 5O₂↑ + 8H₂O',
    type: 'окислит.-восст.',
    reagents: ['KMnO4', 'H2SO4', 'H2O2', 'MnSO4', 'O2', 'H2O'],
    note: 'Обесцвечивание перманганата пероксидом в кислой среде.',
  },
  {
    id: 'al-hcl',
    eq: '2Al + 6HCl → 2AlCl₃ + 3H₂↑',
    type: 'замещение',
    reagents: ['Al', 'HCl', 'AlCl3', 'H2'],
    note: 'Алюминий растворяется в HCl с выделением H₂.',
  },
  {
    id: 'al-naoh',
    eq: '2Al + 2NaOH + 6H₂O → 2Na[Al(OH)₄] + 3H₂↑',
    type: 'замещение',
    reagents: ['Al', 'NaOH', 'H2O', 'Na[Al(OH)4]', 'H2'],
    note: 'Амфотерность Al: реагирует и с щелочами.',
  },
  {
    id: 'pheno-naoh',
    eq: 'C₆H₅OH + NaOH → C₆H₅ONa + H₂O',
    type: 'обмен',
    reagents: ['C6H5OH', 'NaOH', 'C6H5ONa', 'H2O'],
    note: 'Фенол — слабая кислота, даёт фенолят.',
  },
  {
    id: 'ester',
    eq: 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O',
    type: 'обмен',
    reagents: ['CH3COOH', 'C2H5OH', 'CH3COOC2H5', 'H2O'],
    note: 'Этерификация Фишера (катализатор H₂SO₄).',
  },
]

export function searchReactions(query) {
  const q = query.trim().toLowerCase().replace(/\s+/g, '')
  if (!q) return []
  const parts = q.split(/[+,→⇌=]/).map((s) => s.trim()).filter(Boolean)
  return REACTIONS.filter((r) => {
    const hay = (r.eq + ' ' + r.reagents.join(' ') + ' ' + r.note + ' ' + r.type)
      .toLowerCase()
      .replace(/[₂₃₄₅₆₇₈₉⁰¹⁻⁺↓↑·]/g, (ch) => {
        const map = {
          '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
          '⁰': '0', '¹': '1', '⁻': '-', '⁺': '+', '↓': '', '↑': '', '·': '',
        }
        return map[ch] ?? ch
      })
      .replace(/\s+/g, '')
    if (hay.includes(q.replace(/[₂₃₄₅₆]/g, (c) => ({ '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6' }[c])))) {
      return true
    }
    // all tokens present
    if (parts.length > 1) {
      return parts.every((p) => {
        const n = p.replace(/[₂₃₄]/g, (c) => ({ '₂': '2', '₃': '3', '₄': '4' }[c] || c))
        return hay.includes(n) || r.reagents.some((x) => x.toLowerCase().includes(n))
      })
    }
    return r.reagents.some((x) => x.toLowerCase().includes(q)) || hay.includes(q)
  })
}
