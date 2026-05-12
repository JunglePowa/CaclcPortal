import { describe, it, expect } from 'vitest'
import { calculateNds } from './nds'

describe('calculateNds', () => {
  it('charge: 1000 по ставке 22% → 1220, НДС 220', () => {
    const r = calculateNds({ amount: 1000, rate: 22, operation: 'charge' })
    expect(r.amountWithoutNds).toBe(1000)
    expect(r.ndsAmount).toBeCloseTo(220, 4)
    expect(r.amountWithNds).toBeCloseTo(1220, 4)
  })

  it('extract: 1220 по ставке 22% → НДС 220, без НДС 1000', () => {
    const r = calculateNds({ amount: 1220, rate: 22, operation: 'extract' })
    expect(r.amountWithNds).toBe(1220)
    expect(r.ndsAmount).toBeCloseTo(220, 4)
    expect(r.amountWithoutNds).toBeCloseTo(1000, 4)
  })

  it('charge: 1000 по ставке 20% → 1200, НДС 200', () => {
    const r = calculateNds({ amount: 1000, rate: 20, operation: 'charge' })
    expect(r.amountWithoutNds).toBe(1000)
    expect(r.ndsAmount).toBeCloseTo(200, 4)
    expect(r.amountWithNds).toBeCloseTo(1200, 4)
  })

  it('extract: 1200 по ставке 20% → НДС 200, без НДС 1000', () => {
    const r = calculateNds({ amount: 1200, rate: 20, operation: 'extract' })
    expect(r.amountWithNds).toBe(1200)
    expect(r.ndsAmount).toBeCloseTo(200, 4)
    expect(r.amountWithoutNds).toBeCloseTo(1000, 4)
  })

  it('charge и extract взаимно обратны', () => {
    const charged = calculateNds({ amount: 1000, rate: 20, operation: 'charge' })
    const extracted = calculateNds({ amount: charged.amountWithNds, rate: 20, operation: 'extract' })
    expect(extracted.amountWithoutNds).toBeCloseTo(1000, 4)
    expect(extracted.ndsAmount).toBeCloseTo(charged.ndsAmount, 4)
  })

  it('ставка 0%: суммы не меняются', () => {
    const c = calculateNds({ amount: 5000, rate: 0, operation: 'charge' })
    expect(c.ndsAmount).toBe(0)
    expect(c.amountWithNds).toBe(5000)
    const e = calculateNds({ amount: 5000, rate: 0, operation: 'extract' })
    expect(e.ndsAmount).toBe(0)
    expect(e.amountWithoutNds).toBe(5000)
  })

  it('ставка 10% работает', () => {
    const r = calculateNds({ amount: 1000, rate: 10, operation: 'charge' })
    expect(r.ndsAmount).toBeCloseTo(100, 4)
    expect(r.amountWithNds).toBeCloseTo(1100, 4)
  })
})
