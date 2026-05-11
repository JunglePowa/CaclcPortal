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
  const { horsePower, monthsOwned, regionRate, luxuryCoeff } = params
  const tier = BASE_RATES.find(r => horsePower <= r.maxPower) ?? BASE_RATES[BASE_RATES.length - 1]
  const baseRate = tier.rate * regionRate
  const annualTax = horsePower * baseRate * luxuryCoeff
  const actualTax = annualTax * (monthsOwned / 12)
  return { baseRate, annualTax, actualTax }
}
