import { buildReport } from './shared/report'

const path = buildReport()
console.log(`✅ Report written → ${path}`)
