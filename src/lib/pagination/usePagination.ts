import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { PaginatedResponse, PaginationConfig, PaginationState } from './types'
import {
  buildPaginationQuery,
  calculatePaginationState,
  clampPage,
  pageToOffsetParams,
  pageToPageParams,
  parsePageFromParams,
} from './utils'

/**
 * Options for pagination hook
 */
type UsePaginationOptions<T> = {
  /** Pagination configuration */
  config: PaginationConfig
  /** Fetch function that takes a URL and returns paginated data */
  fetchFn: (url: string, signal?: AbortSignal) => Promise<PaginatedResponse<T>>
  /** Base URL for API endpoint */
  baseUrl: string
  /** Poll interval in milliseconds (optional) */
  pollInterval?: number
  /** Minimum refresh indicator duration in ms */
  minRefreshDuration?: number
}

/**
 * Return type for pagination hook
 */
type UsePaginationReturn<T> = {
  /** Current page items */
  items: T[]
  /** Pagination state */
  paginationState: PaginationState
  /** Is initial loading */
  isInitialLoading: boolean
  /** Is refreshing (background update) */
  isRefreshing: boolean
  /** Seconds until next refresh */
  refreshSecondsRemaining: number | null
  /** Navigate to specific page */
  goToPage: (page: number) => void
  /** Navigate to next page */
  goToNextPage: () => void
  /** Navigate to previous page */
  goToPreviousPage: () => void
}

/**
 * Extensible pagination hook supporting both page-based and offset-based pagination
 *
 * @example
 * ```tsx
 * const { items, paginationState, isInitialLoading } = usePagination({
 *   config: { type: 'offset-based', itemsPerPage: 10 },
 *   fetchFn: fetchJobs,
 *   baseUrl: 'https://api.example.com/jobs',
 *   pollInterval: 6000,
 * })
 * ```
 */
export function usePagination<T>({
  config,
  fetchFn,
  baseUrl,
  pollInterval,
  minRefreshDuration = 500,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [items, setItems] = useState<T[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageInfo, setPageInfo] = useState<PaginatedResponse<T>['pageInfo']>()
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshSecondsRemaining, setRefreshSecondsRemaining] = useState<number | null>(null)

  const refreshInFlightRef = useRef(false)
  const nextRefreshAtRef = useRef<number>(0)
  const didInitialLoadRef = useRef(false)

  // Parse current page from URL
  const currentPage = useMemo(() => {
    const page = parsePageFromParams(searchParams, config.initialPage ?? 1)
    return clampPage(page, Math.ceil(totalCount / config.itemsPerPage) || 1)
  }, [searchParams, config.initialPage, totalCount, config.itemsPerPage])

  // Build fetch URL based on pagination type
  const buildFetchUrl = useCallback(
    (page: number): string => {
      const params =
        config.type === 'page-based'
          ? pageToPageParams(page, config.itemsPerPage)
          : pageToOffsetParams(page, config.itemsPerPage)

      const queryString = buildPaginationQuery(params)
      return `${baseUrl}?${queryString}`
    },
    [baseUrl, config.type, config.itemsPerPage]
  )

  // Calculate pagination state
  const paginationState = useMemo(
    () => calculatePaginationState(currentPage, config.itemsPerPage, totalCount, pageInfo),
    [currentPage, config.itemsPerPage, totalCount, pageInfo]
  )

  // Navigation functions
  const goToPage = useCallback(
    (page: number) => {
      const clampedPage = clampPage(page, paginationState.totalPages)
      const url = new URL(window.location.href)
      url.searchParams.set('page', String(clampedPage))
      router.push(url.pathname + url.search)
    },
    [router, paginationState.totalPages]
  )

  const goToNextPage = useCallback(() => {
    if (paginationState.hasNextPage) {
      goToPage(currentPage + 1)
    }
  }, [currentPage, paginationState.hasNextPage, goToPage])

  const goToPreviousPage = useCallback(() => {
    if (paginationState.hasPreviousPage) {
      goToPage(currentPage - 1)
    }
  }, [currentPage, paginationState.hasPreviousPage, goToPage])

  // Fetch data for current page
  useEffect(() => {
    const controller = new AbortController()
    const isFirstEverLoad = !didInitialLoadRef.current

    if (isFirstEverLoad) {
      setIsInitialLoading(true)
    }

    const url = buildFetchUrl(currentPage)

    fetchFn(url, controller.signal)
      .then((response) => {
        setItems(response.items)
        setTotalCount(response.totalCount)
        setPageInfo(response.pageInfo)
      })
      .catch((error) => {
        // Only handle non-abort errors
        if (error.name !== 'AbortError') {
          setItems([])
          setTotalCount(0)
          setPageInfo(undefined)
        }
      })
      .finally(() => {
        didInitialLoadRef.current = true
        setIsInitialLoading(false)
      })

    return () => controller.abort()
  }, [currentPage, buildFetchUrl, fetchFn])

  // Background polling (if enabled)
  useEffect(() => {
    if (!pollInterval || isInitialLoading) return

    let isUnmounted = false
    const controller = new AbortController()
    let clearRefreshingTimeoutId: number | null = null

    const tick = async () => {
      if (refreshInFlightRef.current) return

      refreshInFlightRef.current = true
      setIsRefreshing(true)
      const startedAt = Date.now()

      try {
        const url = buildFetchUrl(currentPage)
        const response = await fetchFn(url, controller.signal)

        if (!isUnmounted) {
          // Only update if data changed
          const itemsChanged = JSON.stringify(response.items) !== JSON.stringify(items)
          const countChanged = response.totalCount !== totalCount

          if (itemsChanged || countChanged) {
            setItems(response.items)
            setTotalCount(response.totalCount)
            setPageInfo(response.pageInfo)
          }
        }
      } catch (error) {
        // Keep existing data on refresh failure
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Background refresh failed:', error)
        }
      } finally {
        refreshInFlightRef.current = false

        if (!isUnmounted) {
          const elapsed = Date.now() - startedAt
          const remaining = Math.max(0, minRefreshDuration - elapsed)

          if (clearRefreshingTimeoutId !== null) {
            window.clearTimeout(clearRefreshingTimeoutId)
          }

          clearRefreshingTimeoutId = window.setTimeout(() => {
            if (!isUnmounted) setIsRefreshing(false)
          }, remaining)
        }

        nextRefreshAtRef.current = Date.now() + pollInterval
      }
    }

    // Set initial next refresh time
    nextRefreshAtRef.current = Date.now() + pollInterval

    // Countdown timer
    const countdownId = window.setInterval(() => {
      const nextAt = nextRefreshAtRef.current
      if (!nextAt) {
        setRefreshSecondsRemaining(null)
        return
      }
      const seconds = Math.max(0, Math.ceil((nextAt - Date.now()) / 1000))
      setRefreshSecondsRemaining(seconds)
    }, 250)

    // Do initial refresh and start interval
    void tick()
    const intervalId = window.setInterval(tick, pollInterval)

    return () => {
      isUnmounted = true
      controller.abort()
      window.clearInterval(intervalId)
      window.clearInterval(countdownId)

      if (clearRefreshingTimeoutId !== null) {
        window.clearTimeout(clearRefreshingTimeoutId)
      }
    }
  }, [
    currentPage,
    buildFetchUrl,
    fetchFn,
    isInitialLoading,
    pollInterval,
    minRefreshDuration,
    items,
    totalCount,
  ])

  return {
    items,
    paginationState,
    isInitialLoading,
    isRefreshing,
    refreshSecondsRemaining,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  }
}
