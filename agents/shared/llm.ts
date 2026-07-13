import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { AgentError } from './types'

// LLM via the Claude Code CLI in headless mode — runs on the user's existing
// subscription, no ANTHROPIC_API_KEY needed. Prompt goes in via stdin to
// avoid ARG_MAX/quoting issues; --output-format json wraps the assistant
// text in a result envelope.
function claudeBin(): string {
  const local = join(homedir(), '.local', 'bin', 'claude')
  if (existsSync(local)) return local
  return 'claude' // fall back to PATH resolution
}

interface ClaudeEnvelope {
  type: string
  subtype: string
  is_error: boolean
  result: string
}

export function claudeComplete(prompt: string, timeoutMs = 240_000): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = execFile(
      claudeBin(),
      ['-p', '--output-format', 'json'],
      { timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) {
          if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
            return reject(new AgentError('claude CLI not found — install Claude Code or add ~/.local/bin to PATH.'))
          }
          return reject(
            new AgentError(
              `claude CLI failed: ${stderr?.slice(0, 400) || err.message}. ` +
                `If this is an auth error, run 'claude' interactively once to sign in.`
            )
          )
        }
        try {
          const envelope = JSON.parse(stdout) as ClaudeEnvelope
          if (envelope.is_error || envelope.subtype !== 'success') {
            return reject(new AgentError(`claude CLI returned an error envelope: ${envelope.subtype}`))
          }
          resolve(envelope.result)
        } catch {
          reject(new AgentError(`claude CLI produced unparseable output: ${stdout.slice(0, 200)}`))
        }
      }
    )
    child.stdin?.write(prompt)
    child.stdin?.end()
  })
}
