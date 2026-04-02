'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faCalendar, faComments, faHome, faUser } from '@fortawesome/free-solid-svg-icons'
import { blogPosts } from '@/components/blog/data'
import { cn } from '@/lib/cn'
import { Breadcrumbs, Separator } from '@/components/breadcrumbs'
import { BlogSidebar } from '@/components/blog/blog-sidebar'

function BlogPostCard({ post }: { post: (typeof blogPosts)[number] }) {
  return (
    <article className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-5 lg:p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          {post.type === 'slider' ? (
            <div className="space-y-3">
              {post.images?.map((image) => (
                <div key={image} className="group relative overflow-hidden rounded-[3px]">
                  <Image src={image} alt="" width={900} height={560} className="h-auto w-full" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-[160ms] ease-out group-hover:opacity-100">
                    <Link href={`/blog/${post.slug}`} className="rounded-full bg-white/90 p-3 text-[#444]">
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {post.type === 'image' ? (
            <div className="group relative overflow-hidden rounded-[3px]">
              <Image
                src={post.image ?? '/template/images/blog-2.jpg'}
                alt=""
                width={900}
                height={560}
                className="h-auto w-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-[160ms] ease-out group-hover:opacity-100">
                <Link href={`/blog/${post.slug}`} className="rounded-full bg-white/90 p-3 text-[#444]">
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </Link>
              </div>
            </div>
          ) : null}

          {post.type === 'audio' ? (
            <iframe
              className="h-[166px] w-full rounded-[3px] border-0"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/231321623&color=ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false"
              title="Audio post"
            />
          ) : null}

          {post.type === 'video' ? (
            <div className="aspect-video overflow-hidden rounded-[3px] bg-black">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/91J8pLHdDB0"
                title="Blog video"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>

        <div>
          <header>
            <h2 className="text-[30px] font-normal leading-tight text-[#2f2f2f]">
              <Link href={`/blog/${post.slug}`} className="hover:text-[#09afdf]">
                {post.title}
              </Link>
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-[#777]">
              <span className="inline-flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendar} />
                <span>
                  {post.dateDay} {post.dateMonth}
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} />
                <span>by {post.author}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <FontAwesomeIcon icon={faComments} />
                <span>{post.comments}</span>
              </span>
            </div>
          </header>
          <div className="mt-5 text-[15px] leading-8 text-[#666]">{post.excerpt}</div>
        </div>
      </div>
      <footer className="mt-6 flex flex-col gap-4 border-t border-[#efefef] pt-4 text-[13px] text-[#777] sm:flex-row sm:items-center sm:justify-between">
        <div>
          {post.tags.map((tag, index) => (
            <span key={tag}>
              <Link href="#" className="text-[#09afdf] hover:underline">
                {tag}
              </Link>
              {index < post.tags.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
        <Link href={`/blog/${post.slug}`} className="text-[#09afdf] hover:underline">
          Read More
        </Link>
      </footer>
    </article>
  )
}

export default function BlogPage() {
  return (
    <div className="text-[#323232] bg-white pb-16">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/', icon: <FontAwesomeIcon icon={faHome} className="text-[11px]" /> },
          { label: 'Blog' },
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main className="space-y-6">
            <div>
              <h1 className="text-[34px] font-normal leading-[1.15] text-[#2a2a2a] flex items-center gap-3">
                <FontAwesomeIcon icon={faComments} />
                <span>CodeBuilder Inc. Blog</span>
              </h1>
              <Separator />
            </div>
            {blogPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}

            <nav>
              <ul className="flex flex-wrap gap-2 text-[14px]">
                {['1', '2', '3', '4', '5'].map((page, index) => (
                  <li key={page}>
                    <Link
                      href="#"
                      className={cn(
                        'inline-flex h-10 min-w-10 items-center justify-center rounded-[3px] border px-3',
                        index === 0 ? 'border-[#09afdf] bg-[#09afdf] text-white' : 'border-[#e0e0e0] text-[#666]'
                      )}
                    >
                      {page}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </main>

          <BlogSidebar />
        </div>
      </section>
    </div>
  )
}
