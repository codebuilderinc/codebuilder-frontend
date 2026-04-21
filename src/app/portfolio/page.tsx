'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import VideoPlayer from '@/components/video-player'
import PortfolioCard from '@/components/portfolio/PortfolioCard'
import PortfolioModal from '@/components/portfolio/PortfolioModal'
import ContactSection from '@/components/layout/contact-banner'
import { Raleway } from '../fonts'
import 'animate.css'

// Portfolio items data
const portfolioItems = [
  {
    id: 'sf',
    imageSrc: '/images/portfolio/sf_heart.jpg',
    imageAlt: 'SingelFöräldrar',
    title: 'SingelFöräldrar',
    description:
      'SingelFöräldrar is a Swedish dating platform for single parents. Its responsive interface includes a facebook-esque feed and a tinder-esque matching system.',
    modal: {
      title: 'SingelFöräldrar',
      imageSrc: '/images/portfolio/sf_heart.jpg',
      imageAlt: 'SingelFöräldrar.se Dating Platform',
      founded: '2015',
      clientSince: '2016',
      description:
        'We have provided and continue to provide SingelFöräldrar with comprehensive LAMP stack and DevOps support.',
      link: { href: 'https://SingelFöräldrar.se', label: 'SingelFöräldrar' },
      projects: [
        {
          title: 'Laravel Backend',
          body: 'We developed a custom Laravel backend implementation for the new dating platform on SingelFöräldrar.se.',
        },
        {
          title: 'Interface Implementation',
          body: 'We helped develop and implement a custom interface implementation using the Material Design template engine. We also helped develop and install various jQuery components.',
        },
        {
          title: 'Server Administration',
          body: 'We deployed a DevOps / Server Administration infrastructure to host beta and production versions of our custom PHP dating application.',
        },
        {
          title: 'NodeJS Chat System',
          body: 'We created a NodeJS near-real-time chat application for members of the website to speak with each other in a shared chat space.',
        },
      ],
    },
  },
  {
    id: 'dha',
    imageSrc: '/images/portfolio/dha_smooth_logo1.png',
    imageAlt: 'Defense Health Agency',
    title: 'DHA',
    description:
      'The Defense Health Agency is a Combat Support Agency that provides health care related services to the Department of Defense and its beneficiaries.',
    modal: {
      title: 'Department of Defense',
      imageSrc: '/images/portfolio/dha_smooth_logo1.png',
      imageAlt: 'Defense Health Agency Learning Management System',
      founded: '2010/2013',
      clientSince: '2010 (VHC) - 2016',
      description:
        'We provided the DHA (formerly VHC) with contract support, primarily focusing on vaccination courseware and publications.',
      projects: [
        {
          title: 'Learning Management System Development & maintenance',
          body: 'We developed and maintained custom courseware development and learning management systems for the Department of Defense and its beneficiaries.',
        },
        {
          title: 'Server Administration & DevOps',
          body: 'We deployed a DevOps / Server Administration infrastructure to host beta and production versions of our various LMS applications.',
        },
        {
          title: 'Mobile Applications',
          body: "We developed and maintained iOS and Android mobile applications for the DHA's Vaccine Toolkit Publications.",
        },
        {
          title: 'Graphic Design & Toolkit Publication',
          body: 'We assisted with graphic design and other illustrative / print services for the development of various DHA vaccine information publications.',
        },
      ],
    },
  },
  {
    id: 'acs',
    imageSrc: '/images/portfolio/acs_portfolio_badge.png',
    imageAlt: 'American College of Surgeons',
    title: 'ACS',
    description:
      'The American College of Surgeons is a non-profit educational association providing Continuing Education services to surgeons in various professions in 39 different countries.',
    modal: {
      title: 'American College of Surgeons',
      imageSrc: '/images/portfolio/acs2.png',
      imageAlt: 'American College of Surgeons Learning Management System',
      founded: '1913',
      clientSince: '2010 - 2015',
      description: "We provided Development & Support services for ACS's Bariatric and NSQIP programs.",
      projects: [
        {
          title: 'Learning Management System Development & maintenance',
          body: 'We developed and maintained custom courseware development and learning management systems for the American College of Surgeons.',
        },
        {
          title: 'Server Administration & DevOps',
          body: 'We deployed a DevOps / Server Administration infrastructure to host beta and production versions of our various LMS applications.',
        },
        {
          title: 'Statistical Analysis',
          body: 'We provided custom reports using calculus & various other database reporting and statistical analysis techniques.',
        },
      ],
    },
  },
  {
    id: 'ocba',
    imageSrc: '/images/portfolio/logo-12252.jpg',
    imageAlt: 'Orange County Bar Association',
    title: 'OCBA',
    description:
      'The Orange County Bar Association is a 3,500-member professional association providing legal resources for attorneys and community in the Orlando, FL area.',
    modal: {
      title: 'Orange County Bar Association',
      imageSrc: '/images/portfolio/logo-12252.jpg',
      imageAlt: 'Orange County Bar Association',
      founded: '1933',
      clientSince: '2010-2016',
      description:
        'We provided extensive software and DevOps support to The Orange County Bar Association and its users visiting orangecountybar.org.',
      link: { href: 'https://orangecountybar.org', label: 'orangecountybar.org' },
      projects: [
        {
          title: 'Custom Membership Management',
          body: 'We created and maintained a custom membership management platform for administrator and members of orangecountybar.org.',
        },
        {
          title: 'Custom eCommerce System',
          body: 'We helped implement a custom ecommerce and payment checkout system for membership and product purchases on orangecountybar.org. Our system also automated the delivery of digital products upon successful checkout.',
        },
        {
          title: 'Server Administration',
          body: 'We deployed a DevOps / Server Administration infrastructure to host beta and production versions of the OCBA platform.',
        },
        {
          title: 'IT Support',
          body: 'We provided on-site IT support for OCBA administrators / staff PC & Networking Devices needs.',
        },
      ],
    },
  },
  {
    id: 'cdc',
    imageSrc: '/images/portfolio/cdc.png',
    imageAlt: 'Centers for Disease Control',
    title: 'CDC',
    description:
      'The CDC\'s "You Call The Shots" is a Learning Management System that provided Web-Based Immunization Training Modules for Healthcare Professionals.',
    modal: {
      title: 'Centers for Disease Control',
      imageSrc: '/images/portfolio/cdc.png',
      imageAlt: 'Centers for Disease Control Learning Management System',
      founded: '1946',
      clientSince: '2011 - 2015',
      description: 'We provided CDC contract support dealing mainly with vaccination courseware and publications.',
      projects: [
        {
          title: 'Custom LMS Development',
          body: 'We developed and maintained custom courseware development and learning management systems for the Centers for Disease Control.',
        },
        {
          title: 'Courseware Management',
          body: 'We helped develop and implement courseware modules for use on our custom LMS system.',
        },
        {
          title: 'Statistical Analysis',
          body: 'We provided custom reports using calculus & various other database reporting and statistical analysis techniques.',
        },
      ],
    },
  },
  {
    id: 'tax',
    imageSrc: '/images/portfolio/taxcoursecentral_badge.png',
    imageAlt: 'Tax Course Central',
    title: 'Tax Course Central',
    description:
      'Tax Course Central is a Web-Based Learning Management System proving Annual Filing Season Program courses, as well as many other Tax Law updates for tax preparers.',
    modal: {
      title: 'Tax Course Central',
      imageSrc: '/images/portfolio/taxcoursecentral.png',
      imageAlt: 'Tax Course Central Learning Management System',
      founded: '2017',
      clientSince: '2017',
      description:
        'We have and continue to provide TaxCourseCentral with software, database, and DevOps support to maintain a positive experience for users of taxcoursecentral.com.',
      link: { href: 'https://taxcoursecentral.com', label: 'taxcoursecentral.com' },
      projects: [
        {
          title: 'Custom CSV Database Analysis / Export Tools',
          body: 'We provided custom reports using various other database reporting and statistical analysis techniques.',
        },
        {
          title: 'DevOps Support',
          body: 'We deployed a DevOps / Server Administration infrastructure to host beta and production versions of the TaxCourseCentral LMS platform.',
        },
      ],
    },
  },
  {
    id: 'un',
    imageSrc: '/images/portfolio/united_nations_logo.svg',
    imageAlt: 'United Nations',
    title: 'United Nations',
    description:
      'The Asia Pacific SDG Partnership is development arm of the United Nations and serves as the main economic and social development centre for the UN in the region.',
    comingSoon: true,
    modal: {
      title: 'United Nations',
      imageSrc: '/images/portfolio/united_nations_logo.svg',
      imageAlt: 'United Nations SDG Partnership',
      founded: '1945',
      clientSince: '2018',
      description: 'Additional details coming soon.',
      projects: [],
    },
  },
  {
    id: 'ddna',
    imageSrc: '/images/portfolio/logo-ddna.gif',
    imageAlt: 'Developmental Disabilities Nurses Association',
    title: 'DDNA',
    description:
      'A non-profit professional nursing organization, founded to meet the professional needs of nurses serving individuals with developmental disabilities.',
    modal: {
      title: 'Development Disabilities Nurses Association',
      imageSrc: '/images/portfolio/logo-ddna.gif',
      imageAlt: 'Developmental Disabilities Nurses Association',
      founded: '1992',
      clientSince: '2010-2015',
      description:
        'We provided Software, DevOps, and other IT support to DDNA Executive Staff & and members visiting ddna.org. We also provided on-site support for annual conferences.',
      link: { href: 'https://ddna.org', label: 'ddna.org' },
      projects: [
        {
          title: 'Custom Association Management System',
          body: 'We created and maintained a custom association & membership management platform for administrator and members of ddna.org.',
        },
        {
          title: 'LMS / Certification System',
          body: 'We developed and maintained custom courseware development and learning management systems for DDNA members.',
        },
        {
          title: 'Payment Processing Systems',
          body: 'We developed a custom payment processing system for membership and product sales on ddna.org using the authorize.net merchant processor API.',
        },
        {
          title: 'On-Site IT Support',
          body: 'We provided on-site IT support for PC & Networking Devices capabilities during the national conference for DDNA members and administrators.',
        },
      ],
    },
  },
]

