import { describe, expect, it } from 'vitest'
import { calculateAutocredit } from './autocredit'

describe('calculateAutocredit', () => {
  it('calculates loan amount and down payment percent', () => {
    const result = calculateAutocredit({ carPrice: 2_000_000, downPayment: 400_000, annualRate: 12, termMonths: 60 })

    expect(result.loanAmount).toBe(1_600_000)
    expect(result.downPaymentPercent).toBe(20)
    expect(result.monthlyPayment).toBeGreaterThan(0)
    expect(result.totalCarCost).toBeGreaterThan(2_000_000)
  })

  it('caps down payment at car price', () => {
    const result = calculateAutocredit({ carPrice: 1_000_000, downPayment: 2_000_000, annualRate: 12, termMonths: 60 })

    expect(result.loanAmount).toBe(0)
    expect(result.downPaymentPercent).toBe(100)
  })
})
