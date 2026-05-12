import { Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'

export default function NotFoundPage() {
  return (
    <AppLayout>
      <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
          <Search size={22} className="text-amber-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Страница не найдена</h1>
        <p className="mb-6 text-sm text-[hsl(var(--fg-muted))]">
          Такого калькулятора здесь нет. Вернитесь в каталог и выберите нужный инструмент.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <ArrowLeft size={16} />
          Все калькуляторы
        </Link>
      </main>
    </AppLayout>
  )
}
