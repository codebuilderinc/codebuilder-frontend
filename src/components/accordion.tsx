'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'

interface AccordionItem {
  title: string
  content: React.ReactNode
}

const Accordion: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const items: AccordionItem[] = [
    {
      title: 'Software Engineering Solutions',
      content: (
        <div>
          Navigating a wide array of domains, our team excels in mastering APIs, Database
          Architecture & Design, Frontend (UI/UX) development, and the intricacies of Development
          Operations (CI/CD), Operational Security (OpSec), and Blockchain Development (DApps, Smart
          Contracts, etc.). With precision and expertise at the forefront of our approach, we are
          poised to address your multifaceted requirements comprehensively.
        </div>
      ),
    },
    {
      title: 'Database Architecture & Design',
      content: (
        <div>
          {' '}
          In the realm of Database Design & Architecture, our expertise spans across diverse
          platforms. We specialize in crafting scalable architectures tailored to meet the demands
          of modern data environments. Our adept team navigates the intricacies of relational
          databases like Postgres and MySQL, ensuring data integrity and efficiency. Simultaneously,
          we harness the flexibility of NoSQL databases like MongoDB to accommodate dynamic,
          unstructured data. Emphasizing scalability, our approach caters to the evolving needs of
          your data landscape, addressing the challenges posed by big data scenarios.
        </div>
      ),
    },
    {
      title: 'Web3 & Blockchain Development',
      content: (
        <div>
          {' '}
          As Blockchain Experts, we possess extensive lower-level knowledge of Blockchain
          Engineering. Our proficiency extends to launching DApps utilizing the Ethereum Virtual
          Machine (EVM), where we have successfully coded and deployed Smart Contracts using
          Solidity. Furthermore, we boast hands-on experience in real-time processing of Blockchain
          data, encompassing storage, analysis, and curation of substantial datasets.
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
    <section className="border-2 border-grey-200">
      {items.map((item, index) => {
        const isOpen = activeIndex === index
        return (
          <article key={index} className="border-grey">
            <div
              className={`relative right-[2px] border-l-2 ${isOpen ? 'border-cbBlue-2' : 'border-grey-200'}`}
            >
              <header
                className="flex justify-between items-center p-4 pr-4 cursor-pointer select-none"
                onClick={() => toggleItem(index)}
              >
                <span
                  className={`w-full text-xl font-thin ${isOpen ? 'text-cbBlue-6' : 'text-grey-darkest'}`}
                >
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
                    {isOpen ? (
                      <polyline points="18 15 12 9 6 15" />
                    ) : (
                      <polyline points="6 9 12 15 18 9" />
                    )}
                  </svg>
                </div>
              </header>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden pl-4 pr-4 text-[14px] text-[#999999] font-extralight"
              >
                {item.content}
              </motion.div>
            </div>
          </article>
        )
      })}
    </section>
  )
}

export default Accordion
