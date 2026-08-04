import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import type { NavStackEntry, Screen, TabScreen } from './navTypes'
import { MOCK_CHATS, MOCK_SPACES, type ChatThreadData, type SpaceData } from '../data/mockData'
import { personById, portraitAvatar } from '../data/people'
import { nextId } from '../utils/id'

/** A like I've sent that hasn't been reciprocated yet. */
export interface PendingLike {
  personId: string
  spaceId?: string
  message?: string
}

export interface NewMatch {
  personId: string
  spaceId?: string
  chatId: string
}

interface AppState {
  // navigation
  navStack: NavStackEntry[]
  currentScreen: Screen
  currentParams: Record<string, string> | undefined
  push: (entry: NavStackEntry) => void
  pop: () => void
  goToTab: (screen: TabScreen) => void

  // spaces
  spaces: SpaceData[]
  postsToday: Record<string, number>
  toggleSpaceWaitlist: (spaceId: string) => void
  joinWaitlist: (spaceId: string) => void
  likePost: (spaceId: string, postId: string) => void
  addPost: (spaceId: string, text: string) => void
  reportPost: (spaceId: string, postId: string, reason: string) => void

  // spaces intro (shown once per session)
  spacesIntroSeen: boolean
  markSpacesIntroSeen: () => void

  // contextual discovery (contribute → engage → profile)
  engagedPeople: string[]
  myAnswerBySpace: Record<string, string>
  hasContributed: (spaceId: string) => boolean
  likeSpaceAnswer: (spaceId: string, answerId: string) => void
  commentOnSpaceAnswer: (spaceId: string, answerId: string, text: string) => void
  replyToPost: (spaceId: string, postId: string, text: string) => void
  answerSpaceQuestion: (spaceId: string, text: string) => void

  // like → match → chat
  pendingLikes: PendingLike[]
  likedProfiles: string[]
  likeProfile: (personId: string, personName: string, spaceId?: string, message?: string) => void
  matchWith: (personId: string) => void
  newMatch: NewMatch | null
  dismissNewMatch: () => void

  // premium
  premiumUnlocked: boolean
  unlockPremium: () => void

  // chats
  chats: ChatThreadData[]
  sendMessage: (chatId: string, text: string) => void

  // toast
  toast: { message: string; visible: boolean } | null
  showToast: (message: string) => void
  dismissToast: () => void
}

const AppStateCtx = createContext<AppState | null>(null)

