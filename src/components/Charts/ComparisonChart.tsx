import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { useCalcStore } from '@/stores/calcStore'

function formatM(v: number) {
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`
  if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(0)}K`
  return v.toFixed(0)
}

export function ComparisonChart() {
  const { scenarios } = useCalcStore()
  if (scenarios.length === 0) return (
    <div className="flex items-center justify-center h-64 text-[hsl(var(--fg-muted))] text-sm">
      Добавьте сценарии для сравнения
    </div>
  )

  const maxYears = Math.max(...scenarios.map(s => s.breakdown.length))
  const data = Array.from({ length: maxYears }, (_, i) => {
    const row: Record<string, number | string> = { year: i + 1 }
    scenarios.forEach(s => {
      const b = s.breakdown[i]
      if (b) row[s.label] = Math.round(b.total)
    })
    return row
  })

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
        <YAxis tickFormatter={formatM} tick={{ fontSize: 11, fill: '#6b7280' }} />
        <Tooltip
          formatter={(v: number, name: string) => [v.toLocaleString('ru-RU') + ' ₽', name]}
          labelFormatter={(l) => `Год ${l}`}
          contentStyle={{ background: 'hsl(222 47% 12%)', border: '1px solid hsl(215 28% 20%)', borderRadius: 8, fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {scenarios.map(s => (
          <Line key={s.id} type="monotone" dataKey={s.label} stroke={s.color} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
