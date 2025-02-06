import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faSpinner } from '@fortawesome/free-solid-svg-icons'

const SubscribeButton: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const subscribe = async () => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={subscribe}
      disabled={loading}
      className="p-2 bg-blue-500 text-white rounded flex items-center gap-2"
    >
      {loading ? (
        <>
          <FontAwesomeIcon icon={faSpinner} spin />
          Loading...
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faBell} />
          Subscribe
        </>
      )}
    </button>
  )
}

export default SubscribeButton
