export type PaymentType = 'annuity' | 'differential'

export interface KreditParams {
  loanAmount: number
  annualRate: number
  termMonths: number
  paymentType: PaymentType
  currency: string
}

export interface KreditMonthRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface KreditResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  schedule: KreditMonthRow[]
}

export function calculateKredit(params: KreditParams): KreditResult {
  const { loanAmount, annualRate, termMonths, paymentType } = params
  const monthlyRate = annualRate / 100 / 12

  const schedule: KreditMonthRow[] = []
  let balance = loanAmount

  if (paymentType === 'annuity') {
    const monthlyPayment = monthlyRate === 0
      ? loanAmount / termMonths
      : loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)
        / (Math.pow(1 + monthlyRate, termMonths) - 1)

    for (let month = 1; month <= termMonths; month++) {
      const interest = balance * monthlyRate
      const principal = monthlyPayment - interest
      balance = Math.max(0, balance - principal)
      schedule.push({ month, payment: monthlyPayment, principal, interest, balance })
    }

    const totalPayment = monthlyPayment * termMonths
    return {
      monthlyPayment,
      totalPayment,
      totalInterest: totalPayment - loanAmount,
      schedule,
    }
  } else {
    const principalPart = loanAmount / termMonths
    let totalPayment = 0

    for (let month = 1; month <= termMonths; month++) {
      const interest = balance * monthlyRate
      const payment = principalPart + interest
      balance = Math.max(0, balance - principalPart)
      totalPayment += payment
      schedule.push({ month, payment, principal: principalPart, interest, balance })
    }

    return {
      monthlyPayment: schedule[0].payment,
      totalPayment,
      totalInterest: totalPayment - loanAmount,
      schedule,
    }
  }
}
