import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { AppLayout } from '@/components/layout/AppLayout'
import { CalcLayout } from '@/components/layout/CalcLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateDosrochnoe, type EarlyType } from '@/calculators/kreditDosrochnoe'
import { formatMoney } from '@/utils/formatCurrency'
import { useHistorySync } from '@/hooks/useHistorySync'
import { getHistorySearchParams, readNumberParam, readStringParam } from '@/utils/historyParams'
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

const EARLY_TYPE_ROUTES: Record<EarlyType, string> = {
  'reduce-term': '/early-repayment/reduce-term',
  'reduce-payment': '/early-repayment/reduce-payment',
}

function earlyTypeFromPath(pathname: string): EarlyType | null {
  if (pathname === '/early-repayment/reduce-term') return 'reduce-term'
  if (pathname === '/early-repayment/reduce-payment') return 'reduce-payment'
  return null
}

export default function KreditDosrochnoePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const initial = getHistorySearchParams()
  const [balance, setBalance] = useState(() => readNumberParam(initial, 'balance', 1_000_000))
  const [annualRate, setAnnualRate] = useState(() => readNumberParam(initial, 'annualRate', 15))
  const [remainingMonths, setRemainingMonths] = useState(() => readNumberParam(initial, 'remainingMonths', 60))
  const [earlyAmount, setEarlyAmount] = useState(() => readNumberParam(initial, 'earlyAmount', 200_000))
  const [earlyType, setEarlyType] = useState<EarlyType>(() => earlyTypeFromPath(location.pathname) ?? readStringParam(initial, 'earlyType', 'reduce-term', ['reduce-term', 'reduce-payment']))
  const [earlyMonth, setEarlyMonth] = useState(() => readNumberParam(initial, 'earlyMonth', 1))

  const result = calculateDosrochnoe({
    balance,
    annualRate,
    remainingMonths,
    earlyAmount,
    earlyType,
    earlyMonth,
  })

  useEffect(() => {
    const routeEarlyType = earlyTypeFromPath(location.pathname)
    if (routeEarlyType && routeEarlyType !== earlyType) {
      setEarlyType(routeEarlyType)
    }
  }, [location.pathname, earlyType])

  useHistorySync({
    calculatorLabel: 'Досрочное погашение',
    calculatorUrl: location.pathname,
    calculatorParams: { balance, annualRate, remainingMonths, earlyAmount, earlyType, earlyMonth },
    summary: `Экономия ${Math.round(result.savings).toLocaleString('ru-RU')} ₽`,
    triggerKey: `${balance}|${annualRate}|${remainingMonths}|${earlyAmount}|${earlyType}|${earlyMonth}|${result.savings}|${result.newTermMonths}`,
  })

  function handleEarlyTypeChange(nextType: EarlyType) {
    setEarlyType(nextType)
    navigate(`${EARLY_TYPE_ROUTES[nextType]}${location.search}`)
  }

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
        <h1 className="text-base font-semibold">Досрочное погашение кредита</h1>
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
          onChange={handleEarlyTypeChange}
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

      <AdBlock blockId={AD_SLOTS.result} />

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

      <AdBlock blockId={AD_SLOTS.footer} />
    </>
  )

  return (
    <AppLayout>
      <CalcLayout sidebar={sidebar} content={content} />
    </AppLayout>
  )
}
