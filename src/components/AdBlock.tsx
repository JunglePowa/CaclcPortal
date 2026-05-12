import { useEffect, useId, useRef } from 'react'

interface AdBlockProps {
  blockId: string
  className?: string
}

const isEnabled = (): boolean => {
  return (import.meta.env.VITE_RSYA_ENABLED as string | undefined) === 'true'
}

let scriptRequested = false

function loadYandexRtbScript(): void {
  if (typeof document === 'undefined') return
  if (scriptRequested || document.querySelector('script[data-yandex-rtb="true"]')) return
  scriptRequested = true
  window.yaContextCb = window.yaContextCb || ([] as unknown as Window['yaContextCb'])

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://yandex.ru/ads/system/context.js'
  script.dataset.yandexRtb = 'true'
  document.head.appendChild(script)
}

/**
 * Универсальный рекламный блок РСЯ (Яндекс.Директ).
 *
 * Поведение:
 * - Если `VITE_RSYA_ENABLED !== 'true'` или `blockId` пуст — ничего не рендерит
 *   (в dev — оставляет компактный плейсхолдер для удобства верстальщика).
 * - Иначе создаёт контейнер с уникальным DOM-id и через `window.yaContextCb`
 *   вызывает `Ya.Context.AdvManager.render`.
 * - При размонтировании пытается вызвать `destroy(renderTo)`, если он доступен.
 */
export function AdBlock({ blockId, className }: AdBlockProps) {
  const reactId = useId()
  const containerIdRef = useRef<string>(`yandex_rtb_${blockId.replace(/[^a-zA-Z0-9_-]/g, '_')}_${reactId.replace(/[^a-zA-Z0-9_-]/g, '_')}`)
  const renderedRef = useRef(false)

  useEffect(() => {
    if (!isEnabled() || !blockId) return
    if (renderedRef.current) return
    const renderTo = containerIdRef.current

    const doRender = () => {
      try {
        window.Ya?.Context.AdvManager.render({ blockId, renderTo })
        renderedRef.current = true
      } catch {
        /* no-op: РСЯ ещё не загружена или блок невалиден */
      }
    }

    if (window.Ya?.Context?.AdvManager) {
      doRender()
    } else {
      // Очередь callback-ов РСЯ. Скрипт push'нет её, когда загрузится.
      window.yaContextCb = window.yaContextCb || ([] as unknown as Window['yaContextCb'])
      window.yaContextCb!.push(doRender)
      loadYandexRtbScript()
    }

    return () => {
      try {
        window.Ya?.Context.AdvManager.destroy?.(renderTo)
      } catch {
        /* no-op */
      }
      renderedRef.current = false
    }
  }, [blockId])

  if (!blockId) return null

  if (!isEnabled()) {
    if (import.meta.env.DEV) {
      return (
        <div
          className={`rounded-lg border border-dashed border-[hsl(var(--border))] text-[hsl(var(--fg-muted))] text-xs px-3 py-4 text-center ${className ?? ''}`}
          aria-hidden
        >
          [AdBlock placeholder · {blockId}]
        </div>
      )
    }
    return null
  }

  return <div id={containerIdRef.current} className={className} />
}

export default AdBlock
