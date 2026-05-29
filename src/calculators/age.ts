export interface AgeParams {
  birthDate: string
  targetDate: string
}

export interface AgeResult {
  years: number
  months: number
  days: number
  totalDays: number
  nextBirthdayDays: number
}

const DAY_MS = 24 * 60 * 60 * 1000

function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return date
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
}

function addYears(date: Date, years: number): Date {
  const year = date.getUTCFullYear() + years
  const month = date.getUTCMonth()
  const day = Math.min(date.getUTCDate(), daysInMonth(year, month))
  return new Date(Date.UTC(year, month, day))
}

export function calculateAge(params: AgeParams): AgeResult {
  const birth = parseIsoDate(params.birthDate)
  const target = parseIsoDate(params.targetDate)
  if (!birth || !target) return { years: 0, months: 0, days: 0, totalDays: 0, nextBirthdayDays: 0 }

  const start = birth <= target ? birth : target
  const end = birth <= target ? target : birth
  const totalDays = Math.floor((end.getTime() - start.getTime()) / DAY_MS)

  let years = end.getUTCFullYear() - start.getUTCFullYear()
  let months = end.getUTCMonth() - start.getUTCMonth()
  let days = end.getUTCDate() - start.getUTCDate()

  if (days < 0) {
    months -= 1
    const previousMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0))
    days += previousMonth.getUTCDate()
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  let nextBirthday = addYears(start, years)
  if (nextBirthday <= end) nextBirthday = addYears(start, years + 1)
  const nextBirthdayDays = Math.ceil((nextBirthday.getTime() - end.getTime()) / DAY_MS)

  return { years, months, days, totalDays, nextBirthdayDays }
}
