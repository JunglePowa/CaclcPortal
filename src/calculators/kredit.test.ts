import { describe, it, expect } from 'vitest'
import { calculateKredit, type KreditParams } from './kredit'

const base: KreditParams = {
  loanAmount: 1000000,
  annualRate: 12,
  termMonths: 24,
  paymentType: 'annuity',
  currency: 'RUB',
}

describe('calculateKredit — аннуитет', () => {
  it('платёж по формуле PMT', () => {
    const r = calculateKredit(base)
    const m = 0.12 / 12
    const expected = (1000000 * m * Math.pow(1 + m, 24)) / (Math.pow(1 + m, 24) - 1)
    expect(r.monthlyPayment).toBeCloseTo(expected, 2)
  })

  it('сумма всех платежей > principal', () => {
    const r = calculateKredit(base)
    expect(r.totalPayment).toBeGreaterThan(base.loanAmount)
    expect(r.totalInterest).toBeGreaterThan(0)
  })

  it('нулевая ставка → равные платежи без процентов', () => {
    const r = calculateKredit({ ...base, annualRate: 0 })
    expect(r.monthlyPayment).toBeCloseTo(base.loanAmount / 24, 4)
    expect(r.totalInterest).toBeCloseTo(0, 4)
  })

  it('расписание длиной termMonths и баланс к концу = 0', () => {
    const r = calculateKredit(base)
    expect(r.schedule).toHaveLength(24)
    expect(r.schedule[r.schedule.length - 1].balance).toBeCloseTo(0, 2)
  })
})

describe('calculateKredit — дифференциальный', () => {
  it('первый платёж больше последнего', () => {
    const r = calculateKredit({ ...base, paymentType: 'differential' })
    expect(r.schedule[0].payment).toBeGreaterThan(r.schedule[r.schedule.length - 1].payment)
  })

  it('сумма всех платежей > principal', () => {
    const r = calculateKredit({ ...base, paymentType: 'differential' })
    expect(r.totalPayment).toBeGreaterThan(base.loanAmount)
  })

  it('тело платежа постоянно', () => {
    const r = calculateKredit({ ...base, paymentType: 'differential' })
    const first = r.schedule[0].principal
    r.schedule.forEach(row => expect(row.principal).toBeCloseTo(first, 4))
  })
})
