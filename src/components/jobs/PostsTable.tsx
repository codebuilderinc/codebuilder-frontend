'use client'

import React from 'react'
import Link from 'next/link'
import { Post } from '@prisma/client'
import 'animate.css'
import SubscribeButton from './SubscribeButton'

type Props = {
  posts: Post[]
  totalPosts: number
  postsPerPage: number
  currentPage: number
}

const PostsTable: React.FC<Props> = ({ posts, totalPosts, postsPerPage, currentPage }) => {
  return (
    <div className="animate__animated animate__fadeIn">
      <SubscribeButton />
      <div className="overflow-x-auto py-4">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left font-semibold">Title</th>
              <th className="py-3 px-6 text-left font-semibold">Author</th>
              <th className="py-3 px-6 text-left font-semibold">Subreddit</th>
              <th className="py-3 px-6 text-left font-semibold">Link</th>
              <th className="py-3 px-6 text-left font-semibold">Posted At</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post: Post) => {
              if (!post) return null // Skip undefined or null posts
              return (
                <tr
                  key={post.id}
                  className="border-b hover:bg-gray-100 transition duration-300 ease-in-out animate__animated animate__fadeInUp"
                >
                  <td className="py-3 px-6">{post.title}</td>
                  <td className="py-3 px-6">{post.author}</td>
                  <td className="py-3 px-6">{post.subreddit}</td>
                  <td className="py-3 px-6">
                    <Link
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Link
                    </Link>
                  </td>
                  <td className="py-3 px-6">{new Date(post.createdAt).toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="flex list-none">
              {Array.from({ length: Math.ceil(totalPosts / postsPerPage) }, (_, i) => i + 1).map(
                (number) => (
                  <li key={number} className="mx-1">
                    <Link
                      href={`/jobs?page=${number}`}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === number
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition duration-300 ease-in-out`}
                    >
                      {number}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default PostsTable
