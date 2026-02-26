/* ──────────────────────────────────────────────────────────────────────────────
   CarouselSlider.tsx  –  Next 15 • Tailwind • Framer-Motion
────────────────────────────────────────────────────────────────────────────── */
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faCheck,
  faBatteryFull,
  faLock,
  faBug,
  faCubes,
  faLaptop,
  faChevronRight,
  faChevronLeft,
  faBolt,
  faGears,
  faMicrochip,
  faGlobe,
  faShieldHalved,
  faLightbulb,
  faMobile,
  faCode,
  faCloud,
  faPalette,
  faFileCode,
  faKey,
  faVault,
  faSnowflake,
} from '@fortawesome/free-solid-svg-icons'
import { faBitcoin, faEthereum, faApple, faAndroid } from '@fortawesome/free-brands-svg-icons'
import CustomButton from '../button'

/* ── config ─────────────────────────────────────────────────────────────── */
const ARROW_COL = 60 // fixed arrow-column width
const BTN_COLLAPSED = ARROW_COL
const BTN_EXPANDED = 250 // fits your shortest title
const BG_COLLAPSED = 'rgba(0,0,0,0.25)'
const BG_EXPANDED = 'rgba(0,0,0,0.6)'
const OVERLAY_OPACITY = 0.35 // 35 % black over photo
const CTA_LINK = '/test'
const CYCLE_INTERVAL = 2500 // ms between cycling sub-items
const SLIDE_AUTOPLAY = 15000 // ms between slides (longer to allow cycling)
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
const GLITCH_DURATION = 600 // ms for glitch animation
const GLITCH_ITERATIONS = 8 // number of scramble iterations

/* ── types ─────────────────────────────────────────────────────────────── */
type AnimationType = 'fade' | 'glitch'
type SubItem = { text: string; icon: IconDefinition; animation?: AnimationType }
type SlideItem = {
  text: string | string[] | SubItem[]
  icon: IconDefinition
  animation?: AnimationType
}
type Slide = {
  image: string
  title: string
  items: SlideItem[]
}

/* slides ------------------------------------------------------------------ */
const slides: Slide[] = [
  {
    image: '/images/hero-slides/slide-2-macbook.avif',
    title: 'Web Engineering',
    items: [
      { text: 'Full Stack Development', icon: faCode },
      { text: 'Responsive Layouts', icon: faLaptop },
      { text: ['Intuitive UX Design', 'Modern UI/UX', 'Pixel-Perfect Interfaces'], icon: faPalette },
      { text: ['Scalable Cloud Infrastructure', 'CI/CD Pipelines', 'Edge-Optimized Delivery'], icon: faCloud },
    ],
  },
  {
    image: '/images/hero-slides/slide-1-iphone.avif',
    title: 'Mobile Applications',
    items: [
      {
        text: [
          { text: 'iOS Development', icon: faApple },
          { text: 'Android Development', icon: faAndroid },
        ],
        icon: faMobile, // default icon
      },
      { text: 'Cross-Platform WebViews', icon: faGlobe },
      { text: 'Unified Codebase', icon: faCubes },
      { text: 'High Performance', icon: faBolt },
    ],
  },
  {
    image: '/images/hero-slides/slide-2-bitcoin.avif',
    title: 'Blockchain Technology',
    items: [
      {
        text: [
          { text: 'Smart Contracts', icon: faFileCode },
          { text: 'Solidity Development', icon: faEthereum },
        ],
        icon: faFileCode,
        animation: 'glitch' as AnimationType,
      },
      { text: ['Multi-Sig Solutions', 'Key Management'], icon: faKey, animation: 'glitch' as AnimationType },
      { text: ['Security Audits', 'Penetration Testing'], icon: faShieldHalved, animation: 'glitch' as AnimationType },
      { text: ['Cold Storage', 'Air-Gapped Wallets'], icon: faSnowflake, animation: 'glitch' as AnimationType },
    ],
  },
]

/* slide enter/exit -------------------------------------------------------- */
const slideFx: Variants = {
  initial: (d: 'next' | 'prev') => ({ x: d === 'next' ? '100%' : '-100%', opacity: 0 }),
  animate: { x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] } },
  exit: (d: 'next' | 'prev') => ({
    x: d === 'next' ? '-100%' : '100%',
    opacity: 0,
    transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
  }),
}

/* content stagger --------------------------------------------------------- */
const parentStagger: Variants = {
  animate: { transition: { staggerChildren: 0.25, delayChildren: 0.6 } },
}
const childUp: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
}

/* cycling text/icon fade variants ----------------------------------------- */
const cycleFade: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: 'easeIn' } },
}

