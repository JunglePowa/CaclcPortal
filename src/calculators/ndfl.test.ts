import { describe, it, expect } from 'vitest'
import { calculateNdfl, type NdflParams } from './ndfl'

const base: NdflParams = {
  amount: 100000,
  rate: 13,
  direction: 'gross_to_net',
  hasChildren: false,
  childrenCount: 0,
}

describe('calculateNdfl', () => {
  it('gross→net по ставке 13%: 100000 → 87000', () => {
    const r = calculateNdfl(base)
    expect(r.netIncome).toBeCloseTo(87000, 2)
    expect(r.taxAmount).toBeCloseTo(13000, 2)
  })

  it('gross↔net взаимно обратны', () => {
    const g = calculateNdfl(base)
    const back = calculateNdfl({ ...base, amount: g.netIncome, direction: 'net_to_gross' })
    expect(back.grossIncome).toBeCloseTo(base.amount, 2)
  })

  it('детский вычет уменьшает налог', () => {
    const noKids = calculateNdfl(base)
    const withKids = calculateNdfl({ ...base, hasChildren: true, childrenCount: 1 })
    expect(withKids.taxAmount).toBeLessThan(noKids.taxAmount)
    expect(withKids.netIncome).toBeGreaterThan(noKids.netIncome)
  })

  it('взаимная обратимость с вычетом', () => {
    const params = { ...base, hasChildren: true, childrenCount: 2 }
    const g = calculateNdfl(params)
    const back = calculateNdfl({ ...params, amount: g.netIncome, direction: 'net_to_gross' })
    expect(back.grossIncome).toBeCloseTo(base.amount, 2)
  })

  it('ставка 15% облагает больше', () => {
    const r13 = calculateNdfl(base)
    const r15 = calculateNdfl({ ...base, rate: 15 })
    expect(r15.taxAmount).toBeGreaterThan(r13.taxAmount)
  })

  it('эффективная ставка ниже номинальной при наличии вычета', () => {
    const r = calculateNdfl({ ...base, hasChildren: true, childrenCount: 3 })
    expect(r.effectiveRate).toBeLessThan(13)
  })
})
