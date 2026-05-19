import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'

const CALCULATORS: { href: string; label: string }[] = [
  { href: '/investment', label: 'Калькулятор инвестиций' },
  { href: '/deposit', label: 'Калькулятор вклада' },
  { href: '/credit', label: 'Кредитный калькулятор' },
  { href: '/mortgage', label: 'Ипотечный калькулятор' },
  { href: '/early-repayment', label: 'Досрочное погашение кредита' },
  { href: '/bonds', label: 'Калькулятор облигаций' },
  { href: '/vat', label: 'Калькулятор НДС' },
  { href: '/income-tax', label: 'Калькулятор НДФЛ' },
  { href: '/salary', label: 'Калькулятор зарплаты' },
  { href: '/tax-penalties', label: 'Калькулятор пеней' },
  { href: '/transport-tax', label: 'Транспортный налог' },
  { href: '/fuel-consumption', label: 'Расход топлива' },
  { href: '/bmi', label: 'Индекс массы тела (ИМТ)' },
  { href: '/pregnancy', label: 'Срок беременности' },
]

export default function AboutPage() {
  return (
    <AppLayout>
      <article className="max-w-2xl mx-auto py-8 px-4 space-y-4 text-sm leading-relaxed">
        <h1 className="text-2xl font-bold">О сервисе</h1>

        <p>
          <strong>Калк Портал</strong> — бесплатный сервис онлайн-калькуляторов для повседневных
          задач: финансы, кредиты, налоги, авто и здоровье. Все расчёты выполняются в браузере,
          ничего не отправляется на сервер.
        </p>

        <h2 className="text-lg font-semibold pt-2">Принципы</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Прозрачные формулы и пояснения, основанные на действующих нормах.</li>
          <li>Никакой регистрации и сбора персональных данных.</li>
          <li>Адаптивный интерфейс — корректная работа на телефонах и компьютерах.</li>
          <li>Подробная история расчётов хранится только на устройстве пользователя.</li>
        </ul>

        <h2 className="text-lg font-semibold pt-2">Калькуляторы</h2>
        <ul className="list-disc pl-5 space-y-1">
          {CALCULATORS.map((c) => (
            <li key={c.href}>
              <Link className="underline hover:text-emerald-500 transition-colors" to={c.href}>
                {c.label}
              </Link>
            </li>
          ))}
        </ul>

        <p>
          Сервис развивается, новые калькуляторы добавляются регулярно. Пожелания и сообщения об
          ошибках можно отправить на адрес{' '}
          <a className="underline" href="mailto:calcportal@mail.ru">calcportal@mail.ru</a>.
        </p>

        <p className="text-xs text-[hsl(var(--fg-muted))] pt-4">Дата обновления: 2026-05-12</p>
      </article>
    </AppLayout>
  )
}
