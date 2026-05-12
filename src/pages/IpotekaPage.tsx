import { useMemo, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { AppLayout } from '@/components/layout/AppLayout'
import { CalcLayout } from '@/components/layout/CalcLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { calculateIpoteka, type EarlyPayment, type EarlyPaymentType } from '@/calculators/ipoteka'
import type { PaymentType } from '@/calculators/kredit'
import { formatMoney, CURRENCIES } from '@/utils/formatCurrency'
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

const TERM_OPTIONS = [60, 120, 180, 240, 300, 360].map(m => ({
  value: m,
  label: `${m} мес. (${m / 12} лет)`,
}))

const PAYMENT_TYPE_OPTIONS: { value: PaymentType; label: string }[] = [
  { value: 'annuity', label: 'Аннуитетный' },
  { value: 'differential', label: 'Дифференциальный' },
]

const EARLY_TYPE_OPTIONS: { value: EarlyPaymentType; label: string }[] = [
  { value: 'reduce-term', label: 'Сократить срок' },
  { value: 'reduce-payment', label: 'Уменьшить платёж' },
]

const CURRENCY_OPTIONS = CURRENCIES.map(c => ({ value: c.value, label: `${c.symbol} ${c.value}` }))

export default function IpotekaPage() {
  const [propertyPrice, setPropertyPrice] = useState(6_000_000)
  const [downPayment, setDownPayment] = useState(1_000_000)
  const [annualRate, setAnnualRate] = useState(14)
  const [termMonths, setTermMonths] = useState(240)
  const [paymentType, setPaymentType] = useState<PaymentType>('annuity')
  const [currency, setCurrency] = useState('RUB')

  // Одна досрочка для UI (массив поддерживается логикой).
  const [hasEarly, setHasEarly] = useState(false)
  const [earlyMonth, setEarlyMonth] = useState(12)
  const [earlyAmount, setEarlyAmount] = useState(300_000)
  const [earlyType, setEarlyType] = useState<EarlyPaymentType>('reduce-term')

  const earlyPayments: EarlyPayment[] = hasEarly
    ? [{ month: earlyMonth, amount: earlyAmount, type: earlyType }]
    : []

  const result = calculateIpoteka({
    propertyPrice,
    downPayment,
    annualRate,
    termMonths,
    paymentType,
    currency,
    earlyPayments,
  })

  useHistorySync({
    calculatorLabel: 'Ипотека',
    calculatorUrl: '/ipoteka',
    summary: `${Math.round(result.monthlyPayment).toLocaleString('ru-RU')} ₽/мес, переплата ${Math.round(result.totalInterest).toLocaleString('ru-RU')} ₽`,
    triggerKey: `${result.monthlyPayment}|${result.totalInterest}|${result.actualTermMonths}`,
  })

  const chartData = useMemo(() => {
    const step = result.schedule.length > 60 ? 12 : 6
    return result.schedule
      .filter(r => r.month % step === 0 || r.month === 1)
      .map(r => ({ month: r.month, Остаток: Math.round(r.balance) }))
  }, [result.schedule])

  const downPaymentPct = propertyPrice > 0 ? (downPayment / propertyPrice) * 100 : 0

  const sidebar = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Ипотечный калькулятор</h2>
      </div>
      <div className="space-y-4">
        <NumberInput
          label="Стоимость недвижимости"
          value={propertyPrice}
          onChange={setPropertyPrice}
          min={0}
          compact
          ariaLabel="Стоимость недвижимости"
        />
        <NumberInput
          label={`Первоначальный взнос (${downPaymentPct.toFixed(0)}%)`}
          value={downPayment}
          onChange={setDownPayment}
          min={0}
          compact
          ariaLabel="Первоначальный взнос"
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
        <Select
          label="Срок"
          value={termMonths}
          onChange={setTermMonths}
          options={TERM_OPTIONS}
          numeric
          compact
        />
        <Select
          label="Тип платежа"
          value={paymentType}
          onChange={setPaymentType}
          options={PAYMENT_TYPE_OPTIONS}
          compact
        />
        <Select
          label="Валюта"
          value={currency}
          onChange={setCurrency}
          options={CURRENCY_OPTIONS}
          compact
        />

        <div className="border-t border-[hsl(var(--border))] pt-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={hasEarly}
              onChange={e => setHasEarly(e.target.checked)}
              className="accent-emerald-500"
            />
            <span>Досрочное погашение</span>
          </label>
          {hasEarly && (
            <div className="space-y-3 mt-3">
              <NumberInput
                label="Месяц"
                value={earlyMonth}
                onChange={setEarlyMonth}
                min={1}
                max={termMonths}
                compact
                integer
              />
              <NumberInput
                label="Сумма досрочки"
                value={earlyAmount}
                onChange={setEarlyAmount}
                min={0}
                compact
              />
              <Select
                label="Тип"
                value={earlyType}
                onChange={setEarlyType}
                options={EARLY_TYPE_OPTIONS}
                compact
              />
            </div>
          )}
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
            {formatMoney(result.monthlyPayment, currency)}
          </p>
        </div>
        <div className={cardCls}>
          <p className={cardLabelCls}>Сумма кредита</p>
          <p className={cardValueCls}>{formatMoney(result.loanAmount, currency)}</p>
        </div>
        <div className={cardCls}>
          <p className={cardLabelCls}>Переплата</p>
          <p className={`${cardValueCls} text-red-400`}>
            {formatMoney(result.totalInterest, currency)}
          </p>
        </div>
        <div className={cardCls}>
          <p className={cardLabelCls}>Итого выплат</p>
          <p className={cardValueCls}>{formatMoney(result.totalPayment, currency)}</p>
        </div>
      </div>

      <AdBlock blockId={AD_SLOTS.result} />

      {hasEarly && result.earlySavings > 0 && (
        <InfoCard title="Эффект досрочного погашения" spacing="space-y-3">
          <ResultRow
            label="Экономия"
            value={formatMoney(result.earlySavings, currency)}
            color="emerald"
            size="lg"
          />
          <ResultRow
            label="Фактический срок"
            value={`${result.actualTermMonths} мес.`}
            color={result.actualTermMonths < termMonths ? 'emerald' : 'default'}
          />
        </InfoCard>
      )}

      <div className="glass rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
          Остаток долга
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}к`} />
            <Tooltip
              formatter={(v: number) => formatMoney(v, currency)}
              labelFormatter={l => `Месяц ${l}`}
            />
            <Area type="monotone" dataKey="Остаток" stroke="#10b981" fill="#10b98133" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <InfoCard title="Параметры" spacing="space-y-2">
        <ResultRow label="Стоимость" value={formatMoney(propertyPrice, currency)} weight="medium" />
        <ResultRow
          label={`Первоначальный взнос (${downPaymentPct.toFixed(1)}%)`}
          value={formatMoney(downPayment, currency)}
          weight="medium"
        />
        <Divider />
        <ResultRow label="Ставка" value={`${annualRate} % годовых`} weight="medium" />
        <ResultRow label="Срок" value={`${termMonths} мес.`} weight="medium" />
      </InfoCard>

      <AdBlock blockId={AD_SLOTS.footer} />
    </>
  )

  return (
    <AppLayout>
      <CalcLayout sidebar={sidebar} content={content} />
    </AppLayout>
  )
}
