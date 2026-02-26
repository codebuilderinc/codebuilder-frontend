# Pagination System

An extensible pagination system supporting both **page-based** and **offset-based (cursor)** pagination for Next.js applications.

## Features

- 🔄 **Dual Mode Support**: Works with both page-based (`page`, `limit`) and offset-based (`skip`, `first`, `after`, `before`, `last`) APIs
- 🪝 **React Hook**: Easy-to-use `usePagination` hook with built-in state management
- 🔁 **Auto-Refresh**: Optional background polling with smart refresh indicators
- 🎯 **Type-Safe**: Full TypeScript support with comprehensive types
- 📦 **Reusable**: Write once, use across multiple API endpoints and components
- 🧭 **URL-Sync**: Pagination state syncs with URL query parameters

## Usage

### Basic Example (Offset-Based Pagination)

```tsx
import { usePagination } from '@/lib/pagination'
import type { PaginatedResponse } from '@/lib/pagination'

// Define your fetch function
async function fetchJobs(url: string, signal?: AbortSignal): Promise<PaginatedResponse<Job>> {
  const res = await fetch(url, { signal })
  const json = await res.json()
  
  return {
    items: json.data.items,
    totalCount: json.data.totalCount,
    pageInfo: json.data.pageInfo, // Optional: for cursor pagination
  }
}

// Use in your component
function JobsPage() {
  const {
    items: jobs,
    paginationState,
    isInitialLoading,
    isRefreshing,
    refreshSecondsRemaining,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination({
    config: {
      type: 'offset-based', // or 'page-based'
      itemsPerPage: 10,
    },
    fetchFn: fetchJobs,
    baseUrl: 'https://api.example.com/jobs',
    pollInterval: 6000, // Optional: auto-refresh every 6 seconds
  })

  return (
    <div>
      {isInitialLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ul>
            {jobs.map((job) => (
              <li key={job.id}>{job.title}</li>
            ))}
          </ul>
          
          <Pagination
            currentPage={paginationState.currentPage}
            totalPages={paginationState.totalPages}
            getHref={(page) => `/jobs?page=${page}`}
          />
        </>
      )}
    </div>
  )
}
```

### Page-Based Pagination Example

```tsx
const { items, paginationState } = usePagination({
  config: {
    type: 'page-based', // Will use ?page=X&limit=Y
    itemsPerPage: 20,
    initialPage: 1,
  },
  fetchFn: fetchUsers,
  baseUrl: 'https://api.example.com/users',
})
```

### Without Auto-Refresh

```tsx
const { items, paginationState } = usePagination({
  config: {
    type: 'offset-based',
    itemsPerPage: 10,
  },
  fetchFn: fetchData,
  baseUrl: 'https://api.example.com/data',
  // Don't pass pollInterval
})
```

## API Reference

### `usePagination<T>(options)`

Hook for managing paginated data.

#### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `config` | `PaginationConfig` | Yes | Pagination configuration |
| `fetchFn` | `(url, signal?) => Promise<PaginatedResponse<T>>` | Yes | Function to fetch data |
| `baseUrl` | `string` | Yes | Base API endpoint URL |
| `pollInterval` | `number` | No | Auto-refresh interval in ms |
| `minRefreshDuration` | `number` | No | Minimum refresh indicator duration (default: 500ms) |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `items` | `T[]` | Current page items |
| `paginationState` | `PaginationState` | Full pagination state |
| `isInitialLoading` | `boolean` | Loading state for first load |
| `isRefreshing` | `boolean` | Background refresh state |
| `refreshSecondsRemaining` | `number \| null` | Countdown to next refresh |
| `goToPage` | `(page: number) => void` | Navigate to specific page |
| `goToNextPage` | `() => void` | Navigate to next page |
| `goToPreviousPage` | `() => void` | Navigate to previous page |

### Types

#### `PaginatedResponse<T>`

```tsx
type PaginatedResponse<T> = {
  items: T[]
  totalCount: number
  pageInfo?: PageInfo // Optional for offset-based pagination
}
```

#### `PaginationConfig`

```tsx
type PaginationConfig = {
  type: 'page-based' | 'offset-based'
  itemsPerPage: number
  initialPage?: number // Default: 1
}
```

#### `PaginationState`

```tsx
type PaginationState = {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
```

## How It Works

### Offset-Based Pagination

When `type: 'offset-based'` is configured:
- Converts page numbers to `skip` and `first` parameters
- Example: Page 2 with 10 items → `?first=10&skip=10`
- Supports cursor-based pagination with `after`, `before`, `first`, `last`

### Page-Based Pagination

When `type: 'page-based'` is configured:
- Uses traditional `page` and `limit` parameters
- Example: Page 2 with 10 items → `?page=2&limit=10`

### URL Synchronization

The hook automatically:
- Reads the current page from `?page=X` query parameter
- Updates the URL when navigating between pages
- Maintains browser history for back/forward navigation

### Background Polling

When `pollInterval` is provided:
- Fetches new data in the background at specified intervals
- Shows refresh indicators (`isRefreshing`, `refreshSecondsRemaining`)
- Only updates state if data has changed
- Gracefully handles errors (keeps existing data)

## Utility Functions

### `buildPaginationQuery(params: PaginationParams): string`

Builds query string from pagination parameters.

```tsx
import { buildPaginationQuery, pageToOffsetParams } from '@/lib/pagination'

const params = pageToOffsetParams(2, 10)
const query = buildPaginationQuery(params)
// Returns: "first=10&skip=10"
```

### `pageToOffsetParams(page: number, itemsPerPage: number): PaginationParams`

Converts page number to offset-based parameters.

### `pageToPageParams(page: number, itemsPerPage: number): PaginationParams`

Converts page number to page-based parameters.

### `parsePageFromParams(searchParams: URLSearchParams, defaultPage?: number): number`

Parses and validates page number from URL search params.

## Example: Multiple Paginated Lists

You can use the hook multiple times in the same component:

```tsx
function Dashboard() {
  const jobs = usePagination({
    config: { type: 'offset-based', itemsPerPage: 10 },
    fetchFn: fetchJobs,
    baseUrl: 'https://api.example.com/jobs',
  })

  const users = usePagination({
    config: { type: 'page-based', itemsPerPage: 20 },
    fetchFn: fetchUsers,
    baseUrl: 'https://api.example.com/users',
  })

  return (
    <div>
      <Section title="Jobs" data={jobs} />
      <Section title="Users" data={users} />
    </div>
  )
}
```

## Real-World Example

See [JobsPageClient.tsx](/src/app/jobs/JobsPageClient.tsx) for a complete implementation using offset-based pagination with auto-refresh.
