'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import { ActionButton } from '@/components/breadcrumbs'
import { technologySections } from './data'

function TechnologyAccordion() {
  const [activeSection, setActiveSection] = useState('environments')
  const [openItem, setOpenItem] = useState<string | null>(null)

  const currentSection = useMemo(
    () => technologySections.find((section) => section.id === activeSection) ?? technologySections[0],
    [activeSection]
  )

  useEffect(() => {
    setOpenItem(currentSection.items[0]?.id ?? null)
  }, [currentSection])

  return (
    <section className="text-[#323232] bg-white pb-16">
      <div className="relative overflow-hidden bg-[#101619]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="/template/videos/futuristic-technology-abstract-background_4k3v6uqwg__WL.mp4"
        />
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(17,26,31,0.08)_0%,rgba(17,26,31,0.65)_55%,rgba(10,16,20,0.92)_100%)]" />
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(10,18,22,0.7)_0%,rgba(10,18,22,0.35)_28%,rgba(10,18,22,0.74)_100%)]" />
        <div className="relative z-[2] mx-auto max-w-5xl px-6 py-20 text-center text-white lg:px-8 lg:py-28">
          <h1 className="text-[28px] font-normal">Technology</h1>
          <div className="mx-auto my-6 max-w-xl h-px w-full bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.35)_35%,rgba(255,255,255,0.35)_70%,transparent_100%)]" />
          <p className="mx-auto max-w-3xl text-[18px] font-light leading-8 text-white/90">
            Our developers use various types of technology to stay current with industry standards.
          </p>
          <div className="mt-8">
            <ActionButton href="/contact" variant="ghost">
              Contact Us
            </ActionButton>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-6 pt-6 lg:px-8">
        <aside className="hidden w-[220px] shrink-0 lg:block">
          <nav className="sticky top-28">
            <ul className="space-y-1">
              {technologySections
                .filter((section) => section.id !== 'cloud')
                .map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        'w-full rounded-[3px] px-4 py-3 text-left text-[14px] text-[#666] transition-colors hover:bg-[#f7fafb] hover:text-[#09afdf]',
                        activeSection === section.id &&
                          'bg-[linear-gradient(90deg,rgba(9,175,223,0.12),rgba(9,175,223,0.04))] text-[#09afdf] font-medium'
                      )}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 lg:hidden">
            <label className="mb-2 block text-[13px] font-medium uppercase tracking-[0.12em] text-[#666]">
              Technology Section
            </label>
            <select
              value={activeSection}
              onChange={(event) => setActiveSection(event.target.value)}
              className="w-full rounded-[3px] border border-[#d9d9d9] bg-white px-4 py-3 text-[14px] outline-none ring-0"
            >
              {technologySections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>

          <section id={currentSection.id}>
            <h2 className="mb-6 text-[32px] font-normal text-[#2f2f2f]">{currentSection.title}</h2>
            <div className="space-y-3">
              {currentSection.items.map((item) => {
                const isOpen = openItem === item.id
                return (
                  <div key={item.id} className="overflow-hidden rounded-[3px] border border-[#ececec] bg-white">
                    <button
                      type="button"
                      onClick={() => setOpenItem(isOpen ? null : item.id)}
                      className="flex w-full items-center gap-3 px-5 py-4 text-left text-[14px] text-[#555]"
                    >
                      <img src={item.icon} alt="" className="h-4 w-4 object-contain" />
                      <span>{item.title}</span>
                    </button>
                    {isOpen ? (
                      <div className="border-t border-[#ececec] px-5 py-5 text-[14px] leading-7 text-[#666]">
                        {item.description}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export function TechnologyPage() {
  return <TechnologyAccordion />
}
