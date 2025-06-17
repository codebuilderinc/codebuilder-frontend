import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const errorPayload = await req.json()

    // Basic validation
    if (!errorPayload || typeof errorPayload.message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid error report payload. "message" is required.' },
        { status: 400 }
      )
    }

    // Extract data from the payload sent by the Expo app's 'reportError' service
    const { message, stack, platform, options } = errorPayload
    const { isFatal, errorInfo } = options || {}

    const newErrorReport = await prisma.errorReport.create({
      data: {
        message,
        stack: stack || null,
        platform: platform || null,
        isFatal: isFatal || null,
        errorInfo: errorInfo || null, // errorInfo from React Error Boundary
        payload: errorPayload, // Store the full original payload for auditing
      },
    })

    console.log('Error report logged:', newErrorReport.id)
    return NextResponse.json(
      { message: 'Error logged successfully.', reportId: newErrorReport.id },
      { status: 201 }
    )
  } catch (error) {
    // This catches errors in the API endpoint itself
    console.error('Failed to save error report:', error)

    // Avoid using 'error()' as a variable name to prevent shadowing
    const e = error as Error
    console.error(e.stack)

    return NextResponse.json(
      { error: 'Internal server error while saving error report.' },
      { status: 500 }
    )
  }
}
