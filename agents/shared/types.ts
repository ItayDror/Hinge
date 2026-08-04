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
  /** The question as Agent 1 wrote it, when the critic rewrote it. */
  originalQuestion?: string
}

export interface SpaceProposal {
  id: string
  /**
   * The Space's question — and its only name. It is the title in the Spaces
   * list and the header of the room, so it is deliberately kept short.
   */
  question: string
  tone: Tone
  emoji: string
  kind: SpaceKind
  category: string
  location: { name: string; lat?: number; lng?: number; radiusKm: number }
  closesInDays: number
  whyNow: string
  sourceUrls: string[]
  critique?: Critique
}

export class AgentError extends Error {}
