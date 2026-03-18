'use client'

import Link from 'next/link'
import VideoPlayer from '@/components/video-player'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe,
  faMobile,
  faCubes,
  faBug,
  faAngleDoubleRight,
  faEnvelope,
  faCloud,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons'
import { Raleway } from '../fonts'
import { useEffect, useState, useRef } from 'react'
import ContactSection from '@/components/layout/contact-banner'
import 'animate.css'

// Service card data
const services = [
  {
    icon: faGlobe,
    iconBg: 'default', // light blue #09afdf
    title: 'Software Engineering',
    description:
      'Harness expert-level software engineering services to bring your vision to life. From conceptualization to implementation, we build robust software from the ground up.',
    href: '/web-applications',
    delay: 100,
  },
  {
    icon: faMobile,
    iconBg: 'dark', // dark bg
    title: 'Mobile Applications',
    description:
      'Embark on a seamless journey through modernity with our cross-platform mobile applications, meticulously crafted to deliver a harmonious experience on both Android and iOS devices.',
    href: '/mobile-applications',
    delay: 200,
  },
  {
    icon: faCubes,
    iconBg: 'default',
    title: 'Blockchain Development',
    description:
      'Pioneers in Blockchain Development, Smart Contracts, and Web3 solutions crafted by our team of experts. Rest assured that your venture will seamlessly align with the forefront of decentralized technology.',
    href: '/blockchain-applications',
    delay: 300,
  },
  {
    icon: faDatabase,
    iconBg: 'dark',
    title: 'Database Architecture',
    description:
      'Elevate your data infrastructure with our expert-level database architectural design and administration services. Let us optimize and secure your data environment.',
    href: '/database-administration',
    delay: 100,
  },
  {
    icon: faCloud,
    iconBg: 'default',
    title: 'Development Operations (DevOps)',
    description:
      'Seamlessly integrate with the cloud as we navigate the landscape of top-tier providers such as Amazon Web Services, Google Cloud, and Digital Ocean.',
    href: '/server-administration',
    delay: 200,
  },
  {
    icon: faBug,
    iconBg: 'dark',
    title: 'Operational Security (OpSec)',
    description:
      'Safeguard your organization with our proficiency in Operational Security and penetration testing. Allow us to navigate and fortify your infrastructure against potential threats.',
    href: '/penetration-testing',
    delay: 300,
  },
]

/**
 * Intersection-observer hook that fires once per element.
 * Returns a ref to attach and a boolean for visibility.
 */
function useAnimateOnScroll(offset = 0.95) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 1 - offset } // ~5% visible triggers
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [offset])

  return { ref, visible }
}

/** Individual service card with waypoint animation */
function ServiceCard({ icon, iconBg, title, description, href, delay }: (typeof services)[number]) {
  const { ref, visible } = useAnimateOnScroll()
  const isDark = iconBg === 'dark'

  return (
    <div ref={ref} className="w-full sm:w-1/2 lg:w-1/3 px-5 mb-8">
      <div
        className={`text-center transition-all duration-500 ${
          visible ? 'animate__animated animate__fadeInDown opacity-100' : 'opacity-0'
        }`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Icon circle */}
        <span
          className={`inline-flex items-center justify-center w-[100px] h-[100px] rounded-full text-white text-[36px] mb-5 ${
            isDark ? 'bg-[rgba(0,0,0,0.3)]' : 'bg-[#09afdf]'
          }`}
        >
          <FontAwesomeIcon icon={icon} />
        </span>

        {/* Title */}
        <h3 className="text-[24px] font-normal text-[#333] mb-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
          {title}
        </h3>

        {/* Separator — gradient line matching original */}
        <div
          className="w-full h-px my-4"
          style={{
            background:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.12) 70%, transparent 100%)',
          }}
        />

        {/* Description */}
        <p className="text-[#999] text-[15px] leading-relaxed mb-3 font-light">{description}</p>

        {/* Read More link — dark-bg cards get dark link color */}
        <Link
          href={href}
          className={`inline-flex items-center gap-1 text-sm transition-colors duration-200 ${
            isDark ? 'text-[#333] hover:text-[#09afdf]' : 'text-[#09afdf] hover:text-[#0c9ec7]'
          }`}
        >
          Read More
          <FontAwesomeIcon icon={faAngleDoubleRight} className="text-xs ml-1" />
        </Link>
      </div>
    </div>
  )
}

