import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { SpaceProposal } from './types'

const AGENTS_DIR = join(import.meta.dirname, '..')
const REPORT_PATH = join(AGENTS_DIR, 'report.html')
// Also published with the app at /creation so the pipeline output is shareable.
const PUBLISHED_PATH = join(AGENTS_DIR, '..', 'public', 'creation', 'index.html')

interface SpacesFile {
  generatedAt: string
  generator: string
  city: string
  spaces: SpaceProposal[]
}

function loadJson<T>(name: string): T | null {
  const path = join(AGENTS_DIR, name)
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T
  } catch {
    return null
  }
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function fmtDate(iso: string | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

function spaceCard(s: SpaceProposal): string {
  const links = s.sourceUrls.map((u) => `<a href="${esc(u)}" target="_blank">source ↗</a>`).join(' ')
  const c = s.critique

  const critiqueBlock = c
    ? `<div class="critique ${c.verdict}">
         <span class="verdict">${c.verdict === 'revise' ? '✎ revised' : '✓ passed'}</span>
         <span class="note">${esc(c.note)}</span>
         ${
           c.originalTitle
             ? `<div class="diff"><span class="was">was:</span> ${esc(c.originalTitle)}</div>`
             : ''
         }
         ${
           c.originalQuestion
             ? `<div class="diff"><span class="was">question was:</span> “${esc(c.originalQuestion)}”</div>`
             : ''
         }
       </div>`
    : ''

  return `<div class="card">
    <div class="head">
      <span class="emoji">${s.emoji}</span>
      <div class="headtext">
        <p class="title">${esc(s.title)}</p>
        <p class="meta">${esc(s.category)} · ${esc(s.location.name)} · ${s.location.radiusKm}km radius · closes in ${s.closesInDays}d</p>
      </div>
      <span class="kind ${s.kind}">${s.kind === 'timely' ? 'Timely' : 'Always on'}</span>
    </div>

    <div class="question">
      <span class="label">Space question</span>
      <p class="qtext">“${esc(s.spaceQuestion.text)}”</p>
      <span class="tone ${s.spaceQuestion.tone}">${s.spaceQuestion.tone}</span>
    </div>

    <div class="why"><span class="label">Why this room</span>${esc(s.whyNow)} ${links}</div>
    ${critiqueBlock}
  </div>`
}

export function buildReport(): string {
  const file = loadJson<SpacesFile>('spaces.json')
  const spaces = file?.spaces ?? []
  const timely = spaces.filter((s) => s.kind === 'timely').length
  const revised = spaces.filter((s) => s.critique?.verdict === 'revise').length
  const evidenced = spaces.filter((s) => s.sourceUrls.length > 0).length

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Spaces Curation — Agent Output</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap');
  :root {
    --black:#1A1A1A; --grey:#737373; --bg:#FFFEFC; --section:#F1F0EE;
    --line:#E8E6E2; --accent:#602D5C; --accent-soft:#F2EAF4; --sage:#B0C6C5;
  }
  * { box-sizing: border-box; }
  body { font-family: Inter, sans-serif; color: var(--black); background: var(--bg); margin: 0; padding: 48px 24px 96px; }
  .wrap { max-width: 860px; margin: 0 auto; }

  .hero { background: linear-gradient(160deg, #6E3569 0%, #4A2247 100%); border-radius: 24px; padding: 36px 32px; color: #fff; position: relative; overflow: hidden; }
  .hero::after { content:''; position:absolute; inset:-40% 0 auto 0; height:70%; background: radial-gradient(55% 100% at 50% 100%, rgba(255,255,255,.22), transparent 70%); pointer-events:none; }
  .hero h1 { font-family: Fraunces, Georgia, serif; font-size: 34px; font-weight: 600; margin: 0; letter-spacing:-.01em; }
  .hero p { margin: 8px 0 0; color: rgba(255,255,255,.72); font-size: 15px; }

  .pipeline { display:flex; flex-wrap:wrap; gap:8px; margin-top:22px; position:relative; }
  .stage { background: rgba(255,255,255,.12); backdrop-filter: blur(6px); border-radius:9999px; padding:8px 14px; font-size:12px; font-weight:600; color:#fff; }
  .stage b { font-weight:700; }
  .stage::after { content:'→'; margin-left:8px; opacity:.5; }
  .stage:last-child::after { content:''; margin:0; }

  .stats { display:flex; flex-wrap:wrap; gap:12px; margin:28px 0 8px; }
  .stat { background: var(--accent-soft); border-radius:16px; padding:14px 18px; min-width:132px; }
  .stat b { display:block; font-size:24px; }
  .stat span { font-size:12px; color:var(--grey); }

  h2 { font-size:20px; margin:40px 0 4px; }
  .sub { color:var(--grey); font-size:13px; margin:0 0 18px; }

  .card { border:1px solid var(--line); border-radius:18px; padding:20px; margin-bottom:14px; background:#fff; }
  .head { display:flex; gap:14px; align-items:flex-start; }
  .emoji { font-size:30px; line-height:1; }
  .headtext { flex:1; min-width:0; }
  .title { font-size:19px; font-weight:700; margin:0; }
  .meta { font-size:12px; color:var(--grey); margin:4px 0 0; }
  .kind { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; padding:5px 10px; border-radius:9999px; white-space:nowrap; }
  .kind.timely { background: var(--accent); color:#fff; }
  .kind.general { background: var(--sage); color: var(--black); }

  .question { background: var(--accent-soft); border-radius:14px; padding:14px 16px; margin-top:16px; }
  .qtext { font-family: Fraunces, Georgia, serif; font-size:20px; line-height:1.25; margin:6px 0 10px; }
  .tone { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; background:#fff; color:var(--accent); padding:4px 9px; border-radius:9999px; }

  .label { display:block; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--accent); margin-bottom:4px; }
  .why { background: var(--section); border-radius:14px; padding:12px 14px; margin-top:10px; font-size:13px; }

  .critique { border-left:3px solid var(--accent); padding:10px 0 10px 14px; margin-top:14px; font-size:13px; }
  .critique .verdict { font-weight:700; color:var(--accent); margin-right:8px; }
  .critique .note { color:var(--black); }
  .diff { margin-top:6px; font-size:12px; color:var(--grey); }
  .diff .was { font-weight:600; text-transform:uppercase; font-size:10px; letter-spacing:.06em; margin-right:4px; }

  a { color: var(--accent); font-weight:600; text-decoration:none; }
  footer { margin-top:48px; color:var(--grey); font-size:12px; border-top:1px solid var(--line); padding-top:16px; }
  code { background: var(--section); border-radius:6px; padding:2px 6px; font-size:11px; }
  .empty { text-align:center; color:var(--grey); padding:48px 0; }
</style>
</head>
<body>
<div class="wrap">
  <div class="hero">
    <h1>Spaces, curated by two agents</h1>
    <p>${esc(file?.city ?? 'New York, NY')} · generated ${fmtDate(file?.generatedAt)}</p>
    <div class="pipeline">
      <span class="stage">📡 Live NYC trends</span>
      <span class="stage"><b>Agent 1</b> · ideate</span>
      <span class="stage"><b>Agent 2</b> · critique the voice</span>
      <span class="stage">📦 Ship</span>
    </div>
  </div>

  <div class="stats">
    <div class="stat"><b>${spaces.length}</b><span>Spaces proposed</span></div>
    <div class="stat"><b>${timely}</b><span>tied to this week</span></div>
    <div class="stat"><b>${spaces.length - timely}</b><span>always-on rooms</span></div>
    <div class="stat"><b>${evidenced}</b><span>with a real source</span></div>
    <div class="stat"><b>${revised}</b><span>revised by Agent 2</span></div>
  </div>

  <h2>The rooms</h2>
  <p class="sub">Every Space is one place, one interest, and one <b>space question</b> — the single icebreaker the whole room answers, and the thing people match on. Agent 2's verdict is shown under each.</p>

  ${spaces.length ? spaces.map(spaceCard).join('\n') : '<p class="empty">No Spaces generated yet — run <code>npm run agent:spaces</code>.</p>'}

  <footer>
    Regenerate anytime with <code>npm run agent:spaces</code> (or <code>npm run agent:report</code> to rebuild this page).
    Trends via Exa, optional Tavily over x402. Both agents run on the Claude CLI.
    This pipeline is a standalone demo — it does not write into the prototype app.
  </footer>
</div>
</body>
</html>`

  writeFileSync(REPORT_PATH, html)
  mkdirSync(join(PUBLISHED_PATH, '..'), { recursive: true })
  writeFileSync(PUBLISHED_PATH, html)
  return REPORT_PATH
}
