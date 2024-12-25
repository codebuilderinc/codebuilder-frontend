import { Pacifico as PacificoFont } from 'next/font/google'
import localFont from 'next/font/local'
import { Roboto as RobotoFont } from 'next/font/google'
import { Raleway as RalewayFont } from 'next/font/google'
import { Open_Sans } from 'next/font/google'

export const OpenSans = Open_Sans({
  subsets: ['latin'], // Add other subsets as needed
  weight: ['400', '700'], // Define weights (optional)
})

// Load the font at the module level
export const Raleway = RalewayFont({
  subsets: ['latin'], // Add other subsets as needed
  weight: ['400', '700'], // Define weights (optional)
})

// Load the font at the module level
export const Roboto = RobotoFont({
  subsets: ['latin'], // You can add more subsets like 'latin-ext'
  weight: ['400', '700'], // Define weights (optional)
})

export const geistSans = localFont({
  src: './../assets/fonts/GeistVF.woff', //'GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

export const geistMono = localFont({
  src: './../assets/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})
export const Pacifico = PacificoFont({
  subsets: ['latin'], // You can include 'latin' or other subsets
  weight: '400', // Specify the font weight (optional)
})
