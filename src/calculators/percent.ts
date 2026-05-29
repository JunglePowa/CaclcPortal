export type PercentMode =
  | 'percentOfNumber'
  | 'addPercent'
  | 'subtractPercent'
  | 'percentageChange'
  | 'whatPercent'

export interface PercentParams {
  value: number
  percent: number
  base: number
  changed: number
  part: number
  whole: number
}

export interface PercentResult {
  mode: PercentMode
  result: number
  formula: string
  explanation: string
}

const finite = (value: number) => (Number.isFinite(value) ? value : 0)
const clean = (value: number) => Number(value.toFixed(10))

export function calculatePercent(mode: PercentMode, params: PercentParams): PercentResult {
  const value = finite(params.value)
  const percent = finite(params.percent)
  const base = finite(params.base)
  const changed = finite(params.changed)
  const part = finite(params.part)
  const whole = finite(params.whole)

  switch (mode) {
    case 'addPercent': {
      const result = clean(value * (1 + percent / 100))
      return {
        mode,
        result,
        formula: `${value} + ${percent}% = ${value} × (1 + ${percent} / 100)`,
        explanation: `Если прибавить ${percent}% к числу ${value}, получится ${result}.`,
      }
    }
    case 'subtractPercent': {
      const result = clean(value * (1 - percent / 100))
      return {
        mode,
        result,
        formula: `${value} - ${percent}% = ${value} × (1 - ${percent} / 100)`,
        explanation: `Если вычесть ${percent}% из числа ${value}, получится ${result}.`,
      }
    }
    case 'percentageChange': {
      const result = base === 0 ? 0 : clean(((changed - base) / base) * 100)
      return {
        mode,
        result,
        formula: `(${changed} - ${base}) / ${base} × 100%`,
        explanation: `Изменение с ${base} до ${changed} составляет ${result}% от начального значения.`,
      }
    }
    case 'whatPercent': {
      const result = whole === 0 ? 0 : clean((part / whole) * 100)
      return {
        mode,
        result,
        formula: `${part} / ${whole} × 100%`,
        explanation: `Число ${part} составляет ${result}% от ${whole}.`,
      }
    }
    case 'percentOfNumber':
    default: {
      const result = clean((value * percent) / 100)
      return {
        mode: 'percentOfNumber',
        result,
        formula: `${percent}% от ${value} = ${value} × ${percent} / 100`,
        explanation: `${percent}% от числа ${value} равно ${result}.`,
      }
    }
  }
}
