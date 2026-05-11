export type NdflDirection = 'gross_to_net' | 'net_to_gross'
export type NdflRate = 13 | 15 | 30

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

// Стандартные вычеты на детей (в месяц, ст. 218 НК РФ)
function childDeduction(count: number): number {
  if (count === 1) return 1400
  if (count === 2) return 1400 + 1400
  return 1400 + 1400 + 3000  // 3-й и последующие — 3000
}

export function calculateNdfl(params: NdflParams): NdflResult {
  const { amount, rate, direction, hasChildren, childrenCount } = params
  const r = rate / 100
  const deduction = hasChildren ? childDeduction(childrenCount) : 0

  if (direction === 'gross_to_net') {
    const grossIncome = amount
    const taxBase = Math.max(0, grossIncome - deduction)
    const taxAmount = taxBase * r
    const netIncome = grossIncome - taxAmount
    const effectiveRate = grossIncome > 0 ? (taxAmount / grossIncome) * 100 : 0
    return { grossIncome, taxAmount, netIncome, deduction, effectiveRate }
  } else {
    // net → gross: gross = net / (1 - r) примерно, но с вычетом сложнее
    // net = gross - (gross - deduction) * r = gross * (1 - r) + deduction * r
    // gross = (net - deduction * r) / (1 - r)
    const netIncome = amount
    const grossIncome = (netIncome - deduction * r) / (1 - r)
    const taxBase = Math.max(0, grossIncome - deduction)
    const taxAmount = taxBase * r
    const effectiveRate = grossIncome > 0 ? (taxAmount / grossIncome) * 100 : 0
    return { grossIncome, taxAmount, netIncome, deduction, effectiveRate }
  }
}
