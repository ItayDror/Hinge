import type { SpaceProposal, TrendHit } from '../shared/types'

interface IdeationInput {
  hits: TrendHit[]
  cityName: string
  taxonomy: readonly string[]
  timelyCount: number
  generalCount: number
}

/**
 * Agent 1 — the ideator. Turns raw NYC trend signal into Space concepts:
 * mostly timely rooms anchored to real evidence, plus a couple of evergreen
 * interest rooms that don't depend on the news cycle.
 */
export function buildIdeationPrompt({ hits, cityName, taxonomy, timelyCount, generalCount }: IdeationInput): string {
  const evidence = hits
    .map(
      (h, i) =>
        `[${i}] (query: "${h.query}") ${h.title} — ${h.snippet.slice(0, 250)} — ${h.url}${h.publishedDate ? ` — ${h.publishedDate}` : ''}`
    )
    .join('\n')

  return `You are curating "Spaces" for Hinge — short-lived, themed rooms where people in ${cityName} talk about one thing together, then match through what they said rather than how they swipe. A Space closes in 4-7 days.

Each Space carries ONE "space question": a single icebreaker everyone in the room answers. It is the heart of the feature, so it has to be genuinely fun to answer — specific, a little playful, and impossible to answer with one word.

<trend_evidence>
${evidence}
</trend_evidence>

<interest_taxonomy>
${taxonomy.join(' | ')}
</interest_taxonomy>

Task: propose exactly ${timelyCount + generalCount} Spaces, all in ${cityName}.

- ${timelyCount} with "kind": "timely" — each anchored to a specific item in the evidence above. Cite its index in "evidenceIndex". "whyNow" states the real hook in one sentence.
- ${generalCount} with "kind": "general" — evergreen NYC interest rooms that would work any week (think: the way people actually live here). Set "evidenceIndex": null and use "whyNow" to say who the room is for.

Rules:
- "category" MUST be one of the taxonomy values verbatim.
- Title: 30 characters or fewer, punchy and specific. No generic titles like "Sports Fans" or "Foodies".
- "locationName" is "${cityName}" optionally prefixed with a venue or neighborhood ("Prospect Park, ${cityName}").
- "closesInDays": integer 4-7, matching how long the moment actually lasts.
- "spaceQuestion" is the room's one question. Make it answerable in a sentence, opinionated, and flirt-adjacent without being crude. Tone "light" (playful) or "deep" (revealing).

Respond with ONLY a JSON array, no prose, no markdown fences:
[{ "title": "...", "emoji": "🎭", "kind": "timely"|"general", "category": "...", "locationName": "...", "radiusKm": 15, "closesInDays": 5, "spaceQuestion": {"text": "...", "tone": "light"}, "whyNow": "...", "evidenceIndex": 3 }]`
}

interface CritiqueInput {
  proposals: SpaceProposal[]
}

/**
 * Agent 2 — the brand critic. Independently judges each proposal against
 * Hinge's voice and the point of the feature, and rewrites the weak ones
 * rather than just flagging them.
 */
export function buildCritiquePrompt({ proposals }: CritiqueInput): string {
  const list = proposals
    .map(
      (p, i) =>
        `[${i}] ${p.emoji} "${p.title}" (${p.kind}, ${p.category}, ${p.location.name}, closes ${p.closesInDays}d)
     space question: "${p.spaceQuestion.text}" (${p.spaceQuestion.tone})
     why now: ${p.whyNow}`
    )
    .join('\n')

  return `You are a brand and content editor at Hinge reviewing proposed "Spaces" before they ship. Hinge's voice is warm, witty, specific, and a little dry — it never sounds like a marketing brochure, never uses hype words ("epic", "ultimate", "vibes"), and never tries too hard to be young.

You are reviewing rooms where strangers answer one shared question and then match based on the answers. Judge each proposal on:
1. VOICE — does the title sound like Hinge wrote it, not a listings site or an ad?
2. QUESTION QUALITY — is the space question specific, fun, and impossible to answer in one word? Would a real person want to reply? Does it give someone an opening to flirt or be funny?
3. PREMISE — is there an actual conversation here, or is it just an event listing with a question bolted on?

<proposals>
${list}
</proposals>

For each proposal, return a verdict:
- "pass" — ships as-is. Say in one short line what works.
- "revise" — the premise is fine but the wording is off. Provide improved "title" and/or "spaceQuestion", and one short line on what you changed and why.
- "cut" — the premise doesn't work as a conversation. One short line on why. (Use sparingly; only if it genuinely can't be saved.)

Keep every note under 140 characters and written like an editor, not a robot.

Respond with ONLY a JSON array, one object per proposal in the SAME order, no prose, no fences:
[{ "index": 0, "verdict": "pass"|"revise"|"cut", "note": "...", "title": "..."|null, "spaceQuestion": {"text":"...","tone":"light"}|null }]`
}
