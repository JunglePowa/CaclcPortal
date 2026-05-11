interface CalcLayoutProps {
  sidebar: React.ReactNode
  content: React.ReactNode
}

export function CalcLayout({ sidebar, content }: CalcLayoutProps) {
  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full lg:w-[380px] xl:w-[420px] lg:flex-shrink-0 lg:sticky lg:top-[61px]">
          <div className="glass rounded-2xl p-5 space-y-5">
            {sidebar}
          </div>
        </aside>
        <section className="flex-1 min-w-0 space-y-5" id="charts-panel">
          {content}
        </section>
      </div>
    </main>
  )
}
