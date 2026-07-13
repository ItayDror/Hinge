import type { GeneratedQuestion, TrendHit } from '../shared/types'
import { weekOf } from './queries'

interface PromptInput {
  hits: TrendHit[]
  styleExamples: GeneratedQuestion[]
  alreadyUsed: string[]
  cities: string[]
  target: { location: number; time: number; general: number }
  lightRatio: number
}

export function buildQuestionPrompt({ hits, styleExamples, alreadyUsed, cities, target, lightRatio }: PromptInput): string {
  const evidence = hits
    .map((h, i) => `[${i}] (query: "${h.query}") ${h.title} — ${h.snippet.slice(0, 250)} — ${h.url}${h.publishedDate ? ` — ${h.publishedDate}` : ''}`)
    .join('\n')

  const examples = styleExamples.map((q) => `- (${q.kind}, ${q.tone}) ${q.text}`).join('\n')

  return `You are a content curator for a dating app. You write conversation-starter questions ("Daily Questions") that make two strangers want to reply to each other.

<trend_evidence>
${evidence}
</trend_evidence>

<style_examples>
${examples}
</style_examples>

<already_used>
${alreadyUsed.join('\n')}
</already_used>

Task: write exactly ${target.location + target.time + target.general} NEW questions: ${target.location} location-based (cities: ${cities.join('; ')}), ${target.time} time-relevant for the ${weekOf()}, ${target.general} general-interest. Rules:
- Each question is answerable in one fun sentence; no yes/no phrasing; nothing requiring niche knowledge.
- tone is "light" (playful) or "deep" (values/self-reflection); about ${Math.round(lightRatio * 100)}% should be light.
- location and time questions MUST cite the evidence item they were inspired by via its numeric index in "evidenceIndex". general questions use null.
- geo must be one of the listed cities (exact string) for location questions, null otherwise.
- timeWindow format "YYYY-MM-DD..YYYY-MM-DD" for time questions (a sensible 1-8 week window around now), null otherwise.
- Avoid anything resembling the questions in <already_used>.

Respond with ONLY a JSON array, no prose, no markdown fences:
[{ "text": "...", "kind": "location"|"time"|"general", "geo": "City, ST"|null, "timeWindow": "YYYY-MM-DD..YYYY-MM-DD"|null, "tone": "light"|"deep", "evidenceIndex": 3|null }]`
}
