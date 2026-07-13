import { mkdirSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUTPUT_DIR = join(import.meta.dirname, '..', 'output')
const GENERATED_DIR = join(import.meta.dirname, '..', '..', 'src', 'data', 'generated')

function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
}

/** Raw stage artifact — gitignored, one file per stage per run. */
export function writeRawArtifact(agent: 'questions' | 'spaces', stage: string, data: unknown): string {
  mkdirSync(OUTPUT_DIR, { recursive: true })
  const path = join(OUTPUT_DIR, `${agent}-${stage}-${timestamp()}.json`)
  writeFileSync(path, JSON.stringify(data, null, 2))
  return path
}

/** App-consumable output — atomic write (tmp + rename), committed to git. */
export function writeGenerated(file: 'questions.json' | 'spaces.json', payload: object): string {
  mkdirSync(GENERATED_DIR, { recursive: true })
  const tmp = join(GENERATED_DIR, `.tmp-${file}`)
  const final = join(GENERATED_DIR, file)
  writeFileSync(tmp, JSON.stringify(payload, null, 2))
  renameSync(tmp, final)
  return final
}
