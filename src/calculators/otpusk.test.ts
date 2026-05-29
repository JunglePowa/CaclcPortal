import { describe, expect, it } from 'vitest'
import { calculateOtpusk } from './otpusk'

describe('calculateOtpusk', () => {
  it('calculates vacation pay for full 12 month period', () => {
    const result = calculateOtpusk({
      income: 1_200_000,
      months: 12,
      vacationDays: 14,
      excludedDays: 0,
      ndflRate: 13,
    })

    expect(result.calculationDays).toBeCloseTo(351.6, 4)
    expect(result.averageDailyEarnings).toBeCloseTo(3412.9693, 4)
    expect(result.grossVacationPay).toBeCloseTo(47781.5700, 3)
    expect(result.ndfl).toBeCloseTo(6211.6041, 3)
    expect(result.netVacationPay).toBeCloseTo(41569.9659, 3)
  })

  it('subtracts excluded days from calculation period', () => {
    const result = calculateOtpusk({
      income: 600_000,
      months: 6,
      vacationDays: 7,
      excludedDays: 10,
      ndflRate: 13,
    })

    expect(result.calculationDays).toBeCloseTo(165.8, 4)
    expect(result.averageDailyEarnings).toBeCloseTo(3618.8179, 4)
    expect(result.grossVacationPay).toBeCloseTo(25331.7250, 4)
  })

  it('keeps calculation days positive', () => {
    const result = calculateOtpusk({
      income: 100_000,
      months: 1,
      vacationDays: 1,
      excludedDays: 1000,
      ndflRate: 13,
    })

    expect(result.calculationDays).toBe(1)
    expect(result.grossVacationPay).toBe(100_000)
  })
})
