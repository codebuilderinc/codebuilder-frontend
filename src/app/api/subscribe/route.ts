import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json()

    // Validate required fields
    if (!subscription.endpoint || !subscription.type) {
      return NextResponse.json({ error: 'Invalid subscription data.' }, { status: 400 })
    }

    if (subscription.type === 'fcm') {
      if (!subscription.keys?.token) {
        return NextResponse.json(
          { error: 'Invalid FCM subscription data: missing token.' },
          { status: 400 }
        )
      }
    } else if (subscription.type === 'web') {
      if (!subscription.keys?.p256dh || !subscription.keys?.auth) {
        return NextResponse.json(
          { error: 'Invalid web-push subscription data: missing keys.' },
          { status: 400 }
        )
      }
    }

    // Get the IP address from the headers
    const forwardedFor = req.headers.get('x-forwarded-for') || ''
    const ipAddress = forwardedFor.split(',')[0].trim() || 'Unknown'

    // Serialize keys if necessary
    const keys = subscription.keys ?? {}

    // Save the subscription to the database
    const newSubscription = await prisma.subscription.upsert({
      where: {
        endpoint_type_keys: {
          endpoint: subscription.endpoint,
          type: subscription.type,
          keys, // Ensure this matches your schema
        },
      },
      update: {
        ipAddress,
        keys, // Update any fields that might have changed
      },
      create: {
        type: subscription.type,
        endpoint: subscription.endpoint,
        ipAddress,
        keys,
      },
    })

    // Respond with the new subscription
    return NextResponse.json(
      { message: 'Subscription added.', data: newSubscription },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving subscription:', error)
    return NextResponse.json({ error: 'Failed to save subscription.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
