// Инициализация Яндекс.Метрики и Google Analytics 4.
// Скрипты подгружаются динамически только если в env заданы ID,
// чтобы в dev-сборке не было лишних запросов и шума в Network.

const YM_ID = (import.meta.env.VITE_YM_ID as string | undefined) ?? '109428632'
const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined) ?? ''

let initialized = false
let lastYandexHitUrl = ''

function initYandexMetrika(id: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  window.dataLayer = window.dataLayer || []

  // SPA-инициализация Метрики: первичный и последующие просмотры отправляем через hit.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(function (m: any, e: Document, t: string, r: string, i: string) {
    m[i] =
      m[i] ||
      function () {
        ;(m[i].a = m[i].a || []).push(arguments)
      }
    m[i].l = 1 * (new Date() as unknown as number)
    for (let j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return
    }
    const k = e.createElement('script') as HTMLScriptElement
    const a = e.getElementsByTagName('script')[0]
    k.async = true
    k.src = r
    a?.parentNode?.insertBefore(k, a)
  })(window, document, 'script', `https://mc.yandex.ru/metrika/tag.js?id=${encodeURIComponent(id)}`, 'ym')

  window.ym?.(Number(id), 'init', {
    ssr: true,
    defer: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
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
  window.gtag('config', id, { anonymize_ip: true, send_page_view: false })
}

export function initAnalytics(): void {
  if (initialized) return
  initialized = true
  if (YM_ID) initYandexMetrika(YM_ID)
  if (GA_ID) initGoogleAnalytics(GA_ID)
}

export function trackPageview(path: string): void {
  const pageUrl = `${window.location.origin}${path}`
  if (YM_ID) {
    try {
      if (lastYandexHitUrl !== pageUrl) {
        window.ym?.(Number(YM_ID), 'hit', pageUrl, {
          title: document.title,
          referer: lastYandexHitUrl || document.referrer,
        })
        lastYandexHitUrl = pageUrl
      }
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

export const hasAnalytics = Boolean(YM_ID || GA_ID)

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
