/* ──────────────────────────────────────────────────────────────────────────────
   CarouselSlider.tsx  –  Next 15 • Tailwind • Framer-Motion
────────────────────────────────────────────────────────────────────────────── */
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheck,
  faBatteryFull,
  faLock,
  faBug,
  faCubes,
  faLaptop,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons'
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'
import CustomButton from '../button'

/* ── config ─────────────────────────────────────────────────────────────── */
const ARROW_COL = 60 // fixed arrow-column width
const BTN_COLLAPSED = ARROW_COL
const BTN_EXPANDED = 200 // fits your shortest title
const BG_COLLAPSED = 'rgba(0,0,0,0.25)'
const BG_EXPANDED = 'rgba(0,0,0,0.6)'
const OVERLAY_OPACITY = 0.35 // 35 % black over photo
const CTA_LINK = '/test'

/* slides ------------------------------------------------------------------ */
const slides = [
  {
    image: '/images/hero-slides/slide-2-macbook.avif',
    title: 'Web Engineering',
    items: [
      { text: 'Responsive Design', icon: faLock },
      { text: 'Modern Frameworks', icon: faBug },
      { text: 'Scalable Solutions', icon: faCubes },
      { text: 'Cross-Platform', icon: faLaptop },
    ],
  },
  {
    image: '/images/hero-slides/slide-1-iphone.avif',
    title: 'Mobile Applications',
    items: [
      { text: 'High Performance', icon: faBatteryFull },
      { text: 'Long Battery Life', icon: faBatteryFull },
      { text: 'Optimised Workflow', icon: faCheck },
      { text: 'Reliable Hardware', icon: faCheck },
    ],
  },
  {
    image: '/images/hero-slides/slide-2-bitcoin.avif',
    title: 'Blockchain Technology',
    items: [
      { text: 'Decentralised Currency', icon: faBitcoin },
      { text: 'Global Reach', icon: faCheck },
      { text: 'Secure Transactions', icon: faCheck },
      { text: 'Innovation', icon: faBitcoin },
    ],
  },
] as const

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
  const radius = isLeft ? 'rounded-r-2xl' : 'rounded-l-2xl'

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

  /* autoplay every 6 s */
  useEffect(() => {
    const start = () => (timer.current = setTimeout(() => move('next'), 6000))
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
      setIdx((p) =>
        d === 'next' ? (p + 1) % slides.length : (p + slides.length - 1) % slides.length
      )
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
      <div className="relative w-full h-[650px] flex items-center justify-center">
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
              className="object-cover object-top"
            />
            {/* overlay */}
            <div className="absolute inset-0 bg-black" style={{ opacity: OVERLAY_OPACITY }} />

            {/* text block */}
            {ready && (
              <motion.div
                variants={parentStagger}
                initial="initial"
                animate="animate"
                className="relative z-10 flex flex-col container mx-auto items-start justify-center
                           h-full px-8 md:px-20 lg:px-32 pt-12" /* pushes it down a touch */
              >
                <motion.h2
                  variants={childUp}
                  className="text-white text-4xl md:text-5xl font-light mb-6"
                >
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
                  {slides[idx].items.map(({ text, icon }, i) => (
                    <motion.li
                      key={i}
                      variants={childUp}
                      /* 24 px font, 35 px line-height, zero borders/margins/padding */
                      className="flex items-center font-light gap-6 text-[24px] m-0 p-0 border-0"
                      style={{
                        letterSpacing: 0,
                        transition: 'all', // matches “transition: all”
                        opacity: 0, // your starting value
                        transform: 'translate3d(0,0,0)',
                      }}
                    >
                      <span className="h-[45px] w-[45px] flex items-center justify-center rounded-full bg-[#09afdf]">
                        <FontAwesomeIcon icon={icon} className="text-white text-lg" />
                      </span>
                      {text}
                    </motion.li>
                  ))}

                  <motion.li variants={childUp}>
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
          <EdgeButton
            side="left"
            label={prevTitle}
            icon={faChevronLeft}
            click={() => move('prev')}
            disabled={busy}
          />
          <EdgeButton
            side="right"
            label={nextTitle}
            icon={faChevronRight}
            click={() => move('next')}
            disabled={busy}
          />
        </>
      )}
    </section>
  )
}
