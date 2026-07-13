import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { AgentError } from './types'

export interface AgentEnv {
  exaApiKey: string
  x402Dir: string | null
}

/** Minimal KEY=value .env parser — no dotenv dependency needed. */
function parseEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {}
  const out: Record<string, string> = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return out
}

const AGENTS_ENV = join(import.meta.dirname, '..', '.env')
const DEXTER_ENV = join(homedir(), 'dexter', '.env')
const X402_DIR = join(homedir(), 'x402-tavily')

export function loadEnv(): AgentEnv {
  const exaApiKey =
    process.env.EXASEARCH_API_KEY ||
    parseEnvFile(AGENTS_ENV).EXASEARCH_API_KEY ||
    parseEnvFile(DEXTER_ENV).EXASEARCH_API_KEY

  if (!exaApiKey || exaApiKey.startsWith('your-')) {
    throw new AgentError(
      `EXASEARCH_API_KEY not found. Set it in ${AGENTS_ENV} or ensure ${DEXTER_ENV} exists with a live key.`
    )
  }

  const x402Dir = existsSync(join(X402_DIR, 'burner.key')) ? X402_DIR : null
  return { exaApiKey, x402Dir }
}
