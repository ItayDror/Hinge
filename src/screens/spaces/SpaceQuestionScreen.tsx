import { useEffect, useMemo, useState } from 'react'
import { Avatar } from '../../components/Avatar'
import { ProfilePeekSheet } from './ProfilePeekSheet'
import { ThreeMatchSheet } from './ThreeMatchSheet'
import { personById, portraitAvatar } from '../../data/people'
import { placeholderPhoto } from '../../data/placeholders'
import type { SpaceAnswer } from '../../data/mockData'
import { useAppState } from '../../state/AppStateContext'

function answerAuthor(personId: string): { name: string; photoUrl: string } {
  if (personId === 'me') return { name: 'You', photoUrl: placeholderPhoto('me-avatar') }
  const p = personById(personId)
  return { name: p.name, photoUrl: portraitAvatar(p) }
}

export function SpaceQuestionScreen() {
  const {
    spaces,
    currentParams,
    pop,
    engagedPeople,
    hasContributed,
    myAnswerBySpace,
    likeSpaceAnswer,
    commentOnSpaceAnswer,
    answerSpaceQuestion,
  } = useAppState()

  const space = spaces.find((s) => s.id === currentParams?.spaceId)

  const [draft, setDraft] = useState('')
  const [peek, setPeek] = useState<{ personId: string; answerId?: string; answerText?: string } | null>(null)
  const [expandedAnswerId, setExpandedAnswerId] = useState<string | null>(null)
  const [commentDraft, setCommentDraft] = useState('')
  const [matchSheetOpen, setMatchSheetOpen] = useState(false)

  const myAnswer = space ? myAnswerBySpace[space.id] : undefined
  const contributed = space ? hasContributed(space.id) : false

  // The 3-match curation: top-liked answers by other people.
  const matchCandidates = useMemo<SpaceAnswer[]>(() => {
    if (!space) return []
    return space.dailyQuestion.answers
      .filter((a) => a.personId !== 'me')
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 3)
  }, [space])

  // Offer the 3 matches shortly after answering (skip when there's no one
  // to suggest yet, e.g. a freshly generated space with zero answers).
  useEffect(() => {
    if (!myAnswer || matchCandidates.length === 0) return
    const t = setTimeout(() => setMatchSheetOpen(true), 1500)
    return () => clearTimeout(t)
  }, [myAnswer, matchCandidates.length])

  if (!space) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-body text-hinge-grey">Space not found.</p>
      </div>
    )
  }

  const openPerson = (personId: string, answerId?: string, answerText?: string) => {
    if (personId === 'me') return
    setPeek({ personId, answerId, answerText })
  }

  const handleSubmit = () => {
    if (!draft.trim()) return
    answerSpaceQuestion(space.id, draft.trim())
    setDraft('')
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center gap-2 px-3 pb-2 pt-1">
        <button type="button" onClick={pop} aria-label="Back" className="flex h-10 w-10 items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-[16px] font-bold text-hinge-black">Daily Question</p>
          <p className="text-caption text-hinge-grey">
            {space.title} {space.emoji} · closes in {space.closesInDays}d
          </p>
        </div>
        <span className="w-10" />
      </header>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        {/* Question card — the Battle Card motif, permanently face-up here */}
        <div className="rounded-card bg-hinge-white p-5 shadow-card">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-hinge-accent">🎴 Today in {space.title}</p>
          <p className="mt-2.5 font-serif text-serif-answer text-hinge-black">{space.dailyQuestion.question.text}</p>
          <p className="mt-3 text-caption text-hinge-grey">
            {space.dailyQuestion.answers.length} answers · like or comment on someone to open their profile
          </p>
        </div>

        {/* Contribution nudge — profiles stay locked space-wide until you join in */}
        {!contributed && (
          <div className="mt-3 rounded-pill bg-hinge-accent-soft px-4 py-2.5 text-center text-[13px] font-semibold text-hinge-accent">
            You're browsing quietly — answer below to unlock profiles 💬
          </div>
        )}

        {/* My answer composer / suggested-matches re-entry chip */}
        {myAnswer ? (
          <button
            type="button"
            onClick={() => setMatchSheetOpen(true)}
            className="mt-3 w-full rounded-pill bg-hinge-accent-soft px-4 py-2.5 text-[13px] font-bold text-hinge-accent"
          >
            ✨ Your suggested matches
          </button>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add your answer..."
              className="min-h-11 flex-1 rounded-pill bg-hinge-grey-bg px-4 text-body text-hinge-black placeholder:text-hinge-grey focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!draft.trim()}
              aria-label="Submit answer"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-hinge-accent text-hinge-white disabled:opacity-30"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="m5 12 14-7-7 14-2-5-5-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Answers feed */}
        {space.dailyQuestion.answers.length === 0 && (
          <p className="mt-6 text-center text-body text-hinge-grey">No answers yet — be the first ✨</p>
        )}
        <div className="mt-4 flex flex-col gap-3">
          {space.dailyQuestion.answers.map((answer) => {
            const author = answerAuthor(answer.personId)
            const isMe = answer.personId === 'me'
            const engaged = engagedPeople.includes(answer.personId)
            const expanded = expandedAnswerId === answer.id
            return (
              <div key={answer.id} className="rounded-card border border-hinge-grey-light bg-hinge-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openPerson(answer.personId, answer.id, answer.text)}
                    className="flex items-center gap-2 text-left"
                    disabled={isMe}
                  >
                    <Avatar name={author.name} photoUrl={author.photoUrl} size="sm" ringColor={engaged && !isMe ? 'accent' : 'none'} />
                    <p className="text-[14px] font-bold text-hinge-black">{author.name}</p>
                  </button>
                  {!isMe && engaged && contributed && (
                    <button
                      type="button"
                      onClick={() => openPerson(answer.personId, answer.id, answer.text)}
                      className="rounded-pill bg-hinge-accent-soft px-3.5 py-1.5 text-[12px] font-bold text-hinge-accent"
                    >
                      View profile
                    </button>
                  )}
                </div>
                <p className="mt-2 text-body text-hinge-black">{answer.text}</p>
                <div className="mt-3 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => likeSpaceAnswer(space.id, answer.id)}
                    className="flex items-center gap-1 text-caption font-semibold text-hinge-grey"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={answer.likedByMe ? 'var(--hinge-accent)' : 'none'}>
                      <path
                        d="M12 20.5s-7.5-4.7-10-9.4C.6 8 2 4.5 5.4 3.6 8 2.9 10.4 4 12 6.3 13.6 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.1c-2.5 4.7-10 9.4-10 9.4Z"
                        stroke={answer.likedByMe ? 'var(--hinge-accent)' : 'currentColor'}
                        strokeWidth="1.6"
                      />
                    </svg>
                    {answer.likeCount}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedAnswerId((id) => (id === answer.id ? null : answer.id))
                      setCommentDraft('')
                    }}
                    className="text-caption font-semibold text-hinge-grey"
                  >
                    {answer.comments.length === 0
                      ? 'Comment'
                      : `${answer.comments.length} ${answer.comments.length === 1 ? 'comment' : 'comments'}`}
                  </button>
                </div>
                {expanded && (
                  <div className="mt-3 flex flex-col gap-2 border-l-2 border-hinge-grey-light pl-3">
                    {answer.comments.map((c) => {
                      const commenter = answerAuthor(c.personId)
                      return (
                        <div key={c.id}>
                          <button
                            type="button"
                            onClick={() => openPerson(c.personId)}
                            disabled={c.personId === 'me'}
                            className="text-[13px] font-bold text-hinge-black"
                          >
                            {commenter.name}
                          </button>
                          <p className="text-caption text-hinge-black">{c.text}</p>
                        </div>
                      )
                    })}
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        value={commentDraft}
                        onChange={(e) => setCommentDraft(e.target.value)}
                        placeholder="Add a comment..."
                        className="min-h-9 flex-1 rounded-pill bg-hinge-section px-3 text-caption text-hinge-black placeholder:text-hinge-grey focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={!commentDraft.trim()}
                        onClick={() => {
                          commentOnSpaceAnswer(space.id, answer.id, commentDraft.trim())
                          setCommentDraft('')
                        }}
                        className="text-caption font-bold text-hinge-accent disabled:opacity-30"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {peek && (
        <ProfilePeekSheet
          personId={peek.personId}
          space={space}
          onClose={() => setPeek(null)}
          contextAnswerId={peek.answerId}
          contextAnswerText={peek.answerText}
        />
      )}
      <ThreeMatchSheet
        open={matchSheetOpen}
        onClose={() => setMatchSheetOpen(false)}
        spaceTitle={space.title}
        candidates={matchCandidates}
        spaceId={space.id}
        onOpenPerson={(personId, answerId, answerText) => {
          setMatchSheetOpen(false)
          openPerson(personId, answerId, answerText)
        }}
      />
    </div>
  )
}
