import webpush, { WebPushError } from 'web-push'
import { messaging } from './firebase' // Adjust as needed
import { PrismaClient, Subscription } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

// Interfaces extending the Prisma Subscription type
export interface WebSubscription extends Subscription {
  type: 'web'
  keys: JsonValue // Represents { auth: string; p256dh: string } as JsonValue
}

// Interface extending the Prisma Subscription type
export interface FcmSubscription extends Subscription {
  type: 'fcm'
  keys: JsonValue // Represents { token: string } as JsonValue
}

// Union type covering both subscription types
export type SubscriptionRecord = WebSubscription | FcmSubscription

// Notification payload interface
interface NotificationPayload {
  title: string
  body: string
  url: string
  icon?: string
  badge?: string
}

// Helper function to validate web keys
export function isWebKeys(keys: JsonValue): keys is { auth: string; p256dh: string } {
  return (
    typeof keys === 'object' &&
    keys !== null &&
    'auth' in keys &&
    'p256dh' in keys &&
    typeof (keys as any).auth === 'string' &&
    typeof (keys as any).p256dh === 'string'
  )
}

// Helper function to validate FCM keys
export function isFcmKeys(keys: JsonValue): keys is { token: string } {
  return (
    typeof keys === 'object' &&
    keys !== null &&
    'token' in keys &&
    typeof (keys as any).token === 'string'
  )
}

// Unified function to send notifications
export async function sendNotification(
  subscription: SubscriptionRecord,
  notificationPayload: NotificationPayload
): Promise<void> {
  try {
    console.log('Sending notification to subscription:', subscription)

    if (subscription.type === 'web') {
      if (!isWebKeys(subscription.keys)) {
        throw new Error(`Invalid keys for web subscription: ${JSON.stringify(subscription.keys)}`)
      }

      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            auth: subscription.keys.auth,
            p256dh: subscription.keys.p256dh,
          },
        },
        JSON.stringify({
          title: notificationPayload.title,
          body: notificationPayload.body,
          icon: notificationPayload.icon,
          badge: notificationPayload.badge,
          url: notificationPayload.url,
        })
      )
    } else if (subscription.type === 'fcm') {
      if (!isFcmKeys(subscription.keys)) {
        throw new Error(`Invalid keys for FCM subscription: ${JSON.stringify(subscription.keys)}`)
      }

      const fcmMessage = {
        notification: {
          title: notificationPayload.title,
          body: notificationPayload.body,
        },
        data: {
          url: notificationPayload.url,
        },
        token: subscription.keys.token,
      }

      const response = await messaging.send(fcmMessage)
      console.log('FCM response:', response)
    }
  } catch (error) {
    if (subscription.type === 'web' && error instanceof WebPushError) {
      if (error.statusCode === 410) {
        await prisma.subscription.delete({ where: { id: subscription.id } })
        console.log(`Subscription with id ${subscription.id} removed due to expiration.`)
      } else {
        console.log(
          `Failed to send notification to subscription id ${subscription.id}:`,
          error.statusCode,
          error.body
        ) //error()
      }
    } else if (subscription.type === 'fcm') {
      // Handle FCM-specific errors
      if (
        error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered'
      ) {
        // Remove the invalid token from the database
        await prisma.subscription.delete({ where: { id: subscription.id } })
        console.log(`Removed invalid FCM token for subscription id ${subscription.id}.`)
      } else {
        console.log(`Failed to send FCM notification to subscription id ${subscription.id}:`, error) //error()
      }
    } else {
      console.log(
        `An error occurred while sending notification to subscription id ${subscription.id}:`,
        error
      ) //error()
    }
  }
}
