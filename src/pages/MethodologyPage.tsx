import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'

const SOURCES = [
  { href: '/vat', label: 'НДС' },
  { href: '/vat/extract', label: 'Выделение НДС' },
  { href: '/income-tax', label: 'НДФЛ' },
  { href: '/income-tax/2026', label: 'НДФЛ 2026' },
  { href: '/salary', label: 'Зарплата' },
  { href: '/credit', label: 'Кредиты' },
  { href: '/credit/annuity', label: 'Аннуитетный платёж' },
  { href: '/early-repayment', label: 'Досрочное погашение' },
  { href: '/deposit', label: 'Вклады' },
  { href: '/mortgage', label: 'Ипотека' },
  { href: '/fuel-consumption', label: 'Расход топлива' },
]

export default function MethodologyPage() {
  return (
    <AppLayout>
      <article className="mx-auto max-w-2xl px-4 py-8 text-sm leading-6 sm:px-6">
        <h1 className="mb-4 text-2xl font-bold">Методика расчётов</h1>
        <p className="mb-4 text-[hsl(var(--fg-muted))]">
          Калькуляторы Калк Портал предназначены для предварительной оценки. Формулы вынесены в
          отдельные модули, а ключевые расчёты покрыты автоматическими тестами.
        </p>

        <h2 className="mb-2 mt-6 text-lg font-semibold">Как обновляются правила</h2>
        <p className="text-[hsl(var(--fg-muted))]">
          Для налоговых калькуляторов используются актуальные ставки и пороги, действующие на дату
          обновления страницы. Если закон или порядок расчёта меняется, формулы и описания нужно
          пересматривать перед публикацией.
        </p>

        <h2 className="mb-2 mt-6 text-lg font-semibold">Что проверяется перед публикацией</h2>
        <p className="text-[hsl(var(--fg-muted))]">
          Для новых посадочных страниц проверяются уникальные title и description, canonical,
          наличие страницы в sitemap, prerender HTML, FAQ-разметка и внутренняя перелинковка.
          Расчётные модули проверяются автоматическими тестами там, где это критично для формул.
        </p>

        <h2 className="mb-2 mt-6 text-lg font-semibold">Дата актуальности</h2>
        <p className="text-[hsl(var(--fg-muted))]">
          Налоговые, кредитные и финансовые формулы считаются актуальными на дату последнего
          обновления страницы. Для тем, зависящих от закона, банковских правил или ключевой ставки,
          результат нужно использовать как предварительную оценку.
        </p>

        <h2 className="mb-2 mt-6 text-lg font-semibold">Ограничения</h2>
        <p className="text-[hsl(var(--fg-muted))]">
          Расчёты не являются бухгалтерской, налоговой, юридической или медицинской консультацией.
          Для нестандартных ситуаций сверяйте результат с первичными документами, условиями договора
          и официальными источниками.
        </p>

        <h2 className="mb-2 mt-6 text-lg font-semibold">Разделы с пояснениями</h2>
        <ul className="list-disc space-y-1 pl-5">
          {SOURCES.map((item) => (
            <li key={item.href}>
              <Link to={item.href} className="underline hover:text-emerald-500">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-[hsl(var(--fg-muted))]">Дата обновления: 2026-05-26</p>
      </article>
    </AppLayout>
  )
}
