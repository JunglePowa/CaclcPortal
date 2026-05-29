export interface DiscountParams {
  originalPrice: number
  discountPercent: number
}

export interface DiscountResult {
  discountAmount: number
  finalPrice: number
  savingsPercent: number
}

const positive = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0)

export function calculateDiscount(params: DiscountParams): DiscountResult {
  const originalPrice = positive(params.originalPrice)
  const discountPercent = Math.min(100, positive(params.discountPercent))
  const discountAmount = originalPrice * (discountPercent / 100)
  const finalPrice = originalPrice - discountAmount

  return {
    discountAmount,
    finalPrice,
    savingsPercent: originalPrice > 0 ? (discountAmount / originalPrice) * 100 : 0,
  }
}
