import { App, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

function getServiceAccount() {
  const rawServiceAccount = process.env.GOOGLE_SERVICES_JSON

  if (!rawServiceAccount) {
    return null
  }

  return JSON.parse(rawServiceAccount)
}

export function getFirebaseApp(): App {
  const existingApp = getApps()[0]

  if (existingApp) {
    return existingApp
  }

  const serviceAccount = getServiceAccount()

  if (!serviceAccount) {
    throw new Error('Firebase Admin is not configured. Set GOOGLE_SERVICES_JSON before using FCM.')
  }

  return initializeApp({
    credential: cert(serviceAccount),
  })
}

export function getFirebaseMessaging() {
  return getMessaging(getFirebaseApp())
}
