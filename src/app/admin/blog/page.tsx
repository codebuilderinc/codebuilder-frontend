'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { AdminLayout, DataTable } from '@/components/admin/admin-layout'
import { ActionButton, Separator } from '@/components/breadcrumbs'

const blogPosts = [
  { title: 'Scaling Realtime Web Apps', url: 'blog/scaling-realtime-web-apps', views: '4,181' },
  { title: 'Designing Better Payment UX', url: 'blog/designing-better-payment-ux', views: '2,744' },
  { title: 'A Practical Laravel to Next.js Migration', url: 'blog/laravel-to-nextjs-migration', views: '1,913' },
]

export default function AdminBlogPage() {
  return (
    <AdminLayout title="CMS & Blog" breadcrumbLabel="CMS &amp; Blog">
      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="text-[34px] font-normal leading-[1.15] text-[#2a2a2a]">CMS &amp; Blog</h1>
          <ActionButton href="/admin/blog" variant="primary">
            <FontAwesomeIcon icon={faPlus} />
            <span>New</span>
          </ActionButton>
        </div>
        <Separator />
        <div className="mb-5 flex gap-2 text-[13px]">
          <button className="rounded-t-[3px] border border-b-0 border-[#ececec] bg-white px-4 py-2 text-[#444]">
            CMS
          </button>
          <button className="rounded-t-[3px] border border-b-0 border-[#ececec] bg-[#fafafa] px-4 py-2 text-[#777]">
            Blog Posts
          </button>
        </div>
        <DataTable
          headers={['Title', 'URL', 'Views']}
          rows={blogPosts.map((post) => [post.title, post.url, post.views])}
        />
      </div>
    </AdminLayout>
  )
}
