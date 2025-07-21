// public/service-worker.js

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || 'https://new.codebuilder.org/images/logo2.png', // Use a default icon if none is specified
      badge: data.badge || 'https://new.codebuilder.org/images/logo2.png',
      data: { url: data.url },
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})