/* ── GlitchText - matrix-style character scramble animation ─────────────── */
function GlitchText({ text, isActive }: { text: string; isActive: boolean }) {
  const [displayText, setDisplayText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)
  const prevTextRef = useRef(text)

  useEffect(() => {
    if (text === prevTextRef.current) return
    prevTextRef.current = text

    setIsGlitching(true)
    const targetText = text
    const maxLen = Math.max(displayText.length, targetText.length)
    let iteration = 0

    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split('')
          .map((char, idx) => {
            // Progressively reveal characters from left to right
            if (idx < iteration / (GLITCH_ITERATIONS / targetText.length)) {
              return char
            }
            // Scramble remaining characters
            if (char === ' ') return ' '
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          })
          .join('')
      )

      iteration++
      if (iteration >= GLITCH_ITERATIONS) {
        clearInterval(interval)
        setDisplayText(targetText)
        setIsGlitching(false)
      }
    }, GLITCH_DURATION / GLITCH_ITERATIONS)

    return () => clearInterval(interval)
  }, [text])

  return (
    <span
      className={`inline-block transition-all duration-100 ${isGlitching ? '' : ''}`}
      style={{
        textShadow: isGlitching ? '0 0 8px rgba(0, 255, 255, 0.1)' : 'none',
      }}
    >
      {displayText}
    </span>
  )
}

