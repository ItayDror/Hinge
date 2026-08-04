import { PEOPLE, feedPeople, personById, portraitAvatar, portraitCard, type Person } from './people'

// --- Discover profiles (PRD Section 5) — derived from the shared people registry ---
export interface MockProfile {
  id: string
  personId: string
  name: string
  age: number
  photoUrl: string
  prompt: { question: string; answer: string }
  sharedSpaceId?: string
}

// The feed is single-gender (see FEED_GENDER in people.ts).
export const MOCK_PROFILES: MockProfile[] = feedPeople().map((p) => ({
  id: `profile-${p.id}`,
  personId: p.id,
  name: p.name,
  age: p.age,
  photoUrl: portraitCard(p),
  prompt: p.prompt,
  sharedSpaceId: p.sharedSpaceId,
}))

// --- Spaces (PRD Section 4.2 / 5) ---
export interface SpaceAnswerComment {
  id: string
  personId: string
  text: string
}

export interface SpaceAnswer {
  id: string
  personId: string
  text: string
  likeCount: number
  likedByMe: boolean
  timestampLabel?: string
  reported?: boolean
  comments: SpaceAnswerComment[]
}

export type SpaceStatus = 'active' | 'waitlist' | 'time-bound' | 'interest-fallback'

export interface SpaceData {
  id: string
  /**
   * A Space is its question. There is no separate room name and no separate
   * daily prompt — the question is the title, and `answers` is the only feed.
   * Keep these short: they have to work as a name in a list.
   */
  question: string
  tone: 'light' | 'deep'
  emoji: string
  category: string
  status: SpaceStatus
  memberCount: number
  activityLabel: string
  endingLabel?: string
  closesInDays: number
  premium: boolean
  location: { name: string; radiusKm: number }
  waitlistCount?: number
  waitlistThreshold?: number
  avatarPreviewUrls: string[]
  answers: SpaceAnswer[]
  /**
   * What's happening that makes this room exist right now. A short question
   * can stay short and human ("What's your worst subway story?") because the
   * real-world anchor lives here instead of being crammed into the title.
   * Evergreen rooms have no hook.
   */
  hook?: {
    /** One glanceable line, shown under the question. */
    label: string
    /** The full story, revealed by the ⓘ. */
    detail: string
    sourceLabel?: string
  }
}

const av = (pid: string) => portraitAvatar(personById(pid))

