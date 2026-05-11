import { useCalcStore } from '@/stores/calcStore'
import { getCurrencySymbol } from '@/utils/formatCurrency'

export function YearlyTable() {
  const { breakdown, params } = useCalcStore()
  const symbol = getCurrencySymbol(params.currency)

  const thCls = 'py-2 px-3 text-left text-xs font-medium text-[hsl(var(--fg-muted))] uppercase tracking-wide'
  const tdCls = 'py-2 px-3 text-sm tabular'

  return (
    <div className="overflow-auto max-h-72 rounded-xl border border-[hsl(var(--border))]">
      <table className="w-full min-w-[680px] border-collapse">
        <thead className="sticky top-0 bg-[hsl(var(--bg-card))] z-10">
          <tr className="border-b border-[hsl(var(--border))]">
            <th className={thCls}>Год</th>
            <th className={`${thCls} text-right`}>Взнос</th>
            <th className={`${thCls} text-right`}>Вложено</th>
            <th className={`${thCls} text-right`}>Доход</th>
            <th className={`${thCls} text-right`}>Итого</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map((row, i) => {
            const prevTotal = i === 0 ? row.principal : breakdown[i - 1].total
            const annualContrib = i === 0 ? row.contributions : row.contributions - breakdown[i - 1].contributions
            const annualInterest = row.total - prevTotal - annualContrib
            return (
              <tr key={row.year} className={`border-b border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--bg-card))]/60 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                <td className={tdCls}>{row.year}</td>
                <td className={`${tdCls} text-right text-blue-400`}>{Math.round(annualContrib).toLocaleString('ru-RU')} {symbol}</td>
                <td className={`${tdCls} text-right`}>{Math.round(prevTotal).toLocaleString('ru-RU')} {symbol}</td>
                <td className={`${tdCls} text-right text-emerald-400`}>{Math.round(Math.max(0, annualInterest)).toLocaleString('ru-RU')} {symbol}</td>
                <td className={`${tdCls} text-right font-semibold`}>{Math.round(row.total).toLocaleString('ru-RU')} {symbol}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
