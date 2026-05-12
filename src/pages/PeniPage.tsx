import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { calculatePeni } from '@/calculators/peni'
import { useHistorySync } from '@/hooks/useHistorySync'
import { NumberInput, ResultRow, InfoCard, Divider, DateInput } from '@/components/ui'

const fmt = (v: number) => `${v.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽`

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function PeniPage() {
  const [debt, setDebt] = useState(100000)
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState(todayISO())
  const [keyRate, setKeyRate] = useState(16)
  const [isIndividual, setIsIndividual] = useState(true)

  const result = calculatePeni({ debt, startDate, endDate, keyRate, isIndividual })

  useHistorySync({
    calculatorLabel: 'Пени',
    calculatorUrl: '/peni',
    summary: `${result.days} дн., пени ${fmt(result.total)}`,
    triggerKey: `${result.total}|${result.days}`,
  })

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Пени по налогам</h1>
            <p className="text-sm text-[hsl(var(--fg-muted))]">Расчёт по ст. 75 НК РФ</p>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          {[
            { v: true, label: 'Физлицо' },
            { v: false, label: 'Юрлицо' },
          ].map(opt => (
            <button
              key={String(opt.v)}
              onClick={() => setIsIndividual(opt.v)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                isIndividual === opt.v
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                  : 'border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--fg-muted))]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-6">
          <NumberInput
            label="Сумма недоимки, ₽"
            value={debt}
            onChange={setDebt}
            min={0}
            ariaLabel="Сумма недоимки"
          />

          <DateInput
            label="Дата возникновения долга"
            value={startDate}
            onChange={setStartDate}
          />

          <DateInput
            label="Дата уплаты"
            value={endDate}
            onChange={setEndDate}
          />

          <NumberInput
            label="Ключевая ставка ЦБ, %"
            value={keyRate}
            onChange={setKeyRate}
            min={0}
            step={0.25}
            ariaLabel="Ключевая ставка ЦБ"
          />
        </div>

        <InfoCard spacing="space-y-4">
          <ResultRow label="Дней просрочки" value={result.days} size="lg" />
          <Divider />
          {result.breakdown.map((row, i) => (
            <ResultRow
              key={i}
              label={row.label}
              value={fmt(row.amount)}
              size="base"
              color="amber"
            />
          ))}
          {result.breakdown.length > 0 && <Divider />}
          <ResultRow label="Итого пени" value={fmt(result.total)} size="2xl" color="emerald" />
        </InfoCard>

        <p className="text-xs text-[hsl(var(--fg-muted))] mt-4 text-center">
          Для физлиц всегда 1/300 ставки ЦБ. Для юрлиц с 31-го дня — 1/150.
        </p>
      </div>
    </AppLayout>
  )
}
