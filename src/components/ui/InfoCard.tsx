import type { ReactNode } from 'react'

type Props = {
  /** Optional uppercase title rendered at top of the card. */
  title?: string
  children: ReactNode
  /** Additional classes appended to the card. */
  className?: string
  /** Use 'glass' style (default) or border-card style. */
  variant?: 'glass' | 'card'
  /** Padding override, default p-6. */
  padding?: string
  /** Spacing between children, default space-y-3. */
  spacing?: string
}

export function InfoCard({
  title,
  children,
  className = '',
  variant = 'glass',
  padding = 'p-6',
  spacing = 'space-y-3',
}: Props) {
  const base =
    variant === 'glass'
      ? 'glass rounded-2xl'
      : 'rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/80 backdrop-blur-sm'
  return (
    <div className={`${base} ${padding} ${spacing} ${className}`}>
      {title && (
        <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--fg-muted))] mb-2">
          {title}
        </p>
      )}
      {children}
    </div>
  )
}

/** Horizontal divider matching the existing inline border-t pattern. */
export function Divider({ dashed }: { dashed?: boolean } = {}) {
  return (
    <div className={`border-t border-[hsl(var(--border))] ${dashed ? 'border-dashed' : ''}`} />
  )
}
