import { describe, it, expect } from 'vitest'
import { calculateIpoteka, type IpotekaParams } from './ipoteka'
import { calculateKredit } from './kredit'

const base: IpotekaParams = {
  propertyPrice: 6_000_000,
  downPayment: 1_000_000,
  annualRate: 12,
  termMonths: 240,
  paymentType: 'annuity',
  currency: 'RUB',
}

describe('calculateIpoteka', () => {
  it('без досрочек = тот же результат что kredit', () => {
    const ip = calculateIpoteka(base)
    const kr = calculateKredit({
      loanAmount: 5_000_000,
      annualRate: base.annualRate,
      termMonths: base.termMonths,
      paymentType: base.paymentType,
      currency: base.currency,
    })
    expect(ip.monthlyPayment).toBeCloseTo(kr.monthlyPayment, 2)
    expect(ip.totalInterest).toBeCloseTo(kr.totalInterest, 2)
  })

  it('первоначальный взнос вычитается → loanAmount = price − downPayment', () => {
    const ip = calculateIpoteka(base)
    expect(ip.loanAmount).toBe(5_000_000)
  })

  it('одна досрочка reduce-term сокращает фактический срок', () => {
    const ip = calculateIpoteka({
      ...base,
      earlyPayments: [{ month: 12, amount: 500_000, type: 'reduce-term' }],
    })
    expect(ip.actualTermMonths).toBeLessThan(base.termMonths)
    expect(ip.earlySavings).toBeGreaterThan(0)
  })

  it('одна досрочка reduce-payment — срок не сокращается, платёж снижается', () => {
    const ip = calculateIpoteka({
      ...base,
      earlyPayments: [{ month: 12, amount: 500_000, type: 'reduce-payment' }],
    })
    // Срок остаётся прежним (или близким), но переплата меньше.
    expect(ip.actualTermMonths).toBe(base.termMonths)
    expect(ip.earlySavings).toBeGreaterThan(0)
    // последний платёж меньше первоначального
    const lastIdx = ip.schedule.length - 1
    expect(ip.schedule[lastIdx].payment).toBeLessThan(ip.monthlyPayment)
  })

  it('reduce-term даёт большую экономию чем reduce-payment при той же сумме', () => {
    const term = calculateIpoteka({
      ...base,
      earlyPayments: [{ month: 12, amount: 500_000, type: 'reduce-term' }],
    })
    const pay = calculateIpoteka({
      ...base,
      earlyPayments: [{ month: 12, amount: 500_000, type: 'reduce-payment' }],
    })
    expect(term.earlySavings).toBeGreaterThan(pay.earlySavings)
  })

  it('сумма ПВ + платежей ≈ цена + переплата', () => {
    const ip = calculateIpoteka(base)
    const sum = base.downPayment + ip.totalPayment
    expect(sum).toBeCloseTo(base.propertyPrice + ip.totalInterest, 0)
  })

  it('нулевая ставка работает', () => {
    const ip = calculateIpoteka({ ...base, annualRate: 0 })
    expect(ip.totalInterest).toBeCloseTo(0, 2)
    expect(ip.monthlyPayment).toBeCloseTo(5_000_000 / 240, 2)
  })

  it('первоначальный взнос = стоимость → loanAmount 0, без платежей', () => {
    const ip = calculateIpoteka({ ...base, downPayment: base.propertyPrice })
    expect(ip.loanAmount).toBe(0)
    expect(ip.totalInterest).toBe(0)
  })
})
