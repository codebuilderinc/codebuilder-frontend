'use client'

import { useEffect, useRef, useState } from 'react'

interface CounterProps {
  to: number
  duration?: number
  className?: string
}

export default function Counter({ to, duration = 5000, className = '' }: CounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          const startTime = performance.now()

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease-out
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.floor(eased * to)
            setCount(current)

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(to)
            }
          }

          requestAnimationFrame(animate)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}
    </span>
  )
}
