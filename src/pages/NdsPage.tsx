import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { calculateNds } from '@/calculators/nds'
import type { NdsOperation, NdsRate } from '@/calculators/nds'
import { saveToHistory } from '@/utils/history'
import { EmbedButton } from '@/components/EmbedButton'

const inputCls = 'w-full rounded-lg border border-[hsl(var(--border))] px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular'

function ResultRow({ label, value, highlight, accent }: { label: string; value: number; highlight?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[hsl(var(--fg-muted))]">{label}</span>
      <span className={`text-lg font-bold tabular ${highlight ? 'text-emerald-400' : accent ? 'text-amber-400' : 'text-[hsl(var(--fg))]'}`}>
        {Math.round(value).toLocaleString('ru-RU')} ₽
      </span>
    </div>
  )
}

export default function NdsPage() {
  const [operation, setOperation] = useState<NdsOperation>('charge')
  const [amount, setAmount] = useState<number>(100000)
  const [rate, setRate] = useState<NdsRate>(20)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'Калькулятор НДС — КалкПортал'
  }, [])

  const result = calculateNds({ amount, rate, operation })

  useEffect(() => {
    saveToHistory({
      calculatorLabel: 'НДС',
      calculatorUrl: '/nds',
      summary: `НДС ${rate}%: ${Math.round(result.ndsAmount).toLocaleString('ru-RU')} ₽`,
    })
  }, [result])

  function handleCopy() {
    const text = [
      `Операция: ${operation === 'charge' ? 'Начислить НДС' : 'Выделить НДС'}`,
      `Ставка НДС: ${rate}%`,
      `Сумма без НДС: ${Math.round(result.amountWithoutNds).toLocaleString('ru-RU')} ₽`,
      `НДС ${rate}%: ${Math.round(result.ndsAmount).toLocaleString('ru-RU')} ₽`,
      `Сумма с НДС: ${Math.round(result.amountWithNds).toLocaleString('ru-RU')} ₽`,
    ].join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Калькулятор НДС</h1>
            <p className="text-sm text-[hsl(var(--fg-muted))]">Начислить или выделить НДС</p>
          </div>
          <EmbedButton path="/nds" title="Калькулятор НДС" />
        </div>

        {/* Operation toggle */}
        <div className="flex gap-2 mb-5">
          {(['charge', 'extract'] as NdsOperation[]).map(op => (
            <button
              key={op}
              onClick={() => setOperation(op)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                operation === op
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                  : 'border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--fg-muted))]'
              }`}
            >
              {op === 'charge' ? 'Начислить НДС' : 'Выделить НДС'}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1 text-[hsl(var(--fg-muted))] uppercase tracking-wide">
            {operation === 'charge' ? 'Сумма без НДС, ₽' : 'Сумма с НДС, ₽'}
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
        <div className="mb-6">
          <label className="block text-xs font-medium mb-2 text-[hsl(var(--fg-muted))] uppercase tracking-wide">
            Ставка НДС
          </label>
          <div className="flex gap-2">
            {([20, 10, 0] as NdsRate[]).map(r => (
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

        {/* Results */}
        <div className="glass rounded-2xl p-6 space-y-4 mt-6">
          <ResultRow label="Сумма без НДС" value={result.amountWithoutNds} highlight={operation === 'extract'} />
          <div className="border-t border-[hsl(var(--border))]" />
          <ResultRow label={`НДС ${rate}%`} value={result.ndsAmount} accent />
          <div className="border-t border-[hsl(var(--border))]" />
          <ResultRow label="Сумма с НДС" value={result.amountWithNds} highlight={operation === 'charge'} />
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="mt-4 w-full py-2.5 rounded-xl border border-[hsl(var(--border))] text-sm text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] hover:border-[hsl(var(--fg-muted))] transition-all"
        >
          {copied ? 'Скопировано!' : 'Скопировать'}
        </button>
      </div>
    </AppLayout>
  )
}
