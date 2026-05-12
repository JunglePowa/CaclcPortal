export type NdsOperation = 'charge' | 'extract'  // начислить / выделить
export type NdsRate = 22 | 20 | 10 | 0

export interface NdsParams {
  amount: number
  rate: NdsRate
  operation: NdsOperation
}

export interface NdsResult {
  amountWithoutNds: number
  ndsAmount: number
  amountWithNds: number
}

export function calculateNds(params: NdsParams): NdsResult {
  const { amount, rate, operation } = params
  const r = rate / 100

  if (operation === 'charge') {
    // Начислить: сумма БЕЗ НДС → сумма С НДС
    const ndsAmount = amount * r
    return { amountWithoutNds: amount, ndsAmount, amountWithNds: amount + ndsAmount }
  } else {
    // Выделить: сумма С НДС → выделить НДС
    const ndsAmount = amount * r / (1 + r)
    return { amountWithoutNds: amount - ndsAmount, ndsAmount, amountWithNds: amount }
  }
}
