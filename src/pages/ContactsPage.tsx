import { AppLayout } from '@/components/layout/AppLayout'

export default function ContactsPage() {
  return (
    <AppLayout>
      <article className="max-w-2xl mx-auto py-8 px-4 space-y-4 text-sm leading-relaxed">
        <h1 className="text-2xl font-bold">Контакты</h1>

        <p>
          По вопросам работы сервиса, сотрудничества, рекламы и обращений по персональным данным
          напишите нам на электронную почту.
        </p>

        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]/60 p-4">
          <p className="text-xs text-[hsl(var(--fg-muted))] uppercase tracking-wide mb-1">Электронная почта</p>
          <p className="text-base">
            <a className="underline" href="mailto:calcportal@mail.ru">calcportal@mail.ru</a>
          </p>
        </div>

        <p>
          Мы стараемся отвечать в течение нескольких рабочих дней. Если вы нашли ошибку в
          расчёте — приложите, пожалуйста, ссылку на страницу и введённые значения, это сильно
          ускорит разбор.
        </p>

        <p className="text-xs text-[hsl(var(--fg-muted))] pt-4">Дата обновления: 2026-05-12</p>
      </article>
    </AppLayout>
  )
}
