import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useCalcStore } from '@/stores/calcStore'
import { effectiveAnnualRate } from '@/utils/compound'
import { getCurrencySymbol, formatMoney } from '@/utils/formatCurrency'

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const spring = useSpring(value, { stiffness: 100, damping: 20 })
  const display = useTransform(spring, (v) =>
    `${Math.round(v).toLocaleString('ru-RU')}${suffix}`
  )
  useEffect(() => { spring.set(value) }, [value, spring])
  return <motion.span className="tabular">{display}</motion.span>
}

export function ResultCard() {
  const { breakdown, params, mode, targetAmount, requiredMonthly, requiredYears, requiredRate, requiredCapital } = useCalcStore()
  const final = breakdown[breakdown.length - 1]

  if (!final) return null

  const totalInvested = final.principal + final.contributions
  const profit = final.interest
  const ear = effectiveAnnualRate(params.annualRate, params.compoundingPerYear)
  const symbol = getCurrencySymbol(params.currency)
  const taxRate = params.taxRate ?? 0
  const inflationRate = params.inflationRate ?? 0

  const taxPaid = taxRate > 0 && taxRate < 100
    ? profit * (taxRate / (100 - taxRate))
    : 0

  const growthPct = totalInvested > 0 ? ((final.total / totalInvested) - 1) * 100 : 0

  const realRate = inflationRate > 0
    ? ((1 + ear) / (1 + inflationRate / 100) - 1) * 100
    : null

  const cardCls = 'rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/80 backdrop-blur-sm p-5 space-y-1'
  const labelCls = 'text-xs text-[hsl(var(--fg-muted))] uppercase tracking-wide'
  const valueCls = 'text-lg xl:text-2xl font-bold text-[hsl(var(--fg))] break-all'
  const subtextCls = 'text-xs text-[hsl(var(--fg-muted))]'

  if (mode === 'goal') {
    return (
      <motion.div layout className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className={`${cardCls} col-span-2`}>
          <p className={labelCls}>Нужный взнос</p>
          <p className={`${valueCls} text-emerald-500`}>
            <AnimatedNumber value={requiredMonthly} suffix={` ${symbol}/мес`} />
          </p>
          <p className={subtextCls}>
            чтобы накопить {formatMoney(targetAmount, params.currency)} за {params.years} лет
          </p>
        </div>
      </motion.div>
    )
  }

  if (mode === 'duration') {
    return (
      <motion.div layout className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className={`${cardCls} col-span-2`}>
          <p className={labelCls}>Потребуется лет</p>
          <p className={`${valueCls} text-emerald-500`}>
            {requiredYears === Infinity ? '∞' : <AnimatedNumber value={requiredYears} />}
          </p>
          <p className={subtextCls}>
            для накопления {formatMoney(targetAmount, params.currency)}
          </p>
        </div>
      </motion.div>
    )
  }

  if (mode === 'rate') {
    return (
      <motion.div layout className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className={`${cardCls} col-span-2`}>
          <p className={labelCls}>Нужная ставка</p>
          <p className={`${valueCls} text-emerald-500`}>
            {requiredRate === Infinity ? '∞' : `${requiredRate.toFixed(2)}%`}
          </p>
          <p className={subtextCls}>
            для накопления {formatMoney(targetAmount, params.currency)} за {params.years} лет
          </p>
        </div>
      </motion.div>
    )
  }

  if (mode === 'capital') {
    return (
      <motion.div layout className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className={`${cardCls} col-span-2`}>
          <p className={labelCls}>Нужный капитал</p>
          <p className={`${valueCls} text-emerald-500`}>
            <AnimatedNumber value={requiredCapital} suffix={` ${symbol}`} />
          </p>
          <p className={subtextCls}>
            стартовая сумма для достижения {formatMoney(targetAmount, params.currency)}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div layout className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {/* Row 1: main metrics */}
      <div className={cardCls}>
        <p className={labelCls}>Итого</p>
        <p className={`${valueCls} text-emerald-500`}>
          <AnimatedNumber value={final.total} suffix={` ${symbol}`} />
        </p>
        {final.realValue && (
          <p className={subtextCls}>
            Реальные: {formatMoney(final.realValue, params.currency)}
          </p>
        )}
      </div>

      <div className={cardCls}>
        <p className={labelCls}>Вложено</p>
        <p className={valueCls}>
          <AnimatedNumber value={totalInvested} suffix={` ${symbol}`} />
        </p>
        <p className={subtextCls}>
          {params.years} лет × {params.monthlyContribution.toLocaleString('ru-RU')} {symbol}/мес
        </p>
      </div>

      <div className={cardCls}>
        <p className={labelCls}>Доход (чистый)</p>
        <p className={`${valueCls} ${profit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          <AnimatedNumber value={profit} suffix={` ${symbol}`} />
        </p>
        <p className={subtextCls}>
          {profit > 0 && totalInvested > 0 ? `×${(final.total / totalInvested).toFixed(2)}` : ''}
        </p>
      </div>

      <div className={cardCls}>
        <p className={labelCls}>EAR</p>
        <p className={valueCls}>
          {(ear * 100).toFixed(2)}%
        </p>
        <p className={subtextCls}>Эффективная ставка</p>
      </div>

      {/* Row 2: growth & tax */}
      <div className={cardCls}>
        <p className={labelCls}>Рост, %</p>
        <p className={`${valueCls} text-emerald-400`}>
          +{growthPct.toFixed(1)}%
        </p>
        <p className={subtextCls}>относительно вложенного</p>
      </div>

      <div className={cardCls}>
        <p className={labelCls}>Налог</p>
        <p className={`${valueCls} ${taxPaid > 0 ? 'text-amber-400' : ''}`}>
          <AnimatedNumber value={taxPaid} suffix={` ${symbol}`} />
        </p>
        <p className={subtextCls}>
          {taxRate > 0 ? `ставка ${taxRate}%` : 'не применяется'}
        </p>
      </div>

      {/* Row 3: inflation metrics (only when inflationRate > 0) */}
      {inflationRate > 0 && final.realValue != null && (
        <>
          <div className={cardCls}>
            <p className={labelCls}>Реальный итог</p>
            <p className={`${valueCls} text-amber-400`}>
              <AnimatedNumber value={final.realValue} suffix={` ${symbol}`} />
            </p>
            <p className={subtextCls}>с учётом инфляции {inflationRate}%</p>
          </div>

          <div className={cardCls}>
            <p className={labelCls}>Реальная ставка</p>
            <p className={`${valueCls} ${realRate != null && realRate > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {realRate != null ? `${realRate.toFixed(2)}%` : '—'}
            </p>
            <p className={subtextCls}>формула Фишера</p>
          </div>
        </>
      )}
    </motion.div>
  )
}
