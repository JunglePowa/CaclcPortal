import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { calculateTransport } from '@/calculators/transport'
import { useHistorySync } from '@/hooks/useHistorySync'
import { ResultRow, InfoCard, Divider, Select, labelCls, inputCls } from '@/components/ui'

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
  const [horsePower, setHorsePower] = useState(150)
  const [monthsOwned, setMonthsOwned] = useState(12)
  const [regionRate, setRegionRate] = useState(1.0)
  const [luxuryCoeff, setLuxuryCoeff] = useState(1.0)

  const result = calculateTransport({ horsePower, monthsOwned, regionRate, luxuryCoeff })

  useHistorySync({
    calculatorLabel: 'Транспортный налог',
    calculatorUrl: '/transportnyj-nalog',
    summary: `${horsePower} л.с., налог ${Math.round(result.actualTax).toLocaleString('ru-RU')} ₽`,
    triggerKey: `${horsePower}|${result.actualTax}`,
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
          <label className={labelCls}>Мощность двигателя, л.с.</label>
          <div className="flex gap-2 items-center">
            <input
              type="range"
              min={50}
              max={500}
              value={horsePower}
              onChange={e => setHorsePower(parseInt(e.target.value))}
              className="flex-1 accent-emerald-500"
            />
            <input
              type="number"
              className={`${inputCls} w-24 flex-shrink-0`}
              value={horsePower}
              min={1}
              max={1000}
              onChange={e => setHorsePower(parseInt(e.target.value) || 1)}
            />
          </div>
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
          <label className={labelCls}>Регион</label>
          <select
            className={`${inputCls} cursor-pointer`}
            value={regionRate}
            onChange={e => setRegionRate(parseFloat(e.target.value))}
          >
            {REGION_OPTIONS.map(opt => (
              <option key={opt.label} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p className="text-xs text-[hsl(var(--fg-muted))] mt-1">
            Ставки указаны для Москвы. В других регионах могут отличаться.
          </p>
        </div>

        <div className="mb-6">
          <label className={labelCls}>Повышающий коэффициент</label>
          <select
            className={`${inputCls} cursor-pointer`}
            value={luxuryCoeff}
            onChange={e => setLuxuryCoeff(parseFloat(e.target.value))}
          >
            {LUXURY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <InfoCard spacing="space-y-4">
          <ResultRow label="Ставка" value={`${result.baseRate} ₽/л.с.`} size="lg" />
          <Divider />
          <ResultRow label="Налог за год" value={fmt(result.annualTax)} size="lg" />
          <Divider />
          <ResultRow label="Налог к уплате" value={fmt(result.actualTax)} color="emerald" size="2xl" />
        </InfoCard>

        <p className="text-xs text-[hsl(var(--fg-muted))] mt-4 text-center">
          Транспортный налог уплачивается до 1 декабря следующего года
        </p>
      </div>
    </AppLayout>
  )
}
