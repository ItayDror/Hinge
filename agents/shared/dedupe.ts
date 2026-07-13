const STOPWORDS = new Set(['a', 'an', 'the', 'is', 'are', 'you', 'your', 'my', 'in', 'on', 'for', 'of', 'to', 'and', 'or', 'what', 'whats', 'which', 'do', 'does', 'with', 'at', 'this', 'that'])

export function normalizeText(t: string): Set<string> {
  return new Set(
    t
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w && !STOPWORDS.has(w))
  )
}

export function jaccard(a: string, b: string): number {
  const setA = normalizeText(a)
  const setB = normalizeText(b)
  if (setA.size === 0 || setB.size === 0) return 0
  let intersection = 0
  for (const w of setA) if (setB.has(w)) intersection++
  return intersection / (setA.size + setB.size - intersection)
}

export function dedupeByText<T>(candidates: T[], getText: (item: T) => string, existingTexts: string[], threshold = 0.6): { kept: T[]; dropped: T[] } {
  const kept: T[] = []
  const dropped: T[] = []
  const seen = [...existingTexts]
  for (const c of candidates) {
    const text = getText(c)
    const isDupe = seen.some((s) => jaccard(text, s) >= threshold)
    if (isDupe) dropped.push(c)
    else {
      kept.push(c)
      seen.push(text)
    }
  }
  return { kept, dropped }
}
