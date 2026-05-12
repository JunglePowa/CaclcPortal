import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateBeremennost } from '@/calculators/beremennost'
import { useHistorySync } from '@/hooks/useHistorySync'
import { NumberInput, ResultRow, InfoCard, Divider, DateInput } from '@/components/ui'

const today = new Date().toISOString().split('T')[0]

export default function BeremenostPage() {
  const [lastPeriodDate, setLastPeriodDate] = useState('')
  const [cycleLength, setCycleLength] = useState(28)

  const result = calculateBeremennost({ lastPeriodDate, cycleLength })

  useHistorySync({
    calculatorLabel: 'Беременность',
    calculatorUrl: '/beremennost',
    summary: result ? `${result.currentWeek} нед, ПДР ${result.dueDate}` : '',
    triggerKey: result ? `${result.currentWeek}|${result.dueDate}` : 'empty',
    delayMs: 0,
  })

  const progress = result
    ? Math.min(100, ((result.currentWeek * 7 + result.currentDay) / 280) * 100)
    : 0

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Калькулятор беременности</h1>
            <p className="text-sm text-[hsl(var(--fg-muted))]">Рассчитайте срок и дату родов</p>
          </div>
        </div>

        <div className="mb-4">
          <DateInput
            label="Дата последней менструации"
            value={lastPeriodDate}
            onChange={setLastPeriodDate}
            max={today}
          />
        </div>

        <div className="mb-6">
          <NumberInput
            label="Длина цикла, дней"
            value={cycleLength}
            onChange={setCycleLength}
            min={21}
            max={45}
            integer
            fallback={28}
          />
        </div>

        {result ? (
          <>
            {/* Main block */}
            <InfoCard className="mb-4" spacing="space-y-4">
              <ResultRow
                label="Срок"
                value={`${result.currentWeek} нед. ${result.currentDay} дн.`}
                color="emerald"
                size="2xl"
              />
              <Divider />
              <ResultRow label="Триместр" value={`${result.trimester}-й`} size="lg" />
              <Divider />
              <ResultRow label="ПДР" value={result.dueDate} color="rose" size="lg" />
              <Divider />
              <ResultRow label="Осталось" value={`${result.daysLeft} дней`} size="lg" />

              {/* Progress bar */}
              <div className="pt-2">
                <div className="h-3 rounded-full bg-[hsl(var(--border))]">
                  <div
                    className="h-full rounded-full bg-rose-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[hsl(var(--fg-muted))] mt-1">
                  <span>Начало</span>
                  <span>1-й</span>
                  <span>2-й</span>
                  <span>3-й</span>
                  <span>Роды</span>
                </div>
              </div>
            </InfoCard>

            <AdBlock blockId={AD_SLOTS.result} className="mb-4" />

            {/* Key dates */}
            <InfoCard title="Ключевые даты" className="mb-4">
              {[
                { label: 'Зачатие', value: result.conceptionDate },
                { label: 'Конец 1-го триместра', value: result.firstTrimesterEnd },
                { label: 'Конец 2-го триместра', value: result.secondTrimesterEnd },
              ].map(row => (
                <ResultRow key={row.label} label={row.label} value={row.value} size="sm" weight="semibold" />
              ))}
            </InfoCard>

            {/* Screenings */}
            <InfoCard title="Скрининги">
              {result.screenings.map(s => (
                <ResultRow
                  key={s.week}
                  label={s.label}
                  value={`неделя ${s.week}`}
                  color="rose"
                  size="sm"
                  bold={false}
                  medium
                />
              ))}
            </InfoCard>
          </>
        ) : (
          <div className="glass rounded-2xl p-8 text-center text-[hsl(var(--fg-muted))] text-sm">
            Укажите дату последней менструации для расчёта
          </div>
        )}

        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </div>
    </AppLayout>
  )
}
