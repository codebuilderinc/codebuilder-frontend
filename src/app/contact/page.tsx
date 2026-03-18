'use client'

import VideoPlayer from '@/components/video-player'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faNavicon, faPencil, faHome, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faTwitter, faReddit, faLinkedin, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { Raleway, Pacifico } from '../fonts'
import { useEffect, useState, useCallback } from 'react'
import ContactSection from '@/components/layout/contact-banner'
import 'animate.css'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function Contact() {
  const [bannerVisible, setBannerVisible] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const [loadComplete, setLoadComplete] = useState(false)
  const [showCheckmark, setShowCheckmark] = useState(false)

  useEffect(() => {
    setBannerVisible(true)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.subject.trim() !== '' &&
    formData.message.trim() !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setFormStatus('submitting')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to send')

      // Trigger circle-loader -> checkmark animation
      setLoadComplete(true)
      setTimeout(() => {
        setShowCheckmark(true)
        setFormStatus('success')
      }, 600)
    } catch {
      setFormStatus('error')
    }
  }

  const handleRetry = () => {
    setFormStatus('idle')
    setLoadComplete(false)
    setShowCheckmark(false)
  }

  return (
    <div className={`${Raleway.className}`}>
      {/* ── Hero Section with Video Background ── */}
      <section className="relative w-full min-h-[320px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-40">
            <VideoPlayer
              mp4Src="/videos/contact-background.mp4"
              posterSrc="/videos/cover-images/contact-background-poster.jpg"
            />
          </div>
          {/* Dark overlay — matches .dark-translucent-bg */}
          <div className="absolute inset-0 bg-black/50 hover:bg-black/60 transition-colors duration-300" />
        </div>

        {/* Hero Content — accounts for 74px fixed header */}
        <div className="relative z-10 flex items-center justify-center min-h-[320px] pt-[74px] px-4 py-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Heading */}
            <h2
              className={`text-white text-[28px] uppercase font-light mb-2 drop-shadow-md ${
                bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.1s', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
            >
              Contact Us
            </h2>

            {/* Full-width gradient separator */}
            <div
              className={`w-full h-px my-5 ${bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'}`}
              style={{
                animationDelay: '0.1s',
                background:
                  'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.5) 35%, rgba(255,255,255,0.5) 70%, transparent 100%)',
              }}
            />

            {/* Description */}
            <p
              className={`text-gray-200 text-base md:text-lg font-light leading-relaxed mb-6 drop-shadow-md ${
                bannerVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.2s', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
            >
              Our team of developers is eager to connect with you. Feel free to reach out with any questions, concerns,
              or feedback. Your input is valuable to us, and we&apos;ll respond promptly to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Content Section ── */}
      <section className="py-6 px-4" style={{ paddingTop: '25px' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap -mx-4">
            {/* ── Left Column: Form ── */}
            <div className="w-full md:w-2/3 px-4 mb-10">
              {/* Lead paragraph */}
              <p className="text-[#666] text-[17px] font-light leading-relaxed mb-6">
                Our team of developers is eager to connect with you. Feel free to reach out with any questions,
                concerns, or feedback. Your input is valuable to us, and we&apos;ll respond promptly to assist you.
              </p>

              {/* Success alert */}
              <div
                className={`bg-green-50 border border-green-300 text-green-800 rounded px-4 py-3 mb-4 transition-all duration-300 ${
                  formStatus === 'success' ? 'block' : 'hidden'
                }`}
              >
                We have received your message, we will contact you very soon.
              </div>

              {/* Error alert */}
              <div
                className={`bg-red-50 border border-red-300 text-red-800 rounded px-4 py-3 mb-4 transition-all duration-300 ${
                  formStatus === 'error' ? 'block' : 'hidden'
                }`}
              >
                Oops! Something went wrong, please verify your information or try again.
                <button onClick={handleRetry} className="ml-3 underline text-red-700 hover:text-red-900">
                  Try Again
                </button>
              </div>

              {/* Contact Form */}
              <div
                className={`transition-all duration-300 ${
                  formStatus === 'submitting' || formStatus === 'success' ? 'hidden' : 'block'
                }`}
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="relative">
                    <label htmlFor="name" className="block text-[#333] text-sm font-medium mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={formStatus === 'submitting'}
                        className="w-full border border-gray-300 rounded px-4 py-2.5 pr-10 text-[#333] text-sm focus:outline-none focus:border-[#09afdf] focus:ring-1 focus:ring-[#09afdf] transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder=""
                      />
                      <FontAwesomeIcon
                        icon={faUser}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label htmlFor="email" className="block text-[#333] text-sm font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={formStatus === 'submitting'}
                        className="w-full border border-gray-300 rounded px-4 py-2.5 pr-10 text-[#333] text-sm focus:outline-none focus:border-[#09afdf] focus:ring-1 focus:ring-[#09afdf] transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder=""
                      />
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="relative">
                    <label htmlFor="subject" className="block text-[#333] text-sm font-medium mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={formStatus === 'submitting'}
                        className="w-full border border-gray-300 rounded px-4 py-2.5 pr-10 text-[#333] text-sm focus:outline-none focus:border-[#09afdf] focus:ring-1 focus:ring-[#09afdf] transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder=""
                      />
                      <FontAwesomeIcon
                        icon={faNavicon}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <label htmlFor="message" className="block text-[#333] text-sm font-medium mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={formStatus === 'submitting'}
                        className="w-full border border-gray-300 rounded px-4 py-2.5 pr-10 text-[#333] text-sm focus:outline-none focus:border-[#09afdf] focus:ring-1 focus:ring-[#09afdf] transition-colors duration-200 resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder=""
                      />
                      <FontAwesomeIcon icon={faPencil} className="absolute right-3 top-3 text-gray-400 text-sm" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!isFormValid || formStatus === 'submitting'}
                      className={`px-8 py-2.5 rounded text-white text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
                        isFormValid && formStatus !== 'submitting'
                          ? 'bg-[#09afdf] hover:bg-[#0c9ec7] cursor-pointer shadow-sm hover:shadow-md'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {formStatus === 'submitting' ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Contact Us'
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* ── Loading & Success Animation ── */}
              <div
                className={`pt-10 transition-all duration-300 ${
                  formStatus === 'submitting' || (formStatus === 'success' && !showCheckmark)
                    ? 'block'
                    : formStatus === 'success' && showCheckmark
                      ? 'block'
                      : 'hidden'
                }`}
              >
                <div className="text-center">
                  <h1 className="text-[#333] text-xl font-light mb-6">
                    {formStatus === 'success' ? 'Message Sent' : 'Sending Message'}
                  </h1>

                  {/* Circle Loader */}
                  <div className="flex justify-center">
                    <div className={`circle-loader ${loadComplete ? 'load-complete' : ''}`}>
                      <div className={`checkmark draw ${showCheckmark ? 'shown' : ''}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column: Sidebar ── */}
            <aside className="w-full md:w-1/3 px-4">
              <div className="md:border-l md:border-gray-200 md:pl-8">
                {/* Company Name */}
                <h3 className="text-[22px] mb-4">
                  <span className={`${Pacifico.className} text-[#09afdf]`}>CodeBuilder</span>
                  <span className="text-[#999] font-light">.us</span>
                </h3>

                {/* Separator */}
                <div
                  className="w-full h-px mb-5"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.06) 50%, transparent 100%)',
                  }}
                />

                {/* Contact Info */}
                <ul className="space-y-3 text-[#666] text-sm mb-6">
                  <li className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faHome} className="text-[#333] mt-0.5 w-4 flex-shrink-0" />
                    <span>
                      1211 22nd Ave NE
                      <br />
                      <span className="pl-0">Minneapolis, MN 55418</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faPhone} className="text-[#333] mt-0.5 w-4 flex-shrink-0" />
                    <span>
                      <abbr title="Phone" className="no-underline">
                        P:
                      </abbr>{' '}
                      <a
                        href="tel:+16122088873"
                        className="text-[#09afdf] hover:text-[#0c9ec7] transition-colors duration-200"
                      >
                        (612) 208-8873
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faEnvelope} className="text-[#333] mt-0.5 w-4 flex-shrink-0" />
                    <a
                      href="mailto:info@codebuilder.us"
                      className="text-[#09afdf] hover:text-[#0c9ec7] transition-colors duration-200"
                    >
                      info@codebuilder.us
                    </a>
                  </li>
                </ul>

                {/* Social Links */}
                <div className="flex items-center gap-2 mb-6">
                  <SocialIcon
                    href="http://www.facebook.com/codebuilder.us"
                    icon={faFacebook}
                    hoverBg="hover:bg-[#3b5998]"
                  />
                  <SocialIcon
                    href="https://plus.google.com/u/1/108752322274477001531"
                    icon={faGoogle}
                    hoverBg="hover:bg-[#dd4b39]"
                  />
                  <SocialIcon
                    href="http://www.twitter.com/codebuilderinc"
                    icon={faTwitter}
                    hoverBg="hover:bg-[#1da1f2]"
                  />
                  <SocialIcon
                    href="https://www.reddit.com/user/codebuilderus"
                    icon={faReddit}
                    hoverBg="hover:bg-[#ff4500]"
                  />
                  <SocialIcon
                    href="http://www.linkedin.com/codebuilderinc"
                    icon={faLinkedin}
                    hoverBg="hover:bg-[#0077b5]"
                  />
                </div>

                {/* Separator */}
                <div
                  className="w-full h-px mb-5"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.06) 50%, transparent 100%)',
                  }}
                />

                {/* Google Maps Embed */}
                <div className="w-full">
                  <iframe
                    className="border-0 w-full rounded"
                    style={{ height: '300px' }}
                    src={`//www.google.com/maps/embed/v1/place?q=1211%2022nd%20Ave%20NE%20Minneapolis%20MN&zoom=17&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="CodeBuilder, Inc. Office Location"
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Reach Out / Contact Banner ── */}
      <ContactSection />

      {/* ── Circle Loader / Checkmark Styles ── */}
      <style jsx>{`
        .circle-loader {
          margin: 0 0 30px 10px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          border-left-color: #5cb85c;
          animation: loader-spin 1s infinite linear;
          position: relative;
          display: inline-block;
          vertical-align: top;
          border-radius: 50%;
          width: 8em;
          height: 8em;
        }

        .circle-loader.load-complete {
          animation: none;
          border-color: #5cb85c;
          transition: border 500ms ease-out;
        }

        .checkmark {
          display: none;
        }

        .checkmark.shown {
          display: block;
        }

        .checkmark.draw::after {
          animation-duration: 800ms;
          animation-timing-function: ease;
          animation-name: checkmark;
          transform: scaleX(-1) rotate(135deg);
        }

        .checkmark::after {
          opacity: 1;
          height: 4em;
          width: 2em;
          transform-origin: left top;
          border-right: 2px solid #5cb85c;
          border-top: 2px solid #5cb85c;
          content: '';
          left: 2em;
          top: 4em;
          position: absolute;
        }

        @keyframes loader-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes checkmark {
          0% {
            height: 0;
            width: 0;
            opacity: 1;
          }
          20% {
            height: 0;
            width: 2em;
            opacity: 1;
          }
          40% {
            height: 4em;
            width: 2em;
            opacity: 1;
          }
          100% {
            height: 4em;
            width: 2em;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

/** Small circular social icon with hover effect */
function SocialIcon({ href, icon, hoverBg }: { href: string; icon: typeof faFacebook; hoverBg: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-[#999] text-sm transition-all duration-300 hover:text-white hover:border-transparent ${hoverBg}`}
    >
      <FontAwesomeIcon icon={icon} />
    </a>
  )
}
