'use client' // This ensures the component runs client-side

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // from next/navigation for the app router

const LoadingBar = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    // The app router doesn't expose router events, so we can listen to navigation start/end with manual calls.
    // Any programmatic navigation (router.push, router.replace) should trigger the loading state.
    // If you have links using <Link>, it will automatically handle navigation without needing events.
    handleStart()

    return () => {
      handleComplete() // Cleanup on component unmount
    }
  }, [router])

  return (
    loading && (
      <div
        className="flex w-full h-[10px] z-50 bg-blue-500 animate__animated animate__fadeIn animate__faster"
        style={{ animationDuration: '0.5s' }}
      >
        <div className="h-full bg-blue-600 animate-pulse" style={{ width: '100%' }} />
      </div>
    )
  )
}

export default LoadingBar
