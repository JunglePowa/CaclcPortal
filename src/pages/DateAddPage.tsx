import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateDateAdd } from '@/calculators/dateAdd'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readNumberParam, readStringParam } from '@/utils/historyParams'
import { DateInput, NumberInput, ResultRow, InfoCard, Divider } from '@/components/ui'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(value: string) {
  if (!value) return '—'
  return value.split('-').reverse().join('.')
}

export default function DateAddPage() {
  const location = useLocation()
  const initial = getHistorySearchParams()
  const [start, setStart] = useState(() => readStringParam(initial, 'start', todayIso()))
  const [years, setYears] = useState(() => readNumberParam(initial, 'years', 0))
  const [months, setMonths] = useState(() => readNumberParam(initial, 'months', 1))
  const [days, setDays] = useState(() => readNumberParam(initial, 'days', 0))
  const result = calculateDateAdd({ start, years, months, days })

  useHistorySync({
    calculatorLabel: 'Прибавить дни к дате',
    calculatorUrl: location.pathname,
    calculatorParams: { start, years, months, days },
    summary: `${formatDate(result.date)} после прибавления срока`,
    triggerKey: `${start}|${years}|${months}|${days}|${result.date}`,
    delayMs: 0,
  })

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <nav className="mb-5 text-xs text-[hsl(var(--fg-muted))]">
          <Link to="/" className="hover:text-[hsl(var(--fg))]">Главная</Link>
          <span className="mx-2">/</span>
          <span>Математика</span>
        </nav>
        <section className="mb-6">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Калькулятор даты плюс дни</h1>
          <p className="max-w-3xl text-sm leading-6 text-[hsl(var(--fg-muted))]">
            Прибавьте к дате дни, месяцы и годы, чтобы получить итоговую календарную дату.
          </p>
        </section>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <DateInput label="Начальная дата" value={start} onChange={setStart} />
              <NumberInput label="Годы" value={years} onChange={setYears} integer />
              <NumberInput label="Месяцы" value={months} onChange={setMonths} integer />
              <NumberInput label="Дни" value={days} onChange={setDays} integer />
            </div>
          </div>
          <InfoCard spacing="space-y-4">
            <ResultRow label="Итоговая дата" value={formatDate(result.date)} color="emerald" size="2xl" />
            <Divider />
            <ResultRow label="День недели" value={result.dayOfWeek || '—'} color="amber" />
            <Divider />
            <p className="text-sm text-[hsl(var(--fg-muted))]">
              Месяцы прибавляются календарно: если в целевом месяце нет такого числа, берётся последний день месяца.
            </p>
          </InfoCard>
        </section>
        <AdBlock blockId={AD_SLOTS.result} className="mt-5" />
        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </main>
    </AppLayout>
  )
}
