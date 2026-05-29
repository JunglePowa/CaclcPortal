import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateDiscount } from '@/calculators/discount'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readNumberParam } from '@/utils/historyParams'
import { NumberInput, ResultRow, InfoCard, Divider } from '@/components/ui'

const fmt = (value: number) => `${Math.round(value).toLocaleString('ru-RU')} ₽`

export default function DiscountPage() {
  const location = useLocation()
  const initial = getHistorySearchParams()
  const [originalPrice, setOriginalPrice] = useState(() => readNumberParam(initial, 'originalPrice', 5000))
  const [discountPercent, setDiscountPercent] = useState(() => readNumberParam(initial, 'discountPercent', 20))
  const result = calculateDiscount({ originalPrice, discountPercent })

  useHistorySync({
    calculatorLabel: 'Скидка',
    calculatorUrl: location.pathname,
    calculatorParams: { originalPrice, discountPercent },
    summary: `${fmt(result.finalPrice)} после скидки ${discountPercent}%`,
    triggerKey: `${originalPrice}|${discountPercent}|${result.finalPrice}`,
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
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Калькулятор скидки онлайн</h1>
          <p className="max-w-3xl text-sm leading-6 text-[hsl(var(--fg-muted))]">
            Посчитайте цену со скидкой, размер экономии и итоговую стоимость товара.
          </p>
        </section>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput label="Цена до скидки, ₽" value={originalPrice} onChange={setOriginalPrice} min={0} integer />
              <NumberInput label="Скидка, %" value={discountPercent} onChange={setDiscountPercent} min={0} max={100} step={0.1} />
            </div>
          </div>
          <InfoCard spacing="space-y-4">
            <ResultRow label="Цена со скидкой" value={fmt(result.finalPrice)} color="emerald" size="2xl" />
            <Divider />
            <ResultRow label="Экономия" value={fmt(result.discountAmount)} color="amber" size="lg" />
            <Divider />
            <ResultRow label="Скидка" value={`${result.savingsPercent.toFixed(1)}%`} />
          </InfoCard>
        </section>
        <AdBlock blockId={AD_SLOTS.result} className="mt-5" />
        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </main>
    </AppLayout>
  )
}
