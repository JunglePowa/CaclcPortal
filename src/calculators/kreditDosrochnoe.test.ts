import { describe, it, expect } from 'vitest'
import { calculateDosrochnoe, type DosrochnoeParams } from './kreditDosrochnoe'

const base: DosrochnoeParams = {
  balance: 1_000_000,
  annualRate: 15,
  remainingMonths: 60,
  earlyAmount: 200_000,
  earlyType: 'reduce-term',
  earlyMonth: 1,
}

describe('calculateDosrochnoe', () => {
  it('досрочка 0 → экономия 0', () => {
    const r = calculateDosrochnoe({ ...base, earlyAmount: 0 })
    expect(r.savings).toBeCloseTo(0, 2)
  })

  it('досрочка ≥ остаток → погашение в 1 месяц', () => {
    const r = calculateDosrochnoe({ ...base, earlyAmount: 5_000_000 })
    // Срок становится очень коротким (1 месяц).
    expect(r.newTermMonths).toBeLessThanOrEqual(1)
  })

  it('reduce-term даёт большую экономию чем reduce-payment', () => {
    const term = calculateDosrochnoe({ ...base, earlyType: 'reduce-term' })
    const pay = calculateDosrochnoe({ ...base, earlyType: 'reduce-payment' })
    expect(term.savings).toBeGreaterThan(pay.savings)
  })

  it('график имеет правильную длину', () => {
    const r = calculateDosrochnoe(base)
    // Без досрочки график = remainingMonths + 1 (включая нулевой месяц).
    expect(r.schedule.length).toBeGreaterThanOrEqual(base.remainingMonths + 1)
  })

  it('нулевая ставка — экономия 0 (процентов нет)', () => {
    const r = calculateDosrochnoe({ ...base, annualRate: 0 })
    expect(r.savings).toBeCloseTo(0, 2)
    expect(r.interestWithout).toBeCloseTo(0, 2)
  })

  it('reduce-payment — срок не меняется, платёж снижается', () => {
    const r = calculateDosrochnoe({ ...base, earlyType: 'reduce-payment' })
    expect(r.newTermMonths).toBe(base.remainingMonths)
    expect(r.newPayment).toBeLessThan(r.currentPayment)
  })

  it('reduce-term — платёж тот же, срок меньше', () => {
    const r = calculateDosrochnoe({ ...base, earlyType: 'reduce-term' })
    expect(r.newPayment).toBeCloseTo(r.currentPayment, 2)
    expect(r.newTermMonths).toBeLessThan(base.remainingMonths)
  })
})
