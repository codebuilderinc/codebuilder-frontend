import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  const messages = await prisma.redditMessage.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(messages)
}
