import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { ServerApp } from './ServerApp'
import { mergeJsonLd, resolveSEO } from '@/hooks/useSEO'

export function render(pathname: string) {
  const seo = resolveSEO(pathname)
  const jsonLd = mergeJsonLd(pathname, seo)
  const html = renderToString(
    <StaticRouter location={pathname}>
      <ServerApp />
    </StaticRouter>,
  )

  return { html, seo, jsonLd }
}
