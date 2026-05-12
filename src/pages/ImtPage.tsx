import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateImt } from '@/calculators/imt'
import type { ImtResult } from '@/calculators/imt'
import { useHistorySync } from '@/hooks/useHistorySync'
import { NumberInput, InfoCard, labelCls } from '@/components/ui'

const categoryColorMap: Record<ImtResult['categoryColor'], string> = {
  blue: 'text-blue-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
}

function BmiScale({ bmi }: { bmi: number }) {
  // Scale from 15 to 40
  const min = 15
  const max = 40
  const pct = Math.min(100, Math.max(0, ((bmi - min) / (max - min)) * 100))

  return (
    <div className="mt-4">
      <div className="relative h-4 rounded-full overflow-hidden flex mb-1">
        <div className="bg-blue-500/60" style={{ width: '14%' }} />
        <div className="bg-sky-400/60" style={{ width: '14%' }} />
        <div className="bg-emerald-500/60" style={{ width: '26%' }} />
        <div className="bg-amber-500/60" style={{ width: '20%' }} />
        <div className="bg-orange-500/60" style={{ width: '13%' }} />
        <div className="bg-red-500/60" style={{ width: '13%' }} />
      </div>
      <div className="relative h-2 mb-1">
        <div
          className="absolute top-0 w-3 h-3 rounded-full bg-white border-2 border-[hsl(var(--bg-card))] shadow -translate-x-1/2 -translate-y-1"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[hsl(var(--fg-muted))]">
        <span>16</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>35</span>
        <span>40+</span>
      </div>
    </div>
  )
}

export default function ImtPage() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(175)
  const [age, setAge] = useState(30)
  const [sex, setSex] = useState<'male' | 'female'>('male')

  const result = calculateImt({ weight, height, age, sex })

  useHistorySync({
    calculatorLabel: 'ИМТ',
    calculatorUrl: '/imt',
    summary: `ИМТ ${result.bmi.toFixed(1)} — ${result.category}`,
    triggerKey: `${result.bmi}|${result.category}`,
    delayMs: 0,
  })

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Индекс массы тела (ИМТ)</h1>
            <p className="text-sm text-[hsl(var(--fg-muted))]">Узнайте свой ИМТ и норму веса</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <NumberInput label="Вес, кг" value={weight} onChange={setWeight} min={1} max={300} fallback={1} />
          <NumberInput label="Рост, см" value={height} onChange={setHeight} min={50} max={250} fallback={50} />
        </div>

        <div className="mb-4">
          <NumberInput label="Возраст" value={age} onChange={setAge} min={1} max={120} integer fallback={1} />
        </div>

        <div className="mb-6">
          <label className={labelCls}>Пол</label>
          <div className="flex gap-2">
            {(['male', 'female'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSex(s)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                  sex === s
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                    : 'border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--fg-muted))]'
                }`}
              >
                {s === 'male' ? 'Мужской' : 'Женский'}
              </button>
            ))}
          </div>
        </div>

        <InfoCard spacing="">
          {/* BMI value */}
          <div className="text-center mb-4">
            <div className={`text-5xl font-bold tabular mb-1 ${categoryColorMap[result.categoryColor]}`}>
              {result.bmi.toFixed(1)}
            </div>
            <div className={`text-base font-semibold ${categoryColorMap[result.categoryColor]}`}>
              {result.category}
            </div>
          </div>

          <BmiScale bmi={result.bmi} />

          <div className="border-t border-[hsl(var(--border))] mt-5 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[hsl(var(--fg-muted))]">Идеальный вес</span>
              <span className="text-sm font-semibold tabular text-[hsl(var(--fg))]">
                {Math.round(result.idealWeightMin)}–{Math.round(result.idealWeightMax)} кг
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[hsl(var(--fg-muted))]">Отклонение</span>
              <span className={`text-sm font-semibold tabular ${result.weightDiff === 0 ? 'text-emerald-400' : result.weightDiff > 0 ? 'text-amber-400' : 'text-blue-400'}`}>
                {result.weightDiff === 0
                  ? 'В норме ✓'
                  : result.weightDiff > 0
                  ? `Лишний вес: +${Math.round(result.weightDiff)} кг`
                  : `Дефицит: ${Math.round(Math.abs(result.weightDiff))} кг`}
              </span>
            </div>
          </div>
        </InfoCard>

        <AdBlock blockId={AD_SLOTS.result} className="mt-4" />

        {/* Category table */}
        <InfoCard padding="p-4" className="mt-4" spacing="">
          <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))] mb-3">Категории ИМТ</p>
          <div className="space-y-2">
            {[
              { range: '< 18.5', label: 'Дефицит', color: 'text-blue-400' },
              { range: '18.5–25', label: 'Норма', color: 'text-emerald-400' },
              { range: '25–30', label: 'Избыток', color: 'text-amber-400' },
              { range: '30+', label: 'Ожирение', color: 'text-red-400' },
            ].map(row => (
              <div key={row.range} className="flex items-center justify-between text-sm">
                <span className="text-[hsl(var(--fg-muted))] tabular">{row.range}</span>
                <span className={`font-medium ${row.color}`}>{row.label}</span>
              </div>
            ))}
          </div>
        </InfoCard>

        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </div>
    </AppLayout>
  )
}
