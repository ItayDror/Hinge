import { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar } from '../../components/Avatar'
import { AnswerComposerSheet } from './AnswerComposerSheet'
import { ReportSheet } from './ReportSheet'
import { ProfilePeekSheet } from './ProfilePeekSheet'
import { ThreeMatchSheet } from './ThreeMatchSheet'
import { isMatchable, personById, portraitAvatar } from '../../data/people'
import { placeholderPhoto } from '../../data/placeholders'
import { useAppState } from '../../state/AppStateContext'
import type { SpaceAnswer } from '../../data/mockData'

function answerAuthor(personId: string): { name: string; photoUrl: string } {
  if (personId === 'me') return { name: 'You', photoUrl: placeholderPhoto('me-avatar') }
  const p = personById(personId)
  return { name: p.name, photoUrl: portraitAvatar(p) }
}

/**
 * A Space is one question and one feed of answers to it. The question lives in
 * the header — it's the room's name — so nothing above the feed asks you to
 * answer. Contributing happens through the button at the bottom right.
 */
export function SpaceDetailScreen() {
  const {
    spaces,
    currentParams,
    pop,
    engagedPeople,
    likedProfiles,
    hasContributed,
    myAnswerBySpace,
    likeSpaceAnswer,
    commentOnSpaceAnswer,
    reportAnswer,
    answerSpaceQuestion,
  } = useAppState()

  const space = spaces.find((s) => s.id === currentParams?.spaceId)

  const [composerOpen, setComposerOpen] = useState(false)
  const [expandedAnswerId, setExpandedAnswerId] = useState<string | null>(null)
  const [commentDraft, setCommentDraft] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState<SpaceAnswer | null>(null)
  const [peek, setPeek] = useState<{ personId: string; answerId?: string; answerText?: string } | null>(null)
  const [matchSheetOpen, setMatchSheetOpen] = useState(false)
  const matchSheetShown = useRef(false)

  const myAnswer = space ? myAnswerBySpace[space.id] : undefined

  // The 3-match curation: top-liked answers from people you could match with
  // (Spaces are mixed-gender; matches follow your feed preference).
  const matchCandidates = useMemo<SpaceAnswer[]>(() => {
    if (!space) return []
    return space.answers
      .filter((a) => a.personId !== 'me' && isMatchable(a.personId))
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 3)
  }, [space])

  // Offer the 3 matches shortly after you answer — once.
  useEffect(() => {
    if (!myAnswer || matchCandidates.length === 0 || matchSheetShown.current) return
    matchSheetShown.current = true
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

  const contributed = hasContributed(space.id)
  const answers = space.answers.filter((a) => !a.reported)

  const openPerson = (personId: string, answerId?: string, answerText?: string) => {
    if (personId === 'me') return
    setPeek({ personId, answerId, answerText })
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* The question IS the room — it's the whole header, nothing else asks. */}
      <header className="flex shrink-0 items-start gap-2 px-3 pb-3 pt-1">
        <button type="button" onClick={pop} aria-label="Back" className="flex h-10 w-10 shrink-0 items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="min-w-0 flex-1 pt-1 text-center">
          <p className="font-serif text-[19px] leading-snug text-hinge-black">
            {space.emoji} {space.question}
          </p>
          <p className="mt-1 text-caption text-hinge-grey">
            {answers.length} answers · {space.memberCount.toLocaleString()} members · closes in {space.closesInDays}d
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="More options"
          className="flex h-10 w-10 shrink-0 items-center justify-center text-hinge-black"
        >
          •••
        </button>
      </header>

      {menuOpen && (
        <div className="absolute right-4 top-12 z-30 w-48 rounded-card bg-hinge-white p-1 shadow-card">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="block w-full rounded-btn px-3 py-2.5 text-left text-body text-hinge-black"
          >
            Report space
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              pop()
            }}
            className="block w-full rounded-btn px-3 py-2.5 text-left text-body text-hinge-warn"
          >
            Leave space
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-24">
        {/* Why profiles are locked — the gate, not a prompt to answer. */}
        {!contributed && (
          <p className="mb-3 text-center text-[11px] text-hinge-grey">
            🛡 You're browsing quietly — your profile stays private until you join in
          </p>
        )}

        {answers.length === 0 && <p className="mt-6 text-center text-body text-hinge-grey">No answers yet — be the first ✨</p>}

        <div className="flex flex-col gap-3">
          {answers.map((answer) => {
            const author = answerAuthor(answer.personId)
            const isMe = answer.personId === 'me'
            const engaged = engagedPeople.includes(answer.personId)
            const expanded = expandedAnswerId === answer.id
            const likeSent = likedProfiles.includes(answer.personId)
            return (
              <div key={answer.id} className="rounded-card border border-hinge-grey-light bg-hinge-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openPerson(answer.personId, answer.id, answer.text)}
                    className="flex items-center gap-2 text-left"
                    disabled={isMe}
                  >
                    <Avatar
                      name={author.name}
                      photoUrl={author.photoUrl}
                      size="sm"
                      ringColor={engaged && !isMe ? 'accent' : 'none'}
                    />
                    <div>
                      <p className="text-[14px] font-bold text-hinge-black">{author.name}</p>
                      {answer.timestampLabel && <p className="text-caption text-hinge-grey">{answer.timestampLabel}</p>}
                    </div>
                  </button>
                  {!isMe && likeSent ? (
                    <span className="rounded-pill bg-hinge-accent px-3.5 py-1.5 text-[12px] font-bold text-hinge-white">
                      Liked ✓
                    </span>
                  ) : !isMe && engaged && contributed ? (
                    <button
                      type="button"
                      onClick={() => openPerson(answer.personId, answer.id, answer.text)}
                      className="rounded-pill bg-hinge-accent-soft px-3.5 py-1.5 text-[12px] font-bold text-hinge-accent"
                    >
                      View profile
                    </button>
                  ) : (
                    !isMe && (
                      <button
                        type="button"
                        onClick={() => setReportTarget(answer)}
                        aria-label="More"
                        className="px-1 text-hinge-grey"
                      >
                        •••
                      </button>
                    )
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

      {/* Once you've answered, the same button becomes the way back to your matches. */}
      {myAnswer ? (
        <button
          type="button"
          onClick={() => setMatchSheetOpen(true)}
          className="absolute bottom-5 right-5 flex h-14 items-center gap-1.5 rounded-pill bg-hinge-accent px-5 text-[14px] font-bold text-hinge-white shadow-card"
        >
          ✨ Your matches
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setComposerOpen(true)}
          className="absolute bottom-5 right-5 flex h-14 items-center gap-2 rounded-pill bg-hinge-black px-5 text-[14px] font-bold text-hinge-white shadow-card"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Answer
        </button>
      )}

      <AnswerComposerSheet
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        question={space.question}
        onSubmit={(text) => answerSpaceQuestion(space.id, text)}
      />

      <ReportSheet
        open={!!reportTarget}
        onClose={() => setReportTarget(null)}
        onSubmit={(reason) => reportTarget && reportAnswer(space.id, reportTarget.id, reason)}
      />

      {peek && (
        <ProfilePeekSheet
          personId={peek.personId}
          space={space}
          onClose={() => setPeek(null)}
          contextAnswerId={peek.answerId}
          contextAnswerText={peek.answerText}
          onAnswer={() => setComposerOpen(true)}
        />
      )}

      <ThreeMatchSheet
        open={matchSheetOpen}
        onClose={() => setMatchSheetOpen(false)}
        spaceQuestion={space.question}
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
