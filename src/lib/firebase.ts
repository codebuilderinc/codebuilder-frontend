import admin, { ServiceAccount } from 'firebase-admin'
import serviceAccount from './../../google-services.json' // Update with the path to your key

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as string | ServiceAccount),
  })
}

export const messaging = admin.messaging()
