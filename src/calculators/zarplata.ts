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
  ndfl: number              // НДФЛ 13%
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

function childDeduction(count: number): number {
  if (count <= 0) return 0
  if (count === 1) return 1400
  if (count === 2) return 2800
  return 5800
}

export function calculateZarplata(params: ZarplataParams): ZarplataResult {
  const { amount, direction, hasChildren, childrenCount } = params
  const ndflRate = 0.13
  const deduction = hasChildren ? childDeduction(childrenCount) : 0

  let grossSalary: number
  if (direction === 'gross_to_net') {
    grossSalary = amount
  } else {
    // net → gross
    grossSalary = (amount - deduction * ndflRate) / (1 - ndflRate)
  }

  const taxBase = Math.max(0, grossSalary - deduction)
  const ndfl = taxBase * ndflRate
  const netSalary = grossSalary - ndfl

  // Страховые взносы (стандартные 2024)
  const pensionFund = grossSalary * 0.22
  const medicalFund = grossSalary * 0.051
  const socialFund = grossSalary * 0.029
  const totalInsurance = pensionFund + medicalFund + socialFund
  const totalEmployerCost = grossSalary + totalInsurance

  const taxBurden = totalEmployerCost > 0 ? ((ndfl + totalInsurance) / totalEmployerCost) * 100 : 0

  return { grossSalary, ndfl, netSalary, deduction, pensionFund, medicalFund, socialFund, totalEmployerCost, taxBurden }
}
