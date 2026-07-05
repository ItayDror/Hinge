import { placeholderPhoto } from './placeholders'
import { QUESTIONS_BANK, type Question } from './questionsBank'

// --- Discover profiles (PRD Section 5: 8-10 mock profile cards) ---
export interface MockProfile {
  id: string
  name: string
  age: number
  photos: string[]
  prompt: { question: string; answer: string }
}

const PROFILE_SEED: Omit<MockProfile, 'photos'>[] = [
  { id: 'p1', name: 'Maya', age: 27, prompt: { question: 'Two truths and a lie', answer: 'I once ran a marathon, I hate cilantro, I’ve met three astronauts.' } },
  { id: 'p2', name: 'Jordan', age: 29, prompt: { question: 'My simple pleasures', answer: 'Sunday morning coffee on the fire escape.' } },
  { id: 'p3', name: 'Alex', age: 31, prompt: { question: 'A life goal of mine', answer: 'Learn to sail before I turn 35.' } },
  { id: 'p4', name: 'Sam', age: 26, prompt: { question: 'I go crazy for', answer: 'Live jazz and thrift store finds.' } },
  { id: 'p5', name: 'Riley', age: 28, prompt: { question: 'Together we could', answer: 'Argue about which pizza place is actually best.' } },
  { id: 'p6', name: 'Casey', age: 30, prompt: { question: 'My most controversial opinion', answer: 'Cereal is a soup.' } },
  { id: 'p7', name: 'Morgan', age: 25, prompt: { question: 'The way to win me over', answer: 'Show up with a good playlist recommendation.' } },
  { id: 'p8', name: 'Taylor', age: 32, prompt: { question: 'I’m overly competitive about', answer: 'Mini golf. Deeply, embarrassingly competitive.' } },
  { id: 'p9', name: 'Quinn', age: 27, prompt: { question: 'Typical Sunday', answer: 'Farmers market then a long, aimless walk.' } },
  { id: 'p10', name: 'Drew', age: 29, prompt: { question: 'Dating me is like', answer: 'A road trip with too many snack stops.' } },
]

export const MOCK_PROFILES: MockProfile[] = PROFILE_SEED.map((p) => ({
  ...p,
  photos: [placeholderPhoto(p.id + '-a'), placeholderPhoto(p.id + '-b')],
}))

// --- Spaces (PRD Section 4.2 / 5) ---
export interface SpaceReply {
  id: string
  authorHandle: string
  text: string
}

