import { NextResponse } from 'next/server'
import { checkRedditMessages } from '@/lib/reddit'

export async function GET() {
  try {
    const newMessages = await checkRedditMessages()
    return NextResponse.json({
      success: true,
      count: newMessages.length,
      messages: newMessages,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
