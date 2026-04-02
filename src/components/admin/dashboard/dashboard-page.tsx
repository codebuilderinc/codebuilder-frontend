'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faFileInvoiceDollar, faUser } from '@fortawesome/free-solid-svg-icons'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Separator } from '@/components/breadcrumbs'

export function DashboardPage() {
  return (
    <AdminLayout title="CodeBuilder Admin Interface">
      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 lg:p-8">
        <h1 className="text-[34px] font-normal leading-[1.15] text-[#2a2a2a]">CodeBuilder Admin Interface</h1>
        <Separator />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Clients', value: '312', icon: faUser },
            { label: 'Invoices', value: '58', icon: faFileInvoiceDollar },
            { label: 'Payments', value: '$129k', icon: faDollarSign },
          ].map((card) => (
            <div
              key={card.label}
              className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[14px] text-[#777]">{card.label}</div>
                  <div className="mt-2 text-[34px] font-light text-[#2f2f2f]">{card.value}</div>
                </div>
                <FontAwesomeIcon icon={card.icon} className="text-[28px] text-[#09afdf]" />
              </div>
            </div>
          ))}
          <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 md:col-span-3">
            <div className="text-[14px] uppercase tracking-[0.14em] text-[#888]">Analytics</div>
            <div className="mt-4 h-56 rounded-[3px] border border-dashed border-[#d7dde0] bg-[linear-gradient(180deg,#fafcfd_0%,#f4f7f8_100%)]" />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
