'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faPlus } from '@fortawesome/free-solid-svg-icons'
import { AdminLayout } from '@/components/admin/admin-layout'
import { ActionButton, Separator } from '@/components/breadcrumbs'

const files = [
  { name: 'Northgrid Brand Guide.pdf', added: '01/01/17', size: '25 MB', hits: '25' },
  { name: 'Q4 Sprint Scope.xlsx', added: '01/01/17', size: '7 MB', hits: '13' },
  { name: 'Invoice Assets.zip', added: '01/01/17', size: '38 MB', hits: '41' },
]

export default function AdminFilesPage() {
  return (
    <AdminLayout title="File Manager" breadcrumbLabel="File Manager">
      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="text-[34px] font-normal leading-[1.15] text-[#2a2a2a]">File Manager</h1>
          <ActionButton href="/admin/files" variant="primary">
            <FontAwesomeIcon icon={faPlus} />
            <span>Upload</span>
          </ActionButton>
        </div>
        <Separator />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex h-[250px] flex-col justify-center border-dashed border-[#cfdce1] p-6 text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#09afdf]/10 text-[#09afdf]">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div className="mt-4 text-[18px] text-[#2f2f2f]">Upload</div>
            <div className="mt-2 text-[14px] text-[#777]">Dropzone-style upload surface placeholder</div>
          </div>
          {files.map((file) => (
            <div
              key={file.name}
              className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] h-[250px] p-5"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="mb-4 flex h-[72px] items-center justify-center rounded-[3px] bg-[#fafafa]">
                    <FontAwesomeIcon icon={faFolderOpen} className="text-[28px] text-[#09afdf]" />
                  </div>
                  <h3 className="text-center text-[16px] text-[#2f2f2f]">{file.name}</h3>
                  <div className="mt-4 overflow-hidden rounded-[3px] border border-[#ececec]">
                    {[
                      ['Added', file.added],
                      ['Size', file.size],
                      ['Hits', file.hits],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex justify-between border-b border-[#ececec] px-3 py-2 text-[13px] last:border-b-0"
                      >
                        <span className="text-[#666]">{label}</span>
                        <span className="text-[#888]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-[12px] text-[#777]">
                  <span>Delete</span>
                  <span>Download</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
