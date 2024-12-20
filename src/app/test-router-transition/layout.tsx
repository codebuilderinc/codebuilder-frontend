import localFont from 'next/font/local'
import { Header } from '@/components/layout/header'
import { Debug } from '@/components/debug'
import { Providers } from './../providers'
import './styles.css'

export const metadata = {
  title: 'Transition Router - page transitions in Next.js App Router',
  description:
    'Easily add animated transitions between pages using Next.js App Router and your favorite animation library.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <Debug />
        </Providers>
      </body>
    </html>
  )
}
