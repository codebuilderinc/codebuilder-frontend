'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendar,
  faComments,
  faEnvelope,
  faFileLines,
  faHome,
  faReply,
  faSearchPlus,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faGooglePlus, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { Breadcrumbs, ActionButton, Separator } from '@/components/breadcrumbs'
import { BlogSidebar } from './blog-sidebar'

export function BlogPostPage() {
  return (
    <div className="text-[#323232] bg-white pb-16">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/', icon: <FontAwesomeIcon icon={faHome} className="text-[11px]" /> },
          { label: 'Blog' },
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main className="space-y-8">
            <article className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 lg:p-8">
              <h1 className="text-[34px] font-normal leading-[1.15] text-[#2a2a2a]">Blog Post</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-[#777]">
                <span className="inline-flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>12 May 2015</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} />
                  <span>by John Doe</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <FontAwesomeIcon icon={faComments} />
                  <span>22 comments</span>
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {['/template/images/blog-1.jpg', '/template/images/blog-3.jpg', '/template/images/blog-4.jpg'].map(
                  (src) => (
                    <div key={src} className="group relative overflow-hidden rounded-[3px]">
                      <Image src={src} alt="" width={1200} height={720} className="h-auto w-full" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-[160ms] ease-out group-hover:opacity-100">
                        <span className="rounded-full bg-white/90 p-3 text-[#444]">
                          <FontAwesomeIcon icon={faSearchPlus} />
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="prose prose-neutral mt-8 max-w-none text-[15px] leading-8 text-[#666]">
                <p>
                  Mauris dolor sapien, <Link href="#">malesuada at interdum ut</Link>, hendrerit eget lorem. Nunc
                  interdum mi neque, et sollicitudin purus fermentum ut. Suspendisse faucibus nibh odio, a vehicula eros
                  pharetra in. Maecenas ullamcorper commodo rutrum. In iaculis lectus vel augue eleifend dignissim.
                  Aenean viverra semper sollicitudin.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis ullam nemo itaque excepturi
                  suscipit unde repudiandae nesciunt ad voluptates minima recusandae illum exercitationem, neque, ut
                  totam ratione.
                </p>
                <ol>
                  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi, laboriosam tempore.</li>
                  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis odit est quae amet iure.</li>
                  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam aperiam vel cum quisquam enim.</li>
                  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo, eaque.</li>
                </ol>
                <blockquote>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                  </p>
                </blockquote>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus incidunt, beatae rem omnis
                  distinctio, dolor, praesentium impedit quisquam nobis pariatur nulla expedita aliquid repellendus
                  laudantium.
                </p>
              </div>

              <footer className="mt-8 flex flex-col gap-4 border-t border-[#efefef] pt-4 text-[13px] text-[#777] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {['tag 1', 'tag 2', 'long tag 3'].map((tag, index, array) => (
                    <span key={tag}>
                      <Link href="#" className="text-[#09afdf] hover:underline">
                        {tag}
                      </Link>
                      {index < array.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
                <ul className="flex gap-3">
                  {[faTwitter, faGooglePlus, faFacebook].map((icon, index) => (
                    <li key={index}>
                      <Link
                        href="#"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e3e3] text-[#666]"
                      >
                        <FontAwesomeIcon icon={icon} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </footer>
            </article>

            <section className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 lg:p-8">
              <h2 className="text-[30px] font-normal text-[#2f2f2f]">There are 3 comments</h2>
              <div className="mt-6 space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4 border-b border-[#f1f1f1] pb-6">
                    <Image
                      src="/template/images/avatar.jpg"
                      alt="Avatar"
                      width={60}
                      height={60}
                      className="h-[60px] w-[60px] rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <header>
                        <h3 className="text-[20px] font-normal text-[#2f2f2f]">Comment title</h3>
                        <div className="text-[13px] text-[#777]">By admin | Today, 12:31</div>
                      </header>
                      <p className="mt-3 text-[15px] leading-8 text-[#666]">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.
                      </p>
                      <Link
                        href="#"
                        className="mt-3 inline-flex items-center gap-2 text-[13px] text-[#444] hover:text-[#09afdf]"
                      >
                        <FontAwesomeIcon icon={faReply} />
                        <span>Reply</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 lg:p-8">
              <h2 className="text-[30px] font-normal text-[#2f2f2f]">Add your comment</h2>
              <form className="mt-6 space-y-5">
                {[
                  { label: 'Name', type: 'text', icon: faUser },
                  { label: 'Subject', type: 'text', icon: faFileLines },
                ].map((field) => (
                  <label key={field.label} className="block">
                    <span className="mb-2 block text-[14px] text-[#555]">{field.label}</span>
                    <div className="relative">
                      <input
                        className="w-full rounded-[3px] border border-[#ddd] px-4 py-3 pr-10 outline-none focus:border-[#09afdf]"
                        type={field.type}
                      />
                      <FontAwesomeIcon
                        icon={field.icon}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aaa]"
                      />
                    </div>
                  </label>
                ))}
                <label className="block">
                  <span className="mb-2 block text-[14px] text-[#555]">Message</span>
                  <div className="relative">
                    <textarea
                      rows={8}
                      className="w-full rounded-[3px] border border-[#ddd] px-4 py-3 pr-10 outline-none focus:border-[#09afdf]"
                    />
                    <FontAwesomeIcon icon={faEnvelope} className="absolute right-4 top-4 text-[#aaa]" />
                  </div>
                </label>
                <ActionButton variant="primary">Submit</ActionButton>
              </form>
            </section>
          </main>

          <BlogSidebar />
        </div>
      </section>
    </div>
  )
}
