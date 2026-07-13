export interface CityConfig {
  name: string
  lat: number
  lng: number
  defaultRadiusKm: number
}

export const CITIES: CityConfig[] = [
  { name: 'New York, NY', lat: 40.7128, lng: -74.006, defaultRadiusKm: 15 },
  { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, defaultRadiusKm: 40 },
  { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, defaultRadiusKm: 25 },
  { name: 'Austin, TX', lat: 30.2672, lng: -97.7431, defaultRadiusKm: 25 },
]

export const INTEREST_TAXONOMY = [
  'Sports',
  'Local Events',
  'Culture',
  'Music',
  'Food & Drink',
  'Outdoors',
  'Tech',
  'Fitness',
  'Film & TV',
] as const

export const TARGET_SPACES = 8
export const MAX_PREMIUM = 2
export const MAX_PER_CATEGORY = 2
