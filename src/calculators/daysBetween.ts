export interface DaysBetweenParams {
  start: string
  end: string
  includeEndDate: boolean
}

export interface DaysBetweenResult {
  days: number
  weeks: number
  remainingDays: number
  yearsApprox: number
  monthsApprox: number
  direction: 'forward' | 'backward' | 'same'
}

const DAY_MS = 24 * 60 * 60 * 1000

function parseIsoDate(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const time = Date.UTC(year, month - 1, day)
  const date = new Date(time)
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return time
}

export function calculateDaysBetween(params: DaysBetweenParams): DaysBetweenResult {
  const start = parseIsoDate(params.start)
  const end = parseIsoDate(params.end)

  if (start === null || end === null) {
    return { days: 0, weeks: 0, remainingDays: 0, yearsApprox: 0, monthsApprox: 0, direction: 'same' }
  }

  const rawDays = Math.round((end - start) / DAY_MS)
  const direction = rawDays > 0 ? 'forward' : rawDays < 0 ? 'backward' : 'same'
  const absoluteDays = Math.abs(rawDays)
  const days = params.includeEndDate && absoluteDays > 0 ? absoluteDays + 1 : absoluteDays
  const weeks = Math.floor(days / 7)
  const remainingDays = days % 7
  const yearsApprox = Math.floor(days / 365)
  const monthsApprox = Math.floor((days % 365) / 30)

  return { days, weeks, remainingDays, yearsApprox, monthsApprox, direction }
}
