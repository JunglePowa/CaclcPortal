export interface OtpuskParams {
  income: number
  months: number
  vacationDays: number
  excludedDays: number
  ndflRate: number
}

export interface OtpuskResult {
  calculationDays: number
  averageDailyEarnings: number
  grossVacationPay: number
  ndfl: number
  netVacationPay: number
}

const AVERAGE_MONTH_DAYS = 29.3

function positive(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

export function calculateOtpusk(params: OtpuskParams): OtpuskResult {
  const income = positive(params.income)
  const months = Math.min(12, Math.max(1, positive(params.months)))
  const vacationDays = positive(params.vacationDays)
  const maxCalculationDays = months * AVERAGE_MONTH_DAYS
  const excludedDays = Math.min(maxCalculationDays, positive(params.excludedDays))
  const ndflRate = Math.min(100, positive(params.ndflRate))

  const calculationDays = Math.max(1, maxCalculationDays - excludedDays)
  const averageDailyEarnings = income / calculationDays
  const grossVacationPay = averageDailyEarnings * vacationDays
  const ndfl = grossVacationPay * (ndflRate / 100)
  const netVacationPay = grossVacationPay - ndfl

  return {
    calculationDays,
    averageDailyEarnings,
    grossVacationPay,
    ndfl,
    netVacationPay,
  }
}
