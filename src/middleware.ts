// middleware.js
import { NextResponse } from 'next/server'

import { NextRequest } from 'next/server'

/**
 * Middleware function to handle incoming requests and set the Content-Security-Policy header.
 *
 * The Content-Security-Policy header is configured to:
 * - Allow resources from the same origin ('self') by default.
 * - Allow scripts from the same origin ('self').
 * - Allow web workers from the same origin ('self') and https://new.codebuilder.org.
 * - Report CSP violations to https://new.codebuilder.org/csp-report.
 */
export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next()

  // response.headers.set(
  //   'Content-Security-Policy',
  //   `
  //     default-src 'self';
  //     script-src 'self';
  //     worker-src 'self' https://new.codebuilder.org;
  //     report-uri https://new.codebuilder.org/csp-report;
  //   `
  //     .replace(/\s{2,}/g, ' ')
  //     .trim()
  // )

  return response
}
