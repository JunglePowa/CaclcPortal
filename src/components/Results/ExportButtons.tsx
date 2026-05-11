import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { useCalcStore } from '@/stores/calcStore'
import { buildShareUrl } from '@/utils/shareUrl'
import { EmbedButton } from '@/components/EmbedButton'

export function ExportButtons() {
  const { breakdown, params, mode, targetAmount } = useCalcStore()
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = buildShareUrl(mode, params, targetAmount)
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function exportCSV() {
    const headers = ['Год', 'Начальная сумма', 'Довложения', 'Чистый доход', 'Итого', 'Реальные (с учётом инфляции)']
    const rows = breakdown.map(b => [
      b.year,
      b.principal,
      b.contributions,
      Math.round(b.interest),
      Math.round(b.total),
      b.realValue ? Math.round(b.realValue) : '',
    ])
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `compound_${params.annualRate}pct_${params.years}yr.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function exportPNG() {
    const { default: html2canvas } = await import('html2canvas')
    const el = document.getElementById('charts-panel')
    if (!el) return
    const canvas = await html2canvas(el, { backgroundColor: '#0d1117', scale: 2 })
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `compound_chart.png`
    a.click()
  }

  const btnCls = 'flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 hover:bg-[hsl(var(--bg-card))] px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'

  return (
    <div className="flex gap-2 flex-wrap">
      <button onClick={exportCSV} className={btnCls} aria-label="Экспорт в CSV">
        <span>↓</span> CSV
      </button>
      <button onClick={exportPNG} className={btnCls} aria-label="Экспорт в PNG">
        <span>↓</span> PNG
      </button>
      <button onClick={handleShare} className="flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] hover:border-emerald-500/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" aria-label="Поделиться ссылкой">
        {copied ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
        {copied ? 'Скопировано!' : 'Поделиться'}
      </button>
      <EmbedButton path="/investicii" title="Калькулятор инвестиций" />
    </div>
  )
}
