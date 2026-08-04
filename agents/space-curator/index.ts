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
import { CITY, GENERAL_COUNT, INTEREST_TAXONOMY, MAX_PER_CATEGORY, TIMELY_COUNT } from './config'
import { nycQueries } from './queries'
import { buildCritiquePrompt, buildIdeationPrompt } from './prompt'

const IdeaSchema = z.object({
  title: z.string().min(3).max(34),
  emoji: z.string().min(1).max(8),
  kind: z.enum(['timely', 'general']),
  category: z.enum(INTEREST_TAXONOMY),
  locationName: z.string().min(3),
  radiusKm: z.number().min(5).max(50),
  closesInDays: z.number().int().min(4).max(7),
  spaceQuestion: z.object({ text: z.string().min(10).max(220), tone: z.enum(['light', 'deep']) }),
  whyNow: z.string().min(10).max(220),
  evidenceIndex: z.number().int().nullable(),
})
type Idea = z.infer<typeof IdeaSchema>

const CritiqueSchema = z.object({
  index: z.number().int(),
  verdict: z.enum(['pass', 'revise', 'cut']),
  note: z.string().min(3).max(200),
  title: z.string().min(3).max(34).nullable().optional(),
  spaceQuestion: z
    .object({ text: z.string().min(10).max(220), tone: z.enum(['light', 'deep']) })
    .nullable()
    .optional(),
})
type CritiqueItem = z.infer<typeof CritiqueSchema>

function parseArgs() {
  const args = process.argv.slice(2)
  return { dryRun: args.includes('--dry-run'), tavily: args.includes('--tavily') }
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30)
}

async function main() {
  const { dryRun, tavily } = parseArgs()
  const total = TIMELY_COUNT + GENERAL_COUNT

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
  console.log(`\n🧠 Agent 1 · ideating ${TIMELY_COUNT} timely + ${GENERAL_COUNT} general Spaces`)
  const ideaPrompt = buildIdeationPrompt({
    hits,
    cityName: CITY.name,
    taxonomy: INTEREST_TAXONOMY,
    timelyCount: TIMELY_COUNT,
    generalCount: GENERAL_COUNT,
  })
  const { items: ideas, salvaged } = await generateValidated<Idea>(ideaPrompt, IdeaSchema)
  if (salvaged) console.warn(`   ⚠ salvage mode — kept ${ideas.length} valid items`)
  if (ideas.length === 0) throw new Error('Agent 1 produced no usable ideas.')
  console.log(`   ${ideas.length} proposals (${ideas.filter((i) => i.kind === 'timely').length} timely)`)

  const dateSlug = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  let proposals: SpaceProposal[] = ideas.map((item) => {
    const hit = item.evidenceIndex !== null && hits[item.evidenceIndex] ? hits[item.evidenceIndex] : null
    return {
      id: `gs-${dateSlug}-${slugify(item.title)}`,
      title: item.title,
      emoji: item.emoji,
      kind: item.kind,
      category: item.category,
      location: { name: item.locationName, lat: CITY.lat, lng: CITY.lng, radiusKm: item.radiusKm },
      closesInDays: item.closesInDays,
      spaceQuestion: item.spaceQuestion,
      whyNow: item.whyNow,
      sourceUrls: hit ? [hit.url] : [],
    }
  })

  // ---- Stage 3: Agent 2 critiques (voice, question quality, premise) ----
  console.log('\n🎯 Agent 2 · reviewing voice, question quality, and premise')
  const { items: critiques } = await generateValidated<CritiqueItem>(buildCritiquePrompt({ proposals }), CritiqueSchema)

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
          title: c.title ?? p.title,
          spaceQuestion: c.spaceQuestion ?? p.spaceQuestion,
          critique: {
            verdict: c.verdict,
            note: c.note,
            originalTitle: c.title && c.title !== p.title ? p.title : undefined,
            originalQuestion:
              c.spaceQuestion && c.spaceQuestion.text !== p.spaceQuestion.text ? p.spaceQuestion.text : undefined,
          },
        }
      }
      if (c.verdict === 'cut') cut++
      return { ...p, critique: { verdict: c.verdict, note: c.note } }
    })
    .filter((p) => p.critique?.verdict !== 'cut')
  console.log(`   ${critiques.length} reviewed · ${revised} revised · ${cut} cut`)

  // ---- Stage 4: keep the mix balanced, then emit ----
  const byCategory: Record<string, number> = {}
  const selected = proposals.filter((p) => {
    if ((byCategory[p.category] ?? 0) >= MAX_PER_CATEGORY) return false
    byCategory[p.category] = (byCategory[p.category] ?? 0) + 1
    return true
  })

  const payload = {
    version: 2,
    generatedAt: new Date().toISOString(),
    generator: 'space-curator@2 (ideate + critique)',
    city: CITY.name,
    spaces: selected.slice(0, total),
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
    console.log(`   ${mark} ${s.emoji} ${s.title} — ${s.category} · ${s.kind} · closes ${s.closesInDays}d`)
    console.log(`      Q: ${s.spaceQuestion.text}`)
    if (s.critique) console.log(`      ${s.critique.verdict}: ${s.critique.note}`)
  }
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}`)
  process.exit(1)
})
