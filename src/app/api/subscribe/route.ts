// app/api/subscribe/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const subscription = await req.json()

  try {
    await prisma.subscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: { keys: subscription.keys },
      create: {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
    })

    return NextResponse.json({ message: 'Subscription added.' }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save subscription.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
