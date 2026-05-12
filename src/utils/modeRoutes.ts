import type { CalculatorMode } from '@/types'

export const MODE_ROUTES: Record<CalculatorMode, string> = {
  accumulation: '/investicii',
  goal: '/investicii/vznoj',
  duration: '/investicii/srok',
  rate: '/investicii/stavka',
  capital: '/investicii/kapital',
  comparison: '/investicii/sravnenie',
}

export const ROUTE_MODES: Record<string, CalculatorMode> = {
  '/investicii': 'accumulation',
  '/investicii/vznoj': 'goal',
  '/investicii/srok': 'duration',
  '/investicii/stavka': 'rate',
  '/investicii/kapital': 'capital',
  '/investicii/sravnenie': 'comparison',
}

export const MODE_TITLES: Record<CalculatorMode, string> = {
  accumulation: 'Инвестиции — Калк Портал',
  goal: 'Нужный взнос — Калк Портал',
  duration: 'Срок накопления — Калк Портал',
  rate: 'Нужная ставка — Калк Портал',
  capital: 'Нужный капитал — Калк Портал',
  comparison: 'Сравнение сценариев — Калк Портал',
}

export const MODE_DESCRIPTIONS: Record<CalculatorMode, string> = {
  accumulation: 'Рассчитайте итоговую сумму накоплений с учётом сложного процента, налога и инфляции.',
  goal: 'Узнайте, какой ежемесячный взнос нужен для достижения финансовой цели.',
  duration: 'Рассчитайте, за сколько лет вы накопите нужную сумму.',
  rate: 'Найдите необходимую процентную ставку для достижения цели.',
  capital: 'Узнайте, какой стартовый капитал нужен для достижения цели.',
  comparison: 'Сравните несколько инвестиционных сценариев на одном графике.',
}
