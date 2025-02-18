import { NextRequest, NextResponse } from 'next/server'
import { fetchRedditPosts, storePosts } from '@/lib/reddit'
import webpush from 'web-push'
import prisma from '@/lib/db'

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
    const posts = await fetchRedditPosts(SUBREDDITS)
    const hiringPosts = posts.filter((post) => post.title.includes('[Hiring]'))

    await storePosts(hiringPosts)

    return NextResponse.json({ message: 'Posts fetched and stored successfully.' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An error occurred while fetching posts.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
