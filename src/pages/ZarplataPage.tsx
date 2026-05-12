import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { calculateZarplata } from '@/calculators/zarplata'
import type { ZarplataDirection } from '@/calculators/zarplata'
import { useHistorySync } from '@/hooks/useHistorySync'
import { NumberInput, ResultRow, InfoCard, Divider, selectCls } from '@/components/ui'

const fmt = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`

export default function ZarplataPage() {
  const [direction, setDirection] = useState<ZarplataDirection>('gross_to_net')
  const [amount, setAmount] = useState<number>(100000)
  const [hasChildren, setHasChildren] = useState(false)
  const [childrenCount, setChildrenCount] = useState(1)
  const [smallBusiness, setSmallBusiness] = useState(false)

  const result = calculateZarplata({ amount, direction, hasChildren, childrenCount, smallBusiness })

  useHistorySync({
    calculatorLabel: 'Зарплата',
    calculatorUrl: '/zarplata',
    summary: `На руки ${Math.round(result.netSalary).toLocaleString('ru-RU')} ₽, работодатель ${Math.round(result.totalEmployerCost).toLocaleString('ru-RU')} ₽`,
    triggerKey: `${result.netSalary}|${result.totalEmployerCost}`,
  })

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Калькулятор зарплаты</h1>
            <p className="text-sm text-[hsl(var(--fg-muted))]">Гросс и нетто с учётом налогов и взносов</p>
          </div>
        </div>

        {/* Direction toggle */}
        <div className="flex gap-2 mb-5">
          {([
            { value: 'gross_to_net', label: 'Гросс → На руки' },
            { value: 'net_to_gross', label: 'На руки → Гросс' },
          ] as { value: ZarplataDirection; label: string }[]).map(opt => (
            <button
              key={opt.value}
              onClick={() => setDirection(opt.value)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                direction === opt.value
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                  : 'border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] hover:border-[hsl(var(--fg-muted))]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="mb-4">
          <NumberInput
            label={direction === 'gross_to_net' ? 'Оклад (гросс), ₽' : 'Сумма на руки, ₽'}
            value={amount}
            onChange={setAmount}
            min={0}
            ariaLabel="Сумма"
          />
        </div>

        {/* Children */}
        <div className="mb-3 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasChildren}
              onChange={e => setHasChildren(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded"
            />
            <span className="text-sm">Есть дети (стандартный вычет по НДФЛ)</span>
          </label>
          {hasChildren && (
            <select
              className={selectCls}
              value={childrenCount}
              onChange={e => setChildrenCount(parseInt(e.target.value))}
              aria-label="Количество детей"
            >
              <option value={1}>1 ребёнок (вычет 1 400 ₽)</option>
              <option value={2}>2 детей (вычет 2 800 ₽)</option>
              <option value={3}>3 и более (вычет 5 800 ₽)</option>
            </select>
          )}
        </div>

        {/* Small business */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={smallBusiness}
              onChange={e => setSmallBusiness(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded"
            />
            <span className="text-sm">МСП (малый бизнес)</span>
            <span className="text-xs text-[hsl(var(--fg-muted))]">пониженные взносы</span>
          </label>
        </div>

        {/* Block 1: Employee */}
        <InfoCard title="Для сотрудника" className="mb-4">
          <ResultRow label="Оклад (гросс)" value={fmt(result.grossSalary)} />
          {hasChildren && result.deduction > 0 && (
            <>
              <Divider />
              <ResultRow label="Стандартный вычет" value={fmt(result.deduction)} dimmed />
            </>
          )}
          <Divider />
          <ResultRow label="НДФЛ 13%" value={fmt(result.ndfl)} color="red" />
          <Divider />
          <ResultRow label="На руки" value={fmt(result.netSalary)} color="emerald" size="2xl" />
        </InfoCard>

        {/* Block 2: Employer */}
        <InfoCard title="Для работодателя">
          <ResultRow label="Оклад" value={fmt(result.grossSalary)} />
          <Divider />
          <ResultRow label="+ ОПС 22%" value={fmt(result.pensionFund)} dimmed />
          <ResultRow label="+ ОМС 5.1%" value={fmt(result.medicalFund)} dimmed />
          <ResultRow label="+ ОСС 2.9%" value={fmt(result.socialFund)} dimmed />
          <Divider dashed />
          <ResultRow label="Итого расходов" value={fmt(result.totalEmployerCost)} color="amber" size="2xl" />
          <Divider />
          <ResultRow
            label="Налоговая нагрузка"
            value={`${result.taxBurden.toFixed(1)}%`}
            color="muted"
          />
        </InfoCard>
      </div>
    </AppLayout>
  )
}
