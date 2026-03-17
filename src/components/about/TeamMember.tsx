'use client'

import Image from 'next/image'
import Link from 'next/link'
import ProgressBar from './ProgressBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faDiamond, faUsers, faMoneyBill, faCode } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin, faDiscord } from '@fortawesome/free-brands-svg-icons'
import { useEffect, useRef, useState } from 'react'
import 'animate.css'

interface Skill {
  label: string
  percentage: number
}

interface ContactLink {
  icon: string
  label: string
  href: string
  iconPack?: 'solid' | 'brands'
}

interface TeamMemberProps {
  name: string
  title: string
  bio: string
  imageSrc: string
  imageAlt: string
  skills: Skill[]
  contactLinks: ContactLink[]
  index?: number
}

export default function TeamMember({
  name,
  title,
  bio,
  imageSrc,
  imageAlt,
  skills,
  contactLinks,
  index = 0,
}: TeamMemberProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Alternate animation combos per member
  const imageAnims = ['zoomIn', 'fadeInLeft', 'flipInY', 'rotateIn']
  const nameAnims = ['fadeInDown', 'lightSpeedInRight', 'fadeInLeft', 'fadeInUp']
  const bioAnims = ['fadeIn', 'fadeInUp', 'fadeIn', 'fadeInUp']
  const btnAnims = ['bounceIn', 'fadeInUp', 'zoomIn', 'bounceIn']
  const skillAnims = ['fadeInRight', 'fadeInUp', 'fadeInRight', 'fadeInLeft']

  const idx = index % 4

  return (
    <div ref={sectionRef} className="border-b border-gray-300 pb-10 mb-10 last:border-b-0 last:pb-0 last:mb-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 lg:gap-8">
        {/* Photo */}
        <div
          className={`sm:col-span-1 md:col-span-3 ${isVisible ? `animate__animated animate__${imageAnims[idx]}` : 'opacity-0'}`}
          style={{ animationDelay: '0.1s', animationDuration: '0.8s' }}
        >
          <div className="relative group overflow-hidden rounded-sm">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={300}
              height={300}
              className="w-full h-auto object-cover aspect-square"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              {contactLinks.find((c) => c.label === 'Email') && (
                <a
                  href={contactLinks.find((c) => c.label === 'Email')!.href}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-white/80 bg-white/15 backdrop-blur-sm text-white text-xl hover:bg-white/30 hover:scale-110 transition-all duration-200"
                  title={`${name} - ${title}`}
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="sm:col-span-1 md:col-span-6">
          <h3
            className={`text-2xl font-normal text-[#333] mb-0 ${isVisible ? `animate__animated animate__${nameAnims[idx]}` : 'opacity-0'}`}
            style={{ fontFamily: "'Raleway', sans-serif", animationDelay: '0.2s', animationDuration: '0.7s' }}
          >
            {name} - <span className="text-[80%] text-[#999]">{title}</span>
          </h3>
          <div
            className="w-full h-px mt-2 mb-4"
            style={{
              background:
                'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.05) 70%, transparent 100%)',
            }}
          />
          <p
            className={`text-[#777] text-[15px] font-light leading-relaxed mb-4 ${isVisible ? `animate__animated animate__${bioAnims[idx]}` : 'opacity-0'}`}
            style={{ fontFamily: "'Roboto', sans-serif", animationDelay: '0.35s', animationDuration: '0.6s' }}
          >
            {bio}
          </p>
          <div
            className={`flex flex-wrap gap-2 ${isVisible ? `animate__animated animate__${btnAnims[idx]}` : 'opacity-0'}`}
            style={{ animationDelay: '0.5s', animationDuration: '0.6s' }}
          >
            {contactLinks.map((link) => {
              const icon =
                link.label === 'Email'
                  ? faEnvelope
                  : link.label === 'Call'
                    ? faPhone
                    : link.label === 'GitHub'
                      ? faGithub
                      : link.label === 'LinkedIn'
                        ? faLinkedin
                        : link.label === 'Discord'
                          ? faDiscord
                          : faEnvelope
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-sm hover:bg-gray-100 hover:border-gray-400 transition-colors"
                >
                  <FontAwesomeIcon icon={icon} className="text-xs" />
                  {link.label}
                </a>
              )
            })}
          </div>
        </div>

        {/* Skills */}
        <div
          className={`sm:col-span-2 md:col-span-3 ${isVisible ? `animate__animated animate__${skillAnims[idx]}` : 'opacity-0'}`}
          style={{ animationDelay: '0.3s', animationDuration: '0.7s' }}
        >
          <div className="hidden md:block h-5" />
          {skills.map((skill, idx) => (
            <ProgressBar key={skill.label} label={skill.label} percentage={skill.percentage} index={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}
