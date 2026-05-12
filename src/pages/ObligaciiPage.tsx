import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { CalcLayout } from '@/components/layout/CalcLayout'
import { calculateObligacii } from '@/calculators/obligacii'
import { EmbedButton } from '@/components/EmbedButton'
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

const fmt = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`
const fmtPct = (v: number) => `${v.toFixed(2)} %`

const PAYMENTS_PER_YEAR_OPTIONS = [
  { value: 1, label: '1 раз в год' },
  { value: 2, label: '2 раза в год (полугодие)' },
  { value: 4, label: '4 раза в год (квартал)' },
]

export default function ObligaciiPage() {
  const [faceValue, setFaceValue] = useState(1000)
  const [buyPricePercent, setBuyPricePercent] = useState(98.5)
  const [sellPricePercent, setSellPricePercent] = useState(100)
  const [couponRate, setCouponRate] = useState(10)
  const [paymentsPerYear, setPaymentsPerYear] = useState(2)
  const [years, setYears] = useState(5)
  const [taxRate, setTaxRate] = useState(13)

  const result = calculateObligacii({
    faceValue,
    buyPricePercent,
    sellPricePercent,
    couponRate,
    paymentsPerYear,
    years,
    taxRate,
  })

  useHistorySync({
    calculatorLabel: 'Облигации',
    calculatorUrl: '/obligacii',
    summary: `YTM ${result.ytm.toFixed(2)}%, чистый доход ${fmt(result.netIncome)}`,
    triggerKey: `${result.ytm}|${result.netIncome}`,
  })

  const sidebar = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Калькулятор облигаций</h2>
        <EmbedButton path="/obligacii" title="Калькулятор облигаций" />
      </div>
      <div className="space-y-4">
        <NumberInput
          label="Номинал, ₽"
          value={faceValue}
          onChange={setFaceValue}
          min={1}
          compact
          ariaLabel="Номинал"
        />
        <SliderInput
          label="Цена покупки, % от номинала"
          value={buyPricePercent}
          onChange={setBuyPricePercent}
          min={50}
          max={150}
          step={0.1}
          numberMax={200}
          numberMin={1}
        />
        <SliderInput
          label="Цена продажи / погашения, %"
          value={sellPricePercent}
          onChange={setSellPricePercent}
          min={50}
          max={150}
          step={0.1}
          numberMax={200}
          numberMin={1}
        />
        <SliderInput
          label="Купонная ставка, % годовых"
          value={couponRate}
          onChange={setCouponRate}
          min={0}
          max={30}
          step={0.1}
          numberMax={100}
        />
        <Select
          label="Периодичность выплат"
          value={paymentsPerYear}
          onChange={setPaymentsPerYear}
          options={PAYMENTS_PER_YEAR_OPTIONS}
          numeric
          compact
        />
        <SliderInput
          label="Срок до погашения, лет"
          value={years}
          onChange={setYears}
          min={0}
          max={30}
          step={0.5}
          numberMax={50}
        />
        <SliderInput
          label="Налог, %"
          value={taxRate}
          onChange={setTaxRate}
          min={0}
          max={30}
          step={1}
          numberMax={100}
        />
      </div>
    </>
  )

  const content = (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className={cardCls}>
          <p className={cardLabelCls}>YTM</p>
          <p className={`${cardValueCls} text-emerald-500`}>{fmtPct(result.ytm)}</p>
        </div>
        <div className={cardCls}>
          <p className={cardLabelCls}>Текущая доходность</p>
          <p className={cardValueCls}>{fmtPct(result.currentYield)}</p>
        </div>
        <div className={cardCls}>
          <p className={cardLabelCls}>Простая доходность</p>
          <p className={cardValueCls}>{fmtPct(result.simpleYield)}</p>
        </div>
        <div className={cardCls}>
          <p className={cardLabelCls}>Чистый доход</p>
          <p className={`${cardValueCls} text-emerald-400`}>{fmt(result.netIncome)}</p>
        </div>
      </div>

      <InfoCard title="Детализация" spacing="space-y-3">
        <ResultRow label="Цена покупки (за облигацию)" value={fmt(result.buyPrice)} />
        <ResultRow label="Цена продажи / погашения" value={fmt(result.sellPrice)} />
        <Divider />
        <ResultRow label="Купонный доход (грязный)" value={fmt(result.couponIncome)} color="emerald" />
        <ResultRow label="Налог на купоны" value={fmt(result.couponTax)} color="red" />
        <ResultRow
          label="Прибыль от разницы цен"
          value={fmt(result.capitalGain)}
          color={result.capitalGain >= 0 ? 'emerald' : 'red'}
        />
        <ResultRow label="Налог на разницу цен" value={fmt(result.capitalTax)} color="red" />
        <Divider />
        <ResultRow label="Итого чистый доход" value={fmt(result.netIncome)} size="lg" color="emerald" />
      </InfoCard>

      <p className="text-xs text-[hsl(var(--fg-muted))]">
        YTM (yield to maturity) — внутренняя норма доходности с учётом всех купонов и разницы цен.
        Для ОФЗ с 2021 г. купоны облагаются НДФЛ 13%.
      </p>
    </>
  )

  return (
    <AppLayout>
      <CalcLayout sidebar={sidebar} content={content} />
    </AppLayout>
  )
}
