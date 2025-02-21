/**
 * Imports for web push, Firebase messaging, Prisma ORM, and type definitions.
 */
import webpush, { WebPushError } from 'web-push'
import { messaging } from './firebase' // Adjust as needed
import { Subscription } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'
import prisma from '@/lib/db'

/**
 * Sends a push notification to a subscription using either web push (VAPID) or FCM.
 *
 * @param subscription - The subscription record, which can be either WebSubscription or FcmSubscription.
 * @param notificationPayload - The notification payload containing title, body, url, etc.
 *
 * If the subscription type is 'web', it will send a web push notification.
 * If the subscription type is 'fcm', it will send an FCM notification.
 * If the subscription is invalid (e.g., expired or unregistered), it will be removed from the database.
 */
export async function sendNotification(
  subscription: SubscriptionRecord,
  notificationPayload: NotificationPayload
): Promise<void> {
  try {
    console.log('Sending notification to subscription:', subscription)

    // Handle browser-based web push notifications.
    if (subscription.type === 'web') {
      // Validate that the subscription keys match the structure required by web push.
      if (!isWebKeys(subscription.keys)) {
        throw new Error(`Invalid keys for web subscription: ${JSON.stringify(subscription.keys)}`)
      }

      // Construct and send a web push notification.
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
    }
    // Handle mobile push notifications using Firebase Cloud Messaging.
    else if (subscription.type === 'fcm') {
      // Validate that the subscription keys match the structure required by FCM.
      if (!isFcmKeys(subscription.keys)) {
        throw new Error(`Invalid keys for FCM subscription: ${JSON.stringify(subscription.keys)}`)
      }

      // Construct the FCM message.
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
            sound: 'notification', // Must match the file name (typically without the extension) in res/raw/
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'notification', // For iOS, if needed
            },
          },
        },
      }

      // Send the FCM message using Firebase.
      const response = await messaging.send(fcmMessage)
      console.log('FCM response:', response)
    }
  } catch (error) {
    /**
     * Handle errors appropriately. Depending on the type of subscription,
     * remove invalid or expired subscriptions from the database if necessary.
     */
    if (subscription.type === 'web' && error instanceof WebPushError) {
      // Status code 410 indicates that the subscription is no longer valid.
      if (error.statusCode === 410) {
        await prisma.subscription.delete({ where: { id: subscription.id } })
        console.log(`Subscription with id ${subscription.id} removed due to expiration.`)
      } else {
        console.log(
          `Failed to send notification to subscription id ${subscription.id}:`,
          error.statusCode,
          error.body
        )
      }
    } else if (subscription.type === 'fcm') {
      // These error codes indicate an invalid or unregistered FCM token.
      if (
        error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered'
      ) {
        await prisma.subscription.delete({ where: { id: subscription.id } })
        console.log(`Removed invalid FCM token for subscription id ${subscription.id}.`)
      } else {
        console.log(`Failed to send FCM notification to subscription id ${subscription.id}:`, error)
      }
    } else {
      console.log(
        `An error occurred while sending notification to subscription id ${subscription.id}:`,
        error
      )
    }
  }
}

/**
 * An interface that extends the Prisma Subscription model for 'web' subscriptions.
 * This includes the additional `type` and `keys` fields relevant to web push subscriptions.
 */
export interface WebSubscription extends Subscription {
  type: 'web'
  // The keys stored as JsonValue actually correspond to { auth: string; p256dh: string }
  keys: JsonValue
}

/**
 * An interface that extends the Prisma Subscription model for 'fcm' subscriptions.
 * This includes the additional `type` and `keys` fields relevant to Firebase Cloud Messaging subscriptions.
 */
export interface FcmSubscription extends Subscription {
  type: 'fcm'
  // The keys stored as JsonValue actually correspond to { token: string }
  keys: JsonValue
}

/**
 * A union type that represents either a WebSubscription or an FcmSubscription.
 * Used for handling either type of push subscription in a unified way.
 */
export type SubscriptionRecord = WebSubscription | FcmSubscription

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
