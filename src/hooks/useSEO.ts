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
  '/compound-interest': {
    title: 'Калькулятор сложного процента онлайн — капитализация и пополнения',
    description: 'Рассчитайте сложный процент онлайн: стартовая сумма, ежемесячные пополнения, ставка, срок, капитализация и итоговый доход.',
    canonical: `${BASE_URL}/compound-interest`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор сложного процента', url: `${BASE_URL}/compound-interest`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/deposit': {
    title: 'Калькулятор вклада онлайн — доходность, капитализация, налог',
    description: 'Рассчитайте сумму вклада, проценты, пополнения, капитализацию и чистый доход после налога за выбранный срок.',
    canonical: `${BASE_URL}/deposit`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор вклада', url: `${BASE_URL}/deposit`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/deposit/capitalization': {
    title: 'Калькулятор вклада с капитализацией процентов',
    description: 'Рассчитайте вклад с капитализацией: итоговая сумма, эффективная ставка, начисленные проценты и график роста.',
    canonical: `${BASE_URL}/deposit/capitalization`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор вклада с капитализацией', url: `${BASE_URL}/deposit/capitalization`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/deposit/replenishment': {
    title: 'Калькулятор вклада с пополнением онлайн',
    description: 'Посчитайте вклад с ежемесячным пополнением: итоговую сумму, чистый доход, капитализацию и график начислений.',
    canonical: `${BASE_URL}/deposit/replenishment`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор вклада с пополнением', url: `${BASE_URL}/deposit/replenishment`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/deposit/tax': {
    title: 'Калькулятор налога на вклад — доход после налога',
    description: 'Оцените доход по вкладу после налога: начисленные проценты, налог к удержанию и чистый результат.',
    canonical: `${BASE_URL}/deposit/tax`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор налога на вклад', url: `${BASE_URL}/deposit/tax`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/credit': {
    title: 'Кредитный калькулятор онлайн — платёж, переплата, график',
    description: 'Рассчитайте ежемесячный платёж, переплату и график погашения кредита для аннуитетной или дифференцированной схемы.',
    canonical: `${BASE_URL}/credit`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Кредитный калькулятор', url: `${BASE_URL}/credit`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/credit/annuity': {
    title: 'Аннуитетный платёж по кредиту — калькулятор онлайн',
    description: 'Рассчитайте аннуитетный платёж по кредиту: ежемесячный платёж, переплата, итоговая сумма и график погашения.',
    canonical: `${BASE_URL}/credit/annuity`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор аннуитетного платежа', url: `${BASE_URL}/credit/annuity`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/credit/differentiated': {
    title: 'Дифференцированный платёж по кредиту — калькулятор',
    description: 'Посчитайте дифференцированный кредит: первый и последний платёж, переплату, итоговую сумму и график погашения.',
    canonical: `${BASE_URL}/credit/differentiated`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор дифференцированного платежа', url: `${BASE_URL}/credit/differentiated`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/vat': {
    title: 'Калькулятор НДС 22% онлайн — начислить и выделить НДС',
    description: 'Онлайн калькулятор НДС: начислите налог сверху или выделите НДС из суммы по ставкам 22%, 20%, 10% и 0%.',
    canonical: `${BASE_URL}/vat`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор НДС', url: `${BASE_URL}/vat`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/vat/add': {
    title: 'Начислить НДС сверху онлайн — калькулятор НДС',
    description: 'Начислите НДС сверху к сумме без налога: ставки 22%, 20%, 10% и 0%, итоговая сумма с НДС и размер налога.',
    canonical: `${BASE_URL}/vat/add`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Начислить НДС сверху', url: `${BASE_URL}/vat/add`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/vat/extract': {
    title: 'Выделить НДС из суммы онлайн — калькулятор НДС',
    description: 'Выделите НДС из суммы с налогом онлайн: расчет НДС 22%, 20%, 10% и суммы без НДС по формуле.',
    canonical: `${BASE_URL}/vat/extract`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Выделить НДС из суммы', url: `${BASE_URL}/vat/extract`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/income-tax': {
    title: 'Калькулятор НДФЛ 2026 онлайн — прогрессивная шкала 13–22%',
    description: 'Рассчитайте НДФЛ с дохода или сумму до налога по прогрессивной шкале 13–22%, с учётом стандартных вычетов на детей.',
    canonical: `${BASE_URL}/income-tax`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор НДФЛ', url: `${BASE_URL}/income-tax`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/income-tax/2026': {
    title: 'Калькулятор НДФЛ 2026 — прогрессивная шкала',
    description: 'Рассчитайте НДФЛ в 2026 году по прогрессивной шкале 13–22%, с учетом суммы на руки и стандартных вычетов.',
    canonical: `${BASE_URL}/income-tax/2026`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор НДФЛ 2026', url: `${BASE_URL}/income-tax/2026`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/salary': {
    title: 'Калькулятор зарплаты онлайн — гросс, нетто, НДФЛ и взносы',
    description: 'Переведите зарплату из гросс в нетто и обратно, рассчитайте НДФЛ, страховые взносы и полную стоимость сотрудника для работодателя.',
    canonical: `${BASE_URL}/salary`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор зарплаты', url: `${BASE_URL}/salary`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/salary/gross-net': {
    title: 'Калькулятор гросс в нетто — зарплата на руки',
    description: 'Рассчитайте зарплату на руки из гросс-оклада: НДФЛ, детские вычеты, страховые взносы и расходы работодателя.',
    canonical: `${BASE_URL}/salary/gross-net`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор гросс в нетто', url: `${BASE_URL}/salary/gross-net`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/salary/net-gross': {
    title: 'Калькулятор нетто в гросс — зарплата до налога',
    description: 'Узнайте, какой гросс-оклад нужен для заданной суммы на руки с учетом НДФЛ, вычетов и взносов работодателя.',
    canonical: `${BASE_URL}/salary/net-gross`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор нетто в гросс', url: `${BASE_URL}/salary/net-gross`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/vacation-pay': {
    title: 'Калькулятор отпускных онлайн — средний заработок, НДФЛ и сумма на руки',
    description: 'Рассчитайте отпускные онлайн: средний дневной заработок, сумма до НДФЛ, налог и выплата на руки за дни отпуска.',
    canonical: `${BASE_URL}/vacation-pay`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор отпускных', url: `${BASE_URL}/vacation-pay`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/work-experience': {
    title: 'Калькулятор стажа онлайн — трудовой стаж по периодам работы',
    description: 'Посчитайте трудовой стаж онлайн по нескольким периодам работы: годы, месяцы, дни и общий стаж без двойного учёта пересечений.',
    canonical: `${BASE_URL}/work-experience`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор стажа', url: `${BASE_URL}/work-experience`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/fuel-consumption': {
    title: 'Калькулятор расхода топлива онлайн — литры на 100 км и стоимость поездки',
    description: 'Рассчитайте расход топлива на 100 км и стоимость поездки онлайн.',
    canonical: `${BASE_URL}/fuel-consumption`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор расхода топлива', url: `${BASE_URL}/fuel-consumption`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/fuel-consumption/trip-cost': {
    title: 'Калькулятор стоимости поездки на авто — топливо',
    description: 'Рассчитайте стоимость поездки на автомобиле по расстоянию, расходу топлива и цене за литр.',
    canonical: `${BASE_URL}/fuel-consumption/trip-cost`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор стоимости поездки', url: `${BASE_URL}/fuel-consumption/trip-cost`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/transport-tax': {
    title: 'Калькулятор транспортного налога онлайн — налог по лошадиным силам',
    description: 'Рассчитайте транспортный налог по мощности двигателя и сроку владения.',
    canonical: `${BASE_URL}/transport-tax`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор транспортного налога', url: `${BASE_URL}/transport-tax`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/autocredit': {
    title: 'Калькулятор автокредита онлайн — платёж, первый взнос и переплата',
    description: 'Рассчитайте автокредит онлайн: ежемесячный платёж, сумму кредита, первый взнос, переплату и полную стоимость автомобиля.',
    canonical: `${BASE_URL}/autocredit`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор автокредита', url: `${BASE_URL}/autocredit`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/percentage': {
    title: 'Калькулятор процентов онлайн — процент от числа, прибавить и вычесть',
    description: 'Посчитайте процент от числа, прибавьте или вычтите процент, найдите процентное изменение и сколько процентов одно число от другого.',
    canonical: `${BASE_URL}/percentage`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор процентов', url: `${BASE_URL}/percentage`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/percentage/percent-of-number': {
    title: 'Процент от числа онлайн — калькулятор процентов',
    description: 'Найдите, сколько будет X процентов от числа: быстрый онлайн расчёт с формулой и примером.',
    canonical: `${BASE_URL}/percentage/percent-of-number`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Процент от числа', url: `${BASE_URL}/percentage/percent-of-number`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/percentage/add-percent': {
    title: 'Прибавить процент к числу — калькулятор онлайн',
    description: 'Увеличьте число на заданный процент онлайн: итоговое значение, формула и быстрый расчёт.',
    canonical: `${BASE_URL}/percentage/add-percent`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Прибавить процент к числу', url: `${BASE_URL}/percentage/add-percent`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/percentage/subtract-percent': {
    title: 'Вычесть процент из числа — калькулятор онлайн',
    description: 'Уменьшите число на заданный процент онлайн: итоговое значение, формула и быстрый расчёт.',
    canonical: `${BASE_URL}/percentage/subtract-percent`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Вычесть процент из числа', url: `${BASE_URL}/percentage/subtract-percent`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/percentage/percentage-change': {
    title: 'Процентное изменение онлайн — рост и снижение в процентах',
    description: 'Рассчитайте, на сколько процентов изменилось число: рост, снижение, разница между старым и новым значением.',
    canonical: `${BASE_URL}/percentage/percentage-change`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Процентное изменение', url: `${BASE_URL}/percentage/percentage-change`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/percentage/what-percent': {
    title: 'Сколько процентов составляет число от числа — калькулятор',
    description: 'Узнайте, сколько процентов одно число составляет от другого: доля в процентах, формула и пример.',
    canonical: `${BASE_URL}/percentage/what-percent`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Сколько процентов составляет число', url: `${BASE_URL}/percentage/what-percent`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/days-between-dates': {
    title: 'Калькулятор дней между датами онлайн — сколько дней прошло',
    description: 'Посчитайте количество дней между двумя датами онлайн: дни, недели, примерные месяцы и годы, с учётом или без учёта конечной даты.',
    canonical: `${BASE_URL}/days-between-dates`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор дней между датами', url: `${BASE_URL}/days-between-dates`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/date-add': {
    title: 'Калькулятор даты плюс дни онлайн — прибавить дни, месяцы и годы',
    description: 'Прибавьте к дате дни, месяцы или годы онлайн. Калькулятор покажет итоговую дату и день недели.',
    canonical: `${BASE_URL}/date-add`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор даты плюс дни', url: `${BASE_URL}/date-add`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/time-between': {
    title: 'Калькулятор времени между датами — дни, часы и минуты',
    description: 'Посчитайте разницу между двумя датами и временем: всего минут, дни, часы и минуты между событиями.',
    canonical: `${BASE_URL}/time-between`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор времени между датами', url: `${BASE_URL}/time-between`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/discount': {
    title: 'Калькулятор скидки онлайн — цена со скидкой и экономия',
    description: 'Посчитайте цену со скидкой онлайн: исходная цена, процент скидки, сумма экономии и итоговая стоимость товара.',
    canonical: `${BASE_URL}/discount`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор скидки', url: `${BASE_URL}/discount`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/age': {
    title: 'Калькулятор возраста онлайн — возраст по дате рождения',
    description: 'Рассчитайте точный возраст по дате рождения: годы, месяцы, дни, всего дней и сколько осталось до следующего дня рождения.',
    canonical: `${BASE_URL}/age`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор возраста', url: `${BASE_URL}/age`, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
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
  '/early-repayment/reduce-term': {
    title: 'Досрочное погашение с уменьшением срока — калькулятор',
    description: 'Посчитайте досрочное погашение кредита с сокращением срока: экономия на процентах, новый срок и график.',
    canonical: `${BASE_URL}/early-repayment/reduce-term`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Досрочное погашение с уменьшением срока', url: `${BASE_URL}/early-repayment/reduce-term`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/early-repayment/reduce-payment': {
    title: 'Досрочное погашение с уменьшением платежа',
    description: 'Рассчитайте досрочное погашение кредита с уменьшением ежемесячного платежа и сравните экономию.',
    canonical: `${BASE_URL}/early-repayment/reduce-payment`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Досрочное погашение с уменьшением платежа', url: `${BASE_URL}/early-repayment/reduce-payment`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
  },
  '/credit-card': {
    title: 'Калькулятор кредитной карты онлайн — срок закрытия долга',
    description: 'Рассчитайте, за сколько месяцев закрыть долг по кредитной карте: ежемесячный платёж, проценты, переплата и общая сумма выплат.',
    canonical: `${BASE_URL}/credit-card`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Калькулятор кредитной карты', url: `${BASE_URL}/credit-card`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' } },
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
