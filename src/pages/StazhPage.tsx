import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateStazh, type StazhPeriod } from '@/calculators/stazh'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readStringParam } from '@/utils/historyParams'
import { DateInput, ResultRow, InfoCard, Divider } from '@/components/ui'

function defaultEndDate() {
  return new Date().toISOString().slice(0, 10)
}

function readDate(search: URLSearchParams, key: string, fallback: string) {
  return readStringParam(search, key, fallback)
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year}`
}

export default function StazhPage() {
  const location = useLocation()
  const initial = getHistorySearchParams()
  const [periods, setPeriods] = useState<StazhPeriod[]>(() => [
    {
      start: readDate(initial, 'start1', '2021-01-01'),
      end: readDate(initial, 'end1', defaultEndDate()),
    },
    {
      start: readDate(initial, 'start2', ''),
      end: readDate(initial, 'end2', ''),
    },
    {
      start: readDate(initial, 'start3', ''),
      end: readDate(initial, 'end3', ''),
    },
  ])

  const result = useMemo(() => calculateStazh(periods), [periods])

  const params = {
    start1: periods[0]?.start,
    end1: periods[0]?.end,
    start2: periods[1]?.start,
    end2: periods[1]?.end,
    start3: periods[2]?.start,
    end3: periods[2]?.end,
  }

  useHistorySync({
    calculatorLabel: 'Стаж',
    calculatorUrl: location.pathname,
    calculatorParams: params,
    summary: `${result.years} г. ${result.months} мес. ${result.days} дн.`,
    triggerKey: `${periods.map((period) => `${period.start}-${period.end}`).join('|')}|${result.totalDays}`,
    delayMs: 0,
  })

  function updatePeriod(index: number, key: keyof StazhPeriod, value: string) {
    setPeriods((current) => current.map((period, i) => (i === index ? { ...period, [key]: value } : period)))
  }

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <nav className="mb-5 text-xs text-[hsl(var(--fg-muted))]">
          <Link to="/" className="hover:text-[hsl(var(--fg))]">Главная</Link>
          <span className="mx-2">/</span>
          <span>Работа</span>
        </nav>

        <section className="mb-6">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Калькулятор стажа онлайн</h1>
          <p className="max-w-3xl text-sm leading-6 text-[hsl(var(--fg-muted))]">
            Посчитайте общий трудовой стаж по нескольким периодам работы. Пересекающиеся даты объединяются, чтобы дни не считались дважды.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            <div className="space-y-5">
              {periods.map((period, index) => (
                <div key={index} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg)/0.22)] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
                    Период {index + 1}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DateInput
                      label="Начало"
                      value={period.start}
                      onChange={(value) => updatePeriod(index, 'start', value)}
                      ariaLabel={`Начало периода ${index + 1}`}
                    />
                    <DateInput
                      label="Окончание"
                      value={period.end}
                      onChange={(value) => updatePeriod(index, 'end', value)}
                      ariaLabel={`Окончание периода ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <InfoCard spacing="space-y-4">
            <ResultRow
              label="Стаж"
              value={`${result.years} г. ${result.months} мес. ${result.days} дн.`}
              color="emerald"
              size="xl"
            />
            <Divider />
            <ResultRow label="Всего дней" value={result.totalDays.toLocaleString('ru-RU')} color="amber" />
            <Divider />
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
                Учтённые периоды
              </p>
              {result.mergedPeriods.length ? (
                <div className="space-y-2 text-sm text-[hsl(var(--fg-muted))]">
                  {result.mergedPeriods.map((period) => (
                    <p key={`${period.start}-${period.end}`} className="flex justify-between gap-3">
                      <span>{formatDate(period.start)} - {formatDate(period.end)}</span>
                      <span>{period.days} дн.</span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[hsl(var(--fg-muted))]">Заполните хотя бы один период.</p>
              )}
            </div>
          </InfoCard>
        </section>

        <AdBlock blockId={AD_SLOTS.result} className="mt-5" />
        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </main>
    </AppLayout>
  )
}
