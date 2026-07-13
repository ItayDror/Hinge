import { useState } from 'react'
import { Avatar } from '../../components/Avatar'
import { PostComposerSheet } from './PostComposerSheet'
import { ReportSheet } from './ReportSheet'
import { BlindModeSheet } from './BlindModeSheet'
import { ProfilePeekSheet } from './ProfilePeekSheet'
import { personById, portraitAvatar } from '../../data/people'
import { placeholderPhoto } from '../../data/placeholders'
import { useAppState } from '../../state/AppStateContext'
import type { SpacePost } from '../../data/mockData'

function postAuthor(personId: string): { name: string; photoUrl: string } {
  if (personId === 'me') return { name: 'You', photoUrl: placeholderPhoto('me-avatar') }
  const p = personById(personId)
  return { name: p.name, photoUrl: portraitAvatar(p) }
}

export function SpaceDetailScreen() {
  const { spaces, currentParams, pop, push, postsToday, addPost, likePost, reportPost, openBlindMode } = useAppState()
  const space = spaces.find((s) => s.id === currentParams?.spaceId)

  const [composerOpen, setComposerOpen] = useState(false)
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState<SpacePost | null>(null)
  const [blindModePost, setBlindModePost] = useState<SpacePost | null>(null)
  const [peekPersonId, setPeekPersonId] = useState<string | null>(null)

  if (!space) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-body text-hinge-grey">Space not found.</p>
      </div>
    )
  }

  const visiblePosts = [...space.posts]
    .filter((p) => !p.reported)
    .sort((a, b) => b.likeCount - a.likeCount)

  const handleLike = (post: SpacePost) => {
    likePost(space.id, post.id)
    if (post.isMutualSeed && !post.liked) {
      openBlindMode(space.id, post.id)
      setBlindModePost(post)
    }
  }

  const answerCount = space.dailyQuestion.answers.length
  const answerAvatars = space.dailyQuestion.answers.slice(0, 3).map((a) => postAuthor(a.personId))

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center justify-between gap-3 px-5 pb-2 pt-1">
        <button type="button" onClick={pop} aria-label="Back" className="flex h-10 w-10 items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-[17px] font-bold text-hinge-black">
            {space.title} {space.emoji}
          </p>
          <p className="text-caption text-hinge-grey">
            {space.memberCount.toLocaleString()} members · closes in {space.closesInDays}d
            {space.endingLabel ? ` · ${space.endingLabel}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="More options"
          className="flex h-10 w-10 items-center justify-center text-hinge-black"
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

      {/* Pinned Daily Question banner — always visible above the feed */}
      <div className="shrink-0 px-5 pb-3">
        <button
          type="button"
          onClick={() => push({ screen: 'space-question', params: { spaceId: space.id } })}
          className="w-full rounded-card bg-hinge-accent-soft p-4 text-left shadow-card"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-hinge-accent text-[22px] font-black text-hinge-white">
              ?
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-hinge-accent">Today's question</p>
              <p className="truncate text-[15px] font-semibold text-hinge-black">{space.dailyQuestion.question.text}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {answerAvatars.map((a, i) => (
                  <span key={i} className="rounded-pill ring-2 ring-hinge-accent-soft">
                    <Avatar name={a.name} photoUrl={a.photoUrl} size="sm" />
                  </span>
                ))}
              </div>
              <span className="text-caption font-semibold text-hinge-grey">{answerCount} answers</span>
            </div>
            <span className="text-caption font-bold text-hinge-accent">Answer & meet people →</span>
          </div>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-24">
        <div className="flex flex-col gap-3">
          {visiblePosts.map((post) => {
            const author = postAuthor(post.personId)
            return (
              <div key={post.id} className="rounded-card bg-hinge-grey-bg p-4">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => post.personId !== 'me' && setPeekPersonId(post.personId)}
                    className="flex items-center gap-2 text-left"
                  >
                    <Avatar name={author.name} photoUrl={author.photoUrl} size="sm" />
                    <div>
                      <p className="text-[14px] font-bold text-hinge-black">{author.name}</p>
                      <p className="text-caption text-hinge-grey">{post.timestampLabel}</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportTarget(post)}
                    aria-label="More"
                    className="px-1 text-hinge-grey"
                  >
                    •••
                  </button>
                </div>
                <p className="mt-2 text-body text-hinge-black">{post.text}</p>
                <div className="mt-3 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleLike(post)}
                    className="flex items-center gap-1 text-caption font-semibold text-hinge-grey"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={post.liked ? '#E15B3F' : 'none'}>
                      <path
                        d="M12 20.5s-7.5-4.7-10-9.4C.6 8 2 4.5 5.4 3.6 8 2.9 10.4 4 12 6.3 13.6 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.1c-2.5 4.7-10 9.4-10 9.4Z"
                        stroke={post.liked ? '#E15B3F' : 'currentColor'}
                        strokeWidth="1.6"
                      />
                    </svg>
                    {post.likeCount}
                  </button>
                  {post.replyCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpandedPostId((id) => (id === post.id ? null : post.id))}
                      className="text-caption font-semibold text-hinge-grey"
                    >
                      {post.replyCount} {post.replyCount === 1 ? 'reply' : 'replies'}
                    </button>
                  )}
                </div>
                {expandedPostId === post.id && post.replies.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2 border-l-2 border-hinge-grey-light pl-3">
                    {post.replies.map((r) => {
                      const replier = postAuthor(r.personId)
                      return (
                        <div key={r.id}>
                          <p className="text-[13px] font-bold text-hinge-black">{replier.name}</p>
                          <p className="text-caption text-hinge-black">{r.text}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setComposerOpen(true)}
        aria-label="New post"
        className="absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-pill bg-hinge-black text-hinge-white shadow-card"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>

      <PostComposerSheet
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        spaceTitle={space.title}
        postsToday={postsToday[space.id] ?? 0}
        onSubmit={(text) => addPost(space.id, text)}
      />

      <ReportSheet
        open={!!reportTarget}
        onClose={() => setReportTarget(null)}
        onSubmit={(reason) => reportTarget && reportPost(space.id, reportTarget.id, reason)}
      />

      {blindModePost && <BlindModeSheet space={space} post={blindModePost} onClose={() => setBlindModePost(null)} />}
      <ProfilePeekSheet personId={peekPersonId} onClose={() => setPeekPersonId(null)} />
    </div>
  )
}
