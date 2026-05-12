import { describe, it, expect } from 'vitest'
import { calculateTransport } from './transport'

const baseParams = {
  monthsOwned: 12,
  regionRate: 1,
  luxuryCoeff: 1,
}

describe('calculateTransport — границы мощности', () => {
  it('100 л.с. → ставка 12 (по верхней границе)', () => {
    const r = calculateTransport({ ...baseParams, horsePower: 100 })
    expect(r.baseRate).toBe(12)
    expect(r.annualTax).toBe(100 * 12)
  })

  it('101 л.с. → ставка 25', () => {
    const r = calculateTransport({ ...baseParams, horsePower: 101 })
    expect(r.baseRate).toBe(25)
  })

  it('150 л.с. → ставка 35 (по верхней границе)', () => {
    const r = calculateTransport({ ...baseParams, horsePower: 150 })
    expect(r.baseRate).toBe(35)
  })

  it('151 л.с. → ставка 45', () => {
    const r = calculateTransport({ ...baseParams, horsePower: 151 })
    expect(r.baseRate).toBe(45)
  })

  it('251 л.с. → ставка 150', () => {
    const r = calculateTransport({ ...baseParams, horsePower: 251 })
    expect(r.baseRate).toBe(150)
    expect(r.annualTax).toBe(251 * 150)
  })

  it('luxury коэффициент применяется', () => {
    const plain = calculateTransport({ ...baseParams, horsePower: 300 })
    const luxury = calculateTransport({ ...baseParams, horsePower: 300, luxuryCoeff: 3 })
    expect(luxury.annualTax).toBeCloseTo(plain.annualTax * 3, 4)
  })

  it('налог за 6 месяцев = половина годового', () => {
    const full = calculateTransport({ ...baseParams, horsePower: 200 })
    const half = calculateTransport({ ...baseParams, horsePower: 200, monthsOwned: 6 })
    expect(half.actualTax).toBeCloseTo(full.actualTax / 2, 4)
  })
})
