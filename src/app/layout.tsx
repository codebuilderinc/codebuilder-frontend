import type { Metadata } from 'next'
import '@/assets/css/globals.css'
import Header from '@/components/layout/header'
import { geistMono, geistSans, Raleway } from './fonts'
import 'animate.css/animate.min.css'
//import LoadingBar from './LoadingBar'
import { LayoutTransition } from '@/components/layout/layout-transition'
import Script from 'next/script'
import Footer from '../components/layout/footer'
// Import the components we created
import ErrorBoundary from '@/components/ErrorBoundary'
import GlobalErrorHandler from '@/components/GlobalErrorHandler'

export const metadata: Metadata = {
  title: 'CodeBuilder, Inc. - Software Engineering Solutions.',
  description:
    'Custom software engineering solutions that are elegantly designed with scalability in mind.',
  openGraph: {
    title: 'CodeBuilder, Inc. - Software Engineering Solutions.',
    description:
      'Custom software engineering solutions that are elegantly designed with scalability in mind..',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Hack to fix Flashing Of Unused Content (FOUC). (TODO: Fix Hydration Warning) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
        try {
          if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        } catch (_) {}
      `,
          }}
        />

        {/* Microsoft Clarity Script */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "p3rrobsb5t");
          `}
        </Script>

        {/* Other Meta Tags, Links, Etc... */}
        
        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                  console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                  console.error('Service Worker registration failed:', error);
                });
            }
          `}
        </Script>
      </head>
      <body className={`${Raleway.className} antialiased bg-white`}>
        {/*
          The GlobalErrorHandler is an invisible component that sets up
          window-level event listeners for catching uncaught errors.
        */}
        <GlobalErrorHandler />
        <div className="flex flex-col min-h-screen">
          <Header />
          <LayoutTransition
            initial={{ opacity: 0 }}
            animate={{ x: 100, opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute' }}
          >
            {/* Main content area */}
            <main className="flex text-black bg-white">
              {' '}
              {/*
                The ErrorBoundary wraps your entire application. It will catch
                any rendering errors and display a fallback UI instead of crashing.
              */}
              <ErrorBoundary>
                <div className="w-screen">{children}</div>
              </ErrorBoundary>
            </main>
            {/* Footer */}
            <Footer />
          </LayoutTransition>
        </div>
      </body>
    </html>
  )
}
