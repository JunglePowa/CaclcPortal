import { describe, it, expect } from 'vitest'
import { calculateZarplata, type ZarplataParams } from './zarplata'

const base: ZarplataParams = {
  amount: 100000,
  direction: 'gross_to_net',
  hasChildren: false,
  childrenCount: 0,
  smallBusiness: false,
}

describe('calculateZarplata', () => {
  it('gross → net и net → gross взаимно обратны', () => {
    const g = calculateZarplata(base)
    const back = calculateZarplata({ ...base, amount: g.netSalary, direction: 'net_to_gross' })
    expect(back.grossSalary).toBeCloseTo(base.amount, 2)
  })

  it('детский вычет уменьшает НДФЛ', () => {
    const noKids = calculateZarplata(base)
    const withKids = calculateZarplata({ ...base, hasChildren: true, childrenCount: 2 })
    expect(withKids.ndfl).toBeLessThan(noKids.ndfl)
    expect(withKids.netSalary).toBeGreaterThan(noKids.netSalary)
  })

  it('лимит 350к: при высокой зп вычет применяется не все 12 мес', () => {
    // 100к/мес → 350к на 4-м месяце → вычет за 3 мес (до 300к включительно)
    const r = calculateZarplata({ ...base, hasChildren: true, childrenCount: 1 })
    // месячный вычет (усреднённо) = 1400 * 3 / 12 = 350
    expect(r.deduction).toBeCloseTo(1400 * 3 / 12, 2)
  })

  it('низкая зп: вычет работает все 12 мес', () => {
    const r = calculateZarplata({
      ...base,
      amount: 20000,
      hasChildren: true,
      childrenCount: 1,
    })
    expect(r.deduction).toBeCloseTo(1400, 2)
  })

  it('страховые ≈ 30% от gross для не-МСП', () => {
    const r = calculateZarplata(base)
    const insurance = r.pensionFund + r.medicalFund + r.socialFund
    expect(insurance).toBeCloseTo(base.amount * 0.30, 2)
  })

  it('МСП: при gross > МРОТ страховые ниже, чем у не-МСП', () => {
    const regular = calculateZarplata({ ...base, smallBusiness: false })
    const msp = calculateZarplata({ ...base, smallBusiness: true })
    const regularIns = regular.pensionFund + regular.medicalFund + regular.socialFund
    const mspIns = msp.pensionFund + msp.medicalFund + msp.socialFund
    expect(mspIns).toBeLessThan(regularIns)
  })

  it('МСП при gross ≤ МРОТ: страховые те же, что у не-МСП', () => {
    const small = { ...base, amount: 15000 }
    const regular = calculateZarplata({ ...small, smallBusiness: false })
    const msp = calculateZarplata({ ...small, smallBusiness: true })
    const regularIns = regular.pensionFund + regular.medicalFund + regular.socialFund
    const mspIns = msp.pensionFund + msp.medicalFund + msp.socialFund
    expect(mspIns).toBeCloseTo(regularIns, 2)
  })
})
