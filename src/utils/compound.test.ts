import { describe, it, expect } from 'vitest'
import {
  effectiveAnnualRate,
  adjustForInflation,
  calculateCompound,
  calculateRequiredContribution,
  calculateRequiredYears,
} from './compound'

// ─── effectiveAnnualRate ───────────────────────────────────────────────────

describe('effectiveAnnualRate', () => {
  it('monthly compounding 12% nominal → ~12.68% EAR', () => {
    const ear = effectiveAnnualRate(12, 12)
    expect(ear).toBeCloseTo(0.12683, 4)
  })

  it('annual compounding: EAR equals nominal rate', () => {
    const ear = effectiveAnnualRate(10, 1)
    expect(ear).toBeCloseTo(0.1, 6)
  })

  it('quarterly compounding 8% nominal', () => {
    const ear = effectiveAnnualRate(8, 4)
    expect(ear).toBeCloseTo(0.08243, 4)
  })

  it('0% rate returns 0', () => {
    expect(effectiveAnnualRate(0, 12)).toBe(0)
  })

  it('0 compounding periods returns 0', () => {
    expect(effectiveAnnualRate(10, 0)).toBe(0)
  })
})

// ─── adjustForInflation ────────────────────────────────────────────────────

describe('adjustForInflation', () => {
  it('100k nominal at 5% inflation over 10 years', () => {
    const real = adjustForInflation(100000, 5, 10)
    expect(real).toBeCloseTo(61391, 0)
  })

  it('0% inflation: real equals nominal', () => {
    expect(adjustForInflation(50000, 0, 20)).toBe(50000)
  })

  it('0 years: returns nominal unchanged', () => {
    expect(adjustForInflation(100000, 3, 0)).toBe(100000)
  })

  it('negative inflation (deflation) increases real value', () => {
    const real = adjustForInflation(100000, -2, 5)
    expect(real).toBeGreaterThan(100000)
  })
})

// ─── calculateCompound ────────────────────────────────────────────────────

describe('calculateCompound', () => {
  const base = {
    initialAmount: 100000,
    monthlyContribution: 0,
    annualRate: 10,
    compoundingPerYear: 12 as const,
    years: 10,
  }

  it('returns correct number of yearly rows', () => {
    const result = calculateCompound(base)
    expect(result).toHaveLength(10)
  })

  it('10% monthly compounding, no contributions, 10 years ≈ 271,126', () => {
    const result = calculateCompound(base)
    const final = result[9].total
    // P(1 + 0.1/12)^120 = 100000 * 2.70704 ≈ 270,704 (no tax)
    expect(final).toBeCloseTo(270704, -2)
  })

  it('with monthly contributions increases final balance', () => {
    const result = calculateCompound({ ...base, monthlyContribution: 1000 })
    const noContrib = calculateCompound(base)
    expect(result[9].total).toBeGreaterThan(noContrib[9].total)
  })

  it('0% rate with contributions: total = initial + contributions', () => {
    const result = calculateCompound({
      ...base,
      annualRate: 0,
      monthlyContribution: 500,
    })
    const final = result[9]
    expect(final.interest).toBeCloseTo(0, 1)
    expect(final.total).toBeCloseTo(100000 + 500 * 12 * 10, 1)
  })

  it('13% tax reduces interest earned', () => {
    const noTax = calculateCompound(base)
    const withTax = calculateCompound({ ...base, taxRate: 13 })
    expect(withTax[9].interest).toBeLessThan(noTax[9].interest)
  })

  it('inflation adjusts realValue below total', () => {
    const result = calculateCompound({ ...base, inflationRate: 5 })
    result.forEach(row => {
      expect(row.realValue).toBeDefined()
      expect(row.realValue!).toBeLessThan(row.total)
    })
  })

  it('year-by-year: contributions grow monotonically', () => {
    const result = calculateCompound({ ...base, monthlyContribution: 500 })
    for (let i = 1; i < result.length; i++) {
      expect(result[i].contributions).toBeGreaterThan(result[i - 1].contributions)
    }
  })

  it('yearly vs monthly compounding: yearly yields less', () => {
    const monthly = calculateCompound(base)
    const yearly = calculateCompound({ ...base, compoundingPerYear: 1 })
    // Monthly compounding should yield more
    expect(monthly[9].total).toBeGreaterThan(yearly[9].total)
  })
})

// ─── calculateRequiredContribution ────────────────────────────────────────

describe('calculateRequiredContribution', () => {
  it('target less than initial returns 0', () => {
    const monthly = calculateRequiredContribution({
      initialAmount: 100000,
      annualRate: 10,
      compoundingPerYear: 12,
      years: 10,
      targetAmount: 50000,
    })
    expect(monthly).toBe(0)
  })

  it('result is positive for achievable target', () => {
    const monthly = calculateRequiredContribution({
      initialAmount: 10000,
      annualRate: 8,
      compoundingPerYear: 12,
      years: 20,
      targetAmount: 500000,
    })
    expect(monthly).toBeGreaterThan(0)
  })

  it('required contribution decreases with higher rate', () => {
    const params = {
      initialAmount: 10000,
      compoundingPerYear: 12 as const,
      years: 20,
      targetAmount: 500000,
    }
    const low = calculateRequiredContribution({ ...params, annualRate: 5 })
    const high = calculateRequiredContribution({ ...params, annualRate: 12 })
    expect(high).toBeLessThan(low)
  })

  it('plugging result back into calculateCompound reaches target', () => {
    const params = {
      initialAmount: 50000,
      annualRate: 10,
      compoundingPerYear: 12 as const,
      years: 15,
      targetAmount: 600000,
    }
    const monthly = calculateRequiredContribution(params)
    const result = calculateCompound({ ...params, monthlyContribution: monthly })
    const final = result[result.length - 1].total
    // Should be within 1% of target
    expect(Math.abs(final - 600000) / 600000).toBeLessThan(0.01)
  })
})

// ─── calculateRequiredYears ───────────────────────────────────────────────

describe('calculateRequiredYears', () => {
  it('target equal to initial returns 0', () => {
    const years = calculateRequiredYears({
      initialAmount: 100000,
      monthlyContribution: 0,
      annualRate: 10,
      compoundingPerYear: 12,
      targetAmount: 100000,
    })
    expect(years).toBe(0)
  })

  it('unreachable target with 0% rate and 0 contributions returns Infinity', () => {
    const years = calculateRequiredYears({
      initialAmount: 10000,
      monthlyContribution: 0,
      annualRate: 0,
      compoundingPerYear: 12,
      targetAmount: 1000000,
    })
    expect(years).toBe(Infinity)
  })

  it('higher rate achieves target in fewer years', () => {
    const params = {
      initialAmount: 10000,
      monthlyContribution: 500,
      compoundingPerYear: 12 as const,
      targetAmount: 300000,
    }
    const lowRate = calculateRequiredYears({ ...params, annualRate: 5 })
    const highRate = calculateRequiredYears({ ...params, annualRate: 15 })
    expect(highRate).toBeLessThan(lowRate)
  })

  it('more contributions means fewer years', () => {
    const params = {
      initialAmount: 10000,
      annualRate: 8,
      compoundingPerYear: 12 as const,
      targetAmount: 200000,
    }
    const lowContrib = calculateRequiredYears({ ...params, monthlyContribution: 200 })
    const highContrib = calculateRequiredYears({ ...params, monthlyContribution: 1000 })
    expect(highContrib).toBeLessThan(lowContrib)
  })
})
