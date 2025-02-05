// lib/reddit.ts

import axios from 'axios'
import Snoowrap from 'snoowrap'
import { PrismaClient } from '@prisma/client'
import { CommentStream } from 'snoostorm'

const prisma = new PrismaClient()

// Initialize Reddit API client with environment variables
export const redditClient = new Snoowrap({
  userAgent: 'your-app-name by /u/your-username',
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

      const created = await prisma.redditMessage.create({
        data: { ...baseData, ...additionalData },
      })

      console.debug(`Stored new ${type} [${created.redditId}] from /u/${created.author}`)
      newMessages.push(created)
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
