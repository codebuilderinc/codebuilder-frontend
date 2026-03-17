'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import 'animate.css'

interface PortfolioCardProps {
  imageSrc: string
  imageAlt: string
  title: string
  description: string
  onReadMore: () => void
  animationEffect?: string
  animationDelay?: number
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  imageSrc,
  imageAlt,
  title,
  description,
  onReadMore,
  animationEffect = 'fadeInUp',
  animationDelay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`group border border-gray-200 rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-lg mb-5 ${
        isVisible ? `animate__animated animate__${animationEffect}` : 'opacity-0'
      }`}
      style={{ animationDelay: `${animationDelay}ms`, animationDuration: '0.6s' }}
    >
      {/* Image area */}
      <div className="flex items-center justify-center py-3 px-3 bg-white min-h-[95px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={250}
          height={75}
          className="max-h-[75px] w-auto object-contain mx-auto"
          unoptimized
        />
      </div>
      {/* Body */}
      <div className="bg-[#f8f8f8] shadow-inner px-4 py-4">
        <h3 className="text-center text-lg font-semibold text-[#333] mb-2">{title}</h3>
        {/* Separator */}
        <div
          className="w-full h-px my-3"
          style={{
            background:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.12) 70%, transparent 100%)',
          }}
        />
        <p className="text-sm text-[#666] leading-relaxed mb-4 min-h-[84px]">{description}</p>
        <div className="text-center h-[30px]">
          <button
            onClick={onReadMore}
            className="relative inline-block px-4 py-1.5 text-sm font-medium text-[#333] bg-white border border-gray-300 rounded-sm overflow-hidden transition-all duration-300 group/btn hover:text-white"
          >
            {/* Shutter hover effect */}
            <span className="absolute inset-0 bg-[#09afdf] transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-center z-0" />
            <span className="relative z-10">
              Read More
              <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-xs" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PortfolioCard