/** How long before someone likes you back (the demo's reciprocal-like beat). */
const RECIPROCAL_LIKE_MS = 4000

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [navStack, setNavStack] = useState<NavStackEntry[]>([{ screen: 'discover' }])

  // The app runs purely on its authored fixtures. The curation agents are a
  // separate demo (see agents/) and deliberately never write into the UI.
  const [spaces, setSpaces] = useState<SpaceData[]>(() => structuredClone(MOCK_SPACES))
  const [postsToday, setPostsToday] = useState<Record<string, number>>({})
  const [engagedPeople, setEngagedPeople] = useState<string[]>([])
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])
  const [pendingLikes, setPendingLikes] = useState<PendingLike[]>([])
  const [newMatch, setNewMatch] = useState<NewMatch | null>(null)
  const [myAnswerBySpace, setMyAnswerBySpace] = useState<Record<string, string>>({})
  const [premiumUnlocked, setPremiumUnlocked] = useState(false)
  const [spacesIntroSeen, setSpacesIntroSeen] = useState(false)

  const [chats, setChats] = useState<ChatThreadData[]>(() => structuredClone(MOCK_CHATS))

  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null)

  // Latest pending likes, readable from inside timers without re-scheduling.
  const pendingRef = useRef<PendingLike[]>([])
  pendingRef.current = pendingLikes

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

  // --- spaces ---
  const markSpacesIntroSeen = useCallback(() => setSpacesIntroSeen(true), [])

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

  const addPost = useCallback((spaceId: string, text: string) => {
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
  }, [])

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

  // --- space question + contextual discovery ---
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

  // Contribution gate: you unlock profile-viewing in a space by writing
  // ANYTHING there — an answer, a post, a comment on someone's answer, or a
  // reply to someone's post. Any of these takes you out of "quiet mode".
  const hasContributed = useCallback(
    (spaceId: string) => {
      const s = spaces.find((sp) => sp.id === spaceId)
      if (!s) return false
      return (
        s.dailyQuestion.answers.some((a) => a.personId === 'me' || a.comments.some((c) => c.personId === 'me')) ||
        s.posts.some((p) => p.personId === 'me' || p.replies.some((r) => r.personId === 'me'))
      )
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

  // --- like → match → chat (the end-to-end story) ---

  /**
   * They like me back: promotes a pending like into a real conversation,
   * seeded with the space context and my like-message if I attached one.
   */
  const matchWith = useCallback(
    (personId: string) => {
      const pending = pendingRef.current.find((p) => p.personId === personId)
      const person = personById(personId)
      const space = pending?.spaceId ? spaces.find((s) => s.id === pending.spaceId) : undefined
      const chatId = `match-${personId}`

      setChats((prev) => {
        if (prev.some((c) => c.id === chatId)) return prev
        return [
          {
            id: chatId,
            personId,
            matchName: person.name,
            matchPhoto: portraitAvatar(person),
            spaceOriginLabel: space ? `${space.emoji} You matched in ${space.title}` : undefined,
            sharedSpaceId: space?.id,
            messages: pending?.message
              ? [{ id: nextId('msg'), sender: 'me', text: pending.message, kind: 'text' }]
              : [],
          },
          ...prev,
        ]
      })

      setPendingLikes((prev) => prev.filter((p) => p.personId !== personId))
      setNewMatch({ personId, spaceId: pending?.spaceId, chatId })
    },
    [spaces]
  )

  /**
   * A like on the actual profile. When it comes from a Space, they like you
   * back shortly after — the beat that turns a Space into a conversation.
   */
  const likeProfile = useCallback(
    (personId: string, personName: string, spaceId?: string, message?: string) => {
      setLikedProfiles((prev) => (prev.includes(personId) ? prev : [...prev, personId]))
      setPendingLikes((prev) =>
        prev.some((p) => p.personId === personId) ? prev : [...prev, { personId, spaceId, message }]
      )
      showToast(message ? `Like and message sent to ${personName} 💌` : `Like sent to ${personName} 💌`)

      if (spaceId) {
        setTimeout(() => matchWith(personId), RECIPROCAL_LIKE_MS)
      }
    },
    [showToast, matchWith]
  )

  const dismissNewMatch = useCallback(() => setNewMatch(null), [])

  // --- premium ---
  const unlockPremium = useCallback(() => {
    setPremiumUnlocked(true)
    showToast('Welcome to Hinge+ 🖤')
  }, [showToast])

  // --- chats ---
  const sendMessage = useCallback((chatId: string, text: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id !== chatId ? c : { ...c, messages: [...c.messages, { id: nextId('msg'), sender: 'me', text, kind: 'text' }] }
      )
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

      spaces,
      postsToday,
      toggleSpaceWaitlist,
      joinWaitlist,
      likePost,
      addPost,
      reportPost,

      spacesIntroSeen,
      markSpacesIntroSeen,

      engagedPeople,
      myAnswerBySpace,
      hasContributed,
      likeSpaceAnswer,
      commentOnSpaceAnswer,
      replyToPost,
      answerSpaceQuestion,

      pendingLikes,
      likedProfiles,
      likeProfile,
      matchWith,
      newMatch,
      dismissNewMatch,

      premiumUnlocked,
      unlockPremium,

      chats,
      sendMessage,

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
      spaces,
      postsToday,
      toggleSpaceWaitlist,
      joinWaitlist,
      likePost,
      addPost,
      reportPost,
      spacesIntroSeen,
      markSpacesIntroSeen,
      engagedPeople,
      myAnswerBySpace,
      hasContributed,
      likeSpaceAnswer,
      commentOnSpaceAnswer,
      replyToPost,
      answerSpaceQuestion,
      pendingLikes,
      likedProfiles,
      likeProfile,
      matchWith,
      newMatch,
      dismissNewMatch,
      premiumUnlocked,
      unlockPremium,
      chats,
      sendMessage,
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
