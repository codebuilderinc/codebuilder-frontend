// app/api/fetch-posts/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { fetchRedditPosts } from '@/lib/reddit'
import { PrismaClient } from '@prisma/client'
import webpush, { WebPushError } from 'web-push'

const prisma = new PrismaClient()

// List of subreddits to monitor for new posts
const SUBREDDITS = [
  'forhire',
  'jobs4bitcoins',
  'freelance',
  'remotejs',
  'jobs4dogecoins',
  'jobs4crypto',
]

// Set up web-push VAPID keys for push notifications
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// Define the URLs for the icon and badge images used in notifications
const ICON_URL = 'https://new.codebuilder.org/images/logo2.png'
const BADGE_URL = 'https://new.codebuilder.org/images/logo2.png'

export async function GET(req: NextRequest) {
  try {
    // Fetch posts from the specified subreddits
    const posts = await fetchRedditPosts(SUBREDDITS)

    // Retrieve all subscriptions for sending notifications
    const subscriptions = await prisma.subscription.findMany()

    for (const post of posts) {
      // Check if the post is marked with '[Hiring]'
      if (post.title.includes('[Hiring]')) {
        // Ensure the post is not already in the database
        const existingPost = await prisma.post.findUnique({
          where: { url: post.url },
        })

        if (!existingPost) {
          // Add the post to the database if it's new
          const createdPost = await prisma.post.create({ data: post })

          // Send notifications to all subscribed users
          const notificationPromises = subscriptions.map(async (sub) => {
            const notificationPayload = {
              title: `New [Hiring] post in ${createdPost.subreddit}`,
              body: createdPost.title,
              icon: ICON_URL,
              badge: BADGE_URL,
              url: createdPost.url, // Include URL for click handling
            }

            try {
              // Trigger web-push notification
              await webpush.sendNotification(sub as any, JSON.stringify(notificationPayload))
            } catch (error) {
              // Handle WebPushError specifically
              if (error instanceof webpush.WebPushError) {
                if (error.statusCode === 410) {
                  // Subscription has expired or unsubscribed, remove from database
                  await prisma.subscription.delete({
                    where: {
                      id: sub.id,
                    },
                  })
                  console.log(`Subscription with id ${sub.id} removed due to expiration.`)
                } else {
                  // Log other WebPushErrors
                  console.error(
                    `Failed to send notification to subscription id ${sub.id}:`,
                    error.statusCode,
                    error.body
                  )
                }
              } else {
                // Log other errors
                console.error(
                  `An error occurred while sending notification to subscription id ${sub.id}:`,
                  error
                )
              }
            }
          })

          // Wait for all notifications to be sent before proceeding
          await Promise.all(notificationPromises)
        }
      }
    }

    // Respond with success if posts fetched and processed successfully
    return NextResponse.json({ message: 'Posts fetched and stored successfully.' })
  } catch (error) {
    // Log any errors and respond with a 500 status code
    console.error(error)
    return NextResponse.json({ error: 'An error occurred while fetching posts.' }, { status: 500 })
  } finally {
    // Ensure the Prisma client is disconnected after execution
    await prisma.$disconnect()
  }
}
