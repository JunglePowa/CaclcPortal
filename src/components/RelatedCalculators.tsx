import { Link, useLocation } from 'react-router-dom'
import { SEO_PAGE_CONTENT } from '@/lib/seoPageContent'

export function RelatedCalculators() {
  const location = useLocation()
  const related = SEO_PAGE_CONTENT[location.pathname]?.related

  if (!related?.length) return null

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-8 pt-2 sm:px-6">
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/45 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
          Похожие калькуляторы
        </h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-sm font-medium transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/5"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
