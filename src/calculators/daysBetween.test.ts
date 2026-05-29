import { describe, expect, it } from 'vitest'
import { calculateDaysBetween } from './daysBetween'

describe('calculateDaysBetween', () => {
  it('calculates days between two dates excluding end date', () => {
    const result = calculateDaysBetween({ start: '2026-01-01', end: '2026-01-10', includeEndDate: false })

    expect(result.days).toBe(9)
    expect(result.weeks).toBe(1)
    expect(result.remainingDays).toBe(2)
    expect(result.direction).toBe('forward')
  })

  it('can include end date', () => {
    const result = calculateDaysBetween({ start: '2026-01-01', end: '2026-01-10', includeEndDate: true })

    expect(result.days).toBe(10)
  })

  it('handles reversed dates', () => {
    const result = calculateDaysBetween({ start: '2026-01-10', end: '2026-01-01', includeEndDate: false })

    expect(result.days).toBe(9)
    expect(result.direction).toBe('backward')
  })

  it('does not add one day for same date', () => {
    const result = calculateDaysBetween({ start: '2026-01-01', end: '2026-01-01', includeEndDate: true })

    expect(result.days).toBe(0)
    expect(result.direction).toBe('same')
  })

  it('ignores invalid dates', () => {
    const result = calculateDaysBetween({ start: 'bad', end: '2026-01-01', includeEndDate: false })

    expect(result.days).toBe(0)
  })
})
