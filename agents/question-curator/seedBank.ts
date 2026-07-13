import type { GeneratedQuestion } from '../shared/types'

// The authored seed bank (~50 questions): location-based across 4 cities,
// time-relevant for summer 2026, and evergreen general-interest. Serves as
// (a) instant app content via --seed-only, (b) the dedupe corpus, and
// (c) few-shot style anchors for the LLM synthesis prompt.
export const SEED_QUESTIONS: GeneratedQuestion[] = [
  // ---- Location: New York, NY (4) ----
  { id: 'sq-nyc-01', text: 'Your bodega order says more about you than your zodiac sign — what is it?', kind: 'location', geo: 'New York, NY', timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-nyc-02', text: 'The subway line you defend like family, and the one you refuse to acknowledge?', kind: 'location', geo: 'New York, NY', timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-nyc-03', text: 'Best dollar-slice-adjacent life decision you\'ve made after midnight in this city?', kind: 'location', geo: 'New York, NY', timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-nyc-04', text: 'What made you fall for New York — and what almost made you leave?', kind: 'location', geo: 'New York, NY', timeWindow: null, tone: 'deep', sourceTrend: null },
  // ---- Location: Los Angeles, CA (4) ----
  { id: 'sq-la-01', text: 'Your honest freeway hot take: which one is actually the worst, and why is it the 405?', kind: 'location', geo: 'Los Angeles, CA', timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-la-02', text: 'Beach day, canyon hike, or pretending to work from a Silver Lake coffee shop?', kind: 'location', geo: 'Los Angeles, CA', timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-la-03', text: 'The taco spot you\'d take someone to on a third date (first two don\'t deserve it)?', kind: 'location', geo: 'Los Angeles, CA', timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-la-04', text: 'What does your version of "making it" in LA actually look like?', kind: 'location', geo: 'Los Angeles, CA', timeWindow: null, tone: 'deep', sourceTrend: null },
  // ---- Location: Chicago, IL (4) ----
  { id: 'sq-chi-01', text: 'Lake day or river day — and defend your Chicago summer allegiance?', kind: 'location', geo: 'Chicago, IL', timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-chi-02', text: 'Deep dish discourse aside: the one Chicago food take you\'ll die on?', kind: 'location', geo: 'Chicago, IL', timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-chi-03', text: 'Cubs, Sox, or "I\'m just here for the ballpark snacks" — be honest?', kind: 'location', geo: 'Chicago, IL', timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-chi-04', text: 'What\'s the thing about Chicago winters that secretly made you a better person?', kind: 'location', geo: 'Chicago, IL', timeWindow: null, tone: 'deep', sourceTrend: null },
  // ---- Location: Austin, TX (4) ----
  { id: 'sq-atx-01', text: 'Breakfast taco allegiance: name your spot and prepare to be judged lovingly?', kind: 'location', geo: 'Austin, TX', timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-atx-02', text: 'Barton Springs at 8am or a dive bar patio at 8pm — which Austin are you?', kind: 'location', geo: 'Austin, TX', timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-atx-03', text: 'The live music venue you\'d bring an out-of-towner to first?', kind: 'location', geo: 'Austin, TX', timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-atx-04', text: 'Everyone moved here for a reason — what\'s yours, really?', kind: 'location', geo: 'Austin, TX', timeWindow: null, tone: 'deep', sourceTrend: null },
  // ---- Time-relevant: summer 2026 (14) ----
  { id: 'sq-t-01', text: 'Your 4th of July archetype: grill sergeant, fireworks critic, or cooler goblin?', kind: 'time', geo: null, timeWindow: '2026-06-28..2026-07-06', tone: 'light', sourceTrend: null },
  { id: 'sq-t-02', text: 'One non-negotiable for surviving a heat wave with your dignity intact?', kind: 'time', geo: null, timeWindow: '2026-06-15..2026-08-31', tone: 'light', sourceTrend: null },
  { id: 'sq-t-03', text: 'Summer Friday ritual: what do you actually do with those three stolen hours?', kind: 'time', geo: null, timeWindow: '2026-06-01..2026-09-01', tone: 'light', sourceTrend: null },
  { id: 'sq-t-04', text: 'Outdoor movie night: what\'s the perfect crowd-pleaser that isn\'t a superhero film?', kind: 'time', geo: null, timeWindow: '2026-06-01..2026-09-01', tone: 'light', sourceTrend: null },
  { id: 'sq-t-05', text: 'Beach read or beach nap — and zero judgment either way?', kind: 'time', geo: null, timeWindow: '2026-06-15..2026-09-01', tone: 'light', sourceTrend: null },
  { id: 'sq-t-06', text: 'The song of your summer so far — the one that will teleport you back here in 5 years?', kind: 'time', geo: null, timeWindow: '2026-06-01..2026-09-01', tone: 'light', sourceTrend: null },
  { id: 'sq-t-07', text: 'Vacation style check: itinerary spreadsheet or "we\'ll figure it out at the airport"?', kind: 'time', geo: null, timeWindow: '2026-06-01..2026-09-01', tone: 'light', sourceTrend: null },
  { id: 'sq-t-08', text: 'Farmers market haul or farmers market vibes — what are you actually there for?', kind: 'time', geo: null, timeWindow: '2026-05-15..2026-09-15', tone: 'light', sourceTrend: null },
  { id: 'sq-t-09', text: 'Your ideal summer weekend has exactly one plan. What is it?', kind: 'time', geo: null, timeWindow: '2026-06-01..2026-09-01', tone: 'light', sourceTrend: null },
  { id: 'sq-t-10', text: 'Rooftop, backyard, fire escape, or park blanket — pick your summer evening HQ?', kind: 'time', geo: null, timeWindow: '2026-06-01..2026-09-01', tone: 'light', sourceTrend: null },
  { id: 'sq-t-11', text: 'What\'s a summer tradition from childhood you\'re still quietly loyal to?', kind: 'time', geo: null, timeWindow: '2026-06-01..2026-09-01', tone: 'deep', sourceTrend: null },
  { id: 'sq-t-12', text: 'Sunburn confession time: the worst one and the questionable decision behind it?', kind: 'time', geo: null, timeWindow: '2026-06-15..2026-09-01', tone: 'light', sourceTrend: null },
  { id: 'sq-t-13', text: 'If this summer had a theme (like a season of a show), what would yours be called?', kind: 'time', geo: null, timeWindow: '2026-06-01..2026-09-01', tone: 'deep', sourceTrend: null },
  { id: 'sq-t-14', text: 'Ice cream truck order: are you a classicist or a chaos-flavor person?', kind: 'time', geo: null, timeWindow: '2026-06-01..2026-09-01', tone: 'light', sourceTrend: null },
  // ---- General interest (20) ----
  { id: 'sq-g-01', text: 'The hobby you picked up "just to try" that\'s now a personality trait?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-02', text: 'Concert behavior check: barricade warrior, back-row swayer, or merch-line philosopher?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-03', text: 'What\'s your comfort rewatch show and what does it say about you?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-04', text: 'The dish you cook when you actually want to impress someone?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-05', text: 'Gym playlist honesty hour: what\'s the least cool song that gets you a PR?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-06', text: 'Your most defensible unpopular food opinion — go?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-07', text: 'The app you\'d delete forever if it didn\'t hold your entire social life hostage?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-08', text: 'Board game night: are you the rules lawyer, the alliance builder, or the agent of chaos?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-09', text: 'What\'s a skill you admire in other people that you\'ve never managed to learn?', kind: 'general', geo: null, timeWindow: null, tone: 'deep', sourceTrend: null },
  { id: 'sq-g-10', text: 'The movie you quote constantly even though nobody ever catches the reference?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-11', text: 'Museum date energy: do you read every placard or speedrun to the gift shop?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-12', text: 'What\'s something you changed your mind about in the last year?', kind: 'general', geo: null, timeWindow: null, tone: 'deep', sourceTrend: null },
  { id: 'sq-g-13', text: 'Your karaoke song — the one you\'ve accepted is Yours now?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-14', text: 'Trail hike, spin class, pickup game, or "my sport is walking to brunch"?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-15', text: 'What does a perfect slow morning look like for you, minute by minute?', kind: 'general', geo: null, timeWindow: null, tone: 'deep', sourceTrend: null },
  { id: 'sq-g-16', text: 'The tech gadget you were sure was a gimmick and now can\'t live without?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-17', text: 'Which fictional friend group do you genuinely believe you\'d fit into?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-18', text: 'What\'s the small act of kindness from a stranger you still think about?', kind: 'general', geo: null, timeWindow: null, tone: 'deep', sourceTrend: null },
  { id: 'sq-g-19', text: 'Bookshelf check: the book you recommend to literally everyone?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
  { id: 'sq-g-20', text: 'If your friends had to describe your energy as a weather forecast, what would it be?', kind: 'general', geo: null, timeWindow: null, tone: 'light', sourceTrend: null },
]
