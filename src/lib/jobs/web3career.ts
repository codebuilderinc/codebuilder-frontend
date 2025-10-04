import { upsertJob } from './jobs'
import { logger } from '@/lib/logger'

// API URL/config encapsulated here
const WEB3CAREER_API_URL = 'https://web3.career/api/v1?token=Rg9PrsGP96Z2GB6T9tNZ1AzHzriQEwxa'

/**
 * Fetches job listings from Web3Career API.
 */
export async function fetchWeb3CareerJobs() {
  try {
    const response = await fetch(WEB3CAREER_API_URL)
    if (!response.ok)
      throw new Error(`Web3Career API request failed with status: ${response.status}`)
    const data = await response.json()
    const jobsArray = Array.isArray(data[2]) ? data[2] : []
    logger.info('Web3Career jobs fetched:', jobsArray.length)
    return jobsArray
  } catch (error: any) {
    logger.error('Error fetching Web3Career jobs:', error.message)
    throw error
  }
}

/**
 * Stores a list of Web3Career jobs in the database.
 */
export async function storeWeb3CareerJobs(jobs: any[]) {
  const newJobs = []
  for (const job of jobs) {
    try {
      const jobInput = {
        title: job.title,
        company: job.company,
        author: '', // Web3Career does not provide author
        location: job.location,
        url: job.apply_url,
        postedAt: job.date,
        description: job.description,
        isRemote: !!job.is_remote,
        tags: Array.isArray(job.tags) ? job.tags : [],
        metadata: {
          country: job.country || '',
          city: job.city || '',
          date_epoch: job.date_epoch ? String(job.date_epoch) : '',
        },
        source: {
          name: 'web3career',
          externalId: job.id ? String(job.id) : undefined,
          data: job,
        },
      }
      const upserted = await upsertJob(jobInput)
      newJobs.push(upserted)
    } catch (error: any) {
      logger.error('Error storing Web3Career job:', error.message)
    }
  }
  return newJobs
}

/**
 * Fetches and stores jobs from Web3Career.
 */
export async function fetchAndStoreWeb3CareerJobs() {
  const jobs = await fetchWeb3CareerJobs()
  await storeWeb3CareerJobs(jobs)
}
