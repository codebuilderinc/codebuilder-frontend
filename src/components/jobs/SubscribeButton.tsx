'use client'

import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { logger } from '@/lib/logger'

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
      // Check if service worker is available
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service workers are not supported in this browser')
      }

      if (!('PushManager' in window)) {
        throw new Error('Push messaging is not supported in this browser')
      }

      const registration = await navigator.serviceWorker.ready
      logger.info('Service worker ready:', registration)

      const response = await fetch('/api/notifications/get-public-key')
      if (!response.ok) throw new Error('Failed to fetch public key')
      const { publicKey } = await response.json()
      logger.info('Public key received:', publicKey)

      const convertedVapidKey = urlBase64ToUint8Array(publicKey)
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      })
      logger.info('Push subscription created:', subscription)

      // Format the subscription for the API
      const subscriptionData = {
        type: 'web',
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
        },
      }
      logger.info('Sending subscription data:', subscriptionData)

      const subscribeResponse = await fetch('https://api.codebuilder.org/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionData),
      })

      if (!subscribeResponse.ok) {
        const errorText = await subscribeResponse.text()
        throw new Error(`Failed to save subscription: ${errorText}`)
      }

      const result = await subscribeResponse.json()
      logger.info('Subscription saved:', result)

      alert('Successfully subscribed to notifications!')
      setIsSubscribed(true)
    } catch (error) {
      logger.error('Subscription error', error)
      alert(`Subscription failed: ${error.message}`)
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
