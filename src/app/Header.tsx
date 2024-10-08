"use client"
import React, { useEffect, useState } from 'react';
import './Header.css';
import Image from "next/image";

const StickyHeader: React.FC = () => {
  const [isSticky, setIsSticky] = useState<boolean>(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    // Set sticky when scrolled past 65px, and only reset when at the very top
    if (scrollTop > 74) {
      setIsSticky(true);
    } else if (scrollTop === 0) {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isSticky ? 'sticky' : ''} shadow-md bg-[rgba(57,66,69,0.8)] border-t-[rgba(37,42,44,0.5)] z-[22] w-full left-0 border-b border-b-[rgba(0,0,0,0.07)] text-[#cacaca]`}>
       
       <div className="mx-auto w-full"> <img src="/images/logo2.png" className="w-[55px] h-[55px]"/>
      <h1>My Sticky Header</h1>
      </div>
    </header>
  );
};

export default StickyHeader;

