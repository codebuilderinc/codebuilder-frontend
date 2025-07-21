import { NextResponse } from 'next/server'
import { fetchRedditPosts, storeRedditJobPosts } from '@/lib/jobs/reddit'
import { fetchWeb3CareerJobs, storeWeb3CareerJobs } from '@/lib/jobs/web3career'
import prisma from '@/lib/db'
import { logger } from '@/lib/logger'

// Subreddits to scan for jobs
const SUBREDDITS = [
  'forhire',
  'jobs4bitcoins',
  'freelance',
  'remotejs',
  'jobs4dogecoins',
  'jobs4crypto',
]

export async function GET() {
  logger.info('Starting the job fetch route...')
  try {
    // Fetch posts from Reddit
    logger.info('Fetching Reddit posts...')
    const redditPosts = await fetchRedditPosts(SUBREDDITS)
    logger.info(`Fetched ${redditPosts.length} posts. Filtering for "[Hiring]" in title...`)
    const hiringPosts = redditPosts.filter((post) => post.title.includes('[Hiring]'))
    logger.info(`Filtered down to ${hiringPosts.length} [Hiring] posts. Storing to database...`)
    await storeRedditJobPosts(hiringPosts)
    logger.info('Reddit jobs stored successfully.')

    // Fetch posts from Web3Career
    logger.info('Fetching Web3Career jobs...')
    const web3Jobs = await fetchWeb3CareerJobs()
    logger.info(`Fetched ${web3Jobs.length} Web3Career jobs. Storing to database...`)
    await storeWeb3CareerJobs(web3Jobs)
    logger.info('Web3Career jobs stored successfully.')

    logger.info('All jobs fetched and stored successfully.')
    return NextResponse.json({ message: 'All jobs fetched and stored successfully.' })
  } catch (error) {
    logger.error('Failed to fetch or store jobs in the jobs/fetch route.', error)
    return NextResponse.json({ error: 'An error occurred while fetching jobs.' }, { status: 500 })
  } finally {
    logger.info('Disconnecting Prisma client...')
    await prisma.$disconnect()
  }
}
