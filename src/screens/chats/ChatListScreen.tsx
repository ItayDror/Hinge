import { useState } from 'react'
import { useAppState } from '../../state/AppStateContext'

// Plum heart-in-circle badge shown next to match names in the real app.
const MatchHeartBadge = () => (
  <span className="inline-flex h-6 w-6 items-center justify-center rounded-pill border-[1.5px] border-hinge-accent/40 bg-hinge-white">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--hinge-accent)">
      <path d="M12 20.5s-7.5-4.7-10-9.4C.6 8 2 4.5 5.4 3.6 8 2.9 10.4 4 12 6.3 13.6 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.1c-2.5 4.7-10 9.4-10 9.4Z" />
    </svg>
  </span>
)

export function ChatListScreen() {
  const { chats, push, spaces } = useAppState()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-1">
      <h1 className="text-screen-title text-hinge-black">Matches</h1>

      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="mt-5 flex w-full items-center justify-between border-b border-hinge-grey-light pb-2.5"
      >
        <span className="text-[15px] font-bold text-hinge-black">Your turn ({chats.length})</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className={collapsed ? 'rotate-180 transition-transform' : 'transition-transform'}
        >
          <path d="m6 15 6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {!collapsed && (
        <div className="flex flex-col">
          {chats.map((chat) => {
            const lastMessage = chat.messages[chat.messages.length - 1]
            const originSpace = chat.spaceOriginLabel || chat.sharedSpaceId
              ? spaces.find((s) => s.id === chat.sharedSpaceId || (chat.spaceOriginLabel ?? '').includes(s.title))
              : undefined
            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => push({ screen: 'chat-thread', params: { chatId: chat.id } })}
                className="flex items-center gap-4 border-b border-hinge-grey-light py-3.5 text-left last:border-b-0"
              >
                <span className="relative inline-flex shrink-0">
                  <span className="h-16 w-16 overflow-hidden rounded-pill">
                    <img src={chat.matchPhoto.replace('w=150&h=150', 'w=200&h=200')} alt={chat.matchName} className="h-full w-full object-cover" />
                  </span>
                  {originSpace && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-pill bg-hinge-white text-[12px] shadow-card">
                      {originSpace.emoji}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[18px] font-bold text-hinge-black">
                    {chat.matchName} <MatchHeartBadge />
                  </p>
                  <p className="mt-0.5 truncate text-[15px] text-[#9C9A98]">
                    {lastMessage ? lastMessage.text : 'Say hello 👋'}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
