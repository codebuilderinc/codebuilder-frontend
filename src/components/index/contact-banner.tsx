import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Raleway } from 'next/font/google'
import { useInView } from 'react-intersection-observer'

const raleway = Raleway({ subsets: ['latin'] })

const ContactSection: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false)
  const [showLargeText, setShowLargeText] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })

  useEffect(() => {
    if (inView && !hasAnimated) {
      // Trigger the initial animation with a delay
      const initialAnimationTimeout = setTimeout(() => {
        setHasAnimated(true)
        setShowLargeText(false) // Switch to smaller text

        // Revert back to the larger text after 2 seconds
        const revertTimeout = setTimeout(() => {
          setShowLargeText(true)
        }, 2000)

        return () => clearTimeout(revertTimeout)
      }, 500)

      return () => clearTimeout(initialAnimationTimeout)
    }
  }, [inView, hasAnimated])

  const handleHoverStart = () => {
    setIsHovered(true)
    setShowLargeText(false) // Show smaller text on hover
  }

  const handleHoverEnd = () => {
    setIsHovered(false)
    setShowLargeText(true) // Revert to larger text when hover ends
  }

  return (
    <section ref={ref} className="">
      <motion.div
        className="h-24 text-white flex items-center justify-center relative overflow-hidden"
        initial={{
          backgroundColor: '#333333', // Initial background color
        }}
        animate={{
          backgroundColor: isHovered
            ? '#09afdf' // Hover background color
            : !showLargeText
              ? '#09afdf' // Background color for smaller text
              : '#333333', // Default background color
        }}
        transition={{ duration: 0.5 }}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      >
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          {/* Text Container */}
          <div className="w-full md:w-2/3 flex items-center justify-center relative text-center">
            {/* Large Text */}
            <motion.h1
              className={`${raleway.className} uppercase text-3xl font-semibold whitespace-nowrap`}
              animate={{
                opacity: showLargeText ? 1 : 0,
                scale: showLargeText ? 1 : 0.5,
              }}
              initial={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              Reach out and get in touch with us today!
            </motion.h1>

            {/* Smaller Text */}
            <motion.h2
              className={`${raleway.className} uppercase absolute text-2xl font-semibold whitespace-nowrap`}
              animate={{
                opacity: showLargeText ? 0 : 1,
                scale: showLargeText ? 0.5 : 1.2,
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
    </section>
  )
}

export default ContactSection
