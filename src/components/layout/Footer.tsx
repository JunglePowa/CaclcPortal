import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/40">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-6 text-xs text-[hsl(var(--fg-muted))] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© 2026 Калк Портал</p>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link to="/about" className="hover:text-[hsl(var(--fg))] transition-colors">
            О сервисе
          </Link>
          <Link to="/contacts" className="hover:text-[hsl(var(--fg))] transition-colors">
            Контакты
          </Link>
          <Link to="/privacy" className="hover:text-[hsl(var(--fg))] transition-colors">
            Конфиденциальность
          </Link>
          <Link to="/terms" className="hover:text-[hsl(var(--fg))] transition-colors">
            Пользовательское соглашение
          </Link>
          <a href="mailto:info@kalkportal.ru" className="hover:text-[hsl(var(--fg))] transition-colors">
            Написать нам
          </a>
        </nav>
      </div>
    </footer>
  )
}
