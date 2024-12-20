'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faConnectdevelop } from '@fortawesome/free-brands-svg-icons'
import { Raleway } from '@/app/fonts'
import 'animate.css' // Import Animate.css for the slideInDown animation

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
      iconProps: { style: { color: '#09afdf' } },
      title: 'Extremely Flexible',
      description:
        'Flexibility is the foundation of every solution we build. Whether your needs change or grow, our modular approach ensures your project is ready for what’s next. Let’s evolve together, one step at a time.',
      link: '/technology',
    },
    {
      icon: faChevronRight,
      iconProps: { className: 'group-hover:translate-x-[7px]', style: { color: '#09afdf' } },
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
    <section className="bg-gray-100 py-4 md:py-6">
      <div className="container mx-auto px-8 md:px-20 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-stretch">
          {features.map((feature, index) => (
            <div
              key={index}
              data-index={index}
              className={`feature-box transition-opacity duration-300 flex flex-col h-full justify-center rounded-lg mx-2 ${
                visibleSections.includes(index)
                  ? 'animate__animated animate__slideInDown'
                  : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`, // Add a custom delay based on the index
              }}
            >
              <div className="flex items-start">
                <span className="text-[2rem] mr-4 flex-shrink-0">
                  <FontAwesomeIcon icon={feature.icon} {...feature.iconProps} />
                </span>
                <div className="flex flex-col flex-1">
                  <h4
                    className={`${Raleway.className} text-[#333333] leading-[1.2] text-[19px] font-medium`}
                  >
                    {feature.title}
                  </h4>
                  <p className="mt-2 text-[#999999] text-[16px] font-extralight">
                    {feature.description}
                  </p>
                  <a
                    href={feature.link}
                    className="group relative inline-flex items-center text-[#777777] bg-transparent border border-[#09afdf] max-w-[133px] min-w-0 pr-11 py-[7px] px-[20px] text-sm leading-[1.4666666667] rounded-[3px] mt-4 transition-all duration-200 ease-in-out font-normal text-center whitespace-nowrap align-middle cursor-pointer select-none hover:text-white hover:bg-[#0c9ec7]"
                  >
                    <span className="z-10">Read More</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="ml-3 z-10 transform transition-transform duration-300 ease-in-out group-hover:translate-x-[7px]"
                    />
                    <span className="absolute top-0 right-0 w-[35px] h-full bg-[#0b8eb3] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 rounded-r-[3px] pointer-events-none z-0"></span>
                  </a>
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
