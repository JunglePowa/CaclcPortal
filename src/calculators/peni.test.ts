import { describe, it, expect } from 'vitest'
import { calculatePeni } from './peni'

const base = {
  debt: 100000,
  startDate: '2026-01-01',
  endDate: '2026-01-01',
  keyRate: 16,
  isIndividual: true,
}

describe('calculatePeni', () => {
  it('просрочка 0 дней → пени 0', () => {
    const r = calculatePeni(base)
    expect(r.days).toBe(0)
    expect(r.total).toBe(0)
  })

  it('нулевая недоимка → 0', () => {
    const r = calculatePeni({ ...base, debt: 0, endDate: '2026-03-01' })
    expect(r.total).toBe(0)
  })

  it('30 дней — физлицо и юрлицо платят одинаково (по 1/300)', () => {
    const a = calculatePeni({ ...base, isIndividual: true, endDate: '2026-01-31' })
    const b = calculatePeni({ ...base, isIndividual: false, endDate: '2026-01-31' })
    expect(a.days).toBe(30)
    expect(a.total).toBeCloseTo(b.total, 4)
  })

  it('60 дней — у юрлица пени больше (1/150 с 31-го дня)', () => {
    const a = calculatePeni({ ...base, isIndividual: true, endDate: '2026-03-02' })
    const b = calculatePeni({ ...base, isIndividual: false, endDate: '2026-03-02' })
    expect(b.total).toBeGreaterThan(a.total)
  })

  it('пени пропорциональны ставке ЦБ', () => {
    const a = calculatePeni({ ...base, keyRate: 10, endDate: '2026-02-01' })
    const b = calculatePeni({ ...base, keyRate: 20, endDate: '2026-02-01' })
    expect(b.total / a.total).toBeCloseTo(2, 4)
  })

  it('физлицо, 30 дней: пени = долг × ставка/100 × 30 / 300', () => {
    const r = calculatePeni({ ...base, endDate: '2026-01-31' })
    const expected = (100000 * 0.16 * 30) / 300
    expect(r.total).toBeCloseTo(expected, 4)
  })

  it('юрлицо в 2026, breakdown содержит три периода после 90 дней', () => {
    const r = calculatePeni({ ...base, isIndividual: false, endDate: '2026-04-15' })
    expect(r.breakdown).toHaveLength(3)
    expect(r.breakdown[1].fraction).toBeCloseTo(1 / 150, 6)
    expect(r.breakdown[2].fraction).toBeCloseTo(1 / 300, 6)
  })

  it('недоимка 2024 года для юрлица считается по 1/300 за весь период', () => {
    const r = calculatePeni({
      ...base,
      startDate: '2024-01-01',
      endDate: '2024-03-01',
      isIndividual: false,
    })
    expect(r.breakdown).toHaveLength(1)
    expect(r.breakdown[0].fraction).toBeCloseTo(1 / 300, 6)
  })
})
