// app/api/jobs/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const apiUrl = 'https://web3.career/api/v1?token=Rg9PrsGP96Z2GB6T9tNZ1AzHzriQEwxa'

  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data from the API' }, { status: 500 })
    }

    const data = await response.json()

    // Check if `data` is an array
    if (!Array.isArray(data)) {
      console.error('Unexpected API response format:', data)
      return NextResponse.json({ error: 'Unexpected API response format' }, { status: 500 })
    }

    // Process each job record in `data`, filtering out any record without an `id`
    const jobList = data
      .filter((job: any) => job.id) // Only include jobs that have an `id`
      .map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location || job.city || job.country || 'Remote',
        date: job.date,
        date_epoch: job.date_epoch,
        is_remote: job.is_remote,
        apply_url: job.apply_url,
        //tags: Array.isArray(job.tags) ? job.tags : [], // Ensure tags is an array
        description: job.description, // Raw HTML description
      }))

    // Convert jobList to a prettified JSON string
    const prettifiedJobList = JSON.stringify(jobList, null, 2)
    console.log('jobList', data)
    // Return as a JSON response
    return new Response(prettifiedJobList, {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 })
  }
}
