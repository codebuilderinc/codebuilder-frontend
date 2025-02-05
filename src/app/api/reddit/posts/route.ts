import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)

    // Calculate skip value
    const skip = (page - 1) * pageSize

    // Fetch paginated posts from Prisma
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      // select: { id: true, title: true, ... } // You can choose which fields to return
    })

    // Optionally, get the total number of posts to return along with pagination info
    const totalCount = await prisma.post.count()

    return NextResponse.json({
      data: posts,
      page,
      pageSize,
      totalCount,
    })
  } catch (error) {
    // Handle any errors
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
