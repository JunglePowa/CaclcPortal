import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useVkladStore } from '@/stores/vkladStore'
import { formatMoney, CURRENCIES } from '@/utils/formatCurrency'
import { AppLayout } from '@/components/layout/AppLayout'
import { CalcLayout } from '@/components/layout/CalcLayout'
import { useHistorySync } from '@/hooks/useHistorySync'
import {
  NumberInput,
  SliderInput,
  Select,
  cardCls,
  cardLabelCls,
  cardValueCls,
} from '@/components/ui'

const TERM_OPTIONS = [3, 6, 12, 18, 24, 36, 60].map(m => ({ value: m, label: `${m} мес.` }))
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
const CURRENCY_OPTIONS = CURRENCIES.map(c => ({ value: c.value, label: `${c.symbol} ${c.value}` }))

export default function VkladPage() {
  const { params, result, setParams } = useVkladStore()

  useHistorySync({
    calculatorLabel: 'Вклад',
    calculatorUrl: '/vklad',
    summary: `${Math.round(result.finalAmount).toLocaleString('ru-RU')} ₽ за ${params.termMonths} мес`,
    triggerKey: `${result.finalAmount}|${params.termMonths}`,
  })

  const { initialAmount, monthlyReplenishment, annualRate, termMonths, taxRate } = params

  const totalInvested = initialAmount + result.totalReplenishments

  const chartData = useMemo(
    () => result.schedule.map(row => ({
      month: row.month,
      Баланс: Math.round(row.balance),
      Вложено: Math.round(initialAmount + monthlyReplenishment * row.month),
    })),
    [result.schedule, initialAmount, monthlyReplenishment]
  )

  const tableRows = useMemo(() => {
    const showAllRows = termMonths <= 12
    return result.schedule.filter(
      row => showAllRows || row.month % 3 === 0 || row.month === 1
    )
  }, [result.schedule, termMonths])

  const sidebar = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Калькулятор вклада</h2>
      </div>
      <div className="space-y-4">
        <NumberInput
          label="Начальная сумма"
          value={initialAmount}
          onChange={v => setParams({ initialAmount: v })}
          compact
        />

        <NumberInput
          label="Ежемесячное пополнение"
          value={monthlyReplenishment}
          onChange={v => setParams({ monthlyReplenishment: v })}
          compact
        />

        <SliderInput
          label="Ставка, %"
          value={annualRate}
          onChange={v => setParams({ annualRate: v })}
          min={0}
          max={30}
          step={0.1}
          numberMax={100}
          ariaLabelSlider="Ставка слайдер"
          ariaLabelNumber="Ставка число"
        />

        <Select
          label="Срок"
          value={termMonths}
          onChange={v => setParams({ termMonths: v })}
          options={TERM_OPTIONS}
          numeric
          compact
          ariaLabel="Срок"
        />

        <Select
          label="Капитализация"
          value={params.capitalizationPerYear}
          onChange={v => setParams({ capitalizationPerYear: v })}
          options={CAP_OPTIONS}
          numeric
          compact
          ariaLabel="Капитализация"
        />

        <Select
          label="Налог"
          value={taxRate}
          onChange={v => setParams({ taxRate: v })}
          options={TAX_OPTIONS}
          numeric
          compact
          ariaLabel="Налог"
        />

        <Select
          label="Валюта"
          value={params.currency}
          onChange={v => setParams({ currency: v })}
          options={CURRENCY_OPTIONS}
          compact
          ariaLabel="Валюта"
        />
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
