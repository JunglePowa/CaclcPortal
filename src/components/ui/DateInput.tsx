import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { ru } from 'date-fns/locale'
import { format, parse, isValid } from 'date-fns'
import { Calendar } from 'lucide-react'
import { labelCls, inputCls } from './styles'
import 'react-day-picker/style.css'

interface DateInputProps {
  label: string
  value: string // ISO yyyy-MM-dd
  onChange: (iso: string) => void
  max?: string // ISO yyyy-MM-dd
  min?: string
  ariaLabel?: string
}

const DISPLAY_FMT = 'dd.MM.yyyy'

function isoToDate(iso: string): Date | undefined {
  if (!iso) return undefined
  const d = parse(iso, 'yyyy-MM-dd', new Date())
  return isValid(d) ? d : undefined
}

function dateToIso(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

export function DateInput({ label, value, onChange, max, min, ariaLabel }: DateInputProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selected = isoToDate(value)
  const display = selected ? format(selected, DISPLAY_FMT) : ''
  const maxDate = isoToDate(max ?? '')
  const minDate = isoToDate(min ?? '')

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <label className={labelCls}>{label}</label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={ariaLabel ?? label}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`${inputCls} flex items-center justify-between gap-2 text-left cursor-pointer`}
      >
        <span className={display ? '' : 'text-[hsl(var(--fg-muted))]'}>
          {display || 'дд.мм.гггг'}
        </span>
        <Calendar size={14} className="text-[hsl(var(--fg-muted))] flex-shrink-0" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Выбор даты"
          className="absolute z-20 mt-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] shadow-xl p-2"
        >
          <DayPicker
            mode="single"
            locale={ru}
            weekStartsOn={1}
            selected={selected}
            defaultMonth={selected ?? maxDate ?? new Date()}
            disabled={[
              ...(maxDate ? [{ after: maxDate }] : []),
              ...(minDate ? [{ before: minDate }] : []),
            ]}
            onSelect={(d) => {
              if (d) {
                onChange(dateToIso(d))
                setOpen(false)
                buttonRef.current?.focus()
              }
            }}
            captionLayout="dropdown"
            startMonth={new Date(1950, 0)}
            endMonth={new Date(2100, 11)}
          />
        </div>
      )}
    </div>
  )
}
