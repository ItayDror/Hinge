/**
 * The Spaces demo is NYC-only — one city, so the pipeline stays fast and the
 * output is all directly relevant to the presentation.
 */
export const CITY = {
  name: 'New York, NY',
  lat: 40.7128,
  lng: -74.006,
  defaultRadiusKm: 15,
} as const

export const INTEREST_TAXONOMY = [
  'Sports',
  'Local Events',
  'Culture',
  'Music',
  'Food & Drink',
  'Outdoors',
  'Tech',
  'Fitness',
  'Film & TV',
] as const

/** 6 anchored to something happening right now, 2 evergreen interest rooms. */
export const TIMELY_COUNT = 6
export const GENERAL_COUNT = 2
export const MAX_PER_CATEGORY = 2

/** The question doubles as the room's name, so it has to fit on two phone lines. */
export const MAX_QUESTION_CHARS = 52

/**
 * The timeliness chip shown under the question ("Astor Place fire · today").
 * It carries the anchor so the question itself can stay short and human.
 */
export const MAX_HOOK_CHARS = 38
