// lib/reddit.ts

import axios from 'axios'
import Snoowrap from 'snoowrap'
import { CommentStream } from 'snoostorm'
import { sendNotification } from '../notifications'
import prisma from '@/lib/db'
import { logger } from '@/lib/logger'
import { upsertJob } from './jobs'

// Initialize Reddit API client with environment variables
export const redditClient = new Snoowrap({
  userAgent: 'CodeBuilder by /u/taofullstack',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
})

/**
 * Type guard to determine if a Snoowrap item is a PrivateMessage.
 * @param item A Snoowrap PrivateMessage or Comment.
 * @returns True if the item is a PrivateMessage.
 */
function isPrivateMessage(
  item: Snoowrap.PrivateMessage | Snoowrap.Comment
): item is Snoowrap.PrivateMessage {
  // Only PrivateMessage objects have the 'new' property.
  return 'new' in item
}

/**
 * Stores an array of Reddit messages or comments in the database,
 * preventing duplicates and sending notifications for new items.
 * @param items Array of Snoowrap PrivateMessage or Comment objects.
 * @returns A promise that resolves to an array of newly created database records.
 */
export async function storeMessages(items: Array<Snoowrap.PrivateMessage | Snoowrap.Comment>) {
  const newMessages = []
  logger.debug(`Processing ${items.length} message(s)`)

  const subscriptions = await prisma.subscription.findMany()

  for (const item of items) {
    try {
      const isMessage = isPrivateMessage(item)
      const type = isMessage ? 'private_message' : 'comment'

      const existing = await prisma.redditMessage.findUnique({
        where: { redditId: item.name },
      })

      if (existing) {
        //logger.debug(`Skipping duplicate ${type} [${item.name}]`)
        continue
      }

      const createdMsg = await prisma.redditMessage.create({
        data: {
          redditId: item.name,
          type,
          // BUG FIX: Use optional chaining to prevent crash on deleted users.
          author: item.author?.name ?? '[deleted]',
          content: item.body,
          bodyHtml: item.body_html,
          subreddit: item.subreddit?.display_name,
          createdAt: new Date(item.created_utc * 1000),
          parentId: item.parent_id,
          rawData: item.toJSON(),
          isRead: isMessage ? item.new === false : false,
          contextUrl: isMessage ? item.context : `https://www.reddit.com${item.permalink}`,
        },
      })

      const notificationPayload = {
        title: `New ${type} from /u/${createdMsg.author}`,
        body: createdMsg.content,
        url: createdMsg.contextUrl,
        icon: 'https://new.codebuilder.org/images/logo2.png',
        badge: 'https://new.codebuilder.org/images/logo2.png',
      }

      const notificationPromises = subscriptions.map((sub) =>
        sendNotification(sub, notificationPayload)
      )
      await Promise.all(notificationPromises)

      logger.debug(`Stored new ${type} [${createdMsg.redditId}] from /u/${createdMsg.author}`)
      newMessages.push(createdMsg)
    } catch (error: any) {
      logger.error(`Error processing message ${item.name}:`, error.message)
    }
  }

  return newMessages
}

/**
 * Fetches all new messages and comment replies from the Reddit inbox.
 * @returns A promise that resolves to an array of newly stored messages.
 */
export async function checkRedditMessages() {
  try {
    logger.debug('Fetching Reddit inbox...')

    const [commentReplies, messages] = await Promise.all([
      redditClient.getInbox({ filter: 'comments' }),
      redditClient.getInbox({ filter: 'messages' }),
    ])

    logger.debug(`Found ${commentReplies.length} comment(s), ${messages.length} message(s)`)
    return await storeMessages([...commentReplies, ...messages])
  } catch (error: any) {
    logger.error('Reddit API Error:', error.message, error.stack)
    throw new Error(`Failed to fetch messages: ${error.message}`)
  }
}

/**
 * Retrieves unread messages from the Reddit inbox.
 * @returns A promise that resolves to an array of unread messages.
 */
export const getUnreadMessages = async () => {
  logger.debug('Fetching unread messages...')
  const messages = await redditClient.getUnreadMessages({ limit: 25 })
  //logger.debug(`Found ${messages.length} unread message(s)`)
  return messages
}

