import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, CreditCard, Receipt, Car, Heart, Search, Clock, X, ArrowRight, Percent, BriefcaseBusiness } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdBlock } from '@/components/AdBlock'
import { AD_SLOTS } from '@/lib/adSlots'
import { getHistory, clearHistory, formatRelativeTime } from '@/utils/history'
import type { HistoryEntry } from '@/utils/history'

interface CategoryItem {
  label: string
  desc: string
  href: string
  ready: boolean
}

const POPULAR_CALCULATORS = [
  { label: 'Вклад', href: '/deposit' },
  { label: 'Кредит', href: '/credit' },
  { label: 'НДС', href: '/vat' },
  { label: 'Зарплата', href: '/salary' },
  { label: 'Ипотека', href: '/mortgage' },
  { label: 'Проценты', href: '/percentage' },
  { label: 'Отпускные', href: '/vacation-pay' },
  { label: 'Скидка', href: '/discount' },
  { label: 'Сложный процент', href: '/compound-interest' },
]

const CATEGORIES = [
  {
    id: 'finance',
    href: '/finance',
    label: 'Финансы',
    icon: TrendingUp,
    color: 'emerald',
    items: [
      { label: 'Инвестиции', desc: 'Сложный процент, сценарии роста', href: '/investment', ready: true },
      { label: 'Сложный процент', desc: 'Рост капитала с пополнениями', href: '/compound-interest', ready: true },
      { label: 'Вклад', desc: 'Депозит с капитализацией', href: '/deposit', ready: true },
      { label: 'Облигации', desc: 'Доходность ОФЗ и корпоративных', href: '/bonds', ready: true },
    ],
  },
  {
    id: 'credit',
    href: '/loans',
    label: 'Кредиты',
    icon: CreditCard,
    color: 'blue',
    items: [
      { label: 'Кредит', desc: 'Ежемесячный платёж и переплата', href: '/credit', ready: true },
      { label: 'Кредитная карта', desc: 'Срок закрытия долга', href: '/credit-card', ready: true },
      { label: 'Ипотека', desc: 'Аннуитет и дифференциал', href: '/mortgage', ready: true },
      { label: 'Досрочное погашение', desc: 'Экономия на процентах', href: '/early-repayment', ready: true },
    ],
  },
  {
    id: 'tax',
    href: '/taxes',
    label: 'Налоги',
    icon: Receipt,
    color: 'amber',
    items: [
      { label: 'НДС', desc: 'Начислить и выделить НДС', href: '/vat', ready: true },
      { label: 'НДФЛ', desc: 'Налог на доходы физлиц', href: '/income-tax', ready: true },
      { label: 'Зарплата', desc: 'Гросс → нетто и наоборот', href: '/salary', ready: true },
      { label: 'Пени', desc: 'По налогам и страховым взносам', href: '/tax-penalties', ready: true },
    ],
  },
  {
    id: 'auto',
    href: '/auto',
    label: 'Авто',
    icon: Car,
    color: 'violet',
    items: [
      { label: 'Автокредит', desc: 'Платёж и переплата', href: '/autocredit', ready: true },
      { label: 'Расход топлива', desc: 'Литры на 100 км', href: '/fuel-consumption', ready: true },
      { label: 'Транспортный налог', desc: 'По мощности двигателя', href: '/transport-tax', ready: true },
    ],
  },
  {
    id: 'health',
    href: '/health',
    label: 'Здоровье',
    icon: Heart,
    color: 'rose',
    items: [
      { label: 'ИМТ', desc: 'Индекс массы тела', href: '/bmi', ready: true },
      { label: 'Срок беременности', desc: 'Дата родов по последней менструации', href: '/pregnancy', ready: true },
    ],
  },
  {
    id: 'math',
    href: '/math',
    label: 'Математика',
    icon: Percent,
    color: 'cyan',
    items: [
      { label: 'Проценты', desc: 'Процент от числа, скидки и рост', href: '/percentage', ready: true },
      { label: 'Дни между датами', desc: 'Дни, недели и примерный срок', href: '/days-between-dates', ready: true },
      { label: 'Дата плюс дни', desc: 'Прибавить дни, месяцы и годы', href: '/date-add', ready: true },
      { label: 'Время между датами', desc: 'Дни, часы и минуты', href: '/time-between', ready: true },
      { label: 'Скидка', desc: 'Цена со скидкой и экономия', href: '/discount', ready: true },
      { label: 'Возраст', desc: 'Возраст по дате рождения', href: '/age', ready: true },
      { label: 'Прибавить процент', desc: 'Увеличить число на процент', href: '/percentage/add-percent', ready: true },
      { label: 'Сколько процентов', desc: 'Доля одного числа от другого', href: '/percentage/what-percent', ready: true },
    ],
  },
  {
    id: 'work',
    href: '/work',
    label: 'Работа',
    icon: BriefcaseBusiness,
    color: 'slate',
    items: [
      { label: 'Отпускные', desc: 'Средний заработок и НДФЛ', href: '/vacation-pay', ready: true },
      { label: 'Стаж', desc: 'Сумма периодов работы', href: '/work-experience', ready: true },
      { label: 'Зарплата', desc: 'Гросс, нетто и взносы', href: '/salary', ready: true },
    ],
  },
]

type ColorKey = 'emerald' | 'blue' | 'amber' | 'violet' | 'rose' | 'cyan' | 'slate'

