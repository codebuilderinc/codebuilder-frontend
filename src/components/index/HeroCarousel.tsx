// This ensures the component runs client-side
'use client';
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import 'animate.css' // Import animate.css
import './HeroCarousel.css' // Import custom CSS

interface SlideProps {
  imageClass: string;
  altText: string;
  ariaLabel: string;
}

const HeroCarousel = () => {
  const [loading, setLoading] = useState(true)
  const [currentSlider, setCurrentSlider] = useState(0)

  const [animationClasses, setAnimationClasses] = useState({
    prevSlider: 'w-0',
    currentSlider: 'currentSlider w-screen',
    nextSlider: 'w-0',
    firstSlide: 'w-0',
    lastSlide: 'w-0',
  })

  const [isAnimating, setIsAnimating] = useState(false) // Track animation state

  interface SlideProps {
    imageClass: string
    altText: string
    ariaLabel: string
  }
  const Slide = ({
    imageClass,
    altText,
    ariaLabel
  }: SlideProps) => (
    <div
      style={{
        backgroundImage: imageClass,
        height: '650px',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
      }}
      className={`w-full h-full bg-cover bg-no-repeat bg-top`}
      role="img"
      aria-label={ariaLabel}
    ></div>
  )

  const slides = [
    {
      imageClass: "url('/images/hero-slides/slide-1-iphone.jpg')",
      altText: 'Slide showing an iPhone',
    },
    {
      imageClass: "url('/images/hero-slides/slide-2-macbook.jpg')",
      altText: 'Slide showing a MacBook',
    },
    {
      imageClass: "url('/images/hero-slides/slide-2-bitcoin.jpg')",
      altText: 'Slide showing Bitcoin imagery',
    },
    {
      imageClass: "url('/images/hero-slides/slide-1-iphone.jpg')",
      altText: 'Slide showing an iPhone',
    },
    {
      imageClass: "url('/images/hero-slides/slide-2-macbook.jpg')",
      altText: 'Slide showing a MacBook',
    },
    {
      imageClass: "url('/images/hero-slides/slide-2-bitcoin.jpg')",
      altText: 'Slide showing Bitcoin imagery',
    },
  ]

  const changeSlide = (direction: 'next' | 'prev') => {
    if (isAnimating) return // Prevent new animations if one is already in progress

    setIsAnimating(true) // Set animation state to true
    let newCurrentSlider

    if (direction === 'next') {
      newCurrentSlider = (currentSlider + 1) % slides.length
      setAnimationClasses({
        prevSlider: 'w-0',
        currentSlider: 'currentSlider w-screen fadeOut shrink-animation',
        nextSlider: 'w-screen fadeIn expand-animation',
        firstSlide: `w-0 ${newCurrentSlider === 0 ? 'expand-animation' : ''}`,
        lastSlide: 'w-0',
      })
    } else {
      newCurrentSlider = (currentSlider - 1 + slides.length) % slides.length
      setAnimationClasses({
        prevSlider: 'w-screen expand-animation fadeIn',
        currentSlider: 'currentSlider w-screen fadeOut shrink-animation',
        nextSlider: 'w-0',
        firstSlide: 'w-0',
        lastSlide: `w-0 ${newCurrentSlider === slides.length - 1 ? 'expand-animation' : ''}`,
      })
    }

    setTimeout(() => {
      setCurrentSlider(newCurrentSlider)
      setIsAnimating(false) // Clear animation state after transition
      setAnimationClasses({
        prevSlider: 'w-0',
        currentSlider: 'currentSlider w-screen',
        nextSlider: 'w-0',
        firstSlide: 'w-0',
        lastSlide: 'w-0',
      })
    }, 1000) // Adjust the duration to match your animation length
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <>
      <div
        className="relative w-full h-[650px] overflow-hidden bg-black flex"
        style={{ height: '650px' }}
      >
        {/* Skeleton Loader  top: '-74px' */}
        {loading && (
          <div className="animate-pulse bg-gray-300 w-full h-full absolute top-0 left-0 flex items-center justify-center">
            <div className="loader border-t-4 border-b-4 border-gray-400 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}

        {/* Dynamically render slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${index === 0 && animationClasses.firstSlide} ${index === slides.length - 1 && animationClasses.lastSlide} ${index === currentSlider && animationClasses.currentSlider} ${index === currentSlider - 1 && animationClasses.prevSlider} ${index === currentSlider + 1 && animationClasses.nextSlider} opacity-75 bg-black`}
          >
            <Slide
              imageClass={slide.imageClass}
              altText={slide.altText}
              ariaLabel={slide.altText}
            />
          </div>
        ))}
      </div>

      <div className="flex w-full text-black z-10 items-center sm:items-start space-x-4 mt-4">
        <Link
          href="#"
          onClick={() => {
            changeSlide('prev')
            return false
          }}
        >
          Prev
        </Link>
        &mdot;
        <Link
          href="#"
          onClick={() => {
            changeSlide('next')
            return false
          }}
        >
          Next
        </Link>
      </div>
    </>
  )
}

export default HeroCarousel
