import { describe, expect, it } from 'vitest'
import { calculateDateAdd } from './dateAdd'

describe('calculateDateAdd', () => {
  it('adds years months and days', () => {
    const result = calculateDateAdd({ start: '2026-01-10', years: 1, months: 2, days: 5 })

    expect(result.date).toBe('2027-03-15')
    expect(result.isValid).toBe(true)
  })

  it('clamps end of month while adding months', () => {
    const result = calculateDateAdd({ start: '2026-01-31', years: 0, months: 1, days: 0 })

    expect(result.date).toBe('2026-02-28')
  })
})
