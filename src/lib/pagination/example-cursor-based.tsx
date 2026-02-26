/**
 * Example: Using the pagination system with cursor-based API
 * 
 * This example shows how to use the pagination hook with a cursor-based API
 * that uses GraphQL Relay-style cursor pagination.
 */

'use client'

import React from 'react'
import { usePagination } from '@/lib/pagination'
import type { PaginatedResponse } from '@/lib/pagination'
import Pagination from '@/components/pagination'

type Post = {
  id: string
  title: string
  content: string
  createdAt: string
}

/**
 * Fetch function for a cursor-based API
 */
async function fetchPosts(url: string, signal?: AbortSignal): Promise<PaginatedResponse<Post>> {
  const res = await fetch(url, { signal })
  const json = await res.json()
  
  return {
    items: json.edges.map((edge: any) => edge.node),
    totalCount: json.totalCount,
    pageInfo: json.pageInfo, // Include cursor info for proper navigation
  }
}

export default function PostsPageExample() {
  const {
    items: posts,
    paginationState,
    isInitialLoading,
    isRefreshing,
    refreshSecondsRemaining,
  } = usePagination<Post>({
    config: {
      type: 'offset-based', // API expects ?first=X&after=Y or ?skip=X
      itemsPerPage: 15,
    },
    fetchFn: fetchPosts,
    baseUrl: 'https://api.example.com/posts',
    pollInterval: 10000, // Refresh every 10 seconds
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        {isRefreshing && (
          <span className="text-sm text-gray-600">
            Refreshing...
          </span>
        )}
        {!isRefreshing && typeof refreshSecondsRemaining === 'number' && (
          <span className="text-sm text-gray-600">
            Next refresh in {refreshSecondsRemaining}s
          </span>
        )}
      </div>

      {isInitialLoading ? (
        <div className="py-12 text-center">Loading posts...</div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="p-6 border rounded-lg bg-white shadow-sm">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-2">{post.content}</p>
                <time className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={paginationState.currentPage}
              totalPages={paginationState.totalPages}
              getHref={(page) => `/posts?page=${page}`}
            />
          </div>
        </>
      )}
    </div>
  )
}
