// lib/reddit.ts

import axios from 'axios'
import Snoowrap from 'snoowrap'
import { PrismaClient } from '@prisma/client'
import { CommentStream } from 'snoostorm'
import { sendNotification } from './notifications'
import prisma from '@/lib/db'

// Initialize Reddit API client with environment variables
export const redditClient = new Snoowrap({
  userAgent: 'CodeBuilder by /u/taofullstack',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
})

/**
 * Stores Reddit messages/comments in database with deduplication
 * @param items Array of Reddit messages or comments
 * @returns Array of newly created database records
 */
export async function storeMessages(items: Array<Snoowrap.PrivateMessage | Snoowrap.Comment>) {
  const newMessages = []
  console.debug(`Processing ${items.length} message(s)`)

  // Retrieve all subscriptions for sending notifications
  const subscriptions = await prisma.subscription.findMany()

  for (const item of items) {
    try {
      const isMessage = item instanceof Snoowrap.PrivateMessage
      const type = isMessage ? 'private_message' : 'comment'

      // Check for existing record
      const existing = await prisma.redditMessage.findUnique({
        where: { redditId: item.name },
      })

      if (existing) {
        console.debug(`Skipping duplicate ${type} [${item.name}]`)
        continue
      }

      // Common fields for both messages and comments
      const baseData = {
        redditId: item.name,
        type,
        author: item.author.name,
        content: item.body,
        bodyHtml: item.body_html,
        subreddit: item.subreddit?.display_name,
        createdAt: new Date(item.created_utc * 1000),
        parentId: item.parent_id,
        rawData: item.toJSON(),
      }

      // Type-specific fields
      const additionalData = isMessage
        ? {
            isRead: item.new === false,
            contextUrl: item.context,
          }
        : {
            isRead: false, // Comments don't have a 'new' property in API response
            contextUrl: item.permalink,
          }

      const createdMsg = await prisma.redditMessage.create({
        data: { ...baseData, ...additionalData },
      })

      // Build your unified payload object
      const notificationPayload = {
        title: `${createdMsg.author} (${createdMsg.subreddit})`,
        body: `${createdMsg.content}`,
        url: createdMsg.contextUrl,
        icon: 'https://new.codebuilder.org/images/logo2.png',
        badge: 'https://new.codebuilder.org/images/logo2.png',
      }

      // Loop and send notifications concurrently
      const notificationPromises = subscriptions.map((sub) =>
        sendNotification(sub, notificationPayload)
      )

      // Wait for all notifications to complete
      await Promise.all(notificationPromises)

      console.debug(`Stored new ${type} [${createdMsg.redditId}] from /u/${createdMsg.author}`)
      newMessages.push(createdMsg)
    } catch (error) {
      console.error(`Error processing message ${item.name}:`, error.message)
    }
  }

  return newMessages
}

/**
 * Fetches and processes Reddit inbox items
 * @returns Array of newly stored messages
 */
export async function checkRedditMessages() {
  try {
    console.debug('Fetching Reddit inbox...')

    // Parallel fetch of comments and messages
    const [commentReplies, messages] = await Promise.all([
      redditClient.getInbox({ filter: 'comments' }),
      redditClient.getInbox({ filter: 'messages' }),
    ])

    console.debug(`Found ${commentReplies.length} comment(s), ${messages.length} message(s)`)
    return await storeMessages([...commentReplies, ...messages])
  } catch (error) {
    console.error('Reddit API Error:', error.message, error.stack)
    throw new Error(`Failed to fetch messages: ${error.message}`)
  }
}

/**
 * Retrieves unread messages from Reddit inbox
 * @returns Array of unread messages
 */
export const getUnreadMessages = async () => {
  console.debug('Fetching unread messages...')
  const messages = await redditClient.getUnreadMessages({ limit: 25 })
  console.debug(`Found ${messages.length} unread message(s)`)
  return messages
}

/**
 * Marks a specific message as read
 * @param messageId Reddit message ID (fullname format, e.g. "t4_12345")
 */
export const markMessageRead = (messageId: string) => {
  try {
    console.debug(`Marking message ${messageId} as read...`)
    return redditClient.getMessage(messageId).markAsRead()
  } catch (error) {
    console.error(`Error marking message ${messageId} as read:`, error.message)
  }
}

/**
 * Fetches recent posts from specified subreddits
 * @param subreddits Array of subreddit names (without r/)
 * @returns Array of formatted post objects
 */
export const fetchRedditPosts = async (subreddits: string[]) => {
  const posts = []
  console.debug(`Fetching posts from ${subreddits.length} subreddit(s)`)

  for (const subreddit of subreddits) {
    try {
      console.debug(`Fetching /r/${subreddit}...`)
      const response = await axios.get(`https://www.reddit.com/r/${subreddit}/new.json?limit=10`, {
        timeout: 5000,
      })

      const subredditPosts = response.data.data.children.map((child: any) => ({
        title: child.data.title,
        author: child.data.author,
        subreddit: child.data.subreddit,
        url: child.data.url,
        createdAt: new Date(child.data.created_utc * 1000),
        body: child.data.selftext,
        bodyHtml: child.data.selftext_html,
        upvotes: child.data.ups,
        downvotes: child.data.downs,
      }))

      console.debug(`Found ${subredditPosts.length} post(s) in /r/${subreddit}`)
      posts.push(...subredditPosts)
    } catch (error) {
      console.error(`Error fetching /r/${subreddit}:`, error.message)
    }
  }

  return posts
}

/**
 * Stores Reddit posts in database with deduplication and sends notifications
 * @param posts Array of Reddit post objects
 * @returns Array of newly created database records
 */
export async function storePosts(posts: Array<any>) {
  const newPosts = []
  console.debug(`Processing ${posts.length} post(s)`)

  // Retrieve all subscriptions for sending notifications
  const subscriptions = await prisma.subscription.findMany()

  for (const post of posts) {
    try {
      // Check for existing record
      const existing = await prisma.post.findUnique({
        where: { url: post.url },
      })

      if (existing) {
        console.debug(`Skipping duplicate post [${post.url}]`)
        continue
      }

      const createdPost = await prisma.post.create({ data: post })

      // Build notification payload
      const notificationPayload = {
        title: `${createdPost.title} (${createdPost.subreddit} - ${createdPost.author})`,
        body: `${createdPost.title}`,
        url: createdPost.url,
        icon: 'https://new.codebuilder.org/images/logo2.png',
        badge: 'https://new.codebuilder.org/images/logo2.png',
      }

      // Send notifications concurrently
      const notificationPromises = subscriptions.map((sub) =>
        sendNotification(sub, notificationPayload)
      )
      await Promise.all(notificationPromises)

      console.debug(`Stored new post [${createdPost.url}] from /u/${createdPost.author}`)
      newPosts.push(createdPost)
    } catch (error) {
      console.error(`Error processing post ${post.url}:`, error.message)
    }
  }

  return newPosts
}
