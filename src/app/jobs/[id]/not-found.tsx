import Link from 'next/link'

export default function JobNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Job Not Found</h2>
          <p className="text-gray-600">
            The job you're looking for doesn't exist or has been removed.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/jobs"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            View All Jobs
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>or</p>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
