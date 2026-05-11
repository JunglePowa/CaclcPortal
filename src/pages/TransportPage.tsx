import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { calculateTransport } from '@/calculators/transport'
import { saveToHistory } from '@/utils/history'
import { EmbedButton } from '@/components/EmbedButton'

const inputCls = 'w-full rounded-lg border border-[hsl(var(--border))] px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular'
const labelCls = 'block text-xs font-medium mb-1 text-[hsl(var(--fg-muted))] uppercase tracking-wide'
const selectCls = `${inputCls} cursor-pointer`

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

export default function TransportPage() {
  const [horsePower, setHorsePower] = useState(150)
  const [monthsOwned, setMonthsOwned] = useState(12)
  const [regionRate, setRegionRate] = useState(1.0)
  const [luxuryCoeff, setLuxuryCoeff] = useState(1.0)

  useEffect(() => {
    document.title = 'Калькулятор транспортного налога — КалкПортал'
  }, [])

  const result = calculateTransport({ horsePower, monthsOwned, regionRate, luxuryCoeff })

  useEffect(() => {
    saveToHistory({
      calculatorLabel: 'Транспортный налог',
      calculatorUrl: '/transportnyj-nalog',
      summary: `${horsePower} л.с., налог ${Math.round(result.actualTax).toLocaleString('ru-RU')} ₽`,
    })
  }, [result])

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Транспортный налог</h1>
            <p className="text-sm text-[hsl(var(--fg-muted))]">Расчёт по мощности двигателя</p>
          </div>
          <EmbedButton path="/transportnyj-nalog" title="Калькулятор транспортного налога" />
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
          <label className={labelCls}>Месяцев владения</label>
          <select
            className={selectCls}
            value={monthsOwned}
            onChange={e => setMonthsOwned(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m} {m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев'}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className={labelCls}>Регион</label>
          <select
            className={selectCls}
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
            className={selectCls}
            value={luxuryCoeff}
            onChange={e => setLuxuryCoeff(parseFloat(e.target.value))}
          >
            {LUXURY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[hsl(var(--fg-muted))]">Ставка</span>
            <span className="text-lg font-bold tabular text-[hsl(var(--fg))]">
              {result.baseRate} ₽/л.с.
            </span>
          </div>
          <div className="border-t border-[hsl(var(--border))]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[hsl(var(--fg-muted))]">Налог за год</span>
            <span className="text-lg font-bold tabular text-[hsl(var(--fg))]">
              {Math.round(result.annualTax).toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <div className="border-t border-[hsl(var(--border))]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[hsl(var(--fg-muted))]">Налог к уплате</span>
            <span className="text-2xl font-bold tabular text-emerald-400">
              {Math.round(result.actualTax).toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        <p className="text-xs text-[hsl(var(--fg-muted))] mt-4 text-center">
          Транспортный налог уплачивается до 1 декабря следующего года
        </p>
      </div>
    </AppLayout>
  )
}
