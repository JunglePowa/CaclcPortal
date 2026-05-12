import type { CalcParams, YearlyBreakdown, GoalParams, DurationParams, RateParams, CapitalParams } from '@/types'

/**
 * Converts nominal annual rate to effective annual rate.
 * EAR = (1 + r/n)^n - 1
 */
export function effectiveAnnualRate(nominalRate: number, compoundingPerYear: number): number {
  if (compoundingPerYear <= 0) return 0
  if (nominalRate === 0) return 0
  return Math.pow(1 + nominalRate / 100 / compoundingPerYear, compoundingPerYear) - 1
}

/**
 * Deflates a nominal value to real (inflation-adjusted) value.
 * realValue = nominal / (1 + inflationRate/100)^years
 */
export function adjustForInflation(
  nominalValue: number,
  inflationRate: number,
  years: number
): number {
  if (years <= 0 || inflationRate === 0) return nominalValue
  return nominalValue / Math.pow(1 + inflationRate / 100, years)
}

export function calculateCompound(params: CalcParams): YearlyBreakdown[] {
  const {
    initialAmount,
    monthlyContribution,
    annualRate,
    compoundingPerYear,
    years,
    inflationRate,
    taxRate = 0,
    contributionFrequency = 'monthly',
    contributionGrowthRate = 0,
  } = params

  const n = compoundingPerYear
  const rn = annualRate / 100 / n
  const taxMultiplier = 1 - taxRate / 100

  // monthlyContribution здесь — это взнос за один период выбранной частоты
  // (т.е. за месяц при 'monthly', за квартал при 'quarterly', за год при 'yearly').
  // Имя оставлено для обратной совместимости со схемой формы.
  const freqMultiplier = contributionFrequency === 'monthly' ? 12
    : contributionFrequency === 'quarterly' ? 4 : 1
  const baseAnnualContrib = monthlyContribution * freqMultiplier

  const results: YearlyBreakdown[] = []
  let balance = initialAmount
  let cumulativeContributions = 0

  for (let year = 1; year <= years; year++) {
    const annualContrib = baseAnnualContrib * Math.pow(1 + contributionGrowthRate / 100, year - 1)
    const pmtPerPeriod = annualContrib / n
    const startBalance = balance

    for (let p = 0; p < n; p++) {
      balance = balance * (1 + rn) + pmtPerPeriod
    }

    const grossInterest = balance - startBalance - annualContrib
    const netBalance = startBalance + annualContrib + grossInterest * taxMultiplier
    balance = netBalance
    cumulativeContributions += annualContrib

    const realValue = inflationRate && inflationRate > 0
      ? adjustForInflation(balance, inflationRate, year)
      : undefined

    results.push({
      year,
      principal: initialAmount,
      contributions: cumulativeContributions,
      interest: balance - initialAmount - cumulativeContributions,
      total: balance,
      realValue,
    })
  }

  return results
}

/**
 * Бинарный поиск месячного взноса для достижения targetAmount.
 * Учитывает все параметры (taxRate, contributionFrequency, contributionGrowthRate, inflationRate)
 * через полный вызов calculateCompound на каждой итерации.
 *
 * Если задана inflationRate > 0 — targetAmount трактуется как сумма в сегодняшних деньгах,
 * сравниваем с реальной (дефлированной) стоимостью итогового баланса.
 */
export function calculateRequiredContribution(params: GoalParams): number {
  const { initialAmount, targetAmount, years, inflationRate } = params

  if (targetAmount <= initialAmount) return 0

  const useReal = !!(inflationRate && inflationRate > 0)
  const finalValue = (rows: YearlyBreakdown[]) => {
    const last = rows[rows.length - 1]
    if (!last) return 0
    return useReal && last.realValue !== undefined ? last.realValue : last.total
  }

  const { targetAmount: _t, ...calcRest } = params
  void _t
  const check = (monthly: number) => {
    const rows = calculateCompound({ ...calcRest, monthlyContribution: monthly })
    return finalValue(rows)
  }

  // Верхняя граница: targetAmount/12 на год, на годы — щедро
  let high = Math.max(targetAmount / 12, 1)
  // Если даже high недостаточно — расширяем (на случай высокой инфляции / коротких сроков)
  let guard = 0
  while (check(high) < targetAmount && guard < 30) {
    high *= 2
    guard++
  }
  if (check(high) < targetAmount) return Infinity

  let low = 0
  // 25 итераций бинарного поиска: точность high/2^25, что для типичных high ≈ targetAmount/12
  // на порядки меньше требуемого 0.01 ₽ (всё равно ранний выход по этому условию).
  for (let i = 0; i < 25; i++) {
    const mid = (low + high) / 2
    if (check(mid) < targetAmount) low = mid
    else high = mid
    if (high - low < 0.01) break
  }
  return Math.max(0, (low + high) / 2)
}

