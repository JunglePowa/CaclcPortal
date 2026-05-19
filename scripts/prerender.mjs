#!/usr/bin/env node
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const distDir = resolve(projectRoot, 'dist')
const serverEntry = resolve(projectRoot, 'dist-server', 'entry-server.js')
const template = readFileSync(resolve(distDir, 'index.html'), 'utf8')
const sitemap = readFileSync(resolve(projectRoot, 'public', 'sitemap.xml'), 'utf8')

const routes = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)]
  .map((match) => match[1] || '/')
  .map((path) => (path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path))

const { render } = await import(pathToFileURL(serverEntry).href)

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeScriptJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

function upsertTag(head, selector, tag) {
  const pattern = selector instanceof RegExp ? selector : new RegExp(selector)
  return pattern.test(head) ? head.replace(pattern, tag) : `${head}\n    ${tag}`
}

function buildHead(html, route, seo, jsonLd) {
  const jsonLdTag = jsonLd
    ? `    <script type="application/ld+json">${escapeScriptJson(jsonLd)}</script>`
    : ''

  let head = html
  head = upsertTag(head, /<title>.*?<\/title>/s, `<title>${escapeAttr(seo.title)}</title>`)
  head = upsertTag(head, /<meta name="title" content=".*?" \/>/s, `<meta name="title" content="${escapeAttr(seo.title)}" />`)
  head = upsertTag(head, /<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${escapeAttr(seo.description)}" />`)
  head = upsertTag(head, /<meta name="robots" content=".*?" \/>/s, `<meta name="robots" content="${escapeAttr(seo.robots ?? 'index, follow')}" />`)
  head = upsertTag(head, /<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`)
  head = upsertTag(head, /<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${escapeAttr(seo.canonical)}" />`)
  head = upsertTag(head, /<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${escapeAttr(seo.title)}" />`)
  head = upsertTag(head, /<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${escapeAttr(seo.description)}" />`)
  head = upsertTag(head, /<meta name="twitter:title" content=".*?" \/>/s, `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`)
  head = upsertTag(head, /<meta name="twitter:description" content=".*?" \/>/s, `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`)
  head = head.replace(/<script type="application\/ld\+json">.*?<\/script>\s*/s, '')
  head = jsonLdTag ? head.replace('</head>', `${jsonLdTag}\n  </head>`) : head
  head = head.replace('<html lang="ru">', `<html lang="ru" data-prerendered-route="${escapeAttr(route)}">`)

  return head
}

function outFileForRoute(route) {
  if (route === '/') return resolve(distDir, 'index.html')
  return resolve(distDir, route.slice(1), 'index.html')
}

function flatOutFileForRoute(route) {
  if (route === '/') return null
  return resolve(distDir, `${route.slice(1)}.html`)
}

for (const route of routes) {
  const { html, seo, jsonLd } = render(route)
  const output = buildHead(template, route, seo, jsonLd).replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`,
  )
  const outFile = outFileForRoute(route)
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, output, 'utf8')

  const flatOutFile = flatOutFileForRoute(route)
  if (flatOutFile) {
    mkdirSync(dirname(flatOutFile), { recursive: true })
    writeFileSync(flatOutFile, output, 'utf8')
  }
}

rmSync(resolve(projectRoot, 'dist-server'), { recursive: true, force: true })
console.log(`[prerender] wrote ${routes.length} HTML routes`)
