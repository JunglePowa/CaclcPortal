import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { useCalcStore } from '@/stores/calcStore'

function formatM(v: number) {
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`
  if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(0)}K`
  return v.toFixed(0)
}

export function BarChartComponent() {
  const { breakdown } = useCalcStore()
  const step = breakdown.length > 20 ? Math.ceil(breakdown.length / 20) : 1
  const filtered = breakdown.filter((_, i) => i % step === step - 1 || i === breakdown.length - 1)

  const data = filtered.map((b, i) => {
    const prev = i === 0 ? null : filtered[i - 1]
    const growthPct = prev && prev.total > 0
      ? ((b.total - prev.total) / prev.total * 100).toFixed(1) + '%'
      : null
    return {
      year: b.year,
      Начало: Math.round(b.principal),
      Довложения: Math.round(b.contributions),
      Проценты: Math.round(b.interest),
      _growthPct: growthPct,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
        <YAxis tickFormatter={formatM} tick={{ fontSize: 11, fill: '#6b7280' }} />
        <Tooltip
          formatter={(v: number, name: string) => [v.toLocaleString('ru-RU') + ' ₽', name]}
          labelFormatter={(l, payload) => {
            const item = payload?.[0]?.payload
            const growth = item?._growthPct ? ` (+${item._growthPct})` : ''
            return `Год ${l}${growth}`
          }}
          contentStyle={{ background: 'hsl(222 47% 12%)', border: '1px solid hsl(215 28% 20%)', borderRadius: 8, fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Начало" stackId="a" fill="#6366f1" radius={[0,0,0,0]} />
        <Bar dataKey="Довложения" stackId="a" fill="#3b82f6" />
        <Bar dataKey="Проценты" stackId="a" fill="#10b981" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
