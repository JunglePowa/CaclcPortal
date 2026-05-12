interface CalcLayoutProps {
  sidebar: React.ReactNode
  content: React.ReactNode
}

export function CalcLayout({ sidebar, content }: CalcLayoutProps) {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="w-full lg:sticky lg:top-[76px] lg:w-[380px] lg:flex-shrink-0 xl:w-[420px]">
          <div className="glass space-y-5 rounded-xl p-5">
            {sidebar}
          </div>
        </aside>
        <section className="min-w-0 flex-1 space-y-5" id="charts-panel">
          {content}
        </section>
      </div>
    </main>
  )
}
