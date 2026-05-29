import { describe, expect, it } from 'vitest'
import { calculatePercent } from './percent'

const params = {
  value: 200,
  percent: 15,
  base: 100,
  changed: 125,
  part: 30,
  whole: 120,
}

describe('calculatePercent', () => {
  it('finds percent of number', () => {
    expect(calculatePercent('percentOfNumber', params).result).toBeCloseTo(30, 4)
  })

  it('adds percent to number', () => {
    expect(calculatePercent('addPercent', params).result).toBeCloseTo(230, 4)
  })

  it('subtracts percent from number', () => {
    expect(calculatePercent('subtractPercent', params).result).toBeCloseTo(170, 4)
  })

  it('calculates percentage change', () => {
    expect(calculatePercent('percentageChange', params).result).toBeCloseTo(25, 4)
  })

  it('calculates what percent one number is of another', () => {
    expect(calculatePercent('whatPercent', params).result).toBeCloseTo(25, 4)
  })

  it('returns zero for division by zero modes', () => {
    expect(calculatePercent('percentageChange', { ...params, base: 0 }).result).toBe(0)
    expect(calculatePercent('whatPercent', { ...params, whole: 0 }).result).toBe(0)
  })
})
