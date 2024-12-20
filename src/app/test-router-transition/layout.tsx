import localFont from 'next/font/local'
import { Debug } from '@/components/test-router-transition/debug'
import { Providers } from './providers'
import './styles.css'

export const metadata = {
  title: 'Transition Router - page transitions in Next.js App Router',
  description:
    'Easily add animated transitions between pages using Next.js App Router and your favorite animation library.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {children}
      <Debug />
    </Providers>
  )
}
