'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { AdminLayout, DataTable } from '@/components/admin/admin-layout'
import { ActionButton, Separator } from '@/components/breadcrumbs'

const clients = [
  { name: 'Alice Johnson', firm: 'Northgrid Studio', email: 'alice@northgrid.io' },
  { name: 'Marcus Chen', firm: 'Velox Health', email: 'marcus@veloxhealth.com' },
  { name: 'Priya Desai', firm: 'Harbor Commerce', email: 'priya@harborcommerce.co' },
]

export function AdminClientPage() {
  return (
    <AdminLayout title="Clients" breadcrumbLabel="Clients">
      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="text-[34px] font-normal leading-[1.15] text-[#2a2a2a]">Clients</h1>
          <ActionButton href="/admin/client" variant="primary">
            <FontAwesomeIcon icon={faPlus} />
            <span>New</span>
          </ActionButton>
        </div>
        <Separator />
        <DataTable headers={['Name', 'Firm', 'Email']} rows={clients.map((c) => [c.name, c.firm, c.email])} />
      </div>
    </AdminLayout>
  )
}
