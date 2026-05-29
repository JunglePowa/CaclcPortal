import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateCreditCard } from '@/calculators/creditCard'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readNumberParam } from '@/utils/historyParams'
import { NumberInput, ResultRow, InfoCard, Divider } from '@/components/ui'

const fmt = (value: number) => `${Math.round(value).toLocaleString('ru-RU')} ₽`

export default function CreditCardPage() {
  const location = useLocation()
  const initial = getHistorySearchParams()
  const [debt, setDebt] = useState(() => readNumberParam(initial, 'debt', 120000))
  const [annualRate, setAnnualRate] = useState(() => readNumberParam(initial, 'annualRate', 29.9))
  const [monthlyPayment, setMonthlyPayment] = useState(() => readNumberParam(initial, 'monthlyPayment', 15000))
  const result = calculateCreditCard({ debt, annualRate, monthlyPayment })

  useHistorySync({
    calculatorLabel: 'Кредитная карта',
    calculatorUrl: location.pathname,
    calculatorParams: { debt, annualRate, monthlyPayment },
    summary: result.isPayoffPossible ? `${result.months} мес., переплата ${fmt(result.totalInterest)}` : 'платёж не покрывает проценты',
    triggerKey: `${debt}|${annualRate}|${monthlyPayment}|${result.months}`,
    delayMs: 0,
  })

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <nav className="mb-5 text-xs text-[hsl(var(--fg-muted))]">
          <Link to="/" className="hover:text-[hsl(var(--fg))]">Главная</Link>
          <span className="mx-2">/</span>
          <span>Кредиты</span>
        </nav>
        <section className="mb-6">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Калькулятор кредитной карты</h1>
          <p className="max-w-3xl text-sm leading-6 text-[hsl(var(--fg-muted))]">
            Рассчитайте срок закрытия долга по кредитной карте, сумму процентов и общий платёж.
          </p>
        </section>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput label="Задолженность, ₽" value={debt} onChange={setDebt} min={0} integer />
              <NumberInput label="Ставка, %" value={annualRate} onChange={setAnnualRate} min={0} step={0.1} />
              <NumberInput label="Платёж в месяц, ₽" value={monthlyPayment} onChange={setMonthlyPayment} min={0} integer />
            </div>
          </div>
          <InfoCard spacing="space-y-4">
            {result.isPayoffPossible ? (
              <>
                <ResultRow label="Срок закрытия" value={`${result.months} мес.`} color="emerald" size="2xl" />
                <Divider />
                <ResultRow label="Переплата" value={fmt(result.totalInterest)} color="amber" size="lg" />
                <Divider />
                <ResultRow label="Всего выплат" value={fmt(result.totalPaid)} />
                <Divider />
                <ResultRow label="Последний платёж" value={fmt(result.lastPayment)} />
              </>
            ) : (
              <p className="text-sm leading-6 text-red-300">
                Ежемесячный платёж не покрывает проценты. Увеличьте платёж или снизьте ставку.
              </p>
            )}
          </InfoCard>
        </section>
        <AdBlock blockId={AD_SLOTS.result} className="mt-5" />
        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </main>
    </AppLayout>
  )
}
