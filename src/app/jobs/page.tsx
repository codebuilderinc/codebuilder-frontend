"use client"

import React, { useEffect, useState } from 'react'
import JobsTable from '@/components/jobs/JobsTable'

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  useEffect(() => {
    // Get page from URL search params
    const params = new URLSearchParams(window.location.search)
    const page = parseInt(params.get('page') || '1', 10)
    setCurrentPage(page)

    fetch(`https://api.codebuilder.org/jobs?page=${page}&limit=${postsPerPage}`)
      .then(res => res.json())
      .then(data => {
        setJobs(data.jobs || [])
        setTotalJobs(data.total || 0)
      })
      .catch(() => {
        setJobs([])
        setTotalJobs(0)
      })
  }, [window.location.search])

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