/* ── CyclingListItem - handles static or cycling text/icons ─────────────── */
function CyclingListItem({ item, slideIndex }: { item: SlideItem; slideIndex: number }) {
  const [cycleIdx, setCycleIdx] = useState(0)
  const { text, icon: defaultIcon, animation: itemAnimation } = item

  // Determine if we have cycling content
  const isArray = Array.isArray(text)
  const isObjectArray = isArray && typeof text[0] === 'object'
  const cycleLength = isArray ? text.length : 1

  // Reset cycle index when slide changes
  useEffect(() => {
    setCycleIdx(0)
  }, [slideIndex])

  // Cycle through sub-items
  useEffect(() => {
    if (!isArray || cycleLength <= 1) return

    const interval = setInterval(() => {
      setCycleIdx((prev) => (prev + 1) % cycleLength)
    }, CYCLE_INTERVAL)

    return () => clearInterval(interval)
  }, [isArray, cycleLength])

  // Get current text, icon, and animation type
  const getCurrentContent = useCallback((): {
    text: string
    icon: IconDefinition
    animation: AnimationType
  } => {
    if (!isArray) {
      return { text: text as string, icon: defaultIcon, animation: itemAnimation || 'fade' }
    }

    if (isObjectArray) {
      const subItem = (text as SubItem[])[cycleIdx]
      return {
        text: subItem.text,
        icon: subItem.icon,
        animation: subItem.animation || itemAnimation || 'fade',
      }
    }

    return {
      text: (text as string[])[cycleIdx],
      icon: defaultIcon,
      animation: itemAnimation || 'fade',
    }
  }, [text, defaultIcon, isArray, isObjectArray, cycleIdx, itemAnimation])

  const current = getCurrentContent()
  const shouldCycleIcon = isObjectArray
  const useGlitch = current.animation === 'glitch'

  return (
    <>
      <span className="h-[36px] w-[36px] min-w-[36px] min-h-[36px] md:h-[45px] md:w-[45px] md:min-w-[45px] md:min-h-[45px] flex-shrink-0 flex items-center justify-center rounded-full bg-[#09afdf] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={shouldCycleIcon ? `icon-${cycleIdx}` : 'static-icon'}
            variants={shouldCycleIcon ? cycleFade : undefined}
            initial={shouldCycleIcon ? 'initial' : false}
            animate={shouldCycleIcon ? 'animate' : undefined}
            exit={shouldCycleIcon ? 'exit' : undefined}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={current.icon} className="text-white text-sm md:text-lg" />
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="ml-2 relative inline-block min-w-[150px] md:min-w-[200px]">
        {useGlitch && isArray ? (
          <GlitchText text={current.text} isActive={true} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.span
              key={isArray ? `text-${cycleIdx}` : 'static-text'}
              variants={isArray ? cycleFade : undefined}
              initial={isArray ? 'initial' : false}
              animate={isArray ? 'animate' : undefined}
              exit={isArray ? 'exit' : undefined}
              className="inline-block"
            >
              {current.text}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
    </>
  )
}

/* reusable edge button ---------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*  Edge button – final layout (grid, zero gap)                               */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*  Edge button – arrow outermost, label snug                                 */
/* -------------------------------------------------------------------------- */
function EdgeButton({
  side,
  label,
  icon,
  click,
  disabled,
}: {
  side: 'left' | 'right'
  label: string
  icon: any
  click: () => void
  disabled: boolean
}) {
  const [hover, setHover] = useState(false)
  const isLeft = side === 'left'

  /* rounded but not too round */
  const radius = isLeft ? 'rounded-r-lg' : 'rounded-l-lg'

  return (
    <motion.button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={click}
      disabled={disabled}
      initial={false}
      animate={{
        width: hover ? BTN_EXPANDED : BTN_COLLAPSED,
        backgroundColor: hover ? BG_EXPANDED : BG_COLLAPSED,
      }}
      transition={{ type: 'tween', duration: 0.25 }}
      className={`absolute top-1/2 -translate-y-1/2 h-16 flex items-center
                  ${isLeft ? 'left-0 flex-row' : 'right-0 flex-row-reverse'}
                  ${radius} shadow-lg text-white cursor-pointer select-none`}
      style={{ backdropFilter: 'blur(2px)' }}
    >
      {/* Arrow – fixed 60 px cell, always centred */}
      <span className="flex items-center justify-center" style={{ width: ARROW_COL }}>
        <FontAwesomeIcon icon={icon} className="w-10 h-10" />
      </span>

      {/* Label – width animates; slides toward arrow */}
      <motion.span
        style={{ overflow: 'hidden' }}
        initial={false}
        animate={{
          width: hover ? BTN_EXPANDED - ARROW_COL : 0, // 140 px or 0
          opacity: hover ? 1 : 0,
          x: hover ? 0 : isLeft ? 12 : -12, // 12 px = tighter gap
        }}
        transition={{ type: 'tween', duration: 0.25 }}
        className={`${isLeft ? 'pl-[2px] text-left' : 'pr-[2px] text-right'}
                    whitespace-nowrap font-light text-sm md:text-base`}
      >
        {label}
      </motion.span>
    </motion.button>
  )
}

/* main component ---------------------------------------------------------- */
export default function CarouselSlider() {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState<'next' | 'prev'>('next')
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)
  const [showBtns, setShowBtns] = useState(false)
  const timer = useRef<NodeJS.Timeout | null>(null)

  /* preload first image (SSR-safe) */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const img = new window.Image()
      img.src = slides[0].image
      img.onload = () => setReady(true)
    }
  }, [])

  /* autoplay slides */
  useEffect(() => {
    const start = () => (timer.current = setTimeout(() => move('next'), SLIDE_AUTOPLAY))
    const stop = () => timer.current && clearTimeout(timer.current)
    stop()
    start()
    return stop
  }, [idx])

  const move = (d: 'next' | 'prev') => {
    if (busy) return
    setDir(d)
    setBusy(true)
    setReady(false)
    setTimeout(() => {
      setIdx((p) => (d === 'next' ? (p + 1) % slides.length : (p + slides.length - 1) % slides.length))
      setBusy(false)
    }, 500)
  }

  /* shorthand titles */
  const nextTitle = slides[(idx + 1) % slides.length].title
  const prevTitle = slides[(idx + slides.length - 1) % slides.length].title

  return (
    <section
      className="relative bg-black overflow-hidden"
      onMouseEnter={() => setShowBtns(true)}
      onMouseLeave={() => setShowBtns(false)}
    >
      {/* slides --------------------------------------------- */}
      <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={dir} onExitComplete={() => setBusy(false)}>
          <motion.div
            key={idx}
            custom={dir}
            variants={slideFx}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
            onAnimationComplete={() => setReady(true)}
          >
            {/* background img */}
            <Image
              src={slides[idx].image}
              alt={slides[idx].title}
              quality={100}
              fill
              priority
              className="object-cover object-top blur-[1.5px]"
            />
            {/* overlay */}
            <div className="absolute inset-0 bg-black" style={{ opacity: OVERLAY_OPACITY }} />

            {/* text block */}
            {ready && (
              <motion.div
                variants={parentStagger}
                initial="initial"
                animate="animate"
                className="relative z-10 flex flex-col container mx-auto items-start justify-start h-full px-4 md:px-20 lg:px-32 pt-26 md:pt-28"
              >
                <motion.h2 variants={childUp} className="text-white text-3xl md:text-[42px] font-light mb-4">
                  {slides[idx].title}
                </motion.h2>

                <ul
                  /* outer UL adopts the zero-spacing / positioning */
                  className="text-white m-0 p-0 list-none"
                  /* everything else is already animated by Framer Motion */
                  style={{
                    userSelect: 'text',
                    minHeight: 0,
                    minWidth: 0,
                  }}
                >
                  {slides[idx].items.map((item, i) => (
                    <motion.li
                      key={i}
                      variants={childUp}
                      /* responsive font: 18px mobile, 24px desktop */
                      className="flex items-center font-light text-[18px] md:text-[24px] m-0 p-0 border-0 py-1 md:py-2"
                      style={{
                        letterSpacing: 0,
                        transition: 'all',
                        opacity: 0,
                        transform: 'translate3d(0,0,0)',
                      }}
                    >
                      <CyclingListItem item={item} slideIndex={idx} />
                    </motion.li>
                  ))}

                  <motion.li variants={childUp} className="mt-4">
                    <CustomButton
                      text="Read More"
                      link={CTA_LINK}
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

      {/* edge buttons --------------------------------------- */}
      {showBtns && (
        <>
          <EdgeButton side="left" label={prevTitle} icon={faChevronLeft} click={() => move('prev')} disabled={busy} />
          <EdgeButton side="right" label={nextTitle} icon={faChevronRight} click={() => move('next')} disabled={busy} />
        </>
      )}
    </section>
  )
}
