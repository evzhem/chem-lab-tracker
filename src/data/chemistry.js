export const CATIONS = [
  { id: 'li', label: 'Li⁺' },
  { id: 'na', label: 'Na⁺' },
  { id: 'k', label: 'K⁺' },
  { id: 'nh4', label: 'NH₄⁺' },
  { id: 'mg', label: 'Mg²⁺' },
  { id: 'ca', label: 'Ca²⁺' },
  { id: 'ba', label: 'Ba²⁺' },
  { id: 'al', label: 'Al³⁺' },
  { id: 'zn', label: 'Zn²⁺' },
  { id: 'cu', label: 'Cu²⁺' },
  { id: 'ag', label: 'Ag⁺' },
  { id: 'fe2', label: 'Fe²⁺' },
  { id: 'fe3', label: 'Fe³⁺' },
  { id: 'pb', label: 'Pb²⁺' },
]

export const ANIONS = [
  { id: 'oh', label: 'OH⁻' },
  { id: 'cl', label: 'Cl⁻' },
  { id: 'br', label: 'Br⁻' },
  { id: 'i', label: 'I⁻' },
  { id: 's', label: 'S²⁻' },
  { id: 'so3', label: 'SO₃²⁻' },
  { id: 'so4', label: 'SO₄²⁻' },
  { id: 'no3', label: 'NO₃⁻' },
  { id: 'co3', label: 'CO₃²⁻' },
  { id: 'po4', label: 'PO₄³⁻' },
  { id: 'ch3coo', label: 'CH₃COO⁻' },
]

// R = soluble, N = insoluble, M = slightly, H = hydrolyzes / decomposes
const R = 'R'
const N = 'N'
const M = 'M'
const H = 'H'

export const SOLUBILITY = {
  li: { oh: R, cl: R, br: R, i: R, s: R, so3: R, so4: R, no3: R, co3: R, po4: M, ch3coo: R },
  na: { oh: R, cl: R, br: R, i: R, s: R, so3: R, so4: R, no3: R, co3: R, po4: R, ch3coo: R },
  k: { oh: R, cl: R, br: R, i: R, s: R, so3: R, so4: R, no3: R, co3: R, po4: R, ch3coo: R },
  nh4: { oh: R, cl: R, br: R, i: R, s: R, so3: R, so4: R, no3: R, co3: R, po4: R, ch3coo: R },
  mg: { oh: N, cl: R, br: R, i: R, s: H, so3: N, so4: R, no3: R, co3: N, po4: N, ch3coo: R },
  ca: { oh: M, cl: R, br: R, i: R, s: M, so3: N, so4: M, no3: R, co3: N, po4: N, ch3coo: R },
  ba: { oh: R, cl: R, br: R, i: R, s: R, so3: N, so4: N, no3: R, co3: N, po4: N, ch3coo: R },
  al: { oh: N, cl: R, br: R, i: R, s: H, so3: H, so4: R, no3: R, co3: H, po4: N, ch3coo: H },
  zn: { oh: N, cl: R, br: R, i: R, s: N, so3: N, so4: R, no3: R, co3: N, po4: N, ch3coo: R },
  cu: { oh: N, cl: R, br: R, i: N, s: N, so3: N, so4: R, no3: R, co3: N, po4: N, ch3coo: R },
  ag: { oh: N, cl: N, br: N, i: N, s: N, so3: N, so4: M, no3: R, co3: N, po4: N, ch3coo: M },
  fe2: { oh: N, cl: R, br: R, i: R, s: N, so3: N, so4: R, no3: R, co3: N, po4: N, ch3coo: R },
  fe3: { oh: N, cl: R, br: R, i: R, s: H, so3: H, so4: R, no3: R, co3: H, po4: N, ch3coo: H },
  pb: { oh: N, cl: M, br: M, i: N, s: N, so3: N, so4: N, no3: R, co3: N, po4: N, ch3coo: R },
}

export const SOL_LEGEND = {
  R: { text: 'Р', title: 'Растворимо', cls: 'bg-emerald-500/30 text-emerald-200' },
  N: { text: 'Н', title: 'Нерастворимо', cls: 'bg-rose-500/30 text-rose-200' },
  M: { text: 'М', title: 'Малорастворимо', cls: 'bg-amber-500/30 text-amber-200' },
  H: { text: 'Г', title: 'Гидролиз / разлагается', cls: 'bg-slate-500/40 text-slate-200' },
}

