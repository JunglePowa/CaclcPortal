import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateAge } from '@/calculators/age'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readStringParam } from '@/utils/historyParams'
import { DateInput, ResultRow, InfoCard, Divider } from '@/components/ui'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function AgePage() {
  const location = useLocation()
  const initial = getHistorySearchParams()
  const [birthDate, setBirthDate] = useState(() => readStringParam(initial, 'birthDate', '2000-01-01'))
  const [targetDate, setTargetDate] = useState(() => readStringParam(initial, 'targetDate', todayIso()))
  const result = calculateAge({ birthDate, targetDate })

  useHistorySync({
    calculatorLabel: 'Возраст',
    calculatorUrl: location.pathname,
    calculatorParams: { birthDate, targetDate },
    summary: `${result.years} г. ${result.months} мес. ${result.days} дн.`,
    triggerKey: `${birthDate}|${targetDate}|${result.totalDays}`,
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
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Калькулятор возраста онлайн</h1>
          <p className="max-w-3xl text-sm leading-6 text-[hsl(var(--fg-muted))]">
            Узнайте точный возраст по дате рождения: годы, месяцы, дни и количество дней до следующего дня рождения.
          </p>
        </section>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <DateInput label="Дата рождения" value={birthDate} onChange={setBirthDate} max={targetDate} />
              <DateInput label="Дата расчёта" value={targetDate} onChange={setTargetDate} />
            </div>
          </div>
          <InfoCard spacing="space-y-4">
            <ResultRow label="Возраст" value={`${result.years} г. ${result.months} мес.`} color="emerald" size="2xl" />
            <Divider />
            <ResultRow label="Дней" value={result.days} color="amber" />
            <Divider />
            <ResultRow label="Всего дней" value={result.totalDays.toLocaleString('ru-RU')} />
            <Divider />
            <ResultRow label="До дня рождения" value={`${result.nextBirthdayDays} дн.`} color="muted" />
          </InfoCard>
        </section>
        <AdBlock blockId={AD_SLOTS.result} className="mt-5" />
        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </main>
    </AppLayout>
  )
}
