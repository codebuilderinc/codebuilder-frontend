import { PrismaClient } from '@prisma/client'
import PostsTable from '@/components/PostsTable'

const prisma = new PrismaClient()

export default async function Home(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const postsPerPage = 10
  const currentPage = parseInt(searchParams.page || '1', 10)

  const totalPosts = await prisma.post.count()
  const posts = await prisma.post.findMany({
    skip: (currentPage - 1) * postsPerPage,
    take: postsPerPage,
    orderBy: { createdAt: 'desc' },
  })

  await prisma.$disconnect()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reddit Posts</h1>
      <PostsTable
        posts={posts}
        totalPosts={totalPosts}
        postsPerPage={postsPerPage}
        currentPage={currentPage}
      />
    </div>
  )
}
