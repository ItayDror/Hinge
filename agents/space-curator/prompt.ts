import type { TrendHit } from '../shared/types'
import type { CityConfig } from './config'

interface PromptInput {
  hits: TrendHit[]
  cities: CityConfig[]
  taxonomy: readonly string[]
  existingSpaces: { title: string; category: string }[]
  target: number
  maxPremium: number
}

export function buildSpacePrompt({ hits, cities, taxonomy, existingSpaces, target, maxPremium }: PromptInput): string {
  const evidence = hits
    .map((h, i) => `[${i}] (query: "${h.query}") ${h.title} — ${h.snippet.slice(0, 250)} — ${h.url}${h.publishedDate ? ` — ${h.publishedDate}` : ''}`)
    .join('\n')

  const cityLines = cities.map((c) => `${c.name} (${c.lat},${c.lng}, default radius ${c.defaultRadiusKm}km)`).join('; ')
  const existing = existingSpaces.map((s) => `- ${s.title} (${s.category})`).join('\n')

  return `You are curating time-bound community "Spaces" for a dating app. A Space is a short-lived themed room (closes in 4-7 days) anchored to a real, current moment. Each Space has TWO dimensions: a location (users whose chosen radius covers it are eligible) and an interest category.

<trend_evidence>
${evidence}
</trend_evidence>

<existing_spaces>
${existing}
</existing_spaces>

<cities>
${cityLines}
</cities>

<interest_taxonomy>
${taxonomy.join(' | ')}
</interest_taxonomy>

Task: propose exactly ${target} Spaces, at least 1 per listed city. Rules:
- Anchor each Space to a concrete evidence item (cite its numeric index in "evidenceIndex"); "whyNow" must state the real-world hook in one sentence (max 200 chars).
- "category" MUST be one of the taxonomy values verbatim. "locationName" MUST start with one of the listed city names (you may add a venue/neighborhood prefix like "Central Park, New York, NY").
- Title must be 30 characters or fewer, punchy, no generic titles like "Sports Fans".
- "closesInDays" is an integer 4-7 matching the event window.
- Mark "premiumSuggested": true for at most ${maxPremium} (exclusive/high-demand vibes).
- "seedDailyQuestion" is a themed icebreaker someone in this Space would love to answer (tone "light" or "deep").

Respond with ONLY a JSON array, no prose, no markdown fences:
[{ "title": "...", "emoji": "🎭", "category": "...", "locationName": "...", "radiusKm": 15, "closesInDays": 5, "premiumSuggested": false, "seedDailyQuestion": {"text": "...", "tone": "light"}, "whyNow": "...", "evidenceIndex": 3 }]`
}
