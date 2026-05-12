export type ZarplataDirection = 'gross_to_net' | 'net_to_gross'

export interface ZarplataParams {
  amount: number
  direction: ZarplataDirection
  hasChildren: boolean
  childrenCount: number
  // Страховые взносы (для работодателя)
  smallBusiness: boolean  // МСП — пониженные взносы (15% вместо 30% сверх МРОТ)
}

export interface ZarplataResult {
  grossSalary: number       // гросс (оклад по договору)
  ndfl: number              // НДФЛ по прогрессивной шкале
  netSalary: number         // на руки
  deduction: number         // стандартный вычет
  // Расходы работодателя
  pensionFund: number       // ОПС 22%
  medicalFund: number       // ОМС 5.1%
  socialFund: number        // ОСС 2.9%
  totalEmployerCost: number // гросс + все взносы
  // Итого
  taxBurden: number         // % налоговой нагрузки от totalEmployerCost
}

function childDeductionMonthly(count: number): number {
  if (count <= 0) return 0
  return 1400 + (count >= 2 ? 2800 : 0) + Math.max(0, count - 2) * 6000
}

const DEDUCTION_INCOME_LIMIT = 450000  // лимит накопленного дохода для детского вычета с 2025 г.
const MROT_2026 = 27093                // МРОТ 2026 — порог для пониженных взносов МСП

const PROGRESSIVE_BRACKETS = [
  { upTo: 2_400_000, rate: 0.13 },
  { upTo: 5_000_000, rate: 0.15 },
  { upTo: 20_000_000, rate: 0.18 },
  { upTo: 50_000_000, rate: 0.20 },
  { upTo: Infinity, rate: 0.22 },
] as const

// Считаем годовой детский вычет с учётом помесячной отсечки по 450к.
// Вычет применяется в каждом месяце, пока накопленный с начала года доход
// (включая текущий месяц) не превысил 450 000 руб.
function annualChildDeductionWithLimit(monthlyGross: number, monthlyDeduction: number): number {
  if (monthlyDeduction <= 0 || monthlyGross <= 0) return 0
  let cumulative = 0
  let totalDeduction = 0
  for (let m = 1; m <= 12; m++) {
    cumulative += monthlyGross
    if (cumulative > DEDUCTION_INCOME_LIMIT) break
    totalDeduction += monthlyDeduction
  }
  return totalDeduction
}

function calculateProgressiveTax(taxBase: number): number {
  let remaining = Math.max(0, taxBase)
  let previousLimit = 0
  let tax = 0

  for (const bracket of PROGRESSIVE_BRACKETS) {
    const taxableInBracket = Math.min(remaining, bracket.upTo - previousLimit)
    if (taxableInBracket <= 0) break
    tax += taxableInBracket * bracket.rate
    remaining -= taxableInBracket
    previousLimit = bracket.upTo
  }

  return tax
}

function monthlyNetFromGross(grossSalary: number, monthlyDeduction: number): {
  annualDeduction: number
  ndfl: number
  netSalary: number
} {
  const annualGross = grossSalary * 12
  const annualDeduction = annualChildDeductionWithLimit(grossSalary, monthlyDeduction)
  const annualTaxBase = Math.max(0, annualGross - annualDeduction)
  const annualNdfl = calculateProgressiveTax(annualTaxBase)
  const ndfl = annualNdfl / 12
  return { annualDeduction, ndfl, netSalary: grossSalary - ndfl }
}

export function calculateZarplata(params: ZarplataParams): ZarplataResult {
  const { amount, direction, hasChildren, childrenCount, smallBusiness } = params
  const monthlyDeduction = hasChildren ? childDeductionMonthly(childrenCount) : 0

  let grossSalary: number
  if (direction === 'gross_to_net') {
    grossSalary = amount
  } else {
    let low = amount
    let high = Math.max(amount * 2, monthlyDeduction + 1)

    for (let i = 0; i < 80; i++) {
      if (monthlyNetFromGross(high, monthlyDeduction).netSalary >= amount) break
      high *= 2
    }

    for (let i = 0; i < 80; i++) {
      const mid = (low + high) / 2
      if (monthlyNetFromGross(mid, monthlyDeduction).netSalary >= amount) high = mid
      else low = mid
    }

    grossSalary = high
  }

  // Годовой вычет усредняем обратно на месяц, чтобы вернуть месячные показатели.
  const { annualDeduction, ndfl, netSalary } = monthlyNetFromGross(grossSalary, monthlyDeduction)
  const effectiveMonthlyDeduction = annualDeduction / 12

  // Страховые взносы. Для не-МСП — единая ставка 22+5.1+2.9 = 30%.
  // Для МСП: 30% до МРОТ + 15% свыше МРОТ.
  let pensionFund: number
  let medicalFund: number
  let socialFund: number

  if (smallBusiness && grossSalary > MROT_2026) {
    const upToMrot = MROT_2026
    const aboveMrot = grossSalary - MROT_2026
    pensionFund = upToMrot * 0.22 + aboveMrot * 0.10
    medicalFund = upToMrot * 0.051 + aboveMrot * 0.05
    socialFund = upToMrot * 0.029 + aboveMrot * 0.0
  } else {
    pensionFund = grossSalary * 0.22
    medicalFund = grossSalary * 0.051
    socialFund = grossSalary * 0.029
  }

  const totalInsurance = pensionFund + medicalFund + socialFund
  const totalEmployerCost = grossSalary + totalInsurance

  const taxBurden = totalEmployerCost > 0 ? ((ndfl + totalInsurance) / totalEmployerCost) * 100 : 0

  return {
    grossSalary,
    ndfl,
    netSalary,
    deduction: effectiveMonthlyDeduction,
    pensionFund,
    medicalFund,
    socialFund,
    totalEmployerCost,
    taxBurden,
  }
}
