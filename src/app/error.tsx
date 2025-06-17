// app/error.tsx

'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { reportError } from '@/lib/errorReportingService' // 1. Import the service

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 2. Log the error to your reporting service instead of just the console
    reportError(error)
  }, [error])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Something went wrong!</h2>
      <p>An error occurred while loading this page.</p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}
