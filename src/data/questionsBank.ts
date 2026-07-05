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
]

// Deterministic pick by a date-seed string, so "today" always shows the same
// question within a session without needing real persistence.
export function getDailyQuestion(dateSeed: string): Question {
  let hash = 0
  for (let i = 0; i < dateSeed.length; i++) {
    hash = (hash << 5) - hash + dateSeed.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % QUESTIONS_BANK.length
  return QUESTIONS_BANK[index]
}

export function getBattleCardQuestions(tier: QuestionTone): Question[] {
  return QUESTIONS_BANK.filter((q) => q.tone === tier && q.usableAsBattleCard)
}

export function todayDateSeed(): string {
  return new Date().toISOString().slice(0, 10)
}
