import { describe, it, expect } from 'vitest'
import { calculateObligacii, type ObligaciiParams } from './obligacii'

const base: ObligaciiParams = {
  faceValue: 1000,
  buyPricePercent: 100,
  sellPricePercent: 100,
  couponRate: 10,
  paymentsPerYear: 2,
  years: 5,
  taxRate: 0,
}

describe('calculateObligacii', () => {
  it('покупка по номиналу, налога нет → YTM ≈ купонной ставке', () => {
    const r = calculateObligacii(base)
    expect(r.ytm).toBeCloseTo(10, 1)
  })

  it('покупка ниже номинала → YTM > купонной', () => {
    const r = calculateObligacii({ ...base, buyPricePercent: 90 })
    expect(r.ytm).toBeGreaterThan(base.couponRate)
  })

  it('покупка выше номинала → YTM < купонной', () => {
    const r = calculateObligacii({ ...base, buyPricePercent: 110 })
    expect(r.ytm).toBeLessThan(base.couponRate)
  })

  it('нулевой купон работает (YTM > 0 при buy < sell)', () => {
    const r = calculateObligacii({ ...base, couponRate: 0, buyPricePercent: 80 })
    expect(r.couponIncome).toBe(0)
    expect(r.ytm).toBeGreaterThan(0)
  })

  it('нулевой срок → 0 купонов и 0 дохода', () => {
    const r = calculateObligacii({ ...base, years: 0 })
    expect(r.couponIncome).toBe(0)
    expect(r.netIncome).toBe(0)
  })

  it('разные периодичности — простая доходность одинакова за год', () => {
    const a = calculateObligacii({ ...base, paymentsPerYear: 1 })
    const b = calculateObligacii({ ...base, paymentsPerYear: 4 })
    expect(a.simpleYield).toBeCloseTo(b.simpleYield, 4)
  })

  it('текущая доходность = годовой купон / цена покупки', () => {
    const r = calculateObligacii({ ...base, buyPricePercent: 80 })
    // годовой купон 100 ₽, цена 800 → 12.5%
    expect(r.currentYield).toBeCloseTo(12.5, 4)
  })

  it('налог уменьшает чистый доход', () => {
    const noTax = calculateObligacii(base)
    const tax = calculateObligacii({ ...base, taxRate: 13 })
    expect(tax.netIncome).toBeLessThan(noTax.netIncome)
  })
})
