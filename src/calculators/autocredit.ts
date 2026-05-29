import { calculateKredit } from './kredit'

export interface AutocreditParams {
  carPrice: number
  downPayment: number
  annualRate: number
  termMonths: number
}

export interface AutocreditResult {
  loanAmount: number
  downPaymentPercent: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  totalCarCost: number
}

const positive = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0)

export function calculateAutocredit(params: AutocreditParams): AutocreditResult {
  const carPrice = positive(params.carPrice)
  const downPayment = Math.min(carPrice, positive(params.downPayment))
  const termMonths = Math.max(1, Math.round(positive(params.termMonths)))
  const annualRate = positive(params.annualRate)
  const loanAmount = Math.max(0, carPrice - downPayment)
  const kredit = calculateKredit({
    loanAmount,
    annualRate,
    termMonths,
    paymentType: 'annuity',
    currency: 'RUB',
  })

  return {
    loanAmount,
    downPaymentPercent: carPrice > 0 ? (downPayment / carPrice) * 100 : 0,
    monthlyPayment: kredit.monthlyPayment,
    totalPayment: kredit.totalPayment,
    totalInterest: kredit.totalInterest,
    totalCarCost: downPayment + kredit.totalPayment,
  }
}
