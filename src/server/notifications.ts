import webpush, { WebPushError } from 'web-push'
import { messaging } from '@/server/firebase'
import { Subscription } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'
import prisma from '@/server/db'
import { logger } from '@/server/logger'

// Initialize VAPID keys for web push notifications
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

/**
 * The payload for the notification, including title, body, url, icon, and badge.
 * Used for constructing messages for both web push and FCM.
 */
interface NotificationPayload {
  title: string
  body: string
  url: string
  icon?: string
  badge?: string
}


export async function sendNotification(
  subscription: Subscription,
  notificationPayload: NotificationPayload
): Promise<void> {
  try {
    logger.info('Sending notification to subscription:', subscription)
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
        android: {
          notification: {
            sound: 'notification',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'notification',
            },
          },
        },
      }
      const response = await messaging.send(fcmMessage)
      logger.info('FCM response:', response)
    }
  } catch (error) {
    if (subscription.type === 'web' && error instanceof WebPushError) {
      // Handle invalid subscription
    }
    throw error
  }
}



/**
 * Type guard to check if the given JsonValue matches
 * the structure required by a web push subscription ({ auth, p256dh }).
 *
 * @param keys The JsonValue that should contain web push keys.
 * @returns True if the object has valid auth and p256dh strings; otherwise, false.
 */
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

/**
 * Type guard to check if the given JsonValue matches
 * the structure required by an FCM subscription ({ token }).
 *
 * @param keys The JsonValue that should contain the FCM token.
 * @returns True if the object has a valid token string; otherwise, false.
 */
export function isFcmKeys(keys: JsonValue): keys is { token: string } {
  return (
    typeof keys === 'object' &&
    keys !== null &&
    'token' in keys &&
    typeof (keys as any).token === 'string'
  )
}
