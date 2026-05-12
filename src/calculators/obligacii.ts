// Калькулятор облигаций: купонный доход, доходность к погашению (YTM),
// текущая доходность и простая доходность за весь срок.

export interface ObligaciiParams {
  /** Номинал облигации, ₽ (обычно 1000). */
  faceValue: number
  /** Цена покупки, % от номинала (например 98.5). */
  buyPricePercent: number
  /** Цена продажи / погашения, % от номинала (если держим до погашения — 100). */
  sellPricePercent: number
  /** Купонная ставка, % годовых от номинала. */
  couponRate: number
  /** Кол-во купонных выплат в год (1, 2, 4). */
  paymentsPerYear: number
  /** Срок до погашения в годах. */
  years: number
  /** Налог на купоны и прибыль, % (по умолчанию 13). */
  taxRate: number
}

export interface ObligaciiResult {
  /** Денежная цена покупки 1 облигации. */
  buyPrice: number
  /** Денежная цена продажи / погашения. */
  sellPrice: number
  /** Сумма всех купонных выплат за срок (без налога). */
  couponIncome: number
  /** Налог на купоны. */
  couponTax: number
  /** Капитальная прибыль (sellPrice − buyPrice), может быть отрицательной. */
  capitalGain: number
  /** Налог на капитальную прибыль (только если положительная). */
  capitalTax: number
  /** Чистый доход = (купоны − налог) + (капитал − налог). */
  netIncome: number
  /** Текущая доходность = годовой купон / цена покупки × 100. */
  currentYield: number
  /** Простая доходность за весь срок, % годовых = netIncome / buyPrice / years × 100. */
  simpleYield: number
  /** Доходность к погашению, % годовых (YTM, IRR денежного потока). */
  ytm: number
}

/** Купонный купон за один период. */
function couponPerPeriod(faceValue: number, couponRate: number, paymentsPerYear: number): number {
  return (faceValue * couponRate / 100) / paymentsPerYear
}

/**
 * Решает уравнение PV(r) = buyPrice, где
 *   PV(r) = Σ_{t=1..n} C/(1+r)^t + FV/(1+r)^n
 * Возвращает r — доходность за один период; затем умножаем на paymentsPerYear для годовой YTM.
 */
function solveYtmPerPeriod(
  buyPrice: number,
  sellPrice: number,
  coupon: number,
  totalPeriods: number,
): number {
  if (totalPeriods <= 0 || buyPrice <= 0) return 0

  // Если купон 0 и цены равны, доходность = 0.
  // Для бинарного поиска используем диапазон r ∈ [-0.5, 5] за период.
  const npv = (r: number): number => {
    if (r <= -1) return Number.POSITIVE_INFINITY
    let pv = 0
    for (let t = 1; t <= totalPeriods; t++) {
      pv += coupon / Math.pow(1 + r, t)
    }
    pv += sellPrice / Math.pow(1 + r, totalPeriods)
    return pv - buyPrice
  }

  let lo = -0.5
  let hi = 5
  let fLo = npv(lo)
  let fHi = npv(hi)

  // Если знаки одинаковы — расширяем верхнюю границу до 50, иначе 0.
  if (fLo * fHi > 0) {
    hi = 50
    fHi = npv(hi)
    if (fLo * fHi > 0) return 0
  }

  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2
    const f = npv(mid)
    if (Math.abs(f) < 1e-8) return mid
    if (f * fLo < 0) {
      hi = mid
      fHi = f
    } else {
      lo = mid
      fLo = f
    }
  }
  return (lo + hi) / 2
}

export function calculateObligacii(params: ObligaciiParams): ObligaciiResult {
  const {
    faceValue,
    buyPricePercent,
    sellPricePercent,
    couponRate,
    paymentsPerYear,
    years,
    taxRate,
  } = params

  const buyPrice = (faceValue * buyPricePercent) / 100
  const sellPrice = (faceValue * sellPricePercent) / 100
  const totalPeriods = Math.round(years * paymentsPerYear)
  const coupon = couponPerPeriod(faceValue, couponRate, paymentsPerYear)

  const couponIncome = coupon * totalPeriods
  const couponTax = (couponIncome * taxRate) / 100
  const capitalGain = sellPrice - buyPrice
  const capitalTax = capitalGain > 0 ? (capitalGain * taxRate) / 100 : 0

  const netIncome = couponIncome - couponTax + capitalGain - capitalTax

  const annualCoupon = (faceValue * couponRate) / 100
  const currentYield = buyPrice > 0 ? (annualCoupon / buyPrice) * 100 : 0
  const simpleYield = buyPrice > 0 && years > 0 ? (netIncome / buyPrice / years) * 100 : 0

  const rPerPeriod = solveYtmPerPeriod(buyPrice, sellPrice, coupon, totalPeriods)
  const ytm = rPerPeriod * paymentsPerYear * 100

  return {
    buyPrice,
    sellPrice,
    couponIncome,
    couponTax,
    capitalGain,
    capitalTax,
    netIncome,
    currentYield,
    simpleYield,
    ytm,
  }
}
