import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCalcStore } from '@/stores/calcStore'
import type { CalcParams, ContributionFrequency, Currency } from '@/types'
import { CURRENCIES, getCurrencySymbol } from '@/utils/formatCurrency'

const schema = z.object({
  initialAmount: z.number().min(0).max(1e10),
  monthlyContribution: z.number().min(0).max(1e8),
  annualRate: z.number().min(0).max(100),
  compoundingPerYear: z.union([z.literal(1), z.literal(4), z.literal(12)]),
  years: z.number().min(1).max(100),
  inflationRate: z.number().min(0).max(50).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  contributionFrequency: z.enum(['monthly', 'quarterly', 'yearly']).optional(),
  contributionGrowthRate: z.number().min(0).max(100).optional(),
  currency: z.enum(['RUB', 'USD', 'EUR', 'GBP', 'CNY']).optional(),
})

const COMPOUNDING_OPTIONS = [
  { value: 12, label: 'Ежемесячно' },
  { value: 4, label: 'Ежеквартально' },
  { value: 1, label: 'Ежегодно' },
]

const SOLVE_MODES = new Set(['goal', 'duration', 'rate', 'capital'])

export function CalculatorForm() {
  const { params, setParams, setCurrency, mode, targetAmount, setTargetAmount } = useCalcStore()
  const { register, control, watch, formState: { errors } } = useForm<CalcParams>({
    resolver: zodResolver(schema),
    defaultValues: params,
    mode: 'onChange',
  })

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const subscription = watch((value) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const v = value as Partial<CalcParams>
        const clean: Partial<CalcParams> = {}
        if (v.initialAmount != null && !isNaN(v.initialAmount)) clean.initialAmount = v.initialAmount
        if (v.monthlyContribution != null && !isNaN(v.monthlyContribution)) clean.monthlyContribution = v.monthlyContribution
        if (v.annualRate != null && !isNaN(v.annualRate)) clean.annualRate = v.annualRate
        if (v.compoundingPerYear) clean.compoundingPerYear = v.compoundingPerYear
        if (v.years != null && !isNaN(v.years)) clean.years = v.years
        if (v.inflationRate != null && !isNaN(v.inflationRate)) clean.inflationRate = v.inflationRate
        if (v.taxRate != null && !isNaN(v.taxRate)) clean.taxRate = v.taxRate
        if (v.contributionFrequency) clean.contributionFrequency = v.contributionFrequency
        if (v.contributionGrowthRate != null && !isNaN(v.contributionGrowthRate)) clean.contributionGrowthRate = v.contributionGrowthRate
        setParams(clean)
      }, 150)
    })
    return () => { clearTimeout(timer); subscription.unsubscribe() }
  }, [watch, setParams])

  const inputBase = (err?: unknown) =>
    `rounded-lg border px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular ${err ? 'border-red-500' : 'border-[hsl(var(--border))]'}`
  const inputCls = (err?: unknown) => `w-full ${inputBase(err)}`
  const inputClsCompact = (err?: unknown) => `w-20 flex-shrink-0 ${inputBase(err)}`

  const labelCls = 'block text-xs font-medium mb-1 text-[hsl(var(--fg-muted))] uppercase tracking-wide'

  const isSolveMode = SOLVE_MODES.has(mode)
  const symbol = getCurrencySymbol(params.currency)

  const contribFreq = params.contributionFrequency ?? 'monthly'
  const contribLabel = contribFreq === 'monthly'
    ? `Взнос в месяц, ${symbol}`
    : contribFreq === 'quarterly'
    ? `Взнос в квартал, ${symbol}`
    : `Взнос в год, ${symbol}`

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4">

        {/* Target Amount — shown only in solve modes */}
        {isSolveMode && (
          <div>
            <label className={labelCls}>Целевая сумма, {symbol}</label>
            <input
              type="number"
              className={inputCls()}
              value={targetAmount}
              onChange={e => setTargetAmount(parseFloat(e.target.value))}
              aria-label="Целевая сумма"
            />
          </div>
        )}

        {/* Initial Amount — hidden in capital mode */}
        {mode !== 'capital' && (
          <div>
            <label className={labelCls}>Начальная сумма, {symbol}</label>
            <input
              type="number"
              className={inputCls(errors.initialAmount)}
              {...register('initialAmount', { valueAsNumber: true })}
              aria-label="Начальная сумма"
            />
          </div>
        )}

        {/* Monthly Contribution — hidden in goal mode */}
        {mode !== 'goal' && (
          <div>
            <label className={labelCls}>{contribLabel}</label>
            <input
              type="number"
              className={inputCls(errors.monthlyContribution)}
              {...register('monthlyContribution', { valueAsNumber: true })}
              aria-label="Ежемесячное довложение"
            />
          </div>
        )}

        {/* Annual Rate — hidden in rate mode */}
        {mode !== 'rate' && (
          <div>
            <label className={labelCls}>Годовая ставка, %</label>
            <Controller
              control={control}
              name="annualRate"
              render={({ field }) => (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min={0} max={30} step={0.1}
                      value={field.value}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      className="flex-1 accent-emerald-500"
                      aria-label="Процентная ставка слайдер"
                    />
                    <input
                      type="number" min={0} max={100} step={0.1}
                      value={field.value}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      className={inputClsCompact(errors.annualRate)}
                      aria-label="Процентная ставка число"
                    />
                  </div>
                </div>
              )}
            />
          </div>
        )}

        {/* Years — hidden in duration mode */}
        {mode !== 'duration' && (
          <div>
            <label className={labelCls}>Срок, лет</label>
            <Controller
              control={control}
              name="years"
              render={({ field }) => (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min={1} max={50} step={1}
                      value={field.value}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                      className="flex-1 accent-emerald-500"
                      aria-label="Срок слайдер"
                    />
                    <input
                      type="number" min={1} max={100}
                      value={field.value}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                      className={inputClsCompact(errors.years)}
                      aria-label="Срок число"
                    />
                  </div>
                </div>
              )}
            />
          </div>
        )}

        {/* Compounding Period */}
        <div>
          <label className={labelCls}>Период капитализации</label>
          <Controller
            control={control}
            name="compoundingPerYear"
            render={({ field }) => (
              <select
                value={field.value}
                onChange={e => field.onChange(parseInt(e.target.value))}
                className={`${inputCls()} cursor-pointer`}
                aria-label="Период капитализации"
              >
                {COMPOUNDING_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Tax Rate */}
        <div>
          <label className={labelCls}>Налог на прибыль, %</label>
          <input
            type="number" min={0} max={100} step={0.1}
            className={inputCls(errors.taxRate)}
            {...register('taxRate', { valueAsNumber: true })}
            aria-label="Ставка налога"
          />
        </div>

        {/* Currency */}
        <div>
          <label className={labelCls}>Валюта</label>
          <select
            value={params.currency ?? 'RUB'}
            onChange={e => setCurrency(e.target.value as Currency)}
            className={`${inputCls()} cursor-pointer`}
          >
            {CURRENCIES.map(c => (
              <option key={c.value} value={c.value}>{c.symbol} {c.value}</option>
            ))}
          </select>
        </div>

        {/* Contribution Frequency — hidden in goal mode */}
        {mode !== 'goal' && (
          <div>
            <label className={labelCls}>Периодичность взносов</label>
            <select
              value={params.contributionFrequency ?? 'monthly'}
              onChange={e => setParams({ contributionFrequency: e.target.value as ContributionFrequency })}
              className={`${inputCls()} cursor-pointer`}
            >
              <option value="monthly">Ежемесячно</option>
              <option value="quarterly">Ежеквартально</option>
              <option value="yearly">Ежегодно</option>
            </select>
          </div>
        )}

        {/* Contribution Growth Rate — hidden in goal mode */}
        {mode !== 'goal' && (
          <div>
            <label className={labelCls}>Рост взноса в год, %</label>
            <input
              type="number" min={0} max={100} step={0.1}
              placeholder="0"
              className={inputCls(errors.contributionGrowthRate)}
              {...register('contributionGrowthRate', { valueAsNumber: true })}
              aria-label="Ежегодный рост взноса"
            />
          </div>
        )}
      </div>

      {/* Inflation */}
      <div>
        <label className={labelCls}>Инфляция, % (опционально)</label>
        <input
          type="number" min={0} max={50} step={0.1}
          placeholder="Оставьте пустым, чтобы отключить"
          className={inputCls(errors.inflationRate)}
          {...register('inflationRate', { valueAsNumber: true })}
          aria-label="Ставка инфляции"
        />
      </div>

    </div>
  )
}
