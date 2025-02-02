import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import webpush, { WebPushError } from 'web-push'
import { messaging } from 'firebase-admin'
import { sendNotification, SubscriptionRecord } from '../../../lib/notifications'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { title, body, url } = await request.json()

    if (!title || !body || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Retrieve all subscriptions for sending notifications
    const subscriptions = await prisma.subscription.findMany()

    // Build your unified payload object
    const notificationPayload = {
      title: `${title}`,
      body: body,
      url: url,
      icon: 'https://new.codebuilder.org/images/logo2.png',
      badge: 'https://new.codebuilder.org/images/logo2.png',
    }

    // Loop and send notifications concurrently
    const notificationPromises = subscriptions.map((sub) =>
      sendNotification(sub, notificationPayload)
    )

    // Wait for all notifications to complete
    await Promise.all(notificationPromises)

    return NextResponse.json({ success: true, message: 'Notifications sent successfully' })
  } catch (error) {
    console.error('Error sending notifications:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
