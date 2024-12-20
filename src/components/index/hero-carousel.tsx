'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheck,
  faCode,
  faBatteryFull,
  faLock,
  faBug,
  faCubes,
  faLaptop,
} from '@fortawesome/free-solid-svg-icons'
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'

const slideTransitionVariants = (direction: 'next' | 'prev') => ({
  initial: {
    x: direction === 'next' ? '100%' : '-100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 1, ease: 'easeOut' },
  },
  exit: {
    x: direction === 'next' ? '-100%' : '100%',
    opacity: 0.4,
    transition: { duration: 1, ease: 'easeIn' },
  },
})

const staggerContainerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5,
    },
  },
}

const childVariants: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

// Updated slides data with FontAwesome icons
const slides = [
  {
    image: '/images/hero-slides/slide-1-iphone.jpg',
    title: 'Web Engineering',
    items: [
      { text: 'Responsive Design', icon: faLock },
      { text: 'Modern Frameworks', icon: faBug },
      { text: 'Scalable Solutions', icon: faCubes },
      { text: 'Cross-Platform', icon: faLaptop },
    ],
  },
  {
    image: '/images/hero-slides/slide-2-macbook.jpg',
    title: 'Powerful MacBook for your needs',
    items: [
      { text: 'High Performance', icon: faBatteryFull },
      { text: 'Long Battery Life', icon: faBatteryFull },
      { text: 'Optimized Workflow', icon: faCheck },
      { text: 'Reliable Hardware', icon: faCheck },
    ],
  },
  {
    image: '/images/hero-slides/slide-2-bitcoin.jpg',
    title: 'Embrace the world of Bitcoin',
    items: [
      { text: 'Decentralized Currency', icon: faBitcoin },
      { text: 'Global Reach', icon: faCheck },
      { text: 'Secure Transactions', icon: faCheck },
      { text: 'Innovation', icon: faBitcoin },
    ],
  },
]

const MotionDiv = motion(styled.div``)

/**
 * CarouselSlider is a React functional component that renders a carousel slider with animations.
 * It allows users to navigate through slides using "Next" and "Prev" buttons.
 *
 * @component
 *
 * @example
 * return (
 *   <CarouselSlider />
 * )
 *
 * @returns {JSX.Element} The rendered carousel slider component.
 *
 * @remarks
 * - The component uses `useState` to manage the current slide index, animation direction, animation state, and content visibility.
 * - The `useEffect` hook is used to handle the initial content visibility delay.
 * - The `AnimatePresence` and `motion.div` from Framer Motion are used for slide transition animations.
 * - The `isFirstRender` ref is used to ensure the initial content visibility delay only occurs on the first render.
 * - The `nextSlide` and `prevSlide` functions handle slide navigation and prevent navigation during animations.
 *
 * @dependencies
 * - `useState`, `useEffect`, `useRef` from React
 * - `AnimatePresence`, `motion` from Framer Motion
 * - `FontAwesomeIcon` from FontAwesome
 *
 * @param {Object} props - The component props.
 *
 * @property {Array} slides - An array of slide objects, each containing `image`, `title`, and `items`.
 * @property {string} slides[].image - The URL of the slide image.
 * @property {string} slides[].title - The title of the slide.
 * @property {Array} slides[].items - An array of items to be displayed on the slide.
 * @property {Object} slides[].items[].icon - The icon to be displayed for each item.
 * @property {string} slides[].items[].text - The text to be displayed for each item.
 */
const CarouselSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      setTimeout(() => setIsContentVisible(true), 1000)
      isFirstRender.current = false
    }
  }, [])

  const nextSlide = () => {
    if (isAnimating) return
    setDirection('next')
    setIsContentVisible(false)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setDirection('prev')
    setIsContentVisible(false)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1))
  }

  return (
    <div id="slider" className="relative z-0 bg-black">
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="z-50 absolute left-0 top-1/2 transform -translate-y-1/2 p-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      <div className="relative w-screen h-[650px] flex items-center bg-black justify-center ">
        <AnimatePresence
          initial={false}
          custom={direction}
          mode="sync"
          onExitComplete={() => setIsAnimating(false)}
        >
          <motion.div
            key={currentIndex}
            variants={slideTransitionVariants(direction)}
            initial="initial"
            animate="animate"
            exit="exit"
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsContentVisible(true)}
            className="w-screen h-full relative flex"
          >
            {/* Background Image with Pseudo-element for opacity */}
            <div
              style={{
                backgroundImage: `url(${slides[currentIndex].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
                opacity: 0.65, // Opacity applies only to the background layer
              }}
              className="absolute top-0 left-0 w-full h-full z-0"
            ></div>

            {/* Foreground Content */}
            {isContentVisible && (
              <motion.div
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
                className="relative z-10 flex flex-col container mx-auto items-start justify-center px-8 md:px-20 lg:px-32"
              >
                <div className="relative top-[-60px]">
                  <motion.h2
                    variants={childVariants}
                    className="text-white text-5xl mb-6 font-thin"
                  >
                    {slides[currentIndex].title}
                  </motion.h2>
                  <ul className="text-white list-none p-0 m-0">
                    {slides[currentIndex].items.map((item, index) => (
                      <motion.li
                        key={index}
                        variants={childVariants}
                        className="mb-4 flex items-center gap-2 text-lg"
                      >
                        <span className="bg-[#09afdf] rounded-full h-[34px] w-[34px] flex items-center justify-center">
                          <FontAwesomeIcon icon={item.icon} className="text-white" />
                        </span>
                        <span>{item.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="z-50 absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}

export default CarouselSlider
