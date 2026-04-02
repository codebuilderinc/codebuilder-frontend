'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { AdminLayout, DataTable } from '@/components/admin/admin-layout'
import { ActionButton, Separator } from '@/components/breadcrumbs'

const payments = [
  { id: 'pi_1Q90L...', date: '11/03/2024', type: 'Stripe', status: 'Confirmed', amount: '$1,500.00' },
  { id: 'btc_83728', date: '10/28/2024', type: 'Bitcoin', status: 'Pending', amount: '$740.00' },
  { id: 'pp_46291', date: '10/23/2024', type: 'Paypal', status: 'Confirmed', amount: '$2,240.00' },
]

export function AdminPaymentPage() {
  return (
    <AdminLayout title="Payments" breadcrumbLabel="Payments">
      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="text-[34px] font-normal leading-[1.15] text-[#2a2a2a]">Payments</h1>
          <ActionButton href="/admin/payment" variant="primary">
            <FontAwesomeIcon icon={faPlus} />
            <span>New</span>
          </ActionButton>
        </div>
        <Separator />
        <DataTable
          headers={['Transaction ID', 'Date', 'Type', 'Status', 'Amount']}
          rows={payments.map((p) => [p.id, p.date, p.type, p.status, p.amount])}
        />
      </div>
    </AdminLayout>
  )
}
