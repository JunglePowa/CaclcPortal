import { describe, expect, it } from 'vitest'
import { calculateDiscount } from './discount'

describe('calculateDiscount', () => {
  it('calculates discount amount and final price', () => {
    const result = calculateDiscount({ originalPrice: 5000, discountPercent: 20 })

    expect(result.discountAmount).toBe(1000)
    expect(result.finalPrice).toBe(4000)
    expect(result.savingsPercent).toBe(20)
  })

  it('caps discount at 100 percent', () => {
    const result = calculateDiscount({ originalPrice: 5000, discountPercent: 120 })

    expect(result.discountAmount).toBe(5000)
    expect(result.finalPrice).toBe(0)
  })
})
