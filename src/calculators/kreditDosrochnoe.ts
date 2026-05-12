// Калькулятор досрочного погашения кредита.
// Сравнивает 2 сценария: без досрочки и с одной досрочкой в указанный месяц.

export type EarlyType = 'reduce-term' | 'reduce-payment'

export interface DosrochnoeParams {
  /** Текущий остаток долга, ₽. */
  balance: number
  /** Годовая ставка, %. */
  annualRate: number
  /** Оставшийся срок, месяцев. */
  remainingMonths: number
  /** Сумма досрочного платежа, ₽. */
  earlyAmount: number
  /** Тип досрочки. */
  earlyType: EarlyType
  /** Месяц совершения досрочки (1-based), по умолчанию 1 = «сейчас». */
  earlyMonth?: number
}

export interface DosrochnoeMonthRow {
  month: number
  /** Остаток в сценарии без досрочки. */
  balanceWithout: number
  /** Остаток в сценарии с досрочкой. */
  balanceWith: number
}

export interface DosrochnoeResult {
  /** Текущий аннуитетный платёж (рассчитан из balance/rate/remainingMonths). */
  currentPayment: number
  /** Без досрочки: общая сумма выплат. */
  totalWithout: number
  /** Без досрочки: проценты. */
  interestWithout: number
  /** С досрочкой: общая сумма выплат (включая досрочную сумму). */
  totalWith: number
  /** С досрочкой: проценты. */
  interestWith: number
  /** Экономия = разница в процентах (interestWithout − interestWith). */
  savings: number
  /** Новый срок (для reduce-term), месяцев. Для reduce-payment = remainingMonths. */
  newTermMonths: number
  /** Новый платёж (для reduce-payment). Для reduce-term = currentPayment. */
  newPayment: number
  /** График остатков. */
  schedule: DosrochnoeMonthRow[]
}

function annuityPayment(loan: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0
  if (monthlyRate === 0) return loan / months
  return (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
}

interface SimResult {
  totalPayment: number
  totalInterest: number
  monthsUsed: number
  finalPayment: number
  balanceByMonth: number[] // [0..N], indexed by month (0 = initial)
}

/**
 * Симулирует выплату аннуитетного кредита по месяцам.
 * Если задан early — применяет досрочку в указанном месяце.
 */
function simulate(
  balance: number,
  monthlyRate: number,
  months: number,
  early?: { month: number; amount: number; type: EarlyType },
): SimResult {
  const initialPayment = annuityPayment(balance, monthlyRate, months)
  let payment = initialPayment
  let bal = balance
  let totalPayment = 0
  let totalInterest = 0
  let plannedMonths = months
  const balanceByMonth: number[] = [bal]

  let month = 0
  const MAX = months + 12
  while (bal > 0.005 && month < MAX) {
    month++
    const interest = bal * monthlyRate
    let principal = payment - interest
    if (principal > bal) {
      principal = bal
    }
    bal -= principal
    const actualPayment = principal + interest
    totalPayment += actualPayment
    totalInterest += interest

    // Применяем досрочку в этом месяце.
    if (early && early.month === month && bal > 0) {
      const extra = Math.min(early.amount, bal)
      bal -= extra
      totalPayment += extra
      if (bal > 0.005) {
        if (early.type === 'reduce-payment') {
          const remaining = plannedMonths - month
          if (remaining > 0) {
            payment = annuityPayment(bal, monthlyRate, remaining)
          }
        }
        // reduce-term: оставляем платёж, срок сократится естественно.
      }
    }

    balanceByMonth.push(Math.max(0, bal))
  }

  return {
    totalPayment,
    totalInterest,
    monthsUsed: month,
    finalPayment: payment,
    balanceByMonth,
  }
}

export function calculateDosrochnoe(params: DosrochnoeParams): DosrochnoeResult {
  const {
    balance,
    annualRate,
    remainingMonths,
    earlyAmount,
    earlyType,
    earlyMonth = 1,
  } = params

  const monthlyRate = annualRate / 100 / 12
  const currentPayment = annuityPayment(balance, monthlyRate, remainingMonths)

  const without = simulate(balance, monthlyRate, remainingMonths)
  const with_ =
    earlyAmount > 0
      ? simulate(balance, monthlyRate, remainingMonths, {
          month: earlyMonth,
          amount: earlyAmount,
          type: earlyType,
        })
      : without

  // Собираем график (выровненные по длине без+с).
  const len = Math.max(without.balanceByMonth.length, with_.balanceByMonth.length)
  const schedule: DosrochnoeMonthRow[] = []
  for (let i = 0; i < len; i++) {
    schedule.push({
      month: i,
      balanceWithout: i < without.balanceByMonth.length ? without.balanceByMonth[i] : 0,
      balanceWith: i < with_.balanceByMonth.length ? with_.balanceByMonth[i] : 0,
    })
  }

  const newTermMonths =
    earlyType === 'reduce-term' && earlyAmount > 0 ? with_.monthsUsed : remainingMonths
  const newPayment =
    earlyType === 'reduce-payment' && earlyAmount > 0 ? with_.finalPayment : currentPayment

  return {
    currentPayment,
    totalWithout: without.totalPayment,
    interestWithout: without.totalInterest,
    totalWith: with_.totalPayment,
    interestWith: with_.totalInterest,
    savings: without.totalInterest - with_.totalInterest,
    newTermMonths,
    newPayment,
    schedule,
  }
}
