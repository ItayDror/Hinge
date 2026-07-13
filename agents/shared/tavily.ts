import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { loadEnv } from './env'
import type { TrendHit } from './types'

const execFileAsync = promisify(execFile)

// Optional secondary search adapter: Tavily via the x402 micropayment setup
// in ~/x402-tavily ($0.01 USDC on Base per search). Opt-in via --tavily —
// never load-bearing; any failure returns null and the pipeline continues
// on Exa alone.
export async function tavilySearch(query: string): Promise<TrendHit[] | null> {
  const { x402Dir } = loadEnv()
  if (!x402Dir) return null
  try {
    const { stdout } = await execFileAsync('python3', [`${x402Dir}/search.py`, query], {
      timeout: 60_000,
      cwd: x402Dir,
    })
    const jsonStart = stdout.indexOf('{')
    if (jsonStart === -1) return null
    const body = JSON.parse(stdout.slice(jsonStart)) as {
      results?: { title?: string; url?: string; content?: string }[]
    }
    return (body.results ?? []).map((r) => ({
      title: r.title ?? '(untitled)',
      url: r.url ?? '',
      publishedDate: null,
      snippet: (r.content ?? '').replace(/\s+/g, ' ').slice(0, 600),
      query,
    }))
  } catch (err) {
    console.warn(`  ⚠ Tavily x402 search failed (${(err as Error).message.split('\n')[0]}) — continuing on Exa only`)
    return null
  }
}
