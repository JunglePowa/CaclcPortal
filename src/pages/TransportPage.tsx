import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateTransport } from '@/calculators/transport'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readNumberParam } from '@/utils/historyParams'
import { ResultRow, InfoCard, Divider, Select, SliderInput } from '@/components/ui'

const fmt = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`

const LUXURY_OPTIONS = [
  { label: 'Нет (1×)', value: 1.0 },
  { label: '1.1× (от 3 до 5 лет, 3–5 млн)', value: 1.1 },
  { label: '1.3× (до 3 лет, 3–5 млн)', value: 1.3 },
  { label: '3× (от 10 млн)', value: 3.0 },
]

const REGION_OPTIONS = [
  { label: 'Москва', value: 1.0 },
  { label: 'Санкт-Петербург', value: 1.0 },
  { label: 'Московская обл.', value: 1.0 },
  { label: 'Другой регион (базовый)', value: 1.0 },
]

const MONTHS_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1).map(m => ({
  value: m,
  label: `${m} ${m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев'}`,
}))

export default function TransportPage() {
  const initial = getHistorySearchParams()
  const [horsePower, setHorsePower] = useState(() => readNumberParam(initial, 'horsePower', 150))
  const [monthsOwned, setMonthsOwned] = useState(() => readNumberParam(initial, 'monthsOwned', 12))
  const [regionRate, setRegionRate] = useState(() => readNumberParam(initial, 'regionRate', 1.0))
  const [luxuryCoeff, setLuxuryCoeff] = useState(() => readNumberParam(initial, 'luxuryCoeff', 1.0))

  const result = calculateTransport({ horsePower, monthsOwned, regionRate, luxuryCoeff })

  useHistorySync({
    calculatorLabel: 'Транспортный налог',
    calculatorUrl: '/transport-tax',
    calculatorParams: { horsePower, monthsOwned, regionRate, luxuryCoeff },
    summary: `${horsePower} л.с., налог ${Math.round(result.actualTax).toLocaleString('ru-RU')} ₽`,
    triggerKey: `${horsePower}|${monthsOwned}|${regionRate}|${luxuryCoeff}|${result.actualTax}`,
    delayMs: 0,
  })

  // REGION_OPTIONS use numeric values that can collide; use labels for keying.
  return (
    <AppLayout>
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Транспортный налог</h1>
            <p className="text-sm text-[hsl(var(--fg-muted))]">Расчёт по мощности двигателя</p>
          </div>
        </div>

        <div className="mb-4">
          <SliderInput
            label="Мощность двигателя, л.с."
            value={horsePower}
            onChange={setHorsePower}
            min={50}
            max={500}
            step={1}
            numberMin={1}
            numberMax={1000}
            integer
          />
        </div>

        <div className="mb-4">
          <Select
            label="Месяцев владения"
            value={monthsOwned}
            onChange={setMonthsOwned}
            options={MONTHS_OPTIONS}
            numeric
          />
        </div>

        <div className="mb-4">
          <Select
            label="Регион"
            value={regionRate}
            onChange={setRegionRate}
            options={REGION_OPTIONS}
            numeric
            integer={false}
          />
          <p className="text-xs text-[hsl(var(--fg-muted))] mt-1">
            Ставки указаны для Москвы. В других регионах могут отличаться.
          </p>
        </div>

        <div className="mb-6">
          <Select
            label="Повышающий коэффициент"
            value={luxuryCoeff}
            onChange={setLuxuryCoeff}
            options={LUXURY_OPTIONS}
            numeric
            integer={false}
          />
        </div>

        <InfoCard spacing="space-y-4">
          <ResultRow label="Ставка" value={`${result.baseRate} ₽/л.с.`} size="lg" />
          <Divider />
          <ResultRow label="Налог за год" value={fmt(result.annualTax)} size="lg" />
          <Divider />
          <ResultRow label="Налог к уплате" value={fmt(result.actualTax)} color="emerald" size="2xl" />
        </InfoCard>

        <AdBlock blockId={AD_SLOTS.result} className="mt-4" />

        <p className="text-xs text-[hsl(var(--fg-muted))] mt-4 text-center">
          Транспортный налог уплачивается до 1 декабря следующего года
        </p>

        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </div>
    </AppLayout>
  )
}
