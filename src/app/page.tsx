'use client'
import Image from 'next/image'
import HeroCarousel from '../components/index/hero-carousel'
import { useState } from 'react'
import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Accordion from '../components/accordion'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faConnectdevelop } from '@fortawesome/free-brands-svg-icons'
import { Raleway } from './fonts'
import FeatureSection from '../components/index/feature-section'
import { motion, useAnimation } from 'framer-motion'
export default function Home() {
  const [activeTab, setActiveTab] = useState('flexibility')
  // Defining the custom animation duration style
  const beatAnimationStyle = {
    animationDuration: '0.5s',
  }
  const [isHovered, setIsHovered] = useState(false)
  const controlsLargeText = useAnimation()
  const controlsSmallText = useAnimation()

  const handleHoverStart = () => {
    setIsHovered(true)
    controlsLargeText.start({ scale: 0.5, opacity: 0 })
    controlsSmallText.start({ scale: 1.2, opacity: 1 })
  }

  const handleHoverEnd = () => {
    setIsHovered(false)
    controlsLargeText.start({ scale: 1, opacity: 1 })
    controlsSmallText.start({ scale: 0.5, opacity: 0 })
  }

  const clients = [
    {
      name: 'United Nations',
      image: '/images/portfolio/united_nations_logo.svg',
      description:
        'The Asia Pacific SDG Partnership is the development arm of the United Nations, serving as the primary economic and social development center for the UN in the region.',
      link: '/portfolio',
    },
    {
      name: 'SingelFöräldrar',
      image: '/images/portfolio/singelforaldrar_logo.jpg',
      description:
        'SingelFöräldrar is a Swedish dating platform designed for single parents. Its responsive interface features a Facebook-esque feed and a Tinder-esque matching system.',
      link: '/portfolio',
    },
    {
      name: 'Defense Health Agency',
      image: '/images/portfolio/dha_smooth_logo1.png',
      description:
        'The Defense Health Agency, a Combat Support Agency, provides healthcare-related services to the Department of Defense and its beneficiaries.',
      link: '/portfolio',
    },
    {
      name: 'American College of Surgeons',
      image: '/images/portfolio/acs_portfolio_badge.png',
      description:
        'The American College of Surgeons, a non-profit educational association, delivers Continuing Education services to surgeons across various professions in 39 different countries.',
      link: '/portfolio',
    },
    {
      name: 'Byt NFT Marketplace',
      image: '/images/portfolio/byt_logo2.webp',
      description: `Byt is the world's first chain agnostic NFT marketplace and NFT ecosystem providing full end-to-end services for users engaging with and interacting with the blockchain.`,
      link: '/portfolio',
    },
    {
      name: 'Dexcelerate',
      image: '/images/portfolio/dexcelerate_logo.svg',
      description:
        'SingelFöräldrar is a Swedish dating platform designed for single parents. Its responsive interface features a Facebook-esque feed and a Tinder-esque matching system.',
      link: '/portfolio',
    },
    {
      name: 'Merit Circle',
      image: '/images/portfolio/mertitcircle_logo.png',
      description:
        'The Defense Health Agency, a Combat Support Agency, provides healthcare-related services to the Department of Defense and its beneficiaries.',
      link: '/portfolio',
    },
    {
      name: 'ACS',
      image: '/images/acs_portfolio_badge.png',
      description:
        'The American College of Surgeons, a non-profit educational association, delivers Continuing Education services to surgeons across various professions in 39 different countries.',
      link: '/portfolio',
    },
  ]

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <div className="h-[650px]">
        <HeroCarousel />
      </div>

      {/* Main Content */}
      {/* <div className="z-10 w-screen items-center sm:items-start text-black">
        <div className="h-12 w-12 bg-black hidden">test</div>
      </div> */}

      <div className="flex flex-col">
        <FeatureSection />

        <section className="bg-gray-100 py-4 md:py-6">
          <div className="container mx-auto py-4 px-8 md:px-20 lg:px-32">
            <h1
              className={`mb-2 text-2xl text-[#333333] font-normal tracking-normal ${Raleway.className}`}
            >
              Enlist the Expertise of our Professional <strong>Software Engineers</strong> for your
              Project!
            </h1>
            <div className="separator-2 mb-2" />
            <p className={`${Raleway.className} text-gray-400 text-lg mb-4`}>
              Opt for our services when seeking professional software solutions; let our{' '}
              <a href="/portfolio" className="text-gray-500 underline hover:text-gray-700">
                portfolio
              </a>{' '}
              eloquently testify to the quality and expertise we bring to every project.
            </p>
            <div className="flex flex-wrap">
              {/* Accordion Section */}
              <div className="w-full md:w-1/2 pr-4">
                <Accordion />
              </div>

              {/* Tabs Section */}
              <div className="w-full md:w-1/2 pl-4">
                <ul className="flex space-x-4 border-b">
                  <li className="py-2 px-4 text-gray-700 border-b-2 border-blue-600">
                    <button>Very Flexible</button>
                  </li>
                  <li className="py-2 px-4 text-gray-700">
                    <button>Customer Support</button>
                  </li>
                </ul>
                <div className="mt-4">
                  <div>
                    <h3 className="text-lg font-semibold">Exceptional Flexibility</h3>
                    <p>
                      CodeBuilder offers highly adaptable services and pricing models designed to
                      suit your needs and budget effectively. We operate on an hourly billing
                      system, ensuring transparency and accuracy in reflecting the time invested in
                      your project.
                    </p>
                    <a
                      href="/services"
                      className="mt-2 inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800"
                    >
                      Read more
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <h1
              className={`mb-2 text-2xl text-[#333333] font-normal tracking-normal ${Raleway.className}`}
            >
              Recent Clients
            </h1>
            <div className="separator-2 mb-2" />

            <div className="relative overflow-hidden p-4">
              {/* Carousel Container */}
              <div
                className={`${Raleway.className} flex ${clients.length > 4 ? 'animate-carousel' : ''}`}
                style={
                  {
                    // width: clients.length > 4 ? `calc(200% + ${clients.length}%)` : '',
                  }
                }
              >
                {/* Render Original Cards */}
                {clients.map((client, idx) => (
                  <div
                    key={`client-${idx}`}
                    className={`shadow-1 ${Raleway.className} bg-[#fafafa] p-[15px] border-t border-b border-[#f3f3f3] rounded-[3px] flex-shrink-0 w-1/4 shadow-lg border border-gray-200 rounded-lg p-4 text-center m-2`}
                  >
                    <img src={client.image} alt={client.name} className="h-20 mx-auto" />
                    <h3 className={`text-md font-semibold`}>{client.name}</h3>
                    <p className="text-sm">{client.description}</p>
                    <a
                      href="/portfolio"
                      className="mt-2 inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800"
                    >
                      Read More
                    </a>
                  </div>
                ))}

                {/* Duplicate Cards for Infinite Scrolling */}
                {clients.map((client, idx) => (
                  <div
                    key={`client-duplicate-${idx}`}
                    className="shadow-1 flex-shrink-0 w-1/4 shadow-lg border border-gray-200 rounded-lg p-4 text-center"
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

              <style jsx>{`
                .animate-carousel {
                  animation: scroll 20s linear infinite;
                }

                @keyframes scroll {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-100%);
                  }
                }
              `}</style>
            </div>
          </div>
        </section>

        <div
          className="hidden dark-translucent-bg footer-top animated-text default-hovered"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="call-to-action text-center">
                  <div className="row">
                    <div className="col-sm-8">
                      <h2>Reach out and get in touch with us today!</h2>
                      <h2>Don't hesitate—seize the moment!</h2>
                    </div>
                    <div className="col-sm-4">
                      <p className="mt-10">
                        <a
                          href="/contact"
                          className="pjax btn btn-animated btn-lg btn-gray-transparent"
                        >
                          Contact Us
                          <i className="fa fa-envelope pl-20"></i>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <motion.div
          className="h-24 bg-blue-500 text-white flex items-center justify-center relative overflow-hidden"
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          animate={{ backgroundColor: isHovered ? '#09afdf' : '#333333' }}
          transition={{ duration: 0.2 }}
        >
          <div className="container mx-auto flex flex-wrap items-center justify-between">
            {/* Text Container */}
            <div className="w-full md:w-2/3 flex items-center justify-center relative text-center">
              {/* Large Text */}
              <motion.h1
                className={`${Raleway.className} uppercase text-3xl font-semibold whitespace-nowrap`}
                animate={{
                  opacity: isHovered ? 0 : 1,
                  scale: isHovered ? 0.5 : 1,
                }}
                initial={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Reach out and get in touch with us today!
              </motion.h1>

              {/* Smaller Text */}
              <motion.h2
                className={`${Raleway.className} uppercase absolute text-2xl font-semibold whitespace-nowrap`}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1.2 : 0.5,
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                Don't hesitate—seize the moment!
              </motion.h2>
            </div>

            {/* Contact Button */}
            <div className="w-full md:w-1/3 mt-4 md:mt-0 flex justify-center md:justify-start items-center">
              <a
                href="/contact"
                className="px-6 py-3 text-lg bg-transparent border border-gray-300 text-white hover:bg-gray-300 hover:text-black rounded transition"
              >
                Contact Us <i className="fas fa-envelope ml-2"></i>
              </a>
            </div>
          </div>
        </motion.div>

        <div className="bg-black bg-opacity-60 py-10">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center text-center text-white">
              <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-semibold">
                  Reach out and get in touch with us today!
                </h2>
                <h2 className="text-2xl font-semibold">Don't hesitate—seize the moment!</h2>
              </div>
              <div className="w-full md:w-1/3 mt-4 md:mt-0 flex justify-center items-center">
                <a
                  href="/contact"
                  className="px-6 py-3 text-lg bg-transparent border border-gray-300 text-white hover:bg-gray-300 hover:text-black rounded transition"
                >
                  Contact Us <i className="fas fa-envelope ml-2"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
