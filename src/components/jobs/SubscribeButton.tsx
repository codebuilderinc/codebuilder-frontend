'use client'

import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faSpinner } from '@fortawesome/free-solid-svg-icons'

const SubscribeButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      }
    }
    checkSubscriptionStatus()
  }, [])

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)))
  }

  const subscribe = async () => {
    setLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const response = await fetch('/api/notifications/get-public-key')
      if (!response.ok) throw new Error('Failed to fetch public key')
      const { publicKey } = await response.json()

      const convertedVapidKey = urlBase64ToUint8Array(publicKey)
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      })

      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      })
      alert('Successfully subscribed to notifications!')
      setIsSubscribed(true)
    } catch (error) {
      console.error('Subscription error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={subscribe}
      disabled={loading || isSubscribed}
      className={`p-2 rounded flex items-center gap-2 transition duration-300 ease-in-out ${
        isSubscribed ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'
      }`}
    >
      {loading ? (
        <>
          <FontAwesomeIcon icon={faSpinner} spin />
          Loading...
        </>
      ) : isSubscribed ? (
        <>✅ Subscribed</>
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
