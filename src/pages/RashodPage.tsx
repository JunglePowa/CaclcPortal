import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { calculateRashod } from '@/calculators/rashod'
import { saveToHistory } from '@/utils/history'
import { EmbedButton } from '@/components/EmbedButton'

const inputCls = 'w-full rounded-lg border border-[hsl(var(--border))] px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular'
const labelCls = 'block text-xs font-medium mb-1 text-[hsl(var(--fg-muted))] uppercase tracking-wide'

export default function RashodPage() {
  const [fuelConsumed, setFuelConsumed] = useState(45)
  const [distance, setDistance] = useState(500)
  const [fuelPrice, setFuelPrice] = useState(57)

  useEffect(() => {
    document.title = 'Калькулятор расхода топлива — КалкПортал'
  }, [])

  const result = calculateRashod({ fuelConsumed, distance, fuelPrice })

  useEffect(() => {
    saveToHistory({
      calculatorLabel: 'Расход топлива',
      calculatorUrl: '/rashod-topliva',
      summary: `${result.per100km.toFixed(1)} л/100км, итого ${Math.round(result.totalCost).toLocaleString('ru-RU')} ₽`,
    })
  }, [result])

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Расход топлива</h1>
            <p className="text-sm text-[hsl(var(--fg-muted))]">Рассчитайте расход и стоимость поездки</p>
          </div>
          <EmbedButton path="/rashod-topliva" title="Калькулятор расхода топлива" />
        </div>

        <div className="mb-4">
          <label className={labelCls}>Потрачено топлива, л</label>
          <input
            type="number"
            className={inputCls}
            value={fuelConsumed}
            min={0}
            step={0.1}
            onChange={e => setFuelConsumed(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="mb-4">
          <label className={labelCls}>Расстояние, км</label>
          <input
            type="number"
            className={inputCls}
            value={distance}
            min={1}
            onChange={e => setDistance(parseFloat(e.target.value) || 1)}
          />
        </div>

        <div className="mb-6">
          <label className={labelCls}>Цена топлива, ₽/л</label>
          <input
            type="number"
            className={inputCls}
            value={fuelPrice}
            min={0}
            step={0.1}
            onChange={e => setFuelPrice(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[hsl(var(--fg-muted))]">Расход</span>
            <span className="text-2xl font-bold tabular text-emerald-400">
              {result.per100km.toFixed(1)} л/100км
            </span>
          </div>
          <div className="border-t border-[hsl(var(--border))]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[hsl(var(--fg-muted))]">Стоимость</span>
            <span className="text-lg font-bold tabular text-[hsl(var(--fg))]">
              {Math.round(result.costPer100km).toLocaleString('ru-RU')} ₽/100км
            </span>
          </div>
          <div className="border-t border-[hsl(var(--border))]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[hsl(var(--fg-muted))]">Итого</span>
            <span className="text-lg font-bold tabular text-amber-400">
              {Math.round(result.totalCost).toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <div className="border-t border-[hsl(var(--border))]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[hsl(var(--fg-muted))]">На км</span>
            <span className="text-lg font-bold tabular text-[hsl(var(--fg))]">
              {result.costPerKm.toFixed(2)} ₽/км
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
