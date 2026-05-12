export interface HistoryEntry {
  id: string
  calculatorLabel: string
  calculatorUrl: string
  summary: string
  timestamp: number
}

const STORAGE_KEY = 'calc_history'
const MAX_ENTRIES = 10
const STORAGE_VERSION = 1
const VERSION_KEY = 'calc_history_version'

function ensureVersion(): void {
  try {
    const v = localStorage.getItem(VERSION_KEY)
    if (v !== String(STORAGE_VERSION)) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION))
    }
  } catch {
    /* localStorage недоступен — игнорируем */
  }
}

function isValidEntry(x: unknown): x is HistoryEntry {
  if (!x || typeof x !== 'object') return false
  const e = x as Record<string, unknown>
  return (
    typeof e.id === 'string' &&
    typeof e.calculatorLabel === 'string' &&
    typeof e.calculatorUrl === 'string' &&
    typeof e.summary === 'string' &&
    typeof e.timestamp === 'number'
  )
}

export function saveToHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
  ensureVersion()
  const history = getHistory()
  const prev = history.find(h => h.calculatorUrl === entry.calculatorUrl)
  // Дедупликация: если предыдущая запись с тем же URL имеет тот же summary — ничего не пишем
  if (prev && prev.summary === entry.summary) return
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  }
  const filtered = history.filter(h => h.calculatorUrl !== entry.calculatorUrl)
  const updated = [newEntry, ...filtered].slice(0, MAX_ENTRIES)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {}
}

export function getHistory(): HistoryEntry[] {
  ensureVersion()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
    const filtered = parsed.filter(isValidEntry)
    // Если формат битый частично — переписываем очищенный массив
    if (filtered.length !== parsed.length) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered)) } catch {}
    }
    return filtered
  } catch {
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    return []
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Русская плюрализация: возвращает индекс формы (0 — одна, 1 — несколько (2-4),
 * 2 — много (5+ и др.)).
 */
function pluralIndex(n: number): 0 | 1 | 2 {
  const abs = Math.abs(n) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return 2
  if (last === 1) return 0
  if (last >= 2 && last <= 4) return 1
  return 2
}

function plural(n: number, forms: [string, string, string]): string {
  return forms[pluralIndex(n)]
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'только что'
  if (minutes < 60) return `${minutes} ${plural(minutes, ['минуту', 'минуты', 'минут'])} назад`
  if (hours < 24) return `${hours} ${plural(hours, ['час', 'часа', 'часов'])} назад`
  return `${days} ${plural(days, ['день', 'дня', 'дней'])} назад`
}
