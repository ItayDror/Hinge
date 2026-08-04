import { monthYear, weekOf } from '../question-curator/queries'

/** Four NYC-focused searches — enough signal, fast enough to run live on stage. */
export function nycQueries(): string[] {
  return [
    `New York City events concerts festivals ${weekOf()} ${monthYear()}`,
    `NYC sports games this week ${monthYear()}`,
    `what New Yorkers are talking about right now ${monthYear()}`,
    `new restaurant bar opening New York City ${monthYear()}`,
  ]
}
