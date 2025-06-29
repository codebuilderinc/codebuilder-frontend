import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { withLogging } from '@/lib/logger'

export const POST = withLogging(async (request: NextRequest) => {
  try {
    const locationData = await request.json()
    console.log('locationData', locationData)
    // Validate required fields
    if (!locationData) {
      console.log('Invalid location data:', locationData)
      return NextResponse.json({ error: 'Invalid location data.' }, { status: 400 })
    }

    // Extract the IP address from the headers
    const forwardedFor = request.headers.get('x-forwarded-for') || ''
    const ipAddress = forwardedFor.split(',')[0].trim() || 'Unknown'

    // Find the subscription ID using the token from the subscriptions table
    const subscription = await prisma.subscription.findFirst({
      where: {
        keys: {
          equals: {
            token: locationData.subscriptionId, // Match the token inside the keys JSON
          },
        },
      },
    })

    if (!subscription) {
      console.log('Subscription not found for subscriptionId:', locationData.subscriptionId)
      return NextResponse.json({ error: 'Subscription not found.' }, { status: 404 })
    }

    // Insert the new location into the database using the found subscriptionId
    const newLocation = await prisma.location.create({
      data: {
        subscriptionId: subscription.id, // Use the found subscription ID
        ipAddress,

        // Coordinates fields
        accuracy: locationData.accuracy,
        altitude: locationData.altitude,
        altitudeAccuracy: locationData.altitudeAccuracy,
        heading: locationData.heading,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        speed: locationData.speed,

        // Additional fields
        mocked: locationData.mocked || false, // Default to false if not provided
        //timestamp: locationData.timestamp,

        // Address fields
        city: locationData.city,
        country: locationData.country,
        district: locationData.district,
        formattedAddress: locationData.formattedAddress,
        isoCountryCode: locationData.isoCountryCode,
        name: locationData.name,
        postalCode: locationData.postalCode,
        region: locationData.region,
        street: locationData.street,
        streetNumber: locationData.streetNumber,
        subregion: locationData.subregion,
        timezone: locationData.timezone,
      },
    })

    console.log('Location added:', newLocation)
    return NextResponse.json(
      { message: 'Location added successfully.', location: newLocation },
      { status: 201 }
    )
  } catch (error) {
    console.log('Error saving location:', error) //error()
    console.log(error.stack)
    return NextResponse.json({ error: 'Failed to save location.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
})
