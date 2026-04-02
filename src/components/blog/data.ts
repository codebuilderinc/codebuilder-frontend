export const blogCategories = [
  'General',
  'Web Development',
  'Mobile Applications',
  'Database Administration',
  'Server Administration',
  'Operational Security',
  'Networking',
] as const

export const blogPosts = [
  {
    slug: 'blogpost-with-slider',
    title: 'Blogpost with slider',
    dateDay: '12',
    dateMonth: 'May 2015',
    author: 'John Doe',
    comments: '22 comments',
    excerpt:
      'Mauris dolor sapien, malesuada at interdum ut, hendrerit eget lorem. Nunc interdum mi neque, et sollicitudin purus fermentum ut. Suspendisse faucibus nibh odio, a vehicula eros pharetra in. Maecenas ullamcorper commodo rutrum...',
    images: ['/template/images/blog-1.jpg', '/template/images/blog-3.jpg', '/template/images/blog-4.jpg'],
    tags: ['tag 1', 'tag 2', 'long tag 3'],
    type: 'slider',
  },
  {
    slug: 'audio-post',
    title: 'Audio post',
    dateDay: '10',
    dateMonth: 'May 2015',
    author: 'John Doe',
    comments: '22 comments',
    excerpt:
      'Mauris dolor sapien, malesuada at interdum ut, hendrerit eget lorem. Nunc interdum mi neque, et sollicitudin purus fermentum ut. Suspendisse faucibus nibh odio, a vehicula eros pharetra in.',
    tags: ['tag 1', 'tag 2', 'long tag 3'],
    type: 'audio',
  },
  {
    slug: 'cute-robot',
    title: 'Cute Robot',
    dateDay: '09',
    dateMonth: 'May 2015',
    author: 'John Doe',
    comments: '22 comments',
    excerpt:
      'Mauris dolor sapien, malesuada at interdum ut, hendrerit eget lorem. Nunc interdum mi neque, et sollicitudin purus fermentum ut. Suspendisse faucibus nibh odio, a vehicula eros pharetra in. Maecenas ullamcorper commodo rutrum. In iaculis lectus vel augue eleifend dignissim.',
    image: '/template/images/blog-2.jpg',
    tags: ['tag 1', 'tag 2', 'long tag 3'],
    type: 'image',
  },
  {
    slug: 'youtube-post',
    title: 'Blogpost with embedded youtube video',
    dateDay: '08',
    dateMonth: 'May 2015',
    author: 'John Doe',
    comments: '22 comments',
    excerpt:
      'Mauris dolor sapien, malesuada at interdum ut, hendrerit eget lorem. Nunc interdum mi neque, et sollicitudin purus fermentum ut. Suspendisse faucibus nibh odio, a vehicula eros pharetra in.',
    tags: ['tag 1', 'tag 2', 'long tag 3'],
    type: 'video',
  },
  {
    slug: 'text-post',
    title: 'Text Post',
    dateDay: '08',
    dateMonth: 'May 2015',
    author: 'John Doe',
    comments: '22 comments',
    excerpt:
      'Mauris dolor sapien, malesuada at interdum ut, hendrerit eget lorem. Nunc interdum mi neque, et sollicitudin purus fermentum ut. Suspendisse faucibus nibh odio, a vehicula eros pharetra in. Maecenas ullamcorper commodo rutrum. In iaculis lectus vel augue eleifend dignissim.',
    tags: ['tag 1', 'tag 2', 'long tag 3'],
    type: 'text',
  },
]
