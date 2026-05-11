export interface ImtParams {
  weight: number  // кг
  height: number  // см
  age: number
  sex: 'male' | 'female'
}

export interface ImtResult {
  bmi: number
  category: string
  categoryColor: 'blue' | 'emerald' | 'amber' | 'orange' | 'red'
  idealWeightMin: number
  idealWeightMax: number
  weightDiff: number  // отклонение от нормы (+ избыток, - дефицит)
}

export function calculateImt(params: ImtParams): ImtResult {
  const { weight, height } = params
  const heightM = height / 100
  const bmi = weight / (heightM * heightM)

  let category: string
  let categoryColor: ImtResult['categoryColor']

  if (bmi < 16) { category = 'Выраженный дефицит'; categoryColor = 'blue' }
  else if (bmi < 18.5) { category = 'Дефицит массы'; categoryColor = 'blue' }
  else if (bmi < 25) { category = 'Норма'; categoryColor = 'emerald' }
  else if (bmi < 30) { category = 'Избыточный вес'; categoryColor = 'amber' }
  else if (bmi < 35) { category = 'Ожирение I степени'; categoryColor = 'orange' }
  else if (bmi < 40) { category = 'Ожирение II степени'; categoryColor = 'red' }
  else { category = 'Ожирение III степени'; categoryColor = 'red' }

  // Идеальный вес: ИМТ 18.5–25
  const idealWeightMin = 18.5 * heightM * heightM
  const idealWeightMax = 25 * heightM * heightM
  const weightDiff = bmi < 18.5
    ? weight - idealWeightMin
    : bmi > 25 ? weight - idealWeightMax : 0

  return { bmi, category, categoryColor, idealWeightMin, idealWeightMax, weightDiff }
}
