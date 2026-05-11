import type { CalcParams, CalculatorMode } from '@/types'
import { MODE_ROUTES } from './modeRoutes'

const PARAM_MAP = {
  initialAmount: 'i',
  monthlyContribution: 'c',
  annualRate: 'r',
  compoundingPerYear: 'n',
  years: 'y',
  taxRate: 't',
  inflationRate: 'inf',
  contributionFrequency: 'cf',
  contributionGrowthRate: 'cg',
  currency: 'cur',
} as const

export function buildShareUrl(mode: CalculatorMode, params: CalcParams, targetAmount: number): string {
  const base = window.location.origin + MODE_ROUTES[mode]
  const sp = new URLSearchParams()

  for (const [key, short] of Object.entries(PARAM_MAP)) {
    const val = params[key as keyof CalcParams]
    if (val !== undefined && val !== null) {
      sp.set(short, String(val))
    }
  }

  if (['goal', 'duration', 'rate', 'capital'].includes(mode)) {
    sp.set('ta', String(targetAmount))
  }

  return `${base}?${sp.toString()}`
}

export function parseShareUrl(search: string): Partial<CalcParams> & { targetAmount?: number } {
  const sp = new URLSearchParams(search)
  const result: any = {}

  const reverseMap = Object.fromEntries(Object.entries(PARAM_MAP).map(([k, v]) => [v, k]))

  for (const [short, val] of sp.entries()) {
    if (short === 'ta') {
      result.targetAmount = parseFloat(val)
      continue
    }
    const key = reverseMap[short]
    if (!key) continue
    if (['initialAmount', 'monthlyContribution', 'annualRate', 'compoundingPerYear', 'years', 'taxRate', 'inflationRate', 'contributionGrowthRate'].includes(key)) {
      result[key] = parseFloat(val)
    } else {
      result[key] = val
    }
  }

  return result
}
