import { describe, it, expect } from 'vitest'
import { calculateImt } from './imt'

const base = { height: 170, age: 30, sex: 'male' as const }

describe('calculateImt', () => {
  it('ИМТ считается верно: 70 кг при 170 см ≈ 24.22', () => {
    const r = calculateImt({ ...base, weight: 70 })
    expect(r.bmi).toBeCloseTo(24.22, 1)
  })

  it('категория Норма для ИМТ в [18.5, 25)', () => {
    const r = calculateImt({ ...base, weight: 65 })
    expect(r.category).toBe('Норма')
  })

  it('граница 18.5 → Норма (не Дефицит)', () => {
    // weight = 18.5 * 1.7^2 = 53.465
    const r = calculateImt({ ...base, weight: 18.5 * 1.7 * 1.7 })
    expect(r.bmi).toBeCloseTo(18.5, 4)
    expect(r.category).toBe('Норма')
  })

  it('граница 25 → Избыточный вес', () => {
    const r = calculateImt({ ...base, weight: 25 * 1.7 * 1.7 })
    expect(r.bmi).toBeCloseTo(25, 4)
    expect(r.category).toBe('Избыточный вес')
  })

  it('граница 30 → Ожирение I', () => {
    const r = calculateImt({ ...base, weight: 30 * 1.7 * 1.7 })
    expect(r.category).toBe('Ожирение I степени')
  })

  it('граница 40 → Ожирение III', () => {
    const r = calculateImt({ ...base, weight: 40 * 1.7 * 1.7 })
    expect(r.category).toBe('Ожирение III степени')
  })

  it('идеальный вес: ideal min < weight < ideal max при норме', () => {
    const r = calculateImt({ ...base, weight: 65 })
    expect(r.idealWeightMin).toBeLessThan(r.idealWeightMax)
    expect(r.idealWeightMin).toBeLessThanOrEqual(65)
    expect(r.idealWeightMax).toBeGreaterThanOrEqual(65)
  })
})
