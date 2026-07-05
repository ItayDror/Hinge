import { Avatar } from '../../components/Avatar'
import { useAppState } from '../../state/AppStateContext'

export function ChatListScreen() {
  const { chats, push } = useAppState()

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-1">
      <h1 className="text-screen-title text-hinge-black">Chats</h1>
      <div className="mt-4 flex flex-col">
        {chats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1]
          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => push({ screen: 'chat-thread', params: { chatId: chat.id } })}
              className="flex items-center gap-3 border-b border-hinge-grey-light py-3 text-left last:border-b-0"
            >
              <span className="relative inline-flex">
                <Avatar name={chat.matchName} photoUrl={chat.matchPhoto} size="lg" />
                {chat.spaceOriginLabel && (
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-pill bg-hinge-white text-[11px] shadow-card">
                    🏀
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-bold text-hinge-black">{chat.matchName}</p>
                <p className="truncate text-caption text-hinge-grey">{lastMessage ? lastMessage.text : 'Say hello 👋'}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
