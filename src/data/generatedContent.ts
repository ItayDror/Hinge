// Loads agent-generated content (agents/question-curator, agents/space-curator)
// from src/data/generated/*.json with graceful fallback: the files are
// discovered via import.meta.glob so a missing/empty file never breaks the
// Vite build, and the app silently falls back to the static banks.
import type { Question } from './questionsBank'
import type { SpaceData } from './mockData'
import { PEOPLE, portraitAvatar } from './people'

interface GeneratedQuestionFile {
  version: number
  questions?: {
    id: string
    text: string
    kind: 'location' | 'time' | 'general'
    geo: string | null
    timeWindow: string | null
    tone: 'light' | 'deep'
  }[]
}

interface GeneratedSpaceFile {
  version: number
  spaces?: {
    id: string
    title: string
    emoji: string
    category: string
    location: { name: string; radiusKm: number }
    closesInDays: number
    premiumSuggested: boolean
    seedDailyQuestion: { text: string; tone: 'light' | 'deep' }
    whyNow: string
  }[]
}

const generatedModules = import.meta.glob('./generated/*.json', { eager: true }) as Record<string, { default: unknown }>

function loadFile<T>(name: string): T | null {
  const entry = Object.entries(generatedModules).find(([path]) => path.endsWith(`/${name}`))
  return entry ? (entry[1].default as T) : null
}

/** Deterministic small hash for synthesized member counts / avatar picks. */
function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function getGeneratedQuestions(): Question[] {
  const file = loadFile<GeneratedQuestionFile>('questions.json')
  if (!file || !Array.isArray(file.questions)) return []
  return file.questions.map((q) => ({
    id: q.id,
    text: q.text,
    tone: q.tone,
    usableAsDailyQuestion: true,
    usableAsBattleCard: true,
  }))
}

export function getGeneratedSpaces(): SpaceData[] {
  const file = loadFile<GeneratedSpaceFile>('spaces.json')
  if (!file || !Array.isArray(file.spaces)) return []
  return file.spaces.map((s) => {
    const h = hashId(s.id)
    const members = 40 + (h % 860)
    const posterPool = PEOPLE.slice() // deterministic picks from the registry
    const pick = (n: number) => posterPool[(h + n * 7) % posterPool.length]
    return {
      id: s.id,
      title: s.title,
      emoji: s.emoji,
      category: s.category,
      status: 'time-bound',
      memberCount: members,
      activityLabel: 'active now',
      closesInDays: s.closesInDays,
      // Demo constraint: exactly 3 spaces (the static free ones) are unlocked;
      // all agent-generated spaces land on the Hinge+ shelf regardless of the
      // curator's premiumSuggested hint.
      premium: true,
      location: { name: s.location.name, radiusKm: s.location.radiusKm },
      avatarPreviewUrls: [portraitAvatar(pick(1)), portraitAvatar(pick(2)), portraitAvatar(pick(3))],
      dailyQuestion: {
        question: { text: s.seedDailyQuestion.text, tone: s.seedDailyQuestion.tone },
        answers: [],
      },
      posts: [
        {
          id: `${s.id}-seed-post`,
          personId: pick(4).id,
          text: s.whyNow,
          likeCount: 5 + (h % 40),
          liked: false,
          timestampLabel: 'today',
          replyCount: 0,
          replies: [],
          reported: false,
        },
      ],
      whyNow: s.whyNow,
    }
  })
}
