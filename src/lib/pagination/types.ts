/**
 * Pagination system types supporting both page-based and cursor/offset-based pagination
 */

/**
 * Page-based pagination params
 */
export type PageBasedParams = {
  type: 'page-based'
  page: number
  limit: number
}

/**
 * Offset-based pagination params (cursor-based)
 * Follows Relay-style cursor pagination with GraphQL conventions
 */
export type OffsetBasedParams = {
  type: 'offset-based'
  first?: number // Number of items to fetch forward from cursor
  after?: string // Cursor to fetch after (for forward pagination)
  last?: number // Number of items to fetch backward from cursor
  before?: string // Cursor to fetch before (for backward pagination)
  skip?: number // Number of items to skip (alternative to cursor)
}

/**
 * Union of all pagination param types
 */
export type PaginationParams = PageBasedParams | OffsetBasedParams

/**
 * Cursor/PageInfo returned by offset-based APIs
 */
export type PageInfo = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string | null
  endCursor?: string | null
}

/**
 * Generic paginated response structure
 */
export type PaginatedResponse<T> = {
  items: T[]
  totalCount: number
  pageInfo?: PageInfo
}

/**
 * Pagination state for UI components
 */
export type PaginationState = {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Configuration for pagination behavior
 */
export type PaginationConfig = {
  type: 'page-based' | 'offset-based'
  itemsPerPage: number
  initialPage?: number
}
