import { Suspense } from 'react'
import JobDetailsClient from './JobDetailsClient'

export default function JobDetailsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-16 px-8 md:px-20 lg:px-32">Loading job details...</div>}>
      <JobDetailsClient />
    </Suspense>
  )
}
