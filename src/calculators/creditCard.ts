export interface CreditCardParams {
  debt: number
  annualRate: number
  monthlyPayment: number
}

export interface CreditCardResult {
  months: number
  totalPaid: number
  totalInterest: number
  lastPayment: number
  isPayoffPossible: boolean
}

const positive = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0)

export function calculateCreditCard(params: CreditCardParams): CreditCardResult {
  let balance = positive(params.debt)
  const monthlyRate = positive(params.annualRate) / 100 / 12
  const monthlyPayment = positive(params.monthlyPayment)

  if (balance === 0) {
    return { months: 0, totalPaid: 0, totalInterest: 0, lastPayment: 0, isPayoffPossible: true }
  }

  if (monthlyPayment <= 0 || (monthlyRate > 0 && monthlyPayment <= balance * monthlyRate)) {
    return { months: 0, totalPaid: 0, totalInterest: 0, lastPayment: 0, isPayoffPossible: false }
  }

  let months = 0
  let totalPaid = 0
  let totalInterest = 0
  let lastPayment = 0

  while (balance > 0.005 && months < 1200) {
    const interest = balance * monthlyRate
    balance += interest
    const payment = Math.min(monthlyPayment, balance)
    balance -= payment
    months += 1
    totalInterest += interest
    totalPaid += payment
    lastPayment = payment
  }

  return {
    months,
    totalPaid,
    totalInterest,
    lastPayment,
    isPayoffPossible: months < 1200,
  }
}
