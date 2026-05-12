export interface VkladParams {
  initialAmount: number
  monthlyReplenishment: number
  annualRate: number
  termMonths: number
  capitalizationPerYear: number
  taxRate: number
  currency: string
}

export interface VkladMonthRow {
  month: number
  replenishment: number
  interest: number
  balance: number
}

export interface VkladResult {
  finalAmount: number
  totalReplenishments: number
  grossInterest: number
  taxPaid: number
  netInterest: number
  effectiveRate: number
  schedule: VkladMonthRow[]
}

export function calculateVklad(params: VkladParams): VkladResult {
  const { initialAmount, monthlyReplenishment, annualRate, termMonths, taxRate } = params

  const monthlyRate = annualRate / 100 / 12

  let balance = initialAmount
  let grossInterest = 0
  const schedule: VkladMonthRow[] = []

  // Накапливаем gross-баланс и gross-проценты помесячно.
  // Налог удерживаем один раз в конце с накопленных процентов — без двойного учёта.
  for (let month = 1; month <= termMonths; month++) {
    const replenishment = month === 1 ? 0 : monthlyReplenishment
    balance += replenishment

    const monthInterest = balance * monthlyRate
    grossInterest += monthInterest
    balance += monthInterest

    schedule.push({ month, replenishment, interest: monthInterest, balance })
  }

  const taxPaid = grossInterest * (taxRate / 100)
  const netInterest = grossInterest - taxPaid
  const totalReplenishments = monthlyReplenishment * (termMonths - 1)

  const effectiveRate = Math.pow(1 + monthlyRate, 12) - 1

  // finalAmount = initialAmount + totalReplenishments + netInterest (по инварианту)
  const finalAmount = initialAmount + totalReplenishments + netInterest

  return {
    finalAmount,
    totalReplenishments,
    grossInterest,
    taxPaid,
    netInterest,
    effectiveRate,
    schedule,
  }
}
