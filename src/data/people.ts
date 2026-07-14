// Unified person registry used across the Discover deck, Space answers/posts,
// chats, and Likes You — so the same face + name is consistent everywhere.
//
// PHOTOS: curated Unsplash portraits (stable hotlink IDs). Shutterstock
// requires a paid license/API, so Unsplash is the free stand-in; production
// would use real verified Hinge user photos.
export interface Person {
  id: string
  name: string
  age: number
  photoId: string
  prompt: { question: string; answer: string }
  job: string
  city: string
  /** If set, this person shares a Space with the current user (surfaced as a chip). */
  sharedSpaceId?: string
}

export const PEOPLE: Person[] = [
  // Women
  { id: 'maya', name: 'Maya', age: 27, photoId: 'photo-1494790108377-be9c29b29330', prompt: { question: 'Two truths and a lie', answer: 'I once ran a marathon, I hate cilantro, I’ve met three astronauts.' }, job: 'Product Designer at a startup', city: 'Brooklyn, New York', sharedSpaceId: 's-knicks' },
  { id: 'riley', name: 'Riley', age: 28, photoId: 'photo-1534528741775-53994a69daeb', prompt: { question: 'Together we could', answer: 'Argue about which pizza place is actually best.' }, job: 'Elementary School Teacher', city: 'Astoria, New York' },
  { id: 'morgan', name: 'Morgan', age: 25, photoId: 'photo-1517841905240-472988babdf9', prompt: { question: 'The way to win me over', answer: 'Show up with a good playlist recommendation.' }, job: 'Music Journalist', city: 'Lower East Side, New York' },
  { id: 'quinn', name: 'Quinn', age: 27, photoId: 'photo-1524504388940-b1c1722653e1', prompt: { question: 'Typical Sunday', answer: 'Farmers market then a long, aimless walk.' }, job: 'Pastry Chef', city: 'Park Slope, New York' },
  { id: 'kendall', name: 'Kendall', age: 26, photoId: 'photo-1529626455594-4ff0802cfb7e', prompt: { question: 'I go crazy for', answer: 'Playoff basketball and courtside theatrics.' }, job: 'Sports Marketing Manager', city: 'Chelsea, New York' },
  { id: 'val', name: 'Val', age: 29, photoId: 'photo-1544005313-94ddf0286df2', prompt: { question: 'My simple pleasures', answer: 'Front-row barricade, ears ringing for two days.' }, job: 'Concert Photographer', city: 'Bushwick, New York' },
  { id: 'sofia', name: 'Sofia', age: 28, photoId: 'photo-1488426862026-3ee34a7d66df', prompt: { question: 'A life goal of mine', answer: 'See a game at every NBA arena.' }, job: 'Physical Therapist', city: 'Hoboken, New Jersey' },
  { id: 'elena', name: 'Elena', age: 30, photoId: 'photo-1531746020798-e6953c6e8e04', prompt: { question: 'My most controversial opinion', answer: 'Rooftop parties are overrated; stoops are underrated.' }, job: 'Architect', city: 'Fort Greene, New York' },
  { id: 'priya', name: 'Priya', age: 26, photoId: 'photo-1508214751196-bcfd4ca60f91', prompt: { question: 'I’m weirdly attached to', answer: 'My city bike. She has a name.' }, job: 'Data Scientist at a fintech', city: 'Jersey City, New Jersey' },
  { id: 'zoe', name: 'Zoe', age: 24, photoId: 'photo-1438761681033-6461ffad8d80', prompt: { question: 'Dating me is like', answer: 'A photo dump with no context.' }, job: 'Social Media Producer', city: 'Williamsburg, New York' },
  // Men
  { id: 'jordan', name: 'Jordan', age: 29, photoId: 'photo-1500648767791-00dcc994a43e', prompt: { question: 'My simple pleasures', answer: 'Sunday morning coffee on the fire escape.' }, job: 'Software Engineer', city: 'Greenpoint, New York' },
  { id: 'alex', name: 'Alex', age: 31, photoId: 'photo-1506794778202-cad84cf45f1d', prompt: { question: 'A life goal of mine', answer: 'Learn to sail before I turn 35.' }, job: 'Maritime Lawyer', city: 'Financial District, New York' },
  { id: 'sam', name: 'Sam', age: 26, photoId: 'photo-1507003211169-0a1dd7228f2d', prompt: { question: 'I go crazy for', answer: 'Live jazz and thrift store finds.' }, job: 'Jazz Musician & Barista', city: 'Harlem, New York', sharedSpaceId: 's-summerfest' },
  { id: 'casey', name: 'Casey', age: 30, photoId: 'photo-1492562080023-ab3db95bfbce', prompt: { question: 'My most controversial opinion', answer: 'Cereal is a soup.' }, job: 'Chef de Cuisine', city: 'East Village, New York' },
  { id: 'taylor', name: 'Taylor', age: 32, photoId: 'photo-1472099645785-5658abf4ff4e', prompt: { question: 'I’m overly competitive about', answer: 'Mini golf. Deeply, embarrassingly competitive.' }, job: 'Management Consultant', city: 'Upper West Side, New York' },
  { id: 'drew', name: 'Drew', age: 29, photoId: 'photo-1519085360753-af0119f7cbe7', prompt: { question: 'Dating me is like', answer: 'A road trip with too many snack stops.' }, job: 'Documentary Editor', city: 'Ridgewood, New York', sharedSpaceId: 's-july4' },
  { id: 'marcus', name: 'Marcus', age: 31, photoId: 'photo-1539571696357-5a69c17a67c6', prompt: { question: 'Typical Sunday', answer: 'Pickup ball, then pretending my knees are fine.' }, job: 'High School Basketball Coach', city: 'Bed-Stuy, New York' },
  { id: 'james', name: 'James', age: 28, photoId: 'photo-1547425260-76bcadfb4f2c', prompt: { question: 'The way to win me over', answer: 'Know at least one deep-cut stat about the 90s Knicks.' }, job: 'Sports Analytics Writer', city: 'Long Island City, New York' },
  { id: 'noah', name: 'Noah', age: 27, photoId: 'photo-1552058544-f2b08422138a', prompt: { question: 'My simple pleasures', answer: 'Golden hour on any rooftop in the city.' }, job: 'Landscape Photographer', city: 'DUMBO, New York' },
  { id: 'leo', name: 'Leo', age: 25, photoId: 'photo-1500048993953-d23a436266cf', prompt: { question: 'Two truths and a lie', answer: 'I’ve been on TV, I can juggle, I’ve never had bubble tea.' }, job: 'Grad Student at NYU', city: 'Greenwich Village, New York' },
]

export function personById(id: string): Person {
  const p = PEOPLE.find((p) => p.id === id)
  if (!p) throw new Error(`Unknown person id: ${id}`)
  return p
}

/** Large 4:5 portrait for profile cards. */
export function portraitCard(person: Person): string {
  return `https://images.unsplash.com/${person.photoId}?w=600&h=750&fit=crop&crop=faces&auto=format`
}

/** Small square portrait for avatars. */
export function portraitAvatar(person: Person): string {
  return `https://images.unsplash.com/${person.photoId}?w=150&h=150&fit=crop&crop=faces&auto=format`
}
