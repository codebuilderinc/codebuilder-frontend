import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)
    const type = searchParams.get('type')

    // Calculate skip value
    const skip = (page - 1) * pageSize

    const messages = await prisma.redditMessage.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    })

    // Optionally, get the total number of posts to return along with pagination info
    const totalCount = await prisma.redditMessage.count()

    return NextResponse.json({
      data: messages,
      page,
      pageSize,
      totalCount,
    })
  } catch (error) {
    // Handle any errors
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
