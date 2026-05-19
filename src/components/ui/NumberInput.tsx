import { useEffect, useState } from 'react'
import { inputCls, inputClsCompact, labelCls } from './styles'

type Props = {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  placeholder?: string
  ariaLabel?: string
  /**
   * Compact variant uses py-2 (matches sidebar inputs in Vklad/Kredit).
   * Default uses py-2.5 (matches form inputs in Nds/Ndfl/Imt/etc.).
   */
  compact?: boolean
  /** Use parseInt instead of parseFloat (for whole-number values). */
  integer?: boolean
  /** Default value when input becomes invalid (default 0, or 1 if min>0). */
  fallback?: number
  className?: string
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  ariaLabel,
  compact,
  integer,
  fallback,
  className,
}: Props) {
  const cls = compact ? inputClsCompact : inputCls
  const fb = fallback ?? (min && min > 0 ? min : 0)
  const [draft, setDraft] = useState(String(value))
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!isEditing) {
      setDraft(String(value))
    }
  }, [isEditing, value])

  const normalize = (raw: string) => {
    const parsed = integer ? parseInt(raw) : parseFloat(raw)
    let next = Number.isFinite(parsed) ? parsed : fb

    if (typeof min === 'number') next = Math.max(min, next)
    if (typeof max === 'number') next = Math.min(max, next)
    if (integer) next = Math.round(next)

    return next
  }

  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      <input
        type="number"
        className={cls}
        value={draft}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        aria-label={ariaLabel ?? label}
        onFocus={() => setIsEditing(true)}
        onChange={e => {
          const raw = e.target.value
          setDraft(raw)

          if (raw === '') return

          const parsed = integer ? parseInt(raw) : parseFloat(raw)
          if (Number.isFinite(parsed)) {
            let next = parsed
            if (typeof min === 'number') next = Math.max(min, next)
            if (typeof max === 'number') next = Math.min(max, next)
            if (integer) next = Math.round(next)
            onChange(next)
          }
        }}
        onBlur={e => {
          const next = normalize(e.target.value)
          setIsEditing(false)
          setDraft(String(next))
          onChange(next)
        }}
      />
    </div>
  )
}
