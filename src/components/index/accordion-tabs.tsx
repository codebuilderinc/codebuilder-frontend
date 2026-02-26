'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Raleway } from 'next/font/google'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import CustomButton from '../button'

const raleway = Raleway({ subsets: ['latin'] })

const AccordionTabsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0) // Set initial state to 0

  const items = [
    {
      title: 'Software Engineering Solutions',
      content: (
        <div>
          Navigating a wide array of domains, our team excels in mastering APIs, Database Architecture & Design,
          Frontend (UI/UX) development, and the intricacies of Development Operations (CI/CD), Operational Security
          (OpSec), and Blockchain Development (DApps, Smart Contracts, etc.). With precision and expertise at the
          forefront of our approach, we are poised to address your multifaceted requirements comprehensively.
        </div>
      ),
    },
    {
      title: 'Database Architecture & Design',
      content: (
        <div>
          In the realm of Database Design & Architecture, our expertise spans across diverse platforms. We specialize in
          crafting scalable architectures tailored to meet the demands of modern data environments. Our adept team
          navigates the intricacies of relational databases like Postgres and MySQL, ensuring data integrity and
          efficiency. Simultaneously, we harness the flexibility of NoSQL databases like MongoDB to accommodate dynamic,
          unstructured data. Emphasizing scalability, our approach caters to the evolving needs of your data landscape,
          addressing the challenges posed by big data scenarios.
        </div>
      ),
    },
    {
      title: 'Web3 & Blockchain Development',
      content: (
        <div>
          As Blockchain Experts, we possess extensive lower-level knowledge of Blockchain Engineering. Our proficiency
          extends to launching DApps utilizing the Ethereum Virtual Machine (EVM), where we have successfully coded and
          deployed Smart Contracts using Solidity. Furthermore, we boast hands-on experience in real-time processing of
          Blockchain data, encompassing storage, analysis, and curation of substantial datasets.
        </div>
      ),
    },
    {
      title: 'Egestas sed tempus urna',
      content: null,
    },
  ]

  const toggleItem = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index))
  }

  return (
    <section className={`${raleway.className} bg-gray-100 py-4 md:py-6`}>
      <div className="container mx-auto py-4 px-8 md:px-20 lg:px-32">
        <h1 className={`mb-2 text-2xl text-[#333333] font-normal tracking-normal ${raleway.className}`}>
          Enlist the Expertise of our Professional <strong>Software Engineers</strong> for your Project!
        </h1>
        <div className="separator-2 mb-2" />
        <p className={`text-gray-400 text-lg mb-4`}>
          Opt for our services when seeking professional software solutions; let our{' '}
          <a href="/portfolio" className="text-gray-500 underline hover:text-gray-700">
            portfolio
          </a>{' '}
          eloquently testify to the quality and expertise we bring to every project.
        </p>
        <div className="flex flex-wrap">
          {/* Accordion Section */}
          <div className="w-full md:w-1/2 pr-4">
            <section className="border-2 border-grey-200">
              {items.map((item, index) => {
                const isOpen = activeIndex === index
                return (
                  <article key={index} className="border-grey">
                    <div
                      className={`relative right-[2px] border-l-2 ${isOpen ? 'border-cbBlue-2' : 'border-grey-200'}`}
                    >
                      <div
                        className="flex justify-between items-center px-4 py-2 cursor-pointer select-none"
                        onClick={() => toggleItem(index)}
                      >
                        <span className={`w-full text-lg font-light ${isOpen ? 'text-cbBlue-6' : 'text-grey-darkest'}`}>
                          {item.title}
                          <div className="separator-2 w-full my-2 opacity-50" />
                        </span>
                        <div
                          className={`rounded-full border w-7 h-7 flex items-center justify-center ${
                            isOpen ? 'border-cbBlue-6 bg-cbBlue-6' : 'border-grey'
                          }`}
                        >
                          <svg
                            aria-hidden="true"
                            fill="none"
                            height="24"
                            stroke={isOpen ? 'white' : '#606F7B'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {isOpen ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
                          </svg>
                        </div>
                      </div>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden pl-4 pr-4 text-[14px] text-[#777777] font-light"
                      >
                        {item.content}
                      </motion.div>
                    </div>
                  </article>
                )
              })}
            </section>
          </div>

          {/* Tabs Section */}
          <div className={`${raleway.className} w-full md:w-1/2 pl-4`}>
            <ul className="flex space-x-4 border-b">
              <li className="py-2 px-4 text-gray-700 border-b-2 border-blue-600 text-base">
                <button>Very Flexible</button>
              </li>
              <li className="py-2 px-4 text-gray-700 text-base">
                <button>Customer Support</button>
              </li>
            </ul>
            <div className="mt-4">
              <div>
                <h3 className="text-[24px] font-normal">Exceptional Flexibility</h3>
                <p className="text-base text-[#999999] mb-[15px]">
                  CodeBuilder offers highly adaptable services and pricing models designed to suit your needs and budget
                  effectively. We operate on an hourly billing system, ensuring transparency and accuracy in reflecting
                  the time invested in your project.
                </p>
                <p className="text-base text-[#999999]">
                  Our rates are tailored to the specific nature of the work, providing a fair and customized approach.
                  Before initiating any project, we provide a detailed hourly time/cost estimate and agreement, ensuring
                  clarity and alignment with your expectations.
                </p>

                <CustomButton text="Read More" link="/services" icon={faChevronRight} size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccordionTabsSection
