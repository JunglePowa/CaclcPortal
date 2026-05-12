export type NdflDirection = 'gross_to_net' | 'net_to_gross'
export type NdflRate = 'progressive' | 13 | 15 | 18 | 20 | 22 | 30

export interface NdflParams {
  amount: number
  rate: NdflRate
  direction: NdflDirection
  // Стандартный вычет (опционально)
  hasChildren: boolean
  childrenCount: number  // 1, 2, 3+
}

export interface NdflResult {
  grossIncome: number    // доход до налога
  taxAmount: number      // сумма налога
  netIncome: number      // доход на руки
  deduction: number      // стандартный вычет в месяц
  effectiveRate: number  // фактическая ставка %
}

const PROGRESSIVE_BRACKETS = [
  { upTo: 2_400_000, rate: 0.13 },
  { upTo: 5_000_000, rate: 0.15 },
  { upTo: 20_000_000, rate: 0.18 },
  { upTo: 50_000_000, rate: 0.20 },
  { upTo: Infinity, rate: 0.22 },
] as const

// Стандартные вычеты на детей с 2025 г. (в месяц, ст. 218 НК РФ)
function childDeduction(count: number): number {
  if (count <= 0) return 0
  return 1400 + (count >= 2 ? 2800 : 0) + Math.max(0, count - 2) * 6000
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

function calculateTax(taxBase: number, rate: NdflRate): number {
  if (rate === 'progressive') return calculateProgressiveTax(taxBase)
  return Math.max(0, taxBase) * (rate / 100)
}

export function calculateNdfl(params: NdflParams): NdflResult {
  const { amount, rate, direction, hasChildren, childrenCount } = params
  const deduction = hasChildren ? childDeduction(childrenCount) : 0

  if (direction === 'gross_to_net') {
    const grossIncome = amount
    const taxBase = Math.max(0, grossIncome - deduction)
    const taxAmount = calculateTax(taxBase, rate)
    const netIncome = grossIncome - taxAmount
    const effectiveRate = grossIncome > 0 ? (taxAmount / grossIncome) * 100 : 0
    return { grossIncome, taxAmount, netIncome, deduction, effectiveRate }
  } else {
    const netIncome = amount
    let low = netIncome
    let high = Math.max(netIncome * 2, deduction + 1)

    for (let i = 0; i < 80; i++) {
      const taxBase = Math.max(0, high - deduction)
      const taxAmount = calculateTax(taxBase, rate)
      if (high - taxAmount >= netIncome) break
      high *= 2
    }

    for (let i = 0; i < 80; i++) {
      const mid = (low + high) / 2
      const taxBase = Math.max(0, mid - deduction)
      const taxAmount = calculateTax(taxBase, rate)
      if (mid - taxAmount >= netIncome) high = mid
      else low = mid
    }

    const grossIncome = high
    const taxBase = Math.max(0, grossIncome - deduction)
    const taxAmount = calculateTax(taxBase, rate)
    const effectiveRate = grossIncome > 0 ? (taxAmount / grossIncome) * 100 : 0
    return { grossIncome, taxAmount, netIncome, deduction, effectiveRate }
  }
}
