import type { PaginationParams, PaginationState, PageInfo } from './types'

/**
 * Convert page number to offset-based params
 */
export function pageToOffsetParams(page: number, itemsPerPage: number): PaginationParams {
  const skip = (page - 1) * itemsPerPage
  return {
    type: 'offset-based',
    first: itemsPerPage,
    skip,
  }
}

/**
 * Convert page number to page-based params
 */
export function pageToPageParams(page: number, itemsPerPage: number): PaginationParams {
  return {
    type: 'page-based',
    page,
    limit: itemsPerPage,
  }
}

/**
 * Build query string for pagination params
 */
export function buildPaginationQuery(params: PaginationParams): string {
  const searchParams = new URLSearchParams()

  if (params.type === 'page-based') {
    searchParams.set('page', String(params.page))
    searchParams.set('limit', String(params.limit))
  } else {
    if (params.first !== undefined) searchParams.set('first', String(params.first))
    if (params.after !== undefined) searchParams.set('after', params.after)
    if (params.last !== undefined) searchParams.set('last', String(params.last))
    if (params.before !== undefined) searchParams.set('before', params.before)
    if (params.skip !== undefined) searchParams.set('skip', String(params.skip))
  }

  return searchParams.toString()
}

/**
 * Calculate pagination state from response data
 */
export function calculatePaginationState(
  currentPage: number,
  itemsPerPage: number,
  totalItems: number,
  pageInfo?: PageInfo
): PaginationState {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

  // For offset-based pagination, use pageInfo if available
  const hasNextPage = pageInfo?.hasNextPage ?? currentPage < totalPages
  const hasPreviousPage = pageInfo?.hasPreviousPage ?? currentPage > 1

  return {
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  }
}

/**
 * Clamp page number to valid range
 */
export function clampPage(page: number, totalPages: number): number {
  if (!Number.isFinite(page)) return 1
  if (totalPages <= 0) return 1
  return Math.min(Math.max(1, Math.trunc(page)), totalPages)
}

/**
 * Parse page number from URL search params
 */
export function parsePageFromParams(searchParams: URLSearchParams, defaultPage = 1): number {
  const pageStr = searchParams.get('page')
  if (!pageStr) return defaultPage

  const page = parseInt(pageStr, 10)
  return Number.isFinite(page) && page > 0 ? page : defaultPage
}
