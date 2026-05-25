import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTE_MODES, MODE_TITLES, MODE_DESCRIPTIONS } from '@/utils/modeRoutes'
import { CALCULATOR_CATEGORIES } from '@/lib/calculatorCatalog'
import { SEO_PAGE_CONTENT } from '@/lib/seoPageContent'

interface SEOData {
  title: string
  description: string
  canonical: string
  robots?: string
  jsonLd?: object
}

const BASE_URL: string =
  ((import.meta.env.VITE_BASE_URL as string | undefined) ?? 'https://calcportal.online').replace(/\/$/, '')

const ORGANIZATION_JSON_LD = {
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Калк Портал',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon-512x512.png`,
}

const WEBSITE_JSON_LD = {
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'Калк Портал',
  url: BASE_URL,
  description: 'Бесплатные онлайн калькуляторы',
  publisher: { '@id': `${BASE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

function buildWebApplicationJsonLd(pathname: string, name: string, description: string, category = 'FinanceApplication'): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url: `${BASE_URL}${pathname}`,
    description,
    applicationCategory: category,
    operatingSystem: 'Web',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    publisher: { '@id': `${BASE_URL}/#organization` },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' },
  }
}

// Данные для каждого маршрута
const SEO_MAP: Record<string, SEOData> = {
  '/': {
    title: 'Калк Портал — онлайн калькуляторы для финансов, налогов и кредитов',
    description: 'Бесплатные онлайн калькуляторы: НДС 22%, НДФЛ 2026, зарплата, кредит, ипотека, вклад, инвестиции, ИМТ, транспортный налог и пени.',
    canonical: `${BASE_URL}/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: 'Калк Портал',
      url: BASE_URL,
      description: 'Бесплатные онлайн калькуляторы',
      publisher: { '@id': `${BASE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  },
  '/investment': {
    title: 'Калькулятор инвестиций онлайн — сложный процент и накопления',
    description: 'Рассчитайте будущую стоимость капитала, регулярные пополнения, сложный процент, налог и инфляцию. 6 режимов инвестиционного расчёта.',
    canonical: `${BASE_URL}/investment`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Калькулятор инвестиций',
      url: `${BASE_URL}/investment`,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description: 'Калькулятор сложного процента с учётом пополнений, налога и инфляции',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' },
    },
  },
  '/deposit': {
    title: 'Калькулятор вклада онлайн — доходность, капитализация, налог',
    description: 'Рассчитайте сумму вклада, проценты, пополнения, капитализацию и чистый доход после налога за выбранный срок.',
    canonical: `${BASE_URL}/deposit`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор вклада', url: `${BASE_URL}/deposit`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/credit': {
    title: 'Кредитный калькулятор онлайн — платёж, переплата, график',
    description: 'Рассчитайте ежемесячный платёж, переплату и график погашения кредита для аннуитетной или дифференцированной схемы.',
    canonical: `${BASE_URL}/credit`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Кредитный калькулятор', url: `${BASE_URL}/credit`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/vat': {
    title: 'Калькулятор НДС 22% онлайн — начислить и выделить НДС',
    description: 'Онлайн калькулятор НДС: начислите налог сверху или выделите НДС из суммы по ставкам 22%, 20%, 10% и 0%.',
    canonical: `${BASE_URL}/vat`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор НДС', url: `${BASE_URL}/vat`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/income-tax': {
    title: 'Калькулятор НДФЛ 2026 онлайн — прогрессивная шкала 13–22%',
    description: 'Рассчитайте НДФЛ с дохода или сумму до налога по прогрессивной шкале 13–22%, с учётом стандартных вычетов на детей.',
    canonical: `${BASE_URL}/income-tax`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор НДФЛ', url: `${BASE_URL}/income-tax`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/salary': {
    title: 'Калькулятор зарплаты онлайн — гросс, нетто, НДФЛ и взносы',
    description: 'Переведите зарплату из гросс в нетто и обратно, рассчитайте НДФЛ, страховые взносы и полную стоимость сотрудника для работодателя.',
    canonical: `${BASE_URL}/salary`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор зарплаты', url: `${BASE_URL}/salary`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/fuel-consumption': {
    title: 'Калькулятор расхода топлива онлайн — литры на 100 км и стоимость поездки',
    description: 'Рассчитайте расход топлива на 100 км и стоимость поездки онлайн.',
    canonical: `${BASE_URL}/fuel-consumption`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор расхода топлива', url: `${BASE_URL}/fuel-consumption`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/transport-tax': {
    title: 'Калькулятор транспортного налога онлайн — налог по лошадиным силам',
    description: 'Рассчитайте транспортный налог по мощности двигателя и сроку владения.',
    canonical: `${BASE_URL}/transport-tax`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор транспортного налога', url: `${BASE_URL}/transport-tax`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/bmi': {
    title: 'Калькулятор ИМТ онлайн — индекс массы тела и категория веса',
    description: 'Рассчитайте индекс массы тела (ИМТ) онлайн. Норма, идеальный вес и категория.',
    canonical: `${BASE_URL}/bmi`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор ИМТ', url: `${BASE_URL}/bmi`, applicationCategory: 'HealthApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/pregnancy': {
    title: 'Калькулятор беременности онлайн — срок, триместр и дата родов',
    description: 'Рассчитайте срок беременности и дату родов по дате последней менструации.',
    canonical: `${BASE_URL}/pregnancy`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор беременности', url: `${BASE_URL}/pregnancy`, applicationCategory: 'HealthApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/bonds': {
    title: 'Калькулятор облигаций онлайн — доходность, купоны, YTM',
    description: 'Рассчитайте доходность ОФЗ и корпоративных облигаций: YTM, текущая доходность, чистый доход с учётом налога.',
    canonical: `${BASE_URL}/bonds`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор облигаций', url: `${BASE_URL}/bonds`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/mortgage': {
    title: 'Ипотечный калькулятор онлайн — платёж, переплата, досрочное погашение',
    description: 'Рассчитайте ежемесячный платёж по ипотеке, переплату, график и экономию от досрочного погашения.',
    canonical: `${BASE_URL}/mortgage`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Ипотечный калькулятор', url: `${BASE_URL}/mortgage`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/early-repayment': {
    title: 'Калькулятор досрочного погашения кредита — экономия и новый график',
    description: 'Рассчитайте экономию при досрочном погашении кредита: сократить срок или уменьшить платёж.',
    canonical: `${BASE_URL}/early-repayment`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор досрочного погашения', url: `${BASE_URL}/early-repayment`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/tax-penalties': {
    title: 'Калькулятор пеней по налогам онлайн — ст. 75 НК РФ',
    description: 'Рассчитайте пени по налогам и страховым взносам по ст. 75 НК РФ. Для физлиц и юрлиц.',
    canonical: `${BASE_URL}/tax-penalties`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор пеней', url: `${BASE_URL}/tax-penalties`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
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
  '/methodology': {
    title: 'Методика расчётов — Калк Портал',
    description: 'Как устроены расчёты в онлайн калькуляторах Калк Портал, какие есть ограничения и как проверять результаты.',
    canonical: `${BASE_URL}/methodology`,
  },
  '/404': {
    title: 'Страница не найдена — Калк Портал',
    description: 'Запрошенная страница не найдена. Перейдите в каталог онлайн калькуляторов Калк Портал.',
    canonical: `${BASE_URL}/404`,
    robots: 'noindex, follow',
  },
}

for (const category of CALCULATOR_CATEGORIES) {
  SEO_MAP[category.path] = {
    title: `${category.title} — Калк Портал`,
    description: category.description,
    canonical: `${BASE_URL}${category.path}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.title,
      description: category.description,
      url: `${BASE_URL}${category.path}`,
      mainEntity: category.items.map((item) => ({
        '@type': 'WebApplication',
        name: item.label,
        url: `${BASE_URL}${item.href}`,
      })),
    },
  }
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

function buildBreadcrumb(pathname: string, content?: { category: string }): object {
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: `${BASE_URL}/` },
  ]
  if (content) {
    items.push({ '@type': 'ListItem', position: 2, name: content.category, item: `${BASE_URL}${pathname}` })
  }
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

function buildFaq(faq: { question: string; answer: string }[]): object {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function mergeJsonLd(pathname: string, seo: SEOData): object | undefined {
  const content = SEO_PAGE_CONTENT[pathname]
  const graph = [
    ORGANIZATION_JSON_LD,
    pathname === '/' ? undefined : WEBSITE_JSON_LD,
    seo.jsonLd,
    content ? buildBreadcrumb(pathname, content) : undefined,
    content ? buildFaq(content.faq) : undefined,
  ].filter(Boolean)

  if (graph.length === 0) return undefined
  if (graph.length === 1) return graph[0] as object
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function resolveSEO(pathname: string): SEOData {
  // Точное совпадение по полному пути (включая подмаршруты /investment/*)
  const mode = ROUTE_MODES[pathname]
  if (mode) {
    return {
      title: MODE_TITLES[mode],
      description: MODE_DESCRIPTIONS[mode],
      canonical: `${BASE_URL}${pathname}`,
      jsonLd: buildWebApplicationJsonLd(pathname, MODE_TITLES[mode].replace(' — Калк Портал', ''), MODE_DESCRIPTIONS[mode]),
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
    setJsonLd(mergeJsonLd(location.pathname, seo))
  }, [location.pathname])
}
