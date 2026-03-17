'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Raleway } from '@/app/fonts'

interface AccordionItem {
  title: string
  body: string
}

interface PortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  imageSrc: string
  imageAlt: string
  founded: string
  clientSince: string
  description: string
  link?: { href: string; label: string }
  projects: AccordionItem[]
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({
  isOpen,
  onClose,
  title,
  imageSrc,
  imageAlt,
  founded,
  clientSince,
  description,
  link,
  projects,
}) => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const generatedId = useId()
  const titleId = `portfolio-modal-title-${generatedId}`

  useEffect(() => {
    if (isOpen) {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      setOpenAccordion(null)
      return () => {
        document.body.style.overflow = previousOverflow
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose()
  }

  // Safely render description with optional inline links for all occurrences of link.label
  const renderDescription = () => {
    if (!link || !description.includes(link.label)) {
      return description
    }
    const parts = description.split(link.label)
    return (
      <>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#09afdf] hover:underline"
              >
                {link.label}
              </a>
            )}
          </React.Fragment>
        ))}
      </>
    )
  }

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className={`${Raleway.className} relative bg-white rounded-md shadow-2xl w-[90%] max-w-[600px] max-h-[85vh] overflow-y-auto animate-slideUp`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h4 id={titleId} className="text-lg font-semibold text-[#333]">{title}</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none p-1"
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-5 py-4">
          {/* Client Info Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="md:w-1/6 flex-shrink-0">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={100}
                height={100}
                className="max-h-[100px] w-auto object-contain relative"
                unoptimized
              />
            </div>
            <div className="md:w-5/6">
              <p className="text-sm text-[#666] mb-1">
                <strong>Founded</strong> - {founded} &middot; <strong>Client Since</strong> - {clientSince}
              </p>
              <p className="text-sm text-[#666]">
                {renderDescription()}
              </p>
            </div>
          </div>

          {/* Projects Accordion */}
          <h3 className="text-xl font-semibold text-[#333] mb-3">Projects</h3>
          <div className="border border-gray-200 rounded">
            {projects.map((project, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                    openAccordion === index
                      ? 'bg-[#09afdf] text-white'
                      : 'text-[#09afdf] hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faCheck} className="text-xs" />
                  {project.title}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openAccordion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 py-3 text-sm text-[#666] bg-gray-50 border-t border-gray-100">
                    {project.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end px-5 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded text-[#333] hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default PortfolioModal
