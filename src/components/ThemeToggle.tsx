import { useCalcStore } from '@/stores/calcStore'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { theme, setTheme } = useCalcStore()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative h-8 w-14 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
    >
      <motion.div
        layout
        className="absolute top-0.5 h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center"
        animate={{ left: isDark ? 2 : 'calc(100% - 30px)' }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      >
        {isDark ? <Moon size={14} className="text-white" /> : <Sun size={14} className="text-white" />}
      </motion.div>
    </button>
  )
}
