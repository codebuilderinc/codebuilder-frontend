import { NextResponse } from 'next/server'

export async function GET() {
  // Log environment variables to the server console
  console.log('DATABASE_URL:', process.env.DATABASE_URL)
  console.log('VAPID_PRIVATE_KEY:', process.env.VAPID_PRIVATE_KEY)

  // Return environment variables in the response
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL,
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    // Add other environment variables you want to debug
  })
}
