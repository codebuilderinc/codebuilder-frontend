import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'
import JobDetails from '@/components/jobs/JobDetails'

// Type for job with relations
type JobWithRelations = Prisma.JobGetPayload<{
  include: {
    company: true
    tags: { include: { tag: true } }
    metadata: true
  }
}>

interface JobPageProps {
  params: Promise<{ id: string }>
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params
  const jobId = parseInt(id, 10)

  if (isNaN(jobId)) {
    notFound()
  }

  const job = (await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: true,
      tags: { include: { tag: true } },
      metadata: true,
    },
  })) as JobWithRelations | null

  if (!job) {
    notFound()
  }

  await prisma.$disconnect()

  return (
    <div className="flex flex-col inset-0 z-50 bg-primary transition-transform">
      <section className={`bg-gray-100 py-4 md:py-6`}>
        <div className="container mx-auto py-16 px-8 md:px-20 lg:px-32">
          {/* Navigation */}
          <nav className="mb-6">
            <Link
              href="/jobs"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              ← Back to Jobs
            </Link>
          </nav>

          {/* Job Details */}
          <JobDetails job={job} />
        </div>
      </section>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: JobPageProps) {
  const { id } = await params
  const jobId = parseInt(id, 10)

  if (isNaN(jobId)) {
    return {
      title: 'Job Not Found',
    }
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      title: true,
      company: { select: { name: true } },
      description: true,
    },
  })

  if (!job) {
    return {
      title: 'Job Not Found',
    }
  }

  const companyName = job.company?.name || 'Unknown Company'
  const title = `${job.title} - ${companyName}`
  const description =
    job.description?.substring(0, 160) || `${job.title} job opportunity at ${companyName}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}
