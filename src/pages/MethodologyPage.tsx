import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'

const SOURCES = [
  { href: '/nds', label: 'НДС' },
  { href: '/ndfl', label: 'НДФЛ' },
  { href: '/zarplata', label: 'Зарплата' },
  { href: '/kredit', label: 'Кредиты' },
  { href: '/ipoteka', label: 'Ипотека' },
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

        <p className="mt-6 text-xs text-[hsl(var(--fg-muted))]">Дата обновления: 2026-05-12</p>
      </article>
    </AppLayout>
  )
}
