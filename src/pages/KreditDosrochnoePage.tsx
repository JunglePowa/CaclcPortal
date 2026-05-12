import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { AppLayout } from '@/components/layout/AppLayout'
import { CalcLayout } from '@/components/layout/CalcLayout'
import { calculateDosrochnoe, type EarlyType } from '@/calculators/kreditDosrochnoe'
import { formatMoney } from '@/utils/formatCurrency'
import { useHistorySync } from '@/hooks/useHistorySync'
import {
  NumberInput,
  SliderInput,
  Select,
  ResultRow,
  InfoCard,
  Divider,
  cardCls,
  cardLabelCls,
  cardValueCls,
} from '@/components/ui'

const EARLY_TYPE_OPTIONS: { value: EarlyType; label: string }[] = [
  { value: 'reduce-term', label: 'Сократить срок' },
  { value: 'reduce-payment', label: 'Уменьшить платёж' },
]

export default function KreditDosrochnoePage() {
  const [balance, setBalance] = useState(1_000_000)
  const [annualRate, setAnnualRate] = useState(15)
  const [remainingMonths, setRemainingMonths] = useState(60)
  const [earlyAmount, setEarlyAmount] = useState(200_000)
  const [earlyType, setEarlyType] = useState<EarlyType>('reduce-term')
  const [earlyMonth, setEarlyMonth] = useState(1)

  const result = calculateDosrochnoe({
    balance,
    annualRate,
    remainingMonths,
    earlyAmount,
    earlyType,
    earlyMonth,
  })

  useHistorySync({
    calculatorLabel: 'Досрочное погашение',
    calculatorUrl: '/kredit-dosrochnoe',
    summary: `Экономия ${Math.round(result.savings).toLocaleString('ru-RU')} ₽`,
    triggerKey: `${result.savings}|${result.newTermMonths}`,
  })

  const chartData = useMemo(() => {
    const step = result.schedule.length > 60 ? 6 : result.schedule.length > 24 ? 3 : 1
    return result.schedule
      .filter(r => r.month % step === 0)
      .map(r => ({
        month: r.month,
        'Без досрочки': Math.round(r.balanceWithout),
        'С досрочкой': Math.round(r.balanceWith),
      }))
  }, [result.schedule])

  const sidebar = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Досрочное погашение</h2>
      </div>
      <div className="space-y-4">
        <NumberInput
          label="Текущий остаток долга, ₽"
          value={balance}
          onChange={setBalance}
          min={0}
          compact
        />
        <SliderInput
          label="Процентная ставка, %"
          value={annualRate}
          onChange={setAnnualRate}
          min={0}
          max={30}
          step={0.1}
          numberMax={100}
        />
        <NumberInput
          label="Оставшийся срок, мес."
          value={remainingMonths}
          onChange={setRemainingMonths}
          min={1}
          max={480}
          compact
          integer
        />
        <Divider />
        <NumberInput
          label="Сумма досрочки, ₽"
          value={earlyAmount}
          onChange={setEarlyAmount}
          min={0}
          compact
        />
        <NumberInput
          label="Месяц совершения"
          value={earlyMonth}
          onChange={setEarlyMonth}
          min={1}
          max={remainingMonths}
          compact
          integer
        />
        <Select
          label="Тип досрочки"
          value={earlyType}
          onChange={setEarlyType}
          options={EARLY_TYPE_OPTIONS}
          compact
        />
      </div>
    </>
  )

  const content = (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className={cardCls}>
          <p className={cardLabelCls}>Экономия</p>
          <p className={`${cardValueCls} text-emerald-500`}>
            {formatMoney(result.savings, 'RUB')}
          </p>
        </div>
        <div className={cardCls}>
          <p className={cardLabelCls}>Текущий платёж</p>
          <p className={cardValueCls}>{formatMoney(result.currentPayment, 'RUB')}</p>
        </div>
        <div className={cardCls}>
          <p className={cardLabelCls}>
            {earlyType === 'reduce-term' ? 'Новый срок' : 'Новый платёж'}
          </p>
          <p className={`${cardValueCls} text-emerald-400`}>
            {earlyType === 'reduce-term'
              ? `${result.newTermMonths} мес.`
              : formatMoney(result.newPayment, 'RUB')}
          </p>
        </div>
        <div className={cardCls}>
          <p className={cardLabelCls}>Доплата</p>
          <p className={cardValueCls}>{formatMoney(earlyAmount, 'RUB')}</p>
        </div>
      </div>

      <InfoCard title="Сравнение сценариев" spacing="space-y-3">
        <ResultRow
          label="Без досрочки — итого выплат"
          value={formatMoney(result.totalWithout, 'RUB')}
        />
        <ResultRow
          label="Без досрочки — проценты"
          value={formatMoney(result.interestWithout, 'RUB')}
          color="red"
        />
        <Divider />
        <ResultRow
          label="С досрочкой — итого выплат"
          value={formatMoney(result.totalWith, 'RUB')}
        />
        <ResultRow
          label="С досрочкой — проценты"
          value={formatMoney(result.interestWith, 'RUB')}
          color="amber"
        />
        <Divider />
        <ResultRow
          label="Экономия на процентах"
          value={formatMoney(result.savings, 'RUB')}
          color="emerald"
          size="lg"
        />
      </InfoCard>

      <div className="glass rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
          Остаток долга по месяцам
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}к`} />
            <Tooltip
              formatter={(v: number) => formatMoney(v, 'RUB')}
              labelFormatter={l => `Месяц ${l}`}
            />
            <Legend />
            <Line type="monotone" dataKey="Без досрочки" stroke="#f87171" dot={false} />
            <Line type="monotone" dataKey="С досрочкой" stroke="#10b981" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-[hsl(var(--fg-muted))]">
        «Сократить срок» обычно даёт большую экономию, т.к. проценты начисляются меньшее время.
        «Уменьшить платёж» снижает финансовую нагрузку при сохранении срока.
      </p>
    </>
  )

  return (
    <AppLayout>
      <CalcLayout sidebar={sidebar} content={content} />
    </AppLayout>
  )
}
