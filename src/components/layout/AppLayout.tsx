import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mesh-bg min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))] glass">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-none">КалкПортал</h1>
                <p className="text-xs text-[hsl(var(--fg-muted))]">Онлайн калькуляторы</p>
              </div>
            </Link>
            <Link
              to="/"
              className="hidden sm:block text-xs text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] transition-colors"
            >
              Все калькуляторы
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>
      {children}
    </div>
  )
}
