// src/app/500/page.tsx
export default function ServerError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">500 - Server Error</h1>
      <p className="mt-4 text-lg">Oops! Something went wrong on our end. Please try again later.</p>
      <a href="/" className="mt-6 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
        Return to Home
      </a>
    </div>
  )
}
