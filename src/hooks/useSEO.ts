import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTE_MODES, MODE_TITLES, MODE_DESCRIPTIONS } from '@/utils/modeRoutes'

interface SEOData {
  title: string
  description: string
  canonical: string
  robots?: string
  jsonLd?: object
}

const BASE_URL: string =
  (import.meta.env.VITE_BASE_URL as string | undefined) ?? 'https://kalkportal.ru'

// Данные для каждого маршрута
const SEO_MAP: Record<string, SEOData> = {
  '/': {
    title: 'Калк Портал — Онлайн калькуляторы',
    description: 'Бесплатные онлайн калькуляторы: инвестиции, вклады, кредиты, НДС, НДФЛ, зарплата, ИМТ и другие.',
    canonical: `${BASE_URL}/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Калк Портал',
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
    title: 'Калькулятор инвестиций — Калк Портал',
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
    title: 'Калькулятор вклада — Калк Портал',
    description: 'Рассчитайте доходность вклада с капитализацией, пополнениями и учётом налога.',
    canonical: `${BASE_URL}/vklad`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор вклада', url: `${BASE_URL}/vklad`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/kredit': {
    title: 'Кредитный калькулятор — Калк Портал',
    description: 'Рассчитайте ежемесячный платёж и переплату по кредиту. Аннуитетный и дифференциальный платёж.',
    canonical: `${BASE_URL}/kredit`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Кредитный калькулятор', url: `${BASE_URL}/kredit`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/nds': {
    title: 'Калькулятор НДС — Калк Портал',
    description: 'Начислите или выделите НДС онлайн. Ставки 22%, 20%, 10%, 0%.',
    canonical: `${BASE_URL}/nds`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор НДС', url: `${BASE_URL}/nds`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/ndfl': {
    title: 'Калькулятор НДФЛ — Калк Портал',
    description: 'Рассчитайте НДФЛ онлайн по прогрессивной шкале 13–22%, с учётом стандартных вычетов на детей.',
    canonical: `${BASE_URL}/ndfl`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор НДФЛ', url: `${BASE_URL}/ndfl`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/zarplata': {
    title: 'Калькулятор зарплаты — Калк Портал',
    description: 'Рассчитайте зарплату на руки и расходы работодателя. НДФЛ и страховые взносы.',
    canonical: `${BASE_URL}/zarplata`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор зарплаты', url: `${BASE_URL}/zarplata`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/rashod-topliva': {
    title: 'Калькулятор расхода топлива — Калк Портал',
    description: 'Рассчитайте расход топлива на 100 км и стоимость поездки онлайн.',
    canonical: `${BASE_URL}/rashod-topliva`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор расхода топлива', url: `${BASE_URL}/rashod-topliva`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/transportnyj-nalog': {
    title: 'Калькулятор транспортного налога — Калк Портал',
    description: 'Рассчитайте транспортный налог по мощности двигателя и сроку владения.',
    canonical: `${BASE_URL}/transportnyj-nalog`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор транспортного налога', url: `${BASE_URL}/transportnyj-nalog`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/imt': {
    title: 'Калькулятор ИМТ — Калк Портал',
    description: 'Рассчитайте индекс массы тела (ИМТ) онлайн. Норма, идеальный вес и категория.',
    canonical: `${BASE_URL}/imt`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор ИМТ', url: `${BASE_URL}/imt`, applicationCategory: 'HealthApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/beremennost': {
    title: 'Калькулятор беременности — Калк Портал',
    description: 'Рассчитайте срок беременности и дату родов по дате последней менструации.',
    canonical: `${BASE_URL}/beremennost`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор беременности', url: `${BASE_URL}/beremennost`, applicationCategory: 'HealthApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/obligacii': {
    title: 'Калькулятор облигаций — Калк Портал',
    description: 'Рассчитайте доходность ОФЗ и корпоративных облигаций: YTM, текущая доходность, чистый доход с учётом налога.',
    canonical: `${BASE_URL}/obligacii`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор облигаций', url: `${BASE_URL}/obligacii`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/ipoteka': {
    title: 'Ипотечный калькулятор — Калк Портал',
    description: 'Рассчитайте ежемесячный платёж по ипотеке, переплату и экономию от досрочного погашения.',
    canonical: `${BASE_URL}/ipoteka`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Ипотечный калькулятор', url: `${BASE_URL}/ipoteka`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/kredit-dosrochnoe': {
    title: 'Калькулятор досрочного погашения — Калк Портал',
    description: 'Рассчитайте экономию при досрочном погашении кредита: сократить срок или уменьшить платёж.',
    canonical: `${BASE_URL}/kredit-dosrochnoe`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор досрочного погашения', url: `${BASE_URL}/kredit-dosrochnoe`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/peni': {
    title: 'Калькулятор пеней — Калк Портал',
    description: 'Рассчитайте пени по налогам и страховым взносам по ст. 75 НК РФ. Для физлиц и юрлиц.',
    canonical: `${BASE_URL}/peni`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор пеней', url: `${BASE_URL}/peni`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/privacy': {
    title: 'Политика конфиденциальности — Калк Портал',
    description: 'Какие данные собирает сервис Калк Портал и как они используются.',
    canonical: `${BASE_URL}/privacy`,
  },
  '/terms': {
    title: 'Пользовательское соглашение — Калк Портал',
    description: 'Условия использования сервиса Калк Портал, отказ от ответственности и права на контент.',
    canonical: `${BASE_URL}/terms`,
  },
  '/about': {
    title: 'О сервисе — Калк Портал',
    description: 'Калк Портал — бесплатный сервис онлайн-калькуляторов: финансы, кредиты, налоги, авто, здоровье.',
    canonical: `${BASE_URL}/about`,
  },
  '/contacts': {
    title: 'Контакты — Калк Портал',
    description: 'Связаться с администрацией сервиса Калк Портал по электронной почте.',
    canonical: `${BASE_URL}/contacts`,
  },
  '/404': {
    title: 'Страница не найдена — Калк Портал',
    description: 'Запрошенная страница не найдена. Перейдите в каталог онлайн калькуляторов Калк Портал.',
    canonical: `${BASE_URL}/404`,
    robots: 'noindex, follow',
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

function setJsonLd(data?: object) {
  let el = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null
  if (!data) {
    el?.remove()
    return
  }
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
  return SEO_MAP[pathname] ?? {
    ...SEO_MAP['/404'],
    canonical: `${BASE_URL}${pathname}`,
  }
}

export function useSEO() {
  const location = useLocation()

  useEffect(() => {
    const seo = resolveSEO(location.pathname)

    document.title = seo.title
    setMeta('description', seo.description)
    setMeta('robots', seo.robots ?? 'index, follow')
    setOG('og:title', seo.title)
    setOG('og:description', seo.description)
    setOG('og:url', seo.canonical)
    setOG('og:type', 'website')
    setOG('og:locale', 'ru_RU')
    setMeta('twitter:card', 'summary')
    setMeta('twitter:title', seo.title)
    setMeta('twitter:description', seo.description)
    setCanonical(seo.canonical)
    setJsonLd(seo.jsonLd)
  }, [location.pathname])
}
