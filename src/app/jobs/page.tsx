import React from 'react'
import JobsTable from '@/components/jobs/JobsTable'
import VideoPlayer from '../../components/video-player'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

// Type for jobs with relations
type JobWithRelations = Prisma.JobGetPayload<{
  include: {
    company: true
    tags: { include: { tag: true } }
    metadata: true
    sources: true
  }
}>

export default async function Home(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams
  const postsPerPage = 10
  const currentPage = parseInt(searchParams.page || '1', 10)

  const totalJobs = await prisma.job.count()
  const jobs = (await prisma.job.findMany({
    skip: (currentPage - 1) * postsPerPage,
    take: postsPerPage,
    orderBy: { postedAt: 'desc' },
    include: {
      company: true,
      tags: { include: { tag: true } },
      metadata: true,
      sources: true,
    },
  })) as JobWithRelations[]

  await prisma.$disconnect()

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
