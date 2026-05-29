export interface CompoundInterestParams {
  principal: number
  monthlyContribution: number
  annualRate: number
  years: number
  compoundingPerYear: number
}

export interface CompoundInterestResult {
  months: number
  totalContributions: number
  finalAmount: number
  interestEarned: number
}

const positive = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0)

export function calculateCompoundInterest(params: CompoundInterestParams): CompoundInterestResult {
  const principal = positive(params.principal)
  const monthlyContribution = positive(params.monthlyContribution)
  const annualRate = positive(params.annualRate) / 100
  const years = positive(params.years)
  const compoundingPerYear = Math.max(1, Math.round(positive(params.compoundingPerYear) || 12))
  const months = Math.max(0, Math.round(years * 12))
  const monthlyRate = annualRate === 0 ? 0 : (1 + annualRate / compoundingPerYear) ** (compoundingPerYear / 12) - 1

  let balance = principal
  for (let month = 0; month < months; month += 1) {
    balance = balance * (1 + monthlyRate) + monthlyContribution
  }

  const totalContributions = principal + monthlyContribution * months
  return {
    months,
    totalContributions,
    finalAmount: balance,
    interestEarned: Math.max(0, balance - totalContributions),
  }
}
