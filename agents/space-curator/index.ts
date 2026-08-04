/**
 * Space Curator — a two-agent pipeline for NYC Spaces.
 *
 *   trends (Exa)
 *     → Agent 1: ideate    6 timely + 2 general-interest Spaces
 *     → Agent 2: critique   voice / question quality / premise, revising as needed
 *     → emit                agents/spaces.json + agents/report.html
 *
 * This is a standalone demo — it never writes into the app's source.
 *
 * Usage:
 *   npm run agent:spaces               # full run
 *   npm run agent:spaces -- --dry-run  # no writes, just the console summary
 *   npm run agent:spaces -- --tavily   # add Tavily (x402) alongside Exa
 */
import { z } from 'zod'
import { exaSearchBatch } from '../shared/exa'
import { tavilySearch } from '../shared/tavily'
import { generateValidated } from '../shared/validate'
import { writeGenerated, writeRawArtifact } from '../shared/emit'
import { buildReport } from '../shared/report'
import type { SpaceProposal, TrendHit } from '../shared/types'
import { CITY, GENERAL_COUNT, INTEREST_TAXONOMY, MAX_PER_CATEGORY, MAX_QUESTION_CHARS, TIMELY_COUNT } from './config'
import { nycQueries } from './queries'
import { buildCritiquePrompt, buildIdeationPrompt } from './prompt'

// The question is the Space's name, so it is capped hard — anything longer
// stops working as a title in the list.
const QuestionSchema = z.string().min(10).max(MAX_QUESTION_CHARS).endsWith('?')

const IdeaSchema = z.object({
  question: QuestionSchema,
  tone: z.enum(['light', 'deep']),
  emoji: z.string().min(1).max(8),
  kind: z.enum(['timely', 'general']),
  category: z.enum(INTEREST_TAXONOMY),
  locationName: z.string().min(3),
  radiusKm: z.number().min(5).max(50),
  closesInDays: z.number().int().min(4).max(7),
  whyNow: z.string().min(10).max(220),
  evidenceIndex: z.number().int().nullable(),
})
type Idea = z.infer<typeof IdeaSchema>

const CritiqueSchema = z.object({
  index: z.number().int(),
  verdict: z.enum(['pass', 'revise', 'cut']),
  note: z.string().min(3).max(200),
  question: QuestionSchema.nullable().optional(),
  tone: z.enum(['light', 'deep']).nullable().optional(),
})
type CritiqueItem = z.infer<typeof CritiqueSchema>

function parseArgs() {
  const args = process.argv.slice(2)
  return { dryRun: args.includes('--dry-run'), tavily: args.includes('--tavily') }
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30)
}

/** Extra candidates per kind, so Agent 2's cuts don't shrink the final set. */
const SPARES = 2

