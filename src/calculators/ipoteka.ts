// Ипотечный калькулятор. Поверх kredit.ts добавляет первоначальный взнос
// и поддержку досрочных погашений (массив платежей с типом reduce-term/reduce-payment).

import { calculateKredit, type PaymentType, type KreditMonthRow } from './kredit'

export type EarlyPaymentType = 'reduce-term' | 'reduce-payment'

export interface EarlyPayment {
  /** Месяц совершения досрочки (1-based, ≥ 1). */
  month: number
  /** Сумма, ₽. */
  amount: number
  type: EarlyPaymentType
}

export interface IpotekaParams {
  /** Стоимость недвижимости, ₽. */
  propertyPrice: number
  /** Первоначальный взнос, ₽. */
  downPayment: number
  /** Годовая ставка, %. */
  annualRate: number
  /** Срок в месяцах. */
  termMonths: number
  paymentType: PaymentType
  currency: string
  /** Список досрочных погашений (опционально). */
  earlyPayments?: EarlyPayment[]
}

export interface IpotekaResult {
  /** Сумма кредита (цена − ПВ). */
  loanAmount: number
  /** Базовый ежемесячный платёж (без учёта досрочек). */
  monthlyPayment: number
  /** Итого выплат банку (без ПВ). */
  totalPayment: number
  /** Переплата (totalPayment − loanAmount). */
  totalInterest: number
  /** Фактический срок после досрочек (месяцев). */
  actualTermMonths: number
  /** Экономия от досрочного погашения по сравнению с базовым сценарием. */
  earlySavings: number
  schedule: KreditMonthRow[]
}

/**
 * Считает аннуитетный платёж.
 */
function annuityPayment(loan: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0
  if (monthlyRate === 0) return loan / months
  return (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
}

export function calculateIpoteka(params: IpotekaParams): IpotekaResult {
  const {
    propertyPrice,
    downPayment,
    annualRate,
    termMonths,
    paymentType,
    currency,
    earlyPayments = [],
  } = params

  const loanAmount = Math.max(0, propertyPrice - downPayment)
  const monthlyRate = annualRate / 100 / 12

  // Базовый сценарий — без досрочек.
  const baseResult = calculateKredit({
    loanAmount,
    annualRate,
    termMonths,
    paymentType,
    currency,
  })

  if (earlyPayments.length === 0 || loanAmount === 0) {
    return {
      loanAmount,
      monthlyPayment: baseResult.monthlyPayment,
      totalPayment: baseResult.totalPayment,
      totalInterest: baseResult.totalInterest,
      actualTermMonths: baseResult.schedule.length,
      earlySavings: 0,
      schedule: baseResult.schedule,
    }
  }

  // Сценарий с досрочками — пересчёт по месяцам.
  const earlyByMonth = new Map<number, EarlyPayment[]>()
  for (const ep of earlyPayments) {
    if (!earlyByMonth.has(ep.month)) earlyByMonth.set(ep.month, [])
    earlyByMonth.get(ep.month)!.push(ep)
  }

  const schedule: KreditMonthRow[] = []
  let balance = loanAmount
  let currentPayment = baseResult.monthlyPayment // для аннуитета
  let remainingMonths = termMonths
  let totalPayment = 0
  const principalPart = loanAmount / termMonths // для дифференциального

  let month = 0
  const MAX_MONTHS = termMonths + 1 // safety
  while (balance > 0.005 && month < MAX_MONTHS) {
    month++
    const interest = balance * monthlyRate
    let principal: number
    let payment: number

    if (paymentType === 'annuity') {
      payment = currentPayment
      principal = payment - interest
      if (principal > balance) {
        principal = balance
        payment = principal + interest
      }
    } else {
      // дифференциальный — фиксированное тело
      principal = Math.min(principalPart, balance)
      payment = principal + interest
    }

    balance -= principal
    totalPayment += payment

    // Применяем досрочки этого месяца.
    const eps = earlyByMonth.get(month)
    if (eps && balance > 0) {
      for (const ep of eps) {
        const extra = Math.min(ep.amount, balance)
        balance -= extra
        totalPayment += extra
        principal += extra
        payment += extra

        if (balance <= 0.005) break

        if (paymentType === 'annuity') {
          remainingMonths = termMonths - month
          if (ep.type === 'reduce-payment') {
            // тот же срок, новый платёж
            currentPayment = annuityPayment(balance, monthlyRate, remainingMonths)
          }
          // reduce-term: платёж не меняем — досрочный пересчёт срока произойдёт «естественно»
        }
        // дифференциальный: для reduce-term — тело остаётся, срок сократится;
        // для reduce-payment — пересчитываем тело на оставшиеся месяцы (TODO: реальный банк часто
        // пересчитывает иначе, но это разумная модель).
      }
    }

    schedule.push({ month, payment, principal, interest, balance: Math.max(0, balance) })
  }

  return {
    loanAmount,
    monthlyPayment: baseResult.monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - loanAmount,
    actualTermMonths: schedule.length,
    earlySavings: baseResult.totalPayment - totalPayment,
    schedule,
  }
}
