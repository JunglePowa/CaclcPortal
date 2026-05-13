import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'

const CALCULATORS: { href: string; label: string }[] = [
  { href: '/investicii', label: 'Калькулятор инвестиций' },
  { href: '/vklad', label: 'Калькулятор вклада' },
  { href: '/kredit', label: 'Кредитный калькулятор' },
  { href: '/ipoteka', label: 'Ипотечный калькулятор' },
  { href: '/kredit-dosrochnoe', label: 'Досрочное погашение кредита' },
  { href: '/obligacii', label: 'Калькулятор облигаций' },
  { href: '/nds', label: 'Калькулятор НДС' },
  { href: '/ndfl', label: 'Калькулятор НДФЛ' },
  { href: '/zarplata', label: 'Калькулятор зарплаты' },
  { href: '/peni', label: 'Калькулятор пеней' },
  { href: '/transportnyj-nalog', label: 'Транспортный налог' },
  { href: '/rashod-topliva', label: 'Расход топлива' },
  { href: '/imt', label: 'Индекс массы тела (ИМТ)' },
  { href: '/beremennost', label: 'Срок беременности' },
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
