/**
 * Solubility table with approximate g/100 ml water (20–25 °C) where known.
 * Codes: number = g/100ml, 'R' highly soluble, 'N' insoluble, 'M' slight, '?' unknown, 'H' hydrolyzes
 */

export const SOL_CATIONS = [
  { id: 'h', label: 'H⁺' },
  { id: 'nh4', label: 'NH₄⁺' },
  { id: 'li', label: 'Li⁺' },
  { id: 'na', label: 'Na⁺' },
  { id: 'k', label: 'K⁺' },
  { id: 'rb', label: 'Rb⁺' },
  { id: 'mg', label: 'Mg²⁺' },
  { id: 'ca', label: 'Ca²⁺' },
  { id: 'sr', label: 'Sr²⁺' },
  { id: 'ba', label: 'Ba²⁺' },
  { id: 'al', label: 'Al³⁺' },
  { id: 'cr', label: 'Cr³⁺' },
  { id: 'mn', label: 'Mn²⁺' },
  { id: 'fe2', label: 'Fe²⁺' },
  { id: 'fe3', label: 'Fe³⁺' },
  { id: 'co', label: 'Co²⁺' },
  { id: 'ni', label: 'Ni²⁺' },
  { id: 'cu', label: 'Cu²⁺' },
  { id: 'ag', label: 'Ag⁺' },
  { id: 'zn', label: 'Zn²⁺' },
  { id: 'cd', label: 'Cd²⁺' },
  { id: 'hg2', label: 'Hg²⁺' },
  { id: 'pb', label: 'Pb²⁺' },
  { id: 'sn', label: 'Sn²⁺' },
]

export const SOL_ANIONS = [
  { id: 'oh', label: 'OH⁻', name: 'Гидроксид' },
  { id: 'f', label: 'F⁻', name: 'Фторид' },
  { id: 'cl', label: 'Cl⁻', name: 'Хлорид' },
  { id: 'br', label: 'Br⁻', name: 'Бромид' },
  { id: 'i', label: 'I⁻', name: 'Иодид' },
  { id: 's', label: 'S²⁻', name: 'Сульфид' },
  { id: 'so3', label: 'SO₃²⁻', name: 'Сульфит' },
  { id: 'so4', label: 'SO₄²⁻', name: 'Сульфат' },
  { id: 's2o3', label: 'S₂O₃²⁻', name: 'Тиосульфат' },
  { id: 'no2', label: 'NO₂⁻', name: 'Нитрит' },
  { id: 'no3', label: 'NO₃⁻', name: 'Нитрат' },
  { id: 'po4', label: 'PO₄³⁻', name: 'Ортофосфат' },
  { id: 'co3', label: 'CO₃²⁻', name: 'Карбонат' },
  { id: 'sio3', label: 'SiO₃²⁻', name: 'Силикат' },
  { id: 'ch3coo', label: 'CH₃COO⁻', name: 'Ацетат' },
  { id: 'cro4', label: 'CrO₄²⁻', name: 'Хромат' },
  { id: 'cr2o7', label: 'Cr₂O₇²⁻', name: 'Дихромат' },
  { id: 'mno4', label: 'MnO₄⁻', name: 'Перманганат' },
]

// Approximate solubility g / 100 g H2O at ~20°C, or qualitative
const R = 'R' // > 10, highly
const N = 'N' // < 0.01
const M = 'M' // 0.01–1
const H = 'H' // decomposes / hydrolyzes
const U = '?'

