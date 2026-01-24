//import { PrismaClient } from '@prisma/client'
import prisma from '@/server/db'
//const prisma = new PrismaClient()

/**
 * Input structure for creating or updating a job record.
 */
export type JobInput = {
  title: string
  company: string
  author?: string
  location?: string
  url: string
  postedAt?: Date | string
  description?: string
  isRemote?: boolean | null
  tags?: string[]
  metadata?: Record<string, string>
  source: {
    name: string
    externalId?: string
    data?: any
  }
}


/**
 * Creates or updates a job record along with its tags, metadata, and source.
 */
export async function upsertJob(input: JobInput) {
  // Upsert the company record if present
  let companyRecord = null
  if (input.company) {
    companyRecord = await prisma.company.upsert({
      where: { name: input.company },
      create: { name: input.company },
      update: {},
    })
  }

  // Upsert the job by its unique URL
  const job = await prisma.job.upsert({
    where: { url: input.url },
    update: {
      title: input.title,
      author: input.author,
      location: input.location,
      postedAt: input.postedAt ? new Date(input.postedAt) : undefined,
      description: input.description,
      isRemote: input.isRemote ?? undefined,
      // Write source-related fields directly on Job
      source: input.source?.name,
      externalId: input.source?.externalId,
      data: input.source?.data as any,
      company: companyRecord ? { connect: { id: companyRecord.id } } : undefined,
      updatedAt: new Date(),
    },
    create: {
      title: input.title,
      author: input.author,
      location: input.location,
      postedAt: input.postedAt ? new Date(input.postedAt) : undefined,
      description: input.description,
      isRemote: input.isRemote ?? undefined,
      url: input.url,
      // Write source-related fields directly on Job
      source: input.source?.name,
      externalId: input.source?.externalId,
      data: input.source?.data as any,
      company: companyRecord ? { connect: { id: companyRecord.id } } : undefined,
    },
  })

  // Upsert tags (many-to-many via JobTag)
  if (input.tags && input.tags.length) {
    for (const tagName of input.tags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      })
      await prisma.jobTag.upsert({
        where: { jobId_tagId: { jobId: job.id, tagId: tag.id } },
        update: {},
        create: { jobId: job.id, tagId: tag.id },
      })
    }
  }

  // Upsert metadata (requires a compound unique constraint in the model)
  // schema.prisma (JobMetadata) must have: @@unique([jobId, name])
  if (input.metadata) {
    for (const [name, value] of Object.entries(input.metadata)) {
      await prisma.jobMetadata.upsert({
        where: { jobId_name: { jobId: job.id, name } },
        update: { value },
        create: { jobId: job.id, name, value },
      })
    }
  }

  return job
}
