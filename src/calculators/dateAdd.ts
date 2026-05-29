export interface DateAddParams {
  start: string
  years: number
  months: number
  days: number
}

export interface DateAddResult {
  date: string
  dayOfWeek: string
  isValid: boolean
}

const DAY_MS = 24 * 60 * 60 * 1000
const WEEK_DAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']

function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return date
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
}

export function calculateDateAdd(params: DateAddParams): DateAddResult {
  const start = parseIsoDate(params.start)
  if (!start) return { date: '', dayOfWeek: '', isValid: false }

  const totalMonths = start.getUTCMonth() + Math.trunc(params.months || 0) + Math.trunc(params.years || 0) * 12
  const targetYear = start.getUTCFullYear() + Math.floor(totalMonths / 12)
  const targetMonth = ((totalMonths % 12) + 12) % 12
  const targetDay = Math.min(start.getUTCDate(), daysInMonth(targetYear, targetMonth))
  const withMonths = new Date(Date.UTC(targetYear, targetMonth, targetDay))
  const result = new Date(withMonths.getTime() + Math.trunc(params.days || 0) * DAY_MS)
  const date = result.toISOString().slice(0, 10)

  return {
    date,
    dayOfWeek: WEEK_DAYS[result.getUTCDay()],
    isValid: true,
  }
}
