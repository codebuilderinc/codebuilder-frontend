'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Raleway } from 'next/font/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe,
  faMobileAlt,
  faCubes,
  faHome,
  faUser,
  faAngleUp,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

const raleway = Raleway({ subsets: ['latin'] })

const AccordionTabsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<string>('flexibility')

  const items = [
    {
      icon: faGlobe,
      title: 'Software Engineering',
      content:
        'Navigating a wide array of domains, our team excels in mastering APIs, Database Architecture & Design, Frontend (UI/UX) development, and the intricacies of Development Operations (CI/CD), Operational Security (OpSec), and Blockchain Development (DApps, Smart Contracts, etc.). With precision and expertise at the forefront of our approach, we are poised to address your multifaceted requirements comprehensively.',
    },
    {
      icon: faMobileAlt,
      title: 'Database Architecture',
      content:
        "In the realm of Database Design & Architecture, our expertise spans across diverse platforms. We specialize in crafting scalable architectures tailored to meet the demands of modern data environments. Our adept team navigates the intricacies of relational databases like Postgres and MySQL, ensuring data integrity and efficiency. Simultaneously, we harness the flexibility of NoSQL databases like MongoDB to accommodate dynamic, unstructured data. Emphasizing scalability, our approach caters to the evolving needs of your data landscape, addressing the challenges posed by big data scenarios. Whether it's optimizing relational database schemas or implementing NoSQL solutions for flexibility and speed, we tailor our Database Design & Architecture services to empower your data infrastructure for seamless growth and performance.",
    },
    {
      icon: faCubes,
      title: 'Blockchain Development',
      content:
        'As Blockchain Experts, we possess extensive lower-level knowledge of Blockchain Engineering. Our proficiency extends to launching DApps utilizing the Ethereum Virtual Machine (EVM), where we have successfully coded and deployed Smart Contracts using Solidity. Furthermore, we boast hands-on experience in real-time processing of Blockchain data, encompassing storage, analysis, and curation of substantial datasets. This expertise is applied across various applications with the ultimate goal of delivering tangible end-user products.',
    },
  ]

  const tabs = [
    {
      id: 'flexibility',
      icon: faHome,
      label: 'Very Flexible',
      title: 'Exceptional Flexibility',
      paragraphs: [
        'CodeBuilder offers highly adaptable services and pricing models designed to suit your needs and budget effectively. We operate on an hourly billing system, ensuring transparency and accuracy in reflecting the time invested in your project.',
        'Our rates are tailored to the specific nature of the work, providing a fair and customized approach. Before initiating any project, we provide a detailed hourly time/cost estimate and agreement, ensuring clarity and alignment with your expectations.',
      ],
    },
    {
      id: 'support',
      icon: faUser,
      label: 'Customer Support',
      title: 'Customer Support Excellence',
      paragraphs: [
        "Collaborating with CodeBuilder guarantees a personalized experience, as you'll be assigned a dedicated project manager committed to offering tailored support and maintaining transparent communication at every stage of your project.",
        'Additionally, our commitment to your success extends beyond standard working hours. CodeBuilder provides 24/7 On-Call services, ensuring prompt assistance from our skilled engineers whenever you need it. Furthermore, our automated monitoring services continuously track and analyze your applications, proactively identifying and addressing potential issues for a seamless user experience.',
      ],
    },
  ]

  const toggleItem = (index: number) => {
    setActiveIndex(index)
  }

  const activeTabData = tabs.find((t) => t.id === activeTab) || tabs[0]

  return (
    <section className={`${raleway.className} bg-gray-100 py-4 md:py-6`}>
      <div className="container mx-auto py-4 px-8 md:px-20 lg:px-32">
        <h1
          className={`mb-2 text-[24px] text-[#333] font-normal tracking-normal ${raleway.className}`}
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          Enlist the Expertise of our Professional <strong>Software Engineers</strong> for your Project!
        </h1>
        {/* separator-2 matching Laravel */}
        <div
          className="w-full h-px mb-2.5"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.05) 70%, transparent 100%)',
          }}
        />
        <p className="text-[#777] text-lg mb-4" style={{ fontFamily: "'Raleway', sans-serif" }}>
          Opt for our services when seeking professional software solutions; let our{' '}
          <Link href="/portfolio" className="text-[#777] underline hover:text-[#555]">
            portfolio
          </Link>{' '}
          eloquently testify to the quality and expertise we bring to every project.
        </p>

        <div className="flex flex-col md:flex-row gap-0">
          {/* Left Column — Accordion (collapse-style-2) */}
          <div className="w-full md:w-1/2 md:pr-4">
            <div className="border-0">
              {items.map((item, index) => {
                const isOpen = activeIndex === index
                return (
                  <div key={index} className="mb-0">
                    {/* Panel heading */}
                    <button
                      className={`w-full text-left px-4 py-2.5 flex items-center text-white text-[15px] font-normal transition-colors duration-200 ${
                        isOpen ? 'bg-[#09afdf]' : 'bg-[#333]'
                      }`}
                      onClick={() => toggleItem(index)}
                    >
                      <FontAwesomeIcon icon={item.icon} className="mr-2.5 text-[16px]" />
                      <span className="flex-1">{item.title}</span>
                      <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} className="text-sm" />
                    </button>
                    {/* Panel body */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? 'auto' : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="py-4 text-[14px] text-[#777] font-light leading-relaxed">{item.content}</div>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column — Tabs (nav-tabs style-1) */}
          <div className="w-full md:w-1/2 md:pl-4 mt-4 md:mt-0">
            {/* Tab navigation */}
            <div className="flex border-b border-[#e1e1e1] mb-4">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-2.5 text-[15px] font-normal transition-colors duration-150 rounded-t-[15px] border border-transparent ${
                      isActive
                        ? 'bg-[#333] text-white border-[#222] -mb-px z-10'
                        : 'text-[#333] hover:bg-[#333] hover:text-white hover:border-[#222]'
                    }`}
                    style={{ lineHeight: 1, height: '40px' }}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="mr-2.5 text-sm" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="text-[24px] font-normal text-[#333] mb-3" style={{ fontFamily: "'Raleway', sans-serif" }}>
                {activeTabData.title}
              </h3>
              {activeTabData.paragraphs.map((p, i) => (
                <p key={i} className="text-[15px] text-[#999] mb-4 leading-relaxed">
                  {p}
                </p>
              ))}
              <Link
                href="/services"
                className="inline-block px-4 py-2 text-sm text-white bg-[#09afdf] border border-[#0c9ec7] rounded-[3px] hover:bg-[#0c9ec7] transition-colors duration-200"
              >
                Read more
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccordionTabsSection
