// Placeholder image service — production would use real Hinge-verified user
// photos. Uses picsum.photos seeded by id for deterministic placeholder photos,
// and a deterministic hash-to-hue for solid-color initials avatars.

export function placeholderPhoto(seed: string, w = 400, h = 500): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`
}

function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function initialsAvatarColor(seed: string): string {
  const hue = hashSeed(seed) % 360
  return `hsl(${hue}, 45%, 55%)`
}

export function initialsFromName(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}
