import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateTimeBetween } from '@/calculators/timeBetween'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readNumberParam, readStringParam } from '@/utils/historyParams'
import { DateInput, NumberInput, ResultRow, InfoCard, Divider } from '@/components/ui'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function TimeBetweenPage() {
  const location = useLocation()
  const initial = getHistorySearchParams()
  const [startDate, setStartDate] = useState(() => readStringParam(initial, 'startDate', todayIso()))
  const [startHour, setStartHour] = useState(() => readNumberParam(initial, 'startHour', 9))
  const [startMinute, setStartMinute] = useState(() => readNumberParam(initial, 'startMinute', 0))
  const [endDate, setEndDate] = useState(() => readStringParam(initial, 'endDate', todayIso()))
  const [endHour, setEndHour] = useState(() => readNumberParam(initial, 'endHour', 18))
  const [endMinute, setEndMinute] = useState(() => readNumberParam(initial, 'endMinute', 30))
  const result = calculateTimeBetween({ startDate, startHour, startMinute, endDate, endHour, endMinute })

  useHistorySync({
    calculatorLabel: 'Время между датами',
    calculatorUrl: location.pathname,
    calculatorParams: { startDate, startHour, startMinute, endDate, endHour, endMinute },
    summary: `${result.days} дн. ${result.hours} ч. ${result.minutes} мин.`,
    triggerKey: `${startDate}|${startHour}|${startMinute}|${endDate}|${endHour}|${endMinute}|${result.totalMinutes}`,
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
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Калькулятор времени между датами</h1>
          <p className="max-w-3xl text-sm leading-6 text-[hsl(var(--fg-muted))]">
            Посчитайте разницу между двумя датами и временем в днях, часах и минутах.
          </p>
        </section>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <DateInput label="Дата начала" value={startDate} onChange={setStartDate} />
              <DateInput label="Дата окончания" value={endDate} onChange={setEndDate} />
              <NumberInput label="Часы начала" value={startHour} onChange={setStartHour} min={0} max={23} integer />
              <NumberInput label="Минуты начала" value={startMinute} onChange={setStartMinute} min={0} max={59} integer />
              <NumberInput label="Часы окончания" value={endHour} onChange={setEndHour} min={0} max={23} integer />
              <NumberInput label="Минуты окончания" value={endMinute} onChange={setEndMinute} min={0} max={59} integer />
            </div>
          </div>
          <InfoCard spacing="space-y-4">
            <ResultRow label="Разница" value={`${result.days} дн. ${result.hours} ч.`} color="emerald" size="2xl" />
            <Divider />
            <ResultRow label="Минуты" value={`${result.minutes} мин.`} color="amber" />
            <Divider />
            <ResultRow label="Всего минут" value={result.totalMinutes.toLocaleString('ru-RU')} />
            <Divider />
            <p className="text-sm text-[hsl(var(--fg-muted))]">
              {result.direction === 'same'
                ? 'Выбрано одинаковое время.'
                : result.direction === 'backward'
                  ? 'Окончание раньше начала, поэтому показана абсолютная разница.'
                  : 'Окончание позже начала.'}
            </p>
          </InfoCard>
        </section>
        <AdBlock blockId={AD_SLOTS.result} className="mt-5" />
        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </main>
    </AppLayout>
  )
}
