export type CompoundingPeriod = 1 | 4 | 12
export type ContributionFrequency = 'monthly' | 'quarterly' | 'yearly'
export type Currency = 'RUB' | 'USD' | 'EUR' | 'GBP' | 'CNY'

export interface CalcParams {
  initialAmount: number
  monthlyContribution: number
  annualRate: number          // percentage, e.g. 10 means 10%
  compoundingPerYear: CompoundingPeriod
  years: number
  inflationRate?: number      // percentage
  taxRate?: number            // percentage, default 13
  contributionFrequency?: ContributionFrequency
  contributionGrowthRate?: number
  currency?: Currency
}

export interface YearlyBreakdown {
  year: number
  principal: number           // initial amount (constant)
  contributions: number       // cumulative monthly contributions (excl. initial)
  interest: number            // cumulative net interest after tax
  total: number               // principal + contributions + interest
  realValue?: number          // inflation-adjusted total
}

export type CalculatorMode = 'accumulation' | 'goal' | 'duration' | 'rate' | 'capital' | 'comparison'

export interface GoalParams extends Omit<CalcParams, 'monthlyContribution'> {
  targetAmount: number
}
export interface DurationParams extends Omit<CalcParams, 'years'> {
  targetAmount: number
}
export interface RateParams extends Omit<CalcParams, 'annualRate'> {
  targetAmount: number
}
export interface CapitalParams extends Omit<CalcParams, 'initialAmount'> {
  targetAmount: number
}

export interface Scenario {
  id: string
  label: string
  params: CalcParams
  color: string
  breakdown: YearlyBreakdown[]
  finalAmount: number
}


export type Theme = 'dark' | 'light'
