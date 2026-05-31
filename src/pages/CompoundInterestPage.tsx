import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateCompoundInterest } from '@/calculators/compoundInterest'
import type { ContributionPeriod, InterestPaymentPeriod } from '@/calculators/compoundInterest'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readBooleanParam, readNumberParam, readStringParam } from '@/utils/historyParams'
import { NumberInput, ResultRow, InfoCard, Divider, Select } from '@/components/ui'

const fmt = (value: number) => `${Math.round(value).toLocaleString('ru-RU')} ₽`
const CONTRIBUTION_PERIOD_OPTIONS: { value: ContributionPeriod; label: string }[] = [
  { value: 'month', label: 'Каждый месяц' },
  { value: 'year', label: 'Раз в год' },
]
const INTEREST_PAYMENT_PERIOD_OPTIONS: { value: InterestPaymentPeriod; label: string }[] = [
  { value: 'month', label: 'Ежемесячно' },
  { value: 'year', label: 'Ежегодно' },
]
export default function CompoundInterestPage() {
  const location = useLocation()
  const initial = getHistorySearchParams()
  const [principal, setPrincipal] = useState(() => readNumberParam(initial, 'principal', 100000))
  const [contribution, setContribution] = useState(() => readNumberParam(initial, 'contribution', readNumberParam(initial, 'monthlyContribution', 10000)))
  const [contributionPeriod, setContributionPeriod] = useState<ContributionPeriod>(() => readStringParam(initial, 'contributionPeriod', 'month', ['month', 'year']))
  const [interestPaymentPeriod, setInterestPaymentPeriod] = useState<InterestPaymentPeriod>(() => readStringParam(initial, 'interestPaymentPeriod', 'month', ['month', 'year']))
  const [annualRate, setAnnualRate] = useState(() => readNumberParam(initial, 'annualRate', 12))
  const [years, setYears] = useState(() => readNumberParam(initial, 'years', 5))
  const [reinvestInterest, setReinvestInterest] = useState(() => readBooleanParam(initial, 'reinvestInterest', true))
  const result = calculateCompoundInterest({ principal, contribution, contributionPeriod, interestPaymentPeriod, annualRate, years, reinvestInterest })
  const contributionLabel = contributionPeriod === 'year' ? 'Пополнение в год, ₽' : 'Пополнение в месяц, ₽'
  const tableRows = useMemo(() => {
    if (interestPaymentPeriod === 'month') return result.schedule

    const rows = []
    for (let index = 0; index < result.schedule.length; index += 12) {
      const chunk = result.schedule.slice(index, index + 12)
      const first = chunk[0]
      const last = chunk[chunk.length - 1]
      if (!first || !last) continue
      rows.push({
        month: last.month,
        year: first.year,
        openingBalance: first.openingBalance,
        contribution: chunk.reduce((sum, row) => sum + row.contribution, 0),
        interest: chunk.reduce((sum, row) => sum + row.interest, 0),
        closingBalance: last.closingBalance,
        accumulatedInterest: last.accumulatedInterest,
        totalValue: last.totalValue,
      })
    }
    return rows
  }, [interestPaymentPeriod, result.schedule])

  useHistorySync({
    calculatorLabel: 'Сложный процент',
    calculatorUrl: location.pathname,
    calculatorParams: { principal, contribution, contributionPeriod, interestPaymentPeriod, annualRate, years, reinvestInterest },
    summary: `${fmt(result.finalAmount)} через ${result.months} мес.`,
    triggerKey: `${principal}|${contribution}|${contributionPeriod}|${interestPaymentPeriod}|${annualRate}|${years}|${reinvestInterest}|${result.finalAmount}`,
    delayMs: 0,
  })

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <nav className="mb-5 text-xs text-[hsl(var(--fg-muted))]">
          <Link to="/" className="hover:text-[hsl(var(--fg))]">Главная</Link>
          <span className="mx-2">/</span>
          <span>Финансы</span>
        </nav>
        <section className="mb-6">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Калькулятор сложного процента</h1>
          <p className="max-w-3xl text-sm leading-6 text-[hsl(var(--fg-muted))]">
            Посчитайте рост капитала с пополнениями, ставкой и реинвестированием процентов.
          </p>
        </section>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput label="Начальная сумма, ₽" value={principal} onChange={setPrincipal} min={0} integer />
              <NumberInput label={contributionLabel} value={contribution} onChange={setContribution} min={0} integer />
              <Select
                label="Период пополнения"
                value={contributionPeriod}
                onChange={setContributionPeriod}
                options={CONTRIBUTION_PERIOD_OPTIONS}
              />
              <Select
                label="Период капитализации"
                value={interestPaymentPeriod}
                onChange={setInterestPaymentPeriod}
                options={INTEREST_PAYMENT_PERIOD_OPTIONS}
              />
              <NumberInput label="Ставка, %" value={annualRate} onChange={setAnnualRate} min={0} step={0.1} />
              <NumberInput label="Срок, лет" value={years} onChange={setYears} min={0} step={0.5} />
              <label className="flex cursor-pointer select-none items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg)/0.28)] px-3 py-2.5 text-sm sm:self-end">
                <input
                  type="checkbox"
                  checked={reinvestInterest}
                  onChange={(event) => setReinvestInterest(event.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
                <span>Реинвестировать проценты</span>
              </label>
            </div>
          </div>
          <InfoCard spacing="space-y-4">
            <ResultRow label="Итоговая сумма" value={fmt(result.finalAmount)} color="emerald" size="2xl" />
            <Divider />
            <ResultRow label="Доход" value={fmt(result.interestEarned)} color="amber" size="lg" />
            <Divider />
            <ResultRow label="Внесено" value={fmt(result.totalContributions)} />
            <Divider />
            <ResultRow label="Срок" value={`${result.months} мес.`} />
          </InfoCard>
        </section>
        {tableRows.length > 0 && (
          <section className="mt-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-base font-semibold">Этапы капитализации</h2>
                <p className="mt-1 text-xs text-[hsl(var(--fg-muted))]">
                  Таблица показывает этапы по выбранному периоду капитализации: {interestPaymentPeriod === 'month' ? 'месяц' : 'год'}.
                </p>
              </div>
              <p className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg)/0.28)] px-3 py-2 text-xs font-medium text-[hsl(var(--fg-muted))]">
                {interestPaymentPeriod === 'month' ? 'Помесячные этапы' : 'Годовые этапы'}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-[hsl(var(--fg-muted))]">
                  <tr className="border-b border-[hsl(var(--border))]">
                    <th className="py-2 pr-3 font-semibold">Период</th>
                    <th className="px-3 py-2 font-semibold">На начало</th>
                    <th className="px-3 py-2 font-semibold">Пополнение</th>
                    <th className="px-3 py-2 font-semibold">Проценты</th>
                    <th className="px-3 py-2 font-semibold">Капитал</th>
                    <th className="py-2 pl-3 font-semibold">Итого</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr key={`${interestPaymentPeriod}-${row.month}`} className="border-b border-[hsl(var(--border))]/70 last:border-0">
                      <td className="py-2 pr-3 tabular">{interestPaymentPeriod === 'month' ? `${row.month} мес.` : `${row.year} год`}</td>
                      <td className="px-3 py-2 tabular">{fmt(row.openingBalance)}</td>
                      <td className="px-3 py-2 tabular text-emerald-300">{fmt(row.contribution)}</td>
                      <td className="px-3 py-2 tabular text-amber-300">{fmt(row.interest)}</td>
                      <td className="px-3 py-2 tabular">{fmt(row.closingBalance)}</td>
                      <td className="py-2 pl-3 tabular font-semibold">{fmt(row.totalValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!reinvestInterest && (
              <p className="mt-3 text-xs text-[hsl(var(--fg-muted))]">
                При выключенном реинвестировании колонка “Капитал” не растёт за счёт процентов, а “Итого” включает накопленный процентный доход отдельно.
              </p>
            )}
          </section>
        )}
        <AdBlock blockId={AD_SLOTS.result} className="mt-5" />
        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </main>
    </AppLayout>
  )
}