/**
 * Duration mode: calculates how many years to reach target amount.
 * Uses binary search since no closed-form solution with tax.
 */
/**
 * Возвращает минимальное целое число лет, при котором итоговый баланс ≥ targetAmount.
 * При inflationRate > 0 сравниваем с реальной стоимостью (target — в сегодняшних деньгах).
 */
export function calculateRequiredYears(params: DurationParams): number {
  const { targetAmount, initialAmount, monthlyContribution, annualRate, inflationRate } = params

  if (targetAmount <= initialAmount) return 0
  if (annualRate === 0 && monthlyContribution === 0) return Infinity

  const useReal = !!(inflationRate && inflationRate > 0)
  const { targetAmount: _t, ...calcRest } = params
  void _t
  const finalAt = (years: number) => {
    if (years <= 0) return initialAmount
    const rows = calculateCompound({ ...calcRest, years })
    const last = rows[rows.length - 1]
    if (!last) return 0
    return useReal && last.realValue !== undefined ? last.realValue : last.total
  }

  if (finalAt(100) < targetAmount) return Infinity

  // Линейный поиск минимального N (целые годы), при котором finalAt(N) >= target.
  // Бинарный поиск по целым может пропустить точное равенство; для max 100 итераций — достаточно дёшево.
  for (let n = 1; n <= 100; n++) {
    if (finalAt(n) >= targetAmount) return n
  }
  return Infinity
}

/**
 * targetAmount при inflationRate > 0 трактуется как сумма в сегодняшних деньгах:
 * сравниваем с realValue (дефлированной итоговой суммой).
 */
export function calculateRequiredRate(params: RateParams): number {
  const { targetAmount, inflationRate, ...rest } = params
  if (targetAmount <= rest.initialAmount) return 0

  const useReal = !!(inflationRate && inflationRate > 0)
  const check = (rate: number) => {
    const res = calculateCompound({ ...rest, inflationRate, annualRate: rate })
    const last = res[res.length - 1]
    if (!last) return 0
    return useReal && last.realValue !== undefined ? last.realValue : last.total
  }

  if (check(100) < targetAmount) return Infinity

  let low = 0, high = 100
  // 25 итераций: 100/2^25 ≈ 3e-6 — более чем достаточно для процентной ставки.
  for (let i = 0; i < 25; i++) {
    const mid = (low + high) / 2
    if (check(mid) < targetAmount) low = mid
    else high = mid
    if (high - low < 0.0001) break
  }
  return (low + high) / 2
}

export function calculateRequiredInitialAmount(params: CapitalParams): number {
  const { targetAmount, inflationRate, ...rest } = params

  const useReal = !!(inflationRate && inflationRate > 0)
  const check = (initial: number) => {
    const res = calculateCompound({ ...rest, inflationRate, initialAmount: initial })
    const last = res[res.length - 1]
    if (!last) return 0
    return useReal && last.realValue !== undefined ? last.realValue : last.total
  }

  if (check(0) >= targetAmount) return 0

  let low = 0, high = targetAmount
  // Расширим high при необходимости (высокая инфляция)
  let guard = 0
  while (check(high) < targetAmount && guard < 30) {
    high *= 2
    guard++
  }
  if (check(high) < targetAmount) return Infinity

  // 25 итераций: high/2^25 — для targetAmount до 1e10 это <1 ₽, ранний выход всё равно сработает.
  for (let i = 0; i < 25; i++) {
    const mid = (low + high) / 2
    if (check(mid) < targetAmount) low = mid
    else high = mid
    if (high - low < 1) break
  }
  return Math.ceil((low + high) / 2)
}
