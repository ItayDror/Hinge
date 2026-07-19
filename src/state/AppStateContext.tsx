import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { NavStackEntry, Screen, TabScreen } from './navTypes'
import { MOCK_CHATS, MOCK_SPACES, personById, portraitAvatar, type ChatThreadData, type SpaceData } from '../data/mockData'
import {
  DEMO_BATTLE_CARD_ANSWERS,
  DEMO_BATTLE_CARD_QUESTION,
  getBattleCardQuestions,
  getRandomDailyQuestion,
  todayDateSeed,
  type Question,
} from '../data/questionsBank'
import { getGeneratedQuestions, getGeneratedSpaces } from '../data/generatedContent'
import { placeholderPhoto } from '../data/placeholders'
import { nextId } from '../utils/id'

export type BlindModeState = 'pending' | 'waiting' | 'matched'

interface DailyQuestionState {
  question: Question
  answeredToday: boolean
  streak: number
  lastAnsweredDate: string | null
}

interface AppState {
  // navigation
  navStack: NavStackEntry[]
  currentScreen: Screen
  currentParams: Record<string, string> | undefined
  push: (entry: NavStackEntry) => void
  pop: () => void
  goToTab: (screen: TabScreen) => void

  // daily question
  dailyQuestion: DailyQuestionState
  showDailyInterstitial: boolean
  dismissDailyInterstitial: () => void
  answerDailyQuestion: (answer: string, visibility: 'private' | 'public') => void
  skipDailyQuestion: () => void

  // spaces
  spaces: SpaceData[]
  postsToday: Record<string, number>
  toggleSpaceWaitlist: (spaceId: string) => void
  joinWaitlist: (spaceId: string) => void
  likePost: (spaceId: string, postId: string) => void
  addPost: (spaceId: string, text: string) => void
  reportPost: (spaceId: string, postId: string, reason: string) => void

  // space daily question + contextual discovery (contribute → engage → profile)
  engagedPeople: string[]
  likedProfiles: string[]
  myAnswerBySpace: Record<string, string>
  hasContributed: (spaceId: string) => boolean
  likeSpaceAnswer: (spaceId: string, answerId: string) => void
  commentOnSpaceAnswer: (spaceId: string, answerId: string, text: string) => void
  replyToPost: (spaceId: string, postId: string, text: string) => void
  likeProfile: (personId: string, personName: string) => void
  answerSpaceQuestion: (spaceId: string, text: string) => void

  // premium
  premiumUnlocked: boolean
  unlockPremium: () => void

  blindModeBySpacePost: Record<string, BlindModeState>
  openBlindMode: (spaceId: string, postId: string) => void
  revealBlindMode: (key: string) => void
  advanceBlindMode: (key: string) => void
  matchFromBlindMode: (spaceId: string, postId: string) => string // returns new chatId

  // chats
  chats: ChatThreadData[]
  sendMessage: (chatId: string, text: string) => void
  startBattleCard: (chatId: string, tier: 'light' | 'deep') => void
  acceptBattleCard: (chatId: string) => void
  ignoreBattleCard: (chatId: string) => void
  answerBattleCard: (chatId: string, answer: string) => void
  simulateOtherAnswered: (chatId: string) => void
  requestDateReadiness: (chatId: string) => void
  simulateOtherReady: (chatId: string) => void
  selectAvailabilityTag: (chatId: string, tag: string) => void

  // toast
  toast: { message: string; visible: boolean } | null
  showToast: (message: string) => void
  dismissToast: () => void
}

const AppStateCtx = createContext<AppState | null>(null)

