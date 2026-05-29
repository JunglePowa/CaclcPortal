import { describe, expect, it } from 'vitest'
import { calculateStazh } from './stazh'

describe('calculateStazh', () => {
  it('calculates inclusive days for one period', () => {
    const result = calculateStazh([{ start: '2026-01-01', end: '2026-01-10' }])

    expect(result.totalDays).toBe(10)
    expect(result.mergedPeriods).toHaveLength(1)
  })

  it('merges overlapping periods', () => {
    const result = calculateStazh([
      { start: '2026-01-01', end: '2026-01-10' },
      { start: '2026-01-05', end: '2026-01-20' },
    ])

    expect(result.totalDays).toBe(20)
    expect(result.mergedPeriods).toEqual([{ start: '2026-01-01', end: '2026-01-20', days: 20 }])
  })

  it('keeps separate periods when there is a gap', () => {
    const result = calculateStazh([
      { start: '2026-01-01', end: '2026-01-10' },
      { start: '2026-02-01', end: '2026-02-10' },
    ])

    expect(result.totalDays).toBe(20)
    expect(result.mergedPeriods).toHaveLength(2)
  })

  it('normalizes reversed dates', () => {
    const result = calculateStazh([{ start: '2026-01-10', end: '2026-01-01' }])

    expect(result.totalDays).toBe(10)
    expect(result.mergedPeriods[0]).toMatchObject({ start: '2026-01-01', end: '2026-01-10' })
  })

  it('ignores invalid periods', () => {
    const result = calculateStazh([{ start: 'bad', end: '2026-01-01' }])

    expect(result.totalDays).toBe(0)
    expect(result.mergedPeriods).toHaveLength(0)
  })
})
