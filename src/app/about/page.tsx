'use client'

import Image from 'next/image'
import Link from 'next/link'
import VideoPlayer from '@/components/video-player'
import TeamMember from '@/components/about/TeamMember'
import Counter from '@/components/about/Counter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faDiamond, faUsers, faMoneyBill, faCode } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin, faDiscord } from '@fortawesome/free-brands-svg-icons'
import { Roboto, Raleway, Pacifico } from '../fonts'
import { useEffect, useState } from 'react'
import ContactSection from '@/components/layout/contact-banner'
import 'animate.css'

// Team members data
const teamMembers = [
  {
    name: 'Andrew Corbin',
    title: 'Software Engineer (CEO)',
    bio: 'Andrew, fueled by 16 years of unwavering passion and professionalism in the software industry, founded CodeBuilder Inc. in 2017. Drawing from a wealth of technical expertise and business experiences, Andrew established CodeBuilder Inc. as a testament to his commitment to delivering innovative and impactful solutions.',
    imageSrc: '/images/staff/corbin.jpg',
    imageAlt: 'Andrew Corbin',
    skills: [
      { label: 'Software Engineering', percentage: 95 },
      { label: 'Server Administration (DevOps)', percentage: 92 },
      { label: 'Database Engineering', percentage: 88 },
      { label: 'Operational Security (OpSec)', percentage: 85 },
      { label: 'Frontend Engineering', percentage: 78 },
      { label: 'Blockchain Development / Web3 / DApps', percentage: 82 },
      { label: 'Smart Contracts (Solidity)', percentage: 72 },
    ],
    contactLinks: [
      { icon: 'envelope', label: 'Email', href: 'mailto:andrew@codebuilder.us' },
      { icon: 'github', label: 'GitHub', href: 'https://github.com/digitalnomad91' },
      { icon: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/digitalnomad91' },
      { icon: 'discord', label: 'Discord', href: 'https://discord.com/users/542088220117303316' },
    ],
  },
  {
    name: 'Kevin Castiglia',
    title: 'Software Engineer (Co-Founder)',
    bio: 'Kevin, a seasoned software engineer with a keen interest in infrastructure, brings a wealth of experience from his tenure with several tech startups. Driven by a desire to chart his own course, he has now embarked on the journey of launching his own venture.',
    imageSrc: '/images/staff/kevin.png',
    imageAlt: 'Kevin Castiglia',
    skills: [
      { label: 'Software Engineering', percentage: 88 },
      { label: 'DevOps', percentage: 84 },
      { label: 'Python', percentage: 91 },
      { label: 'Virtualization / Docker Containers', percentage: 72 },
      { label: 'Build/Test Automation', percentage: 68 },
      { label: 'Database Administration', percentage: 65 },
    ],
    contactLinks: [
      { icon: 'phone', label: 'Call', href: 'tel:+18453638331' },
      { icon: 'envelope', label: 'Email', href: 'mailto:kevin@codebuilder.us' },
    ],
  },
  {
    name: 'Larry Goodrie',
    title: 'System Analyst Specialist',
    bio: 'With 23 years of extensive experience, Larry Goodrie excels in designing and supporting both hardware infrastructure and software requirements.',
    imageSrc: '/images/staff/larrygoodrie.jpg',
    imageAlt: 'Larry Goodrie',
    skills: [
      { label: 'C++', percentage: 85 },
      { label: 'PHP', percentage: 78 },
      { label: 'JavaScript (ES7)', percentage: 82 },
      { label: 'Linux / Bash', percentage: 74 },
    ],
    contactLinks: [{ icon: 'envelope', label: 'Email', href: 'mailto:larrygoodrie@gmail.com' }],
  },
  {
    name: 'Tom Johnson',
    title: 'Software Engineer',
    bio: 'Tom is a software engineer with a passion for open source, optimisation and clean code. Having worked with many programming languages from a young age, joining CodeBuilder was a natural progression.',
    imageSrc: '/images/staff/tom.jpg',
    imageAlt: 'Tom Johnson',
    skills: [
      { label: 'C++', percentage: 82 },
      { label: 'PHP', percentage: 76 },
      { label: 'JavaScript (ES7)', percentage: 88 },
      { label: 'Linux / Bash', percentage: 70 },
    ],
    contactLinks: [{ icon: 'envelope', label: 'Email', href: 'mailto:tom@codebuilder.us' }],
  },
]

// Stats data
const stats = [
  { icon: faDiamond, label: 'Projects', value: 487, speed: 5000 },
  { icon: faUsers, label: 'Clients', value: 134, speed: 5000 },
  { icon: faMoneyBill, label: 'Invoices', value: 275, speed: 5000 },
  { icon: faCode, label: 'Lines of Code', value: 100000, speed: 60000 },
]

// Client logos
const clients = [
  {
    src: '/images/portfolio/singelforaldrar_logo.jpg',
    alt: 'SingelFöräldrar',
    title: 'SingelFöräldrar.se',
  },
  {
    src: '/images/portfolio/dha_smooth_logo1.png',
    alt: 'Defense Health Agency',
    title: 'Defense Health Agency',
  },
  {
    src: '/images/portfolio/logo-12252.jpg',
    alt: 'Orange County Bar Association',
    title: 'Orange County Bar Association',
  },
  {
    src: '/images/portfolio/cdc.png',
    alt: 'Centers for Disease Control',
    title: 'Centers for Disease Control',
  },
  {
    src: '/images/portfolio/taxcoursecentral_badge.png',
    alt: 'Tax Course Central',
    title: 'Tax Course Central',
  },
  {
    src: '/images/portfolio/pifm.png',
    alt: 'Park it for Me',
    title: 'Park It For Me',
  },
  {
    src: '/images/portfolio/logo-ddna.gif',
    alt: 'Developmental Disabilities Nurses Association',
    title: 'Developmental Disabilities Nurses Association',
  },
]

export default function About() {
  const [bannerVisible, setBannerVisible] = useState(false)

  useEffect(() => {
    setBannerVisible(true)
  }, [])

  return (
    <div className={`${Raleway.className}`}>
      {/* Banner with Video Background — pt offsets the fixed header */}
      <div className="relative w-full h-[420px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-40">
            <VideoPlayer
              mp4Src="/videos/macbook-typing-about-us.mp4"
              webmSrc="/videos/macbook-typing-about-us.webm"
              posterSrc="/videos/cover-images/macbook-typing-poster.jpg"
            />
          </div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Banner Content — pt accounts for 74px fixed header */}
        <div className="relative z-10 flex items-center justify-center h-full pt-[74px] px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2
              className={`text-white text-[28px] uppercase font-light mb-2 drop-shadow-md ${
                bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.1s', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
            >
              About Us
            </h2>
            {/* Full-width white gradient separator matching original */}
            <div
              className="w-full h-px my-5"
              style={{
                background:
                  'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.5) 35%, rgba(255,255,255,0.5) 70%, transparent 100%)',
              }}
            />
            <p
              className={`text-gray-200 text-base md:text-lg font-light leading-relaxed mb-6 drop-shadow-md ${
                bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.2s', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
            >
              We are a dedicated team of passionate developers driven by the mission to make the world better through
              code.
            </p>
            <div
              className={`${bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'}`}
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                href="/contact"
                className="inline-block px-6 py-3 border border-gray-300/60 text-white text-sm uppercase tracking-wider rounded-sm hover:bg-white/10 hover:border-white/80 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto px-8 md:px-20 lg:px-32">
          <h2
            className="text-left text-[28px] font-light text-[#333] mb-0"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            The <span className={`${Pacifico.className} text-[#09afdf] font-normal`}>CodeBuilder</span>
            <span className="text-[#999] font-light">, Inc.</span> <span className="font-light">Team</span>
          </h2>
          <div className="separator mb-8" />
          {/* Fallback separator in case CSS pseudo-element doesn't render */}
          <div
            className="w-full h-px mb-8 -mt-8"
            style={{
              background:
                'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.05) 70%, transparent 100%)',
            }}
          />

          {/* Team Members */}
          <div className="space-y-0">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={member.name}
                name={member.name}
                title={member.title}
                bio={member.bio}
                imageSrc={member.imageSrc}
                imageAlt={member.imageAlt}
                skills={member.skills}
                contactLinks={member.contactLinks}
                index={index}
              />
            ))}
          </div>

          {/* Statistics Heading */}
          <div className="mt-16 mb-6">
            <h3 className="text-left text-2xl text-[#333]">
              <span className={`${Pacifico.className} text-[#09afdf] font-normal`}>CodeBuilder</span>
              <span className="text-[#999] font-normal">, Inc.</span> <span className="font-normal">Stats</span>
            </h3>
            <div className="separator-2 mt-4 mb-6" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative bg-[#fafafa] border border-[#f1f1f1] rounded-sm py-5 px-3 text-center shadow-narrow"
              >
                <span className="block text-[#09afdf] text-[36px] leading-none mb-2.5">
                  <FontAwesomeIcon icon={stat.icon} />
                </span>
                <h3 className="text-2xl font-normal text-[#333] mt-0 mb-1">{stat.label}</h3>
                <Counter
                  to={stat.value}
                  duration={stat.speed}
                  className="text-[32px] font-light text-[#333] leading-none"
                />
              </div>
            ))}
          </div>

          {/* Client Logos */}
          <div className="py-8">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {clients.map((client) => (
                <Link key={client.alt} href="/portfolio" className="group relative" title={client.title}>
                  <Image
                    src={client.src}
                    alt={client.alt}
                    width={100}
                    height={80}
                    className="h-16 md:h-20 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="separator-3 mb-8" />
        </div>
      </section>

      {/* Reach Out / Contact Banner */}
      <ContactSection />
    </div>
  )
}
