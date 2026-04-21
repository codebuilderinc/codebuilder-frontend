'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import JobDetails from '@/components/jobs/JobDetails'
import type { ApiResponse, JobWithRelations } from '@/lib/jobs/types'

type LoadState = 'idle' | 'loading' | 'error' | 'success'

export default function JobDetailsClient() {
  const searchParams = useSearchParams()
  const [job, setJob] = useState<JobWithRelations | null>(null)
  const [state, setState] = useState<LoadState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const jobId = useMemo(() => {
    const raw = searchParams.get('id')
    if (!raw) return null

    const parsed = parseInt(raw, 10)
    return Number.isNaN(parsed) ? null : parsed
  }, [searchParams])

  useEffect(() => {
    if (jobId === null) {
      setState('error')
      setErrorMessage('Missing or invalid job id in the URL.')
      setJob(null)
      return
    }

    const controller = new AbortController()

    const loadJob = async () => {
      try {
        setState('loading')
        setErrorMessage('')

        const res = await fetch(`https://api.codebuilder.org/jobs/${jobId}`, {
          signal: controller.signal,
        })

        if (!res.ok) {
          throw new Error('Job not found.')
        }

        const json: ApiResponse<JobWithRelations> | JobWithRelations = await res.json()
        const data = (json as any)?.success === true ? (json as any).data : json

        if (!data) {
          throw new Error('Job payload is empty.')
        }

        setJob(data)
        setState('success')
      } catch (error: any) {
        if (controller.signal.aborted) {
          return
        }

        setJob(null)
        setState('error')
        setErrorMessage(error?.message || 'Unable to load job details.')
      }
    }

    loadJob()

    return () => controller.abort()
  }, [jobId])

  return (
    <div className="flex flex-col inset-0 z-50 bg-primary transition-transform">
      <section className="bg-gray-100 py-4 md:py-6">
        <div className="container mx-auto py-16 px-8 md:px-20 lg:px-32">
          <nav className="mb-6">
            <Link href="/jobs" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
              ← Back to Jobs
            </Link>
          </nav>

          {state === 'loading' && (
            <div className="rounded-lg bg-white p-6 shadow-md text-gray-700">Loading job details...</div>
          )}

          {state === 'error' && (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h1 className="mb-2 text-2xl font-semibold text-gray-800">Job Not Found</h1>
              <p className="text-gray-600">{errorMessage || 'This job does not exist or is unavailable.'}</p>
            </div>
          )}

          {state === 'success' && job && <JobDetails job={job} />}
        </div>
      </section>
    </div>
  )
}
