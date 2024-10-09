'use client'

import React, { useEffect, useState } from 'react'
import './Header.css'
import Image from 'next/image'
import 'animate.css'
import { Pacifico, Roboto, Raleway, OpenSans } from './fonts'
import Link from 'next/link'
//import LoadingBar from './LoadingBar'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

const StickyHeader: React.FC = () => {
  const [isSticky, setIsSticky] = useState<boolean>(false)

  const handleScroll = () => {
    const scrollTop = window.scrollY
    // Set sticky when scrolled past 65px, and only reset when at the very top
    if (scrollTop > 74) {
      setIsSticky(true)
    } else if (scrollTop === 0) {
      setIsSticky(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <header
        className={`absolute animate__animated animate__slideInDown header ${isSticky ? 'sticky' : ''} shadow-md bg-[rgba(57,66,69,0.8)] border-t-[rgba(37,42,44,0.5)] z-[22] w-full left-0 border-b border-b-[rgba(0,0,0,0.07)] text-[#cacaca]`}
      >
        <div className="container mx-auto w-full flex justify-between items-center">
          {/* Start Logo Image & Text */}
          <div className="flex items-center">
            <img src="/images/logo2.png" className="w-[55px] h-[55px]" />
            <div className="w-[250px] ml-2">
              <div className={`text-xl ${Pacifico.className}`}>
                <h1 className="text-[#09afdf] inline">CodeBuilder</h1>&nbsp;
                <h1 className="text-white inline">Inc.</h1>
              </div>
              <div
                className={`${Roboto.className} text-shadow text-[#f1f1f1] text-[11px] font-light transition-all ease-in-out duration-300`}
              >
                Software Engineering Solutions
              </div>
            </div>
          </div>
          {/* Start Nav Menu */}
          <nav className={`${Roboto.className}}flex items-center space-x-16`}>
            <Link
              href="/"
              className={`text-shadow text-[#f1f1f1] hover:text-[#09afdf] font-medium`}
            >
              Home
            </Link>
            <Link href="/about" className={`text-shadow text-[#f1f1f1] hover:text-[#09afdf]`}>
              About
            </Link>
            <a href="#" className={`text-shadow text-[#f1f1f1] hover:text-[#09afdf]`}>
              Services
            </a>
            <a href="#" className={`text-shadow text-[#f1f1f1] hover:text-[#09afdf]`}>
              Portfolio
            </a>
            <a href="#" className={`text-shadow text-[#f1f1f1] hover:text-[#09afdf]`}>
              Contact
            </a>
            <button className="text-white bg-[rgba(0,0,0,0.2)] border border-[rgba(0,0,0,0.1)] px-[15px] py-[5px] text-[12px] leading-[1.4666667] rounded-[3px] my-[5px] transition duration-200 ease-in-out hover:bg-[rgba(0,0,0,0.3)]">
              Pay Invoice
            </button>
          </nav>
        </div>
      </header>
      {/* Loading Progress Bar for navigation */}
      <div className="flex z-50 h-[10px]" id="loadingBar">
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
