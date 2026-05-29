import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateOtpusk } from '@/calculators/otpusk'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readNumberParam } from '@/utils/historyParams'
import { NumberInput, ResultRow, InfoCard, Divider } from '@/components/ui'

const fmt = (value: number) => `${Math.round(value).toLocaleString('ru-RU')} ₽`

export default function OtpuskPage() {
  const location = useLocation()
  const initial = getHistorySearchParams()
  const [income, setIncome] = useState(() => readNumberParam(initial, 'income', 1_200_000))
  const [months, setMonths] = useState(() => readNumberParam(initial, 'months', 12))
  const [vacationDays, setVacationDays] = useState(() => readNumberParam(initial, 'vacationDays', 14))
  const [excludedDays, setExcludedDays] = useState(() => readNumberParam(initial, 'excludedDays', 0))
  const [ndflRate, setNdflRate] = useState(() => readNumberParam(initial, 'ndflRate', 13))

  const result = calculateOtpusk({ income, months, vacationDays, excludedDays, ndflRate })

  useHistorySync({
    calculatorLabel: 'Отпускные',
    calculatorUrl: location.pathname,
    calculatorParams: { income, months, vacationDays, excludedDays, ndflRate },
    summary: `К выплате ${Math.round(result.netVacationPay).toLocaleString('ru-RU')} ₽ за ${vacationDays} дн.`,
    triggerKey: `${income}|${months}|${vacationDays}|${excludedDays}|${ndflRate}|${result.netVacationPay}`,
    delayMs: 0,
  })

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <nav className="mb-5 text-xs text-[hsl(var(--fg-muted))]">
          <Link to="/" className="hover:text-[hsl(var(--fg))]">Главная</Link>
          <span className="mx-2">/</span>
          <span>Работа</span>
        </nav>

        <section className="mb-6">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Калькулятор отпускных онлайн</h1>
          <p className="max-w-3xl text-sm leading-6 text-[hsl(var(--fg-muted))]">
            Рассчитайте отпускные по среднему дневному заработку: сумма до НДФЛ, налог и выплата на руки.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput
                label="Доход за период, ₽"
                value={income}
                onChange={setIncome}
                min={0}
                integer
              />
              <NumberInput
                label="Месяцев в периоде"
                value={months}
                onChange={setMonths}
                min={1}
                max={12}
                integer
              />
              <NumberInput
                label="Дней отпуска"
                value={vacationDays}
                onChange={setVacationDays}
                min={1}
                integer
              />
              <NumberInput
                label="Исключаемые дни"
                value={excludedDays}
                onChange={setExcludedDays}
                min={0}
                step={0.1}
              />
              <NumberInput
                label="НДФЛ, %"
                value={ndflRate}
                onChange={setNdflRate}
                min={0}
                max={100}
                step={0.1}
              />
            </div>
          </div>

          <InfoCard spacing="space-y-4">
            <ResultRow
              label="К выплате"
              value={fmt(result.netVacationPay)}
              color="emerald"
              size="2xl"
            />
            <Divider />
            <ResultRow label="Отпускные до НДФЛ" value={fmt(result.grossVacationPay)} size="lg" />
            <Divider />
            <ResultRow label="НДФЛ" value={fmt(result.ndfl)} color="red" />
            <Divider />
            <ResultRow
              label="Средний дневной"
              value={fmt(result.averageDailyEarnings)}
              color="amber"
            />
            <Divider />
            <ResultRow
              label="Дней в расчёте"
              value={result.calculationDays.toFixed(1)}
              color="muted"
              weight="medium"
            />
          </InfoCard>
        </section>

        <AdBlock blockId={AD_SLOTS.result} className="mt-5" />
        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </main>
    </AppLayout>
  )
}
