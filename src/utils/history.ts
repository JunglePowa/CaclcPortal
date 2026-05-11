export interface HistoryEntry {
  id: string
  calculatorLabel: string
  calculatorUrl: string
  summary: string
  timestamp: number
}

const STORAGE_KEY = 'calc_history'
const MAX_ENTRIES = 10

export function saveToHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
  const history = getHistory()
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
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'только что'
  if (minutes < 60) return `${minutes} мин назад`
  if (hours < 24) return `${hours} ч назад`
  return `${days} д назад`
}