/**
 * Marks a specific message as read on Reddit.
 * @param messageId The Reddit fullname of the message (e.g., "t4_12345").
 */
export const markMessageRead = (messageId: string) => {
  try {
    logger.debug(`Marking message ${messageId} as read...`)
    return redditClient.getMessage(messageId).markAsRead()
  } catch (error: any) {
    logger.error(`Error marking message ${messageId} as read:`, error.message)
  }
}

/**
 * Fetches recent posts from a list of subreddits.
 * @param subreddits Array of subreddit names (without the "r/" prefix).
 * @returns A promise that resolves to an array of formatted post objects.
 */
export const fetchRedditPosts = async (subreddits: string[]) => {
  const allPosts = []
  logger.debug(`Fetching posts from ${subreddits.length} subreddit(s)`)

  for (const subreddit of subreddits) {
    try {
      logger.debug(`Fetching /r/${subreddit}...`)
      const response = await axios.get(`https://www.reddit.com/r/${subreddit}/new.json?limit=10`, {
        timeout: 5000,
      })

      const subredditPosts = response.data.data.children.map((child: any) => ({
        title: child.data.title,
        author: child.data.author,
        subreddit: child.data.subreddit,
        url: child.data.url,
        // BUG FIX: Map the creation time to 'postedAt' to match the Prisma schema.
        // Let Prisma's `@default(now())` handle the `createdAt` field.
        postedAt: new Date(child.data.created_utc * 1000),
        body: child.data.selftext,
        bodyHtml: child.data.selftext_html,
        upvotes: child.data.ups,
        downvotes: child.data.downs,
      }))

      logger.debug(`Found ${subredditPosts.length} post(s) in /r/${subreddit}`)
      allPosts.push(...subredditPosts)
    } catch (error: any) {
      logger.error(`Error fetching /r/${subreddit}:`, error.message)
    }
  }

  return allPosts
}

/**
 * Stores an array of Reddit posts in the unified jobs table using the upsertJob function.
 * This replaces the old storePosts function to use the new unified jobs architecture.
 * @param posts Array of post objects from `fetchRedditPosts`.
 * @returns A promise that resolves to an array of newly created/updated job records.
 */
export async function storeRedditJobPosts(posts: Array<any>) {
  const newJobs = []
  logger.debug(`Processing ${posts.length} Reddit post(s) for jobs table`)

  const subscriptions = await prisma.subscription.findMany()

  for (const post of posts) {
    try {
      const jobInput = {
        title: post.title,
        company: '', // Reddit posts don't have company info
        author: post.author,
        location: '', // Reddit posts don't have structured location
        url: post.url,
        postedAt: post.postedAt,
        description: post.body || '',
        isRemote: null, // Can't determine from Reddit posts
        tags: [post.subreddit], // Use subreddit as a tag
        metadata: {
          subreddit: post.subreddit,
          bodyHtml: post.bodyHtml || '',
          upvotes: post.upvotes ? String(post.upvotes) : '0',
          downvotes: post.downvotes ? String(post.downvotes) : '0',
        },
        source: {
          name: 'reddit',
          externalId: post.url, // Use URL as external ID since Reddit doesn't provide a better ID
          data: post,
        },
      }

      const upsertedJob = await upsertJob(jobInput)
      
      // Send notifications for new jobs
      const notificationPayload = {
        title: `${post.title} (${post.subreddit})`,
        body: `Posted by /u/${post.author}`,
        url: post.url,
        icon: 'https://new.codebuilder.org/images/logo2.png',
        badge: 'https://new.codebuilder.org/images/logo2.png',
      }

      const notificationPromises = subscriptions.map((sub) =>
        sendNotification(sub, notificationPayload)
      )
      await Promise.all(notificationPromises)

      logger.debug(`Stored new job [${post.url}] from /u/${post.author}`)
      newJobs.push(upsertedJob)
    } catch (error: any) {
      logger.error(`Error processing Reddit post ${post.url}:`, error)
    }
  }

  return newJobs
}
