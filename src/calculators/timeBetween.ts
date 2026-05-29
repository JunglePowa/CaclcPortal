export interface TimeBetweenParams {
  startDate: string
  startHour: number
  startMinute: number
  endDate: string
  endHour: number
  endMinute: number
}

export interface TimeBetweenResult {
  totalMinutes: number
  days: number
  hours: number
  minutes: number
  direction: 'forward' | 'backward' | 'same'
}

function parseDateTime(dateValue: string, hourValue: number, minuteValue: number): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return null
  const [year, month, day] = dateValue.split('-').map(Number)
  const hour = Math.min(23, Math.max(0, Math.trunc(Number.isFinite(hourValue) ? hourValue : 0)))
  const minute = Math.min(59, Math.max(0, Math.trunc(Number.isFinite(minuteValue) ? minuteValue : 0)))
  const time = Date.UTC(year, month - 1, day, hour, minute)
  const date = new Date(time)
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return time
}

export function calculateTimeBetween(params: TimeBetweenParams): TimeBetweenResult {
  const start = parseDateTime(params.startDate, params.startHour, params.startMinute)
  const end = parseDateTime(params.endDate, params.endHour, params.endMinute)
  if (start === null || end === null) {
    return { totalMinutes: 0, days: 0, hours: 0, minutes: 0, direction: 'same' }
  }

  const rawMinutes = Math.round((end - start) / 60000)
  const totalMinutes = Math.abs(rawMinutes)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  const direction = rawMinutes > 0 ? 'forward' : rawMinutes < 0 ? 'backward' : 'same'

  return { totalMinutes, days, hours, minutes, direction }
}
