import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/server/db'
import { withLogging, logger } from '@/server/logger'
import { log } from 'console'

export const POST = withLogging(async (request: NextRequest) => {
  try {
    const errorPayload = await request.json()

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

    logger.info('Received error report:', {
      message,
      platform,
      isFatal,
      errorInfo,
      stack: stack || 'No stack trace provided',
      originalPayload: errorPayload, // Log the full original payload for auditing
    })

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

    return NextResponse.json(
      { message: 'Error logged successfully.', reportId: newErrorReport.id },
      { status: 201 }
    )
  } catch (error) {
    // This catches errors in the API endpoint itself
    logger.error('Failed to save error report:', error)

    // Avoid using 'error()' as a variable name to prevent shadowing
    const e = error as Error
    logger.error(e.stack)

    return NextResponse.json(
      { error: 'Internal server error while saving error report.' },
      { status: 500 }
    )
  }
})
