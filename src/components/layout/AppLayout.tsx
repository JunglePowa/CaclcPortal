import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Footer } from '@/components/layout/Footer'
import { RelatedCalculators } from '@/components/RelatedCalculators'
import { SeoContent } from '@/components/SeoContent'
import { CALCULATOR_CATEGORIES } from '@/lib/calculatorCatalog'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mesh-bg min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))] glass">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <img
                src="/favicon.svg"
                alt=""
                className="h-10 w-10 flex-shrink-0 rounded-lg"
                aria-hidden
              />
              <div className="min-w-0">
                <h1 className="whitespace-nowrap text-base font-semibold leading-tight">Калк Портал</h1>
                <p className="hidden whitespace-nowrap text-xs text-[hsl(var(--fg-muted))] sm:block">
                  Онлайн калькуляторы
                </p>
              </div>
            </Link>
          </div>
          <div className="flex flex-shrink-0 items-center gap-3">
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Разделы калькуляторов">
              {CALCULATOR_CATEGORIES.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-[hsl(var(--fg-muted))] transition-colors hover:bg-[hsl(var(--bg-card))]/70 hover:text-[hsl(var(--fg))]"
                >
                  {category.label}
                </Link>
              ))}
            </nav>
            <Link
              to="/"
              className="hidden whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-[hsl(var(--fg-muted))] transition-colors hover:bg-[hsl(var(--bg-card))]/70 hover:text-[hsl(var(--fg))] sm:block"
            >
              Все калькуляторы
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col">
        {children}
        <RelatedCalculators />
        <SeoContent />
      </div>
      <Footer />
    </div>
  )
}
