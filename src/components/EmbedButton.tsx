import { useEffect, useId, useRef, useState } from 'react'
import { Code2, X, Check, Copy } from 'lucide-react'

interface EmbedButtonProps {
  path: string
  title: string
}

export function EmbedButton({ path, title }: EmbedButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const titleId = useId()

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const embedCode = `<iframe src="${origin}${path}" title="${title}" width="100%" height="700" style="border:0;border-radius:12px;border:1px solid #e5e7eb"></iframe>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const close = () => setOpen(false)

  // Открытие: фокус на close-кнопку. Закрытие: возврат фокуса на триггер.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeBtnRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        // Простой focus trap внутри диалога
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement as HTMLElement | null
        if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      // Возвращаем фокус на триггер (или предыдущий элемент)
      if (triggerRef.current) triggerRef.current.focus()
      else previouslyFocused?.focus?.()
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] hover:border-emerald-500/40 transition-colors"
      >
        <Code2 size={12} />
        Встроить
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={close}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="glass rounded-2xl p-6 max-w-lg w-full space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 id={titleId} className="text-sm font-semibold">Встроить калькулятор</h3>
              <button
                ref={closeBtnRef}
                onClick={close}
                aria-label="Закрыть диалог"
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
