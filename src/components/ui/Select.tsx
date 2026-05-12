import { labelCls, selectCls, selectClsCompact } from './styles'

type Option<T extends string | number> = { value: T; label: string }

type Props<T extends string | number> = {
  label: string
  value: T
  onChange: (v: T) => void
  options: Option<T>[]
  ariaLabel?: string
  /** Compact variant (py-2) for sidebar. Default uses py-2.5. */
  compact?: boolean
  /** Hint when option values are numeric — converts the change event's string back. */
  numeric?: boolean
  /** Use parseInt instead of parseFloat for numeric values (default true if numeric). */
  integer?: boolean
}

export function Select<T extends string | number>({
  label,
  value,
  onChange,
  options,
  ariaLabel,
  compact,
  numeric,
  integer = true,
}: Props<T>) {
  const cls = compact ? selectClsCompact : selectCls
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <select
        className={cls}
        value={value as string | number}
        onChange={e => {
          const raw = e.target.value
          if (numeric) {
            const n = integer ? parseInt(raw) : parseFloat(raw)
            onChange(n as T)
          } else {
            onChange(raw as T)
          }
        }}
        aria-label={ariaLabel ?? label}
      >
        {options.map(o => (
          <option key={String(o.value)} value={o.value as string | number}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
