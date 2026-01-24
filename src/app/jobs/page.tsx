import React, { Suspense } from 'react'
import JobsPageClient from './JobsPageClient'

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="py-12">Loading jobs...</div>}>
      <JobsPageClient />
    </Suspense>
  )
}
