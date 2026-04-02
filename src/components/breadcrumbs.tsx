'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Separator() {
  return <div className="separator-2" aria-hidden="true" />
}

export function ActionButton({
  children,
  href,
  onClick,
  variant = 'default',
}: {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'default' | 'primary' | 'ghost'
}) {
  const className = cn(
    'inline-flex items-center gap-2 rounded-[3px] border px-4 py-2 text-[13px] leading-none transition-colors',
    variant === 'primary' && 'border-[#09afdf] bg-[#09afdf] text-white hover:bg-[#0898c3]',
    variant === 'default' && 'border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.04)] text-[#444] hover:bg-[rgba(0,0,0,0.08)]',
    variant === 'ghost' && 'border-white/30 bg-transparent text-white hover:bg-white/10'
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  )
}

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string; icon?: ReactNode }> }) {
  return (
    <div className="border-b border-[#e9eaec] bg-gradient-to-b from-[#f9f9f9] to-[#f4f6f7]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ol className="m-0 flex flex-wrap items-center gap-2 py-[14px] text-[13px] text-[#7a7a7a]">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span className="text-[#b2b2b2]">/</span> : null}
              {item.href ? (
                <Link href={item.href} className="inline-flex items-center gap-2 text-[#09afdf] hover:underline">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 text-[#808080]">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
