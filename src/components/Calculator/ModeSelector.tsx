import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCalcStore } from '@/stores/calcStore'
import type { CalculatorMode } from '@/types'
import { motion } from 'framer-motion'
import { MODE_ROUTES, ROUTE_MODES } from '@/utils/modeRoutes'

const MODES: { value: CalculatorMode; label: string }[] = [
  { value: 'accumulation', label: 'Накопление' },
  { value: 'goal', label: 'Взнос' },
  { value: 'duration', label: 'Срок' },
  { value: 'rate', label: 'Ставка' },
  { value: 'capital', label: 'Капитал' },
  { value: 'comparison', label: 'Сравнение' },
]

export function ModeSelector() {
  const { mode, setMode } = useCalcStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const modeFromPath = ROUTE_MODES[location.pathname]
    if (modeFromPath && modeFromPath !== mode) {
      setMode(modeFromPath)
    }
  }, [location.pathname])

  const handleModeChange = (m: CalculatorMode) => {
    setMode(m)
    navigate(MODE_ROUTES[m])
  }

  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-[hsl(var(--bg-card))]/50 p-1" role="tablist" aria-label="Режим калькулятора">
      {MODES.map(m => (
        <button
          key={m.value}
          role="tab"
          aria-selected={mode === m.value}
          onClick={() => handleModeChange(m.value)}
          className="relative rounded-lg px-2 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-center"
        >
          {mode === m.value && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute inset-0 rounded-lg bg-emerald-500/20 border border-emerald-500/40"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className={`relative z-10 ${mode === m.value ? 'text-emerald-400' : 'text-[hsl(var(--fg-muted))]'}`}>
            {m.label}
          </span>
        </button>
      ))}
    </div>
  )
}
