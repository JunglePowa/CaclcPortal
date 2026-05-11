import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, CreditCard, Receipt, Car, Heart, Search, Clock, X } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { getHistory, clearHistory, formatRelativeTime } from '@/utils/history'
import type { HistoryEntry } from '@/utils/history'

interface CategoryItem {
  label: string
  desc: string
  href: string
  ready: boolean
}

const CATEGORIES = [
  {
    id: 'finance',
    label: 'Финансы',
    icon: TrendingUp,
    color: 'emerald',
    items: [
      { label: 'Инвестиции', desc: 'Сложный процент, сценарии роста', href: '/investicii', ready: true },
      { label: 'Вклад', desc: 'Депозит с капитализацией', href: '/vklad', ready: true },
      { label: 'Облигации', desc: 'Доходность ОФЗ и корпоративных', href: '/obligacii', ready: false },
    ],
  },
  {
    id: 'credit',
    label: 'Кредиты',
    icon: CreditCard,
    color: 'blue',
    items: [
      { label: 'Кредит', desc: 'Ежемесячный платёж и переплата', href: '/kredit', ready: true },
      { label: 'Ипотека', desc: 'Аннуитет и дифференциал', href: '/ipoteka', ready: false },
      { label: 'Досрочное погашение', desc: 'Экономия на процентах', href: '/kredit-dosrochnoe', ready: false },
    ],
  },
  {
    id: 'tax',
    label: 'Налоги',
    icon: Receipt,
    color: 'amber',
    items: [
      { label: 'НДС', desc: 'Начислить и выделить НДС', href: '/nds', ready: true },
      { label: 'НДФЛ', desc: 'Налог на доходы физлиц', href: '/ndfl', ready: true },
      { label: 'Зарплата', desc: 'Гросс → нетто и наоборот', href: '/zarplata', ready: true },
      { label: 'Пени', desc: 'По налогам и страховым взносам', href: '/peni', ready: false },
    ],
  },
  {
    id: 'auto',
    label: 'Авто',
    icon: Car,
    color: 'violet',
    items: [
      { label: 'Расход топлива', desc: 'Литры на 100 км', href: '/rashod-topliva', ready: true },
      { label: 'Транспортный налог', desc: 'По мощности двигателя', href: '/transportnyj-nalog', ready: true },
    ],
  },
  {
    id: 'health',
    label: 'Здоровье',
    icon: Heart,
    color: 'rose',
    items: [
      { label: 'ИМТ', desc: 'Индекс массы тела', href: '/imt', ready: true },
      { label: 'Срок беременности', desc: 'Дата родов по последней менструации', href: '/beremennost', ready: true },
    ],
  },
]

type ColorKey = 'emerald' | 'blue' | 'amber' | 'violet' | 'rose'

const colorMap: Record<ColorKey, string> = {
  emerald: 'border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5',
  blue: 'border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/5',
  amber: 'border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5',
  violet: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/5',
  rose: 'border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-500/5',
}

const iconColorMap: Record<ColorKey, string> = {
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  amber: 'text-amber-400',
  violet: 'text-violet-400',
  rose: 'text-rose-400',
}

function CalcCard({ item, color }: { item: CategoryItem; color: string }) {
  const c = color as ColorKey
  if (!item.ready) {
    return (
      <div className={`rounded-xl border p-4 opacity-50 cursor-not-allowed ${colorMap[c]}`}>
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
    <Link to={item.href} className={`rounded-xl border p-4 transition-all ${colorMap[c]} block`}>
      <p className="text-sm font-medium">{item.label}</p>
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
      {/* Hero */}
      <div className="text-center py-10 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Онлайн калькуляторы</h1>
        <p className="text-[hsl(var(--fg-muted))] text-sm mb-6">
          Финансы, кредиты, налоги, авто и здоровье
        </p>
        <div className="relative max-w-md mx-auto">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--fg-muted))]"
          />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Найти калькулятор..."
            className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Catalog */}
      <div className="mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-8 space-y-8">

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
                  className="flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 px-3 py-2 text-xs hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
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

        {/* Search results or full catalog */}
        {isSearching ? (
          filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-[hsl(var(--fg-muted))]">
              <p className="text-sm">Ничего не найдено по запросу «{query}»</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
              <div key={cat.id}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={16} className={iconColorMap[cat.color as ColorKey]} />
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))]">
                    {cat.label}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {cat.items.map((item) => (
                    <CalcCard key={item.href} item={item} color={cat.color} />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </AppLayout>
  )
}
