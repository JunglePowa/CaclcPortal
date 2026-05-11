import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Line, LineChart, ComposedChart
} from 'recharts'
import { useCalcStore } from '@/stores/calcStore'

function formatM(v: number) {
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`
  if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(0)}K`
  return v.toFixed(0)
}

export function AreaChartComponent() {
  const { breakdown, params } = useCalcStore()
  const showReal = (params.inflationRate ?? 0) > 0

  const data = breakdown.map(b => ({
    year: b.year,
    Вложено: Math.round(b.principal + b.contributions),
    Доход: Math.round(b.interest),
    ...(showReal && b.realValue != null ? { Реальные: Math.round(b.realValue) } : {}),
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradInvested" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} label={{ value: 'Год', position: 'insideBottomRight', offset: -5, fontSize: 11, fill: '#6b7280' }} />
        <YAxis tickFormatter={formatM} tick={{ fontSize: 11, fill: '#6b7280' }} />
        <Tooltip
          formatter={(v: number, name: string) => [v.toLocaleString('ru-RU') + ' ₽', name]}
          labelFormatter={(l) => `Год ${l}`}
          contentStyle={{ background: 'hsl(222 47% 12%)', border: '1px solid hsl(215 28% 20%)', borderRadius: 8, fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="Вложено" stackId="1" stroke="#3b82f6" fill="url(#gradInvested)" strokeWidth={2} />
        <Area type="monotone" dataKey="Доход" stackId="1" stroke="#10b981" fill="url(#gradInterest)" strokeWidth={2} />
        {showReal && (
          <Line
            type="monotone"
            dataKey="Реальные"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
