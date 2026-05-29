import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateCompoundInterest } from '@/calculators/compoundInterest'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readNumberParam } from '@/utils/historyParams'
import { NumberInput, ResultRow, InfoCard, Divider } from '@/components/ui'

const fmt = (value: number) => `${Math.round(value).toLocaleString('ru-RU')} ₽`

export default function CompoundInterestPage() {
  const location = useLocation()
  const initial = getHistorySearchParams()
  const [principal, setPrincipal] = useState(() => readNumberParam(initial, 'principal', 100000))
  const [monthlyContribution, setMonthlyContribution] = useState(() => readNumberParam(initial, 'monthlyContribution', 10000))
  const [annualRate, setAnnualRate] = useState(() => readNumberParam(initial, 'annualRate', 12))
  const [years, setYears] = useState(() => readNumberParam(initial, 'years', 5))
  const [compoundingPerYear, setCompoundingPerYear] = useState(() => readNumberParam(initial, 'compoundingPerYear', 12))
  const result = calculateCompoundInterest({ principal, monthlyContribution, annualRate, years, compoundingPerYear })

  useHistorySync({
    calculatorLabel: 'Сложный процент',
    calculatorUrl: location.pathname,
    calculatorParams: { principal, monthlyContribution, annualRate, years, compoundingPerYear },
    summary: `${fmt(result.finalAmount)} через ${result.months} мес.`,
    triggerKey: `${principal}|${monthlyContribution}|${annualRate}|${years}|${compoundingPerYear}|${result.finalAmount}`,
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
            Посчитайте рост капитала с пополнениями, ставкой и капитализацией процентов.
          </p>
        </section>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput label="Начальная сумма, ₽" value={principal} onChange={setPrincipal} min={0} integer />
              <NumberInput label="Пополнение в месяц, ₽" value={monthlyContribution} onChange={setMonthlyContribution} min={0} integer />
              <NumberInput label="Ставка, %" value={annualRate} onChange={setAnnualRate} min={0} step={0.1} />
              <NumberInput label="Срок, лет" value={years} onChange={setYears} min={0} step={0.5} />
              <NumberInput label="Капитализаций в год" value={compoundingPerYear} onChange={setCompoundingPerYear} min={1} integer />
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
        <AdBlock blockId={AD_SLOTS.result} className="mt-5" />
        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </main>
    </AppLayout>
  )
}
