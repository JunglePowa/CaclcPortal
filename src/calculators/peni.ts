// Расчёт пени по налогам и страховым взносам по ст. 75 НК РФ
// Правила (с 2023 г., после моратория):
// - Физлица: всегда 1/300 ключевой ставки ЦБ за каждый день просрочки.
// - Организации: первые 30 дней — 1/300, с 31-го дня — 1/150 ключевой ставки ЦБ.
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

  // Юрлицо
  const firstPeriod = Math.min(days, 30)
  const secondPeriod = Math.max(0, days - 30)

  const amount1 = (debt * ratePerDay * firstPeriod) / 300
  const amount2 = (debt * ratePerDay * secondPeriod) / 150

  const breakdown: PeniBreakdownRow[] = [
    {
      label: `1–${firstPeriod} день (1/300 ставки ЦБ)`,
      days: firstPeriod,
      fraction: 1 / 300,
      amount: amount1,
    },
  ]
  if (secondPeriod > 0) {
    breakdown.push({
      label: `с 31-го дня (${secondPeriod} дн., 1/150 ставки ЦБ)`,
      days: secondPeriod,
      fraction: 1 / 150,
      amount: amount2,
    })
  }

  return {
    days,
    total: amount1 + amount2,
    breakdown,
  }
}
