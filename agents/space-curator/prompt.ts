import type { SpaceProposal, TrendHit } from '../shared/types'

interface IdeationInput {
  hits: TrendHit[]
  cityName: string
  taxonomy: readonly string[]
  timelyCount: number
  generalCount: number
  maxQuestionChars: number
  maxHookChars: number
}

/**
 * Agent 1 — the ideator. Turns raw NYC trend signal into Space concepts:
 * mostly timely rooms anchored to real evidence, plus a couple of evergreen
 * interest rooms that don't depend on the news cycle.
 *
 * A Space has no name apart from its question, so the question has to carry
 * both jobs at once — hence the hard length cap.
 */
export function buildIdeationPrompt({
  hits,
  cityName,
  taxonomy,
  timelyCount,
  generalCount,
  maxQuestionChars,
  maxHookChars,
}: IdeationInput): string {
  const evidence = hits
    .map(
      (h, i) =>
        `[${i}] (query: "${h.query}") ${h.title} — ${h.snippet.slice(0, 250)} — ${h.url}${h.publishedDate ? ` — ${h.publishedDate}` : ''}`
    )
    .join('\n')

  return `You are curating "Spaces" for Hinge — short-lived, themed rooms where people in ${cityName} talk about one thing together, then match through what they said rather than how they swipe. A Space closes in 4-7 days.

A Space IS its question. There is no separate room name: the question is the title in the Spaces list, the header of the room, and the single thing every member answers. So each question has to work as a name AND as an icebreaker.

Each timely Space also carries a "hookLabel" — a small chip shown right under the question that names the real thing happening ("Astor Place fire · today"). This matters: it means the question itself does NOT have to name the event. A question can sound broad and human — "What's your worst subway story?" — because the chip underneath supplies the timeliness. Write the question people want to answer, and let the hook do the anchoring.

<trend_evidence>
${evidence}
</trend_evidence>

<interest_taxonomy>
${taxonomy.join(' | ')}
</interest_taxonomy>

Task: propose exactly ${timelyCount + generalCount} Spaces, all in ${cityName}.

- ${timelyCount} with "kind": "timely" — each anchored to a specific item in the evidence above. Cite its index in "evidenceIndex", give it a "hookLabel", and use "whyNow" for the full sentence a curious member would tap to read.
- ${generalCount} with "kind": "general" — evergreen NYC interest rooms that would work any week (think: the way people actually live here). Set "evidenceIndex": null and "hookLabel": null, and use "whyNow" to say who the room is for.

The question — the hard part, get this right:
- ${maxQuestionChars} characters MAX, including the question mark. Shorter is better. It has to fit on two lines of a phone screen.
- It must end in a question mark and read cleanly as the name of a room.
- Specific and opinionated, never generic. "Where are you going for Restaurant Week?" — not "What's your favorite food?"
- Answerable in one sentence, but impossible to answer in one word. Avoid yes/no.
- A concrete either/or is great when it forces a choice: "Game 7 seats or courtside on a Tuesday?"
- Leave room to be funny or to flirt. Never crude.
- No hype words, no "ultimate", no "epic", no emoji inside the text (the emoji field is separate).
- Don't cram the event into it. "Astor Place fire: what's your worst commute story?" is worse than "What's your worst subway story?" with a hook chip. Name the event only when it genuinely makes the question better ("Where are you going for Restaurant Week?").

The hook (timely rooms only):
- "hookLabel": ${maxHookChars} characters MAX. The thing, then when: "Harlem Week · through Sunday", "Cardinals at the Stadium · tonight".
- "whyNow": one plain sentence a member reads after tapping the chip. What happened, and why a room about it makes sense this week. No marketing voice.
- If the anchoring event is a tragedy or someone got hurt, do not build a flirting room on it. Either find the ordinary human angle that stands on its own, or drop that evidence item.

Other rules:
- "category" MUST be one of the taxonomy values verbatim.
- "locationName" is "${cityName}" optionally prefixed with a venue or neighborhood ("Prospect Park, ${cityName}").
- "closesInDays": integer 4-7, matching how long the moment actually lasts.
- "tone": "light" (playful) or "deep" (revealing).

Respond with ONLY a JSON array, no prose, no markdown fences:
[{ "question": "...?", "tone": "light", "emoji": "🎭", "kind": "timely"|"general", "category": "...", "locationName": "...", "radiusKm": 15, "closesInDays": 5, "hookLabel": "..."|null, "whyNow": "...", "evidenceIndex": 3 }]`
}

interface CritiqueInput {
  proposals: SpaceProposal[]
  maxQuestionChars: number
  maxHookChars: number
}

/**
 * Agent 2 — the brand critic. Independently judges each proposal against
 * Hinge's voice and the point of the feature, and rewrites the weak ones
 * rather than just flagging them.
 */
export function buildCritiquePrompt({ proposals, maxQuestionChars, maxHookChars }: CritiqueInput): string {
  const list = proposals
    .map(
      (p, i) =>
        `[${i}] ${p.emoji} "${p.question}" (${p.tone}, ${p.kind}, ${p.category}, ${p.location.name}, closes ${p.closesInDays}d, ${p.question.length} chars)
     hook chip: ${p.hook ? `"${p.hook.label}"` : '(none — evergreen room)'}
     why now: ${p.whyNow}`
    )
    .join('\n')

  return `You are a brand and content editor at Hinge reviewing proposed "Spaces" before they ship. Hinge's voice is warm, witty, specific, and a little dry — it never sounds like a marketing brochure, never uses hype words ("epic", "ultimate", "vibes"), and never tries too hard to be young.

Each Space is a room named by a single question. Strangers answer it, and match through the answers. The question is the whole product surface — there is nothing else to hide behind. Judge each one on:
1. VOICE — does it sound like Hinge wrote it, not a listings site or an ad?
2. QUESTION QUALITY — specific, fun, impossible to answer in one word? Does it give someone an opening to flirt or be funny? Would you answer it?
3. LENGTH — ${maxQuestionChars} characters max. If it runs long or reads like a paragraph, tighten it. Cutting words is almost always an improvement.
4. PREMISE — is there an actual conversation here, or is it an event listing with a question mark bolted on?
5. ANCHORING — a timely room shows a small chip under the question naming the real event, so the question does NOT need to name it. If a question is straining to cram the event in, cut the event out of the question and put it in the chip instead. Conversely, if a question reads as generic AND the chip is missing or vague, write a better chip ("Harlem Week · through Sunday") rather than lengthening the question.

<proposals>
${list}
</proposals>

For each proposal, return a verdict:
- "pass" — ships as-is. Say in one short line what works.
- "revise" — the premise is fine but the wording is off. Provide an improved "question" (and "tone" and/or "hookLabel" if they should change), and one short line on what you changed and why.
- "cut" — the premise doesn't work as a conversation. One short line on why. (Use sparingly; only if it genuinely can't be saved.)

Any question you write must obey the same ${maxQuestionChars}-character cap and end in a question mark. Any hookLabel you write must be ${maxHookChars} characters or fewer.
Cut anything that turns a real injury or tragedy into a flirting prompt.
Keep every note under 140 characters and written like an editor, not a robot.

Respond with ONLY a JSON array, one object per proposal in the SAME order, no prose, no fences:
[{ "index": 0, "verdict": "pass"|"revise"|"cut", "note": "...", "question": "...?"|null, "tone": "light"|"deep"|null, "hookLabel": "..."|null }]`
}
