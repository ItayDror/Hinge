import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { NavStackEntry, Screen, TabScreen } from './navTypes'
import { MOCK_CHATS, MOCK_SPACES, type ChatThreadData, type SpaceData } from '../data/mockData'
import {
  DEMO_BATTLE_CARD_ANSWERS,
  DEMO_BATTLE_CARD_QUESTION,
  getBattleCardQuestions,
  getRandomDailyQuestion,
  todayDateSeed,
  type Question,
} from '../data/questionsBank'
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
  simulateOtherAnswered: (chatId: string) => void
  requestDateReadiness: (chatId: string) => void
  simulateOtherReady: (chatId: string) => void
  selectAvailabilityTag: (chatId: string, tag: string) => void

  // toast
  toast: { message: string; visible: boolean } | null
  showToast: (message: string) => void
  dismissToast: () => void
}

const AVAILABILITY_TAG_COPY: Record<string, string> = {
  'Generally free weekday evenings': 'generally free on weekday evenings',
  Weekends: 'generally free on weekends',
  Flexible: 'flexible with timing',
}

const AppStateCtx = createContext<AppState | null>(null)

const TODAY = todayDateSeed()

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [navStack, setNavStack] = useState<NavStackEntry[]>([{ screen: 'discover' }])

  const [dailyQuestion, setDailyQuestion] = useState<DailyQuestionState>({
    question: getRandomDailyQuestion(),
    answeredToday: false,
    streak: 6,
    lastAnsweredDate: null,
  })
  const [showDailyInterstitial, setShowDailyInterstitial] = useState(true)

  const [spaces, setSpaces] = useState<SpaceData[]>(() => structuredClone(MOCK_SPACES))
  const [postsToday, setPostsToday] = useState<Record<string, number>>({})
  const [blindModeBySpacePost, setBlindModeBySpacePost] = useState<Record<string, BlindModeState>>({})

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

  const likePost = useCallback((spaceId: string, postId: string) => {
    setSpaces((prev) =>
      prev.map((s) =>
        s.id !== spaceId
          ? s
          : {
              ...s,
              posts: s.posts.map((p) =>
                p.id === postId ? { ...p, liked: !p.liked, likeCount: p.likeCount + (p.liked ? -1 : 1) } : p
              ),
            }
      )
    )
  }, [])

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
                    authorHandle: 'courtside_kt',
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
      const name = post?.revealedName ?? post?.authorHandle ?? 'Your match'
      const photo = placeholderPhoto(post?.revealedPhotoSeed ?? postId)
      const spaceLabel = space ? `${space.emoji} You both showed up for ${space.title}` : undefined

      setChats((prev) => [
        {
          id: chatId,
          matchName: name,
          matchPhoto: photo,
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

  // Accepting always plays out the same fixed, slightly sassy example
  // exchange end-to-end — a deliberate demo choice so a live presentation
  // can show the full mutual-reveal interaction with one tap.
  const acceptBattleCard = useCallback((chatId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id !== chatId
          ? c
          : {
              ...c,
              battleCard: {
                ...c.battleCard,
                status: 'awaiting-other',
                question: DEMO_BATTLE_CARD_QUESTION,
                myAnswer: DEMO_BATTLE_CARD_ANSWERS.mine,
              },
            }
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

  const simulateOtherReady = useCallback((chatId: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c
        return {
          ...c,
          dateReadiness: { ...c.dateReadiness, them: true },
          messages: [
            ...c.messages,
            { id: nextId('msg'), sender: 'them', text: `You're both ready to take it further 🎉`, kind: 'system' },
          ],
        }
      })
    )
  }, [])

  const selectAvailabilityTag = useCallback((chatId: string, tag: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c
        return {
          ...c,
          dateReadiness: { ...c.dateReadiness, availabilityTagSelected: tag },
          messages: [
            ...c.messages,
            { id: nextId('msg'), sender: 'me', text: `${c.matchName} is ${AVAILABILITY_TAG_COPY[tag] ?? tag.toLowerCase()}`, kind: 'system' },
          ],
        }
      })
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
