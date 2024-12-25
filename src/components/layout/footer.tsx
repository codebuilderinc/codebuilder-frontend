import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTwitter,
  faFacebookSquare,
  faDribbble,
  faGithub,
} from '@fortawesome/free-brands-svg-icons'

const Footer: React.FC = () => {
  return (
    <footer className="flex bg-[#f3f4f6] pt-8 pb-6 text-[#333333]">
      <div className="container mx-auto py-4 px-8 md:px-20 lg:px-32">
        <div className="flex flex-wrap text-left lg:text-left">
          <div className="px-4">
            <h4 className="text-3xl font-normal text-blueGray-700">Let's keep in touch!</h4>
            <h5 className="text-lg mt-0 mb-2 text-[#777777]">
              Find us on any of these platforms, we respond 1-2 business days.
            </h5>
            <div className="flex mt-6 lg:mb-0 mb-6">
              <button
                className="bg-white shadow-xl font-normal h-10 w-10 flex items-center justify-center rounded-full outline-none focus:outline-none mr-2"
                type="button"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-[#1DA1F2]" />
              </button>
              <button
                className="bg-white shadow-lg font-normal h-10 w-10 flex items-center justify-center rounded-full outline-none focus:outline-none mr-2"
                type="button"
              >
                <FontAwesomeIcon icon={faFacebookSquare} className="text-[#1877F2]" />
              </button>
              <button
                className="bg-white shadow-lg font-normal h-10 w-10 flex items-center justify-center rounded-full outline-none focus:outline-none mr-2"
                type="button"
              >
                <FontAwesomeIcon icon={faDribbble} className="text-[#EA4C89]" />
              </button>
              <button
                className="bg-white shadow-lg font-normal h-10 w-10 flex items-center justify-center rounded-full outline-none focus:outline-none mr-2"
                type="button"
              >
                <FontAwesomeIcon icon={faGithub} className="text-[#181717]" />
              </button>
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="flex flex-wrap items-top mb-6">
              <div className="w-full lg:w-4/12 px-4 ml-auto">
                <span className="block uppercase text-blueGray-500 text-sm font-semibold mb-2">
                  Useful Links
                </span>
                <ul className="list-unstyled">
                  <li>
                    <a
                      className="text-[#777777] hover:text-[#666666] font-normal block pb-2 text-sm"
                      href="https://www.creative-tim.com/presentation?ref=njs-profile"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                      href="https://blog.creative-tim.com?ref=njs-profile"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                      href="https://www.github.com/creativetimofficial?ref=njs-profile"
                    >
                      Github
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                      href="https://www.creative-tim.com/bootstrap-themes/free?ref=njs-profile"
                    >
                      Free Products
                    </a>
                  </li>
                </ul>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <span className="block uppercase text-blueGray-500 text-sm font-semibold mb-2">
                  Other Resources
                </span>
                <ul className="list-unstyled">
                  <li>
                    <a
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                      href="https://github.com/creativetimofficial/notus-js/blob/main/LICENSE.md?ref=njs-profile"
                    >
                      MIT License
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                      href="https://creative-tim.com/terms?ref=njs-profile"
                    >
                      Terms &amp; Conditions
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                      href="https://creative-tim.com/privacy?ref=njs-profile"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block pb-2 text-sm"
                      href="https://creative-tim.com/contact-us?ref=njs-profile"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-1 border-blueGray-300" />
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-4/12 px-4 mx-auto text-center">
            <div className="text-sm text-blueGray-500 font-normal py-1">
              Copyright © <span id="get-current-year">2021</span>{' '}
              <a
                href="https://www.creative-tim.com/product/notus-js"
                className="text-blueGray-500 hover:text-gray-800"
                target="_blank"
                rel="noreferrer"
              >
                Notus JS
              </a>{' '}
              by{' '}
              <a
                href="https://www.creative-tim.com?ref=njs-profile"
                className="text-blueGray-500 hover:text-blueGray-800"
              >
                Creative Tim
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
