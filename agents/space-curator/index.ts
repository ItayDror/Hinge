/**
 * Space Curator agent — on-demand pipeline:
 *   trends (Exa) → synthesis (claude CLI) → validate → dedupe → rank → emit
 *
 * Every proposed Space has two dimensions: a location (city + radius —
 * users whose radius covers it are eligible) and an interest category.
 *
 * Usage:
 *   npm run agent:spaces                       # full run
 *   npm run agent:spaces -- --dry-run          # no writes to src/data/generated
 *   npm run agent:spaces -- --city "Austin, TX" --tavily
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { z } from 'zod'
import { exaSearchBatch } from '../shared/exa'
import { tavilySearch } from '../shared/tavily'
import { generateValidated } from '../shared/validate'
import { dedupeByText } from '../shared/dedupe'
import { writeGenerated, writeRawArtifact } from '../shared/emit'
import type { SpaceProposal, TrendHit } from '../shared/types'
import { MOCK_SPACES } from '../../src/data/mockData'
import { CITIES, INTEREST_TAXONOMY, MAX_PER_CATEGORY, MAX_PREMIUM, TARGET_SPACES } from './config'
import { citySpaceQueries, globalSpaceQueries } from './queries'
import { buildSpacePrompt } from './prompt'

const GENERATED_PATH = join(import.meta.dirname, '..', '..', 'src', 'data', 'generated', 'spaces.json')

const RawItemSchema = z.object({
  title: z.string().min(3).max(34),
  emoji: z.string().min(1).max(8),
  category: z.enum(INTEREST_TAXONOMY),
  locationName: z.string().min(3),
  radiusKm: z.number().min(5).max(50),
  closesInDays: z.number().int().min(4).max(7),
  premiumSuggested: z.boolean(),
  seedDailyQuestion: z.object({ text: z.string().min(10).max(220), tone: z.enum(['light', 'deep']) }),
  whyNow: z.string().min(10).max(220),
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
  return { dryRun: flag('--dry-run'), tavily: flag('--tavily'), city: value('--city'), count: value('--count') }
}

function previousGenerated(): SpaceProposal[] {
  if (!existsSync(GENERATED_PATH)) return []
  try {
    const parsed = JSON.parse(readFileSync(GENERATED_PATH, 'utf8'))
    return Array.isArray(parsed.spaces) ? parsed.spaces : []
  } catch {
    return []
  }
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30)
}

async function main() {
  const { dryRun, tavily, city, count } = parseArgs()
  const cities = city ? CITIES.filter((c) => c.name === city) : CITIES
  if (cities.length === 0) throw new Error(`Unknown city "${city}". Configured: ${CITIES.map((c) => c.name).join(', ')}`)
  const target = count ? parseInt(count, 10) : TARGET_SPACES

  // Stage 1 — trend gathering
  console.log(`\n📡 Stage 1: gathering local trends for ${cities.map((c) => c.name).join(', ')}`)
  const queries = [...cities.flatMap((c) => citySpaceQueries(c.name)), ...globalSpaceQueries()]
  const hits: TrendHit[] = await exaSearchBatch(queries)
  if (tavily) {
    for (const c of cities) {
      const extra = await tavilySearch(`${c.name} events this weekend`)
      if (extra) hits.push(...extra)
    }
  }
  if (hits.length === 0) throw new Error('All trend queries failed — aborting before LLM stage.')
  writeRawArtifact('spaces', 'trends', hits)
  console.log(`  → ${hits.length} trend hits`)

  // Stage 2 — LLM synthesis
  console.log('\n🧠 Stage 2: proposing spaces via claude CLI (this can take a minute)')
  const existingSpaces = [
    ...MOCK_SPACES.map((s) => ({ title: s.title, category: s.category })),
    ...previousGenerated().map((s) => ({ title: s.title, category: s.category })),
  ]
  const prompt = buildSpacePrompt({ hits, cities, taxonomy: INTEREST_TAXONOMY, existingSpaces, target, maxPremium: MAX_PREMIUM })
  const { items: rawItems, salvaged } = await generateValidated<RawItem>(prompt, RawItemSchema)
  if (salvaged) console.warn(`  ⚠ Ran in salvage mode — kept ${rawItems.length} valid items`)
  console.log(`  → ${rawItems.length} candidate spaces`)

  // Stage 3 — resolve locations + ids, map evidence
  const dateSlug = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const candidates: SpaceProposal[] = rawItems.map((item) => {
    const cityCfg = cities.find((c) => item.locationName.includes(c.name.split(',')[0])) ?? cities[0]
    const hit = item.evidenceIndex !== null && hits[item.evidenceIndex] ? hits[item.evidenceIndex] : null
    return {
      id: `gs-${dateSlug}-${slugify(cityCfg.name.split(',')[0])}-${slugify(item.title)}`,
      title: item.title,
      emoji: item.emoji,
      category: item.category,
      location: { name: item.locationName, lat: cityCfg.lat, lng: cityCfg.lng, radiusKm: item.radiusKm },
      closesInDays: item.closesInDays,
      premiumSuggested: item.premiumSuggested,
      seedDailyQuestion: item.seedDailyQuestion,
      whyNow: item.whyNow,
      sourceUrls: hit ? [hit.url] : [],
    }
  })

  // Stage 4 — dedupe + rank (city coverage first, then category diversity)
  console.log('\n🧹 Stage 3/4: dedupe + rank')
  const existingTexts = existingSpaces.map((s) => s.title)
  const { kept, dropped } = dedupeByText(candidates, (s) => s.title, existingTexts, 0.5)
  console.log(`  → kept ${kept.length}, dropped ${dropped.length} as near-duplicates`)

  const selected: SpaceProposal[] = []
  const byCategory: Record<string, number> = {}
  // ensure ≥1 per city first
  for (const c of cities) {
    const match = kept.find((s) => s.location.name.includes(c.name.split(',')[0]) && !selected.includes(s))
    if (match) {
      selected.push(match)
      byCategory[match.category] = (byCategory[match.category] ?? 0) + 1
    }
  }
  for (const s of kept) {
    if (selected.length >= target) break
    if (selected.includes(s)) continue
    if ((byCategory[s.category] ?? 0) >= MAX_PER_CATEGORY) continue
    selected.push(s)
    byCategory[s.category] = (byCategory[s.category] ?? 0) + 1
  }
  // clamp premium count
  let premiumCount = 0
  for (const s of selected) {
    if (s.premiumSuggested && ++premiumCount > MAX_PREMIUM) s.premiumSuggested = false
  }

  if (selected.length === 0) {
    console.warn('\n⚠ Everything was deduped away — keeping the previous generated file untouched.')
    return
  }

  const payload = { version: 1, generatedAt: new Date().toISOString(), generator: 'space-curator@1', spaces: selected }
  writeRawArtifact('spaces', 'final', payload)
  if (dryRun) {
    console.log(`\n✅ Dry run complete — ${selected.length} spaces validated (no writes to src/data/generated).`)
  } else {
    const path = writeGenerated('spaces.json', payload)
    console.log(`\n✅ Wrote ${selected.length} spaces → ${path}`)
  }
  for (const s of selected) {
    console.log(`   ${s.emoji} ${s.title} — ${s.category} @ ${s.location.name} (closes ${s.closesInDays}d${s.premiumSuggested ? ', premium' : ''})`)
  }
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}`)
  process.exit(1)
})
