// lib/reddit.ts

import axios from 'axios'

export const fetchRedditPosts = async (subreddits: string[]) => {
  const posts = []

  for (const subreddit of subreddits) {
    const response = await axios.get(`https://www.reddit.com/r/${subreddit}/new.json?limit=10`)
    const subredditPosts = response.data.data.children.map((child: any) => ({
      title: child.data.title,
      author: child.data.author,
      subreddit: child.data.subreddit,
      url: child.data.url,
      createdAt: new Date(child.data.created_utc * 1000),
      body: child.data.selftext,
      body_html: child.data.selftext_html,
      upvotes: child.data.ups,
      downvotes: child.data.downs,
    }))
    posts.push(...subredditPosts)
  }

  return posts
}
