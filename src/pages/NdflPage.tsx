import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { calculateNdfl } from '@/calculators/ndfl'
import type { NdflDirection, NdflRate } from '@/calculators/ndfl'
import { saveToHistory } from '@/utils/history'
import { EmbedButton } from '@/components/EmbedButton'

const inputCls = 'w-full rounded-lg border border-[hsl(var(--border))] px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular'
const labelCls = 'block text-xs font-medium mb-1 text-[hsl(var(--fg-muted))] uppercase tracking-wide'
const selectCls = `${inputCls} cursor-pointer`

function ResultRow({ label, value, highlight, accent, negative, dimmed }: {
  label: string
  value: number
  highlight?: boolean
  accent?: boolean
  negative?: boolean
  dimmed?: boolean
}) {
  const color = highlight
    ? 'text-emerald-400'
    : accent
    ? 'text-amber-400'
    : negative
    ? 'text-red-400'
    : 'text-[hsl(var(--fg))]'

  return (
    <div className={`flex items-center justify-between ${dimmed ? 'opacity-60' : ''}`}>
      <span className="text-sm text-[hsl(var(--fg-muted))]">{label}</span>
      <span className={`text-base font-bold tabular ${color}`}>
        {Math.round(value).toLocaleString('ru-RU')} ₽
      </span>
    </div>
  )
}

export default function NdflPage() {
  const [direction, setDirection] = useState<NdflDirection>('gross_to_net')
  const [amount, setAmount] = useState<number>(100000)
  const [rate, setRate] = useState<NdflRate>(13)
  const [hasChildren, setHasChildren] = useState(false)
  const [childrenCount, setChildrenCount] = useState(1)

  useEffect(() => {
    document.title = 'Калькулятор НДФЛ — КалкПортал'
  }, [])

  const result = calculateNdfl({ amount, rate, direction, hasChildren, childrenCount })
  const taxBase = Math.max(0, result.grossIncome - result.deduction)

  useEffect(() => {
    saveToHistory({
      calculatorLabel: 'НДФЛ',
      calculatorUrl: '/ndfl',
      summary: `НДФЛ ${rate}%: ${Math.round(result.taxAmount).toLocaleString('ru-RU')} ₽, на руки ${Math.round(result.netIncome).toLocaleString('ru-RU')} ₽`,
    })
  }, [result])

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Калькулятор НДФЛ</h1>
            <p className="text-sm text-[hsl(var(--fg-muted))]">Налог на доходы физических лиц</p>
          </div>
          <EmbedButton path="/ndfl" title="Калькулятор НДФЛ" />
        </div>

        {/* Direction toggle */}
        <div className="flex gap-2 mb-5">
          {([
            { value: 'gross_to_net', label: 'С зарплаты' },
            { value: 'net_to_gross', label: 'К зарплате' },
          ] as { value: NdflDirection; label: string }[]).map(opt => (
            <button
              key={opt.value}
              onClick={() => setDirection(opt.value)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                direction === opt.value
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                  : 'border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--fg-muted))]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className={labelCls}>
            {direction === 'gross_to_net' ? 'Зарплата до вычета, ₽' : 'Сумма на руки, ₽'}
          </label>
          <input
            type="number"
            className={inputCls}
            value={amount}
            min={0}
            onChange={e => setAmount(parseFloat(e.target.value) || 0)}
            aria-label="Сумма"
          />
        </div>

        {/* Rate */}
        <div className="mb-4">
          <label className={labelCls}>Ставка НДФЛ</label>
          <div className="flex gap-2">
            {([13, 15, 30] as NdflRate[]).map(r => (
              <button
                key={r}
                onClick={() => setRate(r)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                  rate === r
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-400'
                    : 'border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--fg-muted))]'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>

        {/* Children */}
        <div className="mb-6 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasChildren}
              onChange={e => setHasChildren(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded"
            />
            <span className="text-sm">Есть дети (стандартный вычет)</span>
          </label>
          {hasChildren && (
            <select
              className={selectCls}
              value={childrenCount}
              onChange={e => setChildrenCount(parseInt(e.target.value))}
              aria-label="Количество детей"
            >
              <option value={1}>1 ребёнок (вычет 1 400 ₽)</option>
              <option value={2}>2 детей (вычет 2 800 ₽)</option>
              <option value={3}>3 и более (вычет 5 800 ₽)</option>
            </select>
          )}
        </div>

        {/* Results */}
        <div className="glass rounded-2xl p-6 space-y-3">
          <ResultRow label="Доход до налога" value={result.grossIncome} />
          {hasChildren && result.deduction > 0 && (
            <>
              <div className="border-t border-[hsl(var(--border))]" />
              <ResultRow label="Стандартный вычет" value={result.deduction} dimmed />
              <div className="border-t border-[hsl(var(--border))]" />
              <ResultRow label="Налоговая база" value={taxBase} dimmed />
            </>
          )}
          <div className="border-t border-[hsl(var(--border))]" />
          <ResultRow label={`НДФЛ ${rate}%`} value={result.taxAmount} accent />
          <div className="border-t border-[hsl(var(--border))]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[hsl(var(--fg-muted))]">На руки</span>
            <span className="text-2xl font-bold tabular text-emerald-400">
              {Math.round(result.netIncome).toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <div className="border-t border-[hsl(var(--border))]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[hsl(var(--fg-muted))]">Эффективная ставка</span>
            <span className="text-sm font-medium tabular text-[hsl(var(--fg-muted))]">
              {result.effectiveRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
