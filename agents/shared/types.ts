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

export type SpaceKind = 'timely' | 'general'
export type Verdict = 'pass' | 'revise' | 'cut'

/** Agent 2's independent read on a proposal. */
export interface Critique {
  verdict: Verdict
  note: string
  /** What the critic changed, when it revised. */
  originalTitle?: string
  originalQuestion?: string
}

export interface SpaceProposal {
  id: string
  title: string
  emoji: string
  kind: SpaceKind
  category: string
  location: { name: string; lat?: number; lng?: number; radiusKm: number }
  closesInDays: number
  /** The room's single icebreaker — a space question, not a daily question. */
  spaceQuestion: { text: string; tone: Tone }
  whyNow: string
  sourceUrls: string[]
  critique?: Critique
}

export class AgentError extends Error {}
