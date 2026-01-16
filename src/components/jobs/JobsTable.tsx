'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { JobWithRelations } from '@/lib/jobs/types'
import { AnimatePresence, motion } from 'framer-motion'
import 'animate.css'
import SubscribeButton from './SubscribeButton'
import Pagination from '@/components/pagination'

type Props = {
  jobs: JobWithRelations[]
  totalJobs: number
  jobsPerPage: number
  currentPage: number
  isInitialLoading?: boolean
  isRefreshing?: boolean
  refreshSecondsRemaining?: number | null
}

const JobsTable: React.FC<Props> = ({
  jobs,
  totalJobs,
  jobsPerPage,
  currentPage,
  isInitialLoading = false,
  isRefreshing = false,
  refreshSecondsRemaining = null,
}) => {
  const router = useRouter()

  const getMetadataValue = (job: JobWithRelations, key: string) => {
    const metadata = job.metadata.find((m) => m.name === key)
    return metadata ? metadata.value : null
  }

  const getSourceName = (job: JobWithRelations) => {
    return job.source || 'unknown'
  }

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleString()
  }

  const handleRowClick = (jobId: number) => {
    router.push(`/jobs/${jobId}`)
  }

  const colSpan = 8

  const Spinner = ({ size = 16 }: { size?: number }) => (
    <span
      className="inline-block animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )

  return (
    <div className="animate__animated animate__fadeIn">
      <SubscribeButton />
      <div className="overflow-x-auto py-4">
        <div className="mb-4 flex items-center justify-between gap-3 text-sm text-gray-600">
          <div>💡 Click on any row to view detailed job information</div>
          {!isInitialLoading ? (
            <div className="whitespace-nowrap">
              {isRefreshing ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner size={14} /> Refreshing…
                </span>
              ) : typeof refreshSecondsRemaining === 'number' ? (
                <span>Refreshing in {refreshSecondsRemaining} seconds</span>
              ) : null}
            </div>
          ) : null}
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
            {isInitialLoading ? (
              <tr className="border-b">
                <td colSpan={colSpan} className="py-10 px-6 text-center text-gray-600">
                  <div className="flex items-center justify-center gap-3">
                    <Spinner size={22} />
                    <span className="text-base font-medium">Loading jobs…</span>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {jobs.length === 0 ? (
                  <tr className="border-b">
                    <td colSpan={colSpan} className="py-10 px-6 text-center text-gray-600">
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence initial={false}>
                    {jobs.map((job: JobWithRelations) => {
                      if (!job) return null

                      const subreddit = getMetadataValue(job, 'subreddit')
                      const sourceName = getSourceName(job)

                      return (
                        <motion.tr
                          key={job.id}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => handleRowClick(job.id)}
                          className="border-b hover:bg-blue-50 hover:shadow-md transition duration-300 ease-in-out cursor-pointer"
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
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Job
                            </Link>
                          </td>
                          <td className="py-3 px-6">
                            {job.postedAt ? formatDate(job.postedAt) : formatDate(job.createdAt)}
                          </td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                )}
              </>
            )}
          </tbody>
        </table>
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalJobs / jobsPerPage)}
            getHref={(page) => `/jobs?page=${page}`}
          />
        </div>
      </div>
    </div>
  )
}

export default JobsTable
