import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateDaysBetween } from '@/calculators/daysBetween'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readBooleanParam, readStringParam } from '@/utils/historyParams'
import { DateInput, ResultRow, InfoCard, Divider } from '@/components/ui'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function nextMonthIso() {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  return date.toISOString().slice(0, 10)
}

export default function DaysBetweenPage() {
  const location = useLocation()
  const initial = getHistorySearchParams()
  const [start, setStart] = useState(() => readStringParam(initial, 'start', todayIso()))
  const [end, setEnd] = useState(() => readStringParam(initial, 'end', nextMonthIso()))
  const [includeEndDate, setIncludeEndDate] = useState(() => readBooleanParam(initial, 'includeEndDate', false))

  const result = calculateDaysBetween({ start, end, includeEndDate })
  const directionLabel = result.direction === 'backward' ? 'между датами в обратном порядке' : 'между датами'

  useHistorySync({
    calculatorLabel: 'Дни между датами',
    calculatorUrl: location.pathname,
    calculatorParams: { start, end, includeEndDate },
    summary: `${result.days.toLocaleString('ru-RU')} дн. ${directionLabel}`,
    triggerKey: `${start}|${end}|${includeEndDate}|${result.days}`,
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
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Калькулятор дней между датами</h1>
          <p className="max-w-3xl text-sm leading-6 text-[hsl(var(--fg-muted))]">
            Посчитайте количество дней, недель и примерный срок между двумя календарными датами.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <DateInput label="Начальная дата" value={start} onChange={setStart} />
              <DateInput label="Конечная дата" value={end} onChange={setEnd} />
            </div>

            <label className="mt-5 flex cursor-pointer select-none items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeEndDate}
                onChange={(event) => setIncludeEndDate(event.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500"
              />
              <span>Включить конечную дату в расчёт</span>
            </label>
          </div>

          <InfoCard spacing="space-y-4">
            <ResultRow
              label="Дней"
              value={result.days.toLocaleString('ru-RU')}
              color="emerald"
              size="2xl"
            />
            <Divider />
            <ResultRow label="Недель" value={`${result.weeks} нед. ${result.remainingDays} дн.`} color="amber" />
            <Divider />
            <ResultRow label="Примерно" value={`${result.yearsApprox} г. ${result.monthsApprox} мес.`} />
            <Divider />
            <p className="text-sm text-[hsl(var(--fg-muted))]">
              {result.direction === 'same'
                ? 'Выбрана одна и та же дата.'
                : result.direction === 'backward'
                  ? 'Конечная дата раньше начальной, поэтому показана абсолютная разница.'
                  : 'Конечная дата позже начальной.'}
            </p>
          </InfoCard>
        </section>

        <AdBlock blockId={AD_SLOTS.result} className="mt-5" />
        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </main>
    </AppLayout>
  )
}
