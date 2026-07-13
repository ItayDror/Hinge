import { loadEnv } from './env'
import type { TrendHit } from './types'

interface ExaOptions {
  numResults?: number
  type?: 'auto' | 'neural' | 'keyword'
}

interface ExaResult {
  title: string | null
  url: string
  publishedDate?: string
  text?: string
}

export async function exaSearch(query: string, opts: ExaOptions = {}): Promise<TrendHit[]> {
  const { exaApiKey } = loadEnv()

  const doFetch = () =>
    fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: { 'x-api-key': exaApiKey, 'content-type': 'application/json' },
      body: JSON.stringify({
        query,
        numResults: opts.numResults ?? 6,
        type: opts.type ?? 'auto',
        contents: { text: true },
      }),
    })

  let res = await doFetch()
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 2000))
    res = await doFetch()
  }
  if (res.status === 401) throw new Error('Exa API rejected the key (401) — check EXASEARCH_API_KEY.')
  if (!res.ok) {
    console.warn(`  ⚠ Exa query failed (${res.status}): "${query}" — skipping`)
    return []
  }

  const body = (await res.json()) as { results?: ExaResult[] }
  return (body.results ?? []).map((r) => ({
    title: r.title ?? '(untitled)',
    url: r.url,
    publishedDate: r.publishedDate ?? null,
    snippet: (r.text ?? '').replace(/\s+/g, ' ').slice(0, 600),
    query,
  }))
}

export async function exaSearchBatch(queries: string[], concurrency = 3): Promise<TrendHit[]> {
  const results: TrendHit[] = []
  let i = 0
  async function worker() {
    while (i < queries.length) {
      const q = queries[i++]
      console.log(`  🔎 Exa: ${q}`)
      results.push(...(await exaSearch(q)))
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, queries.length) }, worker))
  return results
}
