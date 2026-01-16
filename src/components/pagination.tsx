'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'

type PaginationItem =
  | { type: 'page'; page: number }
  | { type: 'ellipsis'; key: 'left' | 'right' }

type Props = {
  currentPage: number
  totalPages: number
  getHref?: (page: number) => string
  onPageChange?: (page: number) => void
  ariaLabel?: string
  className?: string
}

function clampPage(page: number, totalPages: number) {
  if (!Number.isFinite(page)) return 1
  if (totalPages <= 0) return 1
  return Math.min(Math.max(1, Math.trunc(page)), totalPages)
}

function getItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 0) return []
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({ type: 'page' as const, page: i + 1 }))
  }

  // Matches the behavior described in the screenshots:
  // - If pages exceed a max display limit, use ellipsis to truncate.
  // - If current page is more than 5 away from BOTH first and last, use double truncation.

  // Near the start: show 1..5, …, last
  if (currentPage <= 5) {
    return [
      ...Array.from({ length: 5 }, (_, i) => ({ type: 'page' as const, page: i + 1 })),
      { type: 'ellipsis' as const, key: 'right' },
      { type: 'page' as const, page: totalPages },
    ]
  }

  // Near the end: show first, …, last-4..last
  if (currentPage >= totalPages - 4) {
    return [
      { type: 'page' as const, page: 1 },
      { type: 'ellipsis' as const, key: 'left' },
      ...Array.from({ length: 5 }, (_, i) => ({
        type: 'page' as const,
        page: totalPages - 4 + i,
      })),
    ]
  }

  // Middle: show first, …, (current-1,current,current+1), …, last
  return [
    { type: 'page' as const, page: 1 },
    { type: 'ellipsis' as const, key: 'left' },
    { type: 'page' as const, page: currentPage - 1 },
    { type: 'page' as const, page: currentPage },
    { type: 'page' as const, page: currentPage + 1 },
    { type: 'ellipsis' as const, key: 'right' },
    { type: 'page' as const, page: totalPages },
  ]
}

export default function Pagination({
  currentPage,
  totalPages,
  getHref,
  onPageChange,
  ariaLabel = 'Pagination',
  className,
}: Props) {
  const safeTotal = Number.isFinite(totalPages) ? Math.max(0, Math.trunc(totalPages)) : 0
  const safeCurrent = clampPage(currentPage, safeTotal)

  const items = useMemo(() => getItems(safeCurrent, safeTotal), [safeCurrent, safeTotal])

  if (safeTotal <= 1) return null

  const canGoPrev = safeCurrent > 1
  const canGoNext = safeCurrent < safeTotal

  const baseButtonClass =
    'inline-flex h-9 min-w-9 items-center justify-center rounded border px-3 text-sm transition'
  const pageClass = (isActive: boolean) =>
    `${baseButtonClass} ${
      isActive
        ? 'border-blue-600 bg-white text-blue-700'
        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
    }`

  const iconButtonClass = (isDisabled: boolean) =>
    `${baseButtonClass} px-2 ${
      isDisabled
        ? 'cursor-not-allowed border-gray-200 bg-white text-gray-300'
        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
    }`

  const goToPage = (page: number) => {
    if (!onPageChange) return
    const next = clampPage(page, safeTotal)
    if (next === safeCurrent) return
    onPageChange(next)
  }

  const renderPage = (page: number) => {
    const active = page === safeCurrent

    if (getHref) {
      return (
        <Link
          key={page}
          href={getHref(page)}
          aria-current={active ? 'page' : undefined}
          className={pageClass(active)}
        >
          {page}
        </Link>
      )
    }

    return (
      <button
        key={page}
        type="button"
        aria-current={active ? 'page' : undefined}
        className={pageClass(active)}
        onClick={() => goToPage(page)}
      >
        {page}
      </button>
    )
  }

  const renderPrev = () => {
    if (getHref) {
      return (
        <Link
          href={getHref(Math.max(1, safeCurrent - 1))}
          aria-label="Previous page"
          aria-disabled={!canGoPrev}
          tabIndex={canGoPrev ? 0 : -1}
          className={iconButtonClass(!canGoPrev)}
          onClick={(e) => {
            if (!canGoPrev) e.preventDefault()
          }}
        >
          ‹
        </Link>
      )
    }

    return (
      <button
        type="button"
        aria-label="Previous page"
        disabled={!canGoPrev}
        className={iconButtonClass(!canGoPrev)}
        onClick={() => goToPage(safeCurrent - 1)}
      >
        ‹
      </button>
    )
  }

  const renderNext = () => {
    if (getHref) {
      return (
        <Link
          href={getHref(Math.min(safeTotal, safeCurrent + 1))}
          aria-label="Next page"
          aria-disabled={!canGoNext}
          tabIndex={canGoNext ? 0 : -1}
          className={iconButtonClass(!canGoNext)}
          onClick={(e) => {
            if (!canGoNext) e.preventDefault()
          }}
        >
          ›
        </Link>
      )
    }

    return (
      <button
        type="button"
        aria-label="Next page"
        disabled={!canGoNext}
        className={iconButtonClass(!canGoNext)}
        onClick={() => goToPage(safeCurrent + 1)}
      >
        ›
      </button>
    )
  }

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex items-center gap-1">
        <li>{renderPrev()}</li>
        {items.map((item) => {
          if (item.type === 'ellipsis') {
            return (
              <li
                key={item.key}
                className="inline-flex h-9 min-w-9 items-center justify-center px-2 text-gray-500"
                aria-hidden="true"
              >
                …
              </li>
            )
          }

          return <li key={item.page}>{renderPage(item.page)}</li>
        })}
        <li>{renderNext()}</li>
      </ul>
    </nav>
  )
}