export const ACTIVITY = [
  { metal: 'Li', note: 'вытесняют H₂ из воды' },
  { metal: 'K', note: 'вытесняют H₂ из воды' },
  { metal: 'Ba', note: 'вытесняют H₂ из воды' },
  { metal: 'Ca', note: 'вытесняют H₂ из воды' },
  { metal: 'Na', note: 'вытесняют H₂ из воды' },
  { metal: 'Mg', note: 'из разбавленных кислот' },
  { metal: 'Al', note: 'из разбавленных кислот' },
  { metal: 'Mn', note: 'из разбавленных кислот' },
  { metal: 'Zn', note: 'из разбавленных кислот' },
  { metal: 'Cr', note: 'из разбавленных кислот' },
  { metal: 'Fe', note: 'из разбавленных кислот' },
  { metal: 'Cd', note: 'из разбавленных кислот' },
  { metal: 'Co', note: 'из разбавленных кислот' },
  { metal: 'Ni', note: 'из разбавленных кислот' },
  { metal: 'Sn', note: 'из разбавленных кислот' },
  { metal: 'Pb', note: 'из разбавленных кислот' },
  { metal: 'H₂', note: 'граница водорода' },
  { metal: 'Cu', note: 'не вытесняют H₂ из кислот' },
  { metal: 'Hg', note: 'не вытесняют H₂ из кислот' },
  { metal: 'Ag', note: 'не вытесняют H₂ из кислот' },
  { metal: 'Pt', note: 'не вытесняют H₂ из кислот' },
  { metal: 'Au', note: 'не вытесняют H₂ из кислот' },
]

export const ACIDS = [
  { acid: 'HCl', name: 'Соляная', residue: 'Cl⁻', residueName: 'хлорид' },
  { acid: 'HBr', name: 'Бромоводородная', residue: 'Br⁻', residueName: 'бромид' },
  { acid: 'HI', name: 'Иодоводородная', residue: 'I⁻', residueName: 'иодид' },
  { acid: 'HF', name: 'Плавиковая', residue: 'F⁻', residueName: 'фторид' },
  { acid: 'H₂S', name: 'Сероводородная', residue: 'S²⁻ / HS⁻', residueName: 'сульфид / гидросульфид' },
  { acid: 'H₂SO₄', name: 'Серная', residue: 'SO₄²⁻ / HSO₄⁻', residueName: 'сульфат / гидросульфат' },
  { acid: 'H₂SO₃', name: 'Сернистая', residue: 'SO₃²⁻ / HSO₃⁻', residueName: 'сульфит / гидросульфит' },
  { acid: 'HNO₃', name: 'Азотная', residue: 'NO₃⁻', residueName: 'нитрат' },
  { acid: 'HNO₂', name: 'Азотистая', residue: 'NO₂⁻', residueName: 'нитрит' },
  { acid: 'H₂CO₃', name: 'Угольная', residue: 'CO₃²⁻ / HCO₃⁻', residueName: 'карбонат / гидрокарбонат' },
  { acid: 'H₃PO₄', name: 'Ортофосфорная', residue: 'PO₄³⁻ / HPO₄²⁻ / H₂PO₄⁻', residueName: 'фосфат / гидро- / дигидрофосфат' },
  { acid: 'H₂SiO₃', name: 'Кремниевая', residue: 'SiO₃²⁻', residueName: 'силикат' },
  { acid: 'CH₃COOH', name: 'Уксусная', residue: 'CH₃COO⁻', residueName: 'ацетат' },
]

export const SAFETY = [
  {
    title: 'Очки и халат',
    text: 'Всегда надевайте защитные очки и халат. Волосы уберите, контактные линзы лучше снять.',
  },
  {
    title: 'Никогда не пробуйте на вкус',
    text: 'Реактивы не нюхают прямо из сосуда и не пробуют. Запах — лёгким движением ладони к себе.',
  },
  {
    title: 'Кислоту в воду',
    text: 'Концентрированную кислоту вливают в воду тонкой струёй при перемешивании, никогда наоборот.',
  },
  {
    title: 'Тяга и летучие вещества',
    text: 'Опыты с газами, концентрированными кислотами и нагревом — только в вытяжном шкафу.',
  },
  {
    title: 'Нагревание пробирок',
    text: 'Не направляйте отверстие пробирки на себя и соседей. Нагревайте равномерно, не от дна резко.',
  },
  {
    title: 'Стекло и ожоги',
    text: 'Горячее стекло выглядит как холодное. Ставьте горячую посуду на асбестовую сетку / керамику.',
  },
  {
    title: 'Разливы',
    text: 'Кислоты нейтрализуют содой, щёлочи — слабой кислотой. Сообщите преподавателю сразу.',
  },
  {
    title: 'Отходы',
    text: 'Не сливайте в раковину тяжёлые металлы, органику и концентрированные растворы без разрешения.',
  },
]
