import React, { useEffect, useRef, useState } from 'react'

interface Client {
  image: string
  name: string
  description: string
}

interface PortfolioListProps {
  clients: Client[]
}

const AutoScrollingPortfolio: React.FC<PortfolioListProps> = ({ clients }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [scrolling, setScrolling] = useState(false)

  const startScrolling = () => {
    const container = containerRef.current
    if (!container || clients.length <= 4) return

    scrollIntervalRef.current = setInterval(() => {
      container.scrollBy({ left: 1, behavior: 'smooth' })

      // Restart the scroll if we've reached the end
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        container.scrollTo({ left: 0 })
      }
    }, 30)
  }

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
  }

  useEffect(() => {
    setScrolling(true)
    startScrolling()

    return () => {
      stopScrolling()
    }
  }, [clients])

  return (
    <div
      ref={containerRef}
      className="overflow-x-scroll whitespace-nowrap scrollbar-hide flex gap-4"
    >
      {clients.map((client, idx) => (
        <div
          key={`client-duplicate-${idx}`}
          className="min-w-[240px] sm:min-w-[300px] lg:min-w-[400px] shadow-lg border border-gray-200 rounded-lg p-4 text-center flex-shrink-0"
          onMouseEnter={stopScrolling}
          onMouseLeave={startScrolling}
        >
          <img src={client.image} alt={client.name} className="h-20 mx-auto" />
          <h3 className="text-lg font-semibold">{client.name}</h3>
          <p>{client.description}</p>
          <a
            href="/portfolio"
            className="mt-2 inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Read More
          </a>
        </div>
      ))}
    </div>
  )
}

export default AutoScrollingPortfolio
