export type ContributionPeriod = 'month' | 'year'
export type InterestPaymentPeriod = 'month' | 'year'

export interface CompoundInterestParams {
  principal: number
  contribution: number
  contributionPeriod: ContributionPeriod
  interestPaymentPeriod: InterestPaymentPeriod
  annualRate: number
  years: number
  reinvestInterest: boolean
}

export interface CompoundInterestResult {
  months: number
  totalContributions: number
  finalAmount: number
  interestEarned: number
  schedule: CompoundInterestScheduleRow[]
}

export interface CompoundInterestScheduleRow {
  month: number
  year: number
  openingBalance: number
  contribution: number
  interest: number
  closingBalance: number
  accumulatedInterest: number
  totalValue: number
}

const positive = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0)

export function calculateCompoundInterest(params: CompoundInterestParams): CompoundInterestResult {
  const principal = positive(params.principal)
  const contribution = positive(params.contribution)
  const contributionPeriod = params.contributionPeriod === 'year' ? 'year' : 'month'
  const interestPaymentPeriod = params.interestPaymentPeriod === 'year' ? 'year' : 'month'
  const annualRate = positive(params.annualRate) / 100
  const years = positive(params.years)
  const months = Math.max(0, Math.round(years * 12))
  const monthlyRate = annualRate / 12

  let balance = principal
  let contributionCount = 0
  let interestEarned = 0
  let accruedInterest = 0
  const schedule: CompoundInterestScheduleRow[] = []
  for (let month = 0; month < months; month += 1) {
    const openingBalance = balance
    accruedInterest += balance * monthlyRate
    const shouldPayInterest = interestPaymentPeriod === 'month' || (month + 1) % 12 === 0 || month + 1 === months
    const interest = shouldPayInterest ? accruedInterest : 0
    if (shouldPayInterest) {
      interestEarned += interest
      accruedInterest = 0
      if (params.reinvestInterest) {
        balance += interest
      }
    }
    let periodContribution = 0
    if (contributionPeriod === 'month' || (month + 1) % 12 === 0) {
      balance += contribution
      periodContribution = contribution
      contributionCount += 1
    }
    schedule.push({
      month: month + 1,
      year: Math.floor(month / 12) + 1,
      openingBalance,
      contribution: periodContribution,
      interest,
      closingBalance: balance,
      accumulatedInterest: interestEarned,
      totalValue: params.reinvestInterest ? balance : balance + interestEarned + accruedInterest,
    })
  }

  const totalContributions = principal + contribution * contributionCount
  return {
    months,
    totalContributions,
    finalAmount: params.reinvestInterest ? balance : balance + interestEarned + accruedInterest,
    interestEarned: Math.max(0, interestEarned),
    schedule,
  }
}