export const MOCK_SPACES: SpaceData[] = [
  {
    id: 's-scaries',
    emoji: '😰',
    category: 'Culture',
    status: 'active',
    memberCount: 126,
    activityLabel: 'active now',
    closesInDays: 5,
    premium: false,
    location: { name: 'New York, NY', radiusKm: 20 },
    avatarPreviewUrls: [av('emma'), av('taylor'), av('priya')],
    question: "What's giving you the Sunday scaries?",
    tone: 'light',
    answers: [
      {
        id: 'ans-sc1',
        timestampLabel: '12m ago',
        personId: 'emma',
        text: "I'm presenting our new Hinge product idea TO THE ACTUAL HINGE TEAM this week! Wish me luck",
        likeCount: 71,
        likedByMe: false,
        comments: [
          {
            id: 'ac-sc1a',
            personId: 'taylor',
            text: "You want to have been the person to invent this new Spaces feature… it's awesome",
          },
          { id: 'ac-sc1b', personId: 'priya', text: 'okay this is the least scary scary I have ever read. go get them' },
        ],
      },
      {
        id: 'ans-sc2',
        timestampLabel: '40m ago',
        personId: 'noah',
        text: "Told my landlord I'd 'get back to him by Monday.' It is Monday.",
        likeCount: 44,
        likedByMe: false,
        comments: [{ id: 'ac-sc2a', personId: 'leo', text: 'the classic Monday-shaped problem' }],
      },
      {
        id: 'ans-sc3',
        timestampLabel: '1h ago',
        personId: 'leo',
        text: 'Thesis defense Thursday and roughly 40% of my slides are memes. Committing to the bit.',
        likeCount: 38,
        likedByMe: false,
        comments: [],
      },
      {
        id: 'ans-sc4',
        timestampLabel: '2h ago',
        personId: 'priya',
        text: 'Dentist, doctor, and DMV in the same week. I have angered someone.',
        likeCount: 29,
        likedByMe: false,
        comments: [],
      },
      {
        id: 'ans-sc5',
        timestampLabel: '3h ago',
        personId: 'marcus',
        text: 'Parent-teacher conferences. The teenagers are not the scary part.',
        likeCount: 21,
        likedByMe: false,
        comments: [],
      },
    ],
  },
  {
    id: 's-restaurantweek',
    emoji: '🍽️',
    category: 'Local Events',
    status: 'time-bound',
    memberCount: 143,
    activityLabel: 'active now',
    endingLabel: 'Ends with the last prix fixe',
    closesInDays: 6,
    premium: false,
    location: { name: 'New York, NY', radiusKm: 15 },
    avatarPreviewUrls: [av('casey'), av('elena'), av('alex')],
    question: "Where are you going for Restaurant Week?",
    hook: {
      label: "NYC Restaurant Week · ends Sunday",
      detail: "Restaurant Week runs through Sunday — 600+ prix fixe menus across the five boroughs, and everyone is quietly panic-booking.",
      sourceLabel: "Eater NY",
    },
    tone: 'light',
    answers: [
      {
        id: 'ans-rw1',
        timestampLabel: '12m ago',
        personId: 'casey',
        text: 'Professional opinion: skip the hyped rooms and go where the pastry chef is showing off.',
        likeCount: 58,
        likedByMe: false,
        comments: [
          { id: 'ac-rw1a', personId: 'zoe', text: 'a chef telling us to follow the desserts is the tip I needed' },
          { id: 'ac-rw1b', personId: 'elena', text: 'name one. we will not tell anyone. (we will tell everyone)' },
        ],
      },
      {
        id: 'ans-rw2',
        timestampLabel: '40m ago',
        personId: 'elena',
        text: 'Gramercy Tavern, and I intend to order like it is my final meal on earth.',
        likeCount: 41,
        likedByMe: false,
        comments: [],
      },
      {
        id: 'ans-rw3',
        timestampLabel: '1h ago',
        personId: 'alex',
        text: 'Le Bernardin or nothing. Booked it three weeks out like a functioning adult.',
        likeCount: 36,
        likedByMe: false,
        comments: [{ id: 'ac-rw3a', personId: 'casey', text: 'respect the forward planning' }],
      },
      {
        id: 'ans-rw4',
        timestampLabel: '2h ago',
        personId: 'drew',
        text: 'Any $45 prix fixe where dessert is actually included. That is the entire strategy.',
        likeCount: 27,
        likedByMe: false,
        comments: [],
      },
      {
        id: 'ans-rw5',
        timestampLabel: '3h ago',
        personId: 'zoe',
        text: 'I built a color-coded spreadsheet by neighborhood and price. I am not joking.',
        likeCount: 24,
        likedByMe: false,
        comments: [],
      },
    ],
  },
  {
    id: 's-knicks',
    emoji: '🏀',
    category: 'Sports',
    status: 'active',
    memberCount: 148,
    activityLabel: 'active now',
    endingLabel: 'Ends after final buzzer',
    closesInDays: 4,
    premium: false,
    location: { name: 'New York, NY', radiusKm: 15 },
    avatarPreviewUrls: [av('kendall'), av('marcus'), av('sofia')],
    question: "Game 7 seats or courtside on a Tuesday?",
    hook: {
      label: "Knicks–Celtics Game 5 · tonight",
      detail: "The Knicks are back at the Garden tonight up 3-1, and the city has fully lost the plot about it.",
      sourceLabel: "The Athletic",
    },
    tone: 'light',
    answers: [
      {
        id: 'ans-k1',
        timestampLabel: '12m ago',
        personId: 'kendall',
        text: 'Courtside on a random Tuesday. Zero stakes, maximum heckling range.',
        likeCount: 48,
        likedByMe: false,
        comments: [
          { id: 'ac-k1a', personId: 'marcus', text: 'heckling range is a legitimate metric' },
          { id: 'ac-k1b', personId: 'leo', text: 'this is the only correct answer' },
        ],
      },
      {
        id: 'ans-k2',
        timestampLabel: '40m ago',
        personId: 'james',
        text: 'Game 7. I want to feel my heartbeat in my teeth.',
        likeCount: 36,
        likedByMe: false,
        comments: [{ id: 'ac-k2a', personId: 'sofia', text: 'in your TEETH 😭' }],
      },
      {
        id: 'ans-k3',
        timestampLabel: '1h ago',
        personId: 'sofia',
        text: 'Game 7, but only if I can bring my lucky towel from 2021.',
        likeCount: 22,
        likedByMe: false,
        comments: [],
      },
      {
        id: 'ans-k4',
        timestampLabel: '2h ago',
        personId: 'marcus',
        text: 'Tuesday courtside. Playoff me is not someone you want to sit next to.',
        likeCount: 17,
        likedByMe: false,
        comments: [],
      },
      {
        id: 'ans-k5',
        timestampLabel: '3h ago',
        personId: 'leo',
        text: 'Whichever one comes with the celebrity row. I’m there for the memes.',
        likeCount: 9,
        likedByMe: false,
        comments: [],
      },
    ],
  },
  {
    id: 's-july4',
    emoji: '🎆',
    category: 'Local Events',
    status: 'waitlist',
    memberCount: 47,
    activityLabel: '47 people interested',
    closesInDays: 5,
    premium: false,
    location: { name: 'New York, NY', radiusKm: 20 },
    waitlistCount: 47,
    waitlistThreshold: 75,
    avatarPreviewUrls: [av('elena'), av('noah'), av('zoe')],
    question: "What does your perfect 4th look like?",
    hook: {
      label: "4th of July · this Saturday",
      detail: "Macy's is putting the fireworks on the East River again this year, which reopens the annual rooftop-versus-beach argument.",
      sourceLabel: "NYC Parks",
    },
    tone: 'light',
    answers: [
      {
        id: 'ans-j1',
        timestampLabel: '12m ago',
        personId: 'elena',
        text: 'Stoop party with the neighbors, fireworks between the buildings. Peak New York.',
        likeCount: 31,
        likedByMe: false,
        comments: [{ id: 'ac-j1a', personId: 'noah', text: 'between-the-buildings fireworks hit different' }],
      },
      {
        id: 'ans-j2',
        timestampLabel: '40m ago',
        personId: 'noah',
        text: 'Rooftop, golden hour, one very overloaded grill.',
        likeCount: 24,
        likedByMe: false,
        comments: [],
      },
      {
        id: 'ans-j3',
        timestampLabel: '1h ago',
        personId: 'zoe',
        text: 'Rockaway all day. Sunburnt, sandy, zero regrets.',
        likeCount: 19,
        likedByMe: false,
        comments: [{ id: 'ac-j3a', personId: 'priya', text: 'the A train ride back is a rite of passage' }],
      },
      {
        id: 'ans-j4',
        timestampLabel: '2h ago',
        personId: 'priya',
        text: 'Escape. Upstate lake house, fireflies instead of fireworks.',
        likeCount: 15,
        likedByMe: false,
        comments: [],
      },
    ],
  },
  {
    id: 's-summerfest',
    emoji: '🎶',
    category: 'Culture',
    status: 'time-bound',
    memberCount: 132,
    activityLabel: 'active now',
    endingLabel: 'Ends Jul 5',
    closesInDays: 4,
    premium: true,
    location: { name: 'New York, NY', radiusKm: 25 },
    avatarPreviewUrls: [av('val'), av('alex'), av('morgan')],
    question: "One song worth the GA pit?",
    hook: {
      label: "Summer Concert Series · ends Jul 5",
      detail: "The free summer series wraps up next weekend — six nights left in Prospect Park before it's over for the year.",
      sourceLabel: "BRIC",
    },
    tone: 'light',
    answers: [
      {
        id: 'ans-c1',
        timestampLabel: '12m ago',
        personId: 'val',
        text: 'Any closer that makes 20,000 strangers scream the bridge together. That’s church.',
        likeCount: 44,
        likedByMe: false,
        comments: [
          { id: 'ac-c1a', personId: 'morgan', text: 'THE BRIDGE. exactly.' },
          { id: 'ac-c1b', personId: 'sam', text: 'ok this one wins' },
        ],
      },
      {
        id: 'ans-c2',
        timestampLabel: '40m ago',
        personId: 'alex',
        text: 'A 12-minute live jam version of a 3-minute song. Yes I’ll cry.',
        likeCount: 27,
        likedByMe: false,
        comments: [],
      },
      {
        id: 'ans-c3',
        timestampLabel: '1h ago',
        personId: 'morgan',
        text: 'The one song from my teenage playlist I pretend I’ve outgrown.',
        likeCount: 25,
        likedByMe: false,
        comments: [{ id: 'ac-c3a', personId: 'val', text: 'we never outgrow it, we just whisper it' }],
      },
      {
        id: 'ans-c4',
        timestampLabel: '2h ago',
        personId: 'sam',
        text: 'Live sax solo. Any song. I will fight my way to the barricade for a sax.',
        likeCount: 18,
        likedByMe: false,
        comments: [],
      },
      {
        id: 'ans-c5',
        timestampLabel: '3h ago',
        personId: 'drew',
        text: 'Whatever’s playing when the sun sets over the lawn seats.',
        likeCount: 12,
        likedByMe: false,
        comments: [],
      },
    ],
  },
  // ----- Premium spaces (locked until Hinge+ unlock) -----
  {
    id: 's-boardgames',
    emoji: '🎲',
    category: 'Tech',
    status: 'interest-fallback',
    memberCount: 86,
    activityLabel: 'active this week',
    closesInDays: 6,
    premium: true,
    location: { name: 'New York, NY', radiusKm: 30 },
    avatarPreviewUrls: [av('taylor'), av('quinn'), av('casey')],
    question: "Which board game tested a friendship?",
    tone: 'light',
    answers: [
      {
        id: 'ans-b1',
        timestampLabel: '12m ago',
        personId: 'taylor',
        text: 'Monopoly. We instituted a constitution afterwards.',
        likeCount: 21,
        likedByMe: false,
        comments: [{ id: 'ac-b1a', personId: 'quinn', text: 'a CONSTITUTION 😂' }],
      },
      {
        id: 'ans-b2',
        timestampLabel: '40m ago',
        personId: 'quinn',
        text: 'Catan. I have seen alliances form and dissolve over sheep.',
        likeCount: 18,
        likedByMe: false,
        comments: [],
      },
      {
        id: 'ans-b3',
        timestampLabel: '1h ago',
        personId: 'casey',
        text: 'Codenames with couples. Someone always sleeps on the couch.',
        likeCount: 14,
        likedByMe: false,
        comments: [],
      },
    ],
  },
  {
    id: 's-running',
    emoji: '🏃',
    category: 'All',
    status: 'active',
    memberCount: 104,
    activityLabel: 'active now',
    closesInDays: 7,
    premium: true,
    location: { name: 'New York, NY', radiusKm: 10 },
    avatarPreviewUrls: [av('jordan'), av('maya'), av('leo')],
    question: "Post-run: fancy coffee or unhinged breakfast?",
    tone: 'light',
    answers: [
      {
        id: 'ans-r1',
        timestampLabel: '12m ago',
        personId: 'jordan',
        text: 'Unhinged breakfast. I run 10k specifically to justify the diner order.',
        likeCount: 26,
        likedByMe: false,
        comments: [{ id: 'ac-r1a', personId: 'maya', text: 'the diner order IS the training plan' }],
      },
      {
        id: 'ans-r2',
        timestampLabel: '40m ago',
        personId: 'maya',
        text: 'Fancy coffee, but it has to be consumed dramatically on a bench.',
        likeCount: 20,
        likedByMe: false,
        comments: [],
      },
      {
        id: 'ans-r3',
        timestampLabel: '1h ago',
        personId: 'leo',
        text: 'Both. That’s the whole point of the run.',
        likeCount: 13,
        likedByMe: false,
        comments: [],
      },
    ],
  },
  {
    id: 's-cinema',
    emoji: '🎬',
    category: 'Culture',
    status: 'active',
    memberCount: 97,
    activityLabel: 'active today',
    closesInDays: 6,
    premium: true,
    location: { name: 'New York, NY', radiusKm: 15 },
    avatarPreviewUrls: [av('zoe'), av('james'), av('elena')],
    question: "What movie will you defend forever?",
    tone: 'light',
    answers: [
      {
        id: 'ans-m1',
        timestampLabel: '12m ago',
        personId: 'zoe',
        text: 'I will not name it here but the soundtrack alone carries three stars.',
        likeCount: 23,
        likedByMe: false,
        comments: [{ id: 'ac-m1a', personId: 'james', text: 'we all know exactly which one you mean' }],
      },
      {
        id: 'ans-m2',
        timestampLabel: '40m ago',
        personId: 'james',
        text: 'Any heist movie where the plan makes zero sense. Cinema is about vibes.',
        likeCount: 19,
        likedByMe: false,
        comments: [],
      },
      {
        id: 'ans-m3',
        timestampLabel: '1h ago',
        personId: 'elena',
        text: 'The rom-com everyone calls predictable. Yes. That’s the point. It’s a warm bath.',
        likeCount: 17,
        likedByMe: false,
        comments: [],
      },
    ],
  },
]