export const SOL_TABLE = {
  // rows = cations
  h: {
    oh: R, f: R, cl: '36.5', br: R, i: R, s: R, so3: R, so4: R, s2o3: R, no2: R, no3: R, po4: R, co3: R, sio3: H, ch3coo: R, cro4: R, cr2o7: R, mno4: R,
  },
  nh4: {
    oh: R, f: '37', cl: '37', br: R, i: R, s: R, so3: R, so4: '75', s2o3: R, no2: R, no3: R, po4: R, co3: R, sio3: R, ch3coo: R, cro4: R, cr2o7: R, mno4: R,
  },
  li: {
    oh: '12.5', f: '0.13', cl: '84', br: R, i: R, s: R, so3: R, so4: '26', s2o3: R, no2: R, no3: R, po4: M, co3: '1.3', sio3: R, ch3coo: R, cro4: R, cr2o7: R, mno4: R,
  },
  na: {
    oh: '109', f: '4.1', cl: '35.9', br: '90', i: R, s: '20', so3: R, so4: '19.5', s2o3: R, no2: R, no3: '87', po4: '12', co3: '21.5', sio3: R, ch3coo: R, cro4: R, cr2o7: R, mno4: '6.4',
  },
  k: {
    oh: '112', f: '95', cl: '34.2', br: '65', i: '140', s: R, so3: R, so4: '11.1', s2o3: R, no2: R, no3: '31.6', po4: R, co3: '111', sio3: R, ch3coo: R, cro4: '63', cr2o7: '13', mno4: '6.4',
  },
  rb: {
    oh: R, f: R, cl: R, br: R, i: R, s: R, so3: R, so4: R, s2o3: R, no2: R, no3: R, po4: R, co3: R, sio3: R, ch3coo: R, cro4: R, cr2o7: R, mno4: R,
  },
  mg: {
    oh: '0.0009', f: '0.0076', cl: '54.2', br: R, i: R, s: H, so3: N, so4: '35.1', s2o3: R, no2: R, no3: R, po4: N, co3: '0.01', sio3: N, ch3coo: R, cro4: R, cr2o7: R, mno4: R,
  },
  ca: {
    oh: '0.17', f: '0.0016', cl: '74.5', br: R, i: R, s: '0.02', so3: N, so4: '0.21', s2o3: R, no2: R, no3: R, po4: N, co3: '0.001', sio3: N, ch3coo: '34.7', cro4: 'M', cr2o7: R, mno4: R,
  },
  sr: {
    oh: '0.41', f: N, cl: '53.8', br: R, i: R, s: M, so3: N, so4: '0.01', s2o3: M, no2: R, no3: R, po4: N, co3: N, sio3: N, ch3coo: R, cro4: N, cr2o7: R, mno4: R,
  },
  ba: {
    oh: '3.9', f: '0.12', cl: '35.8', br: R, i: R, s: R, so3: N, so4: '0.0002', s2o3: M, no2: R, no3: R, po4: N, co3: '0.002', sio3: N, ch3coo: R, cro4: '0.0003', cr2o7: M, mno4: R,
  },
  al: {
    oh: N, f: '0.56', cl: '45.8', br: R, i: R, s: H, so3: H, so4: '36.4', s2o3: H, no2: H, no3: R, po4: N, co3: H, sio3: N, ch3coo: H, cro4: H, cr2o7: R, mno4: H,
  },
  cr: {
    oh: N, f: M, cl: R, br: R, i: R, s: H, so3: H, so4: R, s2o3: H, no2: H, no3: R, po4: N, co3: H, sio3: N, ch3coo: H, cro4: N, cr2o7: R, mno4: H,
  },
  mn: {
    oh: N, f: M, cl: '72.3', br: R, i: R, s: N, so3: N, so4: '62', s2o3: R, no2: R, no3: R, po4: N, co3: N, sio3: N, ch3coo: R, cro4: N, cr2o7: R, mno4: H,
  },
  fe2: {
    oh: N, f: M, cl: '64.4', br: R, i: R, s: N, so3: N, so4: '26.5', s2o3: R, no2: R, no3: R, po4: N, co3: N, sio3: N, ch3coo: R, cro4: N, cr2o7: H, mno4: H,
  },
  fe3: {
    oh: N, f: M, cl: R, br: R, i: R, s: H, so3: H, so4: R, s2o3: H, no2: H, no3: R, po4: N, co3: H, sio3: N, ch3coo: H, cro4: H, cr2o7: R, mno4: H,
  },
  co: {
    oh: N, f: M, cl: '52.9', br: R, i: R, s: N, so3: N, so4: '36.2', s2o3: R, no2: R, no3: R, po4: N, co3: N, sio3: N, ch3coo: R, cro4: N, cr2o7: R, mno4: R,
  },
  ni: {
    oh: N, f: M, cl: '66.8', br: R, i: R, s: N, so3: N, so4: '40.4', s2o3: R, no2: R, no3: R, po4: N, co3: N, sio3: N, ch3coo: R, cro4: N, cr2o7: R, mno4: R,
  },
  cu: {
    oh: N, f: M, cl: '75.7', br: R, i: N, s: N, so3: N, so4: '20.5', s2o3: H, no2: R, no3: R, po4: N, co3: N, sio3: N, ch3coo: R, cro4: N, cr2o7: R, mno4: R,
  },
  ag: {
    oh: N, f: '1.8', cl: '0.0002', br: '0.00001', i: '0.000003', s: N, so3: N, so4: '0.83', s2o3: R, no2: M, no3: '216', po4: N, co3: N, sio3: N, ch3coo: '1.0', cro4: N, cr2o7: M, mno4: R,
  },
  zn: {
    oh: N, f: '1.6', cl: '367', br: R, i: R, s: N, so3: N, so4: '57.7', s2o3: R, no2: R, no3: R, po4: N, co3: N, sio3: N, ch3coo: R, cro4: N, cr2o7: R, mno4: R,
  },
  cd: {
    oh: N, f: '4.4', cl: R, br: R, i: R, s: N, so3: N, so4: '76', s2o3: R, no2: R, no3: R, po4: N, co3: N, sio3: N, ch3coo: R, cro4: N, cr2o7: R, mno4: R,
  },
  hg2: {
    oh: N, f: M, cl: '6.9', br: M, i: N, s: N, so3: N, so4: '6.3', s2o3: H, no2: R, no3: R, po4: N, co3: N, sio3: N, ch3coo: R, cro4: N, cr2o7: R, mno4: R,
  },
  pb: {
    oh: '0.016', f: '0.064', cl: '1.0', br: '0.84', i: '0.06', s: N, so3: N, so4: '0.004', s2o3: M, no2: R, no3: '52', po4: N, co3: N, sio3: N, ch3coo: '44', cro4: N, cr2o7: M, mno4: R,
  },
  sn: {
    oh: N, f: R, cl: '84', br: R, i: R, s: N, so3: N, so4: R, s2o3: H, no2: H, no3: H, po4: N, co3: N, sio3: N, ch3coo: H, cro4: N, cr2o7: H, mno4: H,
  },
}

