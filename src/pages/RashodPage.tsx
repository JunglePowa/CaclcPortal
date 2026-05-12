import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { calculateRashod } from '@/calculators/rashod'
import { EmbedButton } from '@/components/EmbedButton'
import { useHistorySync } from '@/hooks/useHistorySync'
import { NumberInput, ResultRow, InfoCard, Divider } from '@/components/ui'

const fmt = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`

export default function RashodPage() {
  const [fuelConsumed, setFuelConsumed] = useState(45)
  const [distance, setDistance] = useState(500)
  const [fuelPrice, setFuelPrice] = useState(57)

  const result = calculateRashod({ fuelConsumed, distance, fuelPrice })

  useHistorySync({
    calculatorLabel: 'Расход топлива',
    calculatorUrl: '/rashod-topliva',
    summary: `${result.per100km.toFixed(1)} л/100км, итого ${Math.round(result.totalCost).toLocaleString('ru-RU')} ₽`,
    triggerKey: `${result.per100km}|${result.totalCost}`,
    delayMs: 0,
  })

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
          <NumberInput
            label="Потрачено топлива, л"
            value={fuelConsumed}
            onChange={setFuelConsumed}
            min={0}
            step={0.1}
          />
        </div>

        <div className="mb-4">
          <NumberInput
            label="Расстояние, км"
            value={distance}
            onChange={setDistance}
            min={1}
            fallback={1}
          />
        </div>

        <div className="mb-6">
          <NumberInput
            label="Цена топлива, ₽/л"
            value={fuelPrice}
            onChange={setFuelPrice}
            min={0}
            step={0.1}
          />
        </div>

        <InfoCard spacing="space-y-4">
          <ResultRow
            label="Расход"
            value={`${result.per100km.toFixed(1)} л/100км`}
            color="emerald"
            size="2xl"
          />
          <Divider />
          <ResultRow
            label="Стоимость"
            value={`${Math.round(result.costPer100km).toLocaleString('ru-RU')} ₽/100км`}
            size="lg"
          />
          <Divider />
          <ResultRow label="Итого" value={fmt(result.totalCost)} color="amber" size="lg" />
          <Divider />
          <ResultRow label="На км" value={`${result.costPerKm.toFixed(2)} ₽/км`} size="lg" />
        </InfoCard>
      </div>
    </AppLayout>
  )
}
