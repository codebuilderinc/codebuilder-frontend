'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Prisma } from '@prisma/client'
import 'animate.css'
import SubscribeButton from './SubscribeButton'

// Extended Job type with relations using Prisma's generated types
type JobWithRelations = Prisma.JobGetPayload<{
  include: {
    company: true
    tags: { include: { tag: true } }
    metadata: true
    sources: true
  }
}>

type Props = {
  jobs: JobWithRelations[]
  totalJobs: number
  jobsPerPage: number
  currentPage: number
}

const JobsTable: React.FC<Props> = ({ jobs, totalJobs, jobsPerPage, currentPage }) => {
  const router = useRouter()

  const getMetadataValue = (job: JobWithRelations, key: string) => {
    const metadata = job.metadata.find((m) => m.name === key)
    return metadata ? metadata.value : null
  }

  const getSourceName = (job: JobWithRelations) => {
    const source = job.sources[0] // Get the first source
    return source ? source.source : 'unknown'
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const handleRowClick = (jobId: number) => {
    router.push(`/jobs/${jobId}`)
  }

  return (
    <div className="animate__animated animate__fadeIn">
      <SubscribeButton />
      <div className="overflow-x-auto py-4">
        <div className="mb-4 text-sm text-gray-600">
          💡 Click on any row to view detailed job information
        </div>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left font-semibold">Title</th>
              <th className="py-3 px-6 text-left font-semibold">Company</th>
              <th className="py-3 px-6 text-left font-semibold">Author</th>
              <th className="py-3 px-6 text-left font-semibold">Location</th>
              <th className="py-3 px-6 text-left font-semibold">Source</th>
              <th className="py-3 px-6 text-left font-semibold">Tags</th>
              <th className="py-3 px-6 text-left font-semibold">Link</th>
              <th className="py-3 px-6 text-left font-semibold">Posted At</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job: JobWithRelations) => {
              if (!job) return null // Skip undefined or null jobs

              const subreddit = getMetadataValue(job, 'subreddit')
              const sourceName = getSourceName(job)

              return (
                <tr
                  key={job.id}
                  onClick={() => handleRowClick(job.id)}
                  className="border-b hover:bg-blue-50 hover:shadow-md transition duration-300 ease-in-out animate__animated animate__fadeInUp cursor-pointer"
                >
                  <td className="py-3 px-6">{job.title}</td>
                  <td className="py-3 px-6">
                    {job.company ? job.company.name : subreddit ? `r/${subreddit}` : '-'}
                  </td>
                  <td className="py-3 px-6">{job.author || '-'}</td>
                  <td className="py-3 px-6">{job.location || '-'}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        sourceName === 'reddit'
                          ? 'bg-orange-100 text-orange-800'
                          : sourceName === 'web3career'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {sourceName}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex flex-wrap gap-1">
                      {job.tags.map(({ tag }) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <Link
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking link
                    >
                      View Job
                    </Link>
                  </td>
                  <td className="py-3 px-6">
                    {job.postedAt ? formatDate(job.postedAt) : formatDate(job.createdAt)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="flex list-none">
              {Array.from({ length: Math.ceil(totalJobs / jobsPerPage) }, (_, i) => i + 1).map(
                (number) => (
                  <li key={number} className="mx-1">
                    <Link
                      href={`/jobs?page=${number}`}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === number
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition duration-300 ease-in-out`}
                    >
                      {number}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default JobsTable
