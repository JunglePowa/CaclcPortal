import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { calculateZarplata } from '@/calculators/zarplata'
import type { ZarplataDirection } from '@/calculators/zarplata'
import { saveToHistory } from '@/utils/history'
import { EmbedButton } from '@/components/EmbedButton'

const inputCls = 'w-full rounded-lg border border-[hsl(var(--border))] px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular'
const labelCls = 'block text-xs font-medium mb-1 text-[hsl(var(--fg-muted))] uppercase tracking-wide'
const selectCls = `${inputCls} cursor-pointer`

function ResultRow({ label, value, highlight, accent, negative, dimmed, large }: {
  label: string
  value: number
  highlight?: boolean
  accent?: boolean
  negative?: boolean
  dimmed?: boolean
  large?: boolean
}) {
  const color = highlight
    ? 'text-emerald-400'
    : accent
    ? 'text-amber-400'
    : negative
    ? 'text-red-400'
    : 'text-[hsl(var(--fg))]'

  return (
    <div className={`flex items-center justify-between ${dimmed ? 'opacity-60' : ''}`}>
      <span className="text-sm text-[hsl(var(--fg-muted))]">{label}</span>
      <span className={`font-bold tabular ${large ? 'text-2xl' : 'text-base'} ${color}`}>
        {Math.round(value).toLocaleString('ru-RU')} ₽
      </span>
    </div>
  )
}

export default function ZarplataPage() {
  const [direction, setDirection] = useState<ZarplataDirection>('gross_to_net')
  const [amount, setAmount] = useState<number>(100000)
  const [hasChildren, setHasChildren] = useState(false)
  const [childrenCount, setChildrenCount] = useState(1)
  const [smallBusiness, setSmallBusiness] = useState(false)

  useEffect(() => {
    document.title = 'Калькулятор зарплаты — КалкПортал'
  }, [])

  const result = calculateZarplata({ amount, direction, hasChildren, childrenCount, smallBusiness })

  useEffect(() => {
    saveToHistory({
      calculatorLabel: 'Зарплата',
      calculatorUrl: '/zarplata',
      summary: `На руки ${Math.round(result.netSalary).toLocaleString('ru-RU')} ₽, работодатель ${Math.round(result.totalEmployerCost).toLocaleString('ru-RU')} ₽`,
    })
  }, [result])

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Калькулятор зарплаты</h1>
            <p className="text-sm text-[hsl(var(--fg-muted))]">Гросс и нетто с учётом налогов и взносов</p>
          </div>
          <EmbedButton path="/zarplata" title="Калькулятор зарплаты" />
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
          <label className={labelCls}>
            {direction === 'gross_to_net' ? 'Оклад (гросс), ₽' : 'Сумма на руки, ₽'}
          </label>
          <input
            type="number"
            className={inputCls}
            value={amount}
            min={0}
            onChange={e => setAmount(parseFloat(e.target.value) || 0)}
            aria-label="Сумма"
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
        <div className="glass rounded-2xl p-6 space-y-3 mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))] mb-2">Для сотрудника</p>
          <ResultRow label="Оклад (гросс)" value={result.grossSalary} />
          {hasChildren && result.deduction > 0 && (
            <>
              <div className="border-t border-[hsl(var(--border))]" />
              <ResultRow label="Стандартный вычет" value={result.deduction} dimmed />
            </>
          )}
          <div className="border-t border-[hsl(var(--border))]" />
          <ResultRow label="НДФЛ 13%" value={result.ndfl} negative />
          <div className="border-t border-[hsl(var(--border))]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[hsl(var(--fg-muted))]">На руки</span>
            <span className="text-2xl font-bold tabular text-emerald-400">
              {Math.round(result.netSalary).toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        {/* Block 2: Employer */}
        <div className="glass rounded-2xl p-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))] mb-2">Для работодателя</p>
          <ResultRow label="Оклад" value={result.grossSalary} />
          <div className="border-t border-[hsl(var(--border))]" />
          <ResultRow label="+ ОПС 22%" value={result.pensionFund} dimmed />
          <ResultRow label="+ ОМС 5.1%" value={result.medicalFund} dimmed />
          <ResultRow label="+ ОСС 2.9%" value={result.socialFund} dimmed />
          <div className="border-t border-[hsl(var(--border))] border-dashed" />
          <ResultRow label="Итого расходов" value={result.totalEmployerCost} accent large />
          <div className="border-t border-[hsl(var(--border))]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[hsl(var(--fg-muted))]">Налоговая нагрузка</span>
            <span className="text-base font-bold tabular text-[hsl(var(--fg-muted))]">
              {result.taxBurden.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
