import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateNds } from '@/calculators/nds'
import type { NdsOperation, NdsRate } from '@/calculators/nds'
import { useHistorySync } from '@/hooks/useHistorySync'
import { NumberInput, ResultRow, InfoCard, Divider } from '@/components/ui'

const fmt = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`

export default function NdsPage() {
  const [operation, setOperation] = useState<NdsOperation>('charge')
  const [amount, setAmount] = useState<number>(100000)
  const [rate, setRate] = useState<NdsRate>(22)
  const [copied, setCopied] = useState(false)

  const result = calculateNds({ amount, rate, operation })

  useHistorySync({
    calculatorLabel: 'НДС',
    calculatorUrl: '/nds',
    summary: `НДС ${rate}%: ${Math.round(result.ndsAmount).toLocaleString('ru-RU')} ₽`,
    triggerKey: `${result.ndsAmount}|${rate}`,
  })

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
          <NumberInput
            label={operation === 'charge' ? 'Сумма без НДС, ₽' : 'Сумма с НДС, ₽'}
            value={amount}
            onChange={setAmount}
            min={0}
            ariaLabel="Сумма"
          />
        </div>

        {/* Rate */}
        <div className="mb-6">
          <label className="block text-xs font-medium mb-2 text-[hsl(var(--fg-muted))] uppercase tracking-wide">
            Ставка НДС
          </label>
          <div className="flex gap-2">
            {([22, 20, 10, 0] as NdsRate[]).map(r => (
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
        <InfoCard className="mt-6" spacing="space-y-4">
          <ResultRow
            label="Сумма без НДС"
            value={fmt(result.amountWithoutNds)}
            size="lg"
            color={operation === 'extract' ? 'emerald' : 'default'}
          />
          <Divider />
          <ResultRow label={`НДС ${rate}%`} value={fmt(result.ndsAmount)} size="lg" color="amber" />
          <Divider />
          <ResultRow
            label="Сумма с НДС"
            value={fmt(result.amountWithNds)}
            size="lg"
            color={operation === 'charge' ? 'emerald' : 'default'}
          />
        </InfoCard>

        <AdBlock blockId={AD_SLOTS.result} className="mt-4" />

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="mt-4 w-full py-2.5 rounded-xl border border-[hsl(var(--border))] text-sm text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] hover:border-[hsl(var(--fg-muted))] transition-all"
        >
          {copied ? 'Скопировано!' : 'Скопировать'}
        </button>

        <AdBlock blockId={AD_SLOTS.footer} className="mt-6" />
      </div>
    </AppLayout>
  )
}
