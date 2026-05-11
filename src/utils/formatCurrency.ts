export const CURRENCIES = [
  { value: 'RUB', symbol: '₽', locale: 'ru-RU' },
  { value: 'USD', symbol: '$', locale: 'en-US' },
  { value: 'EUR', symbol: '€', locale: 'de-DE' },
  { value: 'GBP', symbol: '£', locale: 'en-GB' },
  { value: 'CNY', symbol: '¥', locale: 'zh-CN' },
] as const

export function getCurrencySymbol(currency = 'RUB'): string {
  return CURRENCIES.find(c => c.value === currency)?.symbol ?? '₽'
}

export function formatMoney(value: number, currency = 'RUB'): string {
  const c = CURRENCIES.find(c => c.value === currency) ?? CURRENCIES[0]
  return `${Math.round(value).toLocaleString(c.locale)} ${c.symbol}`
}
