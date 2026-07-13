export interface TrendHit {
  title: string
  url: string
  publishedDate: string | null
  snippet: string
  query: string
}

export type QuestionKind = 'location' | 'time' | 'general'
export type Tone = 'light' | 'deep'

export interface GeneratedQuestion {
  id: string
  text: string
  kind: QuestionKind
  geo: string | null
  timeWindow: string | null // "YYYY-MM-DD..YYYY-MM-DD"
  tone: Tone
  sourceTrend: { snippet: string; url: string | null } | null
}

export interface SpaceProposal {
  id: string
  title: string
  emoji: string
  category: string
  location: { name: string; lat?: number; lng?: number; radiusKm: number }
  closesInDays: number
  premiumSuggested: boolean
  seedDailyQuestion: { text: string; tone: Tone }
  whyNow: string
  sourceUrls: string[]
}

export class AgentError extends Error {}
