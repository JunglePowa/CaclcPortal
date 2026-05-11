import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useKreditStore } from '@/stores/kreditStore'
import { formatMoney, CURRENCIES } from '@/utils/formatCurrency'
import { AppLayout } from '@/components/layout/AppLayout'
import { CalcLayout } from '@/components/layout/CalcLayout'
import type { PaymentType } from '@/calculators/kredit'
import { saveToHistory } from '@/utils/history'
import { EmbedButton } from '@/components/EmbedButton'

const TERM_OPTIONS = [6, 12, 18, 24, 36, 48, 60, 84, 120, 180, 240]

function monthsLabel(m: number): string {
  const years = m / 12
  if (Number.isInteger(years)) return `${m} мес. (${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'})`
  return `${m} мес.`
}

const inputCls = 'w-full rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular'
const selectCls = `${inputCls} cursor-pointer`
const labelCls = 'block text-xs font-medium mb-1 text-[hsl(var(--fg-muted))] uppercase tracking-wide'
const cardCls = 'rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/80 backdrop-blur-sm p-5 space-y-1'
const cardLabelCls = 'text-xs text-[hsl(var(--fg-muted))] uppercase tracking-wide'
const cardValueCls = 'text-lg xl:text-2xl font-bold text-[hsl(var(--fg))] break-all tabular'

export default function KreditPage() {
  const { params, result, setParams } = useKreditStore()
  const [rateInput, setRateInput] = useState(params.annualRate)

  useEffect(() => {
    document.title = 'Кредитный калькулятор — КалкПортал'
  }, [])

  useEffect(() => {
    saveToHistory({
      calculatorLabel: 'Кредит',
      calculatorUrl: '/kredit',
      summary: `${Math.round(result.monthlyPayment).toLocaleString('ru-RU')} ₽/мес, переплата ${Math.round(result.totalInterest).toLocaleString('ru-RU')} ₽`,
    })
  }, [result])

  const { loanAmount, annualRate, termMonths, paymentType } = params

  const step = termMonths > 60 ? 12 : termMonths > 24 ? 6 : 1
  const chartData = result.schedule
    .filter(r => r.month % step === 0 || r.month === 1)
    .map(r => ({ month: r.month, 'Долг': Math.round(r.principal), 'Проценты': Math.round(r.interest) }))

  const sidebar = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Кредитный калькулятор</h2>
        <EmbedButton path="/kredit" title="Кредитный калькулятор" />
      </div>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Сумма кредита</label>
          <input
            type="number"
            className={inputCls}
            value={loanAmount}
            onChange={e => setParams({ loanAmount: parseFloat(e.target.value) || 0 })}
            aria-label="Сумма кредита"
          />
        </div>

        <div>
          <label className={labelCls}>Процентная ставка, %</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={50}
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
            aria-label="Срок кредита"
          >
            {TERM_OPTIONS.map(m => (
              <option key={m} value={m}>{monthsLabel(m)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Тип платежа</label>
          <select
            className={selectCls}
            value={paymentType}
            onChange={e => setParams({ paymentType: e.target.value as PaymentType })}
            aria-label="Тип платежа"
          >
            <option value="annuity">Аннуитетный</option>
            <option value="differential">Дифференциальный</option>
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
          <p className={cardLabelCls}>Платёж/мес</p>
          <p className={`${cardValueCls} text-emerald-500`}>
            {paymentType === 'differential'
              ? `от ${formatMoney(result.schedule[result.schedule.length - 1]?.payment ?? 0, params.currency)}`
              : formatMoney(result.monthlyPayment, params.currency)}
          </p>
          {paymentType === 'differential' && (
            <p className="text-xs text-[hsl(var(--fg-muted))]">
              первый: {formatMoney(result.monthlyPayment, params.currency)}
            </p>
          )}
        </div>

        <div className={cardCls}>
          <p className={cardLabelCls}>Сумма кредита</p>
          <p className={cardValueCls}>
            {formatMoney(loanAmount, params.currency)}
          </p>
        </div>

        <div className={cardCls}>
          <p className={cardLabelCls}>Переплата</p>
          <p className={`${cardValueCls} text-red-400`}>
            {formatMoney(result.totalInterest, params.currency)}
          </p>
        </div>

        <div className={cardCls}>
          <p className={cardLabelCls}>Итого выплат</p>
          <p className={cardValueCls}>
            {formatMoney(result.totalPayment, params.currency)}
          </p>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex justify-between text-xs text-[hsl(var(--fg-muted))] mb-2">
          <span>Основной долг {((loanAmount / result.totalPayment) * 100).toFixed(0)}%</span>
          <span>Переплата {((result.totalInterest / result.totalPayment) * 100).toFixed(0)}%</span>
        </div>
        <div className="h-3 rounded-full bg-[hsl(var(--border))] overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${(loanAmount / result.totalPayment) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
          Структура платежей
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} label={{ value: 'Месяц', position: 'insideBottom', offset: -2, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}к`} />
            <Tooltip formatter={(v: number) => formatMoney(v, params.currency)} labelFormatter={l => `Месяц ${l}`} />
            <Legend />
            <Bar dataKey="Долг" stackId="a" fill="#10b981" />
            <Bar dataKey="Проценты" stackId="a" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
          График платежей
        </h2>
        <div className="max-h-72 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[hsl(var(--bg-card))]">
              <tr className="text-xs text-[hsl(var(--fg-muted))] uppercase tracking-wide">
                <th className="text-left py-2 pr-4">Месяц</th>
                <th className="text-right py-2 pr-4">Платёж</th>
                <th className="text-right py-2 pr-4">Долг</th>
                <th className="text-right py-2 pr-4">Проценты</th>
                <th className="text-right py-2">Остаток</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {result.schedule.map(row => (
                <tr key={row.month} className="hover:bg-[hsl(var(--bg-card))]/40 transition-colors">
                  <td className="py-2 pr-4 tabular">{row.month}</td>
                  <td className="py-2 pr-4 text-right tabular">{formatMoney(row.payment, params.currency)}</td>
                  <td className="py-2 pr-4 text-right tabular text-emerald-400">{formatMoney(row.principal, params.currency)}</td>
                  <td className="py-2 pr-4 text-right tabular text-red-400">{formatMoney(row.interest, params.currency)}</td>
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
