import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    // Simulate network delay for realistic loading indicator
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock successful response
    // In production, this would send an email via a service like SendGrid,
    // Resend, or forward to the Laravel backend at /contact/submit
    console.log('[Contact Form] New submission:', {
      name,
      email,
      subject,
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, message: 'Your message has been sent successfully.' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 })
  }
}
