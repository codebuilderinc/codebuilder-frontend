import { NextRequest, NextResponse } from 'next/server'
import { withLogging } from '@/server/logger'

export const GET = withLogging(async (request: NextRequest) => {
  return NextResponse.json({
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  })
})
