import { describe, it, expect } from 'vitest'
import { calculateVklad, type VkladParams } from './vklad'

const base: VkladParams = {
  initialAmount: 100000,
  monthlyReplenishment: 0,
  annualRate: 10,
  termMonths: 12,
  capitalizationPerYear: 12,
  taxRate: 0,
  currency: 'RUB',
}

describe('calculateVklad', () => {
  it('инвариант: finalAmount = initialAmount + totalReplenishments + netInterest', () => {
    const r = calculateVklad({ ...base, monthlyReplenishment: 5000, taxRate: 13 })
    const expected = base.initialAmount + r.totalReplenishments + r.netInterest
    expect(r.finalAmount).toBeCloseTo(expected, 4)
  })

  it('нулевая ставка → доход = 0', () => {
    const r = calculateVklad({ ...base, annualRate: 0, monthlyReplenishment: 5000, taxRate: 13 })
    expect(r.grossInterest).toBeCloseTo(0, 6)
    expect(r.netInterest).toBeCloseTo(0, 6)
    expect(r.taxPaid).toBeCloseTo(0, 6)
  })

  it('нулевой налог → netInterest = grossInterest', () => {
    const r = calculateVklad({ ...base, taxRate: 0 })
    expect(r.netInterest).toBeCloseTo(r.grossInterest, 6)
    expect(r.taxPaid).toBe(0)
  })

  it('расписание содержит termMonths точек', () => {
    const r = calculateVklad({ ...base, termMonths: 24 })
    expect(r.schedule).toHaveLength(24)
  })

  it('налог 13% уменьшает чистый доход', () => {
    const noTax = calculateVklad({ ...base, taxRate: 0 })
    const withTax = calculateVklad({ ...base, taxRate: 13 })
    expect(withTax.netInterest).toBeLessThan(noTax.netInterest)
    expect(withTax.taxPaid).toBeCloseTo(noTax.grossInterest * 0.13, 4)
  })

  it('пополнения увеличивают итог', () => {
    const noRep = calculateVklad({ ...base, monthlyReplenishment: 0 })
    const withRep = calculateVklad({ ...base, monthlyReplenishment: 5000 })
    expect(withRep.finalAmount).toBeGreaterThan(noRep.finalAmount)
  })
})
