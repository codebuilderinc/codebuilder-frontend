'use client' // This component must be a Client Component

import { useEffect } from 'react'
import { reportError } from '@/lib/errorReportingService' // Adjust path if needed

export default function GlobalErrorHandler() {
  useEffect(() => {
    // --- Handler for uncaught errors ---
    const handleError = (event: ErrorEvent) => {
      event.preventDefault()
      reportError(event.error, { isFatal: true })
    }

    // --- Handler for unhandled promise rejections ---
    const handleRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault()
      // A rejection reason can be anything, but we'll try to handle it as an Error
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(`Promise rejected with a non-error value: ${String(event.reason)}`)

      reportError(error, { isFatal: true })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    // --- Cleanup function ---
    // This will run when the component unmounts
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, []) // The empty dependency array ensures this runs only once

  // This component renders nothing to the DOM
  return null
}
