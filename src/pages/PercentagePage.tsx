import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculatePercent, type PercentMode } from '@/calculators/percent'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readNumberParam } from '@/utils/historyParams'
import { NumberInput, ResultRow, InfoCard, Divider } from '@/components/ui'

const MODES: { mode: PercentMode; label: string; path: string; hint: string }[] = [
  { mode: 'percentOfNumber', label: 'Процент от числа', path: '/percentage/percent-of-number', hint: 'Сколько будет X% от числа' },
  { mode: 'addPercent', label: 'Прибавить %', path: '/percentage/add-percent', hint: 'Увеличить число на процент' },
  { mode: 'subtractPercent', label: 'Вычесть %', path: '/percentage/subtract-percent', hint: 'Уменьшить число на процент' },
  { mode: 'percentageChange', label: 'Изменение', path: '/percentage/percentage-change', hint: 'Рост или снижение в процентах' },
  { mode: 'whatPercent', label: 'Доля в %', path: '/percentage/what-percent', hint: 'Сколько процентов одно число от другого' },
]

const ROUTE_TO_MODE: Record<string, PercentMode> = {
  '/percentage': 'percentOfNumber',
  '/percentage/percent-of-number': 'percentOfNumber',
  '/percentage/add-percent': 'addPercent',
  '/percentage/subtract-percent': 'subtractPercent',
  '/percentage/percentage-change': 'percentageChange',
  '/percentage/what-percent': 'whatPercent',
}

function formatNumber(value: number, fractionDigits = 2) {
  return value.toLocaleString('ru-RU', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: Number.isInteger(value) ? 0 : Math.min(2, fractionDigits),
  })
}

function formatResult(mode: PercentMode, result: number) {
  if (mode === 'percentageChange' || mode === 'whatPercent') return `${formatNumber(result, 4)}%`
  return formatNumber(result, 4)
}

export default function PercentagePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const initial = getHistorySearchParams()
  const mode = ROUTE_TO_MODE[location.pathname] ?? 'percentOfNumber'
  const activeMode = MODES.find((item) => item.mode === mode) ?? MODES[0]

  const [value, setValue] = useState(() => readNumberParam(initial, 'value', 200))
  const [percent, setPercent] = useState(() => readNumberParam(initial, 'percent', 15))
  const [base, setBase] = useState(() => readNumberParam(initial, 'base', 100))
  const [changed, setChanged] = useState(() => readNumberParam(initial, 'changed', 125))
  const [part, setPart] = useState(() => readNumberParam(initial, 'part', 30))
  const [whole, setWhole] = useState(() => readNumberParam(initial, 'whole', 120))

  const params = useMemo(
    () => ({ value, percent, base, changed, part, whole }),
    [base, changed, part, percent, value, whole],
  )
  const result = calculatePercent(mode, params)
  const summary = `${activeMode.label}: ${formatResult(mode, result.result)}`

  useHistorySync({
    calculatorLabel: 'Калькулятор процентов',
    calculatorUrl: location.pathname,
    calculatorParams: params,
    summary,
    triggerKey: `${location.pathname}|${value}|${percent}|${base}|${changed}|${part}|${whole}|${result.result}`,
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
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Калькулятор процентов онлайн</h1>
          <p className="max-w-3xl text-sm leading-6 text-[hsl(var(--fg-muted))]">
            Посчитайте процент от числа, прибавьте или вычтите процент, найдите процентное изменение и долю одного числа от другого.
          </p>
        </section>

        <div className="mb-6 grid gap-2 sm:grid-cols-5" role="tablist" aria-label="Режимы калькулятора процентов">
          {MODES.map((item) => (
            <button
              key={item.mode}
              type="button"
              role="tab"
              aria-selected={mode === item.mode}
              onClick={() => navigate(item.path)}
              className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                mode === item.mode
                  ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-300'
                  : 'border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/45 text-[hsl(var(--fg-muted))] hover:border-emerald-500/45 hover:text-[hsl(var(--fg))]'
              }`}
            >
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className="mt-1 block text-xs opacity-80">{item.hint}</span>
            </button>
          ))}
        </div>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-5">
            {(mode === 'percentOfNumber' || mode === 'addPercent' || mode === 'subtractPercent') && (
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput label="Число" value={value} onChange={setValue} step={0.01} />
                <NumberInput label="Процент, %" value={percent} onChange={setPercent} step={0.01} />
              </div>
            )}

            {mode === 'percentageChange' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput label="Было" value={base} onChange={setBase} step={0.01} />
                <NumberInput label="Стало" value={changed} onChange={setChanged} step={0.01} />
              </div>
            )}

            {mode === 'whatPercent' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput label="Часть" value={part} onChange={setPart} step={0.01} />
                <NumberInput label="Целое" value={whole} onChange={setWhole} step={0.01} />
              </div>
            )}
          </div>

          <InfoCard spacing="space-y-4">
            <ResultRow
              label="Результат"
              value={formatResult(mode, result.result)}
              color="emerald"
              size="2xl"
            />
            <Divider />
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">Формула</p>
              <p className="text-sm text-[hsl(var(--fg-muted))]">{result.formula}</p>
            </div>
            <Divider />
            <p className="text-sm text-[hsl(var(--fg-muted))]">{result.explanation}</p>
          </InfoCard>
        </section>

        <AdBlock blockId={AD_SLOTS.result} className="mt-5" />
        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </main>
    </AppLayout>
  )
}
