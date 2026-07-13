function monthYear(d = new Date()): string {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function weekOf(d = new Date()): string {
  return `week of ${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
}

export function cityQueries(city: string): string[] {
  return [
    `things to do in ${city} ${weekOf()}`,
    `${city} local news what everyone is talking about ${monthYear()}`,
    `new restaurant bar opening ${city} ${monthYear()}`,
  ]
}

export function globalTimeQueries(): string[] {
  return [
    `trending pop culture topics ${weekOf()} ${new Date().getFullYear()}`,
    `viral internet debate this week ${monthYear()}`,
    `major sports entertainment events ${monthYear()}`,
  ]
}

export { monthYear, weekOf }
