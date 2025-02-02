// app/api/fetch-posts/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { fetchRedditPosts } from '@/lib/reddit'
import { PrismaClient } from '@prisma/client'
import webpush, { WebPushError } from 'web-push'
import { messaging } from '@/lib/firebase'
import { sendNotification } from '../../../lib/notifications'

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

export async function GET(req: NextRequest) {
  try {
    // Fetch posts from the specified subreddits
    const posts = await fetchRedditPosts(SUBREDDITS)

    // Retrieve all subscriptions for sending notifications
    const subscriptions = await prisma.subscription.findMany()

    for (const post of posts) {
      // Check if the post is marked with '[Hiring]'
      if (!post.title.includes('[Hiring]')) continue

      // Ensure the post is not already in the database
      const existingPost = await prisma.post.findUnique({
        where: { url: post.url },
      })
      if (existingPost) continue

      // Add the post to the database if it's new
      const createdPost = await prisma.post.create({ data: post })

      // 2. Build your unified payload object
      const notificationPayload = {
        title: `${createdPost.title} (${createdPost.subreddit} - ${createdPost.author})`,
        body: `${createdPost.title}`,
        url: createdPost.url,
        icon: 'https://new.codebuilder.org/images/logo2.png',
        badge: 'https://new.codebuilder.org/images/logo2.png',
      }

      // 3. Loop and send notifications concurrently
      const notificationPromises = subscriptions.map((sub) =>
        sendNotification(sub, notificationPayload)
      )

      // 4. Wait for all notifications to complete
      await Promise.all(notificationPromises)
    }

    // Respond with success if posts fetched and processed successfully
    return NextResponse.json({ message: 'Posts fetched and stored successfully.' })
  } catch (error) {
    // Log any errors and respond with a 500 status code
    console.log(error) //error()
    return NextResponse.json({ error: 'An error occurred while fetching posts.' }, { status: 500 })
  } finally {
    // Ensure the Prisma client is disconnected after execution
    await prisma.$disconnect()
  }
}
