'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import 'animate.css'
import { Pacifico, Roboto } from '@/app/fonts'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const StickyHeader: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const prevPathRef = useRef(pathname)
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleScroll = () => {
    const scrollTop = window.scrollY
    setIsSticky(scrollTop > 74)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setMobileMenuOpen(false)
    }
  }

  // Start loading animation on link click
  const startLoading = useCallback(() => {
    setIsLoading(true)
    setLoadingProgress(0)
    if (progressTimerRef.current) clearInterval(progressTimerRef.current)

    let progress = 0
    progressTimerRef.current = setInterval(() => {
      progress += Math.random() * 12 + 3
      if (progress >= 85) {
        progress = 85 // Stall at 85% until navigation completes
        if (progressTimerRef.current) clearInterval(progressTimerRef.current)
      }
      setLoadingProgress(progress)
    }, 100)
  }, [])

  // Complete loading animation
  const completeLoading = useCallback(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    setLoadingProgress(100)
    // Keep at 100% for a moment before hiding
    setTimeout(() => {
      setIsLoading(false)
      setLoadingProgress(0)
    }, 400)
  }, [])

  // Detect route changes
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname
      completeLoading()
    }
  }, [pathname, completeLoading])

  // Intercept link clicks to start loading bar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Ignore modified clicks, middle-click, and shift-click (these open new tabs/windows)
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      if (anchor && anchor.href) {
        // Ignore links that open in a new tab/window
        const targetAttr = anchor.getAttribute('target')
        if (targetAttr && targetAttr !== '_self') return

        const url = new URL(anchor.href, window.location.origin)
        // Only trigger for internal navigation
        if (url.origin === window.location.origin && url.pathname !== pathname) {
          startLoading()
        }
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname, startLoading])

  // Show loading bar on initial page load with minimum display time
  useEffect(() => {
    setIsLoading(true)
    setLoadingProgress(0)
    let progress = 0
    const timer = setInterval(() => {
      progress += Math.random() * 18 + 8
      if (progress >= 100) {
        progress = 100
        clearInterval(timer)
        setTimeout(() => {
          setIsLoading(false)
          setLoadingProgress(0)
        }, 300)
      }
      setLoadingProgress(progress)
    }, 80)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <header
        className={`fixed animate__animated animate__slideInDown header ${
          isSticky ? 'sticky' : ''
        } shadow-md bg-[rgba(57,66,69,0.92)] border-t-[rgba(37,42,44,0.5)] z-[22] w-full left-0 border-b border-b-[rgba(0,0,0,0.07)] text-[#cacaca]`}
      >
        <div className="container mx-auto px-8 md:px-20 lg:px-32 w-full flex justify-between items-center p-2">
          {/* Logo and Text Link to Home Page */}
          <Link href="/" className="flex items-center">
            <img src="/images/logo2.png" className="w-[55px] h-[55px]" alt="Logo" />
            <div className="w-[250px] ml-2">
              <div className={`text-xl ${Pacifico.className}`}>
                <h1 className="text-[#09afdf] inline">CodeBuilder</h1>&nbsp;
                <h1 className="text-white inline">Inc.</h1>
              </div>
              <div className={`${Roboto.className} text-shadow text-[#f1f1f1] text-[11px] font-light`}>
                Software Engineering Solutions
              </div>
            </div>
          </Link>
          {/* Desktop Nav Menu */}
          <nav className="hidden md:flex items-center space-x-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/services', label: 'Services' },
              { href: '/portfolio', label: 'Portfolio' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-shadow font-medium transition-all duration-200 ease-in-out hover:scale-105 px-4 py-3 rounded ${
                    isActive ? 'text-[#09afdf]' : 'text-[#f1f1f1] hover:text-[#09afdf]'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
            <Link href="/invoice" className="flex items-center justify-center text-white bg-[rgba(0,0,0,0.2)] border border-[rgba(0,0,0,0.1)] px-4 py-[5px] text-[12px] leading-[1.4666667] rounded-[3px] my-[5px] transition-transform duration-200 ease-in-out hover:bg-[rgba(0,0,0,0.3)] hover:scale-105 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                />
              </svg>
              Pay Invoice
            </Link>
          </nav>
          {/* Hamburger Menu */}
          <button
            ref={buttonRef}
            className="md:hidden flex flex-col items-center justify-center w-8 h-8 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <span
              className={`block w-8 h-1 bg-white rounded transition-all duration-300 ${
                mobileMenuOpen ? 'transform rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span
              className={`block w-8 h-1 bg-white rounded transition-all duration-300 my-1 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`block w-8 h-1 bg-white rounded transition-all duration-300 ${
                mobileMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </button>
        </div>
      </header>
      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-[rgba(57,66,69,0.95)] text-white transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-30`}
      >
        <nav className="flex flex-col items-start p-6 space-y-1">
          {[
            { href: '/', label: 'Home' },
            { href: '/about', label: 'About' },
            { href: '/services', label: 'Services' },
            { href: '/portfolio', label: 'Portfolio' },
            { href: '/contact', label: 'Contact' },
          ].map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={toggleMobileMenu}
                aria-current={isActive ? 'page' : undefined}
                className={`transition-all duration-200 ease-in-out hover:scale-105 w-full px-3 py-2 rounded ${
                  isActive ? 'text-[#09afdf]' : 'hover:text-[#09afdf]'
                }`}
              >
                {label}
              </Link>
            )
          })}
          <Link
            href="/invoice"
            className="text-white bg-[rgba(0,0,0,0.2)] border px-4 py-2 rounded hover:bg-[rgba(0,0,0,0.3)]"
            onClick={toggleMobileMenu}
          >
            Pay Invoice
          </Link>
        </nav>
      </div>
      {/* Loading Progress Bar — blue line under header */}
      <div
        className={`fixed left-0 w-full z-50 transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
        style={{ top: '74px', height: '3px' }}
      >
        <div
          className="h-full bg-[#09afdf] shadow-[0_0_8px_rgba(9,175,223,0.6)]"
          style={{
            width: `${loadingProgress}%`,
            transition: loadingProgress === 0 ? 'none' : 'width 0.2s ease-out',
          }}
        />
      </div>
    </>
  )
}

export default StickyHeader
