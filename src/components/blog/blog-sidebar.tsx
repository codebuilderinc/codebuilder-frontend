'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListAlt } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { blogCategories } from './data'
import { cn } from '@/lib/cn'
import { faList, faHome, faPhone, faSave, faGauge, faQrcode, faBook } from '@fortawesome/free-solid-svg-icons'

export function BlogSidebar() {
  return (
    <aside className="space-y-8">
      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6">
        <h3 className="text-[22px] font-normal text-[#2f2f2f] flex items-center gap-3">
          <FontAwesomeIcon icon={faListAlt} className="text-[20px]" />
          <span>Categories</span>
        </h3>
        <div className="separator-2" aria-hidden="true" />
        <ul className="mt-5 space-y-2">
          {blogCategories.map((category, index) => (
            <li key={category}>
              <Link
                href="#"
                className={cn(
                  'flex items-center gap-3 rounded-[3px] px-4 py-3 text-[14px] transition-colors',
                  index === 0 ? 'bg-[#09afdf] text-white' : 'text-[#666] hover:bg-[#f7fafb] hover:text-[#09afdf]'
                )}
              >
                <FontAwesomeIcon
                  icon={
                    index === 0
                      ? faList
                      : ([faList, faHome, faPhone, faSave, faGauge, faQrcode, faBook][index] ?? faList)
                  }
                />
                <span>{category}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6">
        <h3 className="text-[22px] font-normal text-[#2f2f2f]">Featured Project</h3>
        <div className="separator-2" aria-hidden="true" />
        <div className="mt-5 space-y-4">
          {[
            '/template/images/portfolio-5.jpg',
            '/template/images/portfolio-1-2.jpg',
            '/template/images/portfolio-1-3.jpg',
          ].map((src) => (
            <div key={src} className="overflow-hidden rounded-[3px] border border-[#ececec]">
              <Image src={src} alt="" width={700} height={420} className="h-auto w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6">
        <h3 className="text-[22px] font-normal text-[#2f2f2f]">Latest tweets</h3>
        <div className="separator-2" aria-hidden="true" />
        <ul className="mt-5 space-y-4 text-[14px] leading-6 text-[#666]">
          {[1, 2].map((item) => (
            <li key={item} className="flex gap-3">
              <FontAwesomeIcon icon={faTwitter} className="mt-1 text-[#1DA1F2]" />
              <div>
                <p>
                  <Link href="#" className="text-[#09afdf]">
                    @lorem
                  </Link>{' '}
                  ipsum dolor sit amet, consectetur adipisicing elit. Mollitia, aliquid, et molestias nesciunt{' '}
                  <Link href="#" className="text-[#09afdf]">
                    http://t.co/dzLEYGeEH9
                  </Link>
                  .
                </p>
                <span className="text-[12px] text-[#999]">16 hours ago</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6">
        <h3 className="text-[22px] font-normal text-[#2f2f2f]">Popular Tags</h3>
        <div className="separator-2" aria-hidden="true" />
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            'energy',
            'business',
            'food',
            'fashion',
            'finance',
            'culture',
            'health',
            'sports',
            'technology',
            'support',
          ].map((tag) => (
            <span key={tag} className="rounded-[3px] border border-[#e6e6e6] px-3 py-1 text-[13px] text-[#666]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
