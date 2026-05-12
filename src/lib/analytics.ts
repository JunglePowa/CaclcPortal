// Инициализация Яндекс.Метрики и Google Analytics 4.
// Скрипты подгружаются динамически только если в env заданы ID,
// чтобы в dev-сборке не было лишних запросов и шума в Network.

const YM_ID = (import.meta.env.VITE_YM_ID as string | undefined) ?? ''
const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined) ?? ''

let initialized = false

function initYandexMetrika(id: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  // Стандартный snippet, переписан в TS-совместимом виде.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(function (m: any, e: Document, t: string, r: string) {
    m[t] =
      m[t] ||
      function () {
        ;(m[t].a = m[t].a || []).push(arguments)
      }
    m[t].l = 1 * (new Date() as unknown as number)
    const k = e.createElement('script') as HTMLScriptElement
    const a = e.getElementsByTagName('script')[0]
    k.async = true
    k.src = r
    a?.parentNode?.insertBefore(k, a)
  })(window, document, 'ym', 'https://mc.yandex.ru/metrika/tag.js')

  window.ym?.(Number(id), 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  })
}

function initGoogleAnalytics(id: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(s)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', id, { anonymize_ip: true, send_page_view: true })
}

export function initAnalytics(): void {
  if (initialized) return
  initialized = true
  if (YM_ID) initYandexMetrika(YM_ID)
  if (GA_ID) initGoogleAnalytics(GA_ID)
}

export function trackPageview(path: string): void {
  if (YM_ID) {
    try {
      window.ym?.(Number(YM_ID), 'hit', path)
    } catch {
      /* no-op */
    }
  }
  if (GA_ID) {
    try {
      window.gtag?.('config', GA_ID, { page_path: path })
    } catch {
      /* no-op */
    }
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (YM_ID) {
    try {
      window.ym?.(Number(YM_ID), 'reachGoal', name, params)
    } catch {
      /* no-op */
    }
  }
  if (GA_ID) {
    try {
      window.gtag?.('event', name, params)
    } catch {
      /* no-op */
    }
  }
}
