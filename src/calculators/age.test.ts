import { describe, expect, it } from 'vitest'
import { calculateAge } from './age'

describe('calculateAge', () => {
  it('calculates full age', () => {
    const result = calculateAge({ birthDate: '2000-01-15', targetDate: '2026-05-29' })

    expect(result.years).toBe(26)
    expect(result.months).toBe(4)
    expect(result.days).toBe(14)
  })

  it('handles target before birthday in year', () => {
    const result = calculateAge({ birthDate: '2000-12-31', targetDate: '2026-01-01' })

    expect(result.years).toBe(25)
    expect(result.months).toBe(0)
    expect(result.days).toBe(1)
  })
})
