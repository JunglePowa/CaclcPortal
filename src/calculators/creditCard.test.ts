import { describe, expect, it } from 'vitest'
import { calculateCreditCard } from './creditCard'

describe('calculateCreditCard', () => {
  it('calculates payoff period and interest', () => {
    const result = calculateCreditCard({ debt: 100_000, annualRate: 24, monthlyPayment: 10_000 })

    expect(result.isPayoffPossible).toBe(true)
    expect(result.months).toBeGreaterThan(10)
    expect(result.totalInterest).toBeGreaterThan(0)
    expect(result.totalPaid).toBeCloseTo(100_000 + result.totalInterest, 2)
  })

  it('detects payment below monthly interest', () => {
    const result = calculateCreditCard({ debt: 100_000, annualRate: 36, monthlyPayment: 2_000 })

    expect(result.isPayoffPossible).toBe(false)
  })
})
