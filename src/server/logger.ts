
import { NextRequest, NextResponse } from 'next/server'

/**
 * ANSI color codes for console output
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
	return `${color}${method.padEnd(7)}${colors.reset}`
}

/**
 * Format duration with appropriate color
 */
function getColoredDuration(ms: number): string {
	let color = colors.green
	if (ms > 1000) color = colors.red
	else if (ms > 500) color = colors.yellow
	else if (ms > 100) color = colors.cyan

	return `${color}${ms.toFixed(0)}ms${colors.reset}`
}

/**
 * Get client IP address from various headers
 */
function getClientIP(request: NextRequest): string {
	const xForwardedFor = request.headers.get('x-forwarded-for')
	const xRealIP = request.headers.get('x-real-ip')
	const cfConnectingIP = request.headers.get('cf-connecting-ip')

	if (xForwardedFor) {
		return xForwardedFor.split(',')[0].trim()
	}

	if (xRealIP) return xRealIP
	if (cfConnectingIP) return cfConnectingIP

	return 'unknown'
}

/**
 * Log API route request and response
 */
export function logAPIRoute(
	request: NextRequest,
	response: NextResponse,
	startTime: number,
	additionalInfo?: string
): void {
	const endTime = Date.now()
	const duration = endTime - startTime
	const status = response.status
	const method = request.method
	const url = request.url
	const clientIP = getClientIP(request)
	const timestamp = new Date().toISOString()

	// Main log line
	console.log(
		`${colors.gray}[${timestamp}]${colors.reset} ` +
			`${getColoredMethod(method)} ` +
			`${colors.cyan}${url}${colors.reset} ` +
			`${getColoredStatus(status)} ` +
			`${getColoredDuration(duration)} ` +
			`${colors.gray}from ${clientIP}${colors.reset}` +
			(additionalInfo ? ` ${colors.dim}(${additionalInfo})${colors.reset}` : '')
	)
}

/**
 * Higher-order function to wrap API route handlers with logging
 */
export function withLogging<T extends any[]>(
	handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
	return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
		const startTime = Date.now()

		try {
			const response = await handler(request, ...args)
			logAPIRoute(request, response, startTime)
			return response
		} catch (error) {
			// Create error response
			const errorResponse = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })

			logAPIRoute(request, errorResponse, startTime, `Error: ${error}`)
			throw error
		}
	}
}

/**
 * Simple logger for general application logs
 */
export const logger = {
	info: (message: string, ...args: any[]) => {
		console.log(`${colors.blue}[INFO]${colors.reset} ${message}`, ...args)
	},

	warn: (message: string, ...args: any[]) => {
		console.log(`${colors.yellow}[WARN]${colors.reset} ${message}`, ...args)
	},

	error: (message: string, ...args: any[]) => {
		console.log(`${colors.red}[ERROR]${colors.reset} ${message}`, ...args)
	},

	success: (message: string, ...args: any[]) => {
		console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`, ...args)
	},

	debug: (message: string, ...args: any[]) => {
		if (process.env.NODE_ENV === 'development') {
			console.log(`${colors.gray}[DEBUG]${colors.reset} ${message}`, ...args)
		}
	},
}
