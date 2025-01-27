import React from 'react'

const SubscribeButton: React.FC = () => {
  const subscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...subscription, type: 'web' }),
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
