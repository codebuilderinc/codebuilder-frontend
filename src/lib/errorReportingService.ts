import { ErrorInfo } from 'react'
import { logger } from '@/lib/logger'

// This is the relative path to the API endpoint we created.
const ERROR_REPORTING_ENDPOINT = 'https://api.codebuilder.org/errors'

interface ReportOptions {
  isFatal?: boolean
  errorInfo?: ErrorInfo
  // You can add more web-specific context here if needed
  // e.g., userAgent, screenResolution, etc.
}

/**
 * Sends a client-side error report to the Next.js API endpoint.
 * @param error The error object.
 * @param options An object containing additional context.
 */
export const reportError = async (error: Error, options?: ReportOptions): Promise<void> => {
  const report = {
    message: error.message,
    stack: error.stack,
    errorInfo: options?.errorInfo || null,
    isFatal: options?.isFatal || false,
    platform: 'web', // Identify that the error came from the web client
    options,
  }

  try {
    await fetch(ERROR_REPORTING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    })
  } catch (e) {
    logger.error('Failed to send error report:', e)
  }
}