async function main() {
  const { dryRun, tavily } = parseArgs()

  // ---- Stage 1: what's happening in NYC right now ----
  console.log(`\n📡 Stage 1 · trends — ${CITY.name}`)
  const hits: TrendHit[] = await exaSearchBatch(nycQueries())
  if (tavily) {
    const extra = await tavilySearch(`${CITY.name} events this weekend`)
    if (extra) hits.push(...extra)
  }
  if (hits.length === 0) throw new Error('All trend queries failed — aborting before the LLM stages.')
  writeRawArtifact('spaces', 'trends', hits)
  console.log(`   ${hits.length} trend hits`)

  // ---- Stage 2: Agent 1 proposes ----
  console.log(`\n🧠 Agent 1 · ideating ${TIMELY_COUNT} timely + ${GENERAL_COUNT} general Spaces (+${SPARES} spare each)`)
  const ideaPrompt = buildIdeationPrompt({
    hits,
    cityName: CITY.name,
    taxonomy: INTEREST_TAXONOMY,
    timelyCount: TIMELY_COUNT + SPARES,
    generalCount: GENERAL_COUNT + SPARES,
    maxQuestionChars: MAX_QUESTION_CHARS,
  })
  const { items: ideas, salvaged } = await generateValidated<Idea>(ideaPrompt, IdeaSchema)
  if (salvaged) console.warn(`   ⚠ salvage mode — kept ${ideas.length} valid items`)
  if (ideas.length === 0) throw new Error('Agent 1 produced no usable ideas.')
  console.log(`   ${ideas.length} proposals (${ideas.filter((i) => i.kind === 'timely').length} timely)`)

  const dateSlug = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  let proposals: SpaceProposal[] = ideas.map((item) => {
    const hit = item.evidenceIndex !== null && hits[item.evidenceIndex] ? hits[item.evidenceIndex] : null
    return {
      id: `gs-${dateSlug}-${slugify(item.question)}`,
      question: item.question,
      tone: item.tone,
      emoji: item.emoji,
      kind: item.kind,
      category: item.category,
      location: { name: item.locationName, lat: CITY.lat, lng: CITY.lng, radiusKm: item.radiusKm },
      closesInDays: item.closesInDays,
      whyNow: item.whyNow,
      sourceUrls: hit ? [hit.url] : [],
    }
  })

  // ---- Stage 3: Agent 2 critiques (voice, question quality, premise) ----
  console.log('\n🎯 Agent 2 · reviewing voice, question quality, and premise')
  const { items: critiques } = await generateValidated<CritiqueItem>(buildCritiquePrompt({ proposals, maxQuestionChars: MAX_QUESTION_CHARS }), CritiqueSchema)

  let revised = 0
  let cut = 0
  proposals = proposals
    .map((p, i) => {
      const c = critiques.find((x) => x.index === i)
      if (!c) return p
      if (c.verdict === 'revise') {
        revised++
        return {
          ...p,
          question: c.question ?? p.question,
          tone: c.tone ?? p.tone,
          critique: {
            verdict: c.verdict,
            note: c.note,
            originalQuestion: c.question && c.question !== p.question ? p.question : undefined,
          },
        }
      }
      if (c.verdict === 'cut') cut++
      return { ...p, critique: { verdict: c.verdict, note: c.note } }
    })
    .filter((p) => p.critique?.verdict !== 'cut')
  console.log(`   ${critiques.length} reviewed · ${revised} revised · ${cut} cut`)

  // ---- Stage 4: fill each kind to target, keeping the categories varied ----
  // The category cap is relaxed only if it would otherwise leave the set short.
  const byCategory: Record<string, number> = {}
  const taken: SpaceProposal[] = []

  const fill = (kind: SpaceProposal['kind'], target: number) => {
    const pool = proposals.filter((p) => p.kind === kind)
    const chosen = pool.filter((p) => {
      if (taken.length && (byCategory[p.category] ?? 0) >= MAX_PER_CATEGORY) return false
      if (taken.filter((t) => t.kind === kind).length >= target) return false
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1
      taken.push(p)
      return true
    })
    // Short after the cap? Backfill from what the cap excluded.
    if (chosen.length < target) {
      for (const p of pool) {
        if (taken.filter((t) => t.kind === kind).length >= target) break
        if (!taken.includes(p)) taken.push(p)
      }
    }
  }

  fill('timely', TIMELY_COUNT)
  fill('general', GENERAL_COUNT)
  const selected = taken

  const payload = {
    version: 2,
    generatedAt: new Date().toISOString(),
    generator: 'space-curator@2 (ideate + critique)',
    city: CITY.name,
    spaces: selected,
  }
  writeRawArtifact('spaces', 'final', payload)

  if (dryRun) {
    console.log(`\n✅ Dry run — ${payload.spaces.length} Spaces validated, nothing written.`)
  } else {
    console.log(`\n✅ ${payload.spaces.length} Spaces → ${writeGenerated('spaces.json', payload)}`)
    console.log(`📄 Report → ${buildReport()}`)
  }

  for (const s of payload.spaces) {
    const mark = s.critique?.verdict === 'revise' ? '✎' : '✓'
    console.log(`   ${mark} ${s.emoji} ${s.question} — ${s.category} · ${s.kind} · closes ${s.closesInDays}d`)
    if (s.critique) console.log(`      ${s.critique.verdict}: ${s.critique.note}`)
  }
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}`)
  process.exit(1)
})
