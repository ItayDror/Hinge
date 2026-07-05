import { useEffect } from 'react'
import { BottomSheet } from '../../components/BottomSheet'
import { AccentButton } from '../../components/AccentButton'
import { placeholderPhoto } from '../../data/placeholders'
import { useAppState } from '../../state/AppStateContext'
import type { SpaceData, SpacePost } from '../../data/mockData'

interface BlindModeSheetProps {
  space: SpaceData
  post: SpacePost
  onClose: () => void
}

export function BlindModeSheet({ space, post, onClose }: BlindModeSheetProps) {
  const key = `${space.id}:${post.id}`
  const { blindModeBySpacePost, revealBlindMode, advanceBlindMode, matchFromBlindMode, push } = useAppState()
  const state = blindModeBySpacePost[key]

  useEffect(() => {
    if (state !== 'waiting') return
    const t = setTimeout(() => advanceBlindMode(key), 4500)
    return () => clearTimeout(t)
  }, [state, key, advanceBlindMode])

  if (!state) return null

  const myPhoto = placeholderPhoto('me-avatar')
  const theirPhoto = placeholderPhoto(post.revealedPhotoSeed ?? post.id)
  const theirName = post.revealedName ?? post.authorHandle
  const initial = theirName.charAt(0).toUpperCase()

  const handleSendMessage = () => {
    const chatId = matchFromBlindMode(space.id, post.id)
    onClose()
    push({ screen: 'chat-thread', params: { chatId } })
  }

  return (
    <BottomSheet open onClose={onClose}>
      {state === 'matched' ? (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex items-center -space-x-4">
            <img
              src={myPhoto}
              alt="You"
              className="h-24 w-24 rounded-pill border-4 border-hinge-white object-cover shadow-card transition-all duration-500"
            />
            <img
              src={theirPhoto}
              alt={theirName}
              className="h-24 w-24 rounded-pill border-4 border-hinge-white object-cover shadow-card transition-all duration-500"
            />
          </div>
          <p className="text-[22px] font-bold text-hinge-black">It's a match!</p>
          <p className="text-body text-hinge-grey">
            You and {theirName} showed up for the same thing in {space.title}.
          </p>
          <AccentButton label="Send a message" onClick={handleSendMessage} fullWidth />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <p className="text-[18px] font-bold text-hinge-black">
            You and {post.authorHandle} liked each other's posts in {space.title}
          </p>
          <p className="text-body text-hinge-grey">
            Want to see more? Their photo is blurred until you both choose to reveal it.
          </p>
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-pill">
            <img
              src={theirPhoto}
              alt="blurred profile"
              className="h-full w-full object-cover transition-all duration-500"
              style={{ filter: state === 'waiting' ? 'blur(20px)' : 'blur(20px)' }}
            />
            <span className="absolute text-[28px] font-bold text-hinge-white drop-shadow">{initial}.</span>
          </div>
          {state === 'pending' ? (
            <div className="flex w-full flex-col gap-2">
              <AccentButton label="Reveal my side" onClick={() => revealBlindMode(key)} fullWidth />
              <button type="button" onClick={onClose} className="min-h-11 text-body text-hinge-grey">
                Not now
              </button>
            </div>
          ) : (
            <p className="text-caption font-semibold text-hinge-grey">Waiting for them to reveal too…</p>
          )}
        </div>
      )}
    </BottomSheet>
  )
}
