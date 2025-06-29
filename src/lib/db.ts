// src/lib/db.ts
import { PrismaClient, Prisma } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Create a singleton instance of PrismaClient extended with accelerate.
const prismaClientSingleton = () => {
  // Configure logging based on environment
  const logConfig: Prisma.LogLevel[] =
    process.env.NODE_ENV === 'development'
      ? ['error', 'warn'] // Only log errors and warnings in development
      : ['error'] // Only log errors in production

  return new PrismaClient({
    log: logConfig,
  }).$extends(withAccelerate())
}

// Use a global variable to persist the Prisma Client across hot reloads in development.
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

export default prisma
