'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { AdminLayout } from '@/components/admin/admin-layout'
import { ActionButton, Separator } from '@/components/breadcrumbs'

const timesheets = [
  {
    date: 'November 02nd, 2024',
    time: '9:00 AM - 1:30 PM',
    hours: '4.50 hrs',
    user: 'Andrew Corbin',
    client: 'ACME Product Team',
    firm: 'ACME Labs LLC',
    description:
      'Polish invoice payment UX, fix edge cases in router transition handling, and review responsive behavior.',
  },
  {
    date: 'October 28th, 2024',
    time: '2:15 PM - 6:00 PM',
    hours: '3.75 hrs',
    user: 'Tom Goodrie',
    client: 'Northgrid Studio',
    firm: 'Northgrid Studio',
    description: 'Review sitemap IA, implement content page scaffolding, and prep migration notes for API transition.',
  },
]

export function AdminTimePage() {
  return (
    <AdminLayout title="Timesheets" breadcrumbLabel="Timesheets">
      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="text-[34px] font-normal leading-[1.15] text-[#2a2a2a]">Timesheets</h1>
          <ActionButton href="/admin/time" variant="primary">
            <FontAwesomeIcon icon={faPlus} />
            <span>New</span>
          </ActionButton>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#ececec] text-[#555]">
                {['Date', 'Hours', 'User', 'Client', 'Description', ''].map((header) => (
                  <th key={header} className="px-4 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timesheets.map((row) => (
                <tr key={`${row.date}-${row.user}`} className="border-b border-[#f3f3f3] text-[#666]">
                  <td className="px-4 py-4">
                    <div className="text-center">
                      {row.date}
                      <br />
                      <small>({row.time})</small>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-semibold">{row.hours}</td>
                  <td className="px-4 py-4">{row.user}</td>
                  <td className="px-4 py-4">
                    {row.client}
                    <br />
                    <small>{row.firm}</small>
                  </td>
                  <td className="px-4 py-4">
                    <textarea className="h-[150px] w-full rounded-[3px] border border-[#ddd] px-3 py-2 text-[13px] outline-none">
                      {row.description}
                    </textarea>
                  </td>
                  <td className="px-4 py-4 text-center text-[#c46]">Delete</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
