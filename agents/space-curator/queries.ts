import { monthYear, weekOf } from '../question-curator/queries'

export function citySpaceQueries(city: string): string[] {
  return [
    `${city} events festivals concerts next two weeks ${monthYear()}`,
    `${city} sports schedule games ${monthYear()}`,
    `what is ${city} obsessed with right now ${monthYear()}`,
  ]
}

export function globalSpaceQueries(): string[] {
  return [`nationwide cultural moments premieres releases ${weekOf()}`]
}