export interface SpacePost {
  id: string
  authorHandle: string
  text: string
  likeCount: number
  liked: boolean
  timestampLabel: string
  replyCount: number
  replies: SpaceReply[]
  reported: boolean
  isMutualSeed?: boolean
  /** Only set on isMutualSeed posts — the identity revealed at the end of the Blind Mode flow. */
  revealedName?: string
  revealedPhotoSeed?: string
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
  waitlistCount?: number
  waitlistThreshold?: number
  avatarPreviewUrls: string[]
  posts: SpacePost[]
}

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
    avatarPreviewUrls: [placeholderPhoto('knicks-1'), placeholderPhoto('knicks-2'), placeholderPhoto('knicks-3')],
    posts: [
      {
        id: 'post-1',
        authorHandle: 'courtside_kt',
        text: 'Brunson is cooking tonight, I refuse to be normal about it.',
        likeCount: 214,
        liked: false,
        timestampLabel: '12m ago',
        replyCount: 2,
        replies: [
          { id: 'r1', authorHandle: 'blue_and_orange', text: 'he is NOT missing tonight' },
          { id: 'r2', authorHandle: 'mid_range_king', text: 'literally screaming' },
        ],
        reported: false,
        isMutualSeed: true,
        revealedName: 'Kendall',
        revealedPhotoSeed: 'p1-a',
      },
      {
        id: 'post-2',
        authorHandle: 'garden_state_of_mind',
        text: 'Anyone else watching from a bar tonight? MSG energy from home.',
        likeCount: 98,
        liked: false,
        timestampLabel: '20m ago',
        replyCount: 1,
        replies: [{ id: 'r3', authorHandle: 'section_105', text: 'same, it is chaos here' }],
        reported: false,
      },
      {
        id: 'post-3',
        authorHandle: 'mid_range_king',
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
        authorHandle: 'blue_and_orange',
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
        authorHandle: 'section_105',
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
    waitlistCount: 47,
    waitlistThreshold: 75,
    avatarPreviewUrls: [placeholderPhoto('july4-1'), placeholderPhoto('july4-2'), placeholderPhoto('july4-3')],
    posts: [
      {
        id: 'post-j1',
        authorHandle: 'east_river_view',
        text: 'Best rooftop spots that aren’t insanely crowded? Asking for real this time.',
        likeCount: 33,
        liked: false,
        timestampLabel: '2h ago',
        replyCount: 1,
        replies: [{ id: 'rj1', authorHandle: 'fireworks_fan', text: 'DUMBO side is underrated' }],
        reported: false,
      },
      {
        id: 'post-j2',
        authorHandle: 'fireworks_fan',
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
        authorHandle: 'brooklyn_bound',
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
        authorHandle: 'skyline_seeker',
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
    avatarPreviewUrls: [placeholderPhoto('sfest-1'), placeholderPhoto('sfest-2'), placeholderPhoto('sfest-3')],
    posts: [
      {
        id: 'post-c1',
        authorHandle: 'front_row_or_bust',
        text: 'Who else is going to the Friday show? Meeting up beforehand?',
        likeCount: 74,
        liked: false,
        timestampLabel: '40m ago',
        replyCount: 2,
        replies: [
          { id: 'rc1', authorHandle: 'vinyl_and_coffee', text: 'yes! by the food trucks?' },
          { id: 'rc2', authorHandle: 'setlist_stan', text: 'in, hoping for an encore this time' },
        ],
        reported: false,
        isMutualSeed: true,
        revealedName: 'Val',
        revealedPhotoSeed: 'p9-a',
      },
      {
        id: 'post-c2',
        authorHandle: 'setlist_stan',
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
        authorHandle: 'vinyl_and_coffee',
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
        authorHandle: 'front_row_or_bust',
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
  {
    id: 's-boardgames',
    title: 'Board Game Night People',
    emoji: '🎲',
    category: 'Tech',
    status: 'interest-fallback',
    memberCount: 318,
    activityLabel: 'active this week',
    avatarPreviewUrls: [placeholderPhoto('bg-1'), placeholderPhoto('bg-2'), placeholderPhoto('bg-3')],
    posts: [
      {
        id: 'post-b1',
        authorHandle: 'meeple_enjoyer',
        text: 'Hot take: Wingspan is better with the expansion than base game.',
        likeCount: 44,
        liked: false,
        timestampLabel: '3h ago',
        replyCount: 1,
        replies: [{ id: 'rb1', authorHandle: 'catan_diplomat', text: 'the birds MATTER now, agreed' }],
        reported: false,
      },
      {
        id: 'post-b2',
        authorHandle: 'catan_diplomat',
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
        authorHandle: 'dice_tower_dreamer',
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
    avatarPreviewUrls: [placeholderPhoto('run-1'), placeholderPhoto('run-2'), placeholderPhoto('run-3')],
    posts: [
      {
        id: 'post-r1',
        authorHandle: 'early_miles',
        text: '6am loop through the park was unreal today, that fog though.',
        likeCount: 38,
        liked: false,
        timestampLabel: '25m ago',
        replyCount: 1,
        replies: [{ id: 'rr1', authorHandle: 'pace_chaser', text: 'wish I made it out, next time' }],
        reported: false,
      },
      {
        id: 'post-r2',
        authorHandle: 'pace_chaser',
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
  matchName: string
  matchPhoto: string
  spaceOriginLabel?: string
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

export const MOCK_CHATS: ChatThreadData[] = [
  {
    id: 'c-plain',
    matchName: 'Riley',
    matchPhoto: placeholderPhoto('p5-a'),
    messages: [
      { id: 'm1', sender: 'them', text: 'Hey! Loved your prompt about the fire escape coffee ritual.', kind: 'text' },
      { id: 'm2', sender: 'me', text: 'Ha, it’s basically my whole personality on weekends', kind: 'text' },
      { id: 'm3', sender: 'them', text: 'Same energy honestly. What neighborhood are you in?', kind: 'text' },
    ],
    battleCard: { status: 'none' },
    dateReadiness: { me: false, them: false },
  },
  {
    id: 'c-battle-pending',
    matchName: 'Jordan',
    matchPhoto: placeholderPhoto('p2-a'),
    spaceOriginLabel: '🏀 You both showed up for Knicks in 5',
    messages: [
      { id: 'm4', sender: 'them', text: 'Okay that game last night was unreal', kind: 'text' },
      { id: 'm5', sender: 'me', text: 'I could not sit still the entire 4th quarter', kind: 'text' },
      { id: 'm6', sender: 'me', text: 'You invited Jordan to play a card 🎴', kind: 'battle-card-invite' },
    ],
    battleCard: { status: 'invited', tier: 'light', question: QUESTIONS_BANK.find((q) => q.id === 'q2') },
    dateReadiness: { me: false, them: false },
  },
  {
    id: 'c-battle-revealed',
    matchName: 'Casey',
    matchPhoto: placeholderPhoto('p6-a'),
    messages: [
      { id: 'm7', sender: 'me', text: 'Ok this might be the most important question I ask you', kind: 'text' },
      { id: 'm8', sender: 'them', text: 'I am ready', kind: 'text' },
    ],
    battleCard: {
      status: 'revealed',
      tier: 'deep',
      question: QUESTIONS_BANK.find((q) => q.id === 'q6'),
      myAnswer: 'Being genuinely curious about each other’s day, even the boring parts.',
      theirAnswer: 'Laughing easily together, and still having your own things going on too.',
    },
    dateReadiness: { me: false, them: false },
  },
  {
    id: 'c-date-ready',
    matchName: 'Quinn',
    matchPhoto: placeholderPhoto('p9-a'),
    messages: [
      { id: 'm9', sender: 'them', text: 'This has been a genuinely great couple of weeks of texting', kind: 'text' },
      { id: 'm10', sender: 'me', text: 'Agreed, feels like it’s time', kind: 'text' },
      { id: 'm11', sender: 'me', text: 'You’re both ready to take it further 🎉', kind: 'system' },
    ],
    battleCard: { status: 'none' },
    dateReadiness: { me: true, them: true },
  },
]
