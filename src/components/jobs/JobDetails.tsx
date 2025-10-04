'use client'

import React from 'react'
import Link from 'next/link'
import { Prisma } from '@prisma/client'

// Type for job with relations
type JobWithRelations = Prisma.JobGetPayload<{
  include: {
    company: true
    tags: { include: { tag: true } }
    metadata: true
  }
}>

interface JobDetailsProps {
  job: JobWithRelations
}

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  const getMetadataValue = (key: string) => {
    const metadata = job.metadata.find((m) => m.name === key)
    return metadata ? metadata.value : null
  }

  const getSourceName = () => {
    return job.source || 'unknown'
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const formatJsonData = (data: any) => {
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return 'Invalid JSON data'
    }
  }

  const subreddit = getMetadataValue('subreddit')
  const sourceName = getSourceName()

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700  p-6">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-blue-100">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                clipRule="evenodd"
              />
            </svg>
            {job.company ? job.company.name : subreddit ? `r/${subreddit}` : 'No Company'}
          </span>
          {job.location && (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {job.location}
            </span>
          )}
          {job.author && (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              {job.author}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-600 mb-1">Source</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                sourceName === 'reddit'
                  ? 'bg-orange-100 text-orange-800'
                  : sourceName === 'web3career'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {sourceName}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-600 mb-1">Remote</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.isRemote === true
                  ? 'bg-green-100 text-green-800'
                  : job.isRemote === false
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {job.isRemote === true ? 'Yes' : job.isRemote === false ? 'No' : 'Unknown'}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-600 mb-1">Posted</h3>
            <p className="text-sm text-gray-800">
              {job.postedAt ? formatDate(job.postedAt) : formatDate(job.createdAt)}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-600 mb-1">Job ID</h3>
            <p className="text-sm text-gray-800">#{job.id}</p>
          </div>
        </div>

        {/* Tags */}
        {job.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {job.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
            <div
              className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        )}

        {/* Source Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Source Details</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">Source: {job.source || 'unknown'}</h4>
                  {job.externalId && (
                    <p className="text-sm text-gray-600">External ID: {job.externalId}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500">{formatDate(job.createdAt)}</span>
              </div>

              {job.url && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-600">URL: </span>
                  <Link
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm break-all"
                  >
                    {job.url}
                  </Link>
                </div>
              )}

              {job.data && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                    Raw Data
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                    {formatJsonData(job.data)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>

        {/* Metadata */}
        {job.metadata.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.metadata.map((metadata) => (
                  <div
                    key={metadata.id}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="font-medium text-gray-600 capitalize">
                      {metadata.name.replace('_', ' ')}:
                    </span>
                    <span className="text-gray-800">{metadata.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
          <Link
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            View Original Job
          </Link>

          <Link
            href="/jobs"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Jobs
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobDetails
