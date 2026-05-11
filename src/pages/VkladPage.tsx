import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useVkladStore } from '@/stores/vkladStore'
import { formatMoney, CURRENCIES } from '@/utils/formatCurrency'
import { AppLayout } from '@/components/layout/AppLayout'
import { CalcLayout } from '@/components/layout/CalcLayout'
import { saveToHistory } from '@/utils/history'
import { EmbedButton } from '@/components/EmbedButton'

const TERM_OPTIONS = [3, 6, 12, 18, 24, 36, 60]
const CAP_OPTIONS = [
  { value: 365, label: 'Ежедневно' },
  { value: 12, label: 'Ежемесячно' },
  { value: 4, label: 'Ежеквартально' },
  { value: 1, label: 'Ежегодно' },
]
const TAX_OPTIONS = [
  { value: 0, label: 'Нет' },
  { value: 13, label: '13%' },
]

const inputCls = 'w-full rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular'
const selectCls = `${inputCls} cursor-pointer`
const labelCls = 'block text-xs font-medium mb-1 text-[hsl(var(--fg-muted))] uppercase tracking-wide'
const cardCls = 'rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/80 backdrop-blur-sm p-5 space-y-1'
const cardLabelCls = 'text-xs text-[hsl(var(--fg-muted))] uppercase tracking-wide'
const cardValueCls = 'text-lg xl:text-2xl font-bold text-[hsl(var(--fg))] break-all tabular'

export default function VkladPage() {
  const { params, result, setParams } = useVkladStore()

  const [rateInput, setRateInput] = useState(params.annualRate)

  useEffect(() => {
    document.title = 'Калькулятор вклада — КалкПортал'
  }, [])

  useEffect(() => {
    saveToHistory({
      calculatorLabel: 'Вклад',
      calculatorUrl: '/vklad',
      summary: `${Math.round(result.finalAmount).toLocaleString('ru-RU')} ₽ за ${params.termMonths} мес`,
    })
  }, [result])

  const { initialAmount, monthlyReplenishment, annualRate, termMonths, taxRate } = params

  const totalInvested = initialAmount + result.totalReplenishments

  const chartData = result.schedule.map(row => ({
    month: row.month,
    Баланс: Math.round(row.balance),
    Вложено: Math.round(initialAmount + monthlyReplenishment * row.month),
  }))

  const showAllRows = termMonths <= 12
  const tableRows = result.schedule.filter(
    row => showAllRows || row.month % 3 === 0 || row.month === 1
  )

  const sidebar = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Калькулятор вклада</h2>
        <EmbedButton path="/vklad" title="Калькулятор вклада" />
      </div>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Начальная сумма</label>
          <input
            type="number"
            className={inputCls}
            value={initialAmount}
            onChange={e => setParams({ initialAmount: parseFloat(e.target.value) || 0 })}
            aria-label="Начальная сумма"
          />
        </div>

        <div>
          <label className={labelCls}>Ежемесячное пополнение</label>
          <input
            type="number"
            className={inputCls}
            value={monthlyReplenishment}
            onChange={e => setParams({ monthlyReplenishment: parseFloat(e.target.value) || 0 })}
            aria-label="Ежемесячное пополнение"
          />
        </div>

        <div>
          <label className={labelCls}>Ставка, %</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={30}
              step={0.1}
              value={rateInput}
              onChange={e => {
                const v = parseFloat(e.target.value)
                setRateInput(v)
                setParams({ annualRate: v })
              }}
              className="flex-1 accent-emerald-500"
              aria-label="Ставка слайдер"
            />
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={rateInput}
              onChange={e => {
                const v = parseFloat(e.target.value) || 0
                setRateInput(v)
                setParams({ annualRate: v })
              }}
              className="w-20 flex-shrink-0 rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular"
              aria-label="Ставка число"
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Срок</label>
          <select
            className={selectCls}
            value={termMonths}
            onChange={e => setParams({ termMonths: parseInt(e.target.value) })}
            aria-label="Срок"
          >
            {TERM_OPTIONS.map(m => (
              <option key={m} value={m}>{m} мес.</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Капитализация</label>
          <select
            className={selectCls}
            value={params.capitalizationPerYear}
            onChange={e => setParams({ capitalizationPerYear: parseInt(e.target.value) })}
            aria-label="Капитализация"
          >
            {CAP_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Налог</label>
          <select
            className={selectCls}
            value={taxRate}
            onChange={e => setParams({ taxRate: parseInt(e.target.value) })}
            aria-label="Налог"
          >
            {TAX_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Валюта</label>
          <select
            className={selectCls}
            value={params.currency}
            onChange={e => setParams({ currency: e.target.value })}
            aria-label="Валюта"
          >
            {CURRENCIES.map(c => (
              <option key={c.value} value={c.value}>{c.symbol} {c.value}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  )

  const content = (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className={cardCls}>
          <p className={cardLabelCls}>Итого</p>
          <p className={`${cardValueCls} text-emerald-500`}>
            {formatMoney(result.finalAmount, params.currency)}
          </p>
        </div>

        <div className={cardCls}>
          <p className={cardLabelCls}>Вложено</p>
          <p className={cardValueCls}>
            {formatMoney(totalInvested, params.currency)}
          </p>
        </div>

        <div className={cardCls}>
          <p className={cardLabelCls}>Доход (чистый)</p>
          <p className={`${cardValueCls} text-emerald-400`}>
            {formatMoney(result.netInterest, params.currency)}
          </p>
        </div>

        <div className={cardCls}>
          {taxRate > 0 ? (
            <>
              <p className={cardLabelCls}>Налог</p>
              <p className={`${cardValueCls} text-amber-400`}>
                {formatMoney(result.taxPaid, params.currency)}
              </p>
            </>
          ) : (
            <>
              <p className={cardLabelCls}>EAR</p>
              <p className={cardValueCls}>
                {(result.effectiveRate * 100).toFixed(2)}%
              </p>
            </>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
          Рост вклада
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} label={{ value: 'Месяц', position: 'insideBottom', offset: -2, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}к`} />
            <Tooltip formatter={(v: number) => formatMoney(v, params.currency)} labelFormatter={l => `Месяц ${l}`} />
            <Legend />
            <Line type="monotone" dataKey="Баланс" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Вложено" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
          График начислений
        </h2>
        <div className="max-h-64 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[hsl(var(--bg-card))]">
              <tr className="text-xs text-[hsl(var(--fg-muted))] uppercase tracking-wide">
                <th className="text-left py-2 pr-4">Месяц</th>
                <th className="text-right py-2 pr-4">Пополнение</th>
                <th className="text-right py-2 pr-4">Проценты</th>
                <th className="text-right py-2">Баланс</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {tableRows.map(row => (
                <tr key={row.month} className="hover:bg-[hsl(var(--bg-card))]/40 transition-colors">
                  <td className="py-2 pr-4 tabular">{row.month}</td>
                  <td className="py-2 pr-4 text-right tabular">{formatMoney(row.replenishment, params.currency)}</td>
                  <td className="py-2 pr-4 text-right tabular text-emerald-400">{formatMoney(row.interest, params.currency)}</td>
                  <td className="py-2 text-right tabular font-medium">{formatMoney(row.balance, params.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )

  return (
    <AppLayout>
      <CalcLayout sidebar={sidebar} content={content} />
    </AppLayout>
  )
}
