'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'motion/react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheck,
  faBatteryFull,
  faLock,
  faBug,
  faCubes,
  faLaptop,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'
import CustomButton from '../button'

const slideTransitionVariants: Variants = {
  initial: (direction: 'next' | 'prev') => ({
    x: direction === 'next' ? '100%' : '-100%',
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
  },
  exit: (direction: 'next' | 'prev') => ({
    x: direction === 'next' ? '-100%' : '100%',
    opacity: 0,
    transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
  }),
}

const staggerContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.8,
      staggerChildren: 0.3,
    },
  },
}

const childVariants: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 1, ease: 'easeOut' } },
}

const slides = [
  {
    image: '/images/hero-slides/slide-2-macbook.webp',
    title: 'Web Engineering',
    items: [
      { text: 'Responsive Design', icon: faLock },
      { text: 'Modern Frameworks', icon: faBug },
      { text: 'Scalable Solutions', icon: faCubes },
      { text: 'Cross-Platform', icon: faLaptop },
    ],
  },
  {
    image: '/images/hero-slides/slide-1-iphone.jpg',
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

const CarouselSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isFirstRender = useRef(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isFirstRender.current) {
      setTimeout(() => setIsContentVisible(true), 1000)
      setIsLoading(false)

      isFirstRender.current = false
    }
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      const img = new Image()
      img.src = slides[currentIndex].image
      img.onload = () => {
        setIsLoading(false)
        setIsContentVisible(true)
      }
      isFirstRender.current = false
    }
  }, [])

  useEffect(() => {
    startTimer()

    return () => {
      stopTimer()
    }
  }, [currentIndex])

  const startTimer = () => {
    stopTimer() // Clear any existing timer before starting a new one
    timerRef.current = setTimeout(() => {
      handleSlideChange('next')
    }, 5000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  const handleSlideChange = (newDirection: 'next' | 'prev') => {
    if (isAnimating) return
    setDirection(newDirection)
    setIsAnimating(true)
    setIsContentVisible(false)

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        newDirection === 'next'
          ? (prevIndex + 1) % slides.length
          : prevIndex === 0
            ? slides.length - 1
            : prevIndex - 1
      )
      setIsAnimating(false)
    }, 500)
  }

  const handleManualSlideChange = (newDirection: 'next' | 'prev') => {
    stopTimer() // Stop the timer on manual change
    handleSlideChange(newDirection)
  }

  return (
    <div id="slider" className="relative z-10 bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <span className="text-white text-2xl">Loading...</span>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="relative w-screen h-[650px] flex items-center bg-black justify-center animate__animated animate__slideInRight">
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={`slide-${currentIndex}`}
                custom={direction}
                variants={slideTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-screen h-full relative flex"
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsContentVisible(true)}
              >
                <div
                  style={{
                    backgroundImage: `url(${slides[currentIndex].image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    opacity: 0.65,
                  }}
                  className="absolute top-0 left-0 w-full h-full z-0"
                ></div>

                {isContentVisible && (
                  <motion.div
                    variants={staggerContainerVariants}
                    initial="initial"
                    animate="animate"
                    className="relative z-10 flex flex-col container mx-auto items-start justify-center px-8 md:px-20 lg:px-32"
                  >
                    <motion.h2
                      variants={childVariants}
                      className="text-white text-5xl mb-6 font-light"
                    >
                      {slides[currentIndex].title}
                    </motion.h2>
                    <ul className="text-white list-none p-0 m-0">
                      {slides[currentIndex].items.map((item, index) => (
                        <motion.li
                          key={index}
                          variants={childVariants}
                          className="mb-6 flex items-center gap-2 text-2xl font-light"
                        >
                          <span className="bg-[#09afdf] rounded-full h-[45px] w-[45px] flex items-center justify-center">
                            <FontAwesomeIcon icon={item.icon} className="text-white text-[18px]" />
                          </span>
                          <span>{item.text}</span>
                        </motion.li>
                      ))}
                      <motion.li variants={childVariants} className="mt-6">
                        <CustomButton
                          text="Read More"
                          link={'/test'}
                          icon={faChevronRight}
                          size="xl"
                          textColor="#FFFFFF"
                          type="animatedIconHover"
                        />
                      </motion.li>
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="carousel-button z-50 justify-end  absolute right-0 top-1/2 transform -translate-y-1/2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-auto">
            <motion.button
              onClick={() => handleManualSlideChange('next')}
              disabled={isAnimating}
              className="flex items-center justify-end overflow-hidden h-12 text-white rounded-r-full shadow-lg"
              initial={{ width: 50 }}
              whileHover={{ width: 220 }}
              transition={{ ease: 'easeOut', duration: 0.5 }}
            >
              <motion.span
                className="whitespace-nowrap z-100 w-[150px] py-[11px] absolute"
                initial={{ x: 0, opacity: 0, right: '20px' }}
                whileHover={{ x: 0, opacity: 1, right: '0px' }}
                transition={{ ease: 'easeOut', duration: 0.1, delay: 0 }}
              >
                Web3.0 Solutions
              </motion.span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="w-5 h-5 mr-[15px] pointer-events-none"
              />
            </motion.button>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '325px',
              marginTop: '-30px',
              left: '0px',
              width: '60px',
            }}
            className="tp-leftarrow tparrows default preview2 hashoveralready hidearrows"
          >
            <div className="tp-arr-allwrapper">
              <div className="tp-arr-iwrapper">
                <div
                  className="tp-arr-imgholder"
                  style={{
                    visibility: 'inherit',
                    opacity: 1,
                    backgroundImage: 'url("/images/hero-slides/slide-2-macbook.webp")',
                  }}
                ></div>
                <div className="tp-arr-imgholder2"></div>
                <div className="tp-arr-titleholder">Mobile Applications</div>
                <div className="tp-arr-subtitleholder"></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CarouselSlider
