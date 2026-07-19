import { PEOPLE, personById, portraitAvatar, portraitCard, type Person } from './people'
import { DEMO_BATTLE_CARD_QUESTION, type Question } from './questionsBank'

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

const DECK_PERSON_IDS = ['maya', 'jordan', 'alex', 'sam', 'riley', 'casey', 'morgan', 'taylor', 'quinn', 'drew']

export const MOCK_PROFILES: MockProfile[] = DECK_PERSON_IDS.map((pid) => {
  const p = personById(pid)
  return {
    id: `profile-${p.id}`,
    personId: p.id,
    name: p.name,
    age: p.age,
    photoUrl: portraitCard(p),
    prompt: p.prompt,
    sharedSpaceId: p.sharedSpaceId,
  }
})

// --- Spaces (PRD Section 4.2 / 5) ---
export interface SpaceReply {
  id: string
  personId: string
  text: string
}

export interface SpacePost {
  id: string
  personId: string
  text: string
  likeCount: number
  liked: boolean
  timestampLabel: string
  replyCount: number
  replies: SpaceReply[]
  reported: boolean
}

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
  comments: SpaceAnswerComment[]
}

export type SpaceStatus = 'active' | 'waitlist' | 'time-bound' | 'interest-fallback'

export interface SpaceData {
  id: string
  title: string
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
  dailyQuestion: {
    question: { text: string; tone: 'light' | 'deep' }
    answers: SpaceAnswer[]
  }
  posts: SpacePost[]
  /** Optional rationale line for agent-generated spaces ("why now"). */
  whyNow?: string
}

const av = (pid: string) => portraitAvatar(personById(pid))

