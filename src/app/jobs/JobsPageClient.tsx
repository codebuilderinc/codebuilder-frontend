"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import JobsTable from '@/components/jobs/JobsTable'
import type { ApiResponse, JobsListData, JobWithRelations } from '@/lib/jobs/types'

type JobsFetchResult = {
  items: JobWithRelations[]
  totalCount: number
}

const JOBS_PER_PAGE = 10
const POLL_INTERVAL_MS = 6000
const MIN_REFRESH_INDICATOR_MS = 500

async function fetchJobsPage(
  page: number,
  limit: number,
  signal?: AbortSignal
): Promise<JobsFetchResult> {
  const res = await fetch(`https://api.codebuilder.org/jobs?page=${page}&limit=${limit}`, { signal })
  const json: ApiResponse<JobsListData> | any = await res.json()

  // Primary shape (current backend): { success: true, data: { items: [...], totalCount } }
  if (json?.success === true && Array.isArray(json?.data?.items)) {
    return {
      items: json.data.items,
      totalCount: typeof json.data.totalCount === 'number' ? json.data.totalCount : 0,
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
  const searchParams = useSearchParams()
  const [jobs, setJobs] = useState<JobWithRelations[]>([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshSecondsRemaining, setRefreshSecondsRemaining] = useState<number | null>(null)

  const refreshInFlightRef = useRef(false)
  const nextRefreshAtRef = useRef<number>(0)

  const lastIdsSignatureRef = useRef<string>('')
  const lastTotalCountRef = useRef<number>(0)
  const didInitialLoadRef = useRef(false)

  const postsPerPage = JOBS_PER_PAGE

  const pageFromParams = useMemo(() => {
    return parseInt(searchParams.get('page') || '1', 10)
  }, [searchParams])

  useEffect(() => {
    const controller = new AbortController()
    const page = Number.isFinite(pageFromParams) && pageFromParams > 0 ? pageFromParams : 1
    setCurrentPage(page)

    const isFirstEverLoad = !didInitialLoadRef.current
    if (isFirstEverLoad) setIsInitialLoading(true)

    fetchJobsPage(page, postsPerPage, controller.signal)
      .then(({ items, totalCount }) => {
        setJobs(items)
        setTotalJobs(totalCount)
        lastTotalCountRef.current = totalCount
        lastIdsSignatureRef.current = items.map((j) => j.id).join(',')
      })
      .catch(() => {
        setJobs([])
        setTotalJobs(0)
        lastTotalCountRef.current = 0
        lastIdsSignatureRef.current = ''
      })
      .finally(() => {
        didInitialLoadRef.current = true
        setIsInitialLoading(false)
      })

    return () => controller.abort()
  }, [pageFromParams, postsPerPage])

  useEffect(() => {
    if (isInitialLoading) return

    let isUnmounted = false
    const controller = new AbortController()
    let clearRefreshingTimeoutId: number | null = null

    const tick = async () => {
      if (refreshInFlightRef.current) return
      refreshInFlightRef.current = true
      setIsRefreshing(true)
      const startedAt = Date.now()
      try {
        const { items, totalCount } = await fetchJobsPage(currentPage, postsPerPage, controller.signal)
        if (isUnmounted) return

        const nextIdsSignature = items.map((j) => j.id).join(',')
        const totalIncreased = totalCount > lastTotalCountRef.current
        const rowsChanged = nextIdsSignature !== lastIdsSignatureRef.current

        if (totalIncreased || rowsChanged) {
          setJobs(items)
          setTotalJobs(totalCount)
          lastTotalCountRef.current = totalCount
          lastIdsSignatureRef.current = nextIdsSignature
        }
      } catch {
        // Keep existing jobs on refresh failure; this is a background enhancement.
      } finally {
        refreshInFlightRef.current = false
        if (!isUnmounted) {
          const elapsed = Date.now() - startedAt
          const remaining = Math.max(0, MIN_REFRESH_INDICATOR_MS - elapsed)
 
          if (clearRefreshingTimeoutId !== null) {
            window.clearTimeout(clearRefreshingTimeoutId)
          }

          clearRefreshingTimeoutId = window.setTimeout(() => {
            if (!isUnmounted) setIsRefreshing(false)
          }, remaining)
        }
        nextRefreshAtRef.current = Date.now() + POLL_INTERVAL_MS
      }
    }

    nextRefreshAtRef.current = Date.now() + POLL_INTERVAL_MS

    const countdownId = window.setInterval(() => {
      const nextAt = nextRefreshAtRef.current
      if (!nextAt) {
        setRefreshSecondsRemaining(null)
        return
      }
      const seconds = Math.max(0, Math.ceil((nextAt - Date.now()) / 1000))
      setRefreshSecondsRemaining(seconds)
    }, 250)

    // Do one immediate background refresh after initial load.
    void tick()

    const intervalId = window.setInterval(tick, POLL_INTERVAL_MS)
    return () => {
      isUnmounted = true
      controller.abort()
      window.clearInterval(intervalId)
      window.clearInterval(countdownId)

      if (clearRefreshingTimeoutId !== null) {
        window.clearTimeout(clearRefreshingTimeoutId)
      }
    }
  }, [currentPage, postsPerPage, isInitialLoading])

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
            isInitialLoading={isInitialLoading}
            isRefreshing={isRefreshing}
            refreshSecondsRemaining={refreshSecondsRemaining}
          />
        </div>
      </section>
    </div>
  )
}
