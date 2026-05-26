#!/usr/bin/env node
// Генерирует public/sitemap.xml из MODE_ROUTES + статических маршрутов.
// BASE_URL читается из process.env.VITE_BASE_URL (или дефолт calcportal.online).
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

// Грубо парсим .env, если переменная ещё не задана (Node не подхватывает .env сам).
function loadDotEnv() {
  if (process.env.VITE_BASE_URL) return
  try {
    const raw = readFileSync(resolve(projectRoot, '.env'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
    }
  } catch {
    /* .env отсутствует — используем дефолт */
  }
}
loadDotEnv()

const BASE_URL = (process.env.VITE_BASE_URL || 'https://calcportal.online').replace(/\/$/, '')
const LASTMOD = process.env.SITEMAP_LASTMOD || new Date().toISOString().slice(0, 10)

// Дублируем MODE_ROUTES здесь, чтобы не тащить TS-файлы в Node-скрипт.
const INVESTICII_SUBROUTES = [
  '/investment/contribution',
  '/investment/term',
  '/investment/rate',
  '/investment/capital',
  '/investment/comparison',
]

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/investment', changefreq: 'monthly', priority: '0.9' },
  { path: '/deposit', changefreq: 'monthly', priority: '0.9' },
  { path: '/deposit/capitalization', changefreq: 'monthly', priority: '0.8' },
  { path: '/deposit/replenishment', changefreq: 'monthly', priority: '0.8' },
  { path: '/deposit/tax', changefreq: 'monthly', priority: '0.8' },
  { path: '/credit', changefreq: 'monthly', priority: '0.9' },
  { path: '/credit/annuity', changefreq: 'monthly', priority: '0.8' },
  { path: '/credit/differentiated', changefreq: 'monthly', priority: '0.8' },
  { path: '/vat', changefreq: 'monthly', priority: '0.8' },
  { path: '/vat/add', changefreq: 'monthly', priority: '0.8' },
  { path: '/vat/extract', changefreq: 'monthly', priority: '0.8' },
  { path: '/income-tax', changefreq: 'monthly', priority: '0.8' },
  { path: '/income-tax/2026', changefreq: 'monthly', priority: '0.8' },
  { path: '/salary', changefreq: 'monthly', priority: '0.8' },
  { path: '/salary/gross-net', changefreq: 'monthly', priority: '0.8' },
  { path: '/salary/net-gross', changefreq: 'monthly', priority: '0.8' },
  { path: '/fuel-consumption', changefreq: 'monthly', priority: '0.7' },
  { path: '/fuel-consumption/trip-cost', changefreq: 'monthly', priority: '0.7' },
  { path: '/transport-tax', changefreq: 'monthly', priority: '0.7' },
  { path: '/bmi', changefreq: 'monthly', priority: '0.7' },
  { path: '/pregnancy', changefreq: 'monthly', priority: '0.7' },
  { path: '/bonds', changefreq: 'monthly', priority: '0.8' },
  { path: '/mortgage', changefreq: 'monthly', priority: '0.9' },
  { path: '/early-repayment', changefreq: 'monthly', priority: '0.8' },
  { path: '/early-repayment/reduce-term', changefreq: 'monthly', priority: '0.8' },
  { path: '/early-repayment/reduce-payment', changefreq: 'monthly', priority: '0.8' },
  { path: '/tax-penalties', changefreq: 'monthly', priority: '0.7' },
  { path: '/about', changefreq: 'yearly', priority: '0.3' },
  { path: '/methodology', changefreq: 'yearly', priority: '0.4' },
  { path: '/contacts', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/finance', changefreq: 'monthly', priority: '0.8' },
  { path: '/loans', changefreq: 'monthly', priority: '0.8' },
  { path: '/taxes', changefreq: 'monthly', priority: '0.8' },
  { path: '/auto', changefreq: 'monthly', priority: '0.6' },
  { path: '/health', changefreq: 'monthly', priority: '0.6' },
]

const subRoutes = INVESTICII_SUBROUTES.map((path) => ({
  path,
  changefreq: 'monthly',
  priority: '0.8',
}))

const allRoutes = [...STATIC_ROUTES, ...subRoutes]

const urlEntries = allRoutes
  .map(
    ({ path, changefreq, priority }) =>
      `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`

const outDir = resolve(projectRoot, 'public')
mkdirSync(outDir, { recursive: true })
const outPath = resolve(outDir, 'sitemap.xml')
writeFileSync(outPath, xml, 'utf8')
console.log(`[sitemap] wrote ${allRoutes.length} routes to ${outPath} (BASE_URL=${BASE_URL})`)
