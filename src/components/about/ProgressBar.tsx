'use client'

import { useEffect, useRef, useState } from 'react'

const BAR_COLORS = [
  { bg: 'linear-gradient(to right, #09afdf, #0bc5d4)', shadow: 'rgba(9,175,223,0.25)' },
  { bg: 'linear-gradient(to right, #0d8fb8, #09afdf)', shadow: 'rgba(13,143,184,0.25)' },
  { bg: 'linear-gradient(to right, #0bc5d4, #14d4b8)', shadow: 'rgba(11,197,212,0.25)' },
  { bg: 'linear-gradient(to right, #077da3, #0d8fb8)', shadow: 'rgba(7,125,163,0.25)' },
  { bg: 'linear-gradient(to right, #09afdf, #3dc0c8)', shadow: 'rgba(9,175,223,0.25)' },
  { bg: 'linear-gradient(to right, #14d4b8, #0bc5d4)', shadow: 'rgba(20,212,184,0.25)' },
  { bg: 'linear-gradient(135deg, #09afdf, #c8b84d22)', shadow: 'rgba(9,175,223,0.2)' },
  { bg: 'linear-gradient(135deg, #0d8fb8, #c8b84d22)', shadow: 'rgba(13,143,184,0.2)' },
]

interface ProgressBarProps {
  label: string
  percentage: number
  index?: number
}

export default function ProgressBar({ label, percentage, index = 0 }: ProgressBarProps) {
  const [width, setWidth] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const color = BAR_COLORS[index % BAR_COLORS.length]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setTimeout(() => {
            setWidth(percentage)
          }, 200)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [percentage])

  return (
    <div ref={ref} className="mb-3">
      <div className="relative h-7 bg-[#e0e0e0] rounded-sm overflow-hidden">
        <div
          className="h-full rounded-r-sm transition-all duration-800 ease-out flex items-center"
          style={{
            width: `${width}%`,
            background: color.bg,
            boxShadow: width > 0 ? `0 2px 6px ${color.shadow}` : 'none',
          }}
        >
          <span
            className={`text-white text-[11px] font-semibold pl-3 whitespace-nowrap transition-opacity duration-500 drop-shadow-sm ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}
