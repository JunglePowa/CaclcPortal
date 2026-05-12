import { useEffect } from 'react'
import { saveToHistory } from '@/utils/history'

type Args = {
  calculatorLabel: string
  calculatorUrl: string
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
  summary,
  triggerKey,
  delayMs = 1500,
}: Args): void {
  useEffect(() => {
    if (delayMs <= 0) {
      saveToHistory({ calculatorLabel, calculatorUrl, summary })
      return
    }
    const t = setTimeout(() => {
      saveToHistory({ calculatorLabel, calculatorUrl, summary })
    }, delayMs)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey])
}
