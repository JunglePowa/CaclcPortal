import { describe, expect, it } from 'vitest'
import { calculateCompoundInterest } from './compoundInterest'

describe('calculateCompoundInterest', () => {
  it('grows balance with compound interest and contributions', () => {
    const result = calculateCompoundInterest({
      principal: 100_000,
      contribution: 10_000,
      contributionPeriod: 'month',
      interestPaymentPeriod: 'month',
      annualRate: 12,
      years: 2,
      reinvestInterest: true,
    })

    expect(result.months).toBe(24)
    expect(result.totalContributions).toBe(340_000)
    expect(result.finalAmount).toBeGreaterThan(result.totalContributions)
    expect(result.schedule).toHaveLength(24)
    expect(result.schedule[0].contribution).toBe(10_000)
  })

  it('returns contributions only for zero rate', () => {
    const result = calculateCompoundInterest({
      principal: 100_000,
      contribution: 5_000,
      contributionPeriod: 'month',
      interestPaymentPeriod: 'month',
      annualRate: 0,
      years: 1,
      reinvestInterest: true,
    })

    expect(result.finalAmount).toBe(160_000)
    expect(result.interestEarned).toBe(0)
  })

  it('supports yearly contributions', () => {
    const result = calculateCompoundInterest({
      principal: 100_000,
      contribution: 60_000,
      contributionPeriod: 'year',
      interestPaymentPeriod: 'month',
      annualRate: 0,
      years: 2,
      reinvestInterest: true,
    })

    expect(result.totalContributions).toBe(220_000)
    expect(result.finalAmount).toBe(220_000)
    expect(result.schedule[0].contribution).toBe(0)
    expect(result.schedule[11].contribution).toBe(60_000)
  })

  it('keeps interest outside the base without reinvestment', () => {
    const withReinvest = calculateCompoundInterest({
      principal: 100_000,
      contribution: 0,
      contributionPeriod: 'month',
      interestPaymentPeriod: 'month',
      annualRate: 12,
      years: 2,
      reinvestInterest: true,
    })
    const withoutReinvest = calculateCompoundInterest({
      principal: 100_000,
      contribution: 0,
      contributionPeriod: 'month',
      interestPaymentPeriod: 'month',
      annualRate: 12,
      years: 2,
      reinvestInterest: false,
    })

    expect(withReinvest.finalAmount).toBeGreaterThan(withoutReinvest.finalAmount)
    expect(withoutReinvest.finalAmount).toBe(124_000)
    expect(withoutReinvest.schedule[23].closingBalance).toBe(100_000)
    expect(withoutReinvest.schedule[23].totalValue).toBe(124_000)
  })

  it('supports yearly interest payment and reinvestment', () => {
    const monthly = calculateCompoundInterest({
      principal: 100_000,
      contribution: 0,
      contributionPeriod: 'month',
      interestPaymentPeriod: 'month',
      annualRate: 12,
      years: 2,
      reinvestInterest: true,
    })
    const yearly = calculateCompoundInterest({
      principal: 100_000,
      contribution: 0,
      contributionPeriod: 'month',
      interestPaymentPeriod: 'year',
      annualRate: 12,
      years: 2,
      reinvestInterest: true,
    })

    expect(yearly.schedule[0].interest).toBe(0)
    expect(yearly.schedule[11].interest).toBe(12_000)
    expect(yearly.finalAmount).toBeCloseTo(125_440, 2)
    expect(monthly.finalAmount).toBeGreaterThan(yearly.finalAmount)
  })
})
