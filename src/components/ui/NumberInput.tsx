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
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      <input
        type="number"
        className={cls}
        value={value}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        aria-label={ariaLabel ?? label}
        onChange={e => {
          const raw = e.target.value
          const parsed = integer ? parseInt(raw) : parseFloat(raw)
          onChange(Number.isFinite(parsed) ? parsed : fb)
        }}
      />
    </div>
  )
}
