// app/components/JobList.tsx
'use client'

import { useEffect, useState } from 'react'

interface Job {
  id: string
  title: string
  company_name: string
  location: string
  url: string
  description: string
  tags: string[]
  salary: string
  date_posted: string
  remote: boolean
  type: string
  experience: string
  company_logo: string
  apply_url: string
}

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/web3career')
        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }
        const data = await response.json()
        setJobs(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1>Job Listings</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              <h2>{job.title}</h2>
              <p>Company: {job.company_name}</p>
              <p>Location: {job.location}</p>
              <p>Type: {job.type}</p>
              <p>Experience: {job.experience}</p>
              <p>Salary: {job.salary}</p>
              <p>Posted on: {new Date(job.date_posted).toLocaleDateString()}</p>
              <p>Remote: {job.remote ? 'Yes' : 'No'}</p>
              <p>Description: {job.description}</p>
              <p>Tags: {job.tags.join(', ')}</p>
              {job.company_logo && (
                <img src={job.company_logo} alt={`${job.company_name} logo`} width="100" />
              )}
              <p>
                <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                  Apply Here
                </a>
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default JobList
