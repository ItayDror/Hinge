import { z } from 'zod'
import { claudeComplete } from './llm'

/** Strip markdown fences / prose and isolate the outermost JSON array or object. */
export function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced ? fenced[1] : raw
  const firstBracket = Math.min(
    ...['[', '{'].map((c) => (candidate.indexOf(c) === -1 ? Infinity : candidate.indexOf(c)))
  )
  const lastBracket = Math.max(candidate.lastIndexOf(']'), candidate.lastIndexOf('}'))
  if (firstBracket === Infinity || lastBracket === -1) return candidate.trim()
  return candidate.slice(firstBracket, lastBracket + 1).trim()
}

/**
 * Call the LLM, parse + schema-validate its JSON. On failure, retry ONCE with
 * the validation error appended. On second failure, salvage per-item: if the
 * output is an array, keep the items that individually pass `itemSchema`.
 */
export async function generateValidated<Item>(
  prompt: string,
  itemSchema: z.ZodType<Item>
): Promise<{ items: Item[]; salvaged: boolean }> {
  const arraySchema = z.array(itemSchema)

  const attempt = async (p: string) => {
    const raw = await claudeComplete(p)
    return { raw, parsed: JSON.parse(extractJson(raw)) as unknown }
  }

  let lastRaw = ''
  try {
    const { raw, parsed } = await attempt(prompt)
    lastRaw = raw
    return { items: arraySchema.parse(parsed), salvaged: false }
  } catch (firstErr) {
    console.warn(`  ⚠ LLM output failed validation, retrying once: ${(firstErr as Error).message.slice(0, 300)}`)
    const retryPrompt =
      `${prompt}\n\nYour previous response failed validation:\n<error>${(firstErr as Error).message.slice(0, 800)}</error>\n` +
      `Previous response (truncated): ${lastRaw.slice(0, 800)}\n` +
      `Respond again with ONLY the corrected JSON array. No prose, no markdown fences.`
    try {
      const { parsed } = await attempt(retryPrompt)
      return { items: arraySchema.parse(parsed), salvaged: false }
    } catch (secondErr) {
      console.warn(`  ⚠ Retry also failed (${(secondErr as Error).message.slice(0, 200)}); salvaging valid items`)
      try {
        const { parsed } = await attempt(retryPrompt)
        if (Array.isArray(parsed)) {
          const items = parsed.flatMap((item) => {
            const result = itemSchema.safeParse(item)
            return result.success ? [result.data] : []
          })
          return { items, salvaged: true }
        }
      } catch {
        // fall through
      }
      return { items: [], salvaged: true }
    }
  }
}
