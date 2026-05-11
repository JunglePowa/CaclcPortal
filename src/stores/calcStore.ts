import { create } from 'zustand'
import type { CalcParams, YearlyBreakdown, CalculatorMode, Scenario, Theme, Currency } from '@/types'
import { calculateCompound, calculateRequiredContribution, calculateRequiredYears, calculateRequiredRate, calculateRequiredInitialAmount } from '@/utils/compound'

const SCENARIO_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899']

const DEFAULT_TARGET = 5_000_000

interface CalcStore {
  mode: CalculatorMode
  theme: Theme
  params: CalcParams
  breakdown: YearlyBreakdown[]
  scenarios: Scenario[]
  targetAmount: number
  requiredMonthly: number
  requiredYears: number
  requiredRate: number
  requiredCapital: number
  setMode: (mode: CalculatorMode) => void
  setTheme: (theme: Theme) => void
  setParams: (params: Partial<CalcParams>) => void
  setCurrency: (c: Currency) => void
  setTargetAmount: (amount: number) => void
  addScenario: () => void
  removeScenario: (id: string) => void
  updateScenario: (id: string, params: Partial<CalcParams>) => void
}

const DEFAULT_PARAMS: CalcParams = {
  initialAmount: 100000,
  monthlyContribution: 10000,
  annualRate: 12,
  compoundingPerYear: 12,
  years: 10,
  taxRate: 13,
  currency: 'RUB',
}

function recalcScenario(scenario: Scenario): Scenario {
  const breakdown = calculateCompound(scenario.params)
  return { ...scenario, breakdown, finalAmount: breakdown[breakdown.length - 1]?.total ?? 0 }
}

function recalcAll(params: CalcParams, targetAmount: number) {
  return {
    requiredMonthly: calculateRequiredContribution({ ...params, targetAmount }),
    requiredYears: calculateRequiredYears({ ...params, targetAmount }),
    requiredRate: calculateRequiredRate({ ...params, targetAmount }),
    requiredCapital: calculateRequiredInitialAmount({ ...params, targetAmount }),
  }
}

export const useCalcStore = create<CalcStore>((set, get) => ({
  mode: 'accumulation',
  theme: 'dark',
  params: DEFAULT_PARAMS,
  breakdown: calculateCompound(DEFAULT_PARAMS),
  scenarios: [],
  targetAmount: DEFAULT_TARGET,
  ...recalcAll(DEFAULT_PARAMS, DEFAULT_TARGET),

  setMode: (mode) => set({ mode }),

  setTheme: (theme) => {
    const root = document.documentElement
    if (theme === 'light') { root.classList.add('light'); root.classList.remove('dark') }
    else { root.classList.remove('light'); root.classList.add('dark') }
    set({ theme })
  },

  setParams: (patch) => {
    const params = { ...get().params, ...patch }
    const breakdown = calculateCompound(params)
    const { targetAmount } = get()
    set({ params, breakdown, ...recalcAll(params, targetAmount) })
  },

  setCurrency: (c) => set({ params: { ...get().params, currency: c } }),

  setTargetAmount: (amount) => {
    const { params } = get()
    set({ targetAmount: amount, ...recalcAll(params, amount) })
  },

  addScenario: () => {
    const { params, scenarios } = get()
    if (scenarios.length >= 4) return
    const id = crypto.randomUUID()
    const color = SCENARIO_COLORS[scenarios.length]
    const breakdown = calculateCompound(params)
    const scenario: Scenario = { id, label: `Сценарий ${scenarios.length + 1}`, params: { ...params }, color, breakdown, finalAmount: breakdown[breakdown.length - 1]?.total ?? 0 }
    set({ scenarios: [...scenarios, scenario] })
  },

  removeScenario: (id) => set({ scenarios: get().scenarios.filter(s => s.id !== id) }),

  updateScenario: (id, patch) => {
    const scenarios = get().scenarios.map(s =>
      s.id === id ? recalcScenario({ ...s, params: { ...s.params, ...patch } }) : s
    )
    set({ scenarios })
  },
}))
