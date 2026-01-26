
//import { PrismaClient, Prisma } from '@prisma/client'
import { PrismaClient, Prisma } from './../generated/prisma/client'
//import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Create a singleton instance of PrismaClient extended with accelerate.
const prismaClientSingleton = () => {
	// Configure logging based on environment
	const logConfig: Prisma.LogLevel[] =
		process.env.NODE_ENV === 'development'
			? ['error', 'warn'] // Only log errors and warnings in development
			: ['error'] // Only log errors in production

	return new PrismaClient({
		log: logConfig,
		adapter,
	})
}

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
	globalThis.prismaGlobal = prisma
}

export default prisma