export default function Services() {
  const [bannerVisible, setBannerVisible] = useState(false)

  useEffect(() => {
    setBannerVisible(true)
  }, [])

  return (
    <div className={`${Raleway.className}`}>
      {/* ── Hero Section with Video Background ── */}
      <section className="relative w-full min-h-[320px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-90">
            <VideoPlayer
              mp4Src="/videos/network-technology-services.mp4"
              posterSrc="/videos/cover-images/network-technology-services-poster.jpg"
            />
          </div>
          {/* Dark overlay — matches .dark-translucent-bg */}
          <div className="absolute inset-0 bg-black/50 hover:bg-black/60 transition-colors duration-300" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[320px] pt-[74px] px-4 py-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* "Our Services" heading */}
            <h1
              className={`text-white text-[28px] font-normal mb-4 drop-shadow-md ${
                bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'
              }`}
              style={{
                animationDelay: '0.1s',
                fontWeight: 400,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              Our Services
            </h1>

            {/* Full-width gradient separator */}
            <div
              className={`w-full h-px my-5 ${bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'}`}
              style={{
                animationDelay: '0.1s',
                background:
                  'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.5) 35%, rgba(255,255,255,0.5) 70%, transparent 100%)',
              }}
            />

            {/* Description */}
            <p
              className={`text-gray-200 text-lg font-light leading-relaxed mb-6 drop-shadow-md ${
                bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.2s', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
            >
              Unlock Innovative Solutions Across a Spectrum of Technologies
            </p>

            {/* View Technologies CTA */}
            <div
              className={`${bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'}`}
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                href="/technology"
                className="inline-block px-6 py-3 border border-gray-300/60 text-white text-sm uppercase tracking-wider rounded-sm hover:bg-white/10 hover:border-white/80 transition-all duration-300"
              >
                View Technologies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Cards Section ── */}
      <section className="py-6 px-4" style={{ paddingTop: '25px' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap -mx-5">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Call to Action Banner — "Limitless Possibilities" ── */}
      <CallToActionBanner />

      {/* ── Reach Out / Contact Banner ── */}
      <ContactSection />
    </div>
  )
}

/** CTA Banner matching the Laravel dark-translucent-bg footer-top with default-hovered */
function CallToActionBanner() {
  const { ref, visible } = useAnimateOnScroll(0.8)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      ref={ref}
      className="transition-colors duration-500"
      style={{
        backgroundColor: isHovered ? '#09afdf' : 'rgba(0,0,0,0.6)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto max-w-6xl px-4 py-5">
        <div className="flex flex-wrap items-center text-center sm:text-left">
          {/* Text */}
          <div className="w-full sm:w-2/3 mb-4 sm:mb-0">
            <h2
              className={`text-white text-[28px] uppercase font-normal mb-2 transition-opacity duration-500 ${
                visible ? 'animate__animated animate__fadeIn' : 'opacity-0'
              }`}
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Limitless Possibilities
            </h2>
            <p className="text-gray-300 text-[15px] font-light leading-relaxed">
              Explore a realm of endless possibilities as our developers skillfully craft tailored solutions to meet the
              unique software requirements of your organization.
            </p>
          </div>

          {/* Contact Us button */}
          <div className="w-full sm:w-1/3 flex justify-center sm:justify-end">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-6 py-3 border border-gray-300/60 text-white text-sm uppercase tracking-wider rounded-sm hover:bg-white/10 hover:border-white/80 transition-all duration-300"
            >
              Contact Us
              <FontAwesomeIcon icon={faEnvelope} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
