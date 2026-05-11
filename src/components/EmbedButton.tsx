import { useState } from 'react'
import { Code2, X, Check, Copy } from 'lucide-react'

interface EmbedButtonProps {
  path: string
  title: string
}

export function EmbedButton({ path, title }: EmbedButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const embedCode = `<iframe src="${origin}${path}" title="${title}" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #e5e7eb"></iframe>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] hover:border-emerald-500/40 transition-colors"
      >
        <Code2 size={12} />
        Встроить
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass rounded-2xl p-6 max-w-lg w-full space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Встроить калькулятор</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))]"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-[hsl(var(--fg-muted))]">Скопируйте код и вставьте на свой сайт</p>
            <pre className="rounded-lg bg-black/40 p-4 text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap break-all">
              {embedCode}
            </pre>
            <button
              onClick={handleCopy}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-4 py-2.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              {copied ? <><Check size={14} /> Скопировано!</> : <><Copy size={14} /> Копировать код</>}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
