import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { GeneratedQuestion, SpaceProposal } from './types'

const GENERATED_DIR = join(import.meta.dirname, '..', '..', 'src', 'data', 'generated')
const REPORT_PATH = join(import.meta.dirname, '..', 'report.html')

interface QuestionsFile {
  generatedAt: string
  generator: string
  questions: GeneratedQuestion[]
}
interface SpacesFile {
  generatedAt: string
  generator: string
  spaces: SpaceProposal[]
}

function loadJson<T>(name: string): T | null {
  const path = join(GENERATED_DIR, name)
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T
  } catch {
    return null
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function fmtDate(iso: string | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

const KIND_LABEL: Record<string, string> = { location: '📍 Location', time: '🕐 Time-relevant', general: '💬 General interest' }

function questionCard(q: GeneratedQuestion): string {
  const meta = [
    q.geo ? `<span class="chip">📍 ${esc(q.geo)}</span>` : '',
    q.timeWindow ? `<span class="chip">🗓 ${esc(q.timeWindow)}</span>` : '',
    `<span class="chip ${q.tone}">${q.tone}</span>`,
  ].join('')
  const evidence = q.sourceTrend
    ? `<div class="evidence"><span class="evidence-label">Trend evidence</span>${esc(q.sourceTrend.snippet.slice(0, 200))}…
       ${q.sourceTrend.url ? `<a href="${esc(q.sourceTrend.url)}" target="_blank">source ↗</a>` : ''}</div>`
    : `<div class="evidence none">No external evidence — evergreen question</div>`
  return `<div class="card"><p class="q-text">${esc(q.text)}</p><div class="meta">${meta}</div>${evidence}</div>`
}

function spaceCard(s: SpaceProposal): string {
  const links = s.sourceUrls.map((u) => `<a href="${esc(u)}" target="_blank">source ↗</a>`).join(' ')
  return `<div class="card space">
    <div class="space-head">
      <span class="space-emoji">${s.emoji}</span>
      <div>
        <p class="space-title">${esc(s.title)}${s.premiumSuggested ? ' <span class="chip premium">Hinge+ suggested</span>' : ''}</p>
        <p class="space-sub">${esc(s.category)} · ${esc(s.location.name)} · radius ${s.location.radiusKm}km · closes in ${s.closesInDays}d</p>
      </div>
    </div>
    <div class="whynow"><span class="evidence-label">Why now</span>${esc(s.whyNow)} ${links}</div>
    <div class="seedq"><span class="evidence-label">Seed daily question</span>“${esc(s.seedDailyQuestion.text)}” <span class="chip ${s.seedDailyQuestion.tone}">${s.seedDailyQuestion.tone}</span></div>
  </div>`
}

export function buildReport(): string {
  const qFile = loadJson<QuestionsFile>('questions.json')
  const sFile = loadJson<SpacesFile>('spaces.json')
  const questions = qFile?.questions ?? []
  const spaces = sFile?.spaces ?? []

  const byKind = questions.reduce<Record<string, GeneratedQuestion[]>>((acc, q) => {
    ;(acc[q.kind] ??= []).push(q)
    return acc
  }, {})
  const withEvidence = questions.filter((q) => q.sourceTrend).length
  const cities = [...new Set(spaces.map((s) => s.location.name.split(',').slice(-2).join(',').trim()))]

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Spaces Curation Agents — Output Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  :root { --black:#1A1A1A; --grey:#666; --grey-bg:#F1F0EE; --grey-line:#E8E6E2; --accent:#602D5C; --accent-soft:#F2EAF4; }
  * { box-sizing: border-box; }
  body { font-family: Inter, sans-serif; color: var(--black); background: #fff; margin: 0; padding: 40px 24px 80px; }
  .wrap { max-width: 880px; margin: 0 auto; }
  h1 { font-size: 28px; margin: 0; }
  .sub { color: var(--grey); font-size: 14px; margin-top: 6px; }
  .pipeline { display: flex; flex-wrap: wrap; gap: 8px; margin: 24px 0 8px; }
  .stage { background: var(--grey-bg); border-radius: 9999px; padding: 8px 14px; font-size: 12px; font-weight: 600; }
  .stage::after { content: ' →'; color: var(--accent); }
  .stage:last-child::after { content: ''; }
  .stats { display: flex; flex-wrap: wrap; gap: 12px; margin: 24px 0 8px; }
  .stat { background: var(--accent-soft); border-radius: 16px; padding: 14px 18px; min-width: 130px; }
  .stat b { display: block; font-size: 24px; }
  .stat span { font-size: 12px; color: var(--grey); }
  h2 { font-size: 20px; margin: 40px 0 4px; }
  .section-sub { color: var(--grey); font-size: 13px; margin: 0 0 16px; }
  h3 { font-size: 14px; text-transform: uppercase; letter-spacing: .08em; color: var(--accent); margin: 28px 0 12px; }
  .card { border: 1px solid var(--grey-line); border-radius: 16px; padding: 16px; margin-bottom: 12px; box-shadow: 0 4px 16px rgba(0,0,0,.05); }
  .q-text { font-size: 16px; font-weight: 600; margin: 0 0 8px; }
  .meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
  .chip { background: var(--grey-bg); border-radius: 9999px; padding: 3px 10px; font-size: 11px; font-weight: 600; }
  .chip.light { background: var(--accent-soft); color: var(--accent); }
  .chip.deep { background: var(--black); color: #fff; }
  .chip.premium { background: var(--black); color: #fff; }
  .evidence, .whynow, .seedq { background: var(--grey-bg); border-radius: 12px; padding: 10px 12px; font-size: 13px; color: var(--black); margin-top: 8px; }
  .evidence.none { color: var(--grey); font-style: italic; }
  .evidence-label { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--accent); margin-bottom: 4px; }
  .whynow { background: var(--accent-soft); }
  a { color: var(--accent); font-weight: 600; text-decoration: none; }
  .space-head { display: flex; gap: 12px; align-items: flex-start; }
  .space-emoji { font-size: 30px; }
  .space-title { font-size: 17px; font-weight: 700; margin: 0; }
  .space-sub { font-size: 12px; color: var(--grey); margin: 3px 0 0; }
  footer { margin-top: 48px; color: var(--grey); font-size: 12px; border-top: 1px solid var(--grey-line); padding-top: 16px; }
  code { background: var(--grey-bg); border-radius: 6px; padding: 2px 6px; font-size: 11px; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Spaces Curation Agents — Output Report</h1>
  <p class="sub">Questions generated ${fmtDate(qFile?.generatedAt)} (${esc(qFile?.generator ?? 'n/a')}) · Spaces generated ${fmtDate(sFile?.generatedAt)} (${esc(sFile?.generator ?? 'n/a')})</p>

  <div class="pipeline">
    <span class="stage">📡 Trend gathering (Exa search)</span>
    <span class="stage">🧠 Synthesis (Claude)</span>
    <span class="stage">✅ Schema validation</span>
    <span class="stage">🧹 Dedupe vs banks</span>
    <span class="stage">🏆 Rank & select</span>
    <span class="stage">📦 Emit JSON</span>
  </div>
  <p class="section-sub">Every location/time question and every space must cite a real search hit — the model picks an evidence index and the pipeline maps it back to the actual URL, so sources are never fabricated.</p>

  <div class="stats">
    <div class="stat"><b>${questions.length}</b><span>questions generated</span></div>
    <div class="stat"><b>${withEvidence}/${questions.length}</b><span>backed by trend evidence</span></div>
    <div class="stat"><b>${spaces.length}</b><span>spaces proposed</span></div>
    <div class="stat"><b>${cities.length}</b><span>cities covered</span></div>
    <div class="stat"><b>${spaces.filter((s) => s.premiumSuggested).length}</b><span>flagged for Hinge+</span></div>
  </div>

  <h2>Proposed Spaces</h2>
  <p class="section-sub">Each space has two dimensions — a <b>location</b> (users whose radius covers it are eligible) and an <b>interest</b> — plus a 4–7 day close window and a themed seed question. "Why now" is the real-world hook found during trend gathering.</p>
  ${spaces.map(spaceCard).join('\n')}

  <h2>Generated Daily Questions</h2>
  <p class="section-sub">Feeds the per-space Daily Question surface and the app-wide interstitial. Tone mix targets ~70% light / 30% deep.</p>
  ${(['location', 'time', 'general'] as const)
    .map((kind) => {
      const list = byKind[kind] ?? []
      if (list.length === 0) return ''
      return `<h3>${KIND_LABEL[kind]} (${list.length})</h3>${list.map(questionCard).join('\n')}`
    })
    .join('\n')}

  <footer>
    Regenerate anytime: <code>npm run agent:questions</code> · <code>npm run agent:spaces</code> · this report rebuilds automatically after each run (or via <code>npm run agent:report</code>).
    Search: Exa (primary) with optional Tavily via x402 micropayments (<code>--tavily</code>). LLM: Claude Code CLI, headless.
  </footer>
</div>
</body>
</html>`

  writeFileSync(REPORT_PATH, html)
  return REPORT_PATH
}
