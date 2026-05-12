import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { calculateNdfl } from '@/calculators/ndfl'
import type { NdflDirection, NdflRate } from '@/calculators/ndfl'
import { EmbedButton } from '@/components/EmbedButton'
import { useHistorySync } from '@/hooks/useHistorySync'
import { NumberInput, ResultRow, InfoCard, Divider, selectCls } from '@/components/ui'

const fmt = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`

const CHILDREN_OPTIONS = [
  { value: 1, label: '1 ребёнок (вычет 1 400 ₽)' },
  { value: 2, label: '2 детей (вычет 2 800 ₽)' },
  { value: 3, label: '3 и более (вычет 5 800 ₽)' },
]

export default function NdflPage() {
  const [direction, setDirection] = useState<NdflDirection>('gross_to_net')
  const [amount, setAmount] = useState<number>(100000)
  const [rate, setRate] = useState<NdflRate>(13)
  const [hasChildren, setHasChildren] = useState(false)
  const [childrenCount, setChildrenCount] = useState(1)

  const result = calculateNdfl({ amount, rate, direction, hasChildren, childrenCount })
  const taxBase = Math.max(0, result.grossIncome - result.deduction)

  useHistorySync({
    calculatorLabel: 'НДФЛ',
    calculatorUrl: '/ndfl',
    summary: `НДФЛ ${rate}%: ${Math.round(result.taxAmount).toLocaleString('ru-RU')} ₽, на руки ${Math.round(result.netIncome).toLocaleString('ru-RU')} ₽`,
    triggerKey: `${result.taxAmount}|${result.netIncome}`,
    delayMs: 0,
  })

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
          <NumberInput
            label={direction === 'gross_to_net' ? 'Зарплата до вычета, ₽' : 'Сумма на руки, ₽'}
            value={amount}
            onChange={setAmount}
            min={0}
            ariaLabel="Сумма"
          />
        </div>

        {/* Rate */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1 text-[hsl(var(--fg-muted))] uppercase tracking-wide">
            Ставка НДФЛ
          </label>
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
              {CHILDREN_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* Results */}
        <InfoCard>
          <ResultRow label="Доход до налога" value={fmt(result.grossIncome)} />
          {hasChildren && result.deduction > 0 && (
            <>
              <Divider />
              <ResultRow label="Стандартный вычет" value={fmt(result.deduction)} dimmed />
              <Divider />
              <ResultRow label="Налоговая база" value={fmt(taxBase)} dimmed />
            </>
          )}
          <Divider />
          <ResultRow label={`НДФЛ ${rate}%`} value={fmt(result.taxAmount)} color="amber" />
          <Divider />
          <ResultRow label="На руки" value={fmt(result.netIncome)} color="emerald" size="2xl" />
          <Divider />
          <ResultRow
            label="Эффективная ставка"
            value={`${result.effectiveRate.toFixed(1)}%`}
            color="muted"
            size="sm"
            bold={false}
            medium
          />
        </InfoCard>
      </div>
    </AppLayout>
  )
}