export default function Portfolio() {
  const [bannerVisible, setBannerVisible] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    setBannerVisible(true)
  }, [])

  // Show toast notification (mirroring notyError from Laravel)
  const showToast = (message: string) => {
    setToastMessage(message)
    if (toastTimeoutRef.current !== null) {
      clearTimeout(toastTimeoutRef.current)
    }
    const timeoutId = window.setTimeout(() => {
      setToastMessage(null)
      toastTimeoutRef.current = null
    }, 3000)
    toastTimeoutRef.current = timeoutId
  }

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  const handleReadMore = (item: (typeof portfolioItems)[0]) => {
    if (item.comingSoon) {
      showToast('Additional Details Coming soon.')
      return
    }
    setActiveModal(item.id)
  }

  return (
    <div className={`${Raleway.className}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-[60] animate__animated animate__fadeInRight">
          <div className="bg-red-500 text-white px-5 py-3 rounded shadow-lg text-sm font-medium">{toastMessage}</div>
        </div>
      )}

      {/* Hero Banner with Video Background */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '380px' }}>
        {/* Video Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-40">
            <VideoPlayer
              mp4Src="/videos/background-video-portfolio.mp4"
              webmSrc="/videos/background-video-portfolio.webm"
              posterSrc="/videos/cover-images/background-video-portfolio-poster.jpg"
            />
          </div>
          {/* Dark translucent overlay — matches .dark-translucent-bg */}
          <div className="absolute inset-0 bg-black/50 hover:bg-black/60 transition-colors duration-300" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 flex items-center justify-center h-full py-10 pt-[calc(75px+45px)] px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1
              className={`text-white text-[28px] font-normal mb-4 drop-shadow-md ${
                bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.1s', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
            >
              Our Portfolio
            </h1>
            {/* Separator — matches .separator styling */}
            <div
              className={`w-full h-px my-5 ${bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'}`}
              style={{
                animationDelay: '0.1s',
                background:
                  'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.5) 35%, rgba(255,255,255,0.5) 70%, transparent 100%)',
              }}
            />
            <p
              className={`text-gray-200 text-base md:text-lg font-light leading-relaxed mb-6 drop-shadow-md ${
                bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.2s', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
            >
              Our Portfolio includes clients ranging from small business to enterprise level.
            </p>
            <div
              className={`${bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'}`}
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                href="/contact"
                className="inline-block px-6 py-3 border border-gray-300/60 text-white text-sm uppercase tracking-wider rounded-sm hover:bg-white/10 hover:border-white/80 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-5 px-4">
        <div className="container mx-auto max-w-[1170px]">
          <p className="text-center text-[#666] text-sm mb-2">
            The following are examples of some of the types of clients and projects we currently work with or have
            worked with in the past.
          </p>
          {/* Separator */}
          <div
            className="w-full h-px mt-1 mb-6"
            style={{
              background:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.12) 70%, transparent 100%)',
            }}
          />

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {portfolioItems.map((item, index) => (
              <PortfolioCard
                key={item.id}
                imageSrc={item.imageSrc}
                imageAlt={item.imageAlt}
                title={item.title}
                description={item.description}
                onReadMore={() => handleReadMore(item)}
                animationEffect={['fadeInLeft', 'fadeInUp', 'fadeInUp', 'fadeInRight'][index % 4]}
                animationDelay={(index % 4) * 150}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Reach Out / Contact Banner */}
      <ContactSection />

      {/* Portfolio Modals */}
      {portfolioItems.map((item) => (
        <PortfolioModal
          key={item.id}
          isOpen={activeModal === item.id}
          onClose={() => setActiveModal(null)}
          title={item.modal.title}
          imageSrc={item.modal.imageSrc}
          imageAlt={item.modal.imageAlt}
          founded={item.modal.founded}
          clientSince={item.modal.clientSince}
          description={item.modal.description}
          link={item.modal.link}
          projects={item.modal.projects}
        />
      ))}
    </div>
  )
}
