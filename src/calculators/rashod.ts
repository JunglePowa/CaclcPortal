export interface RashodParams {
  fuelConsumed: number  // литров потрачено
  distance: number      // км пройдено
  fuelPrice: number     // цена за литр, ₽
}

export interface RashodResult {
  per100km: number        // л/100км
  costPer100km: number    // ₽/100км
  totalCost: number       // общая стоимость поездки
  costPerKm: number       // ₽/км
}

export function calculateRashod(params: RashodParams): RashodResult {
  const { fuelConsumed, distance, fuelPrice } = params
  if (distance <= 0) return { per100km: 0, costPer100km: 0, totalCost: 0, costPerKm: 0 }
  const per100km = (fuelConsumed / distance) * 100
  const totalCost = fuelConsumed * fuelPrice
  const costPer100km = per100km * fuelPrice
  const costPerKm = totalCost / distance
  return { per100km, costPer100km, totalCost, costPerKm }
}
