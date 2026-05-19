import { describe, expect, it } from 'vitest'
import { calculateBeremennost } from './beremennost'
import { calculateImt } from './imt'
import { calculateIpoteka } from './ipoteka'
import { calculateKredit } from './kredit'
import { calculateDosrochnoe } from './kreditDosrochnoe'
import { calculateNdfl } from './ndfl'
import { calculateNds } from './nds'
import { calculateObligacii } from './obligacii'
import { calculatePeni } from './peni'
import { calculateRashod } from './rashod'
import { calculateTransport } from './transport'
import { calculateVklad } from './vklad'
import { calculateZarplata } from './zarplata'

function collectBadNumberPaths(value: unknown, path = ''): string[] {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? [] : [path || '<root>']
  }
  if (!value || typeof value !== 'object') return []
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => collectBadNumberPaths(entry, `${path}[${index}]`))
  }
  return Object.entries(value).flatMap(([key, entry]) =>
    collectBadNumberPaths(entry, path ? `${path}.${key}` : key),
  )
}

function expectFiniteNumbers(value: unknown) {
  expect(collectBadNumberPaths(value)).toEqual([])
}

describe('calculator edge cases', () => {
  it('keeps loan calculators finite for zero and negative boundary values', () => {
    expectFiniteNumbers(calculateKredit({
      loanAmount: 1000,
      annualRate: 10,
      termMonths: 0,
      paymentType: 'annuity',
      currency: 'RUB',
    }))
    expectFiniteNumbers(calculateKredit({
      loanAmount: -1000,
      annualRate: -10,
      termMonths: 12,
      paymentType: 'differential',
      currency: 'RUB',
    }))
    expectFiniteNumbers(calculateIpoteka({
      propertyPrice: 1000,
      downPayment: 0,
      annualRate: 10,
      termMonths: 0,
      paymentType: 'annuity',
      currency: 'RUB',
    }))
    expectFiniteNumbers(calculateDosrochnoe({
      balance: 1000,
      annualRate: 10,
      remainingMonths: 0,
      earlyAmount: 100,
      earlyType: 'reduce-payment',
    }))
  })

  it('keeps finance and tax calculators finite for boundary values', () => {
    expectFiniteNumbers(calculateVklad({
      initialAmount: -1000,
      monthlyReplenishment: -100,
      annualRate: -10,
      termMonths: 0,
      capitalizationPerYear: 12,
      taxRate: -13,
      currency: 'RUB',
    }))
    expectFiniteNumbers(calculateNds({ amount: -1000, rate: 22, operation: 'extract' }))
    expectFiniteNumbers(calculateNdfl({
      amount: -1000,
      rate: 'progressive',
      direction: 'net_to_gross',
      hasChildren: true,
      childrenCount: -1,
    }))
    expectFiniteNumbers(calculateZarplata({
      amount: -1000,
      direction: 'net_to_gross',
      hasChildren: true,
      childrenCount: -1,
      smallBusiness: true,
    }))
    expectFiniteNumbers(calculateObligacii({
      faceValue: 1000,
      buyPricePercent: 100,
      sellPricePercent: 100,
      couponRate: 10,
      paymentsPerYear: 0,
      years: 1,
      taxRate: 13,
    }))
    expectFiniteNumbers(calculatePeni({
      debt: 1000,
      startDate: '',
      endDate: 'bad',
      keyRate: 10,
      isIndividual: false,
    }))
  })

  it('keeps auto and health calculators finite for empty-like and invalid values', () => {
    expectFiniteNumbers(calculateTransport({
      horsePower: -1,
      monthsOwned: -1,
      regionRate: -1,
      luxuryCoeff: -1,
    }))
    expectFiniteNumbers(calculateRashod({
      fuelConsumed: -50,
      distance: 0,
      fuelPrice: -60,
    }))
    expectFiniteNumbers(calculateImt({
      weight: 70,
      height: 0,
      age: 30,
      sex: 'male',
    }))
    expect(calculateBeremennost({ lastPeriodDate: '', cycleLength: 28 })).toBeNull()
  })
})