export function solClass(val) {
  if (val === N || val === 'N') return { code: 'N', label: 'Нерастворимо', cls: 'bg-orange-700/90 text-orange-50' }
  if (val === M || val === 'M') return { code: 'M', label: 'Малорастворимо', cls: 'bg-amber-600/80 text-amber-50' }
  if (val === H || val === 'H') return { code: 'H', label: 'Гидролиз / разлаг.', cls: 'bg-slate-600 text-slate-100' }
  if (val === U || val === '?' || val == null) return { code: '?', label: 'Нет данных', cls: 'bg-slate-800 text-slate-400' }
  if (val === R || val === 'R') return { code: 'R', label: 'Растворимо', cls: 'bg-teal-700/90 text-teal-50' }
  const n = Number(val)
  if (!Number.isFinite(n)) return { code: '?', label: 'Нет данных', cls: 'bg-slate-800 text-slate-400' }
  if (n < 0.01) return { code: 'N', label: `≈ ${n} г/100 мл · нераств.`, cls: 'bg-orange-700/90 text-orange-50', num: n }
  if (n < 1) return { code: 'M', label: `≈ ${n} г/100 мл · мало`, cls: 'bg-amber-600/80 text-amber-50', num: n }
  if (n < 10) return { code: 'R', label: `≈ ${n} г/100 мл`, cls: 'bg-teal-800/80 text-teal-50', num: n }
  return { code: 'R', label: `≈ ${n} г/100 мл · хорошо`, cls: 'bg-teal-600/90 text-teal-50', num: n }
}
