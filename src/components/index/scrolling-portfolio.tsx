import React, { useEffect, useRef, useState } from 'react'
import { Raleway, Roboto } from '@/app/fonts'
import '@/assets/css/hover.css'
import CustomButton from '../button'
import { faArrowRight, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const AutoScrollingPortfolio: React.FC = () => {
  const clients = [
    {
      name: 'United Nations',
      image: '/images/portfolio/united_nations_logo.svg',
      description:
        'The Asia-Pacific SDG Partnership serves as the UN’s primary center for economic and social development, driving sustainable initiatives across the region.',
      link: '/portfolio',
    },
    {
      name: 'SingelFöräldrar',
      image: '/images/portfolio/singelforaldrar_logo.jpg',
      description:
        'SingelFöräldrar is a Swedish dating platform tailored for single parents, featuring a social feed akin to Facebook and a Tinder-inspired matching system.',
      link: '/portfolio',
    },
    {
      name: 'Defense Health Agency',
      image: '/images/portfolio/dha_smooth_logo1.png',
      description:
        'The Defense Health Agency is a Combat Support Agency responsible for delivering comprehensive healthcare services to the U.S. Department of Defense and its beneficiaries.',
      link: '/portfolio',
    },
    {
      name: 'American College of Surgeons',
      image: '/images/portfolio/acs_portfolio_badge.png',
      description:
        'The American College of Surgeons is a non-profit association offering Continuing Education and resources to surgeons in 39 countries worldwide.',
      link: '/portfolio',
    },
    {
      name: 'Byt NFT Marketplace',
      image: '/images/portfolio/byt_logo2.webp',
      description:
        'Byt is the first chain-agnostic NFT marketplace, delivering a complete ecosystem for seamless blockchain interactions and end-to-end NFT services.',
      link: '/portfolio',
    },
    {
      name: 'Dexcelerate',
      image: '/images/portfolio/dexcelerate_logo.svg',
      description:
        'Dexcelerate is a cutting-edge growth platform, empowering organizations to scale efficiently through innovative tools and tailored solutions.',
      link: '/portfolio',
    },
    {
      name: 'Merit Circle',
      image: '/images/portfolio/mertitcircle_logo.png',
      description:
        'Merit Circle is a decentralized autonomous organization revolutionizing the play-to-earn gaming industry by bridging blockchain gaming and cryptocurrency.',
      link: '/portfolio',
    },
  ]

  return (
    <section className="bg-gray-100 py-4 md:py-6">
      <div className="container mx-auto py-4 px-8 md:px-20 lg:px-32">
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
                className={`shadow-1 ${Roboto.className} bg-[#fafafa] p-[15px] border-t border-b flex-shrink-0 w-1/4 shadow-lg border border-gray-200 rounded-lg text-center m-2 flex flex-col`}
              >
                <img src={client.image} alt={client.name} className="h-20 mx-auto" />
                <h3 className={`${Raleway.className} text-[20px] font-light mt-4`}>
                  {client.name}
                </h3>
                <div className="separator w-full my-1"></div>
                <p className="text-[#888888] text-[13px] font-light flex-grow px-2">
                  {client.description}
                </p>

                <div className="mt-auto">
                  <CustomButton
                    text="Read More"
                    link={'/'}
                    icon={faArrowRight}
                    size="md"
                    type="animatedHover"
                  />
                </div>
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
                  className="pjax btn btn-default btn-sm btn-hvr hvr-shutter-out-horizontal margin-clear"
                >
                  Read More<i className="fa fa-arrow-right pl-10"></i>
                </a>
                <a
                  href="/portfolio"
                  className="mt-2 inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Read More2
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
  )
}

export default AutoScrollingPortfolio
