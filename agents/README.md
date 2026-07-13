# Spaces Content-Curation Agents

Two independent, on-demand pipelines that curate content for the Hinge redesign prototype:

| Agent | Command | Output |
|---|---|---|
| **Question curator** | `npm run agent:questions` | `src/data/generated/questions.json` — fresh daily questions (location-based, time-relevant, general) |
| **Space curator** | `npm run agent:spaces` | `src/data/generated/spaces.json` — proposed Spaces, each with a location dimension (city + radius) and an interest dimension |

Both follow the same pipeline: **trend gathering (Exa search) → synthesis (Claude) → schema validation → dedupe → rank → emit**. Raw per-stage artifacts land in `agents/output/` (gitignored); the final app-consumable JSON is committed so the prototype works on a fresh clone. The React app loads generated files via `src/data/generatedContent.ts` and silently falls back to the static banks when they're absent.

## Prerequisites

- **Exa API key** — read automatically from `~/dexter/.env` (`EXASEARCH_API_KEY`), or set it in `agents/.env` / the environment.
- **Claude Code CLI** — the LLM step runs `claude -p` headlessly on your existing subscription (no `ANTHROPIC_API_KEY` needed). If headless calls fail with an auth error, run `claude` interactively once to sign in.
- **Optional: Tavily via x402** — pass `--tavily` to supplement Exa with Tavily searches paid per-call ($0.01 USDC on Base) through `~/x402-tavily`. Check the burner wallet balance with `npm run agent:balance`. Any x402 failure is skipped silently; the pipeline never depends on it.

## Useful flags

```
npm run agent:questions -- --seed-only          # write the 50-question authored seed bank, zero API calls
npm run agent:questions -- --dry-run            # full run, but no writes to src/data/generated
npm run agent:questions -- --city "Austin, TX"  # restrict to one city
npm run agent:spaces   -- --dry-run --tavily
```

## Question schema

`{id, text, kind: 'location'|'time'|'general', geo (city, null unless location), timeWindow ("YYYY-MM-DD..YYYY-MM-DD", null unless time), tone: 'light'|'deep', sourceTrend: {snippet, url}|null}`

Evidence URLs come only from gathered search hits (the model cites an index; the pipeline maps it) — the LLM never fabricates sources.

## Space schema

`{id, title (≤30ch), emoji, category (fixed taxonomy), location {name, lat, lng, radiusKm}, closesInDays (4-7), premiumSuggested (≤2 per run), seedDailyQuestion {text, tone}, whyNow (≤200ch), sourceUrls}`

A user is "eligible" for a space when their chosen radius covers the space's location — the prototype simulates this with a mock location toggle.
