// Shared style classes used across calculator pages.
// Two input variants exist in the codebase (py-2 in layout-based pages,
// py-2.5 in stand-alone pages); we expose both to keep visuals identical.

export const inputClsCompact =
  'w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg)/0.38)] px-3 py-2 text-sm shadow-inner shadow-black/5 transition tabular placeholder:text-[hsl(var(--fg-muted))]/70 hover:border-[hsl(var(--fg-muted))]/60 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/25'

export const inputCls =
  'w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg)/0.38)] px-3 py-2.5 text-sm shadow-inner shadow-black/5 transition tabular placeholder:text-[hsl(var(--fg-muted))]/70 hover:border-[hsl(var(--fg-muted))]/60 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/25'

export const selectClsCompact = `${inputClsCompact} cursor-pointer`
export const selectCls = `${inputCls} cursor-pointer`

export const labelCls =
  'block text-xs font-semibold mb-1.5 text-[hsl(var(--fg-muted))] uppercase tracking-wide'

export const cardCls =
  'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/78 p-5 space-y-1 shadow-[0_14px_36px_hsl(220_45%_3%/0.16)] backdrop-blur-sm transition-colors hover:border-[hsl(var(--fg-muted))]/40'

export const cardLabelCls =
  'text-xs text-[hsl(var(--fg-muted))] uppercase tracking-wide'

export const cardValueCls =
  'text-xl xl:text-2xl font-bold leading-tight text-[hsl(var(--fg))] break-all tabular'

export const subtextCls = 'text-xs text-[hsl(var(--fg-muted))]'

export const dividerCls = 'border-t border-[hsl(var(--border))]'
