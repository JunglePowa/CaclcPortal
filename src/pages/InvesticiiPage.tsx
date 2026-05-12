import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { useCalcStore } from '@/stores/calcStore'
import { saveToHistory } from '@/utils/history'
import { formatMoney } from '@/utils/formatCurrency'
import { CalculatorForm } from '@/components/Calculator/CalculatorForm'
import { ModeSelector } from '@/components/Calculator/ModeSelector'
import { ResultCard } from '@/components/Results/ResultCard'
import { AreaChartComponent } from '@/components/Charts/AreaChartComponent'
import { BarChartComponent } from '@/components/Charts/BarChartComponent'
import { PieChartComponent } from '@/components/Charts/PieChartComponent'
import { ComparisonChart } from '@/components/Charts/ComparisonChart'
import { YearlyTable } from '@/components/Results/YearlyTable'
import { ExportButtons } from '@/components/Results/ExportButtons'
import { AppLayout } from '@/components/layout/AppLayout'
import { CalcLayout } from '@/components/layout/CalcLayout'
import { parseShareUrl } from '@/utils/shareUrl'
import { ROUTE_MODES } from '@/utils/modeRoutes'

function ScenarioPanel() {
  const { scenarios, addScenario, removeScenario } = useCalcStore()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[hsl(var(--fg-muted))]">
          Сценарии ({scenarios.length}/4)
        </p>
        {scenarios.length < 4 && (
          <button
            onClick={addScenario}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Добавить сценарий"
          >
            <Plus size={12} /> Добавить
          </button>
        )}
      </div>
      <div className="space-y-2">
        {scenarios.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 px-3 py-2"
          >
            <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{s.label}</p>
              <p className="text-xs text-[hsl(var(--fg-muted))]">
                {s.params.annualRate}% · {s.params.years}л · итого{' '}
                <span className="text-emerald-400 tabular">
                  {Math.round(s.finalAmount).toLocaleString('ru-RU')} ₽
                </span>
              </p>
            </div>
            <button
              onClick={() => removeScenario(s.id)}
              className="text-[hsl(var(--fg-muted))] hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
              aria-label={`Удалить ${s.label}`}
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function MobileStickyBar() {
  const { breakdown, params } = useCalcStore()
  const final = breakdown[breakdown.length - 1]
  if (!final) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass border-t border-[hsl(var(--border))] px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[hsl(var(--fg-muted))]">Итоговая сумма</p>
          <p className="text-lg font-bold text-emerald-400 tabular">
            {formatMoney(final.total, params.currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[hsl(var(--fg-muted))]">Доход</p>
          <p className="text-base font-semibold tabular">
            +{formatMoney(final.interest, params.currency)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function InvesticiiPage() {
  const { mode, setParams, setMode, setTargetAmount, breakdown, params } = useCalcStore()
  const location = useLocation()

  const finalTotal = breakdown[breakdown.length - 1]?.total
  useEffect(() => {
    if (finalTotal == null) return
    const t = setTimeout(() => {
      saveToHistory({
        calculatorLabel: 'Инвестиции',
        calculatorUrl: '/investicii',
        summary: `${Math.round(finalTotal).toLocaleString('ru-RU')} ₽ за ${params.years} лет`,
      })
    }, 1500)
    return () => clearTimeout(t)
  }, [finalTotal, params.years])

  useEffect(() => {
    if (location.search) {
      const parsed = parseShareUrl(location.search)
      const { targetAmount, ...params } = parsed
      if (Object.keys(params).length > 0) setParams(params)
      if (targetAmount !== undefined) setTargetAmount(targetAmount)
    }
    const modeFromPath = ROUTE_MODES[location.pathname]
    if (modeFromPath) setMode(modeFromPath)
  }, [])

  const sidebar = (
    <>
      <ModeSelector />
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.18 }}
        >
          <CalculatorForm />
          {mode === 'comparison' && (
            <div className="mt-5 pt-5 border-t border-[hsl(var(--border))]">
              <ScenarioPanel />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )

  const content = (
    <>
      <ResultCard />
      <AnimatePresence mode="wait">
        {mode === 'comparison' ? (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="glass rounded-2xl p-5"
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
              Сравнение сценариев
            </h2>
            <ComparisonChart />
          </motion.div>
        ) : (
          <motion.div
            key="main-charts"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-5"
          >
            <div className="glass rounded-2xl p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
                Рост капитала
              </h2>
              <AreaChartComponent />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass rounded-2xl p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
                  Разбивка по годам
                </h2>
                <BarChartComponent />
              </div>
              <div className="glass rounded-2xl p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
                  Итоговое соотношение
                </h2>
                <PieChartComponent />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
            Разбивка по годам
          </h2>
          <ExportButtons />
        </div>
        <YearlyTable />
      </div>
    </>
  )

  return (
    <AppLayout>
      <CalcLayout sidebar={sidebar} content={content} />
      <MobileStickyBar />
    </AppLayout>
  )
}