// --- Likes You: ONLY profile likes appear here. People who merely liked or
// commented on my posts do NOT — a like has to be sent on the profile itself.
// Space-originated profile likes keep their origin ("Liked you via <space>").
export interface MockLike {
  id: string
  personId: string
  type: 'regular' | 'space'
  /** For space-originated profile likes: where they met me. */
  spaceId?: string
}

export const MOCK_LIKES: MockLike[] = [
  { id: 'like-1', personId: 'james', type: 'space', spaceId: 's-knicks' },
  { id: 'like-2', personId: 'noah', type: 'regular' },
  { id: 'like-3', personId: 'sam', type: 'space', spaceId: 's-summerfest' },
  { id: 'like-4', personId: 'leo', type: 'regular' },
  { id: 'like-5', personId: 'drew', type: 'space', spaceId: 's-july4' },
  { id: 'like-6', personId: 'alex', type: 'regular' },
]

// --- Chats: pure conversation. The only extra signal is where you met. ---
export interface ChatMessage {
  id: string
  sender: 'me' | 'them'
  text: string
  kind: 'text' | 'system'
}

export interface ChatThreadData {
  id: string
  personId: string
  matchName: string
  matchPhoto: string
  /** "🏀 You matched in Knicks in 5" — set when the match came from a Space. */
  spaceOriginLabel?: string
  /** Space both people are members of, independent of match origin. */
  sharedSpaceId?: string
  messages: ChatMessage[]
}

