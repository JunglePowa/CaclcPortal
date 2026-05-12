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

// Границы согласованы с zod-схемой в CalculatorForm.tsx
const NUMERIC_BOUNDS: Record<string, { min: number; max: number; int?: boolean }> = {
  initialAmount: { min: 0, max: 1e10 },
  monthlyContribution: { min: 0, max: 1e8 },
  annualRate: { min: 0, max: 100 },
  compoundingPerYear: { min: 1, max: 12, int: true },
  years: { min: 1, max: 100, int: true },
  taxRate: { min: 0, max: 100 },
  inflationRate: { min: 0, max: 50 },
  contributionGrowthRate: { min: 0, max: 100 },
}

const VALID_FREQ = new Set(['monthly', 'quarterly', 'yearly'])
const VALID_CURRENCY = new Set(['RUB', 'USD', 'EUR', 'GBP', 'CNY'])
const VALID_COMPOUNDING = new Set([1, 4, 12])

function clamp(v: number, min: number, max: number): number {
  if (v < min) return min
  if (v > max) return max
  return v
}

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

export type ParsedShare = Partial<CalcParams> & { targetAmount?: number }

export function parseShareUrl(search: string): ParsedShare {
  const sp = new URLSearchParams(search)
  const result: ParsedShare = {}

  const reverseMap = Object.fromEntries(Object.entries(PARAM_MAP).map(([k, v]) => [v, k]))

  for (const [short, val] of sp.entries()) {
    if (short === 'ta') {
      const n = parseFloat(val)
      if (Number.isFinite(n)) {
        result.targetAmount = clamp(n, 0, 1e10)
      }
      continue
    }
    const key = reverseMap[short]
    if (!key) continue

    const bounds = NUMERIC_BOUNDS[key]
    if (bounds) {
      const n = parseFloat(val)
      if (!Number.isFinite(n)) continue
      let v = clamp(n, bounds.min, bounds.max)
      if (bounds.int) v = Math.round(v)
      if (key === 'compoundingPerYear' && !VALID_COMPOUNDING.has(v)) continue
      ;(result as Record<string, unknown>)[key] = v
    } else if (key === 'contributionFrequency') {
      if (VALID_FREQ.has(val)) (result as Record<string, unknown>)[key] = val
    } else if (key === 'currency') {
      if (VALID_CURRENCY.has(val)) (result as Record<string, unknown>)[key] = val
    }
  }

  return result
}
