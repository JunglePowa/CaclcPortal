import { describe, expect, it } from 'vitest'
import { calculateCompoundInterest } from './compoundInterest'

describe('calculateCompoundInterest', () => {
  it('grows balance with compound interest and contributions', () => {
    const result = calculateCompoundInterest({
      principal: 100_000,
      monthlyContribution: 10_000,
      annualRate: 12,
      years: 2,
      compoundingPerYear: 12,
    })

    expect(result.months).toBe(24)
    expect(result.totalContributions).toBe(340_000)
    expect(result.finalAmount).toBeGreaterThan(result.totalContributions)
  })

  it('returns contributions only for zero rate', () => {
    const result = calculateCompoundInterest({
      principal: 100_000,
      monthlyContribution: 5_000,
      annualRate: 0,
      years: 1,
      compoundingPerYear: 12,
    })

    expect(result.finalAmount).toBe(160_000)
    expect(result.interestEarned).toBe(0)
  })
})
