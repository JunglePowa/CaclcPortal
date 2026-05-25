import { useEffect } from 'react'
import { saveToHistory } from '@/utils/history'
import { buildHistoryUrl, type HistoryParams } from '@/utils/historyParams'

type Args = {
  calculatorLabel: string
  calculatorUrl: string
  calculatorParams?: HistoryParams
  summary: string
  /**
   * Stable trigger — debounced effect re-runs only when this changes.
   * Use a primitive (number/string) for cheap equality checks.
   */
  triggerKey: number | string
  delayMs?: number
}

/**
 * Debounced "save to history" effect.
 * Replaces the inline `useEffect → setTimeout → saveToHistory` pattern in pages.
 */
export function useHistorySync({
  calculatorLabel,
  calculatorUrl,
  calculatorParams,
  summary,
  triggerKey,
  delayMs = 1500,
}: Args): void {
  useEffect(() => {
    const url = buildHistoryUrl(calculatorUrl, calculatorParams)
    if (delayMs <= 0) {
      saveToHistory({ calculatorLabel, calculatorUrl: url, summary })
      return
    }
    const t = setTimeout(() => {
      saveToHistory({ calculatorLabel, calculatorUrl: url, summary })
    }, delayMs)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey])
}
