import admin, { ServiceAccount } from 'firebase-admin'

const serviceAccount = process.env.GOOGLE_SERVICES_JSON ? JSON.parse(process.env.GOOGLE_SERVICES_JSON) : null

if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  })
}

export const messaging = admin.messaging()
