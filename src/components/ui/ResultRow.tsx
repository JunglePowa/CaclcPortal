import type { ReactNode } from 'react'

export type ResultRowColor =
  | 'default'
  | 'emerald'
  | 'amber'
  | 'red'
  | 'blue'
  | 'rose'
  | 'muted'

export type ResultRowSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl'

const colorMap: Record<ResultRowColor, string> = {
  default: 'text-[hsl(var(--fg))]',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  red: 'text-red-400',
  blue: 'text-blue-400',
  rose: 'text-rose-400',
  muted: 'text-[hsl(var(--fg-muted))]',
}

const sizeMap: Record<ResultRowSize, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
}

type Props = {
  label: string
  value: ReactNode
  color?: ResultRowColor
  /** Visual size of the value text. Default 'base'. */
  size?: ResultRowSize
  /** Apply opacity-60 to the row. */
  dimmed?: boolean
  /** Font weight. Default 'bold'. */
  weight?: 'bold' | 'semibold' | 'medium' | 'normal'
  /** @deprecated use weight='normal'/'medium' instead. */
  bold?: boolean
  /** @deprecated use weight='medium' instead. */
  medium?: boolean
}

/**
 * Single label + value row, used in result blocks.
 * Use `size` and `color` to match the calculator's existing visuals exactly.
 */
const weightMap: Record<NonNullable<Props['weight']>, string> = {
  bold: 'font-bold',
  semibold: 'font-semibold',
  medium: 'font-medium',
  normal: '',
}

export function ResultRow({
  label,
  value,
  color = 'default',
  size = 'base',
  dimmed,
  weight,
  bold = true,
  medium,
}: Props) {
  const resolvedWeight: NonNullable<Props['weight']> =
    weight ?? (bold ? 'bold' : medium ? 'medium' : 'normal')
  const weightCls = weightMap[resolvedWeight]
  return (
    <div className={`flex items-center justify-between ${dimmed ? 'opacity-60' : ''}`}>
      <span className="text-sm text-[hsl(var(--fg-muted))]">{label}</span>
      <span className={`tabular ${weightCls} ${sizeMap[size]} ${colorMap[color]}`}>
        {value}
      </span>
    </div>
  )
}
