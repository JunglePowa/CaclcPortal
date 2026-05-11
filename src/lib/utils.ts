import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRUB(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(1)} млрд ₽`
    if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(2)} млн ₽`
    if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(0)} тыс ₽`
  }
  return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })
}
