/**
 * Example: Using the pagination system with a page-based API
 * 
 * This example shows how to use the pagination hook with a traditional
 * page-based API that uses ?page=X&limit=Y parameters.
 */

'use client'

import React from 'react'
import { usePagination } from '@/lib/pagination'
import type { PaginatedResponse } from '@/lib/pagination'
import Pagination from '@/components/pagination'

type User = {
  id: number
  name: string
  email: string
}

/**
 * Fetch function for a page-based API
 */
async function fetchUsers(url: string, signal?: AbortSignal): Promise<PaginatedResponse<User>> {
  const res = await fetch(url, { signal })
  const json = await res.json()
  
  return {
    items: json.users,
    totalCount: json.total,
  }
}

export default function UsersPageExample() {
  const {
    items: users,
    paginationState,
    isInitialLoading,
  } = usePagination<User>({
    config: {
      type: 'page-based', // API expects ?page=X&limit=Y
      itemsPerPage: 20,
    },
    fetchFn: fetchUsers,
    baseUrl: 'https://api.example.com/users',
    // No pollInterval = no auto-refresh
  })

  if (isInitialLoading) {
    return <div className="p-8">Loading users...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="p-4 border rounded">
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={paginationState.currentPage}
          totalPages={paginationState.totalPages}
          getHref={(page) => `/users?page=${page}`}
        />
      </div>
    </div>
  )
}
