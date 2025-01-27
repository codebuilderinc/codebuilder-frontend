import Link from 'next/link'
import { headers } from 'next/headers'

export default async function NotFound() {
  const headersList = await headers()
  const domain = headersList.get('host')
  const data = await getSiteData(domain)
  return (
    <div className="z-10 flex items-center sm:items-start ">
      <div className="flex w-screen">
        <h2>Not Found: {data.name}</h2>
        <p>Could not find requested resource</p>
        <p>
          View <Link href="/blog">all posts</Link>
        </p>
      </div>
    </div>
  )
}
async function getSiteData(domain: string) {
  // Simulate fetching site data based on the domain
  // In a real-world scenario, you would fetch this data from a database or an API
  const siteData = {
    'example.com': { name: 'Example Site' },
    'anotherdomain.com': { name: 'Another Domain' },
  }

  return siteData[domain] || { name: 'Unknown Site' }
}
