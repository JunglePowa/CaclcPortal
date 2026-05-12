#!/usr/bin/env node
// Генерирует public/sitemap.xml из MODE_ROUTES + статических маршрутов.
// BASE_URL читается из process.env.VITE_BASE_URL (или дефолт kalkportal.ru).
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

const BASE_URL = (process.env.VITE_BASE_URL || 'https://kalkportal.ru').replace(/\/$/, '')

// Дублируем MODE_ROUTES здесь, чтобы не тащить TS-файлы в Node-скрипт.
const INVESTICII_SUBROUTES = [
  '/investicii/vznoj',
  '/investicii/srok',
  '/investicii/stavka',
  '/investicii/kapital',
  '/investicii/sravnenie',
]

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/investicii', changefreq: 'monthly', priority: '0.9' },
  { path: '/vklad', changefreq: 'monthly', priority: '0.9' },
  { path: '/kredit', changefreq: 'monthly', priority: '0.9' },
  { path: '/nds', changefreq: 'monthly', priority: '0.8' },
  { path: '/ndfl', changefreq: 'monthly', priority: '0.8' },
  { path: '/zarplata', changefreq: 'monthly', priority: '0.8' },
  { path: '/rashod-topliva', changefreq: 'monthly', priority: '0.7' },
  { path: '/transportnyj-nalog', changefreq: 'monthly', priority: '0.7' },
  { path: '/imt', changefreq: 'monthly', priority: '0.7' },
  { path: '/beremennost', changefreq: 'monthly', priority: '0.7' },
  { path: '/obligacii', changefreq: 'monthly', priority: '0.8' },
  { path: '/ipoteka', changefreq: 'monthly', priority: '0.9' },
  { path: '/kredit-dosrochnoe', changefreq: 'monthly', priority: '0.8' },
  { path: '/peni', changefreq: 'monthly', priority: '0.7' },
  { path: '/about', changefreq: 'yearly', priority: '0.3' },
  { path: '/contacts', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
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
      `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`

const outDir = resolve(projectRoot, 'public')
mkdirSync(outDir, { recursive: true })
const outPath = resolve(outDir, 'sitemap.xml')
writeFileSync(outPath, xml, 'utf8')
console.log(`[sitemap] wrote ${allRoutes.length} routes to ${outPath} (BASE_URL=${BASE_URL})`)
