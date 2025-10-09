
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JobDetails from '@/components/jobs/JobDetails'

interface JobPageProps {
  params: Promise<{ id: string }>
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params
  const jobId = parseInt(id, 10)

  if (isNaN(jobId)) {
    notFound()
  }

  // Fetch job from external API
  const res = await fetch(`https://api.codebuilder.org/jobs/${jobId}`)
  if (!res.ok) {
    notFound()
  }
  const job = await res.json()
  if (!job) {
    notFound()
  }

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

  // Fetch job from external API
  const res = await fetch(`https://api.codebuilder.org/jobs/${jobId}`)
  if (!res.ok) {
    return {
      title: 'Job Not Found',
    }
  }
  const job = await res.json()
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
