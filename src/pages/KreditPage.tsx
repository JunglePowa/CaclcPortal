import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useKreditStore } from '@/stores/kreditStore'
import { formatMoney, CURRENCIES } from '@/utils/formatCurrency'
import { AppLayout } from '@/components/layout/AppLayout'
import { CalcLayout } from '@/components/layout/CalcLayout'
import type { PaymentType } from '@/calculators/kredit'
import { useHistorySync } from '@/hooks/useHistorySync'
import {
  NumberInput,
  SliderInput,
  Select,
  cardCls,
  cardLabelCls,
  cardValueCls,
} from '@/components/ui'

const TERM_OPTIONS_RAW = [6, 12, 18, 24, 36, 48, 60, 84, 120, 180, 240]

function monthsLabel(m: number): string {
  const years = m / 12
  if (Number.isInteger(years)) return `${m} мес. (${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'})`
  return `${m} мес.`
}

const TERM_OPTIONS = TERM_OPTIONS_RAW.map(m => ({ value: m, label: monthsLabel(m) }))
const PAYMENT_TYPE_OPTIONS: { value: PaymentType; label: string }[] = [
  { value: 'annuity', label: 'Аннуитетный' },
  { value: 'differential', label: 'Дифференциальный' },
]
const CURRENCY_OPTIONS = CURRENCIES.map(c => ({ value: c.value, label: `${c.symbol} ${c.value}` }))

export default function KreditPage() {
  const { params, result, setParams } = useKreditStore()

  useHistorySync({
    calculatorLabel: 'Кредит',
    calculatorUrl: '/kredit',
    summary: `${Math.round(result.monthlyPayment).toLocaleString('ru-RU')} ₽/мес, переплата ${Math.round(result.totalInterest).toLocaleString('ru-RU')} ₽`,
    triggerKey: `${result.monthlyPayment}|${result.totalInterest}`,
  })

  const { loanAmount, annualRate, termMonths, paymentType } = params

  const chartData = useMemo(() => {
    const step = termMonths > 60 ? 12 : termMonths > 24 ? 6 : 1
    return result.schedule
      .filter(r => r.month % step === 0 || r.month === 1)
      .map(r => ({ month: r.month, 'Долг': Math.round(r.principal), 'Проценты': Math.round(r.interest) }))
  }, [result.schedule, termMonths])

  const sidebar = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Кредитный калькулятор</h2>
      </div>
      <div className="space-y-4">
        <NumberInput
          label="Сумма кредита"
          value={loanAmount}
          onChange={v => setParams({ loanAmount: v })}
          compact
          ariaLabel="Сумма кредита"
        />

        <SliderInput
          label="Процентная ставка, %"
          value={annualRate}
          onChange={v => setParams({ annualRate: v })}
          min={0}
          max={50}
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
          ariaLabel="Срок кредита"
        />

        <Select
          label="Тип платежа"
          value={paymentType}
          onChange={v => setParams({ paymentType: v })}
          options={PAYMENT_TYPE_OPTIONS}
          compact
          ariaLabel="Тип платежа"
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