function chatPerson(pid: string): Pick<ChatThreadData, 'personId' | 'matchName' | 'matchPhoto'> {
  const p = personById(pid)
  return { personId: p.id, matchName: p.name, matchPhoto: portraitAvatar(p) }
}

// Two conversations that already came out of Spaces — so Messages isn't
// empty before you complete the flow yourself.
export const MOCK_CHATS: ChatThreadData[] = [
  {
    id: 'c-jordan',
    ...chatPerson('jordan'),
    spaceOriginLabel: '🏀 You matched in Knicks in 5',
    sharedSpaceId: 's-knicks',
    messages: [
      { id: 'm1', sender: 'me', text: 'Your take on the 4th quarter collapse was the only sane one in that space', kind: 'text' },
      { id: 'm2', sender: 'them', text: 'Finally someone gets it 😅 I was getting cooked in the replies', kind: 'text' },
      { id: 'm3', sender: 'them', text: 'Are you watching game 5 anywhere or at home?', kind: 'text' },
    ],
  },
  {
    id: 'c-sam',
    ...chatPerson('sam'),
    spaceOriginLabel: '🎶 You matched in Summer Concert Series',
    sharedSpaceId: 's-summerfest',
    messages: [
      { id: 'm4', sender: 'me', text: 'Okay the sax answer won me over, not gonna lie', kind: 'text' },
      { id: 'm5', sender: 'them', text: 'It is genuinely my whole personality. Who are you seeing Friday?', kind: 'text' },
    ],
  },
]

export type { Person }
export { PEOPLE, personById, portraitAvatar, portraitCard }