const colorMap: Record<ColorKey, string> = {
  emerald: 'border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5',
  blue: 'border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/5',
  amber: 'border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5',
  violet: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/5',
  rose: 'border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-500/5',
  cyan: 'border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-500/5',
  slate: 'border-slate-500/30 hover:border-slate-500/60 hover:bg-slate-500/5',
}

const iconColorMap: Record<ColorKey, string> = {
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  amber: 'text-amber-400',
  violet: 'text-violet-400',
  rose: 'text-rose-400',
  cyan: 'text-cyan-400',
  slate: 'text-slate-400',
}

function CalcCard({ item, color }: { item: CategoryItem; color: string }) {
  const c = color as ColorKey
  if (!item.ready) {
    return (
      <div className={`rounded-xl border bg-[hsl(var(--bg-card))]/48 p-4 opacity-50 cursor-not-allowed ${colorMap[c]}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-[hsl(var(--fg-muted))] mt-0.5">{item.desc}</p>
          </div>
          <span className="text-[10px] border border-[hsl(var(--border))] rounded px-1.5 py-0.5 text-[hsl(var(--fg-muted))] whitespace-nowrap flex-shrink-0">
            скоро
          </span>
        </div>
      </div>
    )
  }

  return (
    <Link to={item.href} className={`group block rounded-xl border bg-[hsl(var(--bg-card))]/48 p-4 shadow-[0_12px_34px_hsl(220_45%_3%/0.12)] transition-all hover:-translate-y-0.5 ${colorMap[c]}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{item.label}</p>
        <ArrowRight size={15} className="mt-0.5 text-[hsl(var(--fg-muted))] transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="text-xs text-[hsl(var(--fg-muted))] mt-0.5">{item.desc}</p>
    </Link>
  )
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const filteredCategories = query.trim()
    ? CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase())
        ),
      })).filter(cat => cat.items.length > 0)
    : CATEGORIES

  const isSearching = query.trim().length > 0

  return (
    <AppLayout>
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/16">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-end">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Инструменты для ежедневных расчётов
              </p>
              <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">Онлайн калькуляторы без лишних шагов</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[hsl(var(--fg-muted))] sm:text-base">
                Быстрые расчёты для финансов, кредитов, налогов, авто и здоровья с понятными формулами и без лишних шагов.
              </p>
            </div>
            <div className="relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/58 p-2 shadow-[0_18px_48px_hsl(220_45%_3%/0.16)]">
              <Search
                size={15}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[hsl(var(--fg-muted))]"
              />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Найти калькулятор..."
                className="w-full rounded-xl border border-transparent bg-[hsl(var(--bg)/0.36)] py-3.5 pl-10 pr-10 text-sm transition-colors focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[hsl(var(--fg-muted))] transition-colors hover:text-[hsl(var(--fg))]"
                  aria-label="Очистить поиск"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--fg-muted))]">Популярное</span>
            {POPULAR_CALCULATORS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/50 px-3 py-2 text-xs font-medium transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/5"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ['Автосохранение', 'недавние расчёты под рукой'],
              ['Экспорт', 'таблицы и результаты можно забрать'],
              ['Формулы', 'пояснения к каждому расчёту'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/38 px-4 py-3">
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-0.5 text-xs text-[hsl(var(--fg-muted))]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog */}
      <div className="mx-auto max-w-[1440px] space-y-10 px-4 pb-14 pt-8 sm:px-6 lg:px-8">

        {/* Recent history */}
        {history.length > 0 && !isSearching && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[hsl(var(--fg-muted))]" />
                <h2 className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">Недавние</h2>
              </div>
              <button
                onClick={() => { clearHistory(); setHistory([]) }}
                className="text-xs text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] transition-colors"
              >
                Очистить
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map(entry => (
                <Link
                  key={entry.id}
                  to={entry.calculatorUrl}
                  className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 px-3 py-2 text-xs hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
                >
                  <div>
                    <p className="font-medium">{entry.calculatorLabel}</p>
                    <p className="text-[hsl(var(--fg-muted))]">{entry.summary}</p>
                  </div>
                  <span className="text-[hsl(var(--fg-muted))] ml-2 whitespace-nowrap">{formatRelativeTime(entry.timestamp)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <AdBlock blockId={AD_SLOTS.home} className="my-2" />

        {/* Search results or full catalog */}
        {isSearching ? (
          filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-[hsl(var(--fg-muted))]">
              <p className="text-sm">Ничего не найдено по запросу «{query}»</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCategories.flatMap(cat =>
                cat.items.map(item => (
                  <CalcCard key={item.href} item={item} color={cat.color} />
                ))
              )}
            </div>
          )
        ) : (
          CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <section key={cat.id} aria-labelledby={`category-${cat.id}`} className="scroll-mt-24">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <Link to={cat.href} className="group inline-flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/55">
                      <Icon size={16} className={iconColorMap[cat.color as ColorKey]} />
                    </span>
                    <h2 id={`category-${cat.id}`} className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))] transition-colors group-hover:text-[hsl(var(--fg))]">
                      {cat.label}
                    </h2>
                  </Link>
                  <Link to={cat.href} className="hidden text-xs font-medium text-[hsl(var(--fg-muted))] transition-colors hover:text-[hsl(var(--fg))] sm:inline-flex">
                    В раздел
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {cat.items.map((item) => (
                    <CalcCard key={item.href} item={item} color={cat.color} />
                  ))}
                </div>
              </section>
            )
          })
        )}

        <AdBlock blockId={AD_SLOTS.homeBottom} className="mt-4" />
      </div>
    </AppLayout>
  )
}
