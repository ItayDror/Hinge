// Shared content pipeline: the same question bank feeds both the Daily
// Question feature and the Battle Card tiers ("one content pipeline, two
// surfaces" per PRD Section 5).
export type QuestionTone = 'light' | 'deep'

export interface Question {
  id: string
  text: string
  tone: QuestionTone
  usableAsDailyQuestion: boolean
  usableAsBattleCard: boolean
}

export const QUESTIONS_BANK: Question[] = [
  { id: 'q1', text: 'Which podcast did you hear this week?', tone: 'light', usableAsDailyQuestion: true, usableAsBattleCard: true },
  { id: 'q2', text: 'Coffee or tea, and why?', tone: 'light', usableAsDailyQuestion: true, usableAsBattleCard: true },
  { id: 'q3', text: "What's a belief you've changed your mind about recently?", tone: 'deep', usableAsDailyQuestion: true, usableAsBattleCard: true },
  { id: 'q4', text: 'Mountains or beach for a weekend trip?', tone: 'light', usableAsDailyQuestion: true, usableAsBattleCard: true },
  { id: 'q5', text: "What's something you're weirdly competitive about?", tone: 'light', usableAsDailyQuestion: true, usableAsBattleCard: true },
  { id: 'q6', text: 'What does a great relationship look like to you, day-to-day?', tone: 'deep', usableAsDailyQuestion: true, usableAsBattleCard: true },
  { id: 'q7', text: 'What song has been stuck in your head lately?', tone: 'light', usableAsDailyQuestion: true, usableAsBattleCard: true },
  { id: 'q8', text: "What's a small thing that instantly improves your day?", tone: 'light', usableAsDailyQuestion: true, usableAsBattleCard: true },
  { id: 'q9', text: "What's a fear you've worked hard to get past?", tone: 'deep', usableAsDailyQuestion: true, usableAsBattleCard: true },
  { id: 'q10', text: 'Two truths and a lie — go.', tone: 'light', usableAsDailyQuestion: true, usableAsBattleCard: true },
  { id: 'q11', text: "What's the last thing you Googled that you'd be mildly embarrassed to explain?", tone: 'light', usableAsDailyQuestion: true, usableAsBattleCard: true },
  { id: 'q12', text: 'Sweet, salty, or savory — and is there a food you would actually fight for?', tone: 'light', usableAsDailyQuestion: true, usableAsBattleCard: true },
  { id: 'q13', text: "What's a hill you'll die on that is, objectively, a pretty small hill?", tone: 'light', usableAsDailyQuestion: true, usableAsBattleCard: true },
]

// Small curated rotation for the Daily Question interstitial — randomizes on
// each app open (rather than being locked to a deterministic per-date pick)
// so a live demo shows variety across reloads.
const DAILY_ROTATION_IDS = ['q1', 'q11', 'q12', 'q13']

export function getRandomDailyQuestion(): Question {
  const candidates = QUESTIONS_BANK.filter((q) => DAILY_ROTATION_IDS.includes(q.id))
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function getBattleCardQuestions(tier: QuestionTone): Question[] {
  return QUESTIONS_BANK.filter((q) => q.tone === tier && q.usableAsBattleCard)
}

export function todayDateSeed(): string {
  return new Date().toISOString().slice(0, 10)
}

// Fixed example exchange shown when a Battle Card invite is accepted —
// deliberately hardcoded (not drawn from QUESTIONS_BANK) so the demo always
// plays out the same engaging, slightly sassy interaction end-to-end.
export const DEMO_BATTLE_CARD_QUESTION: Question = {
  id: 'demo-sassy',
  text: "What's the pettiest reason you've ever almost ended things with someone?",
  tone: 'light',
  usableAsDailyQuestion: false,
  usableAsBattleCard: true,
}

export const DEMO_BATTLE_CARD_ANSWERS = {
  mine: "He pronounced 'GIF' with a hard G and would not back down. I started a mental list.",
  theirs: 'She said pineapple belongs on pizza. I forgave her. I have not forgotten.',
}
