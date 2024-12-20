'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Post } from '@prisma/client'
import 'animate.css'

type Props = {
  posts: Post[]
  totalPosts: number
  postsPerPage: number
  currentPage: number
}

const PostsTable: React.FC<Props> = ({ posts, totalPosts, postsPerPage, currentPage }) => {
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => console.log('Service Worker registered:', registration))
        .catch((error) => console.error('Service Worker registration failed:', error))
    }
  }, [])

  useEffect(() => {
    // Check subscription status on component mount
    const checkSubscriptionStatus = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription) // Set subscription status
      }
    }
    checkSubscriptionStatus()
  }, [])

  const handleSubscribe = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready

        // Fetch the public VAPID key from the server
        const response = await fetch('/api/get-public-key')
        if (!response.ok) throw new Error('Failed to fetch public key')
        const { publicKey } = await response.json()

        // Convert VAPID key to the format required by PushManager
        const convertedVapidKey = urlBase64ToUint8Array(publicKey)

        // Subscribe the user to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        })

        // Send the subscription to the server
        const subscribeResponse = await fetch('/api/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!subscribeResponse.ok) throw new Error('Failed to save subscription on server')

        alert('Successfully subscribed to notifications!')
        setIsSubscribed(true)
      } catch (error) {
        console.error('Error during subscription:', error)
      }
    } else {
      alert('Push messaging is not supported in your browser.')
    }
  }

  // Helper function to convert the VAPID key
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  return (
    <div className="p-6 animate__animated animate__fadeIn">
      <button
        onClick={handleSubscribe}
        disabled={isSubscribed}
        className={`mb-4 px-4 py-2 rounded-lg transition duration-300 ease-in-out animate__animated animate__pulse ${
          isSubscribed
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isSubscribed ? 'Already Subscribed' : 'Subscribe to Notifications'}
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left font-semibold">Title</th>
              <th className="py-3 px-6 text-left font-semibold">Author</th>
              <th className="py-3 px-6 text-left font-semibold">Subreddit</th>
              <th className="py-3 px-6 text-left font-semibold">Link</th>
              <th className="py-3 px-6 text-left font-semibold">Posted At</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post: Post) => (
              <tr
                key={post.id}
                className="border-b hover:bg-gray-100 transition duration-300 ease-in-out animate__animated animate__fadeInUp"
              >
                <td className="py-3 px-6">{post.title}</td>
                <td className="py-3 px-6">{post.author}</td>
                <td className="py-3 px-6">{post.subreddit}</td>
                <td className="py-3 px-6">
                  <Link
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Link
                  </Link>
                </td>
                <td className="py-3 px-6">{new Date(post.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="flex list-none">
              {Array.from({ length: Math.ceil(totalPosts / postsPerPage) }, (_, i) => i + 1).map(
                (number) => (
                  <li key={number} className="mx-1">
                    <Link
                      href={`/jobs?page=${number}`}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === number
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition duration-300 ease-in-out`}
                    >
                      {number}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default PostsTable
