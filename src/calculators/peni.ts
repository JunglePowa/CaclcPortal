// Расчёт пени по налогам и страховым взносам по ст. 75 НК РФ
// Правила:
// - Физлица: всегда 1/300 ключевой ставки ЦБ за каждый день просрочки.
// - Организации: учитываем особые периоды 09.03.2022–31.12.2024 и 2025–2026.
// Параметр `keyRate` — ключевая ставка ЦБ в процентах годовых (одна на весь период для простоты).

export interface PeniParams {
  /** Сумма недоимки, ₽. */
  debt: number
  /** Дата возникновения долга (ISO yyyy-mm-dd). */
  startDate: string
  /** Дата уплаты (по умолчанию — сегодня). */
  endDate: string
  /** Ключевая ставка ЦБ в процентах годовых. */
  keyRate: number
  /** Физлицо (true) или юрлицо (false). */
  isIndividual: boolean
}

export interface PeniBreakdownRow {
  /** Подпись периода (например «1–30 день» или «с 31-го дня»). */
  label: string
  days: number
  /** Доля от ставки ЦБ для этого периода (1/300 или 1/150). */
  fraction: number
  amount: number
}

export interface PeniResult {
  /** Кол-во дней просрочки (включительно «по» дату уплаты). */
  days: number
  /** Итоговая сумма пени. */
  total: number
  breakdown: PeniBreakdownRow[]
}

function daysBetween(startISO: string, endISO: string): number {
  const start = new Date(startISO + 'T00:00:00Z').getTime()
  const end = new Date(endISO + 'T00:00:00Z').getTime()
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0
  const diff = Math.floor((end - start) / 86400000)
  return Math.max(0, diff)
}

function addDays(startISO: string, days: number): Date {
  const d = new Date(startISO + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

function inRange(date: Date, fromISO: string, toISO: string): boolean {
  const time = date.getTime()
  return time >= new Date(fromISO + 'T00:00:00Z').getTime() && time <= new Date(toISO + 'T00:00:00Z').getTime()
}

function organizationFraction(dayIndex: number, date: Date): number {
  if (inRange(date, '2022-03-09', '2024-12-31')) return 1 / 300
  if (inRange(date, '2025-01-01', '2026-12-31')) {
    if (dayIndex <= 30) return 1 / 300
    if (dayIndex <= 90) return 1 / 150
    return 1 / 300
  }
  return dayIndex <= 30 ? 1 / 300 : 1 / 150
}

function labelForFraction(fraction: number, startDay: number, endDay: number): string {
  const range = startDay === endDay ? `${startDay} день` : `${startDay}–${endDay} день`
  return `${range} (1/${Math.round(1 / fraction)} ставки ЦБ)`
}

export function calculatePeni(params: PeniParams): PeniResult {
  const { debt, startDate, endDate, keyRate, isIndividual } = params
  const days = daysBetween(startDate, endDate)

  if (days <= 0 || debt <= 0 || keyRate <= 0) {
    return { days, total: 0, breakdown: [] }
  }

  const ratePerDay = keyRate / 100 // годовая в долях

  if (isIndividual) {
    const amount = (debt * ratePerDay * days) / 300
    return {
      days,
      total: amount,
      breakdown: [
        {
          label: `1–${days} день (1/300 ставки ЦБ)`,
          days,
          fraction: 1 / 300,
          amount,
        },
      ],
    }
  }

  const breakdown: PeniBreakdownRow[] = []
  let currentFraction: number | null = null
  let currentStart = 1
  let currentDays = 0

  for (let day = 1; day <= days; day++) {
    const date = addDays(startDate, day)
    const fraction = organizationFraction(day, date)
    if (currentFraction === null) {
      currentFraction = fraction
      currentStart = day
      currentDays = 1
      continue
    }
    if (fraction === currentFraction) {
      currentDays += 1
      continue
    }
    const currentEnd = currentStart + currentDays - 1
    breakdown.push({
      label: labelForFraction(currentFraction, currentStart, currentEnd),
      days: currentDays,
      fraction: currentFraction,
      amount: debt * ratePerDay * currentDays * currentFraction,
    })
    currentFraction = fraction
    currentStart = day
    currentDays = 1
  }

  if (currentFraction !== null) {
    const currentEnd = currentStart + currentDays - 1
    breakdown.push({
      label: labelForFraction(currentFraction, currentStart, currentEnd),
      days: currentDays,
      fraction: currentFraction,
      amount: debt * ratePerDay * currentDays * currentFraction,
    })
  }

  const total = breakdown.reduce((sum, row) => sum + row.amount, 0)

  return {
    days,
    total,
    breakdown,
  }
}
