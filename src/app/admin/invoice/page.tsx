'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { AdminLayout, DataTable } from '@/components/admin/admin-layout'
import { ActionButton, Separator } from '@/components/breadcrumbs'

const invoices = [
  {
    date: 'November 03rd, 2024',
    id: 'CB-2024-117',
    amount: '$4,180.00',
    client: 'ACME Product Team',
    status: 'Unpaid',
  },
  { date: 'October 22nd, 2024', id: 'CB-2024-109', amount: '$2,240.00', client: 'Northgrid Studio', status: 'Paid' },
  { date: 'October 06th, 2024', id: 'CB-2024-098', amount: '$8,900.00', client: 'Velox Health', status: 'Paid' },
]

export default function AdminInvoicePage() {
  return (
    <AdminLayout title="Invoices" breadcrumbLabel="Invoices">
      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="text-[34px] font-normal leading-[1.15] text-[#2a2a2a]">Invoices</h1>
          <ActionButton href="/admin/invoice" variant="primary">
            <FontAwesomeIcon icon={faPlus} />
            <span>New</span>
          </ActionButton>
        </div>
        <Separator />
        <DataTable
          headers={['Date', 'Invoice ID', 'Amount', 'Client', 'Status']}
          rows={invoices.map((inv) => [inv.date, inv.id, inv.amount, inv.client, inv.status])}
        />
      </div>
    </AdminLayout>
  )
}
