// Глобальные объявления для Яндекс.Метрики, GA и контекста РСЯ.
// Скрипты подгружаются через src/lib/analytics.ts и index.html;
// здесь — только типы, чтобы TS не ругался на window.ym/gtag/yaContextCb.

interface YaContextRenderParams {
  blockId: string
  renderTo: string
  type?: string
  platform?: string
  onRender?: (data: unknown) => void
  onError?: (data: unknown) => void
  onClose?: (data: unknown) => void
}

interface YaContextAdvManager {
  render: (params: YaContextRenderParams) => void
  destroy?: (renderTo: string) => void
}

interface YaContext {
  AdvManager: YaContextAdvManager
}

type YaContextCb = Array<() => void> & { push: (cb: () => void) => void }

declare global {
  interface Window {
    yaContextCb?: YaContextCb
    Ya?: { Context: YaContext }
    ym?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export {}
