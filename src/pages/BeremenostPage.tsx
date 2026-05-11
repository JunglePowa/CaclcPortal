import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { calculateBeremennost } from '@/calculators/beremennost'
import { saveToHistory } from '@/utils/history'
import { EmbedButton } from '@/components/EmbedButton'

const inputCls = 'w-full rounded-lg border border-[hsl(var(--border))] px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular'
const labelCls = 'block text-xs font-medium mb-1 text-[hsl(var(--fg-muted))] uppercase tracking-wide'

const today = new Date().toISOString().split('T')[0]

export default function BeremenostPage() {
  const [lastPeriodDate, setLastPeriodDate] = useState('')
  const [cycleLength, setCycleLength] = useState(28)

  useEffect(() => {
    document.title = 'Калькулятор беременности — КалкПортал'
  }, [])

  const result = calculateBeremennost({ lastPeriodDate, cycleLength })

  useEffect(() => {
    if (!result) return
    saveToHistory({
      calculatorLabel: 'Беременность',
      calculatorUrl: '/beremennost',
      summary: `${result.currentWeek} нед, ПДР ${result.dueDate}`,
    })
  }, [result])

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
          <EmbedButton path="/beremennost" title="Калькулятор беременности" />
        </div>

        <div className="mb-4">
          <label className={labelCls}>Дата последней менструации</label>
          <input
            type="date"
            className={inputCls}
            value={lastPeriodDate}
            max={today}
            onChange={e => setLastPeriodDate(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className={labelCls}>Длина цикла, дней</label>
          <input
            type="number"
            className={inputCls}
            value={cycleLength}
            min={21}
            max={45}
            onChange={e => setCycleLength(parseInt(e.target.value) || 28)}
          />
        </div>

        {result ? (
          <>
            {/* Main block */}
            <div className="glass rounded-2xl p-6 space-y-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[hsl(var(--fg-muted))]">Срок</span>
                <span className="text-2xl font-bold tabular text-emerald-400">
                  {result.currentWeek} нед. {result.currentDay} дн.
                </span>
              </div>
              <div className="border-t border-[hsl(var(--border))]" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-[hsl(var(--fg-muted))]">Триместр</span>
                <span className="text-lg font-bold text-[hsl(var(--fg))]">
                  {result.trimester}-й
                </span>
              </div>
              <div className="border-t border-[hsl(var(--border))]" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-[hsl(var(--fg-muted))]">ПДР</span>
                <span className="text-lg font-bold tabular text-rose-400">
                  {result.dueDate}
                </span>
              </div>
              <div className="border-t border-[hsl(var(--border))]" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-[hsl(var(--fg-muted))]">Осталось</span>
                <span className="text-lg font-bold tabular text-[hsl(var(--fg))]">
                  {result.daysLeft} дней
                </span>
              </div>

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
            </div>

            {/* Key dates */}
            <div className="glass rounded-2xl p-6 space-y-3 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))] mb-2">Ключевые даты</p>
              {[
                { label: 'Зачатие', value: result.conceptionDate },
                { label: 'Конец 1-го триместра', value: result.firstTrimesterEnd },
                { label: 'Конец 2-го триместра', value: result.secondTrimesterEnd },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-[hsl(var(--fg-muted))]">{row.label}</span>
                  <span className="text-sm font-semibold tabular text-[hsl(var(--fg))]">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Screenings */}
            <div className="glass rounded-2xl p-6 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))] mb-2">Скрининги</p>
              {result.screenings.map(s => (
                <div key={s.week} className="flex items-center justify-between">
                  <span className="text-sm text-[hsl(var(--fg-muted))]">{s.label}</span>
                  <span className="text-sm font-semibold tabular text-rose-400">неделя {s.week}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="glass rounded-2xl p-8 text-center text-[hsl(var(--fg-muted))] text-sm">
            Укажите дату последней менструации для расчёта
          </div>
        )}
      </div>
    </AppLayout>
  )
}
