export interface StazhPeriod {
  start: string
  end: string
}

export interface StazhMergedPeriod {
  start: string
  end: string
  days: number
}

export interface StazhResult {
  totalDays: number
  years: number
  months: number
  days: number
  mergedPeriods: StazhMergedPeriod[]
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

function formatIsoDate(time: number): string {
  return new Date(time).toISOString().slice(0, 10)
}

function daysInclusive(start: number, end: number): number {
  return Math.floor((end - start) / DAY_MS) + 1
}

export function calculateStazh(periods: StazhPeriod[]): StazhResult {
  const normalized = periods
    .map((period) => {
      const start = parseIsoDate(period.start)
      const end = parseIsoDate(period.end)
      if (start === null || end === null) return null
      return start <= end ? { start, end } : { start: end, end: start }
    })
    .filter((period): period is { start: number; end: number } => period !== null)
    .sort((a, b) => a.start - b.start)

  const merged: { start: number; end: number }[] = []
  for (const period of normalized) {
    const last = merged[merged.length - 1]
    if (!last || period.start > last.end + DAY_MS) {
      merged.push({ ...period })
    } else {
      last.end = Math.max(last.end, period.end)
    }
  }

  const mergedPeriods = merged.map((period) => ({
    start: formatIsoDate(period.start),
    end: formatIsoDate(period.end),
    days: daysInclusive(period.start, period.end),
  }))

  const totalDays = mergedPeriods.reduce((sum, period) => sum + period.days, 0)
  const years = Math.floor(totalDays / 365)
  const afterYears = totalDays % 365
  const months = Math.floor(afterYears / 30)
  const days = afterYears % 30

  return { totalDays, years, months, days, mergedPeriods }
}
