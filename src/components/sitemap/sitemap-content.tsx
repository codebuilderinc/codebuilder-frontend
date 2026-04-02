'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { Breadcrumbs, Separator } from '@/components/breadcrumbs'

export function SitemapContent() {
  const sections = [
    {
      title: 'Public Pages',
      links: [
        ['Home', '/'],
        ['About', '/about'],
        ['Services', '/services'],
        ['Portfolio', '/portfolio'],
        ['Contact', '/contact'],
        ['Technology', '/technology'],
        ['Invoice', '/invoice'],
        ['Blog', '/blog'],
        ['Sample Blog Post', '/blog/blogpost-with-slider'],
      ],
    },
    {
      title: 'Admin UX Pages',
      links: [
        ['Admin Dashboard', '/admin'],
        ['Admin Blog', '/admin/blog'],
        ['Admin Client', '/admin/client'],
        ['Admin Files', '/admin/files'],
        ['Admin Invoice', '/admin/invoice'],
        ['Admin Payment', '/admin/payment'],
        ['Admin Time', '/admin/time'],
      ],
    },
    {
      title: 'Utilities',
      links: [
        ['Sitemap', '/sitemap'],
        ['403 CLI Overlay Trigger', '/403'],
      ],
    },
  ]

  return (
    <div className="text-[#323232] bg-white pb-16">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/', icon: <FontAwesomeIcon icon={faHome} className="text-[11px]" /> },
          { label: 'Sitemap' },
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
        <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="bg-[linear-gradient(135deg,#24343b_0%,#131d22_100%)] px-6 py-10 text-white lg:px-10">
            <div className="max-w-3xl">
              <div className="text-[12px] uppercase tracking-[0.24em] text-white/60">Information Architecture</div>
              <h1 className="mt-3 text-[40px] font-light leading-none">Sitemap</h1>
              <p className="mt-4 text-[16px] leading-8 text-white/75">
                A clean directory for the migrated Next.js pages, matching the content structure while fitting into the
                current site shell.
              </p>
            </div>
          </div>
          <div className="grid gap-6 px-6 py-8 lg:grid-cols-3 lg:px-10">
            {sections.map((section) => (
              <section key={section.title} className="rounded-[4px] border border-[#ececec] bg-white p-6">
                <h2 className="text-[24px] font-normal text-[#2f2f2f]">{section.title}</h2>
                <Separator />
                <ul className="mt-5 space-y-3 text-[15px] text-[#666]">
                  {section.links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="inline-flex items-center gap-3 hover:text-[#09afdf]">
                        <span className="h-2 w-2 rounded-full bg-[#09afdf]" />
                        <span>{label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
