import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/server/db'
import { withLogging } from '@/server/logger'

/**
 * Returns a paginated list of all jobs from all sources,
 * including company, tags, and metadata relations.
 * Query params: ?page=1&pageSize=10
 */
export const GET = withLogging(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)
    const skip = (page - 1) * pageSize

    // Fetch jobs, newest first, including company, tags, and metadata
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      include: {
        company: true,
        tags: { include: { tag: true } },
        metadata: true,
      },
    })

    const totalCount = await prisma.job.count()

    return NextResponse.json({
      data: jobs,
      page,
      pageSize,
      totalCount,
    })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
})
