// Shared style classes used across calculator pages.
// Two input variants exist in the codebase (py-2 in layout-based pages,
// py-2.5 in stand-alone pages); we expose both to keep visuals identical.

export const inputClsCompact =
  'w-full rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular'

export const inputCls =
  'w-full rounded-lg border border-[hsl(var(--border))] px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 transition tabular'

export const selectClsCompact = `${inputClsCompact} cursor-pointer`
export const selectCls = `${inputCls} cursor-pointer`

export const labelCls =
  'block text-xs font-medium mb-1 text-[hsl(var(--fg-muted))] uppercase tracking-wide'

export const cardCls =
  'rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/80 backdrop-blur-sm p-5 space-y-1'

export const cardLabelCls =
  'text-xs text-[hsl(var(--fg-muted))] uppercase tracking-wide'

export const cardValueCls =
  'text-lg xl:text-2xl font-bold text-[hsl(var(--fg))] break-all tabular'

export const subtextCls = 'text-xs text-[hsl(var(--fg-muted))]'

export const dividerCls = 'border-t border-[hsl(var(--border))]'
