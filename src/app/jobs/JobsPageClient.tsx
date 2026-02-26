"use client"

import React from 'react'
import JobsTable from '@/components/jobs/JobsTable'
import type { ApiResponse, JobsListData, JobWithRelations } from '@/lib/jobs/types'
import type { PaginatedResponse } from '@/lib/pagination'
import { usePagination } from '@/lib/pagination'

const JOBS_PER_PAGE = 10
const POLL_INTERVAL_MS = 6000

/**
 * Fetch function for jobs API using offset-based pagination
 */
async function fetchJobs(url: string, signal?: AbortSignal): Promise<PaginatedResponse<JobWithRelations>> {
  const res = await fetch(url, { signal })
  const json: ApiResponse<JobsListData> | any = await res.json()

  // Primary shape (current backend): { success: true, data: { items: [...], totalCount, pageInfo } }
  if (json?.success === true && Array.isArray(json?.data?.items)) {
    return {
      items: json.data.items,
      totalCount: typeof json.data.totalCount === 'number' ? json.data.totalCount : 0,
      pageInfo: json.data.pageInfo,
    }
  }

  // Fallback shape (older/internal): { data: [...], totalCount }
  if (Array.isArray(json?.data)) {
    return {
      items: json.data,
      totalCount: typeof json.totalCount === 'number' ? json.totalCount : 0,
    }
  }

  return { items: [], totalCount: 0 }
}

export default function JobsPageClient() {
  const {
    items: jobs,
    paginationState,
    isInitialLoading,
    isRefreshing,
    refreshSecondsRemaining,
  } = usePagination<JobWithRelations>({
    config: {
      type: 'offset-based', // Using offset-based pagination for the API
      itemsPerPage: JOBS_PER_PAGE,
    },
    fetchFn: fetchJobs,
    baseUrl: 'https://api.codebuilder.org/jobs',
    pollInterval: POLL_INTERVAL_MS,
  })

  return (
    <div className="flex flex-col inset-0 z-50 bg-primary transition-transform">
      <section className={`bg-gray-100 py-4 md:py-6`}>
        <div className="container mx-auto py-16 px-8 md:px-20 lg:px-32">
          <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
          <JobsTable
            jobs={jobs}
            totalJobs={paginationState.totalItems}
            jobsPerPage={paginationState.itemsPerPage}
            currentPage={paginationState.currentPage}
            isInitialLoading={isInitialLoading}
            isRefreshing={isRefreshing}
            refreshSecondsRemaining={refreshSecondsRemaining}
          />
        </div>
      </section>
    </div>
  )
}
