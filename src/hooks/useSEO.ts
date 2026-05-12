import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTE_MODES, MODE_TITLES, MODE_DESCRIPTIONS } from '@/utils/modeRoutes'

interface SEOData {
  title: string
  description: string
  canonical: string
  jsonLd?: object
}

const BASE_URL: string =
  (import.meta.env.VITE_BASE_URL as string | undefined) ?? 'https://kalkportal.ru'

// Данные для каждого маршрута
const SEO_MAP: Record<string, SEOData> = {
  '/': {
    title: 'КалкПортал — Онлайн калькуляторы',
    description: 'Бесплатные онлайн калькуляторы: инвестиции, вклады, кредиты, НДС, НДФЛ, зарплата, ИМТ и другие.',
    canonical: `${BASE_URL}/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'КалкПортал',
      url: BASE_URL,
      description: 'Бесплатные онлайн калькуляторы',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  },
  '/investicii': {
    title: 'Калькулятор инвестиций — КалкПортал',
    description: 'Рассчитайте итоговую сумму накоплений с учётом сложного процента, налога и инфляции. 6 режимов расчёта.',
    canonical: `${BASE_URL}/investicii`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Калькулятор инвестиций',
      url: `${BASE_URL}/investicii`,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description: 'Калькулятор сложного процента с учётом пополнений, налога и инфляции',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' },
    },
  },
  '/vklad': {
    title: 'Калькулятор вклада — КалкПортал',
    description: 'Рассчитайте доходность вклада с капитализацией, пополнениями и учётом налога.',
    canonical: `${BASE_URL}/vklad`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор вклада', url: `${BASE_URL}/vklad`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/kredit': {
    title: 'Кредитный калькулятор — КалкПортал',
    description: 'Рассчитайте ежемесячный платёж и переплату по кредиту. Аннуитетный и дифференциальный платёж.',
    canonical: `${BASE_URL}/kredit`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Кредитный калькулятор', url: `${BASE_URL}/kredit`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/nds': {
    title: 'Калькулятор НДС — КалкПортал',
    description: 'Начислите или выделите НДС онлайн. Ставки 20%, 10%, 0%.',
    canonical: `${BASE_URL}/nds`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор НДС', url: `${BASE_URL}/nds`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/ndfl': {
    title: 'Калькулятор НДФЛ — КалкПортал',
    description: 'Рассчитайте НДФЛ онлайн. Ставки 13%, 15%, 30%. Учёт стандартных вычетов на детей.',
    canonical: `${BASE_URL}/ndfl`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор НДФЛ', url: `${BASE_URL}/ndfl`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/zarplata': {
    title: 'Калькулятор зарплаты — КалкПортал',
    description: 'Рассчитайте зарплату на руки и расходы работодателя. НДФЛ и страховые взносы.',
    canonical: `${BASE_URL}/zarplata`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор зарплаты', url: `${BASE_URL}/zarplata`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/rashod-topliva': {
    title: 'Калькулятор расхода топлива — КалкПортал',
    description: 'Рассчитайте расход топлива на 100 км и стоимость поездки онлайн.',
    canonical: `${BASE_URL}/rashod-topliva`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор расхода топлива', url: `${BASE_URL}/rashod-topliva`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/transportnyj-nalog': {
    title: 'Калькулятор транспортного налога — КалкПортал',
    description: 'Рассчитайте транспортный налог по мощности двигателя и сроку владения.',
    canonical: `${BASE_URL}/transportnyj-nalog`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор транспортного налога', url: `${BASE_URL}/transportnyj-nalog`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/imt': {
    title: 'Калькулятор ИМТ — КалкПортал',
    description: 'Рассчитайте индекс массы тела (ИМТ) онлайн. Норма, идеальный вес и категория.',
    canonical: `${BASE_URL}/imt`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор ИМТ', url: `${BASE_URL}/imt`, applicationCategory: 'HealthApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/beremennost': {
    title: 'Калькулятор беременности — КалкПортал',
    description: 'Рассчитайте срок беременности и дату родов по дате последней менструации.',
    canonical: `${BASE_URL}/beremennost`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор беременности', url: `${BASE_URL}/beremennost`, applicationCategory: 'HealthApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/obligacii': {
    title: 'Калькулятор облигаций — КалкПортал',
    description: 'Рассчитайте доходность ОФЗ и корпоративных облигаций: YTM, текущая доходность, чистый доход с учётом налога.',
    canonical: `${BASE_URL}/obligacii`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор облигаций', url: `${BASE_URL}/obligacii`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/ipoteka': {
    title: 'Ипотечный калькулятор — КалкПортал',
    description: 'Рассчитайте ежемесячный платёж по ипотеке, переплату и экономию от досрочного погашения.',
    canonical: `${BASE_URL}/ipoteka`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Ипотечный калькулятор', url: `${BASE_URL}/ipoteka`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/kredit-dosrochnoe': {
    title: 'Калькулятор досрочного погашения — КалкПортал',
    description: 'Рассчитайте экономию при досрочном погашении кредита: сократить срок или уменьшить платёж.',
    canonical: `${BASE_URL}/kredit-dosrochnoe`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор досрочного погашения', url: `${BASE_URL}/kredit-dosrochnoe`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/peni': {
    title: 'Калькулятор пеней — КалкПортал',
    description: 'Рассчитайте пени по налогам и страховым взносам по ст. 75 НК РФ. Для физлиц и юрлиц.',
    canonical: `${BASE_URL}/peni`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор пеней', url: `${BASE_URL}/peni`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
  el.content = content
}

function setOG(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el) }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el) }
  el.href = href
}

function setJsonLd(data: object) {
  let el = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; document.head.appendChild(el) }
  el.textContent = JSON.stringify(data)
}

function resolveSEO(pathname: string): SEOData {
  // Точное совпадение по полному пути (включая подмаршруты /investicii/*)
  const mode = ROUTE_MODES[pathname]
  if (mode) {
    const base = SEO_MAP['/investicii']
    return {
      title: MODE_TITLES[mode],
      description: MODE_DESCRIPTIONS[mode],
      canonical: `${BASE_URL}${pathname}`,
      jsonLd: base.jsonLd,
    }
  }
  // Базовый путь (первый сегмент)
  const segments = pathname.split('/').filter(Boolean)
  const basePath = segments.length > 0 ? '/' + segments[0] : '/'
  return SEO_MAP[basePath] ?? SEO_MAP['/']
}

export function useSEO() {
  const location = useLocation()

  useEffect(() => {
    const seo = resolveSEO(location.pathname)

    document.title = seo.title
    setMeta('description', seo.description)
    setMeta('robots', 'index, follow')
    setOG('og:title', seo.title)
    setOG('og:description', seo.description)
    setOG('og:url', seo.canonical)
    setOG('og:type', 'website')
    setOG('og:locale', 'ru_RU')
    setMeta('twitter:card', 'summary')
    setMeta('twitter:title', seo.title)
    setMeta('twitter:description', seo.description)
    setCanonical(seo.canonical)
    if (seo.jsonLd) setJsonLd(seo.jsonLd)
  }, [location.pathname])
}
