'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useSelectedLayoutSegment } from 'next/navigation'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useContext, useEffect, useRef } from 'react'
import { init } from '@socialgouv/matomo-next'

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL || ''
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID || ''

function usePreviousValue<T>(value: T): T | undefined {
  const prevValue = useRef<T | undefined>(undefined)

  useEffect(() => {
    prevValue.current = value
    return () => {
      prevValue.current = undefined
    }
  })

  return prevValue.current
}

function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext)
  const prevContext = usePreviousValue(context) || null

  const segment = useSelectedLayoutSegment()
  const prevSegment = usePreviousValue(segment)

  const changed = segment !== prevSegment && segment !== undefined && prevSegment !== undefined

  return (
    <LayoutRouterContext.Provider value={changed ? prevContext : context}>
      {props.children}
    </LayoutRouterContext.Provider>
  )
}

interface LayoutTransitionProps {
  children: React.ReactNode
  className?: string
  style?: React.HTMLAttributes<HTMLDivElement>['style']
  initial: React.ComponentProps<typeof motion.div>['initial']
  animate: React.ComponentProps<typeof motion.div>['animate']
  exit: React.ComponentProps<typeof motion.div>['exit']
}

export function LayoutTransition({
  children,
  className,
  style,
  initial,
  animate,
  exit,
}: LayoutTransitionProps) {
  useEffect(() => {
    init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID })
  }, [])

  const segment = useSelectedLayoutSegment()

  // Check if the segment includes "test-router-transition"
  const shouldSkipTransition = segment?.includes('test-router-transition')

  type TVariants = {
    initial: {
      x: string
      y: string
      rotateZ: number
      scale: number
      originX: string
      originY: number
    }
    animate: {
      x: number
      y: number
      rotateZ: number
      scale: number
    }
    exit: {
      originX: number
      originY: number
      x: string
      y: string
      rotateZ: number
      scale: number
      opacity: number
    }
  }

  const variants: TVariants = {
    initial: {
      x: '100vw',
      y: '-100vh',
      rotateZ: -15,
      scale: 1.5,
      originX: '100vw',
      originY: 0,
    },
    animate: {
      x: 0,
      y: 0,
      rotateZ: 0,
      scale: 1,
    },
    exit: {
      originX: 0,
      originY: 0,
      x: '-100vw',
      y: '-50vh',
      rotateZ: 15,
      scale: 1.5,
      opacity: 0,
    },
  }

  // Render children without transition if the condition is met
  if (shouldSkipTransition) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className={className}
        style={style}
        key={segment}
        {...variants}
        transition={{ duration: 0.7, ease: 'easeIn' }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  )
}
