import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faGooglePlus, faSkype, faLinkedin, faReddit } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: faFacebook, href: 'https://www.facebook.com/codebuilder.us', title: 'Facebook', color: '#4267B2' },
    { icon: faTwitter, href: 'https://www.twitter.com/codebuilderio', title: 'Twitter', color: '#1DA1F2' },
    {
      icon: faGooglePlus,
      href: 'https://plus.google.com/u/1/108752322274477001531',
      title: 'Google+',
      color: '#E05E53',
    },
    { icon: faSkype, href: 'skype:andrew.c.corbin', title: 'Skype', color: '#05ACF2', noBlank: true },
    { icon: faLinkedin, href: 'https://www.linkedin.com/company/25053333/', title: 'LinkedIn', color: '#0077B5' },
    { icon: faReddit, href: 'https://www.reddit.com/user/codebuilderus', title: 'Reddit', color: '#7FC2FE' },
  ]

  return (
    <footer
      className="pt-8 pb-6 text-[#ddd] border-t-2 border-[#09afdf]"
      style={{ background: 'linear-gradient(180deg, #2d3436 0%, #262c2e 40%, #1e2425 100%)' }}
    >
      <div className="container mx-auto px-8 md:px-20 lg:px-32">
        <div className="flex flex-wrap text-left lg:text-left">
          {/* Left Column — Heading, social icons, contact info */}
          <div className="w-full lg:w-6/12 px-4">
            <h4 className="text-3xl font-normal text-white">Let&apos;s keep in touch!</h4>
            <h5 className="text-lg mt-0 mb-2 text-[#bbb]">
              Find us on any of these platforms, we respond 1-2 business days.
            </h5>
            <div className="flex mt-6 mb-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.title}
                  href={social.href}
                  target={social.noBlank ? undefined : '_blank'}
                  rel={social.noBlank ? undefined : 'noopener noreferrer'}
                  title={social.title}
                  className="bg-[#3d4749] shadow-lg font-normal h-10 w-10 flex items-center justify-center rounded-full outline-none mr-2 hover:shadow-xl hover:bg-[#4a5658] transition-all"
                >
                  <FontAwesomeIcon icon={social.icon} style={{ color: social.color }} />
                </Link>
              ))}
            </div>
            {/* Contact info */}
            <div className="flex flex-col gap-1 text-sm mt-2 mb-6 lg:mb-0">
              <Link href="mailto:info@codebuilder.us" className="text-[#ccc] hover:text-[#09afdf] transition-colors">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#09afdf] text-[10px] mr-1.5" />
                info@codebuilder.us
              </Link>
              <Link href="tel:+16125672633" className="text-[#ccc] hover:text-[#09afdf] transition-colors">
                <FontAwesomeIcon icon={faPhone} className="text-[#09afdf] text-[10px] mr-1.5" />
                +1 (612) 567-2633
              </Link>
              <span className="text-[#ccc]">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#09afdf] text-[10px] mr-1.5" />
                Minneapolis, MN
              </span>
            </div>
          </div>

          {/* Right Column — Link lists */}
          <div className="w-full lg:w-6/12 px-4">
            <div className="flex flex-wrap items-top mb-6">
              <div className="w-full lg:w-4/12 px-4 ml-auto">
                <span className="block uppercase text-white text-sm font-semibold mb-1">Useful Links</span>
                <div
                  className="w-full h-px mb-3"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(9,175,223,0.7) 0%, rgba(9,175,223,0.45) 35%, rgba(9,175,223,0.15) 70%, transparent 100%)',
                  }}
                />
                <ul className="list-none">
                  {[
                    { label: 'Home', href: '/' },
                    { label: 'About Us', href: '/about' },
                    { label: 'Services', href: '/services' },
                    { label: 'Portfolio', href: '/portfolio' },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[#ccc] hover:text-[#09afdf] font-normal block pb-2 text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <span className="block uppercase text-white text-sm font-semibold mb-1">Other Resources</span>
                <div
                  className="w-full h-px mb-3"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(9,175,223,0.7) 0%, rgba(9,175,223,0.45) 35%, rgba(9,175,223,0.15) 70%, transparent 100%)',
                  }}
                />
                <ul className="list-none">
                  {[
                    { label: 'Contact Us', href: '/contact' },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[#ccc] hover:text-[#09afdf] font-normal block pb-2 text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4 border-[#444]" />

        {/* Sub-footer: payments + copyright */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            <img
              src="/images/payments_accepted.png"
              alt="We accept payments via Credit Card (processed by Stripe.com), PayPal.com, Bank Transfers, and Bitcoin."
              className="inline-block h-[50px] opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          </div>
          <p className="text-sm text-[#999]">Copyright &copy; {new Date().getFullYear()} CodeBuilder, Inc.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
