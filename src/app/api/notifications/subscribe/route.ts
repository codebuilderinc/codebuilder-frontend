import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json()

    console.log('Subscription data:', subscription)

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

    // Declare the variable outside the if-else block
    let newSubscription

    // Save the subscription to the database
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        endpoint: subscription.endpoint,
        type: subscription.type,
      },
    })

    if (existingSubscription) {
      // Update the existing record
      newSubscription = await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: { ipAddress, keys },
      })
    } else {
      // Create a new record
      newSubscription = await prisma.subscription.create({
        data: {
          type: subscription.type,
          endpoint: subscription.endpoint,
          ipAddress,
          keys,
        },
      })
    }

    // Respond with the new subscription
    return NextResponse.json(
      { message: 'Subscription added.', data: newSubscription },
      { status: 201 }
    )
  } catch (error) {
    console.log(error.stack)
    console.log('Error saving subscription:', error)
    return NextResponse.json({ error: 'Failed to save subscription.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
