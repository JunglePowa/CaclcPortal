export interface BeremenostParams {
  lastPeriodDate: string   // ISO date string "YYYY-MM-DD"
  cycleLength: number      // длина цикла в днях (default 28)
}

export interface BeremenostResult {
  dueDate: string          // предполагаемая дата родов
  conceptionDate: string   // предполагаемая дата зачатия
  currentWeek: number      // текущая неделя беременности
  currentDay: number       // день текущей недели (1-7)
  trimester: 1 | 2 | 3
  daysLeft: number         // дней до ПДР
  // Ключевые даты
  firstTrimesterEnd: string   // конец 1-го триместра (13 нед)
  secondTrimesterEnd: string  // конец 2-го триместра (26 нед)
  screenings: { week: number; label: string }[]
}

export function calculateBeremennost(params: BeremenostParams): BeremenostResult | null {
  const { lastPeriodDate, cycleLength } = params
  if (!lastPeriodDate) return null

  const lmpDate = new Date(lastPeriodDate)
  if (isNaN(lmpDate.getTime())) return null

  // Формула Негеле с коррекцией на длину цикла
  const adjustment = cycleLength - 28
  const dueDate = new Date(lmpDate)
  dueDate.setDate(dueDate.getDate() + 280 + adjustment)  // 40 недель = 280 дней

  const conceptionDate = new Date(lmpDate)
  conceptionDate.setDate(conceptionDate.getDate() + 14 + adjustment)

  const today = new Date()
  const daysSinceLmp = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24))
  const currentWeek = Math.floor(daysSinceLmp / 7)
  const currentDay = daysSinceLmp % 7

  const trimester: 1 | 2 | 3 = currentWeek < 13 ? 1 : currentWeek < 27 ? 2 : 3
  const daysLeft = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  const addDays = (date: Date, days: number) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d.toLocaleDateString('ru-RU')
  }

  const firstTrimesterEnd = addDays(lmpDate, 13 * 7 + adjustment)
  const secondTrimesterEnd = addDays(lmpDate, 27 * 7 + adjustment)

  return {
    dueDate: dueDate.toLocaleDateString('ru-RU'),
    conceptionDate: conceptionDate.toLocaleDateString('ru-RU'),
    currentWeek: Math.max(0, currentWeek),
    currentDay,
    trimester,
    daysLeft,
    firstTrimesterEnd,
    secondTrimesterEnd,
    screenings: [
      { week: 11, label: '1-й скрининг (11–13 нед)' },
      { week: 18, label: '2-й скрининг (18–21 нед)' },
      { week: 32, label: '3-й скрининг (32–34 нед)' },
    ],
  }
}
