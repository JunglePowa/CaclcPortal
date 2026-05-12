import { describe, it, expect } from 'vitest'
import { calculateBeremennost } from './beremennost'

function isoMinusDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function isoPlusDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

describe('calculateBeremennost', () => {
  it('возвращает null при пустой дате', () => {
    expect(calculateBeremennost({ lastPeriodDate: '', cycleLength: 28 })).toBeNull()
  })

  it('LMP 70 дней назад → ~10 неделя, currentDay в 1..7', () => {
    const r = calculateBeremennost({ lastPeriodDate: isoMinusDays(70), cycleLength: 28 })!
    expect(r).not.toBeNull()
    expect(r.currentWeek).toBe(10)
    expect(r.currentDay).toBeGreaterThanOrEqual(1)
    expect(r.currentDay).toBeLessThanOrEqual(7)
  })

  it('Негеле: ПДР через ~210 дней при LMP 70 дней назад (280 - 70)', () => {
    const r = calculateBeremennost({ lastPeriodDate: isoMinusDays(70), cycleLength: 28 })!
    expect(r.daysLeft).toBeGreaterThanOrEqual(208)
    expect(r.daysLeft).toBeLessThanOrEqual(212)
  })

  it('коррекция цикла: длиннее цикл → ПДР позже', () => {
    const r28 = calculateBeremennost({ lastPeriodDate: isoMinusDays(70), cycleLength: 28 })!
    const r35 = calculateBeremennost({ lastPeriodDate: isoMinusDays(70), cycleLength: 35 })!
    expect(r35.daysLeft).toBeGreaterThan(r28.daysLeft)
  })

  it('триместры: 5 нед → 1, 20 нед → 2, 35 нед → 3', () => {
    const r1 = calculateBeremennost({ lastPeriodDate: isoMinusDays(5 * 7), cycleLength: 28 })!
    expect(r1.trimester).toBe(1)
    const r2 = calculateBeremennost({ lastPeriodDate: isoMinusDays(20 * 7), cycleLength: 28 })!
    expect(r2.trimester).toBe(2)
    const r3 = calculateBeremennost({ lastPeriodDate: isoMinusDays(35 * 7), cycleLength: 28 })!
    expect(r3.trimester).toBe(3)
  })

  it('LMP в будущем: notYetPregnant=true, currentWeek=0, currentDay=0', () => {
    const r = calculateBeremennost({ lastPeriodDate: isoPlusDays(10), cycleLength: 28 })!
    expect(r.notYetPregnant).toBe(true)
    expect(r.currentWeek).toBe(0)
    expect(r.currentDay).toBe(0)
  })

  it('currentDay никогда не отрицательный', () => {
    const r = calculateBeremennost({ lastPeriodDate: isoMinusDays(0), cycleLength: 28 })!
    expect(r.currentDay).toBeGreaterThanOrEqual(0)
  })
})
