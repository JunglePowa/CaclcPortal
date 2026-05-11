import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOData {
  title: string
  description: string
  canonical: string
  jsonLd?: object
}

// Данные для каждого маршрута
const SEO_MAP: Record<string, SEOData> = {
  '/': {
    title: 'КалкПортал — Онлайн калькуляторы',
    description: 'Бесплатные онлайн калькуляторы: инвестиции, вклады, кредиты, НДС, НДФЛ, зарплата, ИМТ и другие.',
    canonical: 'https://kalkportal.ru/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'КалкПортал',
      url: 'https://kalkportal.ru',
      description: 'Бесплатные онлайн калькуляторы',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://kalkportal.ru/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  },
  '/investicii': {
    title: 'Калькулятор инвестиций — КалкПортал',
    description: 'Рассчитайте итоговую сумму накоплений с учётом сложного процента, налога и инфляции. 6 режимов расчёта.',
    canonical: 'https://kalkportal.ru/investicii',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Калькулятор инвестиций',
      url: 'https://kalkportal.ru/investicii',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description: 'Калькулятор сложного процента с учётом пополнений, налога и инфляции',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' },
    },
  },
  '/vklad': {
    title: 'Калькулятор вклада — КалкПортал',
    description: 'Рассчитайте доходность вклада с капитализацией, пополнениями и учётом налога.',
    canonical: 'https://kalkportal.ru/vklad',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор вклада', url: 'https://kalkportal.ru/vklad', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/kredit': {
    title: 'Кредитный калькулятор — КалкПортал',
    description: 'Рассчитайте ежемесячный платёж и переплату по кредиту. Аннуитетный и дифференциальный платёж.',
    canonical: 'https://kalkportal.ru/kredit',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Кредитный калькулятор', url: 'https://kalkportal.ru/kredit', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/nds': {
    title: 'Калькулятор НДС — КалкПортал',
    description: 'Начислите или выделите НДС онлайн. Ставки 20%, 10%, 0%.',
    canonical: 'https://kalkportal.ru/nds',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор НДС', url: 'https://kalkportal.ru/nds', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/ndfl': {
    title: 'Калькулятор НДФЛ — КалкПортал',
    description: 'Рассчитайте НДФЛ онлайн. Ставки 13%, 15%, 30%. Учёт стандартных вычетов на детей.',
    canonical: 'https://kalkportal.ru/ndfl',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор НДФЛ', url: 'https://kalkportal.ru/ndfl', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/zarplata': {
    title: 'Калькулятор зарплаты — КалкПортал',
    description: 'Рассчитайте зарплату на руки и расходы работодателя. НДФЛ и страховые взносы.',
    canonical: 'https://kalkportal.ru/zarplata',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор зарплаты', url: 'https://kalkportal.ru/zarplata', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/rashod-topliva': {
    title: 'Калькулятор расхода топлива — КалкПортал',
    description: 'Рассчитайте расход топлива на 100 км и стоимость поездки онлайн.',
    canonical: 'https://kalkportal.ru/rashod-topliva',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор расхода топлива', url: 'https://kalkportal.ru/rashod-topliva', applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/transportnyj-nalog': {
    title: 'Калькулятор транспортного налога — КалкПортал',
    description: 'Рассчитайте транспортный налог по мощности двигателя и сроку владения.',
    canonical: 'https://kalkportal.ru/transportnyj-nalog',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор транспортного налога', url: 'https://kalkportal.ru/transportnyj-nalog', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/imt': {
    title: 'Калькулятор ИМТ — КалкПортал',
    description: 'Рассчитайте индекс массы тела (ИМТ) онлайн. Норма, идеальный вес и категория.',
    canonical: 'https://kalkportal.ru/imt',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор ИМТ', url: 'https://kalkportal.ru/imt', applicationCategory: 'HealthApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/beremennost': {
    title: 'Калькулятор беременности — КалкПортал',
    description: 'Рассчитайте срок беременности и дату родов по дате последней менструации.',
    canonical: 'https://kalkportal.ru/beremennost',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор беременности', url: 'https://kalkportal.ru/beremennost', applicationCategory: 'HealthApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
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

export function useSEO() {
  const location = useLocation()

  useEffect(() => {
    // Базовый путь без суффикса режима (/investicii/vznoj → /investicii)
    const segments = location.pathname.split('/').filter(Boolean)
    const basePath = segments.length > 0 ? '/' + segments[0] : '/'
    const seo = SEO_MAP[basePath] ?? SEO_MAP['/']

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