export const MOCK_SPACES: SpaceData[] = [
  {
    id: 's-knicks',
    title: 'Knicks in 5',
    emoji: '🏀',
    category: 'Sports',
    status: 'active',
    memberCount: 1204,
    activityLabel: 'active now',
    endingLabel: 'Ends after final buzzer',
    closesInDays: 4,
    premium: false,
    location: { name: 'New York, NY', radiusKm: 15 },
    avatarPreviewUrls: [av('kendall'), av('marcus'), av('sofia')],
    dailyQuestion: {
      question: { text: 'Game 7 seats or courtside for a random Tuesday game — and why?', tone: 'light' },
      answers: [
        {
          id: 'ans-k1',
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
          personId: 'james',
          text: 'Game 7. I want to feel my heartbeat in my teeth.',
          likeCount: 36,
          likedByMe: false,
          comments: [{ id: 'ac-k2a', personId: 'sofia', text: 'in your TEETH 😭' }],
        },
        {
          id: 'ans-k3',
          personId: 'sofia',
          text: 'Game 7, but only if I can bring my lucky towel from 2021.',
          likeCount: 22,
          likedByMe: false,
          comments: [],
        },
        {
          id: 'ans-k4',
          personId: 'marcus',
          text: 'Tuesday courtside. Playoff me is not someone you want to sit next to.',
          likeCount: 17,
          likedByMe: false,
          comments: [],
        },
        {
          id: 'ans-k5',
          personId: 'leo',
          text: 'Whichever one comes with the celebrity row. I’m there for the memes.',
          likeCount: 9,
          likedByMe: false,
          comments: [],
        },
      ],
    },
    posts: [
      {
        id: 'post-1',
        personId: 'kendall',
        text: 'Brunson is cooking tonight, I refuse to be normal about it.',
        likeCount: 214,
        liked: false,
        timestampLabel: '12m ago',
        replyCount: 2,
        replies: [
          { id: 'r1', personId: 'sofia', text: 'he is NOT missing tonight' },
          { id: 'r2', personId: 'james', text: 'literally screaming' },
        ],
        reported: false,
      },
      {
        id: 'post-2',
        personId: 'marcus',
        text: 'Anyone else watching from a bar tonight? MSG energy from home.',
        likeCount: 98,
        liked: false,
        timestampLabel: '20m ago',
        replyCount: 1,
        replies: [{ id: 'r3', personId: 'leo', text: 'same, it is chaos here' }],
        reported: false,
      },
      {
        id: 'post-3',
        personId: 'james',
        text: 'Real ones remember game 3 in 2021. This feels different though.',
        likeCount: 61,
        liked: false,
        timestampLabel: '35m ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
      {
        id: 'post-4',
        personId: 'sofia',
        text: 'Defense has been so underrated this series honestly.',
        likeCount: 40,
        liked: false,
        timestampLabel: '52m ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
      {
        id: 'post-5',
        personId: 'leo',
        text: 'If we win tonight I am buying the whole bar a round.',
        likeCount: 152,
        liked: false,
        timestampLabel: '1h ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
    ],
  },
  {
    id: 's-july4',
    title: '4th of July in NYC',
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
    dailyQuestion: {
      question: { text: 'Your perfect 4th: rooftop fireworks, beach BBQ, or escape the city entirely?', tone: 'light' },
      answers: [
        {
          id: 'ans-j1',
          personId: 'elena',
          text: 'Stoop party with the neighbors, fireworks between the buildings. Peak New York.',
          likeCount: 31,
          likedByMe: false,
          comments: [{ id: 'ac-j1a', personId: 'noah', text: 'between-the-buildings fireworks hit different' }],
        },
        {
          id: 'ans-j2',
          personId: 'noah',
          text: 'Rooftop, golden hour, one very overloaded grill.',
          likeCount: 24,
          likedByMe: false,
          comments: [],
        },
        {
          id: 'ans-j3',
          personId: 'zoe',
          text: 'Rockaway all day. Sunburnt, sandy, zero regrets.',
          likeCount: 19,
          likedByMe: false,
          comments: [{ id: 'ac-j3a', personId: 'priya', text: 'the A train ride back is a rite of passage' }],
        },
        {
          id: 'ans-j4',
          personId: 'priya',
          text: 'Escape. Upstate lake house, fireflies instead of fireworks.',
          likeCount: 15,
          likedByMe: false,
          comments: [],
        },
      ],
    },
    posts: [
      {
        id: 'post-j1',
        personId: 'elena',
        text: 'Best rooftop spots that aren’t insanely crowded? Asking for real this time.',
        likeCount: 33,
        liked: false,
        timestampLabel: '2h ago',
        replyCount: 1,
        replies: [{ id: 'rj1', personId: 'noah', text: 'DUMBO side is underrated' }],
        reported: false,
      },
      {
        id: 'post-j2',
        personId: 'noah',
        text: 'Group picnic blanket squad, who is in?',
        likeCount: 21,
        liked: false,
        timestampLabel: '3h ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
      {
        id: 'post-j3',
        personId: 'zoe',
        text: 'Bringing a speaker, no notes.',
        likeCount: 12,
        liked: false,
        timestampLabel: '5h ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
      {
        id: 'post-j4',
        personId: 'priya',
        text: 'Anyone know a good spot with actual bathroom access lol',
        likeCount: 18,
        liked: false,
        timestampLabel: '6h ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
    ],
  },
  {
    id: 's-summerfest',
    title: 'Summer Concert Series',
    emoji: '🎶',
    category: 'Culture',
    status: 'time-bound',
    memberCount: 862,
    activityLabel: 'active now',
    endingLabel: 'Ends Jul 5',
    closesInDays: 4,
    premium: false,
    location: { name: 'New York, NY', radiusKm: 25 },
    avatarPreviewUrls: [av('val'), av('alex'), av('morgan')],
    dailyQuestion: {
      question: { text: 'One song you’d risk heatstroke in a GA pit to hear live?', tone: 'light' },
      answers: [
        {
          id: 'ans-c1',
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
          personId: 'alex',
          text: 'A 12-minute live jam version of a 3-minute song. Yes I’ll cry.',
          likeCount: 27,
          likedByMe: false,
          comments: [],
        },
        {
          id: 'ans-c3',
          personId: 'morgan',
          text: 'The one song from my teenage playlist I pretend I’ve outgrown.',
          likeCount: 25,
          likedByMe: false,
          comments: [{ id: 'ac-c3a', personId: 'val', text: 'we never outgrow it, we just whisper it' }],
        },
        {
          id: 'ans-c4',
          personId: 'sam',
          text: 'Live sax solo. Any song. I will fight my way to the barricade for a sax.',
          likeCount: 18,
          likedByMe: false,
          comments: [],
        },
        {
          id: 'ans-c5',
          personId: 'drew',
          text: 'Whatever’s playing when the sun sets over the lawn seats.',
          likeCount: 12,
          likedByMe: false,
          comments: [],
        },
      ],
    },
    posts: [
      {
        id: 'post-c1',
        personId: 'val',
        text: 'Who else is going to the Friday show? Meeting up beforehand?',
        likeCount: 74,
        liked: false,
        timestampLabel: '40m ago',
        replyCount: 2,
        replies: [
          { id: 'rc1', personId: 'morgan', text: 'yes! by the food trucks?' },
          { id: 'rc2', personId: 'alex', text: 'in, hoping for an encore this time' },
        ],
        reported: false,
      },
      {
        id: 'post-c2',
        personId: 'alex',
        text: 'Last year’s closing set ruined me in the best way.',
        likeCount: 55,
        liked: false,
        timestampLabel: '1h ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
      {
        id: 'post-c3',
        personId: 'morgan',
        text: 'Bringing a blanket, lawn seats squad rise up.',
        likeCount: 29,
        liked: false,
        timestampLabel: '2h ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
      {
        id: 'post-c4',
        personId: 'sam',
        text: 'Opener is actually really good this year, look them up.',
        likeCount: 16,
        liked: false,
        timestampLabel: '3h ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
    ],
  },
  // ----- Premium spaces (locked until Hinge+ unlock) -----
  {
    id: 's-boardgames',
    title: 'Board Game Night People',
    emoji: '🎲',
    category: 'Tech',
    status: 'interest-fallback',
    memberCount: 318,
    activityLabel: 'active this week',
    closesInDays: 6,
    premium: true,
    location: { name: 'New York, NY', radiusKm: 30 },
    avatarPreviewUrls: [av('taylor'), av('quinn'), av('casey')],
    dailyQuestion: {
      question: { text: 'The board game that has genuinely tested your friendships?', tone: 'light' },
      answers: [
        {
          id: 'ans-b1',
          personId: 'taylor',
          text: 'Monopoly. We instituted a constitution afterwards.',
          likeCount: 21,
          likedByMe: false,
          comments: [{ id: 'ac-b1a', personId: 'quinn', text: 'a CONSTITUTION 😂' }],
        },
        {
          id: 'ans-b2',
          personId: 'quinn',
          text: 'Catan. I have seen alliances form and dissolve over sheep.',
          likeCount: 18,
          likedByMe: false,
          comments: [],
        },
        {
          id: 'ans-b3',
          personId: 'casey',
          text: 'Codenames with couples. Someone always sleeps on the couch.',
          likeCount: 14,
          likedByMe: false,
          comments: [],
        },
      ],
    },
    posts: [
      {
        id: 'post-b1',
        personId: 'taylor',
        text: 'Hot take: Wingspan is better with the expansion than base game.',
        likeCount: 44,
        liked: false,
        timestampLabel: '3h ago',
        replyCount: 1,
        replies: [{ id: 'rb1', personId: 'quinn', text: 'the birds MATTER now, agreed' }],
        reported: false,
      },
      {
        id: 'post-b2',
        personId: 'quinn',
        text: 'Looking for a 4th for a strategy game night this weekend.',
        likeCount: 27,
        liked: false,
        timestampLabel: '5h ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
      {
        id: 'post-b3',
        personId: 'casey',
        text: 'Anyone else always be the banker in every group?',
        likeCount: 19,
        liked: false,
        timestampLabel: '1d ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
    ],
  },
  {
    id: 's-running',
    title: 'Sunrise Run Club',
    emoji: '🏃',
    category: 'All',
    status: 'active',
    memberCount: 540,
    activityLabel: 'active now',
    closesInDays: 7,
    premium: true,
    location: { name: 'New York, NY', radiusKm: 10 },
    avatarPreviewUrls: [av('jordan'), av('maya'), av('leo')],
    dailyQuestion: {
      question: { text: 'Sunrise run reward: fancy coffee or a truly unhinged breakfast?', tone: 'light' },
      answers: [
        {
          id: 'ans-r1',
          personId: 'jordan',
          text: 'Unhinged breakfast. I run 10k specifically to justify the diner order.',
          likeCount: 26,
          likedByMe: false,
          comments: [{ id: 'ac-r1a', personId: 'maya', text: 'the diner order IS the training plan' }],
        },
        {
          id: 'ans-r2',
          personId: 'maya',
          text: 'Fancy coffee, but it has to be consumed dramatically on a bench.',
          likeCount: 20,
          likedByMe: false,
          comments: [],
        },
        {
          id: 'ans-r3',
          personId: 'leo',
          text: 'Both. That’s the whole point of the run.',
          likeCount: 13,
          likedByMe: false,
          comments: [],
        },
      ],
    },
    posts: [
      {
        id: 'post-r1',
        personId: 'jordan',
        text: '6am loop through the park was unreal today, that fog though.',
        likeCount: 38,
        liked: false,
        timestampLabel: '25m ago',
        replyCount: 1,
        replies: [{ id: 'rr1', personId: 'maya', text: 'wish I made it out, next time' }],
        reported: false,
      },
      {
        id: 'post-r2',
        personId: 'maya',
        text: 'Anyone training for a fall half? Looking for accountability.',
        likeCount: 22,
        liked: false,
        timestampLabel: '1h ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
    ],
  },
  {
    id: 's-cinema',
    title: 'Rooftop Cinema Club',
    emoji: '🎬',
    category: 'Culture',
    status: 'active',
    memberCount: 421,
    activityLabel: 'active today',
    closesInDays: 6,
    premium: true,
    location: { name: 'New York, NY', radiusKm: 15 },
    avatarPreviewUrls: [av('zoe'), av('james'), av('elena')],
    dailyQuestion: {
      question: { text: 'A movie you’ll defend with your life even though it’s objectively mid?', tone: 'light' },
      answers: [
        {
          id: 'ans-m1',
          personId: 'zoe',
          text: 'I will not name it here but the soundtrack alone carries three stars.',
          likeCount: 23,
          likedByMe: false,
          comments: [{ id: 'ac-m1a', personId: 'james', text: 'we all know exactly which one you mean' }],
        },
        {
          id: 'ans-m2',
          personId: 'james',
          text: 'Any heist movie where the plan makes zero sense. Cinema is about vibes.',
          likeCount: 19,
          likedByMe: false,
          comments: [],
        },
        {
          id: 'ans-m3',
          personId: 'elena',
          text: 'The rom-com everyone calls predictable. Yes. That’s the point. It’s a warm bath.',
          likeCount: 17,
          likedByMe: false,
          comments: [],
        },
      ],
    },
    posts: [
      {
        id: 'post-m1',
        personId: 'zoe',
        text: 'Tonight’s screening has a 10/10 skyline. Bring layers, trust me.',
        likeCount: 31,
        liked: false,
        timestampLabel: '1h ago',
        replyCount: 0,
        replies: [],
        reported: false,
      },
      {
        id: 'post-m2',
        personId: 'james',
        text: 'Petition for a double feature next weekend.',
        likeCount: 24,
        liked: false,
        timestampLabel: '4h ago',
        replyCount: 0,
        replies: [],
        reported: false,
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
  { id: 'like-1', personId: 'kendall', type: 'space', spaceId: 's-knicks' },
  { id: 'like-2', personId: 'sofia', type: 'regular' },
  { id: 'like-3', personId: 'val', type: 'space', spaceId: 's-summerfest' },
  { id: 'like-4', personId: 'james', type: 'regular' },
  { id: 'like-5', personId: 'noah', type: 'space', spaceId: 's-july4' },
  { id: 'like-6', personId: 'leo', type: 'regular' },
]

// --- Chats (PRD Section 4.4 / 5) ---
export interface ChatMessage {
  id: string
  sender: 'me' | 'them'
  text: string
  kind: 'text' | 'system' | 'battle-card-invite' | 'battle-card-answer'
}

export type BattleCardStatus = 'none' | 'invited' | 'accepted' | 'awaiting-other' | 'revealed' | 'expired'

export interface ChatThreadData {
  id: string
  personId: string
  matchName: string
  matchPhoto: string
  spaceOriginLabel?: string
  /** Space both people are members of (shared-space chip), independent of match origin. */
  sharedSpaceId?: string
  /** A suggested chat opener, drawn from the shared Daily Question / prompt content pipeline. */
  suggestedOpener?: string
  messages: ChatMessage[]
  battleCard: {
    status: BattleCardStatus
    tier?: 'light' | 'deep'
    question?: Question
    myAnswer?: string
    theirAnswer?: string
  }
  dateReadiness: {
    me: boolean
    them: boolean
    availabilityTagSelected?: string
  }
}

function chatPerson(pid: string): Pick<ChatThreadData, 'personId' | 'matchName' | 'matchPhoto'> {
  const p = personById(pid)
  return { personId: p.id, matchName: p.name, matchPhoto: portraitAvatar(p) }
}

export const MOCK_CHATS: ChatThreadData[] = [
  {
    id: 'c-plain',
    ...chatPerson('riley'),
    sharedSpaceId: 's-summerfest',
    suggestedOpener: "Alright Riley, I need to know: your pick for best pizza place, and are you ready to defend it?",
    messages: [
      { id: 'm1', sender: 'them', text: 'Hey! Loved your prompt about the fire escape coffee ritual.', kind: 'text' },
      { id: 'm2', sender: 'me', text: 'Ha, it’s basically my whole personality on weekends', kind: 'text' },
      { id: 'm3', sender: 'them', text: 'Same energy honestly. What neighborhood are you in?', kind: 'text' },
    ],
    battleCard: { status: 'none' },
    dateReadiness: { me: false, them: false },
  },
  {
    // Demo chat 1: MY outgoing Battle Card invite — gamified face-down card,
    // waiting for the other side to accept.
    id: 'c-battle-pending',
    ...chatPerson('jordan'),
    spaceOriginLabel: '🏀 You both showed up for Knicks in 5',
    messages: [
      { id: 'm4', sender: 'them', text: 'Okay that game last night was unreal', kind: 'text' },
      { id: 'm5', sender: 'me', text: 'I could not sit still the entire 4th quarter', kind: 'text' },
      { id: 'm6', sender: 'me', text: 'You invited Jordan to play a card 🎴', kind: 'battle-card-invite' },
    ],
    battleCard: { status: 'invited', tier: 'light' },
    dateReadiness: { me: false, them: false },
  },
  {
    // Demo chat 2: they accepted — the card is flipped face-up with the
    // question, I answer privately, and their answer reveals on submit.
    id: 'c-battle-accepted',
    ...chatPerson('casey'),
    messages: [
      { id: 'm7', sender: 'me', text: 'Ok this might be the most important question I ask you', kind: 'text' },
      { id: 'm8', sender: 'them', text: 'I am ready', kind: 'text' },
      { id: 'm8b', sender: 'them', text: 'Casey accepted your Battle Card 🎴', kind: 'system' },
    ],
    battleCard: {
      status: 'accepted',
      tier: 'light',
      question: DEMO_BATTLE_CARD_QUESTION,
    },
    dateReadiness: { me: false, them: false },
  },
  {
    // Demo chat 4: mutual date-readiness already reached — rendered as a
    // prominent celebration card in the thread, not buried system text.
    id: 'c-date-ready',
    ...chatPerson('quinn'),
    messages: [
      { id: 'm9', sender: 'them', text: 'This has been a genuinely great couple of weeks of texting', kind: 'text' },
      { id: 'm10', sender: 'me', text: 'Agreed, feels like it’s time', kind: 'text' },
    ],
    battleCard: { status: 'none' },
    dateReadiness: { me: true, them: true },
  },
]

export type { Person }
export { PEOPLE, personById, portraitAvatar, portraitCard }
