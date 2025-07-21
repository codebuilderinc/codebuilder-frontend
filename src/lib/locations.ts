import prisma from './db'
import { logger } from './logger'

// Function definition with types
async function createLocation(
  subscriptionId: number,
  locationData: LocationData,
  geoAddressData: GeoAddressData
): Promise<void> {
  // Destructure locationData
  const {
    coords: { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed },
    mocked,
    timestamp,
  } = locationData

  // Destructure geoAddressData
  const {
    city,
    country,
    district,
    formattedAddress,
    isoCountryCode,
    name,
    postalCode,
    region,
    street,
    streetNumber,
    subregion,
    timezone,
  } = geoAddressData

  // Insert query
  const location = await prisma.location.create({
    data: {
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      latitude,
      longitude,
      speed,
      mocked,
      timestamp,
      city,
      country,
      district,
      formattedAddress,
      isoCountryCode,
      name,
      postalCode,
      region,
      street,
      streetNumber,
      subregion,
      timezone,
      ipAddress: '127.0.0.1', // Replace with the actual IP address
      // Use the relation for subscription
      subscription: {
        connect: { id: subscriptionId }, // Connect to an existing subscription by ID
      },
    },
  })

  logger.info('Location created:', location)
}

// Example usage
const subscriptionId = 1 // Replace with the actual subscription ID

const locationData: LocationData = {
  coords: {
    accuracy: 100,
    altitude: 236.60000610351562,
    altitudeAccuracy: 100,
    heading: 0,
    latitude: 44.9560359,
    longitude: -93.2941526,
    speed: 0,
  },
  mocked: false,
  timestamp: 1737836129669,
}

const geoAddressData: GeoAddressData = {
  city: 'Minneapolis',
  country: 'United States',
  district: null,
  formattedAddress: '2543 Emerson Ave S, Minneapolis, MN 55405, USA',
  isoCountryCode: 'US',
  name: '2543',
  postalCode: '55405',
  region: 'Minnesota',
  street: 'Emerson Avenue South',
  streetNumber: '2543',
  subregion: 'Hennepin County',
  timezone: null,
}

createLocation(subscriptionId, locationData, geoAddressData)
  .catch((e) => logger.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

// Define the types/interfaces
interface Coords {
  accuracy: number
  altitude: number
  altitudeAccuracy: number
  heading: number
  latitude: number
  longitude: number
  speed: number
}

interface LocationData {
  coords: Coords
  mocked: boolean
  timestamp: number // Use number to match the BigInt-like behavior in JS
}

interface GeoAddressData {
  city: string | null
  country: string | null
  district: string | null
  formattedAddress: string | null
  isoCountryCode: string | null
  name: string | null
  postalCode: string | null
  region: string | null
  street: string | null
  streetNumber: string | null
  subregion: string | null
  timezone: string | null
}
