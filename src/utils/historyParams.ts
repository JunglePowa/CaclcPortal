type HistoryParamValue = string | number | boolean | null | undefined

export type HistoryParams = Record<string, HistoryParamValue>

export function buildHistoryUrl(path: string, params?: HistoryParams): string {
  if (!params) return path

  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue
    search.set(key, String(value))
  }

  const query = search.toString()
  return query ? `${path}?${query}` : path
}

export function getHistorySearchParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams()
  return new URLSearchParams(window.location.search)
}

export function readNumberParam(search: URLSearchParams, key: string, fallback: number): number {
  const raw = search.get(key)
  if (raw === null) return fallback
  const value = Number(raw)
  return Number.isFinite(value) ? value : fallback
}

export function readBooleanParam(search: URLSearchParams, key: string, fallback: boolean): boolean {
  const raw = search.get(key)
  if (raw === null) return fallback
  return raw === 'true' || raw === '1'
}

export function readStringParam<T extends string>(
  search: URLSearchParams,
  key: string,
  fallback: T,
  allowed?: readonly T[],
): T {
  const raw = search.get(key)
  if (raw === null) return fallback
  if (allowed && !allowed.includes(raw as T)) return fallback
  return raw as T
}
