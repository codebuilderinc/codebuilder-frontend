'use client'

import React, { useEffect, useState, useRef } from 'react'
import 'animate.css'
import { Pacifico, Roboto } from './fonts'
import Link from 'next/link'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import './Header.css'

const StickyHeader: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleScroll = () => {
    const scrollTop = window.scrollY
    setIsSticky(scrollTop > 74)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  const handleClickOutside = (event: MouseEvent) => {
    // Check if click is outside the menu and hamburger button
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setMobileMenuOpen(false)
    }
  }

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
        } shadow-md bg-[rgba(57,66,69,0.8)] border-t-[rgba(37,42,44,0.5)] z-[22] w-full left-0 border-b border-b-[rgba(0,0,0,0.07)] text-[#cacaca]`}
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
              <div
                className={`${Roboto.className} text-shadow text-[#f1f1f1] text-[11px] font-light`}
              >
                Software Engineering Solutions
              </div>
            </div>
          </Link>
          {/* Desktop Nav Menu */}
          <nav className="hidden md:flex items-center space-x-16">
            <Link
              href="/"
              className="text-shadow text-[#f1f1f1] hover:text-[#09afdf] font-medium transition-transform duration-200 ease-in-out hover:scale-105"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-shadow text-[#f1f1f1] hover:text-[#09afdf] transition-transform duration-200 ease-in-out hover:scale-105"
            >
              About
            </Link>
            <Link
              href="/test-router-transition"
              className="text-shadow text-[#f1f1f1] hover:text-[#09afdf] transition-transform duration-200 ease-in-out hover:scale-105"
            >
              Services
            </Link>
            <a
              href="#"
              className="text-shadow text-[#f1f1f1] hover:text-[#09afdf] transition-transform duration-200 ease-in-out hover:scale-105"
            >
              Portfolio
            </a>
            <a
              href="#"
              className="text-shadow text-[#f1f1f1] hover:text-[#09afdf] transition-transform duration-200 ease-in-out hover:scale-105"
            >
              Contact
            </a>
            <button className="flex items-center justify-center text-white bg-[rgba(0,0,0,0.2)] border border-[rgba(0,0,0,0.1)] px-4 py-[5px] text-[12px] leading-[1.4666667] rounded-[3px] my-[5px] transition-transform duration-200 ease-in-out hover:bg-[rgba(0,0,0,0.3)] hover:scale-105 focus:outline-none">
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
            </button>
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
        <nav className="flex flex-col items-start p-6 space-y-4">
          <Link
            href="/"
            onClick={toggleMobileMenu}
            className="hover:text-[#09afdf] transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={toggleMobileMenu}
            className="hover:text-[#09afdf] transition-transform duration-200 ease-in-out hover:scale-105"
          >
            About
          </Link>
          <Link
            href="/test"
            onClick={toggleMobileMenu}
            className="hover:text-[#09afdf] transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Services
          </Link>
          <a
            href="#"
            onClick={toggleMobileMenu}
            className="hover:text-[#09afdf] transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Portfolio
          </a>
          <a
            href="#"
            onClick={toggleMobileMenu}
            className="hover:text-[#09afdf] transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Contact
          </a>
          <button
            className="text-white bg-[rgba(0,0,0,0.2)] border px-4 py-2 rounded hover:bg-[rgba(0,0,0,0.3)]"
            onClick={toggleMobileMenu}
          >
            Pay Invoice
          </button>
        </nav>
      </div>
      {/* Loading Progress Bar */}
      <div className="flex z-50 h-[1px]" id="loadingBar">
        <ProgressBar
          height="1px"
          color="#3abee5"
          options={{ showSpinner: false, parent: '#loadingBar', speed: 1000 }}
          shallowRouting
        />
      </div>
    </>
  )
}

export default StickyHeader
