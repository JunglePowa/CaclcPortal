import { describe, expect, it } from 'vitest'
import { calculateTimeBetween } from './timeBetween'

describe('calculateTimeBetween', () => {
  it('calculates days hours and minutes between date-times', () => {
    const result = calculateTimeBetween({
      startDate: '2026-05-01',
      startHour: 10,
      startMinute: 30,
      endDate: '2026-05-03',
      endHour: 12,
      endMinute: 45,
    })

    expect(result.days).toBe(2)
    expect(result.hours).toBe(2)
    expect(result.minutes).toBe(15)
    expect(result.totalMinutes).toBe(3015)
  })

  it('marks backward range', () => {
    const result = calculateTimeBetween({
      startDate: '2026-05-03',
      startHour: 12,
      startMinute: 0,
      endDate: '2026-05-01',
      endHour: 12,
      endMinute: 0,
    })

    expect(result.direction).toBe('backward')
    expect(result.days).toBe(2)
  })
})
