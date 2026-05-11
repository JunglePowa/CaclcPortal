import { create } from 'zustand'
import { calculateVklad, type VkladParams, type VkladResult } from '@/calculators/vklad'

const DEFAULT_PARAMS: VkladParams = {
  initialAmount: 100000,
  monthlyReplenishment: 5000,
  annualRate: 16,
  termMonths: 12,
  capitalizationPerYear: 12,
  taxRate: 0,
  currency: 'RUB',
}

interface VkladStore {
  params: VkladParams
  result: VkladResult
  setParams: (patch: Partial<VkladParams>) => void
}

export const useVkladStore = create<VkladStore>((set, get) => ({
  params: DEFAULT_PARAMS,
  result: calculateVklad(DEFAULT_PARAMS),
  setParams: (patch) => {
    const params = { ...get().params, ...patch }
    set({ params, result: calculateVklad(params) })
  },
}))
