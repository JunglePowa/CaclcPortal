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

function childDeductionMonthly(count: number): number {
  if (count <= 0) return 0
  if (count === 1) return 1400
  if (count === 2) return 2800
  return 5800
}

const DEDUCTION_INCOME_LIMIT = 350000  // лимит накопленного дохода для детского вычета (ст. 218 НК РФ)
const MROT_2024 = 19242                // МРОТ 2024 — порог для пониженных взносов МСП

// Считаем годовой детский вычет с учётом помесячной отсечки по 350к.
// Вычет применяется в каждом месяце, пока накопленный с начала года доход
// (включая текущий месяц) не превысил 350 000 руб.
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

export function calculateZarplata(params: ZarplataParams): ZarplataResult {
  const { amount, direction, hasChildren, childrenCount, smallBusiness } = params
  const ndflRate = 0.13
  const monthlyDeduction = hasChildren ? childDeductionMonthly(childrenCount) : 0

  // Сначала находим месячный gross — для net→gross используем приближённую формулу
  // (без поправки на отсечку 350к, поскольку отсечка зависит от gross).
  let grossSalary: number
  if (direction === 'gross_to_net') {
    grossSalary = amount
  } else {
    grossSalary = (amount - monthlyDeduction * ndflRate) / (1 - ndflRate)
  }

  // Годовой вычет с учётом лимита 350к. Усреднённо распределяем обратно на месяц,
  // чтобы вернуть месячные показатели.
  const annualDeduction = annualChildDeductionWithLimit(grossSalary, monthlyDeduction)
  const effectiveMonthlyDeduction = annualDeduction / 12

  const taxBase = Math.max(0, grossSalary - effectiveMonthlyDeduction)
  const ndfl = taxBase * ndflRate
  const netSalary = grossSalary - ndfl

  // Страховые взносы. Для не-МСП — единая ставка 22+5.1+2.9 = 30%.
  // Для МСП с 2024 г.: 30% до МРОТ + 15% свыше МРОТ (на всю часть оклада).
  let pensionFund: number
  let medicalFund: number
  let socialFund: number

  if (smallBusiness && grossSalary > MROT_2024) {
    const upToMrot = MROT_2024
    const aboveMrot = grossSalary - MROT_2024
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
