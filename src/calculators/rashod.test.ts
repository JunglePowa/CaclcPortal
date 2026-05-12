import { describe, it, expect } from 'vitest'
import { calculateRashod } from './rashod'

describe('calculateRashod', () => {
  it('50 л на 500 км → 10 л/100км', () => {
    const r = calculateRashod({ fuelConsumed: 50, distance: 500, fuelPrice: 60 })
    expect(r.per100km).toBeCloseTo(10, 4)
  })

  it('totalCost = fuelConsumed * fuelPrice', () => {
    const r = calculateRashod({ fuelConsumed: 50, distance: 500, fuelPrice: 60 })
    expect(r.totalCost).toBeCloseTo(50 * 60, 4)
  })

  it('costPerKm = totalCost / distance', () => {
    const r = calculateRashod({ fuelConsumed: 40, distance: 400, fuelPrice: 55 })
    expect(r.costPerKm).toBeCloseTo((40 * 55) / 400, 4)
  })

  it('costPer100km согласован с per100km и ценой', () => {
    const r = calculateRashod({ fuelConsumed: 30, distance: 600, fuelPrice: 50 })
    expect(r.costPer100km).toBeCloseTo(r.per100km * 50, 4)
  })

  it('distance=0 → нули', () => {
    const r = calculateRashod({ fuelConsumed: 50, distance: 0, fuelPrice: 60 })
    expect(r.per100km).toBe(0)
    expect(r.totalCost).toBe(0)
    expect(r.costPerKm).toBe(0)
  })
})
