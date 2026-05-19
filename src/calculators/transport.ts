// Ставки по умолчанию (московские ставки как распространённые)
const BASE_RATES: { maxPower: number; rate: number }[] = [
  { maxPower: 100, rate: 12 },
  { maxPower: 125, rate: 25 },
  { maxPower: 150, rate: 35 },
  { maxPower: 175, rate: 45 },
  { maxPower: 200, rate: 50 },
  { maxPower: 225, rate: 65 },
  { maxPower: 250, rate: 75 },
  { maxPower: Infinity, rate: 150 },
]

export interface TransportParams {
  horsePower: number   // л.с.
  monthsOwned: number  // месяцев владения (1-12)
  regionRate: number   // региональный коэффициент (1.0 по умолчанию)
  luxuryCoeff: number  // повышающий коэффициент (1.0, 1.1, 1.3, 3.0)
}

export interface TransportResult {
  baseRate: number      // базовая ставка ₽/л.с.
  annualTax: number     // налог за полный год
  actualTax: number     // налог за период владения
}

export function calculateTransport(params: TransportParams): TransportResult {
  const horsePower = Number.isFinite(params.horsePower) ? Math.max(0, params.horsePower) : 0
  const monthsOwned = Number.isFinite(params.monthsOwned) ? Math.min(12, Math.max(0, params.monthsOwned)) : 0
  const regionRate = Number.isFinite(params.regionRate) ? Math.max(0, params.regionRate) : 0
  const luxuryCoeff = Number.isFinite(params.luxuryCoeff) ? Math.max(0, params.luxuryCoeff) : 0
  const tier = BASE_RATES.find(r => horsePower <= r.maxPower) ?? BASE_RATES[BASE_RATES.length - 1]
  const baseRate = tier.rate * regionRate
  const annualTax = horsePower * baseRate * luxuryCoeff
  const actualTax = annualTax * (monthsOwned / 12)
  return { baseRate, annualTax, actualTax }
}
