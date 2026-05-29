import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateAutocredit } from '@/calculators/autocredit'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readNumberParam } from '@/utils/historyParams'
import { NumberInput, ResultRow, InfoCard, Divider } from '@/components/ui'

const fmt = (value: number) => `${Math.round(value).toLocaleString('ru-RU')} ₽`

export default function AutocreditPage() {
  const location = useLocation()
  const initial = getHistorySearchParams()
  const [carPrice, setCarPrice] = useState(() => readNumberParam(initial, 'carPrice', 2_500_000))
  const [downPayment, setDownPayment] = useState(() => readNumberParam(initial, 'downPayment', 500_000))
  const [annualRate, setAnnualRate] = useState(() => readNumberParam(initial, 'annualRate', 16))
  const [termMonths, setTermMonths] = useState(() => readNumberParam(initial, 'termMonths', 60))
  const result = calculateAutocredit({ carPrice, downPayment, annualRate, termMonths })

  useHistorySync({
    calculatorLabel: 'Автокредит',
    calculatorUrl: location.pathname,
    calculatorParams: { carPrice, downPayment, annualRate, termMonths },
    summary: `${fmt(result.monthlyPayment)}/мес, переплата ${fmt(result.totalInterest)}`,
    triggerKey: `${carPrice}|${downPayment}|${annualRate}|${termMonths}|${result.monthlyPayment}`,
    delayMs: 0,
  })

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <nav className="mb-5 text-xs text-[hsl(var(--fg-muted))]">
          <Link to="/" className="hover:text-[hsl(var(--fg))]">Главная</Link>
          <span className="mx-2">/</span>
          <span>Авто</span>
        </nav>
        <section className="mb-6">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Калькулятор автокредита онлайн</h1>
          <p className="max-w-3xl text-sm leading-6 text-[hsl(var(--fg-muted))]">
            Рассчитайте ежемесячный платёж, сумму кредита, переплату и полную стоимость автомобиля с учётом первого взноса.
          </p>
        </section>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput label="Цена авто, ₽" value={carPrice} onChange={setCarPrice} min={0} integer />
              <NumberInput label="Первый взнос, ₽" value={downPayment} onChange={setDownPayment} min={0} integer />
              <NumberInput label="Ставка, %" value={annualRate} onChange={setAnnualRate} min={0} step={0.1} />
              <NumberInput label="Срок, мес." value={termMonths} onChange={setTermMonths} min={1} integer />
            </div>
          </div>
          <InfoCard spacing="space-y-4">
            <ResultRow label="Платёж в месяц" value={fmt(result.monthlyPayment)} color="emerald" size="2xl" />
            <Divider />
            <ResultRow label="Сумма кредита" value={fmt(result.loanAmount)} size="lg" />
            <Divider />
            <ResultRow label="Первый взнос" value={`${result.downPaymentPercent.toFixed(1)}%`} color="amber" />
            <Divider />
            <ResultRow label="Переплата" value={fmt(result.totalInterest)} color="red" />
            <Divider />
            <ResultRow label="Полная стоимость" value={fmt(result.totalCarCost)} />
          </InfoCard>
        </section>
        <AdBlock blockId={AD_SLOTS.result} className="mt-5" />
        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </main>
    </AppLayout>
  )
}
