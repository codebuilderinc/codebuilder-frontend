'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBook,
  faClock,
  faDollarSign,
  faGauge,
  faHome,
  faList,
  faListAlt,
  faQrcode,
  faSave,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/cn'
import { Breadcrumbs, Separator } from '@/components/breadcrumbs'

const adminMenu = [
  { href: '/admin', label: 'Home' },
  { href: '/admin/client', label: 'Clients' },
  { href: '/admin/invoice', label: 'Invoices' },
  { href: '/admin/payment', label: 'Payments' },
  { href: '/admin/time', label: 'Time & Effort' },
  { href: '/admin/blog', label: 'CMS / Blog' },
  { href: '/admin/files', label: 'Files' },
]

function AdminSidebar() {
  const pathname = usePathname()
  const iconMap = new Map([
    ['/admin', faGauge],
    ['/admin/client', faUser],
    ['/admin/invoice', faQrcode],
    ['/admin/payment', faDollarSign],
    ['/admin/time', faClock],
    ['/admin/blog', faBook],
    ['/admin/files', faSave],
  ])

  return (
    <aside className="w-full lg:w-[280px]">
      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6">
        <h3 className="text-[22px] font-normal text-[#2f2f2f] flex items-center gap-3">
          <FontAwesomeIcon icon={faListAlt} className="text-[20px]" />
          <span>Admin Menu</span>
        </h3>
        <Separator />
        <nav className="mt-5">
          <ul className="space-y-2">
            {adminMenu.map((item) => {
              const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-[3px] px-4 py-3 text-[14px] text-[#666] transition-colors hover:bg-[#f7fafb] hover:text-[#09afdf]',
                      active &&
                        'bg-[linear-gradient(90deg,rgba(9,175,223,0.12),rgba(9,175,223,0.04))] text-[#09afdf] font-medium'
                    )}
                  >
                    <FontAwesomeIcon icon={iconMap.get(item.href) ?? faList} className="w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export function AdminLayout({
  title,
  breadcrumbLabel,
  children,
}: {
  title: string
  breadcrumbLabel?: string
  children: ReactNode
}) {
  return (
    <div className="text-[#323232] bg-white pb-16">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/', icon: <FontAwesomeIcon icon={faHome} className="text-[11px]" /> },
          {
            label: 'Admin Dashboard',
            href: breadcrumbLabel ? '/admin' : undefined,
          },
          ...(breadcrumbLabel ? [{ label: breadcrumbLabel }] : []),
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <main className="min-w-0 flex-1">{children}</main>
          <AdminSidebar />
        </div>
      </section>
    </div>
  )
}

export function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-[#ececec] text-[#555]">
            {headers.map((header) => (
              <th key={header} className="px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-[#f3f3f3] text-[#666]">
              {row.map((cell, cellIndex) => (
                <td key={`${index}-${cellIndex}`} className="px-4 py-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
