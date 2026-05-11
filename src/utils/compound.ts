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
 * Goal mode: calculates required monthly contribution to reach a target amount.
 * Solved analytically from the compound formula.
 * monthlyContribution = PMT_period * n / 12
 * PMT_period = (target - P*(1+rn)^nt - interest_tax_adj) / (grossPMT_factor)
 * Uses binary search to handle tax correctly.
 */
export function calculateRequiredContribution(params: GoalParams): number {
  const { initialAmount, annualRate, compoundingPerYear, years, targetAmount, taxRate = 0, inflationRate } = params

  if (targetAmount <= initialAmount) return 0

  const n = compoundingPerYear
  const rn = annualRate / 100 / n
  const nt = n * years
  const growthFactor = rn > 0 ? Math.pow(1 + rn, nt) : 1
  const taxMultiplier = 1 - taxRate / 100

  const principalFV = initialAmount * growthFactor

  // Without tax: PMT = (target - principalFV) * rn / (growthFactor - 1)
  // Then monthly = PMT * n / 12
  // With tax we need to adjust for the fact that interest is taxed:
  // net_total = contributed + gross_interest * taxMultiplier
  // contributed = P + monthly * 12 * years
  // gross_interest = (principalFV + contribFV) - contributed
  // Rearranging for PMT_period:
  // target = P + monthly*12*years + (principalFV + contribFV - P - monthly*12*years) * taxMultiplier
  // target = P*(1-taxMultiplier) + principalFV*taxMultiplier + monthly*12*years*(1-taxMultiplier) + contribFV*taxMultiplier
  // contribFV = PMT_period * (growthFactor-1)/rn
  // monthly = PMT_period * n / 12
  // monthly * 12 * years = PMT_period * n * years = PMT_period * nt

  if (rn === 0) {
    // 0% rate: total = contributed, no interest
    const needed = targetAmount - initialAmount
    return needed / (12 * years)
  }

  // target = P*(1-tm) + principalFV*tm + PMT*(nt*(1-tm) + (gf-1)/rn*tm)
  // PMT = (target - P*(1-tm) - principalFV*tm) / (nt*(1-tm) + (gf-1)/rn*tm)
  const tm = taxMultiplier
  const numerator = targetAmount - initialAmount * (1 - tm) - principalFV * tm
  const denominator = nt * (1 - tm) + ((growthFactor - 1) / rn) * tm

  if (denominator <= 0) return 0

  const pmtPeriod = numerator / denominator
  const monthly = pmtPeriod * n / 12

  return Math.max(0, monthly)
}

/**
 * Duration mode: calculates how many years to reach target amount.
 * Uses binary search since no closed-form solution with tax.
 */
export function calculateRequiredYears(params: DurationParams): number {
  const { targetAmount, initialAmount, monthlyContribution, annualRate, compoundingPerYear, taxRate = 0, inflationRate } = params

  if (targetAmount <= initialAmount) return 0
  if (annualRate === 0 && monthlyContribution === 0) return Infinity

  // Binary search: find t such that calculateCompound(t).total >= target
  let low = 0
  let high = 100 // max 100 years

  // Check if 100 years is enough
  const maxResult = calculateCompound({ ...params, years: 100 })
  const maxTotal = maxResult[maxResult.length - 1]?.total ?? 0
  if (maxTotal < targetAmount) return Infinity

  for (let i = 0; i < 60; i++) {
    const mid = Math.floor((low + high) / 2)
    if (mid === low) break

    const result = calculateCompound({ ...params, years: mid })
    const total = result[result.length - 1]?.total ?? 0

    if (total < targetAmount) {
      low = mid
    } else {
      high = mid
    }
  }

  // Fine-tune with fractional years using the formula
  // Return ceiling in whole years
  return high
}

export function calculateRequiredRate(params: RateParams): number {
  const { targetAmount, ...rest } = params
  if (targetAmount <= rest.initialAmount) return 0

  const check = (rate: number) => {
    const res = calculateCompound({ ...(rest as any), annualRate: rate })
    return res[res.length - 1]?.total ?? 0
  }

  if (check(100) < targetAmount) return Infinity

  let low = 0, high = 100
  for (let i = 0; i < 80; i++) {
    const mid = (low + high) / 2
    if (check(mid) < targetAmount) low = mid
    else high = mid
    if (high - low < 0.0001) break
  }
  return (low + high) / 2
}

export function calculateRequiredInitialAmount(params: CapitalParams): number {
  const { targetAmount, ...rest } = params

  const check = (initial: number) => {
    const res = calculateCompound({ ...(rest as any), initialAmount: initial })
    return res[res.length - 1]?.total ?? 0
  }

  if (check(0) >= targetAmount) return 0

  let low = 0, high = targetAmount
  for (let i = 0; i < 80; i++) {
    const mid = (low + high) / 2
    if (check(mid) < targetAmount) low = mid
    else high = mid
    if (high - low < 1) break
  }
  return Math.ceil((low + high) / 2)
}
