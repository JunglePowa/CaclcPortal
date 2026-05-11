import { create } from 'zustand'
import { calculateKredit, type KreditParams, type KreditResult } from '@/calculators/kredit'

const DEFAULT_PARAMS: KreditParams = {
  loanAmount: 500000,
  annualRate: 21,
  termMonths: 36,
  paymentType: 'annuity',
  currency: 'RUB',
}

interface KreditStore {
  params: KreditParams
  result: KreditResult
  setParams: (patch: Partial<KreditParams>) => void
}

export const useKreditStore = create<KreditStore>((set, get) => ({
  params: DEFAULT_PARAMS,
  result: calculateKredit(DEFAULT_PARAMS),
  setParams: (patch) => {
    const params = { ...get().params, ...patch }
    set({ params, result: calculateKredit(params) })
  },
}))
