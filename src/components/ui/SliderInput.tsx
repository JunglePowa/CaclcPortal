import { labelCls } from './styles'

type Props = {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  /** Maximum for the number input (typically larger than slider max). */
  numberMax?: number
  /** Minimum for the number input (defaults to slider min). */
  numberMin?: number
  /** Use parseInt instead of parseFloat. */
  integer?: boolean
  ariaLabelSlider?: string
  ariaLabelNumber?: string
  /** Suffix appended to the number for screen readers (e.g. "%", " ₽", " лет"). */
  suffix?: string
}

/**
 * Slider + number input bound to a single value (no internal state).
 * Works with controlled `value` from the store, so external resets stay in sync.
 */
export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  numberMax,
  numberMin,
  integer,
  ariaLabelSlider,
  ariaLabelNumber,
  suffix,
}: Props) {
  const parse = (s: string): number => {
    const n = integer ? parseInt(s) : parseFloat(s)
    return Number.isFinite(n) ? n : 0
  }
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parse(e.target.value))}
          className="flex-1 accent-emerald-500"
          aria-label={ariaLabelSlider ?? `${label} слайдер`}
          aria-valuetext={`${value}${suffix ?? ''}`}
        />
        <input
          type="number"
          min={numberMin ?? min}
          max={numberMax ?? 100}
          step={step}
          value={value}
          onChange={e => onChange(parse(e.target.value))}
          className="w-20 flex-shrink-0 rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular"
          aria-label={ariaLabelNumber ?? `${label} число`}
        />
      </div>
    </div>
  )
}
