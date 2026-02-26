'use client'

import Image from 'next/image'
import HeroCarousel from '../components/index/hero-carousel'
import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Accordion from '../components/accordion'
import { Raleway } from './fonts'
import FeatureSection from '../components/index/feature-section'
import { motion, useAnimation } from 'motion/react'
import AutoScrollingPortfolio from '../components/index/scrolling-portfolio'
import ContactSection from '../components/index/contact-banner'
import AccordionTabsSection from '../components/index/accordion-tabs'

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

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <div className="h-[450px] md:h-[550px] relative z-10">
        <div className="preload-images"></div>
        <HeroCarousel />
      </div>

      {/* Main Content */}
      {/* <div className="z-10 w-screen items-center sm:items-start text-black">
        <div className="h-12 w-12 bg-black hidden">test</div>
      </div> */}

      <div className="flex flex-col">
        <FeatureSection />

        <AccordionTabsSection />

        <AutoScrollingPortfolio />

        <ContactSection />
      </div>
    </div>
  )
}
