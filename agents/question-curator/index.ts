/**
 * Question Curator agent — on-demand pipeline:
 *   trends (Exa) → synthesis (claude CLI) → validate → dedupe → rank → emit
 *
 * Usage:
 *   npm run agent:questions                    # full run
 *   npm run agent:questions -- --seed-only     # write the 50-question seed bank, zero API calls
 *   npm run agent:questions -- --dry-run       # full run but no writes to src/data/generated
 *   npm run agent:questions -- --city "New York, NY" --tavily
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { z } from 'zod'
import { exaSearchBatch } from '../shared/exa'
import { tavilySearch } from '../shared/tavily'
import { generateValidated } from '../shared/validate'
import { dedupeByText } from '../shared/dedupe'
import { writeGenerated, writeRawArtifact } from '../shared/emit'
import { buildReport } from '../shared/report'
import type { GeneratedQuestion, TrendHit } from '../shared/types'
import { QUESTIONS_BANK } from '../../src/data/questionsBank'
import { SEED_QUESTIONS } from './seedBank'
import { CITIES, DEDUPE_THRESHOLD, LIGHT_RATIO, TARGET } from './config'
import { cityQueries, globalTimeQueries } from './queries'
import { buildQuestionPrompt } from './prompt'

const GENERATED_PATH = join(import.meta.dirname, '..', '..', 'src', 'data', 'generated', 'questions.json')

const RawItemSchema = z.object({
  text: z.string().min(15).max(220),
  kind: z.enum(['location', 'time', 'general']),
  geo: z.string().nullable(),
  timeWindow: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  tone: z.enum(['light', 'deep']),
  evidenceIndex: z.number().int().nullable(),
})
type RawItem = z.infer<typeof RawItemSchema>

function parseArgs() {
  const args = process.argv.slice(2)
  const flag = (f: string) => args.includes(f)
  const value = (f: string) => {
    const i = args.indexOf(f)
    return i !== -1 && args[i + 1] ? args[i + 1] : undefined
  }
  return { seedOnly: flag('--seed-only'), dryRun: flag('--dry-run'), tavily: flag('--tavily'), city: value('--city'), count: value('--count') }
}

function previousGenerated(): GeneratedQuestion[] {
  if (!existsSync(GENERATED_PATH)) return []
  try {
    const parsed = JSON.parse(readFileSync(GENERATED_PATH, 'utf8'))
    return Array.isArray(parsed.questions) ? parsed.questions : []
  } catch {
    return []
  }
}

function emit(questions: GeneratedQuestion[], dryRun: boolean) {
  const payload = { version: 1, generatedAt: new Date().toISOString(), generator: 'question-curator@1', questions }
  writeRawArtifact('questions', 'final', payload)
  if (dryRun) {
    console.log(`\n✅ Dry run complete — ${questions.length} questions validated (no writes to src/data/generated).`)
  } else {
    const path = writeGenerated('questions.json', payload)
    console.log(`\n✅ Wrote ${questions.length} questions → ${path}`)
    console.log(`📄 Report refreshed → ${buildReport()}`)
  }
}

async function main() {
  const { seedOnly, dryRun, tavily, city, count } = parseArgs()

  if (seedOnly) {
    console.log(`Seed-only mode: emitting the ${SEED_QUESTIONS.length}-question authored bank.`)
    emit(SEED_QUESTIONS, dryRun)
    return
  }

  const cities = city ? [city] : CITIES
  const totalTarget = count ? parseInt(count, 10) : TARGET.location + TARGET.time + TARGET.general

  // Stage 1 — trend gathering
  console.log(`\n📡 Stage 1: gathering trends for ${cities.join(', ')}`)
  const queries = [...cities.flatMap(cityQueries), ...globalTimeQueries()]
  const hits: TrendHit[] = await exaSearchBatch(queries)
  if (tavily) {
    for (const c of cities) {
      const extra = await tavilySearch(`what is happening in ${c} this week`)
      if (extra) hits.push(...extra)
    }
  }
  if (hits.length === 0) throw new Error('All trend queries failed — aborting before LLM stage.')
  writeRawArtifact('questions', 'trends', hits)
  console.log(`  → ${hits.length} trend hits`)

  // Stage 2 — LLM synthesis
  console.log('\n🧠 Stage 2: synthesizing questions via claude CLI (this can take a minute)')
  const styleExamples = SEED_QUESTIONS.filter((_, i) => i % 6 === 0).slice(0, 8)
  const alreadyUsed = [...SEED_QUESTIONS.map((q) => q.text), ...QUESTIONS_BANK.map((q) => q.text), ...previousGenerated().map((q) => q.text)]
  const prompt = buildQuestionPrompt({ hits, styleExamples, alreadyUsed, cities, target: TARGET, lightRatio: LIGHT_RATIO })
  const { items: rawItems, salvaged } = await generateValidated<RawItem>(prompt, RawItemSchema)
  if (salvaged) console.warn(`  ⚠ Ran in salvage mode — kept ${rawItems.length} valid items`)
  console.log(`  → ${rawItems.length} candidate questions`)

  // Stage 3 — map evidence + assign ids
  const dateSlug = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const candidates: GeneratedQuestion[] = rawItems.map((item, n) => {
    const hit = item.evidenceIndex !== null && hits[item.evidenceIndex] ? hits[item.evidenceIndex] : null
    return {
      id: `gq-${dateSlug}-${String(n + 1).padStart(2, '0')}`,
      text: item.text,
      kind: item.kind,
      geo: item.kind === 'location' ? item.geo : null,
      timeWindow: item.kind === 'time' ? item.timeWindow : null,
      tone: item.tone,
      sourceTrend: hit ? { snippet: hit.snippet.slice(0, 300), url: hit.url } : null,
    }
  })

  // Stage 4 — dedupe + rank
  console.log('\n🧹 Stage 3/4: dedupe + rank')
  const { kept, dropped } = dedupeByText(candidates, (q) => q.text, alreadyUsed, DEDUPE_THRESHOLD)
  console.log(`  → kept ${kept.length}, dropped ${dropped.length} as near-duplicates`)

  const score = (q: GeneratedQuestion) => {
    let s = 0
    if (q.sourceTrend) s += 2
    if (q.text.length >= 40 && q.text.length <= 120) s += 1
    return s
  }
  const ranked = [...kept].sort((a, b) => score(b) - score(a)).slice(0, totalTarget)

  if (ranked.length === 0) {
    console.warn('\n⚠ Everything was deduped away — keeping the previous generated file untouched.')
    return
  }
  emit(ranked, dryRun)

  const byKind = ranked.reduce<Record<string, number>>((acc, q) => ({ ...acc, [q.kind]: (acc[q.kind] ?? 0) + 1 }), {})
  console.log(`   Breakdown: ${JSON.stringify(byKind)}; with evidence: ${ranked.filter((q) => q.sourceTrend).length}`)
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}`)
  process.exit(1)
})
