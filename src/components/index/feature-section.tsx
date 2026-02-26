'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faConnectdevelop } from '@fortawesome/free-brands-svg-icons'
import { Raleway } from '@/app/fonts'
import 'animate.css' // Import Animate.css for the slideInDown animation
import ButtonLink from '../button'
import CustomButton from '../button'

const FeatureSection = () => {
  const features = [
    {
      icon: faHeart,
      iconProps: { className: 'fa-beat', style: { color: '#09afdf' }, beatFade: true },
      title: 'Clean Code & Design',
      description:
        'Great design starts with great code. We craft clean, intuitive, and future-ready solutions that are easy to maintain and scale. With a focus on best practices, our team ensures every line of code contributes to an exceptional experience.',
      link: '/technology',
    },
    {
      icon: faConnectdevelop,
      iconProps: { style: { color: '#09afdf' }, beatFade: true },
      title: 'Extremely Flexible',
      description:
        'Flexibility is the foundation of every solution we build. Whether your needs change or grow, our modular approach ensures your project is ready for what’s next. Let’s evolve together, one step at a time.',
      link: '/technology',
    },
    {
      icon: faChevronRight,
      iconProps: {
        className: 'group-hover:translate-x-[7px]',
        style: { color: '#09afdf' },
        beatFade: true,
      },
      title: 'Cutting-Edge Technologies',
      description:
        'Harness the power of the latest technologies to stay ahead of the curve. From advanced tools to modern frameworks, we craft solutions that are innovative, scalable, and perfectly aligned with your vision. Experience the future, built for today.',
      link: '/technology',
    },
  ]

  const [visibleSections, setVisibleSections] = useState<number[]>([])

  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0', 10)
          if (entry.isIntersecting) {
            setVisibleSections((prev) => (prev.includes(index) ? prev : [...prev, index]))
          }
        })
      },
      { threshold: 0.3 }
    )
    observerRef.current = observer
    const elements = document.querySelectorAll('.feature-box')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-gray-100 py-4 md:py-8">
      <div className="container mx-auto px-8 md:px-20 lg:px-32">
        <div className="z-5 grid grid-cols-1 md:grid-cols-3 gap-2 items-stretch">
          {features.map((feature, index) => (
            <div
              key={index}
              data-index={index}
              className={`feature-box transition-opacity duration-300 flex flex-col h-full rounded-lg mx-2 ${
                visibleSections.includes(index) ? 'animate__animated animate__slideInDown' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`, // Add a custom delay based on the index
              }}
            >
              <div className="flex items-start h-full">
                <span className="text-[2rem] mr-4 flex-shrink-0">
                  <FontAwesomeIcon icon={feature.icon} {...feature.iconProps} />
                </span>
                <div className="flex flex-col flex-1 h-full">
                  <h4 className={`${Raleway.className} text-[#333333] leading-[1.2] text-[19px] font-normal`}>
                    {feature.title}
                  </h4>
                  <p className="mt-2 mb-3 text-[#999999] text-[16px] font-light flex-grow">{feature.description}</p>
                  <CustomButton
                    text="Read More"
                    link={feature.link}
                    icon={faChevronRight}
                    size="md"
                    type="animatedIconHover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
