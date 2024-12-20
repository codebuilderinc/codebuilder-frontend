import Image from 'next/image'
import VideoPlayer from '../../components/video-player'

export default function About() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      {/* Hero Slider */}
      <div className="relative top-[-75px] w-screen h-[375px] overflow-hidden bg-black">
        <div className="opacity-40">
          <VideoPlayer
            mp4Src="/videos/macbook-typing-about-us.mp4"
            webmSrc="/videos/macbook-typing-about-us.webm"
            posterSrc="/videos/cover-images/macbook-typing-poster.jpg"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="z-10 flex items-center sm:items-start ">
        <div className="flex w-screen">
          <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2">
              Get started by editing{' '}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                src/app/page.tsx
              </code>
              .
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>

          <div className="flex items-center sm:flex-row">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="dark:invert"
                src="https://nextjs.org/icons/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our docs
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
