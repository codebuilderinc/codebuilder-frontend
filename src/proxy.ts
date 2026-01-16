// src/middleware.ts
import { NextResponse, NextRequest } from 'next/server'
import { logger } from '@/server/logger'

/**
 * ANSI color codes for console output in Docker
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
}

/**
 * Get colored status code based on HTTP status
 */
function getColoredStatus(status: number): string {
  let color = colors.gray
  if (status >= 200 && status < 300) color = colors.green
  else if (status >= 300 && status < 400) color = colors.yellow
  else if (status >= 400 && status < 500) color = colors.red
  else if (status >= 500) color = colors.red + colors.bright

  return `${color}${status}${colors.reset}`
}

/**
 * Get colored HTTP method
 */
function getColoredMethod(method: string): string {
  const methodColors: Record<string, string> = {
    GET: colors.green,
    POST: colors.blue,
    PUT: colors.yellow,
    DELETE: colors.red,
    PATCH: colors.magenta,
    HEAD: colors.cyan,
    OPTIONS: colors.gray,
  }

  const color = methodColors[method] || colors.white
  return `${color}${method}${colors.reset}`
}

/**
 * Format duration with appropriate color
 */
function getColoredDuration(ms: number): string {
  let color = colors.green
  if (ms > 1000) color = colors.red
  else if (ms > 500) color = colors.yellow
  else if (ms > 100) color = colors.cyan

  // Show sub-millisecond precision if < 10ms
  const formatted = ms < 10 ? ms.toFixed(2) : ms < 100 ? ms.toFixed(1) : ms.toFixed(0)
  return `${color}${formatted}ms${colors.reset}`
}

/**
 * Get client IP address from various headers
 */
function getClientIP(request: NextRequest): string {
  // In Docker with nginx as reverse proxy, ensure nginx sets X-Forwarded-For and X-Real-IP headers
  const xForwardedFor = request.headers.get('x-forwarded-for')
  const xRealIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')

  if (xForwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return xForwardedFor.split(',')[0].trim()
  }

  if (xRealIP) return xRealIP
  if (cfConnectingIP) return cfConnectingIP

  // Fallback to connection remote address (usually won't work in Docker)
  return 'unknown'
}

/**
 * Check if the request should be logged
 */
function shouldLog(pathname: string): boolean {
  // Skip logging for static assets and Next.js internal routes
  const skipPatterns = [
    '/_next/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/.well-known/',
    '/api/health',
    '/health',
  ]

  return !skipPatterns.some((pattern) => pathname.startsWith(pattern))
}

/**
 * Enhanced middleware function with comprehensive HTTP access logging
 */
export function proxy(request: NextRequest): NextResponse {
  // Use Date.now() for Edge Runtime compatibility
  const startTime = Date.now()
  const { pathname, search } = request.nextUrl
  const method = request.method
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const referer = request.headers.get('referer') || '-'
  const clientIP = getClientIP(request)

  // Create response (middleware runs before routing, so final status is unknown here)
  const response = NextResponse.next()

  // Only log if this request should be logged
  if (shouldLog(pathname)) {
    // Add a custom header to track response time (in ms)
    response.headers.set('x-request-start', startTime.toString())

    // Log the request immediately (before processing)
    const timestamp = new Date().toISOString()
    const fullUrl = pathname + search
    // We can't know the final route status in middleware; avoid logging a misleading 200
    // Calculate duration in ms
    const duration = Date.now() - startTime

    logger.info(
      `${colors.gray}[${timestamp}]${colors.reset} ` +
        `${getColoredMethod(method)} ` +
        `${getColoredDuration(duration)} ` +
        `${colors.cyan}${fullUrl}${colors.reset} ` +
        `${colors.gray}from ${clientIP}${colors.reset} ` +
        `${colors.dim}(pre-route)${colors.reset}`
    )

    // Log additional details in development
    if (process.env.NODE_ENV === 'development') {
      logger.info(`${colors.dim}  └─ UA: ${userAgent}${colors.reset}`)
      if (referer !== '-') {
        logger.info(`${colors.dim}  └─ Referer: ${referer}${colors.reset}`)
      }
    }
  }

  return response
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
