// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Create a singleton instance of PrismaClient extended with accelerate and logging.
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query'],
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