const TODAY = todayDateSeed()

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [navStack, setNavStack] = useState<NavStackEntry[]>([{ screen: 'discover' }])

  const [dailyQuestion, setDailyQuestion] = useState<DailyQuestionState>(() => {
    // Prefer agent-generated questions (question-curator pipeline) when a
    // generated file exists; fall back to the static rotation.
    const generated = getGeneratedQuestions()
    const question = generated.length > 0 ? generated[Math.floor(Math.random() * generated.length)] : getRandomDailyQuestion()
    return { question, answeredToday: false, streak: 6, lastAnsweredDate: null }
  })
  const [showDailyInterstitial, setShowDailyInterstitial] = useState(true)

  // Agent-generated spaces (space-curator pipeline) render alongside the
  // static fixtures; when no generated file exists this is just MOCK_SPACES.
  const [spaces, setSpaces] = useState<SpaceData[]>(() => [
    ...structuredClone(MOCK_SPACES),
    ...getGeneratedSpaces(),
  ])
  const [postsToday, setPostsToday] = useState<Record<string, number>>({})
  const [blindModeBySpacePost, setBlindModeBySpacePost] = useState<Record<string, BlindModeState>>({})
  const [engagedPeople, setEngagedPeople] = useState<string[]>([])
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])
  const [myAnswerBySpace, setMyAnswerBySpace] = useState<Record<string, string>>({})
  const [premiumUnlocked, setPremiumUnlocked] = useState(false)

  const [chats, setChats] = useState<ChatThreadData[]>(() => structuredClone(MOCK_CHATS))

  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null)

  // --- navigation ---
  const push = useCallback((entry: NavStackEntry) => setNavStack((s) => [...s, entry]), [])
  const pop = useCallback(() => setNavStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), [])
  const goToTab = useCallback((screen: TabScreen) => setNavStack([{ screen }]), [])

  const top = navStack[navStack.length - 1]

  // --- toast ---
  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true })
  }, [])
  const dismissToast = useCallback(() => setToast((t) => (t ? { ...t, visible: false } : t)), [])

  // --- daily question ---
  const dismissDailyInterstitial = useCallback(() => setShowDailyInterstitial(false), [])
  const answerDailyQuestion = useCallback(
    (_answer: string, _visibility: 'private' | 'public') => {
      setDailyQuestion((dq) => ({
        ...dq,
        answeredToday: true,
        lastAnsweredDate: TODAY,
        streak: dq.streak + 1,
      }))
      setShowDailyInterstitial(false)
      showToast('Got it — thanks for sharing 🔥')
    },
    [showToast]
  )
  const skipDailyQuestion = useCallback(() => {
    setShowDailyInterstitial(false)
  }, [])

  // --- spaces ---
  const toggleSpaceWaitlist = useCallback((spaceId: string) => {
    setSpaces((prev) =>
      prev.map((s) => (s.id === spaceId ? { ...s, status: 'active', activityLabel: 'active now' } : s))
    )
    showToast('🎉 This space just opened!')
  }, [showToast])

  const joinWaitlist = useCallback(
    (spaceId: string) => {
      setSpaces((prev) =>
        prev.map((s) => {
          if (s.id !== spaceId || s.status !== 'waitlist') return s
          const nextCount = (s.waitlistCount ?? 0) + 1
          if (s.waitlistThreshold && nextCount >= s.waitlistThreshold) {
            return { ...s, status: 'active', activityLabel: 'active now', waitlistCount: nextCount }
          }
          return { ...s, waitlistCount: nextCount }
        })
      )
      showToast('You’re on the list — we’ll let you know when it opens')
    },
    [showToast]
  )

  // Engagement (liking/commenting on someone's content) is the per-person
  // unlock currency for viewing profiles. Once earned it persists — unliking
  // doesn't revoke it.
  const engageWith = useCallback((personId: string) => {
    if (personId === 'me') return
    setEngagedPeople((prev) => (prev.includes(personId) ? prev : [...prev, personId]))
  }, [])

  const likePost = useCallback(
    (spaceId: string, postId: string) => {
      setSpaces((prev) =>
        prev.map((s) => {
          if (s.id !== spaceId) return s
          const post = s.posts.find((p) => p.id === postId)
          if (post && !post.liked) engageWith(post.personId)
          return {
            ...s,
            posts: s.posts.map((p) =>
              p.id === postId ? { ...p, liked: !p.liked, likeCount: p.likeCount + (p.liked ? -1 : 1) } : p
            ),
          }
        })
      )
    },
    [engageWith]
  )

  const addPost = useCallback(
    (spaceId: string, text: string) => {
      setPostsToday((prev) => ({ ...prev, [spaceId]: (prev[spaceId] ?? 0) + 1 }))
      setSpaces((prev) =>
        prev.map((s) =>
          s.id !== spaceId
            ? s
            : {
                ...s,
                posts: [
                  {
                    id: nextId('post'),
                    personId: 'me',
                    text,
                    likeCount: 0,
                    liked: false,
                    timestampLabel: 'just now',
                    replyCount: 0,
                    replies: [],
                    reported: false,
                  },
                  ...s.posts,
                ],
              }
        )
      )
    },
    []
  )

  const reportPost = useCallback(
    (spaceId: string, postId: string, _reason: string) => {
      setSpaces((prev) =>
        prev.map((s) =>
          s.id !== spaceId ? s : { ...s, posts: s.posts.map((p) => (p.id === postId ? { ...p, reported: true } : p)) }
        )
      )
      showToast('Reported and hidden. Thanks for keeping Spaces safe.')
    },
    [showToast]
  )

  // --- space daily question + contextual discovery ---
  const likeSpaceAnswer = useCallback(
    (spaceId: string, answerId: string) => {
      setSpaces((prev) =>
        prev.map((s) => {
          if (s.id !== spaceId) return s
          const answer = s.dailyQuestion.answers.find((a) => a.id === answerId)
          if (answer && !answer.likedByMe) engageWith(answer.personId)
          return {
            ...s,
            dailyQuestion: {
              ...s.dailyQuestion,
              answers: s.dailyQuestion.answers.map((a) =>
                a.id === answerId
                  ? { ...a, likedByMe: !a.likedByMe, likeCount: a.likeCount + (a.likedByMe ? -1 : 1) }
                  : a
              ),
            },
          }
        })
      )
    },
    [engageWith]
  )

  const commentOnSpaceAnswer = useCallback(
    (spaceId: string, answerId: string, text: string) => {
      setSpaces((prev) =>
        prev.map((s) => {
          if (s.id !== spaceId) return s
          const answer = s.dailyQuestion.answers.find((a) => a.id === answerId)
          if (answer) engageWith(answer.personId)
          return {
            ...s,
            dailyQuestion: {
              ...s.dailyQuestion,
              answers: s.dailyQuestion.answers.map((a) =>
                a.id === answerId
                  ? { ...a, comments: [...a.comments, { id: nextId('ac'), personId: 'me', text }] }
                  : a
              ),
            },
          }
        })
      )
    },
    [engageWith]
  )

  const replyToPost = useCallback(
    (spaceId: string, postId: string, text: string) => {
      setSpaces((prev) =>
        prev.map((s) => {
          if (s.id !== spaceId) return s
          const post = s.posts.find((p) => p.id === postId)
          if (post) engageWith(post.personId)
          return {
            ...s,
            posts: s.posts.map((p) =>
              p.id === postId
                ? { ...p, replyCount: p.replyCount + 1, replies: [...p.replies, { id: nextId('r'), personId: 'me', text }] }
                : p
            ),
          }
        })
      )
    },
    [engageWith]
  )

  // A like on the actual profile (from the profile pop) — this is what would
  // surface in the other person's "Likes You".
  const likeProfile = useCallback(
    (personId: string, personName: string) => {
      setLikedProfiles((prev) => (prev.includes(personId) ? prev : [...prev, personId]))
      showToast(`Like sent to ${personName} 💌`)
    },
    [showToast]
  )

  // Contribution gate: you unlock profile-viewing in a space by writing
  // something there (an answer or a post).
  const hasContributed = useCallback(
    (spaceId: string) => {
      const s = spaces.find((sp) => sp.id === spaceId)
      if (!s) return false
      return s.dailyQuestion.answers.some((a) => a.personId === 'me') || s.posts.some((p) => p.personId === 'me')
    },
    [spaces]
  )

  const answerSpaceQuestion = useCallback((spaceId: string, text: string) => {
    setMyAnswerBySpace((prev) => ({ ...prev, [spaceId]: text }))
    setSpaces((prev) =>
      prev.map((s) =>
        s.id !== spaceId
          ? s
          : {
              ...s,
              dailyQuestion: {
                ...s.dailyQuestion,
                answers: [
                  { id: nextId('ans'), personId: 'me', text, likeCount: 0, likedByMe: false, comments: [] },
                  ...s.dailyQuestion.answers,
                ],
              },
            }
      )
    )
  }, [])

  // --- premium ---
  const unlockPremium = useCallback(() => {
    setPremiumUnlocked(true)
    showToast('Welcome to Hinge+ 🖤')
  }, [showToast])

  // --- blind mode ---
  const openBlindMode = useCallback((spaceId: string, postId: string) => {
    const key = `${spaceId}:${postId}`
    setBlindModeBySpacePost((prev) => (prev[key] ? prev : { ...prev, [key]: 'pending' }))
  }, [])

  const revealBlindMode = useCallback((key: string) => {
    setBlindModeBySpacePost((prev) => ({ ...prev, [key]: 'waiting' }))
  }, [])

  const advanceBlindMode = useCallback((key: string) => {
    setBlindModeBySpacePost((prev) => ({ ...prev, [key]: 'matched' }))
  }, [])

  const matchFromBlindMode = useCallback(
    (spaceId: string, postId: string) => {
      const space = spaces.find((s) => s.id === spaceId)
      const post = space?.posts.find((p) => p.id === postId)
      const existing = chats.find((c) => c.id === `blind-${spaceId}-${postId}`)
      if (existing) return existing.id

      const chatId = `blind-${spaceId}-${postId}`
      const person = post ? personById(post.personId) : undefined
      const spaceLabel = space ? `${space.emoji} You both showed up for ${space.title}` : undefined

      setChats((prev) => [
        {
          id: chatId,
          personId: person?.id ?? 'unknown',
          matchName: person?.name ?? 'Your match',
          matchPhoto: person ? portraitAvatar(person) : placeholderPhoto(postId),
          spaceOriginLabel: spaceLabel,
          messages: [],
          battleCard: { status: 'none' },
          dateReadiness: { me: false, them: false },
        },
        ...prev,
      ])
      return chatId
    },
    [spaces, chats]
  )

  // --- chats ---
  const sendMessage = useCallback((chatId: string, text: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id !== chatId ? c : { ...c, messages: [...c.messages, { id: nextId('msg'), sender: 'me', text, kind: 'text' }] }
      )
    )
  }, [])

  const startBattleCard = useCallback((chatId: string, tier: 'light' | 'deep') => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c
        const pool = getBattleCardQuestions(tier)
        const question = pool[Math.floor(Math.random() * pool.length)]
        return {
          ...c,
          battleCard: { status: 'invited', tier, question },
          messages: [
            ...c.messages,
            { id: nextId('msg'), sender: 'me', text: `You invited ${c.matchName} to play a card 🎴`, kind: 'battle-card-invite' },
          ],
        }
      })
    )
  }, [])

  // Fired when the other side accepts my invite (via the debug bar in a live
  // demo): the face-down card flips to 'accepted' with the fixed demo
  // question, and the private answer input takes over the compose bar.
  const acceptBattleCard = useCallback((chatId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id !== chatId
          ? c
          : {
              ...c,
              battleCard: { ...c.battleCard, status: 'accepted', question: DEMO_BATTLE_CARD_QUESTION },
              messages: [
                ...c.messages,
                { id: nextId('msg'), sender: 'them', text: `${c.matchName} accepted your Battle Card 🎴`, kind: 'system' },
              ],
            }
      )
    )
  }, [])

  const answerBattleCard = useCallback((chatId: string, answer: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id !== chatId ? c : { ...c, battleCard: { ...c.battleCard, status: 'awaiting-other', myAnswer: answer } }
      )
    )
  }, [])

  const ignoreBattleCard = useCallback((chatId: string) => {
    setChats((prev) => prev.map((c) => (c.id !== chatId ? c : { ...c, battleCard: { status: 'expired' } })))
  }, [])

  const simulateOtherAnswered = useCallback((chatId: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c
        return { ...c, battleCard: { ...c.battleCard, status: 'revealed', theirAnswer: DEMO_BATTLE_CARD_ANSWERS.theirs } }
      })
    )
  }, [])

  const requestDateReadiness = useCallback((chatId: string) => {
    setChats((prev) => prev.map((c) => (c.id !== chatId ? c : { ...c, dateReadiness: { ...c.dateReadiness, me: true } })))
  }, [])

  // The mutual state renders as the MutualReadinessCard in the thread —
  // no system message needed.
  const simulateOtherReady = useCallback((chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id !== chatId ? c : { ...c, dateReadiness: { ...c.dateReadiness, them: true } }))
    )
  }, [])

  // Selection is displayed inside the mutual-readiness celebration card
  // itself rather than posted as a buried system message.
  const selectAvailabilityTag = useCallback((chatId: string, tag: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id !== chatId ? c : { ...c, dateReadiness: { ...c.dateReadiness, availabilityTagSelected: tag } }))
    )
  }, [])

  const value = useMemo<AppState>(
    () => ({
      navStack,
      currentScreen: top.screen,
      currentParams: top.params,
      push,
      pop,
      goToTab,

      dailyQuestion,
      showDailyInterstitial,
      dismissDailyInterstitial,
      answerDailyQuestion,
      skipDailyQuestion,

      spaces,
      postsToday,
      toggleSpaceWaitlist,
      joinWaitlist,
      likePost,
      addPost,
      reportPost,

      engagedPeople,
      likedProfiles,
      myAnswerBySpace,
      hasContributed,
      likeSpaceAnswer,
      commentOnSpaceAnswer,
      replyToPost,
      likeProfile,
      answerSpaceQuestion,

      premiumUnlocked,
      unlockPremium,

      blindModeBySpacePost,
      openBlindMode,
      revealBlindMode,
      advanceBlindMode,
      matchFromBlindMode,

      chats,
      sendMessage,
      startBattleCard,
      acceptBattleCard,
      ignoreBattleCard,
      answerBattleCard,
      simulateOtherAnswered,
      requestDateReadiness,
      simulateOtherReady,
      selectAvailabilityTag,

      toast,
      showToast,
      dismissToast,
    }),
    [
      navStack,
      top,
      push,
      pop,
      goToTab,
      dailyQuestion,
      showDailyInterstitial,
      dismissDailyInterstitial,
      answerDailyQuestion,
      skipDailyQuestion,
      spaces,
      postsToday,
      toggleSpaceWaitlist,
      joinWaitlist,
      likePost,
      addPost,
      reportPost,
      engagedPeople,
      likedProfiles,
      myAnswerBySpace,
      hasContributed,
      likeSpaceAnswer,
      commentOnSpaceAnswer,
      replyToPost,
      likeProfile,
      answerSpaceQuestion,
      premiumUnlocked,
      unlockPremium,
      blindModeBySpacePost,
      openBlindMode,
      revealBlindMode,
      advanceBlindMode,
      matchFromBlindMode,
      chats,
      sendMessage,
      startBattleCard,
      acceptBattleCard,
      ignoreBattleCard,
      answerBattleCard,
      simulateOtherAnswered,
      requestDateReadiness,
      simulateOtherReady,
      selectAvailabilityTag,
      toast,
      showToast,
      dismissToast,
    ]
  )

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateCtx)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
