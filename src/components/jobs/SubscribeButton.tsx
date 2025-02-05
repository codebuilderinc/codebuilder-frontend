import React from 'react'

const SubscribeButton: React.FC = () => {
  const subscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      // Convert PushSubscription to plain object
      const subData = {
        ...JSON.parse(JSON.stringify(subscription)),
        type: 'web', // Add type explicitly
      }

      console.log('Subscribing to notifications:', subData)

      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subData),
      })
      alert('Subscribed to notifications')
    } catch (error) {
      console.error('Subscription error', error)
    }
  }

  return (
    <button onClick={subscribe} className="p-2 bg-blue-500 text-white rounded">
      Subscribe
    </button>
  )
}

export default SubscribeButton
