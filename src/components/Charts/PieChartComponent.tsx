import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useCalcStore } from '@/stores/calcStore'

const COLORS = ['#3b82f6', '#10b981']

export function PieChartComponent() {
  const { breakdown, params } = useCalcStore()
  const final = breakdown[breakdown.length - 1]
  if (!final) return null

  const invested = final.principal + final.contributions
  const interest = Math.max(0, final.interest)

  const data = [
    { name: 'Вложено', value: Math.round(invested) },
    { name: 'Заработано', value: Math.round(interest) },
  ]

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
        </Pie>
        <Tooltip
          formatter={(v: number, name: string) => [v.toLocaleString('ru-RU') + ' ₽', name]}
          contentStyle={{ background: 'hsl(222 47% 12%)', border: '1px solid hsl(215 28% 20%)', borderRadius: 8, fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
