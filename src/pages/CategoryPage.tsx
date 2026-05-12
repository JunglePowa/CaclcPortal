import { Link, Navigate, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { getCategoryBySlug } from '@/lib/calculatorCatalog'

export default function CategoryPage() {
  const location = useLocation()
  const slug = location.pathname.replace(/^\//, '')
  const data = getCategoryBySlug(slug)

  if (!data) return <Navigate to="/" replace />

  return (
    <AppLayout>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <nav className="mb-5 text-xs text-[hsl(var(--fg-muted))]">
          <Link to="/" className="hover:text-[hsl(var(--fg))]">Главная</Link>
          <span className="mx-2">/</span>
          <span>{data.label}</span>
        </nav>

        <section className="mb-8">
          <h1 className="mb-3 text-2xl font-bold sm:text-3xl">{data.title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-[hsl(var(--fg-muted))]">{data.intro}</p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {data.items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-4 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5"
            >
              <h2 className="mb-1 text-base font-semibold">{item.label}</h2>
              <p className="text-sm text-[hsl(var(--fg-muted))]">{item.desc}</p>
            </Link>
          ))}
        </section>
      </main>
    </AppLayout>
  )
}
