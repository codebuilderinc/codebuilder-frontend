import React from 'react'
import JobsTable from '@/components/jobs/JobsTable'
import VideoPlayer from '../../components/video-player'


export default async function Home(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams
  const postsPerPage = 10
  const currentPage = parseInt(searchParams.page || '1', 10)

  // Fetch jobs from external API
  const res = await fetch(`https://api.codebuilder.org/jobs?page=${currentPage}&limit=${postsPerPage}`)
  if (!res.ok) {
    throw new Error('Failed to fetch jobs from external API')
  }
  const data = await res.json()
  const jobs = data.jobs || []
  const totalJobs = data.total || 0

  return (
    <div className="flex flex-col inset-0 z-50 bg-primary transition-transform">
      <section className={`bg-gray-100 py-4 md:py-6`}>
        <div className="container mx-auto py-16 px-8 md:px-20 lg:px-32">
          <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
          <JobsTable
            jobs={jobs}
            totalJobs={totalJobs}
            jobsPerPage={postsPerPage}
            currentPage={currentPage}
          />
        </div>
      </section>
    </div>
  )
}
