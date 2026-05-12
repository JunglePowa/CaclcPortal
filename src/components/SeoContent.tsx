import { Link, useLocation } from 'react-router-dom'
import { SEO_PAGE_CONTENT } from '@/lib/seoPageContent'

export function SeoContent() {
  const location = useLocation()
  const content = SEO_PAGE_CONTENT[location.pathname]

  if (!content) return null

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-12 pt-2 sm:px-6">
      <nav className="mb-4 text-xs text-[hsl(var(--fg-muted))]">
        <Link to="/" className="hover:text-[hsl(var(--fg))]">Главная</Link>
        <span className="mx-2">/</span>
        <span>{content.category}</span>
      </nav>

      <div className="space-y-6 text-sm leading-6">
        <div>
          <h2 className="mb-2 text-xl font-semibold">{content.title}</h2>
          <p className="text-[hsl(var(--fg-muted))]">{content.lead}</p>
        </div>

        {content.formula && (
          <div>
            <h3 className="mb-1 text-base font-semibold">Формула</h3>
            <p className="text-[hsl(var(--fg-muted))]">{content.formula}</p>
          </div>
        )}

        <div>
          <h3 className="mb-1 text-base font-semibold">Пример расчёта</h3>
          <p className="text-[hsl(var(--fg-muted))]">{content.example}</p>
        </div>

        <div>
          <h3 className="mb-1 text-base font-semibold">Что важно учитывать</h3>
          <p className="text-[hsl(var(--fg-muted))]">{content.limitations}</p>
        </div>

        <div>
          <h3 className="mb-3 text-base font-semibold">Вопросы и ответы</h3>
          <div className="space-y-3">
            {content.faq.map((item) => (
              <details key={item.question} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/50 px-4 py-3">
                <summary className="cursor-pointer font-medium">{item.question}</summary>
                <p className="mt-2 text-[hsl(var(--fg-muted))]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-base font-semibold">Похожие калькуляторы</h3>
          <div className="flex flex-wrap gap-2">
            {content.related.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-xs text-[hsl(var(--fg-muted))] transition-colors hover:border-emerald-500/50 hover:text-[hsl(var(--fg))]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
