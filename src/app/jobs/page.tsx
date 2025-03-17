import React from 'react'
import { PrismaClient } from '@prisma/client'
import PostsTable from '@/components/jobs/PostsTable'
import VideoPlayer from '../../components/video-player'

const prisma = new PrismaClient()

export default async function Home(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams
  const postsPerPage = 10
  const currentPage = parseInt(searchParams.page || '1', 10)

  const totalPosts = await prisma.redditPost.count()
  const posts = await prisma.redditPost.findMany({
    skip: (currentPage - 1) * postsPerPage,
    take: postsPerPage,
    orderBy: { createdAt: 'desc' },
  })

  await prisma.$disconnect()

  return (
    <div className="flex flex-col inset-0 z-50 bg-primary transition-transform">
      <section className={`bg-gray-100 py-4 md:py-6`}>
        <div className="container mx-auto py-16 px-8 md:px-20 lg:px-32">
          <h1 className="text-2xl font-bold mb-4">Reddit Posts</h1>
          <PostsTable
            posts={posts}
            totalPosts={totalPosts}
            postsPerPage={postsPerPage}
            currentPage={currentPage}
          />
        </div>
      </section>
    </div>
  )
}
